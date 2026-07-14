// lib/playbook/mission7.ts
import { Mission } from "@/types/playbook";

export const mission7: Mission = {
  id: "mission7",
  title: "The Public Launch & Market Engine",
  sequence: 7,
  video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
  briefing_text: "You've launched internally, made pre-sales, and validated your product. Now it's time to go public. This mission is about launching to the world and building a sustainable customer acquisition engine. Over the next quarter, you'll focus on two parallel tracks: launching and marketing, and building a sales pipeline that brings in new customers consistently.",
  content: "",
  content_path: "content/mission7/mission.md",
  prerequisites: [
    {
      item: "Completed Mission 6 (Internal Launch & Pre-Sales)",
      promptRawText: "You should have launched internally and have real pre-sales before going public. Complete Mission 6 first."
    },
    {
      item: "A live product people can buy",
      promptRawText: "Your product should be ready for public consumption. It doesn't have to be perfect—it has to be buyable."
    },
    {
      item: "Commitment to 3 months of focused effort",
      promptRawText: "Building a customer engine takes time. This mission runs for a full quarter."
    }
  ],
  quests: {
    quest1: {
      id: "mission7_quest1",
      slug: "launch-and-market-engine",
      title: "Launch & Market Engine",
      subtitle: "Go public and build your marketing machine",
      description: "This is your public launch. You'll announce your product to the world, set up your marketing channels, build a content engine, and create a sales pipeline. This quest runs for 6-8 weeks—you'll be doing multiple things in parallel, not sequentially.",
      sequence: 1,
      content: "",
      estimated_in_app_minutes: 120,
      estimated_off_app_minutes: 10080,
      is_optional: false,
      mission_id: "mission7",
      content_path: "content/mission7/quests/launch-and-market-engine.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Marketer",
        persona_prompt: "You help founders launch publicly and build marketing engines. Encourage them to think about channels that work for their audience. Remind them: marketing is a system, not a one-time event. Help them stay consistent.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 150,
          badge_key: "PUBLIC_LAUNCHED"
        }
      },
      tasks: [
        {
          id: "m7_q1_t1_public_launch",
          title: "Execute your public launch",
          sequence: 1,
          type: "action",
          component_key: "PublicLaunch",
          grant_points: 50,
          estimated_minutes: 120,
          description: "It's time. Announce your product to the world. Post on your primary channel, share in relevant communities, send to your email list. This is your public launch—make it count. Share your story, your why, and what you're offering.",
          mission_id: "mission7",
          quest_id: "mission7_quest1",
          execution_environment: "off_app",
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Execute a Public Launch", 
                type: "blog", 
                path_or_url: "content/blog/public-launch.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "Launch Announcement Template", 
                type: "download", 
                path_or_url: "/resources/launch-announcement-template.pdf" 
              }
            ],
            reflection_prompt: "How did the public launch feel? What response did you get? What surprised you?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m7_q1_t2_marketing_channels",
          title: "Set up your marketing channels",
          sequence: 2,
          type: "action",
          component_key: "MarketingChannelSetup",
          grant_points: 30,
          estimated_minutes: 120,
          description: "Set up all your marketing channels: Email newsletter, social media, content platform (blog/YouTube/podcast). Make sure everything links back to your product. You don't need to be everywhere—just where your customers are.",
          mission_id: "mission7",
          quest_id: "mission7_quest1",
          execution_environment: "off_app",
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The 5 Marketing Channels Every Founder Needs", 
                type: "blog", 
                path_or_url: "content/blog/5-marketing-channels.md", 
                subtitle: "7 min read" 
              },
              { 
                title: "Email Newsletter Setup Guide", 
                type: "blog", 
                path_or_url: "content/blog/newsletter-setup.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m7_q1_t3_content_engine",
          title: "Start your content engine",
          sequence: 3,
          type: "action",
          component_key: "ContentEngine",
          grant_points: 25,
          estimated_minutes: 180,
          description: "Publish your first 3 pieces of content. Blog posts, videos, podcasts, threads—whatever format works for your audience. This is your content engine—consistent, valuable content that attracts customers.",
          mission_id: "mission7",
          quest_id: "mission7_quest1",
          execution_environment: "off_app",
          checkback_delay_days: 7,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Start a Content Engine", 
                type: "blog", 
                path_or_url: "content/blog/content-engine.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "Content Idea Generator", 
                type: "download", 
                path_or_url: "/resources/content-ideas.pdf" 
              }
            ],
            reflection_prompt: "What format felt most natural to you? What content got the most engagement?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m7_q1_t4_sales_pipeline",
          title: "Build your sales pipeline",
          sequence: 4,
          type: "form",
          component_key: "SalesPipelineSetup",
          grant_points: 25,
          estimated_minutes: 60,
          description: "Map out your sales process: How do leads find you? How do you qualify them? What's your outreach sequence? How do you close? This is your sales pipeline—a system for turning strangers into customers.",
          mission_id: "mission7",
          quest_id: "mission7_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Build a Sales Pipeline", 
                type: "blog", 
                path_or_url: "content/blog/sales-pipeline.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "Sales Pipeline Template", 
                type: "download", 
                path_or_url: "/resources/sales-pipeline-template.xlsx" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m7_q1_t5_launch_metrics",
          title: "Set your launch metrics",
          sequence: 5,
          type: "form",
          component_key: "LaunchMetrics",
          grant_points: 20,
          estimated_minutes: 30,
          description: "What does success look like in the first month? Traffic? Signups? Sales? Set 3-5 key metrics. You'll track these weekly to see if your marketing is working.",
          mission_id: "mission7",
          quest_id: "mission7_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The 5 Metrics Every Founder Should Track", 
                type: "blog", 
                path_or_url: "content/blog/5-metrics.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest2: {
      id: "mission7_quest2",
      slug: "gain-new-customers-and-operate",
      title: "Gain New Customers & Operate",
      subtitle: "Build a sustainable customer acquisition engine",
      description: "You've launched. Now you need to consistently bring in new customers. This quest is about outbound sales, referrals, customer support, feedback loops, and revenue tracking. It runs alongside Quest 1—you'll be doing both in parallel.",
      sequence: 2,
      content: "",
      estimated_in_app_minutes: 90,
      estimated_off_app_minutes: 10080,
      is_optional: false,
      mission_id: "mission7",
      content_path: "content/mission7/quests/gain-new-customers-and-operate.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Operator",
        persona_prompt: "You help founders build operational systems for customer acquisition and retention. Remind them: consistency beats intensity. Help them build habits that generate customers day after day.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 150,
          badge_key: "CUSTOMER_ENGINE"
        }
      },
      tasks: [
        {
          id: "m7_q2_t1_weekly_outbound",
          title: "Weekly outbound outreach",
          sequence: 1,
          type: "action",
          component_key: "WeeklyOutbound",
          grant_points: 30,
          estimated_minutes: 120,
          description: "Reach out to 5-10 potential customers every week. Personalize your outreach. Track responses. This is your outbound engine—consistent, personalized outreach that builds relationships.",
          mission_id: "mission7",
          quest_id: "mission7_quest2",
          execution_environment: "off_app",
          checkback_delay_days: null,
          recurring: true,
          interval: "weekly",
          ai_config: {
            recommendations: [
              { 
                title: "How to Do Outbound Sales", 
                type: "blog", 
                path_or_url: "content/blog/outbound-sales.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "Outbound Outreach Templates", 
                type: "download", 
                path_or_url: "/resources/outbound-templates.pdf" 
              }
            ],
            reflection_prompt: "What's working in your outreach? What's not? Who's responding and why?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m7_q2_t2_referral_system",
          title: "Build your referral system",
          sequence: 2,
          type: "form",
          component_key: "ReferralSystem",
          grant_points: 25,
          estimated_minutes: 45,
          description: "Design a simple referral system. How will you ask for referrals? What do you offer in return? Most businesses grow through word-of-mouth—make it easy for happy customers to refer you.",
          mission_id: "mission7",
          quest_id: "mission7_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Build a Referral System", 
                type: "blog", 
                path_or_url: "content/blog/referral-system.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Referral Request Templates", 
                type: "download", 
                path_or_url: "/resources/referral-templates.pdf" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m7_q2_t3_customer_support",
          title: "Set up customer support",
          sequence: 3,
          type: "action",
          component_key: "CustomerSupportSetup",
          grant_points: 20,
          estimated_minutes: 60,
          description: "Set up a simple customer support system. Respond to all inquiries within 24 hours. Happy customers are repeat customers—and they refer others.",
          mission_id: "mission7",
          quest_id: "mission7_quest2",
          execution_environment: "off_app",
          checkback_delay_days: null,
          recurring: true,
          interval: "daily",
          ai_config: {
            recommendations: [
              { 
                title: "How to Set Up Customer Support as a Founder", 
                type: "blog", 
                path_or_url: "content/blog/founder-support.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Support Response Templates", 
                type: "download", 
                path_or_url: "/resources/support-templates.pdf" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m7_q2_t4_feedback_loop",
          title: "Create your feedback loop",
          sequence: 4,
          type: "form",
          component_key: "FeedbackLoop",
          grant_points: 20,
          estimated_minutes: 30,
          description: "How will you capture customer feedback? What questions will you ask? How will you use the feedback to improve? Set up a simple system for continuous feedback.",
          mission_id: "mission7",
          quest_id: "mission7_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The Customer Feedback Loop", 
                type: "blog", 
                path_or_url: "content/blog/feedback-loop.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Feedback Questions Template", 
                type: "download", 
                path_or_url: "/resources/feedback-questions.pdf" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m7_q2_t5_revenue_tracking",
          title: "Track revenue weekly",
          sequence: 5,
          type: "form",
          component_key: "RevenueTracking",
          grant_points: 25,
          estimated_minutes: 15,
          description: "Log your weekly revenue. Track your growth. What's working? What's not? Use this data to make decisions about where to focus your energy.",
          mission_id: "mission7",
          quest_id: "mission7_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: true,
          interval: "weekly",
          ai_config: {
            recommendations: [
              { 
                title: "How to Track Revenue as a Founder", 
                type: "blog", 
                path_or_url: "content/blog/track-revenue.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Revenue Tracking Template", 
                type: "download", 
                path_or_url: "/resources/revenue-tracker.xlsx" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m7_q2_t6_quarterly_review",
          title: "Quarterly review and planning",
          sequence: 6,
          type: "form",
          component_key: "QuarterlyReview",
          grant_points: 50,
          estimated_minutes: 60,
          description: "End of quarter review. What worked? What didn't? How much revenue did you generate? What did you learn about your customers? What's the plan for next quarter? This is where you decide the future of your business.",
          mission_id: "mission7",
          quest_id: "mission7_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Run a Quarterly Business Review", 
                type: "blog", 
                path_or_url: "content/blog/quarterly-review.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "Quarterly Review Template", 
                type: "download", 
                path_or_url: "/resources/quarterly-review-template.pdf" 
              }
            ],
            reflection_prompt: "Looking back at the quarter, what's your biggest lesson? What are you most proud of? What will you do differently next quarter?"
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    }
  }
};