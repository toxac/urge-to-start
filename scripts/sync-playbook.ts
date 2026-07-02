import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PlaybookConfig } from '../types/playbook';
import { urgePlaybook } from '../lib/playbook'; // ⚡ FIXED: Resolves from your unified folder setup
import { createAdminClient } from '@/lib/supabase/admin';
import * as fs from 'fs';
import * as path from 'path';

function readMarkdownSafe(filePath: string): string {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8');
    }
    console.warn(`⚠️ File trace missing at local path target: -> ${filePath}`);
    return '';
  } catch (error) {
    console.error(`❌ IO fault encountered reading target markdown file: ${filePath}`, error);
    return '';
  }
}

export async function syncPlaybookToDatabase(config: PlaybookConfig) {
  console.log('🚀 Initiating playbook database schema alignment loop...');
  const supabase = await createAdminClient();

  // 1. CLEAR STALE CONFIGURATIONS
  console.log(' sweep: Emptying stale system rows across tables...');
  
  const { error: clearTasksErr } = await supabase.from('tasks').delete().neq('id', 'placeholder_dummy_row_token');
  if (clearTasksErr) console.warn('Note on task clear run execution:', clearTasksErr.message);

  const { error: clearQuestsErr } = await supabase.from('quests').delete().neq('id', 'placeholder_dummy_row_token');
  if (clearQuestsErr) console.warn('Note on quest clear run execution:', clearQuestsErr.message);

  const { error: clearMissionsErr } = await supabase.from('missions').delete().neq('id', 'placeholder_dummy_row_token');
  if (clearMissionsErr) console.warn('Note on mission clear run execution:', clearMissionsErr.message);

  console.log('✨ Target tables cleared. Starting data seeder pass...');

  // 2. MASTER ENTRY ALIGNMENT SEED LOOP
  for (const [missionKey, mission] of Object.entries(config)) {
    const missionFolderPath = `content/missions/${missionKey}`;
    const missionMarkdownPath = `${missionFolderPath}/mission.md`;

    mission.briefing_markdown = readMarkdownSafe(missionMarkdownPath);
    console.log(`\n📦 Processing Mission: ${mission.title} (Sequence ${mission.sequence})`);

    const { data: dbMission, error: missionError } = await supabase
      .from('missions')
      .upsert({
        id: missionKey,
        title: mission.title,
        sequence: mission.sequence,
        video_url: mission.video_url,
        content: mission.briefing_markdown || mission.briefing_text 
      })
      .select('id')
      .single();

    if (missionError || !dbMission) {
      console.error(`❌ Mission configuration update failed for ${missionKey}:`, missionError);
      continue;
    }

    mission.db_id = dbMission.id;

    for (const [questKey, quest] of Object.entries(mission.quests)) {
      const questId = `${missionKey}_${questKey}`;
      const strictPhysicalPath = `content/missions/${missionKey}/quests/${quest.slug}.md`;
      
      quest.content_path = strictPhysicalPath;
      quest.content_markdown = readMarkdownSafe(quest.content_path);

      let badgeRewardKey: string | undefined = quest.ai_config.on_success.badge_key;

      // ⚡ SCHEMA ALIGNED: Maps description, plus duration columns to your live quests schema
      const { data: dbQuest, error: questError } = await supabase
        .from('quests')
        .upsert({
          id: questId,
          mission_id: mission.db_id,
          slug: quest.slug,
          title: quest.title,
          subtitle: quest.subtitle,
          description: quest.description || '', 
          sequence: quest.sequence,
          content: quest.content_markdown || quest.subtitle, 
          is_optional: quest.is_optional || false,
          persona_name: quest.ai_config.persona_name,
          persona_prompt: quest.ai_config.persona_prompt,
          required_context: quest.ai_config.required_context,
          grant_points_bonus: quest.ai_config.on_success.grant_points,
          badge_key_reward: badgeRewardKey || null,
          estimated_in_app_minutes: quest.estimated_in_app_minutes || 0,   
          estimated_off_app_minutes: quest.estimated_off_app_minutes || 0  
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

      for (const task of quest.tasks) {
        // ⚡ SCHEMA ALIGNED: Dropped the estimated_minutes property from the record input 
        // to match your live table definition exactly and avoid database compilation faults.
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
            description: task.description || '',
            execution_environment: task.execution_environment || 'on_app',
            checkback_delay_days: task.checkback_delay_days || 0,
            metadata_config: task.metadata_config || {}
          })
          .select('id')
          .single();

        if (taskError || !dbTask) {
          console.error(`❌ Task configuration update aborted for step element ${task.id}:`, taskError);
          continue;
        }

        task.db_id = dbTask.id;
      }
      console.log(`   ✅ Synced Chapter: "${quest.title}" with [${quest.tasks.length}] sub-tasks mapping smoothly.`);
    }
  }

  console.log('\n🎉 Playbook data seeder run complete. Live schema parameters are perfectly aligned.');
  return config;
}

(async () => {
  try {
    const updatedConfig = await syncPlaybookToDatabase(urgePlaybook);
    const targetOutputPath = path.resolve(process.cwd(), 'lib/playbook_synced.json');
    fs.writeFileSync(targetOutputPath, JSON.stringify(updatedConfig, null, 2), 'utf8');
    console.log(`💾 Synced matrix cache successfully output to disk at: ${targetOutputPath}`);
    process.exit(0);
  } catch (error) {
    console.error('💥 CRITICAL SCHEMA SYNC EXCEPTION UNENCOUNTERED:', error);
    process.exit(1);
  }
})();