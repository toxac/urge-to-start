import { PlaybookConfig } from "@/types/playbook";

export const urgePlaybook: PlaybookConfig = {
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
};