// lib/playbook/mission1.ts
import { Mission } from "@/types/playbook";

export const mission1: Mission = {
  id: "mission1",
  title: "Get Out of Your Own Head",
  sequence: 1,
  video_url: "https://urgetostart.com/videos/m1-overview.mp4",
  briefing_text: "Before we look at business ideas, we need to focus on you. We're going to break out of the overthinking loop and build the habits you need to actually stick with this in the real world.",
  content: "",
  content_path: "content/mission1/mission.md",
  prerequisites: [
    {
      item: "Commit to finding at least 3 hours a week.",
      promptRawText: "The user is trying to find 3 hours a week while working full-time. Give them a practical strategy to protect three 60-minute blocks without burning out."
    },
    {
      item: "A reliable computer and a decent internet connection"
    },
    {
      item: "Willingness to be completely honest with yourself and the system",
      promptRawText: "The user is nervous about sharing their ideas. Remind them that starting matters more than keeping secrets, and hiding an idea just keeps them isolated."
    }
  ],
  quests: {
    quest1: {
      id: "mission1_quest1",
      slug: "starting-your-new-chapter",
      title: "Your Fresh Start",
      subtitle: "Get real about why you are here, face your roadblocks, and introduce yourself.",
      description: "Every great journey begins exactly where you are standing right now. Before we look at business ideas, let's nail down what is driving you to build, map out the real-world boundaries you are working around, and introduce yourself to your fellow founders.",
      sequence: 1,
      content: "",
      estimated_in_app_minutes: 45,
      estimated_off_app_minutes: 0,
      grant_points_bonus: 50,
      is_optional: false,
      mission_id: "mission1",
      content_path: "content/mission1/quests/starting-your-new-chapter.md",
      persona_name: "The Mirror",
      persona_prompt: "You are a grounded advisor and a supportive friend. Review user motivations and roadblocks. Call out vague answers kindly, and help them turn big dreams into everyday actions.",
      required_context: ["user_profiles"],
      badge_key_reward: "PATHFINDER",
      tasks: [
        {
          id: "m1_q1_t1_drivers",
          title: "Why do you want to start a business?",
          sequence: 1,
          type: "form",
          component_key: "MotivationForm",
          grant_points: 20,
          estimated_minutes: 15,
          description: "Let's be totally honest. Building a business takes serious energy, and vague goals fade the moment life gets busy. What is the actual change you want to make in your life?",
          mission_id: "mission1",
          quest_id: "mission1_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Finding Your Real Why", 
                type: "blog", 
                path_or_url: "content/blog/reasons-to-start.md", 
                subtitle: "4 min layout read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m1_q1_t2_commitments",
          title: "Be realistic about your schedule and roadblocks",
          sequence: 2,
          type: "form",
          component_key: "CommitmentForm",
          grant_points: 20,
          estimated_minutes: 15,
          description: "Let's get real about your schedule and the roadblocks you are working around. This is about being honest with yourself so you can actually make progress.",
          mission_id: "mission1",
          quest_id: "mission1_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Starting with almost nothing", 
                type: "blog", 
                path_or_url: "content/blog/starting-with-nothing.md", 
                subtitle: "4 min layout read" 
              },
              { 
                title: "Getting Practical", 
                type: "blog", 
                path_or_url: "content/blog/lets-get-practical.md", 
                subtitle: "4 min layout read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
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
          mission_id: "mission1",
          quest_id: "mission1_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Community Code of Conduct", 
                type: "internal_link", 
                path_or_url: "app/(marketing)/code-of-conduct" 
              },
              { 
                title: "Explore the Community Board", 
                type: "internal_link", 
                path_or_url: "/platform/program/community", 
                subtitle: "See what others are building" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest2: {
      id: "mission1_quest2",
      slug: "asking-for-allies",
      title: "Learn to ask",
      subtitle: "When you ask you might just get what you want!",
      description: "The power of asking lies in its ability to unlock new possibilities, break down social barriers, and accelerate personal and professional growth. By overcoming the fear of rejection, you open yourself to feedback, better opportunities, and deeper connections with others",
      sequence: 2,
      content: "",
      estimated_in_app_minutes: 30,
      estimated_off_app_minutes: 120,
      grant_points_bonus: 50,
      is_optional: false,
      mission_id: "mission1",
      content_path: "content/mission1/quests/art-of-asking.md",
      persona_name: "The Editor",
      persona_prompt: "You are a helpful copy editor. Review message drafts. Highlight hesitant filler words like 'just checking in' or 'sorry to bother you', and suggest more confident alternatives.",
      required_context: ["user_profiles"],
      badge_key_reward: "COMMUNICATOR",
      tasks: [
        {
          id: "m1_q2_t1_ask_sim",
          title: "Element of a good ask",
          sequence: 1,
          type: "simulator",
          component_key: "AskSimulator",
          grant_points: 30,
          estimated_minutes: 15,
          description: "Lets practice few asks before you approach people in the real world.",
          mission_id: "mission1",
          quest_id: "mission1_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The Art of Asking", 
                type: "blog", 
                path_or_url: "content/blog/art-of-asking.md" 
              },
              { 
                title: "The Power of Asking", 
                type: "youtube", 
                path_or_url: "https://www.youtube.com/watch?v=xMj_P_6H69g", 
                subtitle: "TED talk by Amanda Palmer" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m1_q2_t2_known_reachout",
          title: "Get your cheer squad",
          sequence: 2,
          type: "action",
          component_key: "KnownReachoutWidget",
          grant_points: 20,
          estimated_minutes: 60,
          description: "Ask people you know to be part of your journey. This could be a friend, a mentor, or a family member. Ask them to give you feedback on your idea, or just to be a cheerleader for your progress.",
          mission_id: "mission1",
          quest_id: "mission1_quest2",
          execution_environment: "off_app",
          checkback_delay_days: 2,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Dealing with Response Anxiety", 
                type: "blog", 
                path_or_url: "content/blog/managing-responses.md" 
              },
              { 
                title: "Ask for more", 
                type: "challenge", 
                path_or_url: "content/blog/ask-challenge.md" 
              }
            ],
            reflection_prompt: "Now that you've hit send, did the reality of doing it feel lighter than the anxiety you had beforehand?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m1_q2_t3_digital_presence",
          title: "Build your presence",
          sequence: 3,
          type: "action",
          component_key: "DigitalPresenceWidget",
          grant_points: 25,
          estimated_minutes: 15,
          description: "Having a digital presence is important for building credibility and trust. It also helps you to be found by people who are interested in your work. Let's make sure you have a basic digital presence set up.",
          mission_id: "mission1",
          quest_id: "mission1_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Ways to build a digital presence", 
                type: "blog", 
                path_or_url: "content/blog/ways-to-build-digital-presence.md" 
              },
              { 
                title: "Gain 100 followers in a week", 
                type: "challenge", 
                path_or_url: "content/blog/gain-100-followers-challenge.md" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest3: {
      id: "mission1_quest3",
      slug: "building-resilience",
      title: "Get Used to Hearing No",
      subtitle: "Collect a few real-world rejections and see that they won't kill you.",
      description: "Hearing 'no' stings at first—that's normal. But here's the thing: it's not about you. It's just feedback. This module is a safe space to practice taking small knocks so you can see they don't actually hurt. By the end, you'll have proof that rejection is just information, not a verdict.",
      sequence: 3,
      content: "",
      estimated_in_app_minutes: 15,
      estimated_off_app_minutes: 180,
      grant_points_bonus: 100,
      is_optional: false,
      mission_id: "mission1",
      content_path: "content/mission1/quests/building-resilience.md",
      persona_name: "The Hype-Man",
      persona_prompt: "You are an encouraging coach. The user is logging rejections. Reframe their entries as clean user feedback rather than personal setbacks.",
      required_context: ["user_profiles"],
      badge_key_reward: "FORTRESS",
      tasks: [
        {
          id: "m1_q3_t1_rejection_log",
          title: "Log 3 minor rejections this week",
          sequence: 1,
          type: "log_counter",
          component_key: "RejectionCounterForm",
          grant_points: 80,
          estimated_minutes: 120,
          description: "Here's a small experiment: go ask for something small that you expect to be turned down for. Maybe ask a cafe for a discount, or request a favor from someone you don't know well. The goal isn't to get a 'yes'—it's to collect a 'no' on purpose. When it happens, take a breath. Notice that you're okay. That's the whole point.",
          mission_id: "mission1",
          quest_id: "mission1_quest3",
          execution_environment: "off_app",
          checkback_delay_days: 3,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Your First No Is the Hardest", 
                type: "blog", 
                path_or_url: "content/blog/first-no-hardest.md" 
              },
              { 
                title: "Jia Jiang: 100 Days of Rejection", 
                type: "youtube", 
                path_or_url: "https://www.youtube.com/watch?v=-vZXgApsPCQ", 
                subtitle: "Famous TED talk experiment" 
              },
              { 
                title: "Post your experience to the community board", 
                type: "challenge", 
                path_or_url: "/user/posts" 
              }
            ],
            reflection_prompt: "Now that you've done it—did the rejection actually hurt? Or did it just feel a little awkward and then pass? Write down what happened, how you felt, and what you noticed. This is your proof that you can handle more than you think."
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m1_q3_t2_club_unlock",
          title: "See how your peers are doing",
          sequence: 2,
          type: "community",
          component_key: "CommunityFeedTeaser",
          grant_points: 20,
          estimated_minutes: 15,
          description: "Open the community feed. Scroll through what others have posted. You'll see the same awkward moments, the same small rejections, the same 'I survived that' energy. This is your reminder that you're in good company.",
          mission_id: "mission1",
          quest_id: "mission1_quest3",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "You're Not the Only One", 
                type: "blog", 
                path_or_url: "content/blog/not-alone.md" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    }
  }
};