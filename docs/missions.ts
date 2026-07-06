
export const urgePlaybook = {
  mission1: {
    title: "Build Your Founder Mindset",
    sequence: 1,
    video_url: "https://urgetostart.com/videos/m1-overview.mp4",
    briefing_text: "Before we look at business opportunities, we have to look at you. We are going to destroy the overthinking trap and build your real-world resilience.",

    // ⚡ Structured prerequisites map with decoupled AI routing keys
    prerequisites: [
      {
        item: "Commitment to allocate 3+ hours per week of uninterrupted focus",
        promptKey: "M1_PRE_TIME_AUDIT"
      },
      {
        item: "A reliable laptop or computer with a stable internet connection",
        promptKey: null
      },
      {
        item: "Willingness to share raw personal reflections with the companion system",
        promptKey: "M1_PRE_PSYCH_SAFETY"
      }
    ],

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
          on_success: {
            grant_points: 50,
            badge_key: "PATHFINDER"
          }
        },
        tasks: [
          {
            id: "m1_q1_t1_profile",
            title: "Introduce Yourself",
            type: "form",
            component_key: "ProfileSetupForm",
            description: "Everything good in life begins with a conversation. Share a bit about who you are, where you're building from, and what your background looks like.",
            sequence: 1,
            grant_points: 10,
            ai_config: {
              resources: [
                { title: "Urge Workspace Dashboard Tour", url: "https://urgetostart.com/guides/dashboard-onboarding" }
              ],
              alternative_approach: "If you feel uneasy framing your background, describe yourself from the perspective of a close collaborator highlighting your primary curious interest.",
              reflection_prompt: "Now that you've formalized your baseline introduction profile, does starting this path feel like a tangible reality or an abstract idea?"
            }
          },
          {
            id: "m1_q1_t2_drivers",
            title: "What's Driving You to Start?",
            sequence: 2,
            type: "form",
            component_key: "MotivationForm",
            grant_points: 20,
            description: "Let's get real for a second. Building a business takes serious grit, and generic goals burn out fast when things get tough. What is the actual fuel behind your engine?",
            ai_config: {
              resources: [
                { title: "Isolating Internal Core Drivers", url: "https://urgetostart.com/guides/finding-your-why" }
              ],
              alternative_approach: "Instead of writing standard lifestyle benchmarks, focus purely on what single, specific daily operational friction you want to remove from your routine forever.",
              reflection_prompt: "When you look at the core driver you typed out, are you doing this to run away from an immediate negative constraint or to chase a positive freedom threshold?"
            }
          },
          {
            id: "m1_q1_t3_constraints",
            title: "Set Your Realistic Weekly Limits",
            sequence: 3,
            type: "form",
            component_key: "ConstraintForm",
            grant_points: 20,
            description: "Excitement is great, but let's be totally honest about the hours you actually have. Side-building is a marathon, not a sprint. Pick a number you can stick to.",
            ai_config: {
              resources: [
                { title: "Calendar Isolation: The 15-Minute Block Trick", url: "https://urgetostart.com/guides/calendar-fencing" }
              ],
              alternative_approach: "If a standard weekly allocation feels too strict right now, target a simple boundary: commit to waking up 30 minutes earlier on Tuesdays and Thursdays.",
              reflection_prompt: "You chose your hours. If a sudden operational crisis occurs in your personal schedule this week, what secondary boundary is your defense line to protect this time?"
            }
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
          on_success: {
            grant_points: 50,
            badge_key: "COMMUNICATOR"
          }
        },
        tasks: [
          {
            id: "m1_q2_t1_ask_sim",
            title: "Test Drive Your Message",
            type: "simulator",
            component_key: "AskSimulator",
            sequence: 1,
            grant_points: 30,
            description: "To practice getting requests right, jump into this safe sandbox with Kip. Draft a quick message asking your friends and family for early support.",
            ai_config: {
              resources: [
                { title: "The 60-Second Ask Framework Rules", url: "https://urgetostart.com/guides/asking-without-shame" }
              ],
              alternative_approach: "If messaging family scripts feels awkward, change the target entirely. Write the prompt as a short note to an old professional colleague or classmate.",
              reflection_prompt: "Did crafting that request copy make you feel like you were asking for an annoying favor, or did it feel like you were inviting an ally into your building arc?"
            }
          },
          {
            id: "m1_q2_t2_known_reachout",
            title: "Reach Out to Your Circle",
            type: "action",
            component_key: "KnownReachoutWidget",
            sequence: 2,
            grant_points: 20,
            description: "Now that you have practiced the skill, let's execute it. Copy your polished message from the previous step and send it to the allies who have your back.",
            ai_config: {
              resources: [
                { title: "Managing Outbound Response Anxiety", url: "https://urgetostart.com/guides/managing-responses" }
              ],
              alternative_approach: "If messaging people individually triggers total friction, drop the request into a small group thread where your tightest circles already chat daily.",
              reflection_prompt: "You officially hit send. What surprised you more: the immediate speed of their direct responses, or the internal drops in your anxiety once it was gone?"
            }
          },
          {
            id: "m1_q2_t3_digital_presence",
            title: "Claim Your Digital Voice",
            type: "action",
            component_key: "DigitalPresenceWidget",
            sequence: 3,
            grant_points: 25,
            description: "Building in public isn't about pretending to be a guru; it's just about documenting your learning journey out loud. Update your bio cleanly, and share your first honest update.",
            ai_config: {
              resources: [
                { title: "The Perfect Anti-Brag Bio Template", url: "https://urgetostart.com/guides/clean-profiles" }
              ],
              alternative_approach: "If updating your primary public network profile feels exposed, use a pseudonym or create a completely blank profile account dedicated strictly to tracking your progress.",
              reflection_prompt: "Your first update is officially out in the open. How does stepping away from passive consuming toward active publishing alter your mindset as a builder?"
            }
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
          on_success: {
            grant_points: 100,
            badge_key: "FORTRESS"
          }
        },
        tasks: [
          {
            id: "m1_q3_t1_rejection_log",
            title: "Log 3 Real-World Rejections",
            type: "log_counter",
            component_key: "RejectionCounterForm",
            sequence: 1,
            grant_points: 80,
            ai_config: {
              resources: [
                { title: "The Gamification of Friction (Jia Jiang Rules)", url: "https://urgetostart.com/guides/rejection-therapy" }
              ],
              alternative_approach: "If you cannot find direct buyers to pitch today, collect low-stakes rejections: ask a local coffee stand for a 10% discount on your order just to hear the word 'no'.",
              reflection_prompt: "Now that you have logged these rejections, did the structural outcome crush your motivation, or did you realize the physical aftermath was entirely harmless?"
            }
          },
          {
            id: "m1_q3_t2_club_unlock",
            title: "Open the Rejection Club Feed",
            type: "community",
            component_key: "CommunityFeedTeaser",
            sequence: 2,
            grant_points: 20,
            ai_config: {
              resources: [
                { title: "Leveraging Shared Community Momentum", url: "https://urgetostart.com/guides/peer-leverage" }
              ],
              alternative_approach: "If you don't want to post your entry openly to the main board yet, silently review 3 logs submitted by other founders to internalize their metrics.",
              reflection_prompt: "Seeing that every active peer around you experiences the identical friction, does failure feel like an individual flaw or a universal system variable?"
            }
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

    prerequisites: [
      {
        item: "Completion of Mission 1 validation badges and foundational profiles",
        promptKey: "M2_PRE_BADGE_AUDIT"
      },
      {
        item: "Observation notebook or a blank digital memo sheet active on your phone",
        promptKey: null
      },
      {
        item: "Willingness to assume that your initial ideas might be entirely wrong",
        promptKey: "M2_PRE_EGO_DETACHMENT"
      }
    ],

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
            sequence: 1,
            grant_points: 25,
            ai_config: {
              resources: [
                { title: "Spotting True Commercial Inconvenience", url: "https://urgetostart.com/guides/pain-spotting" }
              ],
              alternative_approach: "If your weekly schedule felt completely smooth, review your monthly bank statement: what transaction or utility bill felt annoying to pay?",
              reflection_prompt: "Look closely at your 3 logged issues. Are these temporary personal annoyances, or structural bottlenecks people would pay money to bypass?"
            }
          },
          {
            id: "m2_q1_t2_skills_inventory",
            title: "List Things You Do Better Than Average",
            type: "form",
            component_key: "SkillTagBuilder",
            sequence: 2,
            grant_points: 25,
            ai_config: {
              resources: [
                { title: "Deconstructing Your Hidden Technical Capital", url: "https://urgetostart.com/guides/uncovering-skills" }
              ],
              alternative_approach: "If you struggle to list structural skills, think about what tasks your coworkers, friends, or parents constantly ask you to fix or handle for them.",
              reflection_prompt: "Are the native skill tags you configured traits you genuinely enjoy executing, or are they historical habits you are trying to move away from?"
            }
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
            sequence: 1,
            grant_points: 20,
            ai_config: {
              resources: [
                { title: "Mapping Niche Subcultures for Customer Discovery", url: "https://urgetostart.com/guides/subculture-mapping" }
              ],
              alternative_approach: "If you work completely isolated or remote, select online sub-communities or forums where you actively read daily interaction logs.",
              reflection_prompt: "Which of these user circles do you possess the highest native empathy for, and where do you have the most direct structural access?"
            }
          },
          {
            id: "m2_q2_t2_friction_log",
            title: "Log 2 Clumsy Shortcuts You Saw Someone Use",
            type: "form",
            component_key: "CircleObservationForm",
            sequence: 2,
            grant_points: 30,
            description: "Log 2 clumsy workarounds or shortcuts you saw someone utilize to bypass a bottleneck.",
            ai_config: {
              resources: [
                { title: "The Clumsy Shortcut Audit Framework", url: "https://urgetostart.com/guides/shortcut-hunting" }
              ],
              alternative_approach: "If you didn't catch anyone using a shortcut physically, look up a tutorial video for a common software app: where do users look confused in comment threads?",
              reflection_prompt: "Every clumsy shortcut is a hidden validation sign for a product. Is the friction you observed caused by a lack of tools or bad information?"
            }
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
            ai_config: {
              resources: [
                { title: "Advanced Search Filters for Reddit and Review Boards", url: "https://urgetostart.com/guides/safari-mining" }
              ],
              alternative_approach: "Head directly to a popular service platform's app store listing. Filter reviews strictly by '3-stars' to find users who like the core utility but hate the active friction.",
              reflection_prompt: "Look at the raw language the internet user chose to describe their frustration. Are they attacking a missing software feature, or expressing genuine operational anger?"
            }
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
            ai_config: {
              resources: [
                { title: "The Mom Test Core Conversation Rules", url: "https://urgetostart.com/guides/mom-test-foundations" }
              ],
              alternative_approach: "If Alex completely locks up on you during the script, stop trying to guide the conversation. Ask a purely historical question about the last time he encountered the task.",
              reflection_prompt: "You officially navigated the sandbox conversation. What statement triggered Alex to drop his guard: a generic pitch outline, or an invitation to unpack his past workflow history?"
            }
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
            ai_config: {
              resources: [
                { title: "Navigating Real-World Discovery Interviews Safely", url: "https://urgetostart.com/guides/interviewing-humans" }
              ],
              alternative_approach: "If reaching out to new contacts triggers massive friction, interview 3 peers within the internal Urge community feed who match your target persona profile parameters.",
              reflection_prompt: "Reviewing the raw data logs from your 3 interviews, did the subjects state that they actively spent real money trying to resolve this bottleneck in the past year?"
            }
          },
          {
            id: "m2_q5_t2_synthesize_cut",
            title: "Pick the One Idea You Will Commit To",
            type: "action",
            component_key: "OpportunityDecisionBoard",
            sequence: 2,
            grant_points: 50,
            ai_config: {
              resources: [
                { title: "The Elimination Framework: Shifting to Mono-Focus", url: "https://urgetostart.com/guides/making-the-cut" }
              ],
              alternative_approach: "If you feel paralyzed choosing between two distinct ideas, pick the path that carries the absolute lowest software tool cost to deploy an initial version.",
              reflection_prompt: "You have committed to a single workspace direction. How does closing the alternative loops feel to your mindset as a tactical operator?"
            }
          }
        ]
      }
    }
  },
  mission3: {
    title: "Project's Viability",
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
            sequence: 1,
            grant_points: 30 // Critical execution focus
          },
          {
            id: "m3_q1_t2_psychographics",
            title: "Identify Their Daily Fears & Online Hangouts",
            type: "form",
            component_key: "PsychographicMapForm",
            sequence: 2,
            grant_points: 20
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
          on_success: {
            grant_points: 50,
            badge_key: "ARCHITECT" // Unlocks "Architect" badge identity for structural choices
          }
        },
        tasks: [
          {
            id: "m3_q2_t1_model_generator",
            title: "Compare Alternative Business Options",
            type: "simulator",
            component_key: "SolutionScaffoldViewer",
            sequence: 1,
            grant_points: 30
          },
          {
            id: "m3_q2_t2_lock_vehicle",
            title: "Select Your Starting Offer Style",
            type: "action",
            component_key: "ModelSelectionNode",
            sequence: 2,
            grant_points: 20
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
            sequence: 1,
            grant_points: 25 // Optional bonus points
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
          on_success: {
            grant_points: 100,
            badge_key: "STRATEGIST" // Unlocks "Strategist" workspace identity badge
          }
        },
        tasks: [
          {
            id: "m3_q4_t1_locate_cohorts",
            title: "List 3 Specific Groups or Channels Where Your Buyers Gather",
            type: "form",
            component_key: "WateringHoleForm",
            sequence: 1,
            grant_points: 30
          },
          {
            id: "m3_q4_t2_urge_equation",
            title: "Calculate Your Realistic Year 1 Sales Goal",
            type: "form",
            component_key: "RealityEquationCalculator",
            sequence: 2,
            grant_points: 30
          },
          {
            id: "m3_q4_t3_mint_project",
            title: "Confirm and Officially Open Your Workspace",
            type: "action",
            component_key: "ProjectMintingButton",
            sequence: 3,
            grant_points: 40 // Opening execution click payout
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
            sequence: 1,
            grant_points: 30
          },
          {
            id: "m4_q1_t2_relationship_style",
            title: "Select Your Interaction Style",
            type: "form",
            component_key: "RelationshipSelectorCard",
            sequence: 2,
            grant_points: 20
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
            sequence: 1,
            grant_points: 25
          },
          {
            id: "m4_q2_t2_delivery_channels",
            title: "Lock In Your Direct Delivery Routes",
            type: "form",
            component_key: "ChannelSelectionGrid",
            sequence: 2,
            grant_points: 25
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
          on_success: {
            grant_points: 50,
            badge_key: "ANALYST" // Unlocks "Analyst" capability badge
          }
        },
        tasks: [
          {
            id: "m4_q3_t1_resources_log",
            title: "Inventory Your Core Assets & Availability",
            type: "form",
            component_key: "ResourceInventoryForm",
            sequence: 1,
            grant_points: 25
          },
          {
            id: "m4_q3_t2_activities_log",
            title: "Outline Your Primary Daily Action Steps",
            type: "form",
            component_key: "CoreActivitiesLogForm",
            sequence: 2,
            grant_points: 25
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
          on_success: {
            grant_points: 100,
            badge_key: "ECONOMIST" // Unlocks "Economist" validation badge
          }
        },
        tasks: [
          {
            id: "m4_q4_t1_pricing_tiers",
            title: "Establish Your Core Pricing Tiers",
            type: "form",
            component_key: "PricingTierCardForm",
            sequence: 1,
            grant_points: 30
          },
          {
            id: "m4_q4_t2_expenses_spend",
            title: "List Your Absolute Minimum Software Expenses",
            type: "form",
            component_key: "ToolExpenseLogForm",
            sequence: 2,
            grant_points: 30
          },
          {
            id: "m4_q4_t3_economics_dashboard",
            title: "See Your Real-World Break-Even Goal",
            type: "action",
            component_key: "MarginDashboardCalculator",
            sequence: 3,
            grant_points: 40
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
          on_success: {
            grant_points: 100,
            badge_key: "ENGINEER" // Unlocks "Engineer" culmination badge identity
          }
        },
        tasks: [
          {
            id: "m4_q5_t1_partnerships_log",
            title: "Map Your Infrastructure Allies",
            type: "form",
            component_key: "PartnershipBoosterForm",
            sequence: 1,
            grant_points: 100
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
        slug: "personal-safety-check",
        title: "Your Safety Rules",
        subtitle: "Decide if paperwork is a real shield or just a way to delay making your first dollar.",
        sequence: 1,
        content_path: "playbook/m5-legal/quests/personal-safety-check.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Friendly Auditor",
          persona_prompt: "Look at the user's answers. If their risk is low, reassure them that they can skip formal company registration for now and focus entirely on selling.",
          required_context: ["projects"],
          on_success: {
            grant_points: 50,
            badge_key: "PROTECTOR" // Unlocks "Protector" risk management capability badge
          }
        },
        tasks: [
          {
            id: "m5_q1_t1_risk_survey",
            title: "Take the Quick Risk Survey",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 50 // High psychological threshold value
          }
        ]
      },
      quest2: {
        slug: "open-your-payment-pipes",
        title: "Setting Up the Cash Register",
        subtitle: "Link a clean payment channel so a customer can buy right now without friction.",
        sequence: 2,
        content_path: "playbook/m5-legal/quests/open-your-payment-pipes.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Setup Assistant",
          persona_prompt: "Check the submitted payment URL to verify it looks like a valid, working checkout page link.",
          required_context: ["projects"],
          on_success: {
            grant_points: 100,
            badge_key: "MERCHANT" // Unlocks "Merchant" identity badge
          }
        },
        tasks: [
          {
            id: "m5_q2_t1_stripe_action",
            title: "Connect Your Payment Processor Account",
            type: "action",
            component_key: "StripeConnectButton",
            sequence: 1,
            grant_points: 50,
            metadata_config: {
              depends_on_task_id: "m5_q1_t1_risk_survey"
            }
          },
          {
            id: "m5_q2_t2_url_verify",
            title: "Submit Your Live Test Checkout Link",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 2,
            grant_points: 50,
            metadata_config: {
              depends_on_task_id: "m5_q2_t1_stripe_action"
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
            grant_points: 25, // Optional bonus points
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
            sequence: 1,
            grant_points: 25 // Optional bonus points
          }
        ]
      }
    }
  },

  mission6: {
    title: "Building Your Solution & Gathering Traction",
    sequence: 6,
    video_url: "https://urgetostart.com/videos/m6-overview.mp4",
    briefing_text: "Strip your product vision down to its raw essentials, build your digital footprint alongside your asset, recruit your testing crew early, and put your working version to the test.",
    quests: {
      quest1: {
        slug: "the-cut-list",
        title: "Shredding the Extra Features",
        subtitle: "Strip away your massive software or service wishlist to protect your speed to market.",
        sequence: 1,
        content_path: "playbook/m6-product/quests/the-cut-list.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Focused Friend",
          persona_prompt: "Review the feature list. If the user tries to sneak in non-essential items like admin settings panels or custom themes, tell them to cut it immediately.",
          required_context: ["projects"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m6_q1_t1_feature_shred",
            title: "List Your Must-Haves vs Nice-to-Haves",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 50 // High mental barrier entry
          }
        ]
      },
      quest2: {
        slug: "sourcing-and-supplies",
        title: "Sourcing Your Raw Materials",
        subtitle: "Map out your software stacks or your physical gear and identify your bottlenecks.",
        sequence: 2,
        content_path: "playbook/m6-product/quests/sourcing-and-supplies.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Practical Builder",
          persona_prompt: "Look over their tools list. Make sure they aren't using overly complicated setups when an easier, cheaper alternative exists.",
          required_context: ["projects"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m6_q2_t1_materials_log",
            title: "Inventory Your Ingredients or Technical Stack",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 50,
            metadata_config: {
              depends_on_task_id: "m6_q1_t1_feature_shred"
            }
          }
        ]
      },
      quest3: {
        slug: "acceptable-outcomes",
        title: "Defining Good Enough",
        subtitle: "Set your explicit boundaries for a working version 1.0 so you don't get stuck tweaking it forever.",
        sequence: 3,
        content_path: "playbook/m6-product/quests/acceptable-outcomes.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Reality Check",
          persona_prompt: "Ensure the user's definition of success is functional, simple, and can be completed in under two weeks.",
          required_context: ["projects"],
          on_success: {
            grant_points: 50,
            badge_key: "MINIMALIST" // Unlocks "Minimalist" scope capability badge
          }
        },
        tasks: [
          {
            id: "m6_q3_t1_outcome_bounds",
            title: "Lock In Your Functional Launch Line",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 50,
            metadata_config: {
              depends_on_task_id: "m6_q2_t1_materials_log"
            }
          }
        ]
      },
      quest4: {
        slug: "social-footprint",
        title: "Claiming Your Social Footprint",
        subtitle: "Set up your initial zero-dollar social pages and document your build journey in public.",
        sequence: 4,
        content_path: "playbook/m6-product/quests/social-footprint.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Traction Catalyst",
          persona_prompt: "Verify that the user has submitted active links to their new placeholder channels or updates.",
          required_context: ["projects"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m6_q4_t1_social_links",
            title: "Submit Your Initial Social Profiles or Status Updates",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 50,
            metadata_config: {
              depends_on_task_id: "m6_q3_t1_outcome_bounds"
            }
          }
        ]
      },
      quest5: {
        slug: "actual-building",
        title: "The Active Build Block",
        subtitle: "Put your head down, build your core utility, and make the machine work.",
        sequence: 5,
        content_path: "playbook/m6-product/quests/actual-building.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Accountability Partner",
          persona_prompt: "Celebrate their active build updates and prompt them to confirm that it matches their 'Good Enough' line.",
          required_context: ["projects"],
          on_success: {
            grant_points: 100,
            badge_key: "BUILDER" // Unlocks "Builder" execution capability badge
          }
        },
        tasks: [
          {
            id: "m6_q5_t1_build_action",
            title: "Confirm Your Functional Version is Operational",
            type: "action",
            component_key: "ConfirmBuildStatusButton",
            sequence: 1,
            grant_points: 100, // Large payout for hitting operational execution status
            metadata_config: {
              depends_on_task_id: "m6_q4_t1_social_links"
            }
          }
        ]
      },
      quest6: {
        slug: "recruiting-testers",
        title: "Recruiting Your First Testers",
        subtitle: "Secure 3 low-pressure commitments from early adopters who will test your rough initial version.",
        sequence: 6,
        content_path: "playbook/m6-product/quests/recruiting-testers.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Crew Recruiter",
          persona_prompt: "Review the logged tester entries. Reassure the founder that feedback from 3 focused targets is better than 100 random looky-loos.",
          required_context: ["projects"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m6_q6_t1_tester_log",
            title: "Log the Details for Your 3 Core Beta Testers",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 50,
            metadata_config: {
              depends_on_task_id: "m6_q5_t1_build_action"
            }
          }
        ]
      },
      quest7: {
        slug: "showcase-and-demo",
        title: "The Early User Demo",
        subtitle: "Show a quick recording or drop a sample in front of your recruited testers to catch early friction.",
        sequence: 7,
        content_path: "playbook/m6-product/quests/showcase-and-demo.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Feedback Analyzer",
          persona_prompt: "Analyze user test observations. Help separate constructive layout feedback from random feature suggestions.",
          required_context: ["projects"],
          on_success: {
            grant_points: 100,
            badge_key: "CAPTAIN" // Unlocks "Captain" early traction culmination badge
          }
        },
        tasks: [
          {
            id: "m6_q7_t1_demo_submit",
            title: "Submit Your Demo Overview or Feedback Notes",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 100, // Outbound user observation interaction reward
            metadata_config: {
              depends_on_task_id: "m6_q6_t1_tester_log",
              potential_resources: [
                { name: "Loom", type: "Video Tool", desc: "A great, free way to record a quick 2-minute screen video showing off your tool." },
                { name: "YouTube Unlisted", type: "Hosting Alternative", desc: "An easy way to host video links privately for your testers." }
              ]
            }
          }
        ]
      }
    }
  },

  mission7: {
    title: "The Public Launch & Market Engine",
    sequence: 7,
    video_url: "https://urgetostart.com/videos/m7-overview.mp4",
    briefing_text: "Put your working version out into the wild open market. Launch through your inside circles, capture early builder upvotes, configure your modern social media content hooks, lock down your peer branding voice, read the market's signals, execute your outbound ledger, and deploy optional micro ad experiments.",
    quests: {
      quest1: {
        slug: "inside-circle",
        title: "The Inside Circle Launch",
        subtitle: "Drop your link to your beta testers and close allies to verify your payments and secure your first 2 reviews.",
        sequence: 1,
        content_path: "playbook/m7-marketing/quests/inside-circle.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Launch Check",
          persona_prompt: "Verify the user has recorded early feedback data and confirmed that their live checkout links successfully process currency without crashing.",
          required_context: ["projects"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m7_q1_t1_circle_log",
            title: "Log Your Payments Verification and Early Review Notes",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 50 // High operational friction value
          }
        ]
      },
      quest2: {
        slug: "internal-sandbox",
        title: "The Internal Sandbox Launch",
        subtitle: "Complete your pre-launch checklist and post your offer to our builder community board for early momentum.",
        sequence: 2,
        content_path: "playbook/m7-marketing/quests/internal-sandbox.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Sandbox Conductor",
          persona_prompt: "Check their pre-launch variables. Ensure their landing page text and pricing options match their previously logged system parameters before authorizing the community board blast.",
          required_context: ["projects"],
          on_success: {
            grant_points: 50,
            badge_key: "INITIATE" // Unlocks "Initiate" operational validation badge
          }
        },
        tasks: [
          {
            id: "m7_q2_t1_sandbox_publish",
            title: "Publish Your Promotional Card to the Internal Marketplace Board",
            type: "action",
            component_key: "PublishToInternalMarketplaceButton",
            sequence: 1,
            grant_points: 50,
            metadata_config: {
              depends_on_task_id: "m7_q1_t1_circle_log"
            }
          }
        ]
      },
      quest3: {
        slug: "launch-tracks",
        title: "Exploring Your Launch Tracks",
        subtitle: "Configure your modern social media content hooks and plan your physical real-world street hustle.",
        sequence: 3,
        content_path: "playbook/m7-marketing/quests/launch-tracks.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Strategy Assessor",
          persona_prompt: "Evaluate their chosen launch tracks. If they select a local service, verify they have configured an explicit real-world IRL walk-in or distribution route.",
          required_context: ["projects"],
          on_success: { grant_points: 100 }
        },
        tasks: [
          {
            id: "m7_q3_t1_track_selection",
            title: "Select and Configure Your Two Target Launch Tracks",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 100, // Strategic preparation reward
            metadata_config: {
              depends_on_task_id: "m7_q2_t1_sandbox_publish",
              potential_resources: [
                { name: "CapCut", type: "Video Editing", desc: "A powerful, free mobile and desktop tool to clip together highly engaging short-form video hooks for TikTok and Instagram Reels." },
                { name: "Buffer", type: "Social Scheduler", desc: "A simple, free tool to queue up your authority text logs and value posts across LinkedIn and Twitter/X simultaneously." },
                { name: "QR Code Generator", type: "Utility", desc: "Create high-resolution unbranded QR codes to apply directly to physical flyers or offline walk-in pitch templates." }
              ]
            }
          }
        ]
      },
      quest4: {
        slug: "branding-and-comm",
        title: "Your Voice and Look",
        subtitle: "Establish a clean, readable visual theme and remove the corporate talk from your messages.",
        sequence: 4,
        content_path: "playbook/m7-marketing/quests/branding-and-comm.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Voice Police",
          persona_prompt: "Review the communication rules. If they use robotic jargon or try to sound like a giant corporate company, flag it and push them back to peer-to-peer phrasing.",
          required_context: ["projects"],
          on_success: {
            grant_points: 50,
            badge_key: "HUSTLER" // Unlocks "Hustler" channel asset readiness badge
          }
        },
        tasks: [
          {
            id: "m7_q4_t1_branding_canvas",
            title: "Establish Your Simple Visual Theme and Clear Voice Guidelines",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 50,
            metadata_config: {
              depends_on_task_id: "m7_q3_t1_track_selection",
              potential_resources: [
                { name: "Coolors.co", type: "Color Tool", desc: "A free, lightning-fast color palette utility to lock down your contrast parameters." },
                { name: "Google Fonts", type: "Typography Catalog", desc: "Timeless, web-safe typographic sheets like Inter or Roboto to enforce high interface readability." }
              ]
            }
          }
        ]
      },
      quest5: {
        slug: "running-ads",
        title: "Optional Adventure: Scrappy Paid Campaigns",
        subtitle: "Learn the $5-a-day rule to test small, targeted online experiments without gambling your runway.",
        sequence: 5,
        content_path: "playbook/m7-marketing/quests/running-ads.md",
        is_optional: true,
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Campaign Strategist",
          persona_prompt: "Audit ad targeting properties. Ensure their target group is tiny and razor-focused to protect their cash capital balances.",
          required_context: ["projects"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m7_q5_t1_campaign_experiment",
            title: "Configure a Highly-Targeted Micro Ad Experiment Layout",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 50, // Optional bonus points
            metadata_config: {
              depends_on_task_id: "m7_q4_t1_branding_canvas",
              potential_resources: [
                { name: "Meta Ads Manager", type: "Ad Network", desc: "Best interface for hyper-localized geographic services targeting across Instagram feeds." },
                { name: "Google Ads Manager", type: "Ad Network", desc: "Best channel for intent-match keyword search campaign configurations." }
              ]
            }
          }
        ]
      },
      quest6: {
        slug: "market-feedback",
        title: "Listening to the Market",
        subtitle: "Decode your initial traffic metrics, conversion parameters, and qualitative user friction.",
        sequence: 6,
        content_path: "playbook/m7-marketing/quests/market-feedback.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Feedback Analyzer",
          persona_prompt: "Review logged conversion ratios and customer objections. Help the founder identify if their bottleneck lives in traffic acquisition or checkout page layout copy.",
          required_context: ["projects"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m7_q6_t1_metrics_audit",
            title: "Log Your Traffic Stats, Sales Tally, and User Objections",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 50,
            metadata_config: {
              depends_on_task_id: "m7_q4_t1_branding_canvas"
            }
          }
        ]
      },
      quest7: {
        slug: "outbound-tally",
        title: "The Outbound Direct Tally",
        subtitle: "Step out of your comfort zone and manually present your solution directly to 10 distinct strangers.",
        sequence: 7,
        content_path: "playbook/m7-marketing/quests/outbound-tally.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Discipline Coach",
          persona_prompt: "Review their 10 logged outbound contacts. Celebrate this unscalable hustle milestone and highlight that proactive outreach is what separates builders from wishful thinkers.",
          required_context: ["projects"],
          on_success: {
            grant_points: 100,
            badge_key: "VANGUARD" // Unlocks "Vanguard" open market launch culmination badge
          }
        },
        tasks: [
          {
            id: "m7_q7_t1_outbound_ledger",
            title: "Log the Details for Your First 10 Outbound Market Interactions",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 100, // Maximum value for direct manual outbound market execution
            metadata_config: {
              depends_on_task_id: "m7_q6_t1_metrics_audit"
            }
          }
        ]
      }
    }
  },

  mission8: {
    title: "True Review & The Reality Crossroads",
    sequence: 8,
    video_url: "https://urgetostart.com/videos/m8-overview.mp4",
    briefing_text: "Audit your core business health vital signs, cross-reference your income metrics with your personal freedom line, automate repetitive delivery bottlenecks, and make your final strategic launch choice.",
    quests: {
      quest1: {
        slug: "freedom-math",
        title: "The Freedom Math & Vital Signs",
        subtitle: "Calculate your take-home margins, time efficiency variables, and your true day-job replacement line.",
        sequence: 1,
        content_path: "playbook/m8-crossroads/quests/freedom-math.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Financial Peer",
          persona_prompt: "Review the logged take-home margin properties and salary goals. Help the founder confirm if their target transaction volume aligns realistically with their organic launch traffic.",
          required_context: ["projects"],
          on_success: { grant_points: 50 }
        },
        tasks: [
          {
            id: "m8_q1_t1_metrics_calc",
            title: "Log Your Core Income Margins and Salary Replacement Target",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 50 // High analytical introspective value
          }
        ]
      },
      quest2: {
        slug: "lifestyle-audit",
        title: "The Lifestyle Audit",
        subtitle: "Check your personal energy margins to make sure you are building a lifestyle asset, not a new cage.",
        sequence: 2,
        content_path: "playbook/m8-crossroads/quests/lifestyle-audit.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Energy Coach",
          persona_prompt: "Assess their workflow frustration scores. Emphasize that resolving operational stress early is vital to prevent long-term founder burnout.",
          required_context: ["projects"],
          on_success: {
            grant_points: 50,
            badge_key: "AUDITOR" // Unlocks "Auditor" strategic baseline identity badge
          }
        },
        tasks: [
          {
            id: "m8_q2_t1_lifestyle_log",
            title: "Complete Your Operational Workflow and Energy Alignment Scorecard",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 50,
            metadata_config: {
              depends_on_task_id: "m8_q1_t1_metrics_calc"
            }
          }
        ]
      },
      quest3: {
        slug: "system-streamlining",
        title: "Automating the Repeat Work",
        subtitle: "Connect your core tool systems together to wipe out boring admin tasks and reclaim your free time.",
        sequence: 3,
        content_path: "playbook/m8-crossroads/quests/system-streamlining.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Automation Wizard",
          persona_prompt: "Verify that the user has identified specific repetitive tasks and logged a plan to deploy zero-code link triggers.",
          required_context: ["projects"],
          on_success: {
            grant_points: 100,
            badge_key: "AUTOMATOR" // Unlocks "Automator" efficiency capability badge
          }
        },
        tasks: [
          {
            id: "m8_q3_t1_automation_plan",
            title: "Map Out Your Background Automation Workflow Links",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 100, // Significant reward for structural systems building
            metadata_config: {
              depends_on_task_id: "m8_q2_t1_lifestyle_log"
            }
          }
        ]
      },
      quest4: {
        slug: "the-crossroads",
        title: "The Crossroads (Scale, Tweak, or Pivot)",
        subtitle: "Commit to your final strategic path: double down on growth, tweak your variables, or run a smart pivot.",
        sequence: 4,
        content_path: "playbook/m8-crossroads/quests/the-crossroads.md",
        ai_config: {
          role: "SYSTEM_CONDUCTOR",
          persona_name: "The Master Strategist",
          persona_prompt: "Honor their final path selection. If scaling, offer immediate confidence parameters. If pivoting, reassure them that walking away with pristine market data is an expert operational victory.",
          required_context: ["projects"],
          on_success: {
            grant_points: 150, // Major completion milestone bonus 
            badge_key: "SOVEREIGN" // Unlocks final master "Sovereign" capstone badge identity
          }
        },
        tasks: [
          {
            id: "m8_q4_t1_final_choice",
            title: "Select Your Next Strategic Path Block and Log Your Monthly Milestones",
            type: "form",
            component_key: "STANDARD_FORM",
            sequence: 1,
            grant_points: 150, // Massive terminal execution payout
            metadata_config: {
              depends_on_task_id: "m8_q3_t1_automation_plan"
            }
          }
        ]
      }
    }
  }
};

