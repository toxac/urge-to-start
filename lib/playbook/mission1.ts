import { Mission } from "@/types/playbook";

export const mission1: Mission = {
  title: "Get Out of Your Own Head",
  sequence: 1,
  video_url: "https://urgetostart.com/videos/m1-overview.mp4",
  briefing_text: "Before we look at business ideas, we need to focus on you. We're going to break out of the overthinking loop and build the habits you need to actually stick with this in the real world.",

  prerequisites: [
    {
      item: "Commit to finding at least 3 hours a week to work on this",
      promptKey: "M1_PRE_TIME_AUDIT",
      promptRawText: "The user is trying to find 3 hours a week while working full-time. Give them a practical strategy to protect three 60-minute blocks without burning out."
    },
    {
      item: "A reliable computer and a decent internet connection",
      promptKey: null
    },
    {
      item: "Willingness to be completely honest with yourself and Kip",
      promptKey: "M1_PRE_PSYCH_SAFETY",
      promptRawText: "The user is nervous about sharing their ideas. Remind them that starting matters more than keeping secrets, and hiding an idea just keeps them isolated."
    }
  ],

  quests: {
    quest1: {
      slug: "starting-your-new-chapter",
      title: "Your Fresh Start",
      subtitle: "Why are you doing this, what's your project called, and when will you work?",
      description: "Every great project starts with a turning point. Let's look at what's driving you, pick a working name for your project, and figure out how to realistically fit this into your week.",
      sequence: 1,
      estimated_in_app_minutes: 45,
      estimated_off_app_minutes: 0,
      content_path: "content/mission1/quests/starting-your-new-chapter.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Mirror",
        persona_prompt: "You are a grounded advisor and a supportive friend. Review user motivations and roadblocks. Call out vague answers kindly, and help them turn big dreams into everyday actions.",
        required_context: ["user_profiles"],
        on_success: {
          grant_points: 50,
          badge_key: "PATHFINDER"
        }
      },
      tasks: [
        {
          id: "m1_q1_t1_drivers",
          title: "What's the real reason you're starting?",
          sequence: 1,
          type: "form",
          component_key: "MotivationForm",
          grant_points: 20,
          estimated_minutes: 15,
          description: "Let's be totally honest. Building a business takes serious energy, and vague goals fade the moment life gets busy. What is the actual change you want to make in your life?",
          ai_config: {
            resources: [
              { title: "Finding Your Real Why", content_path: "content/blog/finding-your-why.md" }
            ]
          }
        },
        {
          id: "m1_q1_t2_commitments",
          title: "Be realistic about your schedule and roadblocks",
          sequence: 2,
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
        {
          id: "m1_q1_t3_profile",
          title: "Introduce yourself to the community",
          sequence: 3,
          type: "form",
          component_key: "ProfileSetupForm",
          description: "You're not in this alone. Put a face to the name, write a brief bio, and share your links so other people here can see what you're up to.",
          grant_points: 10,
          estimated_minutes: 15,
          ai_config: {
            resources: [
              { title: "Writing a Clean Bio", content_path: "content/blog/network-identity.md" }
            ]
          }
        }
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