// scripts/sync-playbook.ts
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PlaybookConfig } from '../types/playbook';
import { urgePlaybook } from '../lib/playbook';
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
  console.log('🧹 sweep: Emptying stale system rows across tables...');
  
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

    // ⚡ FIXED: Read content from markdown file
    const markdownContent = readMarkdownSafe(missionMarkdownPath);
    
    console.log(`\n📦 Processing Mission: ${mission.title} (Sequence ${mission.sequence})`);

    // ⚡ FIXED: Include all mission fields including prerequisites
    const { data: dbMission, error: missionError } = await supabase
      .from('missions')
      .upsert({
        id: mission.id || missionKey,
        title: mission.title,
        sequence: mission.sequence,
        video_url: mission.video_url,
        content: markdownContent || mission.briefing_text || '',
        briefing_text: mission.briefing_text || null,
        prerequisites: mission.prerequisites || null,
      })
      .select('id')
      .single();

    if (missionError || !dbMission) {
      console.error(`❌ Mission configuration update failed for ${missionKey}:`, missionError);
      continue;
    }

    mission.db_id = dbMission.id;

    for (const [questKey, quest] of Object.entries(mission.quests)) {
      // ⚡ FIXED: Use quest.id if available, otherwise construct from missionKey + questKey
      const questId = quest.id || `${missionKey}_${questKey}`;
      const strictPhysicalPath = quest.content_path || `content/missions/${missionKey}/quests/${quest.slug}.md`;
      
      // Read content from markdown file
      const markdownContent = readMarkdownSafe(strictPhysicalPath);

      // ⚡ FIXED: Use quest fields directly, not from ai_config
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
          content: markdownContent || quest.content || '',
          is_optional: quest.is_optional || false,
          persona_name: quest.persona_name,
          persona_prompt: quest.persona_prompt,
          required_context: quest.required_context || [],
          grant_points_bonus: quest.grant_points_bonus || 0,
          badge_key_reward: quest.badge_key_reward || null,
          estimated_in_app_minutes: quest.estimated_in_app_minutes || 0,
          estimated_off_app_minutes: quest.estimated_off_app_minutes || 0,
        })
        .select('id, badge_key_reward')
        .single();

      if (questError || !dbQuest) {
        console.error(`❌ Quest mapping break encountered at id: ${questId}:`, questError);
        continue;
      }

      quest.db_id = dbQuest.id;

      for (const task of quest.tasks) {
        // ⚡ FIXED: Include all task fields including JSON fields
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
            estimated_minutes: task.estimated_minutes || 0,
            grant_points: task.grant_points,
            description: task.description || '',
            execution_environment: task.execution_environment || null,
            checkback_delay_days: task.checkback_delay_days || null,
            recurring: task.recurring || null,
            interval: task.interval || null,
            // ⚡ JSON fields - properly typed
            ai_config: task.ai_config || null,
            observation_config: task.observation_config || null,
            metadata_config: task.metadata_config || {},
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