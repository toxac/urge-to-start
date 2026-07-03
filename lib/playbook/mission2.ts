import { Mission } from "@/types/playbook";

export const mission2: Mission = {
  title: "Find Problems Worth Solving",
  sequence: 2,
  video_url: "https://urgetostart.com/videos/m2-overview.mp4",
  content_path: "content/mission2/mission2.md",
  briefing_text: "Businesses aren't invented; they are noticed. Stop searching for random ideas and start tracking real problems people actually have.",
  briefing_markdown: "",
  prerequisites: [
    {
      item: "Completion of Mission 1 validation badges and foundational profiles",
      promptRawText: "Make sure you've completed Mission 1 before starting this one. You'll need your profiles set up."
    },
    {
      item: "Observation notebook or a blank digital memo sheet active on your phone",
      promptRawText: "Keep a note-taking tool handy—you'll be logging annoyances and frustrations as you notice them."
    },
    {
      item: "Willingness to assume that your initial ideas might be entirely wrong",
      promptRawText: "This is about discovery, not validation. Be ready to be wrong. That's how you find the real stuff."
    }
  ],
  quests: {
    quest1: {
      slug: "your-own-pain-and-skills",
      title: "Your Own Pain & Skills",
      subtitle: "Look at what annoys you in your weekly routine, and what you are already good at doing.",
      description: "The best business ideas often start with something you personally wish existed. Start here—because you understand this problem better than anyone else.",
      sequence: 1,
      estimated_in_app_minutes: 20,
      estimated_off_app_minutes: 60,
      content_path: "content/mission2/quests/your-own-pain-and-skills.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Pattern Matcher",
        persona_prompt: "Analyze raw personal frustrations. Help the user isolate recurring operational problems from simple complaints.",
        required_context: ["user_profiles"],
        on_success: { grant_points: 50 }
      },
      tasks: [
        {
          id: "m2_q1_t1_personal_frustrations",
          title: "Log 3 Recurring Annoyances From Your Week",
          type: "form",
          component_key: "PersonalPainLogForm",
          sequence: 1,
          grant_points: 25,
          estimated_minutes: 30,
          execution_environment: "off_app",
          description: "Think about the last 7 days. What small things frustrated you? Maybe a app that crashes, a task that takes too long, or a process that feels unnecessarily complicated. Write down 3 of these moments.",
          ai_config: {
            recommendations: [
              { title: "The Difference Between an Annoyance and a Business Opportunity", type: "blog", path_or_url: "content/blog/annoyance-vs-opportunity.md" }
            ],
            challenge: "If your week felt totally smooth, look at your monthly bank statement. What transaction or bill felt annoying to pay? That's a pain point too.",
            reflection_prompt: "Look closely at your 3 logged issues. Are these temporary personal annoyances, or problems people would actually pay money to solve?"
          }
        },
        {
          id: "m2_q1_t2_skills_inventory",
          title: "List 3 Things You Do Better Than Most People",
          type: "form",
          component_key: "SkillTagBuilder",
          sequence: 2,
          grant_points: 25,
          estimated_minutes: 20,
          execution_environment: "on_app",
          description: "What comes naturally to you that others struggle with? Maybe you're good at organizing chaos, explaining technical things simply, or fixing broken processes. List 3 skills you have that others would pay for.",
          ai_config: {
            recommendations: [
              { title: "How to Spot Your Own Hidden Skills", type: "blog", path_or_url: "content/blog/spot-hidden-skills.md" }
            ],
            challenge: "If you can't think of anything, ask a coworker, friend, or family member: 'What do I do that makes your life easier?' Let them tell you.",
            reflection_prompt: "Are these skills things you actually enjoy doing, or just things you've learned to do well? If you don't enjoy it, it's not a good business fit."
          }
        }
      ]
    },
    quest2: {
      slug: "the-people-around-you",
      title: "The People Around You",
      subtitle: "Watch your friends, classmates, or co-workers and notice where they struggle.",
      description: "You're not the only one with problems. Look at the people in your daily life—what do they complain about? What do they do the hard way? Their frustrations are opportunities too.",
      sequence: 2,
      estimated_in_app_minutes: 15,
      estimated_off_app_minutes: 45,
      content_path: "content/mission2/quests/the-people-around-you.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Anthropologist",
        persona_prompt: "Decode daily group complaining habits into specific service deficits.",
        required_context: ["user_profiles"],
        on_success: { grant_points: 50 }
      },
      tasks: [
        {
          id: "m2_q2_t1_identify_circles",
          title: "Name 3 Groups You Spend Time With",
          type: "form",
          component_key: "CircleTagMatrix",
          sequence: 1,
          grant_points: 20,
          estimated_minutes: 10,
          execution_environment: "on_app",
          description: "Think about the people you interact with regularly—friends, family, coworkers, classmates, or even online communities. List 3 groups. These are your observation labs.",
          ai_config: {
            recommendations: [
              { title: "Why the Best Ideas Come From the People You Already Know", type: "blog", path_or_url: "content/blog/ideas-from-people-you-know.md" }
            ],
            challenge: "If you work alone or don't have many in-person groups, pick 3 online communities where you read or participate regularly (Reddit, Facebook groups, Discord servers, etc.).",
            reflection_prompt: "Which of these groups do you understand the most deeply? Where would you feel most comfortable asking people about their frustrations?"
          }
        },
        {
          id: "m2_q2_t2_friction_log",
          title: "Log 2 Clumsy Workarounds You Saw Someone Use",
          type: "form",
          component_key: "CircleObservationForm",
          sequence: 2,
          grant_points: 30,
          estimated_minutes: 45,
          execution_environment: "off_app",
          description: "Over the next few days, watch the groups you listed. Pay attention to moments when someone does something the hard way—a spreadsheet instead of software, a manual process instead of an automated one, a awkward fix instead of a proper solution. Log 2 examples.",
          ai_config: {
            recommendations: [
              { title: "How Clumsy Shortcuts Reveal Business Opportunities", type: "blog", path_or_url: "content/blog/clumsy-shortcuts.md" }
            ],
            challenge: "If you didn't catch anyone using a workaround in person, look up a tutorial video for a common software app. Scroll to the comments—where do users look confused? That's friction.",
            reflection_prompt: "Is the friction you observed caused by a lack of tools, bad information, or something else? The answer tells you what kind of solution might work."
          }
        }
      ]
    },
    quest3: {
      slug: "the-internet-safari",
      title: "The Internet Safari",
      subtitle: "Scan online comment sections, reviews, and forums to find real complaints.",
      description: "Now take it wider. The internet is full of people complaining about their problems. Your job is to find the complaints that repeat over and over—those are clues to real opportunities.",
      sequence: 3,
      estimated_in_app_minutes: 20,
      estimated_off_app_minutes: 60,
      content_path: "content/mission2/quests/the-internet-safari.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Signal Filter",
        persona_prompt: "Evaluate online data logs. Help the user avoid short fads and focus on long macro waves.",
        required_context: ["user_profiles"],
        on_success: {
          grant_points: 50,
          badge_key: "SCOUT"
        }
      },
      tasks: [
        {
          id: "m2_q3_t1_safari_grab",
          title: "Find 2 Complaints Posted Natively Online",
          type: "form",
          component_key: "DigitalSafariLogForm",
          sequence: 1,
          grant_points: 50,
          estimated_minutes: 60,
          execution_environment: "off_app",
          description: "Visit a forum, subreddit, app store review section, or product review site related to something you or your groups care about. Find 2 complaints that repeat across different users. Copy the exact language they used—real words matter.",
          ai_config: {
            recommendations: [
              { title: "How to Mine Reddit and Reviews for Real Problems", type: "blog", path_or_url: "content/blog/mining-online-complaints.md" }
            ],
            challenge: "Go to an app store listing for a popular product in your area of interest. Filter reviews to '3 stars'—these are people who like the product but still have real frustrations. Those are gold.",
            reflection_prompt: "Look at the exact words people used to describe their frustration. Are they mad about a missing feature, or are they expressing genuine anger about how the product makes them feel? The emotion tells you how big the problem is."
          }
        }
      ]
    },
    quest4: {
      slug: "discovery-simulator",
      title: "The Practice Interview Game",
      subtitle: "Test your conversation skills with a simulated customer before talking to real humans.",
      description: "Talking to strangers about their problems is intimidating. This simulator lets you practice without the pressure. You'll learn what questions work, what don't, and how to keep the conversation focused on their experience—not your idea.",
      sequence: 4,
      estimated_in_app_minutes: 30,
      estimated_off_app_minutes: 0,
      content_path: "content/mission2/quests/discovery-simulator.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "Alex the Busy Creative",
        persona_prompt: "Simulate a highly skeptical buyer named Alex. Act short and defensive unless the user asks open, historical questions about your past workflows.",
        required_context: ["user_profiles"],
        on_success: {
          grant_points: 100,
          badge_key: "DETECTIVE"
        }
      },
      tasks: [
        {
          id: "m2_q4_t1_chat_roleplay",
          title: "Uncover Alex's True Past Problems Without Pitching",
          type: "simulator",
          component_key: "LiveChatRoleplayWidget",
          sequence: 1,
          grant_points: 100,
          estimated_minutes: 30,
          execution_environment: "on_app",
          description: "You'll have a live chat with Alex, a busy creative professional. Your goal: understand their past struggles. Do not pitch a solution. Do not talk about your idea. Just ask about their history, their workflow, and their frustrations.",
          ai_config: {
            recommendations: [
              { title: "The Mom Test: How to Ask Questions That Don't Suck", type: "blog", path_or_url: "content/blog/the-mom-test-basics.md" },
              { title: "The Best Discovery Questions to Ask", type: "blog", path_or_url: "content/blog/great-discovery-questions.md" }
            ],
            challenge: "If Alex shuts down or gives vague answers, stop guiding the conversation. Ask: 'When was the last time you had to deal with this? What happened?' Historical questions are harder to dodge.",
            reflection_prompt: "What made Alex open up—talking about your idea, or asking about their past experience? The answer tells you how to approach real interviews."
          }
        }
      ]
    },
    quest5: {
      slug: "pain-index-and-final-cut",
      title: "Rate the Pain & Make a Choice",
      subtitle: "Talk to 3 real people, grade their frustration, and pick your primary focus.",
      description: "Everything so far has been preparation. Now you take it to real humans. You'll interview 3 people who experience the problem you're exploring. Then you'll make a decision: which problem are you going to solve first?",
      sequence: 5,
      estimated_in_app_minutes: 30,
      estimated_off_app_minutes: 90,
      content_path: "content/mission2/quests/pain-index-and-final-cut.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Ruthless Judge",
        persona_prompt: "Review logged ideas side-by-side. Rank them on alignment with user profile constraints and pain level metrics.",
        required_context: ["user_profiles", "opportunities"],
        on_success: {
          grant_points: 150,
          badge_key: "ALCHEMIST"
        }
      },
      tasks: [
        {
          id: "m2_q5_t1_interview_log",
          title: "Log 3 Real Validation Conversations",
          type: "form",
          component_key: "PainIndexTrackerForm",
          sequence: 1,
          grant_points: 100,
          estimated_minutes: 90,
          execution_environment: "off_app",
          description: "Find 3 people who experience the problem you're exploring. Ask them about their experience—how they handle it now, what frustrates them, and what they've tried. Log what you learn. Do not pitch your solution. Just listen.",
          ai_config: {
            recommendations: [
              { title: "How to Interview Customers Without Sounding Like a Salesperson", type: "blog", path_or_url: "content/blog/interview-without-selling.md" },
              { title: "What to Look For in a Discovery Interview", type: "blog", path_or_url: "content/blog/discovery-interview-signals.md" }
            ],
            challenge: "If reaching out to new people feels intimidating, interview 3 peers in the Urge community who match your target audience. The community feed is a safe space to start.",
            reflection_prompt: "Looking at your 3 interviews—did any of these people say they've spent actual money trying to solve this problem in the past year? That's the strongest signal you can get."
          }
        },
        {
          id: "m2_q5_t2_synthesize_cut",
          title: "Pick the One Problem You Will Solve First",
          type: "action",
          component_key: "OpportunityDecisionBoard",
          sequence: 2,
          grant_points: 50,
          estimated_minutes: 15,
          execution_environment: "on_app",
          description: "You've logged frustrations, spotted workarounds, mined online complaints, practiced with Alex, and talked to real people. Now it's time to choose. Pick one problem to focus on for the rest of the program. Everything else goes on the shelf for now.",
          ai_config: {
            recommendations: [
              { title: "How to Choose Between Two Good Ideas", type: "blog", path_or_url: "content/blog/choosing-between-ideas.md" },
              { title: "Why Focus Is Your Biggest Advantage", type: "blog", path_or_url: "content/blog/focus-is-advantage.md" }
            ],
            challenge: "If you're torn between two ideas, pick the one that costs the least time and money to test with a real customer. The cheaper the experiment, the easier it is to change your mind later.",
            reflection_prompt: "You've committed to one direction. How does it feel to let the other ideas go? That feeling of focus is exactly what you'll need moving forward."
          }
        }
      ]
    }
  }
}