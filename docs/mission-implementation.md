I have turned our tasks for the day into mini sprints we complete them one by one

## Sprint 1: Database changes (completed)
1. added schedule_config and persona columns to profile
2. created squad table
3. added execution_environment and checkback_delay_days column to tasks table.
4. synced local supabase types 
5. give me RLS policies for squad table (not added)

## Sprint 2: playbook configuration (TO DO NOW)
first lets improve the structure of how we have each entry for missions, quests and task.
### few general things
- we should move each mission entry to separate file and then import all of them to playbook.ts. it makes it easier to manage.
- we will have to update types for playbook
- we ned to check for language everywhere. It should be as a friend speak to another, clear, direct and no jargon.
Check and streamline Ai conductor
- i think we should bring the relevant prompt inside the mission playbook entry, keep its easy
- tell me if i am missing something 


### Quests
    - add elaborate description to quests giving better context
### Tasks
    - alternative_approach: this should be optional
    - challenge: (optional) to mindset and similar tasks we can give user additional challenge they can do on their own, something that makes them go further
    - reflection_prompt: should be optional
    - resources need to fetch markdown file in content folder rather than url

### Attached files
- lib/ai/prompts.ts
- lib/ai/conductor.ts
- lib/playbook.ts
- types/playbook.ts
- ask me if you need to refer to anything 

### Feedback 
- I have implemented everything, few changes i created playbook folder inside /lib and added mission1.ts and i moved playbook.ts inside playbook folder as index.ts.
- This is good but language still is a bit off i noticed allies somewhere but don't worry i will fix those myself. 
### Suggestions: 
1. we had discussed adding calendar. which we dont have anywhere 
2. We wanted to work that inside of constraint task but I don't think that's good idea. Constraint form should be global in context to their journey. Even better would be personal program goal setting and constraints addressing the following (which would be saved in profile):
    - How soon do they want to launch (goal)
    - How important is launching a business to them (goal)
    - Do they have access to money
    - Thing they feel will hold them back skills, time, connections they can list everything they can think of and we can use AI to synthesize as tags.
- data from constraint form will help us guide users better in the sense of communication and resources
- back to calendar: we should integrate it with quests as quest is the work center. As they start quest on top we can have the planner which we can save to quests table. So every quest they start they can plan it out. we can have how many hours a quest (including all the tasks would take considering things they have to do off the system)

tell me your thought? 

## Sprint 3: WORKSPACE INTERFACE DEVELOPMENTS (Later)
Build out these components to make the forms and calendar highly interactive:

[ ] Interactive Constraint Micro-Grid: Update the ConstraintForm UI so selecting a time slot (like "Evenings") expands into a clickable day/time grid that saves directly to profiles.schedule_config.

[ ] Ambient .ics Calendar Feed Generator: Create an API route at app/api/calendar/sync/[userId]/route.ts that reads the user's schedule config and outputs a standard iCalendar feed URL.

[ ] Shareable Cheer Squad Link: Add a feature inside the KnownReachoutWidget that generates a unique referral link (/join-squad/[userId]) for users to send to friends, which captures incoming email submissions.

[ ] Kip's Local Post-Execution Pipeline: Rebuild Kip's panel state routing so that upon task completion, the form's data payload is cleanly piped to Kip out of local store memory.

## Sprint 4 : KIP SIDEBAR & TYPOGRAPHY CLEANUP (Later)
Refine the voice and layout hierarchy of the companion:

[ ] Remove Repeating Headers: Ensure Kip never copies text fields or headers from the main screen. Kip should strictly present its specific tactical advice point-of-view.

[ ] Markdown Component Renderer: Build a dedicated formatting block inside KipQuestCoach to style local file summaries cleanly with clear typography, bullet points, and bolds.

[ ] Chat History Collapse Badges: Write the accordion layout logic that gracefully groups past conversations into clean, clickable summary badges at the top of the sidebar feed whenever a user switches tasks.