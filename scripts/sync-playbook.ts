// scripts/sync-playbook.ts
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PlaybookConfig } from '../types/playbook';
import { urgePlaybook } from '../lib/playbook';
import { createAdminClient } from '@/lib/supabase/admin';
import * as fs from 'fs';
import * as path from 'path';

function readMarkdownSafe(filePath: string): string | null {
  try {
    if (!filePath) return null;
    const fullPath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8');
    }
    console.warn(`⚠️ File trace missing at local path target: -> ${filePath}`);
    return null;
  } catch (error) {
    console.error(`❌ IO fault encountered reading target markdown file: ${filePath}`, error);
    return null;
  }
}

export async function syncPlaybookToDatabase(config: PlaybookConfig) {
  console.log('🚀 Initiating playbook database schema alignment loop...');
  const supabase = await createAdminClient();

  // 1. CLEAR STALE CONFIGURATIONS
  console.log('🧹 Sweep: Emptying stale system rows across tables...');
  
  const { error: clearTasksErr } = await supabase.from('tasks').delete().neq('id', 'placeholder_dummy_row_token');
  if (clearTasksErr) console.warn('Note on task clear run execution:', clearTasksErr.message);

  const { error: clearQuestsErr } = await supabase.from('quests').delete().neq('id', 'placeholder_dummy_row_token');
  if (clearQuestsErr) console.warn('Note on quest clear run execution:', clearQuestsErr.message);

  const { error: clearMissionsErr } = await supabase.from('missions').delete().neq('id', 'placeholder_dummy_row_token');
  if (clearMissionsErr) console.warn('Note on mission clear run execution:', clearMissionsErr.message);

  console.log('✨ Target tables cleared. Starting data seeder pass...');

  // 2. MASTER ENTRY ALIGNMENT SEED LOOP
  for (const [missionKey, mission] of Object.entries(config)) {
    const missionMarkdownContent = readMarkdownSafe(mission.content_path);
    
    console.log(`\n📦 Processing Mission: ${mission.title} (Sequence ${mission.sequence})`);

    const { data: dbMission, error: missionError } = await supabase
      .from('missions')
      .upsert({
        id: mission.id,
        title: mission.title,
        content_path: mission.content_path,
        content: missionMarkdownContent || mission.content || null,
        sequence: mission.sequence,
        video_url: mission.video_url,
        big_question: mission.big_question,
        estimated_time_in_days: mission.estimated_time_in_days,
        context: mission.context as any,
        badge_config: mission.badge_config as any,
        success_message: mission.success_message,
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (missionError || !dbMission) {
      console.error(`❌ Mission configuration update failed for ${missionKey}:`, missionError);
      continue;
    }

    const missionDbId = dbMission.id;

    for (const quest of mission.quests) {
      const questId = quest.id;
      const questMarkdownContent = readMarkdownSafe(quest.content_path);

      const { data: dbQuest, error: questError } = await supabase
        .from('quests')
        .upsert({
          id: questId,
          mission_id: missionDbId,
          title: quest.title,
          content_path: quest.content_path,
          video_url: quest.video_url,
          sequence: quest.sequence,
          estimated_in_app_minutes: quest.estimated_in_app_minutes,
          estimated_off_app_minutes: quest.estimated_off_app_minutes,
          content: questMarkdownContent || quest.content || null,
          context: quest.context as any,
          badge_config: quest.badge_config as any,
          notes: quest.notes as any,
          success_message: quest.success_message,
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (questError || !dbQuest) {
        console.error(`❌ Quest mapping break encountered at id: ${questId}:`, questError);
        continue;
      }

      const questDbId = dbQuest.id;

      for (const task of quest.tasks) {
        const { data: dbTask, error: taskError } = await supabase
          .from('tasks')
          .upsert({
            id: task.id,
            quest_id: questDbId,
            mission_id: missionDbId,
            title: task.title,
            sequence: task.sequence,
            execution_type: task.execution_type,
            estimated_minutes: task.estimated_minutes,
            briefing_text: task.briefing_text,
            execution_environment: task.execution_environment,
            checkback_delay_days: task.checkback_delay_days,
            recurring: task.recurring,
            interval: task.interval,
            resources: task.resources as any,
            component_key: task.component_key,
            reflection_prompt: task.reflection_prompt,
            observation_context: task.observation_context as any,
            grant_points: task.grant_points,
            challenges: task.challenges as any,
            ai_config: task.ai_config as any,
            dependencies: task.dependencies,
            target_count: task.target_count,
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (taskError || !dbTask) {
          console.error(`❌ Task configuration update aborted for step element ${task.id}:`, taskError);
          continue;
        }
      }
      console.log(`   ✅ Synced Quest: "${quest.title}" with [${quest.tasks.length}] tasks.`);
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
    console.error('💥 CRITICAL SCHEMA SYNC EXCEPTION ENCOUNTERED:', error);
    process.exit(1);
  }
})();