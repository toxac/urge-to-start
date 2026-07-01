import { Mission } from "@/types/playbook";

export const mission1: Mission = {
  title: "Build Your Founder Mindset",
  sequence: 1,
  video_url: "https://urgetostart.com/videos/m1-overview.mp4",
  briefing_text: "Before we look at business opportunities, we have to look at you. We are going to move past the overthinking trap and build real-world resilience.",

  prerequisites: [
    {
      item: "Commitment to allocate 3+ hours per week of uninterrupted focus",
      promptKey: "M1_PRE_TIME_AUDIT",
      promptRawText: "The user is balancing building with a full-time schedule. Provide an operational approach on calendar fencing. Focus on protecting three 60-minute deep-focus blocks across their week."
    },
    {
      item: "A reliable laptop or computer with a stable internet connection",
      promptKey: null
    },
    {
      item: "Willingness to share honest reflections with Kip",
      promptKey: "M1_PRE_PSYCH_SAFETY",
      promptRawText: "The user feels uncertain about sharing their concepts openly. Remind them that execution velocity wins over secrecy, and keeping an idea hidden isolates them from true feedback loops."
    }
  ],

  quests: {
    quest1: {
      slug: "starting-your-new-chapter",
      title: "Starting Your New Chapter",
      subtitle: "Map your fuel, set your commitment baseline, and claim your builder card.",
      description: "Every great project marks a turning point. Let's look at what brought you here, evaluate your practical constraints, and configure your identity card for the network.",
      sequence: 1,
      estimated_in_app_minutes: 45,  // ⚡ Displayed on the Sprint Header Summary
      estimated_off_app_minutes: 0,   // Pure setup chapter
      content_path: "content/mission1/quests/starting-your-new-chapter.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Mirror",
        persona_prompt: "You are a grounded advisor. Review user motivations and roadblocks. If answers are vague, challenge them to connect abstract ideas to everyday operational terms.",
        required_context: ["user_profiles"],
        on_success: {
          grant_points: 50,
          badge_key: "PATHFINDER"
        }
      },
      tasks: [
        {
          id: "m1_q1_t1_drivers",
          title: "What's Driving You to Start?",
          sequence: 1,
          type: "form",
          component_key: "MotivationForm",
          grant_points: 20,
          estimated_minutes: 15, // ⚡ Time target metric per form task
          description: "Let's be transparent. Building something meaningful requires consistent energy. Generic goals fade fast when your schedule gets busy. What is the actual change you are trying to make?",
          ai_config: {
            resources: [
              { title: "Isolating Core Drivers", content_path: "content/blog/finding-your-why.md" }
            ]
          }
        },
        {
          id: "m1_q1_t2_commitments",
          title: "Set Your Journey Commitment Baseline",
          sequence: 2,
          type: "form",
          component_key: "CommitmentForm", 
          grant_points: 20,
          estimated_minutes: 15,
          description: "Let's establish your target parameters. Be honest about your timeline, capital access, and any roadblocks you anticipate so we can tailor resources to match your pace.",
          ai_config: {
            resources: [
              { title: "Navigating Roadblocks Framework", content_path: "content/blog/managing-constraints.md" }
            ]
          }
        },
        {
          id: "m1_q1_t3_profile",
          title: "Claim Your Builder Identity",
          sequence: 3,
          type: "form",
          component_key: "ProfileSetupForm",
          description: "Every new chapter benefits from a clear point of departure. Introduce yourself to the network feed, upload your workspace portrait, and link your existing channels.",
          grant_points: 10,
          estimated_minutes: 15,
          ai_config: {
            resources: [
              { title: "Workspace Network Protocol Guide", content_path: "content/blog/network-identity.md" }
            ]
          }
        }
      ]
    },
    quest2: {
      slug: "asking-for-allies",
      title: "Asking For Allies",
      subtitle: "Practice direct communication and invite your early circle along.",
      description: "Building entirely in isolation is a tough track. This module focuses on crafting direct, clean requests to your existing network without using apologetic filler copy.",
      sequence: 2,
      estimated_in_app_minutes: 30,
      estimated_off_app_minutes: 120, // ⚡ Shows they have real-world outbound tracking to execute
      content_path: "content/mission1/quests/asking-for-allies.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Editor",
        persona_prompt: "You are an encouraging copy editor. Review user text drafts. Flag hesitant phrases like 'pick your brain' or apologetic padding, and suggest confident alternatives.",
        required_context: ["user_profiles"],
        on_success: {
          grant_points: 50,
          badge_key: "COMMUNICATOR"
        }
      },
      tasks: [
        {
          id: "m1_q2_t1_ask_sim",
          title: "Test Drive Your Message",
          sequence: 1,
          type: "simulator",
          component_key: "AskSimulator",
          grant_points: 30,
          estimated_minutes: 15,
          description: "Let's test out your outreach copy in a private, low-stakes sandbox. Draft a short message to share your new focus and ask your friends or colleagues for feedback.",
          ai_config: {
            resources: [
              { title: "Direct Communication Rules", content_path: "content/blog/asking-without-shame.md" }
            ]
          }
        },
        {
          id: "m1_q2_t2_known_reachout",
          title: "Reach Out to Your Circle",
          sequence: 2,
          type: "action",
          component_key: "KnownReachoutWidget",
          grant_points: 20,
          estimated_minutes: 60,
          execution_environment: "off_app",
          checkback_delay_days: 2,
          description: "Take your polished copy out into the real world. Send it directly to a few trusted contacts to begin assembling your early cheer squad roster.",
          ai_config: {
            resources: [
              { title: "Managing Outbound Response Friction", content_path: "content/blog/managing-responses.md" }
            ],
            reflection_prompt: "Now that your messages are out in the open, did the actual process feel easier than the anticipation leading up to it?"
          }
        },
        {
          id: "m1_q2_t3_digital_presence",
          title: "Claim Your Digital Voice",
          sequence: 3,
          type: "action",
          component_key: "DigitalPresenceWidget",
          grant_points: 25,
          estimated_minutes: 15,
          description: "Sharing updates isn't about sounding like a guru—it is simply about documenting your path out loud. Let's adjust your bio to state exactly what you are learning and building.",
          ai_config: {
            resources: [
              { title: "The Balanced Profile Template", content_path: "content/blog/clean-profiles.md" }
            ]
          }
        }
      ]
    },
    quest3: {
      slug: "building-resilience",
      title: "Building Resilience",
      subtitle: "Collect real feedback and normalize everyday setbacks.",
      description: "Friction and unexpected turnbacks are a completely normal part of the building loop. This module re-aligns your perspective on failure by turning rejections into clear data upgrades.",
      sequence: 3,
      estimated_in_app_minutes: 15,
      estimated_off_app_minutes: 180, // ⚡ High real-world exposure action step target
      content_path: "content/mission1/quests/building-resilience.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Hype-Man",
        persona_prompt: "You are a supportive runtime coach. The user is inputting rejections. Help them look past the emotional sting and view these entries as dry project feedback data points.",
        required_context: ["user_profiles"],
        on_success: {
          grant_points: 100,
          badge_key: "FORTRESS"
          }
      },
      tasks: [
        {
          id: "m1_q3_t1_rejection_log",
          title: "Collect Low-Stakes Feedback",
          sequence: 1,
          type: "log_counter",
          component_key: "RejectionCounterForm",
          grant_points: 80,
          estimated_minutes: 120,
          execution_environment: "off_app",
          checkback_delay_days: 3,
          description: "Let's normalize hearing 'no' through a quick, controlled real-world experiment. Go out and pitch a low-stakes request—like asking a local shop for a tiny courtesy discount—just to practice handling the answer calmly.",
          ai_config: {
            resources: [
              { title: "The Gamification of Rejection", content_path: "content/blog/rejection-therapy.md" }
            ],
            challenge: "Post your raw experience log directly to the internal peer board to share the outcome with the community.",
            reflection_prompt: "Now that you've logged this friction point, did it cause any real damage, or did you realize the real-world impact was entirely survivable?"
          }
        },
        {
          id: "m1_q3_t2_club_unlock",
          title: "Review the Shared Progress Feed",
          sequence: 2,
          type: "community",
          component_key: "CommunityFeedTeaser",
          grant_points: 20,
          estimated_minutes: 15,
          description: "You are not navigating this track alone. Open the collective community feed to see progress logs and strategies shared by other active peers on the same path.",
          ai_config: {
            resources: [
              { title: "Leveraging Shared Context Panels", content_path: "content/blog/peer-leverage.md" }
            ]
          }
        }
      ]
    }
  }
};