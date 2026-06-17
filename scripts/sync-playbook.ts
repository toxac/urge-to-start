import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { PlaybookConfig } from '../types/playbook';
import { urgePlaybook } from '../lib/playbook';

// Initialize env variables from Next.js local setup
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.NEXT_SUPABASE_SECRET_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('CRITICAL ERROR: Missing Supabase environment credentials in your variables ledger.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Helper function to safely read pure content markdown text from file tree locations without throwing execution faults
 */
function readMarkdownSafe(filePath: string): string {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8');
    }
    console.warn(`⚠️ File trace anomaly: File missing at location -> ${filePath}`);
    return '';
  } catch (error) {
    console.error(`❌ IO fault encountered reading layout path: ${filePath}`, error);
    return '';
  }
}

/**
 * Core Playbook Sync Engine Execution Block
 */
export async function syncPlaybookToDatabase(config: PlaybookConfig) {
  console.log('🚀 Synchronizing content matrices with application tables...');

  for (const [missionKey, mission] of Object.entries(config)) {
    const missionFolderPath = `content/missions/${missionKey}`;
    const missionMarkdownPath = `${missionFolderPath}/mission.md`;
    
    // Ingest pure markdown text content from local disk storage coordinates
    mission.briefing_markdown = readMarkdownSafe(missionMarkdownPath);
    
    console.log(`\n📦 Processing target: ${mission.title} (Sequence ${mission.sequence})`);

    // 1. Upsert Mission Level Configuration parameters
    const { data: dbMission, error: missionError } = await supabase
      .from('missions')
      .upsert({
        id: missionKey,
        title: mission.title,
        sequence: mission.sequence,
        video_url: mission.video_url,
        // Pushes the full mission markdown to the unified 'content' column (falling back to the brief description text)
        content: mission.briefing_markdown || mission.briefing_text 
      })
      .select('id')
      .single();

    if (missionError || !dbMission) {
      console.error(`❌ Mission configuration update aborted for ${missionKey}:`, missionError);
      continue;
    }

    mission.db_id = dbMission.id;

    // 2. Loop Through Nested Quest Dictionary Elements
    for (const [questKey, quest] of Object.entries(mission.quests)) {
      const questId = `${missionKey}_${questKey}`;
      const strictPhysicalPath = `content/missions/${missionKey}/quests/${quest.slug}.md`;
      
      quest.content_path = strictPhysicalPath;
      quest.content_markdown = readMarkdownSafe(quest.content_path);

      let badgeRewardKey: string | undefined = quest.ai_config.on_success.badge_key;

      const { data: dbQuest, error: questError } = await supabase
        .from('quests')
        .upsert({
          id: questId,
          mission_id: mission.db_id,
          slug: quest.slug,
          title: quest.title,
          subtitle: quest.subtitle,
          sequence: quest.sequence,
          // Pushes the full quest markdown to the unified 'content' column
          content: quest.content_markdown || quest.subtitle, 
          is_optional: quest.is_optional || false,
          persona_name: quest.ai_config.persona_name,
          persona_prompt: quest.ai_config.persona_prompt,
          required_context: quest.ai_config.required_context,
          grant_points_bonus: quest.ai_config.on_success.grant_points,
          badge_key_reward: badgeRewardKey || null
        })
        .select('id, badge_key_reward')
        .single();

      if (questError || !dbQuest) {
        console.error(`❌ Quest mapping break encountered at id: ${questId}:`, questError);
        continue;
      }

      quest.db_id = dbQuest.id;
      if (dbQuest.badge_key_reward) {
        quest.ai_config.on_success.badge_db_id = dbQuest.badge_key_reward;
      }

      // 3. Loop and Process Nested Task Objects Ordered Lists arrays
      for (const task of quest.tasks) {
        const { data: dbTask, error: taskError } = await supabase
          .from('tasks')
          .upsert({
            id: task.id,
            mission_id: mission.db_id,
            quest_id: quest.db_id,
            title: task.title,
            type: task.type,
            component_key: task.component_key,
            sequence: task.sequence,
            grant_points: task.grant_points,
            metadata_config: task.metadata_config || {}
          })
          .select('id')
          .single();

        if (taskError || !dbTask) {
          console.error(`❌ Task tracking record insert failed at element ${task.id}:`, taskError);
          continue;
        }

        task.db_id = dbTask.id;
      }
      console.log(`   ✅ Quest synchronized successfully: ${quest.title} with [${quest.tasks.length}] sub-tasks.`);
    }
  }

  console.log('\n🎉 Playbook synchronization script complete. Database tables and runtime configurations are perfectly aligned.');
  return config;
}

// =========================================================================
// EXECUTIVE ACTION RUNNER FOR CLI RUNS (`npm run sync-playbook`)
// =========================================================================
(async () => {
  try {
    const updatedConfig = await syncPlaybookToDatabase(urgePlaybook);
    const targetOutputPath = path.resolve(process.cwd(), 'lib/playbook_synced.json');
    fs.writeFileSync(targetOutputPath, JSON.stringify(updatedConfig, null, 2), 'utf8');
    console.log(`💾 Synced layout map cache successfully written to disk at: ${targetOutputPath}`);
    process.exit(0);
  } catch (error) {
    console.error('💥 CRITICAL RUNTIME EXCEPTION: Sync engine aborted unexpectedly:', error);
    process.exit(1);
  }
})();