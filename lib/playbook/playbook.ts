import { PlaybookConfig } from "@/types/playbook";

export const UrgePlaybook: PlaybookConfig = {
  mission1: {
    title: "Build Your Founder Mindset",
    sequence: 1,
    video_url: "https://urgetostart.com/videos/m1-overview.mp4",
    briefing_text: "Before we look at business opportunities, we have to look at you. We are going to destroy the overthinking trap and build your real-world resilience.",
    quests: {
      quest1: {
        slug: "your-goals-and-free-time",
        title: "Your Goals & Free Time",
        subtitle: "Be honest about why you are starting and how many hours you actually have.",
        sequence: 1,
        content_path: "playbook/m1-mindset/quests/your-goals-and-free-time.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Mirror",
          persona_prompt: "You are a grounded advisor. Review user profiles and constraints. If they give abstract answers like 'I want to be rich', challenge them to define what concrete personal freedom looks like.",
          required_context: ["user_profiles"],
          on_success: { grant_points: 50, badge_key: "GOALS_SET" }
        },
        tasks: [
          {
            id: "m1_q1_t1_profile",
            title: "Claim Your Public Username",
            type: "form",
            component_key: "ProfileSetupForm",
            sequence: 1
          },
          {
            id: "m1_q1_t2_drivers",
            title: "What is Driving You to Start?",
            type: "form",
            component_key: "MotivationForm",
            sequence: 2
          },
          {
            id: "m1_q1_t3_constraints",
            title: "Set Your Realistic Weekly Limits",
            type: "form",
            component_key: "ConstraintForm",
            sequence: 3
          }
        ]
      },
      quest2: {
        slug: "practice-asking-for-help",
        title: "Practice Asking for Help",
        subtitle: "Get over the fear of reaching out and learn to write short, direct requests.",
        sequence: 2,
        content_path: "playbook/m1-mindset/quests/practice-asking-for-help.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Editor",
          persona_prompt: "You are an expert copywriter. Review message drafts. Flag vague phrases like 'pick your brain' or apologetic filler copy, and provide a direct alternative.",
          required_context: ["user_profiles"],
          on_success: { grant_points: 50, badge_key: "ASK_MUSCLE" }
        },
        tasks: [
          {
            id: "m1_q2_t1_ask_sim",
            title: "The Messaging Simulator",
            type: "simulator",
            component_key: "AskSimulator",
            sequence: 1
          },
          {
            id: "m1_q2_t2_public_intent",
            title: "Share Your Commitment Publicly",
            type: "action",
            component_key: "SocialShareWidget",
            sequence: 2
          }
        ]
      },
      quest3: {
        slug: "get-comfortable-hearing-no",
        title: "Get Comfortable Hearing No",
        subtitle: "Go into the real world and get rejected on purpose to see that it won't kill you.",
        sequence: 3,
        content_path: "playbook/m1-mindset/quests/get-comfortable-hearing-no.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Hype-Man",
          persona_prompt: "You are an encouraging coach. The user is logging rejections. Reframe their entries as clean customer data point upgrades.",
          required_context: ["user_profiles"],
          on_success: { grant_points: 100, badge_key: "REJECTION_PROOF" }
        },
        tasks: [
          {
            id: "m1_q3_t1_rejection_log",
            title: "Log 3 Real-World Rejections",
            type: "log_counter",
            component_key: "RejectionCounterForm",
            sequence: 1
          },
          {
            id: "m1_q3_t2_club_unlock",
            title: "Open the Rejection Club Feed",
            type: "community",
            component_key: "CommunityFeedTeaser",
            sequence: 2
          }
        ]
      }
    }
  },
  mission2: {
    title: "Find Problems Worth Solving",
    sequence: 2,
    video_url: "https://urgetostart.com/videos/m2-overview.mp4",
    briefing_text: "Businesses aren't invented; they are noticed. Stop searching for random ideas and begin tracking structural real-world friction.",
    quests: {
      quest1: {
        slug: "your-own-pain-and-skills",
        title: "Your Own Pain & Skills",
        subtitle: "Look at what annoys you in your weekly routine, and what you are already good at doing.",
        sequence: 1,
        content_path: "playbook/m2-opportunities/quests/your-own-pain-and-skills.md",
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
            title: "Log 3 Inconveniences From Your Week",
            type: "form",
            component_key: "PersonalPainLogForm",
            sequence: 1
          },
          {
            id: "m2_q1_t2_skills_inventory",
            title: "List Things You Do Better Than Average",
            type: "form",
            component_key: "SkillTagBuilder",
            sequence: 2
          }
        ]
      },
      quest2: {
        slug: "the-people-around-you",
        title: "The People Around You",
        subtitle: "Watch your friends, classmates, or co-workers and notice where they struggle.",
        sequence: 2,
        content_path: "playbook/m2-opportunities/quests/the-people-around-you.md",
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
            title: "Select the Groups You Spend Time With",
            type: "form",
            component_key: "CircleTagMatrix",
            sequence: 1
          },
          {
            id: "m2_q2_t2_friction_log",
            title: "Log 2 Clumsy Shortcuts You Saw Someone Use",
            type: "form",
            component_key: "CircleObservationForm",
            sequence: 2
          }
        ]
      },
      quest3: {
        slug: "the-internet-safari",
        title: "The Internet Safari",
        subtitle: "Scan online comment sections, reviews, and forums to find real complaints.",
        sequence: 3,
        content_path: "playbook/m2-opportunities/quests/the-internet-safari.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Signal Filter",
          persona_prompt: "Evaluate online data logs. Help the user avoid short fads and focus on long macro waves.",
          required_context: ["user_profiles"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m2_q3_t1_safari_grab",
            title: "Find 2 Complaints Posted Natively Online",
            type: "form",
            component_key: "DigitalSafariLogForm",
            sequence: 1
          }
        ]
      },
      quest4: {
        slug: "discovery-simulator",
        title: "The Practice Interview Game",
        subtitle: "Test your conversation skills with a simulated customer before talking to real humans.",
        sequence: 4,
        content_path: "playbook/m2-opportunities/quests/discovery-simulator.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "Alex the Busy Creative",
          persona_prompt: "Simulate a highly skeptical buyer named Alex. Act short and defensive unless the user asks open, historical questions about your past workflows.",
          required_context: ["user_profiles"],
          on_success: { grant_points: 100, badge_key: "SIM_PASSED" }
        },
        tasks: [
          {
            id: "m2_q4_t1_chat_roleplay",
            title: "Uncover Alex's True Past Problems Without Pitching",
            type: "simulator",
            component_key: "LiveChatRoleplayWidget",
            sequence: 1
          }
        ]
      },
      quest5: {
        slug: "pain-index-and-final-cut",
        title: "Rate the Pain & Make a Choice",
        subtitle: "Talk to 3 real people, grade their frustration, and pick your primary focus.",
        sequence: 5,
        content_path: "playbook/m2-opportunities/quests/pain-index-and-final-cut.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Ruthless Judge",
          persona_prompt: "Review logged ideas side-by-side. Rank them on alignment with user profile constraints and pain level metrics.",
          required_context: ["user_profiles", "opportunities"],
          on_success: { grant_points: 100, badge_key: "OPPORTUNITY_LOCKED" }
        },
        tasks: [
          {
            id: "m2_q5_t1_interview_log",
            title: "Log 3 Real Validation Conversations",
            type: "form",
            component_key: "PainIndexTrackerForm",
            sequence: 1
          },
          {
            id: "m2_q5_t2_synthesize_cut",
            title: "Pick the One Idea You Will Commit To",
            type: "action",
            component_key: "OpportunityDecisionBoard",
            sequence: 2
          }
        ]
      }
    }
  },
  mission3: {
    title: "Check Your Project's Viability",
    sequence: 3,
    video_url: "https://urgetostart.com/videos/m3-overview.mp4",
    briefing_text: "Transform a vague problem space into an unshakeable profile structure with direct, actionable math.",
    quests: {
      quest1: {
        slug: "describe-your-exact-buyer",
        title: "Describe Your Exact Buyer",
        subtitle: "Get clear on the specific type of person who experiences this problem.",
        sequence: 1,
        content_path: "playbook/m3-viability/quests/describe-your-exact-buyer.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Profiler",
          persona_prompt: "Review customer configurations. Reject broad entries like 'small businesses' and push for specialized target categories.",
          required_context: ["user_profiles", "opportunities"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m3_q1_t1_five_word_group",
            title: "Summarize Your Buyer in 5 Words or Less",
            type: "form",
            component_key: "StringValidationInput",
            sequence: 1
          },
          {
            id: "m3_q1_t2_psychographics",
            title: "Identify Their Daily Fears & Online Hangouts",
            type: "form",
            component_key: "PsychographicMapForm",
            sequence: 2
          }
        ]
      },
      quest2: {
        slug: "choose-how-you-package-it",
        title: "Choose How You Package It",
        subtitle: "Look at the different ways to sell your solution before picking one format.",
        sequence: 2,
        content_path: "playbook/m3-viability/quests/choose-how-you-package-it.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Architect",
          persona_prompt: "Map the validated problem text cleanly across alternative models: service, app, directory, or guidebook.",
          required_context: ["user_profiles", "opportunities"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m3_q2_t1_model_generator",
            title: "Compare Alternative Business Options",
            type: "simulator",
            component_key: "SolutionScaffoldViewer",
            sequence: 1
          },
          {
            id: "m3_q2_t2_lock_vehicle",
            title: "Select Your Starting Offer Style",
            type: "action",
            component_key: "ModelSelectionNode",
            sequence: 2
          }
        ]
      },
      quest3: {
        slug: "market-sizing",
        title: "Optional Adventure: Scale & Ceiling",
        subtitle: "Calculate your theoretical long-term market limits if you want to grow big.",
        sequence: 3,
        content_path: "playbook/m3-viability/quests/market-sizing.md",
        is_optional: true,
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Category Analyst",
          persona_prompt: "You are a top-down market research utility. Help the user find directionally correct baseline categories size metrics using clean logic.",
          required_context: ["user_profiles", "opportunities"],
          on_success: { grant_points: 25 }
        },
        tasks: [
          {
            id: "m3_q3_t1_top_down_ceiling",
            title: "Calculate Your Category & Segment Ceiling",
            type: "form",
            component_key: "TopDownSizingCalculator",
            sequence: 1
          }
        ]
      },
      quest4: {
        slug: "finding-your-first-customers",
        title: "Finding Your First Customers",
        subtitle: "Map out exactly where your first 10 paying customers are hiding.",
        sequence: 4,
        content_path: "playbook/m3-viability/quests/finding-your-first-customers.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Reality Engine",
          persona_prompt: "Review outreach projections. Evaluate if the pricing floor vs outreach goals matches the income targets in their profile. If it drops into a heavy deficit, trigger a pivot validation pathway.",
          required_context: ["user_profiles", "opportunities"],
          on_success: { grant_points: 100, badge_key: "PROJECT_MINTED" }
        },
        tasks: [
          {
            id: "m3_q4_t1_locate_cohorts",
            title: "List 3 Specific Groups or Channels Where Your Buyers Gather",
            type: "form",
            component_key: "WateringHoleForm",
            sequence: 1
          },
          {
            id: "m3_q4_t2_urge_equation",
            title: "Calculate Your Realistic Year 1 Sales Goal",
            type: "form",
            component_key: "RealityEquationCalculator",
            sequence: 2
          },
          {
            id: "m3_q4_t3_mint_project",
            title: "Confirm and Officially Open Your Workspace",
            type: "action",
            component_key: "ProjectMintingButton",
            sequence: 3
          }
        ]
      }
    }
  },
  mission4: {
    title: "Designing Your Money System",
    sequence: 4,
    video_url: "https://urgetostart.com/videos/m4-overview.mp4",
    briefing_text: "A business is an interconnected system. Map out your messaging, routes, activities, and profit margins across 5 clear, focused steps.",
    quests: {
      quest1: {
        slug: "thinking-about-your-solution",
        title: "Thinking About Your Solution",
        subtitle: "Frame your value hooks and choose your customer communication style.",
        sequence: 1,
        content_path: "playbook/m4-money-system/quests/thinking-about-your-solution.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Value Editor",
          persona_prompt: "Review solution configurations. Reject boring feature descriptions and force users to highlight time or stress savings.",
          required_context: ["user_profiles", "projects"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m4_q1_t1_value_prop",
            title: "Draft Your Core Pain Reliever Wording",
            type: "form",
            component_key: "ValuePropInputForm",
            sequence: 1
          },
          {
            id: "m4_q1_t2_relationship_style",
            title: "Select Your Interaction Style",
            type: "form",
            component_key: "RelationshipSelectorCard",
            sequence: 2
          }
        ]
      },
      quest2: {
        slug: "finding-paying-customers",
        title: "Finding Paying Customers",
        subtitle: "Isolate your early adopter segments and define your outreach lines.",
        sequence: 2,
        content_path: "playbook/m4-money-system/quests/finding-paying-customers.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Route Analyst",
          persona_prompt: "Audit customer acquisition channels. Flag vague terms like 'organic marketing' and demand specific, direct communication routes.",
          required_context: ["user_profiles", "projects"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m4_q2_t1_buyer_segments",
            title: "Identify Your Highest-Pain Early Adopters",
            type: "form",
            component_key: "EarlyAdopterForm",
            sequence: 1
          },
          {
            id: "m4_q2_t2_delivery_channels",
            title: "Lock In Your Direct Delivery Routes",
            type: "form",
            component_key: "ChannelSelectionGrid",
            sequence: 2
          }
        ]
      },
      quest3: {
        slug: "activities-and-resources",
        title: "Activities and Resources",
        subtitle: "Audit your available personal constraints against your daily execution work.",
        sequence: 3,
        content_path: "playbook/m4-money-system/quests/activities-and-resources.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Runway Manager",
          persona_prompt: "Evaluate operational actions. Cross-examine the user's daily activities list against their logged weekly hour limits.",
          required_context: ["user_profiles", "projects"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m4_q3_t1_resources_log",
            title: "Inventory Your Core Assets & Availability",
            type: "form",
            component_key: "ResourceInventoryForm",
            sequence: 1
          },
          {
            id: "m4_q3_t2_activities_log",
            title: "Outline Your Primary Daily Action Steps",
            type: "form",
            component_key: "CoreActivitiesLogForm",
            sequence: 2
          }
        ]
      },
      quest4: {
        slug: "finding-profits",
        title: "Finding Your Profits",
        subtitle: "Run your value-anchored price math and discover your break-even goals.",
        sequence: 4,
        content_path: "playbook/m4-money-system/quests/finding-profits.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Economics Auditor",
          persona_prompt: "Verify profit margins. Check tool costs vs pricing tiers and output clear break-even lines.",
          required_context: ["user_profiles", "projects"],
          on_success: { grant_points: 100 }
        },
        tasks: [
          {
            id: "m4_q4_t1_pricing_tiers",
            title: "Establish Your Core Pricing Tiers",
            type: "form",
            component_key: "PricingTierCardForm",
            sequence: 1
          },
          {
            id: "m4_q4_t2_expenses_spend",
            title: "List Your Absolute Minimum Software Expenses",
            type: "form",
            component_key: "ToolExpenseLogForm",
            sequence: 2
          },
          {
            id: "m4_q4_t3_economics_dashboard",
            title: "See Your Real-World Break-Even Goal",
            type: "action",
            component_key: "MarginDashboardCalculator",
            sequence: 3
          }
        ]
      },
      quest5: {
        slug: "boosters",
        title: "Boosters",
        subtitle: "Identify the software tools and community gatekeepers that accelerate your launch.",
        sequence: 5,
        content_path: "playbook/m4-money-system/quests/boosters.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Booster Conductor",
          persona_prompt: "Validate core third-party integrations. Ensure the user is leveraging infrastructure platforms to maximize launch speed.",
          required_context: ["user_profiles", "projects"],
          on_success: { grant_points: 100, badge_key: "MONEY_SYSTEM_LOCKED" }
        },
        tasks: [
          {
            id: "m4_q5_t1_partnerships_log",
            title: "Map Your Infrastructure Allies",
            type: "form",
            component_key: "PartnershipBoosterForm",
            sequence: 1
          }
        ]
      }
    }
  },
  mission5: {
  title: "The Legal Reality Check & Ways to Get Paid",
  sequence: 5,
  video_url: "https://urgetostart.com/videos/m5-overview.mp4",
  briefing_text: "Clear away the paperwork anxiety. See if you actually have any legal risks, open your digital cash register, and map out what you might need down the road without slowing down your launch.",
  quests: {
    quest1: {
      slug: "your-safety-rules",
      title: "Your Safety Rules",
      subtitle: "Decide if paperwork is a real shield or just a way to delay making your first dollar.",
      sequence: 1,
      content_path: "playbook/m5-legal/quests/personal-safety-check.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Friendly Auditor",
        persona_prompt: "Look at the user's answers. If their risk is low, reassure them that they can skip formal company registration for now and focus entirely on selling.",
        required_context: ["projects"],
        on_success: { grant_points: 50, badge_key: "RISK_CLEARED" }
      },
      tasks: [
        {
          id: "m5_q1_t1_risk_survey",
          title: "Take the Quick Risk Survey",
          type: "form",
          component_key: "STANDARD_FORM",
          sequence: 1
        }
      ]
    },
    quest2: {
      slug: "setting-up-the-cash-register",
      title: "Setting Up the Cash Register",
      subtitle: "Link a clean payment channel so a customer can buy right now without friction.",
      sequence: 2,
      content_path: "playbook/m5-legal/quests/open-your-payment-pipes.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Setup Assistant",
        persona_prompt: "Check the submitted payment URL to verify it looks like a valid, working checkout page link.",
        required_context: ["projects"],
        on_success: { grant_points: 100, badge_key: "CASH_REGISTER_OPEN" }
      },
      tasks: [
        {
          id: "m5_q2_t1_stripe_action",
          title: "Connect Your Payment Processor Account",
          type: "action",
          component_key: "StripeConnectButton",
          sequence: 1,
          metadata_config: {
            depends_on_task_id: "m5_q1_t1_risk_survey" // Cannot connect payment until they finish the risk check
          }
        },
        {
          id: "m5_q2_t2_url_verify",
          title: "Submit Your Live Test Checkout Link",
          type: "form",
          component_key: "STANDARD_FORM",
          sequence: 2,
          metadata_config: {
            depends_on_task_id: "m5_q2_t1_stripe_action" // Cannot verify the link until the account is connected
          }
        }
      ]
    },
    quest3: {
      slug: "setting-up-a-business",
      title: "Optional Adventure: Future Business Structure",
      subtitle: "Look over helpful accounting tools and legal registration options for your future growth.",
      sequence: 3,
      content_path: "playbook/m5-legal/quests/setting-up-a-business.md",
      is_optional: true,
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Helpful Guide",
        persona_prompt: "Save the user's preferred future setups to their profile notes without blocking their current progress.",
        required_context: ["projects"],
        on_success: { grant_points: 25 }
      },
      tasks: [
        {
          id: "m5_q3_t1_partner_log",
          title: "Pick Your Preferred Future Tools",
          type: "form",
          component_key: "STANDARD_FORM",
          sequence: 1,
          metadata_config: {
            potential_resources: [
              { name: "Clerky", type: "Legal Setup Tool", desc: "An easy online service that handles company paperwork when you're ready to grow." },
              { name: "Bench Accounting", type: "Online Bookkeeping", desc: "A simple service that automatically balances your business expenses for you." }
            ]
          }
        }
      ]
    },
    quest4: {
      slug: "licenses",
      title: "Optional Adventure: Local Permit Check",
      subtitle: "See if your city or state requires any local permits or registrations long-term.",
      sequence: 4,
      content_path: "playbook/m5-legal/quests/licenses.md",
      is_optional: true,
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Local Scanner",
        persona_prompt: "Read the user's location and business type, then print out a clear, simple list of common local permits they might eventually need.",
        required_context: ["user_profiles", "projects"],
        on_success: { grant_points: 25 }
      },
      tasks: [
        {
          id: "m5_q4_t1_permit_compile",
          title: "Generate Your Local Permit Report",
          type: "action",
          component_key: "AiLicenseReportNode",
          sequence: 1
        }
      ]
    }
  }
}
};