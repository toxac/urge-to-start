import { Mission } from "@/types/playbook";

export const mission2: Mission = {
  title: "Find Problems Worth Solving",
  sequence: 2,
  video_url: "https://urgetostart.com/videos/m2-overview.mp4",
  content_path: "content/mission2/mission.md",
  briefing_text: "Businesses aren't invented; they are noticed. Stop searching for random ideas and start tracking real problems people actually have.",
  briefing_markdown: "",
  prerequisites: [
    {
      item: "Completion of Mission 1 validation badges and foundational profiles",
      promptRawText: "Explain why completing Mission 1 is essential before starting Mission 2. Emphasize that the mindset work from Mission 1 (resilience, comfort with rejection) is the foundation for doing customer discovery effectively. Without that groundwork, rejection during interviews will feel personal rather than informational. Keep it encouraging and practical."
    },
    {
      item: "Observation notebook or a blank digital memo sheet active on your phone",
      promptRawText: null
    },
    {
      item: "Willingness to assume that your initial ideas might be entirely wrong",
      promptRawText: "Explain why being wrong is actually an advantage at this stage. Frame it as: your goal in Mission 2 is discovery, not validation. If you assume you're wrong upfront, you'll ask better questions, listen more carefully, and find the real problems people have. This mindset separates good founders from those who build things nobody wants. Keep it honest and reassuring."
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
          component_key: "OpportunityEntryForm",  // Same form used across Mission 
          sequence: 1,
          grant_points: 25,
          estimated_minutes: 30,
          execution_environment: "off_app",
          description: "Think about the last 7 days. What small things frustrated you? Maybe an app that crashes, a task that takes too long, or a process that feels unnecessarily complicated. Write down 3 of these moments.",
          ai_config: {
            recommendations: [
              { title: "The Difference Between an Annoyance and a Business Opportunity", type: "blog", path_or_url: "content/blog/frustrations-as-opportunity.md" },
              { title: "The Bank Statement Challenge", type: "challenge", path_or_url: "content/challenges/bank-statement-pain.md" },
              { title: "Why Your Own Frustrations Are Your Best Starting Point", type: "blog", path_or_url: "content/blog/start-with-your-own-pain.md" }
            ],
            reflection_prompt: "Look closely at your 3 logged issues. Are these temporary personal annoyances, or problems people would actually pay money to solve?"
          }
        },
        {
          id: "m2_q1_t2_skills_inventory",
          title: "List 3 Things You Do Better Than Most People",
          type: "form",
          component_key: "OpportunityEntryForm",  // Same form used across Mission 
          sequence: 2,
          grant_points: 25,
          estimated_minutes: 20,
          execution_environment: "on_app",
          description: "What comes naturally to you that others struggle with? Maybe you're good at organizing chaos, explaining technical things simply, or fixing broken processes. List 3 skills you have that others would pay for.",
          ai_config: {
            recommendations: [
              { title: "How to Spot Your Own Hidden Skills", type: "blog", path_or_url: "content/blog/spot-your-hidden-skills.md" },
              { title: "Getting paid for your skills Challenge", type: "challenge", path_or_url: "content/challenges/getting-paid-for-your-skills.md" },
              { title: "Ikigai: Finding the Intersection of Skill and Value", type: "blog", path_or_url: "content/blog/ikigai-for-founders.md" }
            ],
            reflection_prompt: "Are these skills things you actually enjoy doing, or just things you've learned to do well? If you don't enjoy it, it's not a good business fit."
          }
        }
      ]
    },
    quest2: {
      slug: "the-people-around-you",
      title: "The People Around You",
      subtitle: "Watch real people in your life and spot where they get stuck.",
      description: "Your own frustrations are a great starting point. But the real gold is in the people around you—friends, family, coworkers, and communities you're part of. They're living with problems they don't even realize are fixable. Your job is to become a quiet observer and spot the friction they've learned to ignore.",
      sequence: 2,
      estimated_in_app_minutes: 20,
      estimated_off_app_minutes: 60,
      content_path: "content/mission2/quests/the-people-around-you.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Anthropologist",
        persona_prompt: "Guide the user through structured observation. Help them identify which groups to watch, what signals to look for, and how to validate observations with a simple follow-up question. Emphasize that the goal is to find at least one real person they could sell to someday.",
        required_context: ["user_profiles"],
        on_success: { grant_points: 50 }
      },
      tasks: [
        {
          id: "m2_q2_t1_pick_groups",
          title: "Pick 2 In-Person Groups to Observe",
          type: "action",
          component_key: "CircleTagMatrix", // Not a form
          sequence: 1,
          grant_points: 20,
          estimated_minutes: 15,
          execution_environment: "on_app",
          description: "Pick 2 groups of people you interact with regularly in person. These should be groups where you can watch people go about their normal routines without being intrusive.\n\nGood options: your team at work, a hobby or sports group, family gatherings, a regular meetup, or your local community.\n\nWhy in-person? Because you need to find at least one real person you could sell to someday. You can't sell to a screen.",
          ai_config: {
            recommendations: [
              { title: "How to Choose the Right Groups to Observe", type: "blog", path_or_url: "content/blog/choosing-observation-groups.md" },
            ],
            reflection_prompt: "Of the 2 groups you chose, which one gives you the easiest access to observe without people changing their behavior because you're watching? Start with that one."
          }
        },
        {
          id: "m2_q2_t2_observation_log",
          title: "Log 3 Observations Using the 3-Signal Framework",
          type: "action",
          component_key: "CircleObservation", // this is not a form
          sequence: 2,
          grant_points: 30,
          estimated_minutes: 60,
          execution_environment: "off_app",
          description: "Spend time with your groups and watch for these 3 specific signals:\n\n1. **'Why is this so hard?'** — Someone frustrated by something that should be simple. Look for sighs, complaints, or visible irritation.\n\n2. **'I made it work anyway'** — Someone using a clumsy workaround: a sticky-note system, a spreadsheet for something that should have proper software, or a manual process that could be automated.\n\n3. **'Ugh, this again'** — Someone dealing with a recurring problem they've clearly accepted as 'just how it is.' Look for resignation, not anger.\n\nLog 3 observations across your groups. For each, note who, what happened, and which signal you spotted.",
          ai_config: {
            recommendations: [
              { title: "The 3 Signals Framework", type: "blog", path_or_url: "content/blog/structured-observation.md" },
              { title: "How to Observe Without Being Creepy", type: "blog", path_or_url: "content/blog/observing-without-creepy.md" }
            ],
            reflection_prompt: "Which of your 3 observations seems like the most expensive problem—in time, money, or emotional energy—for the person experiencing it? That's your best lead."
          }
        },
        {
          id: "m2_q2_t3_validate_observation",
          title: "Validate 1 Observation With a Follow-Up Question",
          type: "action",
          component_key: "FollowUpQuestions",  // this is not a form
          sequence: 3,
          grant_points: 30,
          estimated_minutes: 20,
          execution_environment: "off_app",
          description: "Pick your most promising observation. Go back to that person and ask ONE simple question: 'I noticed you [describe what you saw]. Is that something you deal with often?'\n\n**Rules:**\n- Don't pitch a solution\n- Don't offer to help\n- Just ask and listen\n\nYour goal is to find out if this is a one-time annoyance or a recurring problem. If it's recurring, you've found a real opportunity.",
          ai_config: {
            recommendations: [
              { title: "how to conduct an informal interview", type: "blog", path_or_url: "content/blog/how-to-conduct-an-informal-interview.md" },
              { title: "Tips for Better Customer Validation Interviews", type: "blog", path_or_url: "content/blog/tips-for-better-customer-validation-interviews.md" }
            ],
            reflection_prompt: "Did they confirm it's a recurring problem? Have they tried anything to fix it? Did they spend money on it? The answers to these questions tell you if this is a business opportunity or just a minor annoyance."
          }
        },
        {
          id: "m2_q2_t4_add_to_opportunities",
          title: "Add Your Validated Observation to Opportunities",
          type: "form",
          component_key: "OpportunityEntryForm",  // Same form used across Mission 2
          sequence: 4,
          grant_points: 20,
          estimated_minutes: 10,
          execution_environment: "on_app",
          description: "Now that you've confirmed a real problem exists, add it to your Opportunities table. This is where you'll store every validated problem you find.\n\nYou'll use this same form throughout Mission 2—whether you find problems in your own life, observing others, or mining online forums. Each entry helps you build a portfolio of problems worth solving.",
          ai_config: {
            recommendations: [
              { title: "How to Write a Good Problem Statement", type: "blog", path_or_url: "content/blog/good-problem-statements.md" },
            ],
            reflection_prompt: "Look at the problem you just added. If you had to solve it with the least possible effort, what would the simplest version of a solution look like?"
          }
        }
      ]
    },
    quest3: {
      slug: "the-internet-safari",
      title: "The Internet Safari",
      subtitle: "Find real problems people are posting about online.",
      description: "The internet is a goldmine of complaints. Every day, people post about their frustrations on Reddit, search for solutions on Google, and leave reviews on marketplaces. Your job is to find the complaints that repeat—those are clues to real opportunities.",
      sequence: 3,
      estimated_in_app_minutes: 30,
      estimated_off_app_minutes: 120,
      content_path: "content/mission2/quests/the-internet-safari.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Signal Filter",
        persona_prompt: "Evaluate online data logs. Help the user avoid short fads and focus on long macro waves. Guide them to spot recurring complaints, identify search demand, and find gaps in existing products.",
        required_context: ["user_profiles"],
        on_success: {
          grant_points: 80,
          badge_key: "SCOUT"
        }
      },
      tasks: [
        {
          id: "m2_q3_t1_reddit_safari",
          title: "Mine a Subreddit for Real Complaints",
          type: "form",
          component_key: "OpportunityEntryForm",  // Same form used across Mission 2
          sequence: 1,
          grant_points: 30,
          estimated_minutes: 45,
          execution_environment: "off_app",
          description: "Pick a subreddit related to something you or your groups care about. Search for posts where people are complaining, asking for help, or venting about a problem.\n\n**What to look for:**\n- Posts that start with 'Does anyone else...' or 'Why is it so hard to...'\n- Repeat complaints across different users\n- People describing workarounds they're using\n\nFind 2 distinct complaints and copy the exact language they used—real words matter. Reddit is great because you can DM the people who posted and validate the problem directly.",
          ai_config: {
            recommendations: [
              { title: "How to Mine Reddit for Real Problems", type: "blog", path_or_url: "content/blog/mining-reddit.md" },
              { title: "The Reddit Challenge", type: "challenge", path_or_url: "content/challenges/reddit-challenge.md" },
              { title: "How to DM Strangers Without Being Creepy", type: "blog", path_or_url: "content/blog/dm-strangers.md" }
            ],
            reflection_prompt: "Look at the language people used. Are they describing a one-time annoyance or a recurring frustration? If you could solve this, would they actually pay for it?"
          }
        },
        {
          id: "m2_q3_t2_google_keywords",
          title: "Find What People Are Searching For",
          type: "form",
          component_key: "OpportunityEntryForm",
          sequence: 2,
          grant_points: 25,
          estimated_minutes: 30,
          execution_environment: "off_app",
          description: "Go to Google and start typing phrases related to the problems you've been exploring. Pay attention to the autocomplete suggestions—these are real searches people are making.\n\n**What to look for:**\n- 'How to [solve problem]'\n- 'Best [product] for [use case]'\n- 'Why is [something] so [hard/expensive/confusing]'\n\nAlso try Google Trends to see if interest in a problem is growing, seasonal, or fading. If people are actively searching for a solution, that's demand. And demand is a business opportunity.",
          ai_config: {
            recommendations: [
              { title: "Using Google to Find Business Ideas", type: "blog", path_or_url: "content/blog/google-for-ideas.md" },
              { title: "The Google Search Challenge", type: "challenge", path_or_url: "content/challenges/google-search.md" },
              { title: "How to Read Google Trends for Opportunity", type: "blog", path_or_url: "content/blog/google-trends-opportunity.md" }
            ],
            reflection_prompt: "What did the autocomplete suggestions tell you about how people phrase their problems? How does that compare to how you might have described the same problem?"
          }
        },
        {
          id: "m2_q3_t3_marketplace_audit",
          title: "Spot Gaps in Marketplaces",
          type: "form",
          component_key: "OpportunityEntryForm", // have option of picking i didnt find anything interesting
          sequence: 3,
          grant_points: 25,
          estimated_minutes: 45,
          execution_environment: "off_app",
          description: "Visit a marketplace where people buy and sell things related to your area of interest. This could be Etsy, Amazon, Upwork, Fiverr, or a niche marketplace.\n\n**What to look for:**\n- **Best-sellers:** What are people buying a lot of? (This tells you there's demand.)\n- **Low-rated products/services:** What are people complaining about in the reviews? (This tells you what's missing.)\n- **Custom requests:** Are people asking for something that isn't being offered?\n\nFind 1 gap: something people are clearly buying but not fully satisfied with. That gap is your opportunity.",
          ai_config: {
            recommendations: [
              { title: "How to Spot Gaps in Marketplaces", type: "blog", path_or_url: "content/blog/marketplace-gaps.md" },
              { title: "The Marketplace Audit Challenge", type: "challenge", path_or_url: "content/challenges/marketplace-audit.md" },
              { title: "What Amazon Reviews Can Teach You About Business", type: "blog", path_or_url: "content/blog/amazon-reviews.md" }
            ],
            reflection_prompt: "If you were to sell something in this marketplace, what would you do differently from the existing options? What makes you think people would buy from you instead?"
          }
        },
      ]
    },
    quest4: {
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
              { title: "What to Look For in a Discovery Interview", type: "blog", path_or_url: "content/blog/discovery-interview-signals.md" },
              { title: "The 3-Interview Challenge", type: "challenge", path_or_url: "content/challenges/three-interviews.md" },
              { title: "The 'Spent Money' Signal", type: "blog", path_or_url: "content/blog/spent-money-signal.md" },
              { title: "Talking to Humans (Book)", type: "book", path_or_url: "https://www.talkingtohumans.com/", subtitle: "By Giff Constable" }
            ],
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
              { title: "Why Focus Is Your Biggest Advantage", type: "blog", path_or_url: "content/blog/focus-is-advantage.md" },
              { title: "The Cheapest Test Challenge", type: "challenge", path_or_url: "content/challenges/cheapest-test.md" },
              { title: "The One-Page Decision Framework", type: "blog", path_or_url: "content/blog/one-page-decision.md" },
              { title: "The Dip (Book)", type: "book", path_or_url: "https://www.amazon.com/Dip-Little-Book-Teaches-Stick/dp/1591841666", subtitle: "By Seth Godin" }
            ],
            reflection_prompt: "You've committed to one direction. How does it feel to let the other ideas go? That feeling of focus is exactly what you'll need moving forward."
          }
        }
      ]
    }
  }
}