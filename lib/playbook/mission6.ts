// lib/playbook/mission6.ts
import { Mission } from "@/types/playbook";

export const mission6: Mission = {
  id: "mission6",
  title: "Building Your Solution & Gathering Traction",
  sequence: 6,
  video_url: "https://urgetostart.com/videos/m6-overview.mp4",
  briefing_text: "You've planned, you've prepared, you've built an audience. Now it's time to build. In this mission, you'll build your Minimum Sellable Product, test it with real users, get your first pre-sales (from your network AND the Urge community), and prepare for public launch. The app is your dashboard—most of the work happens in the real world.",
  content: "",
  content_path: "content/mission6/mission.md",
  prerequisites: [
    {
      item: "Your Build Manifesto and plan from Mission 5",
      promptRawText: "You should have a clear build plan from Mission 5. If not, go back and complete it first."
    },
    {
      item: "Your landing page and waitlist from Mission 5",
      promptRawText: "You need a place where people can find you and sign up. Complete Mission 5 if you haven't already."
    },
    {
      item: "Time to build (2-6 weeks)",
      promptRawText: "Building takes time. Protect your build blocks in your calendar. This is the hardest part—but also the most rewarding."
    }
  ],
  quests: {
    quest1: {
      id: "mission6_quest1",
      slug: "build-your-msp",
      title: "Build Your MSP",
      subtitle: "Build the minimum sellable product",
      description: "This is it. The build phase. Follow your Build Manifesto, stick to your weekly sprints, and log your progress daily. Use the project tracker to note what you built, what blocked you, and what you're celebrating. When you have a working version, invite your early signups and the community to be your first testers.",
      sequence: 1,
      content: "",
      estimated_in_app_minutes: 15,
      estimated_off_app_minutes: 10080,
      grant_points_bonus: 100,
      is_optional: false,
      mission_id: "mission6",
      content_path: "content/mission6/quests/build-your-msp.md",
      persona_name: "The Builder",
      persona_prompt: "You are an encouraging coach helping a founder stay focused during the build phase. Celebrate their wins. Help them think through blockers. Remind them: progress over perfection. Every day they build is a win.",
      required_context: ["user_profiles", "projects"],
      badge_key_reward: "BUILDER",
      tasks: [
        {
          id: "m6_q1_t1_build_sprint",
          title: "Build your MSP",
          sequence: 1,
          type: "action",
          component_key: "BuildSprintTracker",
          grant_points: 50,
          estimated_minutes: 10080,
          description: "It's time. Build the smallest version of your solution that someone will pay for. Follow your Build Manifesto and Weekly Sprint from Mission 5. Log your progress daily using the project tracker. What did you build today? What's blocking you? When you have a working version, post to the community and reach out to your early signups to be your first testers.",
          mission_id: "mission6",
          quest_id: "mission6_quest1",
          execution_environment: "off_app",
          checkback_delay_days: 3,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Stay Focused During the Build", 
                type: "blog", 
                path_or_url: "content/blog/stay-focused-build.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The 80/20 Rule for Building", 
                type: "blog", 
                path_or_url: "content/blog/80-20-building.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "How to Announce You're Ready for Testers", 
                type: "blog", 
                path_or_url: "content/blog/announce-testers.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m6_q1_t2_milestone_check",
          title: "Weekly milestone check",
          sequence: 2,
          type: "form",
          component_key: "MilestoneCheck",
          grant_points: 25,
          estimated_minutes: 15,
          description: "End of week check-in. Did you hit your weekly milestone? If yes—great! If not—what happened? What needs to change? Update your plan for next week. This keeps you accountable and moving forward.",
          mission_id: "mission6",
          quest_id: "mission6_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Recover from a Missed Milestone", 
                type: "blog", 
                path_or_url: "content/blog/recover-milestone.md", 
                subtitle: "4 min read" 
              }
            ],
            reflection_prompt: "What's the biggest lesson from this week's build? What will you do differently next week?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m6_q1_t3_blocker_log",
          title: "Log your blockers",
          sequence: 3,
          type: "form",
          component_key: "BlockerLog",
          grant_points: 15,
          estimated_minutes: 10,
          description: "What's slowing you down? Tech issues? Time? Motivation? Skills? Be honest. Identify the blocker and plan how to overcome it. If you're stuck, reach out to the community.",
          mission_id: "mission6",
          quest_id: "mission6_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Unblock Yourself", 
                type: "blog", 
                path_or_url: "content/blog/unblock-yourself.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "When to Ask for Help", 
                type: "blog", 
                path_or_url: "content/blog/ask-for-help.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest2: {
      id: "mission6_quest2",
      slug: "get-it-in-front-of-people",
      title: "Get It in Front of People",
      subtitle: "Test with real users",
      description: "You've built something. Now it's time to see if it actually works. You have testers from your early signups and the Urge community ready to try it. In this quest, you'll run the alpha test, synthesize feedback, and decide if you need to pivot or persevere. This is the moment of truth.",
      sequence: 2,
      content: "",
      estimated_in_app_minutes: 45,
      estimated_off_app_minutes: 480,
      grant_points_bonus: 100,
      is_optional: false,
      mission_id: "mission6",
      content_path: "content/mission6/quests/get-it-in-front-of-people.md",
      persona_name: "The Tester",
      persona_prompt: "You help founders test their products with real users. Encourage them to be open to feedback. Remind them: feedback is data, not criticism. Help them see patterns in what testers say.",
      required_context: ["user_profiles", "projects"],
      badge_key_reward: "USER_TESTED",
      tasks: [
        {
          id: "m6_q2_t1_alpha_test",
          title: "Run the alpha test",
          sequence: 1,
          type: "action",
          component_key: "AlphaTestLog",
          grant_points: 30,
          estimated_minutes: 240,
          description: "Share your MSP with your testers (from your early signups and the Urge community). Give them access. Watch them use it. Take notes. What's confusing? What's missing? What surprised you? Did it solve their problem? Log your findings in the project tracker.",
          mission_id: "mission6",
          quest_id: "mission6_quest2",
          execution_environment: "off_app",
          checkback_delay_days: 5,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Run an Alpha Test", 
                type: "blog", 
                path_or_url: "content/blog/run-alpha-test.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "Alpha Test Feedback Template", 
                type: "download", 
                path_or_url: "/resources/alpha-feedback-template.pdf" 
              },
              { 
                title: "Observing Users Without Interrupting", 
                type: "blog", 
                path_or_url: "content/blog/observe-users.md", 
                subtitle: "5 min read" 
              }
            ],
            reflection_prompt: "What's the one thing that surprised you most about how people used your product?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m6_q2_t2_feedback_synthesis",
          title: "Synthesize feedback",
          sequence: 2,
          type: "form",
          component_key: "FeedbackSynthesis",
          grant_points: 25,
          estimated_minutes: 30,
          description: "Review all the feedback. What patterns emerged? What's working? What's NOT working? What needs to change? What's the most important thing you learned? This synthesis will guide your next steps.",
          mission_id: "mission6",
          quest_id: "mission6_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Synthesize User Feedback", 
                type: "blog", 
                path_or_url: "content/blog/synthesize-feedback.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The 3 Most Important Questions to Ask", 
                type: "blog", 
                path_or_url: "content/blog/3-questions-feedback.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m6_q2_t3_pivot_decision",
          title: "Pivot or persevere?",
          sequence: 3,
          type: "form",
          component_key: "PivotDecision",
          grant_points: 25,
          estimated_minutes: 15,
          description: "Based on tester feedback, what's your decision? Is this working? Do you need to pivot? Do you need to make changes? This is the moment of truth. Be honest with yourself.",
          mission_id: "mission6",
          quest_id: "mission6_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Know When to Pivot", 
                type: "blog", 
                path_or_url: "content/blog/when-to-pivot.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "The Pivot Decision Framework", 
                type: "blog", 
                path_or_url: "content/blog/pivot-framework.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest3: {
      id: "mission6_quest3",
      slug: "get-paid-and-launch-internally",
      title: "Get Paid & Launch Internally",
      subtitle: "Pre-sales and internal launch",
      description: "You've built and tested. Now it's time to get paid. You'll create a pre-sale offer and reach out to your network, the Urge community, and your social channels. The key: only pre-sell what you can handle. This is also your internal launch—getting your first real customers and building momentum before the public launch.",
      sequence: 3,
      content: "",
      estimated_in_app_minutes: 30,
      estimated_off_app_minutes: 240,
      grant_points_bonus: 75,
      is_optional: false,
      mission_id: "mission6",
      content_path: "content/mission6/quests/get-paid-and-launch-internally.md",
      persona_name: "The Closer",
      persona_prompt: "You help founders sell their first product. Encourage them to be bold but genuine. Remind them: pre-sales are about trust, not pressure. Celebrate every sale—no matter how small. Help them pace themselves—only pre-sell what they can handle.",
      required_context: ["user_profiles", "projects"],
      badge_key_reward: "FIRST_SALE",
      tasks: [
        {
          id: "m6_q3_t1_pre_sale_offer",
          title: "Create your pre-sale offer",
          sequence: 1,
          type: "action",
          component_key: "PreSaleSetup",
          grant_points: 20,
          estimated_minutes: 60,
          description: "Create a simple pre-sale offer. 'Get early access at a special price.' Set it up on your landing page. This is your first real test: Will people actually pay for this? Use Stripe, Razorpay, or whatever payment platform works for you. Only pre-sell volumes you can realistically handle.",
          mission_id: "mission6",
          quest_id: "mission6_quest3",
          execution_environment: "off_app",
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Set Up Pre-Sales", 
                type: "blog", 
                path_or_url: "content/blog/setup-pre-sales.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "Pre-Sale Pricing Strategies", 
                type: "blog", 
                path_or_url: "content/blog/pre-sale-pricing.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Payment Platform Setup Guide", 
                type: "blog", 
                path_or_url: "content/blog/payment-platforms.md", 
                subtitle: "7 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m6_q3_t2_internal_launch_reachout",
          title: "Reach out to your network, community, and socials",
          sequence: 2,
          type: "action",
          component_key: "InternalLaunchReachout",
          grant_points: 30,
          estimated_minutes: 120,
          description: "This is your internal launch. Share your pre-sale offer with: 1) Your personal network (friends, family, colleagues), 2) The Urge community (post your offer), 3) Your social channels (one post announcing the pre-sale). Track who buys. This is your first real revenue—and your first real customers.",
          mission_id: "mission6",
          quest_id: "mission6_quest3",
          execution_environment: "off_app",
          checkback_delay_days: 3,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Launch Internally", 
                type: "blog", 
                path_or_url: "content/blog/launch-internally.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Internal Launch Outreach Templates", 
                type: "download", 
                path_or_url: "/resources/internal-launch-templates.pdf" 
              },
              { 
                title: "Community Post Template for Pre-Sales", 
                type: "blog", 
                path_or_url: "content/blog/community-pre-sale-post.md", 
                subtitle: "4 min read" 
              }
            ],
            reflection_prompt: "Who bought? What did they say? How did it feel to get your first real revenue? If you didn't hit your target, what held people back?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m6_q3_t3_first_sales_log",
          title: "Log your first sales",
          sequence: 3,
          type: "form",
          component_key: "FirstSalesLog",
          grant_points: 25,
          estimated_minutes: 15,
          description: "How many pre-sales? Who bought? How much revenue? What did they say? This is proof that people will pay for what you're building. Celebrate this—it's a huge milestone. If you didn't hit your target, that's data too—what would you do differently?",
          mission_id: "mission6",
          quest_id: "mission6_quest3",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Track Pre-Sales", 
                type: "blog", 
                path_or_url: "content/blog/track-pre-sales.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "What to Do If You Didn't Get Pre-Sales", 
                type: "blog", 
                path_or_url: "content/blog/no-pre-sales.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest4: {
      id: "mission6_quest4",
      slug: "validate-and-prepare-for-launch",
      title: "Validate & Prepare for Public Launch",
      subtitle: "Final validation before public launch",
      description: "You've built, tested, sold, and launched internally. Now it's time to check everything one last time before the public launch. Review your compliance checklist, do a final readiness check, and make the launch decision. You're almost there.",
      sequence: 4,
      content: "",
      estimated_in_app_minutes: 30,
      estimated_off_app_minutes: 30,
      grant_points_bonus: 100,
      is_optional: false,
      mission_id: "mission6",
      content_path: "content/mission6/quests/validate-and-prepare-for-launch.md",
      persona_name: "The Inspector",
      persona_prompt: "You help founders do their final pre-launch checks. Be thorough but pragmatic. Help them distinguish between 'must-have' and 'nice-to-have.' Encourage them to launch even if everything isn't perfect.",
      required_context: ["user_profiles", "projects"],
      badge_key_reward: "LAUNCH_READY",
      tasks: [
        {
          id: "m6_q4_t1_compliance_check",
          title: "Review your compliance checklist",
          sequence: 1,
          type: "form",
          component_key: "PreLaunchComplianceCheck",
          grant_points: 25,
          estimated_minutes: 20,
          description: "Remember the compliance checklist from Mission 3? Review it. Have you handled everything that's required? What's still pending? What can wait until after launch? Mark what's done and note what's pending.",
          mission_id: "mission6",
          quest_id: "mission6_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Pre-Launch Legal Checklist", 
                type: "blog", 
                path_or_url: "content/blog/pre-launch-legal.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "What Can Wait Until After Launch", 
                type: "blog", 
                path_or_url: "content/blog/what-can-wait.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m6_q4_t2_launch_readiness",
          title: "Do your launch readiness review",
          sequence: 2,
          type: "form",
          component_key: "LaunchReadinessReview",
          grant_points: 25,
          estimated_minutes: 15,
          description: "Everything in place? Product works? People are paying? Feedback is positive? Compliance is handled? Waitlist is growing? You're ready to launch. Check all the boxes and be honest with yourself.",
          mission_id: "mission6",
          quest_id: "mission6_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The Launch Readiness Checklist", 
                type: "blog", 
                path_or_url: "content/blog/launch-readiness.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "What to Do the Week Before Launch", 
                type: "blog", 
                path_or_url: "content/blog/week-before-launch.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m6_q4_t3_launch_decision",
          title: "Make the launch decision",
          sequence: 3,
          type: "form",
          component_key: "LaunchDecision",
          grant_points: 50,
          estimated_minutes: 15,
          description: "Are you ready? If yes, let's move to Mission 7 and launch publicly. If no, what's missing? What's the one thing you need to do before you're ready? This is your final decision point before the public launch.",
          mission_id: "mission6",
          quest_id: "mission6_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Know You're Ready to Launch", 
                type: "blog", 
                path_or_url: "content/blog/ready-to-launch.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Launch Anxiety: How to Push Through", 
                type: "blog", 
                path_or_url: "content/blog/launch-anxiety.md", 
                subtitle: "4 min read" 
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