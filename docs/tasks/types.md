Mismatches Found:
Task Type Mismatch:

1. Playbook has 'observation' as a task type
    - Database enum task_execution_type has: 'form' | 'simulator' | 'log_counter' | 'action' | 'community'
    - Missing: 'observation' in database
    - Action: let add 'observation' to task_execution enum and use that in playbook

2. Optional vs Required:
    - Playbook: description? (optional), Database: description (required)
    - Action: make it required in playbook, because we will be using supabase type it should be same
3. Missing Fields in Playbook:
    1. mission_id (required in DB): i am just using "mission1", "mission2" as id in database we can add an id field to playbook. 
        - action: lets keep same as db, i will populate misison playbook with the id
    2. quest_id (required in DB): in db its is of form "mission1_quest1"
        - action : keep id as in databse and i will add this to each misison playbook file
    3. created_at (auto-generated) and updated_at (auto-generated), we cant add this to playbook sadly we will have to figure out what to do about it

4. Quest Mismatches:

    1. Playbook has content_path (file path), Database has content (markdown string)
    - playbook has path to markdown content from where we are extracting content and saving it to database content

    2. Playbook has content_markdown? (optional), Database has content (required)

    3. Playbook ai_config is complex, Database has flattened fields: persona_name, persona_prompt, required_context, badge_key_reward, grant_points_bonus: we will have ai_config json in tables and manage the type for it from the playbook

5. Mission Mismatches:

    1. Playbook has briefing_text, Database has content 
        - action: add briefing text to database, this will be kind of seo summary, while content comes from markdown file

    2. Playbook has prerequisites, Database doesn't have this field
        - we can add this to database
    3. Playbook has content_path, Database doesn't: this is same as in quest