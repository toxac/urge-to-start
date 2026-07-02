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


# mission1: "Get Out of Your Own Head",

## quest1: 
1. tasks/ "m1_q1_t1_drivers",
    - title: Why do you want to start
    - ai_config: 
            - resources: [
              { title: "Reasons to Start", content_path: "content/blog/reasons-to-start.md" }
            ]
          }
        },
        {
          id: "m1_q1_t2_profile",
          title: "Introduce yourself to the community",
          sequence: 2,
          type: "form",
          component_key: "ProfileSetupForm",
          description: "You're not in this alone. Put a face to the name, write a brief bio, and share your links so other people here can see what you're up to.",
          grant_points: 10,
          estimated_minutes: 15,
          ai_config: {
            resources: [
              { title: "Writing a Clean Bio", content_path: "content/blog/network-identity.md" }
            ] // we should have suggestion here instead of resource telling users to interact with others in 
          }
        },
        {
          id: "m1_q1_t3_commitments",
          title: "Be realistic about your schedule and roadblocks",
          sequence: 3,
          type: "form",
          component_key: "CommitmentForm",
          grant_points: 20,
          estimated_minutes: 15,
          description: "Let's map out your baseline. Tell us about your target timeline, money boundaries, and the specific things you worry will hold you back so we can help you handle them.",
          ai_config: {
            resources: [
              { title: "Handling Your Roadblocks", content_path: "content/blog/managing-constraints.md" }
            ]
          }
        },
        
      ]
    },
    quest2: {
      slug: "asking-for-allies",
      title: "Find Your Cheer Squad",
      subtitle: "Learn to write short, direct messages and find people to back you.",
      description: "Trying to do this entirely in a cave is a surefire way to quit. This step is all about learning how to make clear, confident requests to your immediate circle without feeling awkward or over-apologizing.",
      sequence: 2,
      estimated_in_app_minutes: 30,
      estimated_off_app_minutes: 120,
      content_path: "content/mission1/quests/asking-for-allies.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Editor",
        persona_prompt: "You are a helpful copy editor. Review message drafts. Highlight hesitant filler words like 'just checking in' or 'sorry to bother you', and suggest more confident alternatives.",
        required_context: ["user_profiles"],
        on_success: {
          grant_points: 50,
          badge_key: "COMMUNICATOR"
        }
      },
      tasks: [
        {
          id: "m1_q2_t1_ask_sim",
          title: "Practice your outreach message",
          sequence: 1,
          type: "simulator",
          component_key: "AskSimulator",
          grant_points: 30,
          estimated_minutes: 15,
          description: "Let's test out your message in a private space where no one else can see it. Draft a short note sharing your new focus and asking a friend for quick feedback.",
          ai_config: {
            resources: [
              { title: "The Rules of a Direct Ask", content_path: "content/blog/asking-without-shame.md" }
            ]
          }
        },
        {
          id: "m1_q2_t2_known_reachout",
          title: "Send it to a few trusted friends",
          sequence: 2,
          type: "action",
          component_key: "KnownReachoutWidget",
          grant_points: 20,
          estimated_minutes: 60,
          execution_environment: "off_app",
          checkback_delay_days: 2,
          description: "Take the script you polished with Kip and send it to real people. This is how you start building a tight circle of supporters who have your back.",
          ai_config: {
            resources: [
              { title: "Dealing with Response Anxiety", content_path: "content/blog/managing-responses.md" }
            ],
            reflection_prompt: "Now that you've hit send, did the reality of doing it feel lighter than the anxiety you had beforehand?"
          }
        },
        {
          id: "m1_q2_t3_digital_presence",
          title: "Share what you're working on out loud",
          sequence: 3,
          type: "action",
          component_key: "DigitalPresenceWidget",
          grant_points: 25,
          estimated_minutes: 15,
          description: "You don't need to act like an expert. Just treat it like a regular diary log of what you're learning. Let's update your social bio so people know what you're working on.",
          ai_config: {
            resources: [
              { title: "The Honest Bio Framework", content_path: "content/blog/clean-profiles.md" }
            ]
          }
        }
      ]
    },
    quest3: {
      slug: "building-resilience",
      title: "Get Comfortable Hearing No",
      subtitle: "Collect a few real-world rejections and see that they won't kill you.",
      description: "Setbacks and hearing 'no' are completely normal. This module is designed to help you realize that rejection isn't personal—it's just a normal part of trying something new.",
      sequence: 3,
      estimated_in_app_minutes: 15,
      estimated_off_app_minutes: 180,
      content_path: "content/mission1/quests/building-resilience.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Hype-Man",
        persona_prompt: "You are an encouraging coach. The user is logging rejections. Reframe their entries as clean user feedback rather than personal setbacks.",
        required_context: ["user_profiles"],
        on_success: {
          grant_points: 100,
          badge_key: "FORTRESS"
        }
      },
      tasks: [
        {
          id: "m1_q3_t1_rejection_log",
          title: "Log 3 minor rejections this week",
          sequence: 1,
          type: "log_counter",
          component_key: "RejectionCounterForm",
          grant_points: 80,
          estimated_minutes: 120,
          execution_environment: "off_app",
          checkback_delay_days: 3,
          description: "Let's make hearing 'no' feel routine with a simple experiment. Go out and make a small request—like asking a local coffee shop for a tiny courtesy discount—just to practice staying calm when they say no.",
          ai_config: {
            resources: [
              { title: "The Art of Handling Rejection", content_path: "content/blog/rejection-therapy.md" }
            ],
            challenge: "Share your experience on the internal community board so others can see how you handled it.",
            reflection_prompt: "Now that you've gone through it, did the rejection set you back at all, or did you realize it was completely harmless?"
          }
        },
        {
          id: "m1_q3_t2_club_unlock",
          title: "See how your peers are doing",
          sequence: 2,
          type: "community",
          component_key: "CommunityFeedTeaser",
          grant_points: 20,
          estimated_minutes: 15,
          description: "You're not walking this path alone. Open up the collective community feed to see the logs and stories your peers are tracking.",
          ai_config: {
            resources: [
              { title: "Using the Power of the Group", content_path: "content/blog/peer-leverage.md" }
            ]
          }
        }
      ]
    }
  }
};