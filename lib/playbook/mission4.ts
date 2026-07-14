// lib/playbook/mission4.ts
import { Mission } from "@/types/playbook";

export const mission4: Mission = {
  id: "mission4",
  title: "How Will You Make Money?",
  sequence: 4,
  video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
  briefing_text: "You've validated the problem, the customer, and the solution. Now let's figure out if this can actually be a business. We'll explore pricing models, go-to-market channels, partnerships, costs, and finally check if the math works. By the end of this mission, you'll know if you have a viable business—or if you need to go back to the drawing board.",
  content: "",
  content_path: "content/mission4/mission.md",
  prerequisites: [
    {
      item: "A validated project from Mission 3",
      promptRawText: "You should have completed Mission 3 and have a project that passed the viability check. If not, go back to Mission 3 and complete it first."
    },
    {
      item: "Customer contacts ready to talk",
      promptRawText: "You'll need to talk to potential customers about pricing and willingness to pay. Make sure you have at least 3-5 contacts from Mission 3 who you can reach out to."
    },
    {
      item: "Openness to changing your idea",
      promptRawText: "This mission might reveal that your idea doesn't work as a business. That's okay! It's better to know now than after you've built it. Be open to pivoting or going back to Mission 2."
    }
  ],
  quests: {
    quest1: {
      id: "mission4_quest1",
      slug: "what-will-you-charge",
      title: "What Will You Charge?",
      subtitle: "Define your pricing model and price points",
      description: "Your pricing model shapes everything—how customers perceive your value, how much revenue you can generate, and how your business grows. In this quest, you'll explore different pricing models, talk to customers about what they'd pay, and set your initial price.",
      sequence: 1,
      content: "",
      estimated_in_app_minutes: 90,
      estimated_off_app_minutes: 120,
      is_optional: false,
      mission_id: "mission4",
      content_path: "content/mission4/quests/what-will-you-charge.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Economist",
        persona_prompt: "You are a pricing strategist. Help the user think through their pricing model and price points. Challenge them to think about value, not just cost. Help them talk to customers about price without being pushy.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 75,
          badge_key: "PRICE_SETTER"
        }
      },
      tasks: [
        {
          id: "m4_q1_t1_pricing_models",
          title: "Explore pricing models",
          sequence: 1,
          type: "form",
          component_key: "PricingModelExplorer",
          grant_points: 25,
          estimated_minutes: 30,
          description: "How will you charge? One-time payment? Subscription? Usage-based? Freemium? Tiered? Each model has different implications for your business. Explore what fits your product and your customers.",
          mission_id: "mission4",
          quest_id: "mission4_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The 5 Most Common Pricing Models", 
                type: "blog", 
                path_or_url: "content/blog/pricing-models-guide.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "Subscription vs. One-Time: Which Is Right for You?", 
                type: "blog", 
                path_or_url: "content/blog/subscription-vs-one-time.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Pricing Model Decision Matrix", 
                type: "download", 
                path_or_url: "/resources/pricing-matrix.xlsx" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m4_q1_t2_willingness_to_pay",
          title: "Ask customers what they'd pay",
          sequence: 2,
          type: "action",
          component_key: "WillingnessToPayWidget",
          grant_points: 30,
          estimated_minutes: 90,
          description: "This is the most important conversation you'll have. Reach out to your customer contacts and ask: 'What would you pay for a solution to this problem?' Don't lead them—listen. If they say 'nothing,' that's valuable data. If they name a price, that's gold.",
          mission_id: "mission4",
          quest_id: "mission4_quest1",
          execution_environment: "off_app",
          checkback_delay_days: 3,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Ask About Pricing Without Being Awkward", 
                type: "blog", 
                path_or_url: "content/blog/ask-about-pricing.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The One Question That Tells You If You Have a Business", 
                type: "blog", 
                path_or_url: "content/blog/the-one-question.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Pricing Interview Template", 
                type: "download", 
                path_or_url: "/resources/pricing-interview-template.pdf" 
              }
            ],
            reflection_prompt: "What did customers say they'd pay? Did anyone name a price without hesitation? Did anyone say 'it depends'? What surprised you most about these conversations?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m4_q1_t3_set_your_price",
          title: "Set your price",
          sequence: 3,
          type: "form",
          component_key: "PriceSetter",
          grant_points: 20,
          estimated_minutes: 20,
          description: "Based on your research, set your price. Compare to competitors. Consider what customers said. Trust your gut. Remember: you can always change it later. The important thing is to pick a number and move forward.",
          mission_id: "mission4",
          quest_id: "mission4_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Pick Your First Price", 
                type: "blog", 
                path_or_url: "content/blog/pick-your-first-price.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The Psychology of Pricing", 
                type: "blog", 
                path_or_url: "content/blog/psychology-of-pricing.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "Price as a Signal of Quality", 
                type: "blog", 
                path_or_url: "content/blog/price-as-signal.md", 
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
      id: "mission4_quest2",
      slug: "how-will-you-reach-them",
      title: "How Will You Reach Them?",
      subtitle: "Define your go-to-market channels",
      description: "Having a great product means nothing if people don't know about it. How will you reach your customers? In this quest, you'll explore different channels, design a small experiment to test one or two, and estimate how much it'll cost to acquire a customer.",
      sequence: 2,
      content: "",
      estimated_in_app_minutes: 75,
      estimated_off_app_minutes: 120,
      is_optional: false,
      mission_id: "mission4",
      content_path: "content/mission4/quests/how-will-you-reach-them.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Marketer",
        persona_prompt: "You are a practical marketing strategist. Help the user think through how to reach their customers. Encourage them to start small and test cheaply. Help them think about cost per acquisition and what's sustainable.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 50,
          badge_key: "MARKET_STRATEGIST"
        }
      },
      tasks: [
        {
          id: "m4_q2_t1_channel_exploration",
          title: "Explore your channels",
          sequence: 1,
          type: "form",
          component_key: "ChannelExplorer",
          grant_points: 20,
          estimated_minutes: 30,
          description: "How will you reach your customers? Direct sales, content marketing, paid ads, partnerships, marketplaces, referrals, social media, cold outreach, SEO, events. Each channel works differently. Which ones fit your customer, your product, and your skills?",
          mission_id: "mission4",
          quest_id: "mission4_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The 10 Most Common Acquisition Channels", 
                type: "blog", 
                path_or_url: "content/blog/acquisition-channels.md", 
                subtitle: "7 min read" 
              },
              { 
                title: "How to Choose Your First Channel", 
                type: "blog", 
                path_or_url: "content/blog/choose-first-channel.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Channel Fit: What Works for Your Customer", 
                type: "blog", 
                path_or_url: "content/blog/channel-fit.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m4_q2_t2_channel_experiment",
          title: "Design a channel experiment",
          sequence: 2,
          type: "action",
          component_key: "ChannelExperimentPlanner",
          grant_points: 25,
          estimated_minutes: 60,
          description: "Pick 1-2 channels that seem most promising. Design a small, cheap experiment to test them. Could you reach out to 20 people directly? Post 10 times on social media? Run a $50 ad test? The goal is to learn, not to succeed.",
          mission_id: "mission4",
          quest_id: "mission4_quest2",
          execution_environment: "off_app",
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Run a Marketing Experiment", 
                type: "blog", 
                path_or_url: "content/blog/marketing-experiment.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The $50 Marketing Test", 
                type: "blog", 
                path_or_url: "content/blog/50-dollar-test.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Experiment Tracker Template", 
                type: "download", 
                path_or_url: "/resources/experiment-tracker.xlsx" 
              }
            ],
            reflection_prompt: "What channel are you most excited about? What worries you about it? What would make you consider this experiment a success?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m4_q2_t3_acquisition_cost",
          title: "Estimate your acquisition cost",
          sequence: 3,
          type: "form",
          component_key: "AcquisitionCostEstimator",
          grant_points: 20,
          estimated_minutes: 20,
          description: "Based on your channel experiments (or your best guess), what will it cost to acquire a customer? Time, money, and effort. Compare this to what they'll pay. If the numbers don't work, that's good to know now.",
          mission_id: "mission4",
          quest_id: "mission4_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Calculate Customer Acquisition Cost", 
                type: "blog", 
                path_or_url: "content/blog/calculate-cac.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The Relationship Between CAC and LTV", 
                type: "blog", 
                path_or_url: "content/blog/cac-ltv.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "When Is a Channel Worth Pursuing?", 
                type: "blog", 
                path_or_url: "content/blog/when-is-channel-worth-it.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest3: {
      id: "mission4_quest3",
      slug: "who-can-help-you-sell",
      title: "Who Can Help You Sell?",
      subtitle: "Identify partners and channels",
      description: "You don't have to do everything yourself. Partners can help you reach customers faster, cheaper, and more effectively. In this quest, you'll map potential partners, reach out to a few, and explore what a partnership might look like.",
      sequence: 3,
      content: "",
      estimated_in_app_minutes: 45,
      estimated_off_app_minutes: 90,
      is_optional: false,
      mission_id: "mission4",
      content_path: "content/mission4/quests/who-can-help-you-sell.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Connector",
        persona_prompt: "You help founders think about partnerships and distribution. Help them identify potential partners who already have access to their customers. Encourage them to think creatively—partners don't have to be formal, they can be complementary businesses, influencers, or even customers.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 50,
          badge_key: "PARTNERSHIP_BUILDER"
        }
      },
      tasks: [
        {
          id: "m4_q3_t1_partner_mapping",
          title: "Map potential partners",
          sequence: 1,
          type: "form",
          component_key: "PartnerMapper",
          grant_points: 20,
          estimated_minutes: 25,
          description: "Who already has access to your customers? Complementary businesses? Influencers? Community leaders? Other service providers? Industry associations? Make a list. Think creatively—partners can be anyone who can refer customers to you.",
          mission_id: "mission4",
          quest_id: "mission4_quest3",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Find Business Partners", 
                type: "blog", 
                path_or_url: "content/blog/find-business-partners.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The Art of the Partnership Ask", 
                type: "blog", 
                path_or_url: "content/blog/art-of-partnership-ask.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Partnership Models That Work", 
                type: "blog", 
                path_or_url: "content/blog/partnership-models.md", 
                subtitle: "6 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m4_q3_t2_partner_outreach",
          title: "Reach out to potential partners",
          sequence: 2,
          type: "action",
          component_key: "PartnerOutreachWidget",
          grant_points: 30,
          estimated_minutes: 60,
          description: "Reach out to 3 potential partners. Ask: 'I'm building [solution] for [customer]. You already work with these people. Would you be interested in exploring how we could help each other?' Keep it simple. No pressure. Just a conversation.",
          mission_id: "mission4",
          quest_id: "mission4_quest3",
          execution_environment: "off_app",
          checkback_delay_days: 3,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Approach a Potential Partner", 
                type: "blog", 
                path_or_url: "content/blog/approach-partner.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "What to Ask in a Partnership Conversation", 
                type: "blog", 
                path_or_url: "content/blog/partnership-conversation.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Partnership Outreach Template", 
                type: "download", 
                path_or_url: "/resources/partnership-template.pdf" 
              }
            ],
            reflection_prompt: "How did partners respond? What surprised you? What did you learn about how your business fits into the ecosystem?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m4_q3_t3_partnership_plan",
          title: "Plan your partnership strategy",
          sequence: 3,
          type: "form",
          component_key: "PartnershipPlan",
          grant_points: 15,
          estimated_minutes: 15,
          description: "Based on your research and conversations, what's your partnership strategy? Which partners are most promising? What would a win-win partnership look like?",
          mission_id: "mission4",
          quest_id: "mission4_quest3",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Structure a Partnership", 
                type: "blog", 
                path_or_url: "content/blog/structure-partnership.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The 3 Types of Partnerships", 
                type: "blog", 
                path_or_url: "content/blog/3-types-partnerships.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest4: {
      id: "mission4_quest4",
      slug: "what-will-it-cost-you",
      title: "What Will It Cost You?",
      subtitle: "Understand your costs",
      description: "You know what you'll charge. You know how you'll reach customers. Now let's understand what it'll cost you to deliver. In this quest, you'll map your fixed and variable costs, calculate your unit economics, and see if the numbers work.",
      sequence: 4,
      content: "",
      estimated_in_app_minutes: 45,
      estimated_off_app_minutes: 30,
      is_optional: false,
      mission_id: "mission4",
      content_path: "content/mission4/quests/what-will-it-cost-you.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Accountant",
        persona_prompt: "You are a practical financial advisor. Help the user think through their costs and unit economics. Don't scare them with complexity—help them see the simple picture. Help them distinguish between necessary and nice-to-have costs.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 50,
          badge_key: "COST_AWARE"
        }
      },
      tasks: [
        {
          id: "m4_q4_t1_cost_mapping",
          title: "Map your costs",
          sequence: 1,
          type: "form",
          component_key: "CostMapper",
          grant_points: 20,
          estimated_minutes: 25,
          description: "What does it cost to deliver your solution? Fixed costs (rent, software, salaries), variable costs (materials, payment processing, delivery), one-time setup costs. Be honest. Include everything. Don't forget your time.",
          mission_id: "mission4",
          quest_id: "mission4_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Calculate Business Costs", 
                type: "blog", 
                path_or_url: "content/blog/calculate-business-costs.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "Fixed vs. Variable Costs: What's the Difference?", 
                type: "blog", 
                path_or_url: "content/blog/fixed-vs-variable.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Cost Mapping Template", 
                type: "download", 
                path_or_url: "/resources/cost-mapping-template.xlsx" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m4_q4_t2_unit_economics",
          title: "Calculate your unit economics",
          sequence: 2,
          type: "form",
          component_key: "UnitEconomicsCalculator",
          grant_points: 25,
          estimated_minutes: 25,
          description: "For each unit you sell (product, service, subscription, etc.), what's the revenue? What's the cost? What's the margin? This is the most important number in your business. If the margin doesn't work, nothing else matters.",
          mission_id: "mission4",
          quest_id: "mission4_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Unit Economics for Beginners", 
                type: "blog", 
                path_or_url: "content/blog/unit-economics-beginners.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "How to Improve Your Unit Economics", 
                type: "blog", 
                path_or_url: "content/blog/improve-unit-economics.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Unit Economics Calculator", 
                type: "download", 
                path_or_url: "/resources/unit-economics-calculator.xlsx" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m4_q4_t3_cost_reality_check",
          title: "Cost reality check",
          sequence: 3,
          type: "form",
          component_key: "CostRealityCheck",
          grant_points: 15,
          estimated_minutes: 15,
          description: "Look at all your costs. What's absolutely necessary? What could be reduced or eliminated? What could be delayed until later? This is your 'minimum viable cost' exercise—what's the cheapest way to deliver value?",
          mission_id: "mission4",
          quest_id: "mission4_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The Minimum Viable Cost", 
                type: "blog", 
                path_or_url: "content/blog/minimum-viable-cost.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "How to Reduce Business Costs Without Hurting Quality", 
                type: "blog", 
                path_or_url: "content/blog/reduce-costs.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest5: {
      id: "mission4_quest5",
      slug: "does-the-math-work",
      title: "Does the Math Work?",
      subtitle: "Final economics check",
      description: "You've done the work. You know what you'll charge, how you'll reach customers, and what it'll cost. Now let's put it all together and see if the numbers work. If they do, you have a business. If they don't, you have a hobby—and that's okay too.",
      sequence: 5,
      content: "",
      estimated_in_app_minutes: 60,
      estimated_off_app_minutes: 0,
      is_optional: false,
      mission_id: "mission4",
      content_path: "content/mission4/quests/does-the-math-work.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Realist",
        persona_prompt: "You are a grounded advisor who helps founders make hard decisions. Don't be a cheerleader. Challenge their assumptions. Ask the tough questions. Help them see if this is truly viable. If the math doesn't work, help them accept that and move on.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 100,
          badge_key: "ECONOMICS_VERIFIED"
        }
      },
      tasks: [
        {
          id: "m4_q5_t1_breakeven_analysis",
          title: "Calculate your break-even point",
          sequence: 1,
          type: "form",
          component_key: "BreakevenCalculator",
          grant_points: 25,
          estimated_minutes: 25,
          description: "How many customers do you need to cover your costs? At what price? How long will it take to get there? This is the most important number for your business. If you can't see a path to breaking even, it's time to reconsider.",
          mission_id: "mission4",
          quest_id: "mission4_quest5",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Calculate Break-Even Point", 
                type: "blog", 
                path_or_url: "content/blog/breakeven-calculator.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "What If You Never Break Even?", 
                type: "blog", 
                path_or_url: "content/blog/never-breakeven.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Break-Even Calculator Template", 
                type: "download", 
                path_or_url: "/resources/breakeven-calculator.xlsx" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m4_q5_t2_scenario_planning",
          title: "Scenario planning",
          sequence: 2,
          type: "form",
          component_key: "ScenarioPlanner",
          grant_points: 20,
          estimated_minutes: 20,
          description: "Best case: everything goes right. Worst case: everything goes wrong. Expected case: probably somewhere in between. Run all three. If the worst case is survivable and the expected case is good, you have a business.",
          mission_id: "mission4",
          quest_id: "mission4_quest5",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Scenario Plan Your Business", 
                type: "blog", 
                path_or_url: "content/blog/scenario-planning.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The Worst Case Test", 
                type: "blog", 
                path_or_url: "content/blog/worst-case-test.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Scenario Planning Template", 
                type: "download", 
                path_or_url: "/resources/scenario-planning.xlsx" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m4_q5_t3_final_economics_decision",
          title: "The final economics decision",
          sequence: 3,
          type: "form",
          component_key: "FinalEconomicsDecision",
          grant_points: 25,
          estimated_minutes: 15,
          description: "Look at everything: Pricing, channels, partnerships, costs, break-even, scenarios. Does the math work? Are you excited? Is this worth your time? If yes, you have a viable business. If no, that's okay—go back to Mission 2 and pick a different opportunity.",
          mission_id: "mission4",
          quest_id: "mission4_quest5",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Know If You Have a Business", 
                type: "blog", 
                path_or_url: "content/blog/know-if-you-have-business.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The $100 Test: Is Your Idea Viable?", 
                type: "blog", 
                path_or_url: "content/blog/100-dollar-test.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "When to Quit and When to Persevere", 
                type: "blog", 
                path_or_url: "content/blog/when-to-quit.md", 
                subtitle: "6 min read" 
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