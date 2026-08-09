// lib/playbook/mission1.ts
import { MissionSchema } from '@/types/playbook';

const mission1: MissionSchema = {
    id: "mission-1",
    title: "Beg. Borrow. Steel.",
    content: null,
    content_path: "content/missions/mission1/mission.md",
    sequence: 1,
    video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
    big_question: "Am I ready to start?",
    estimated_time_in_days: 14,
    context: ["user_profile"],
    success_message: "You've completed Mission 1: Beg. Borrow. Steel. You defined your 'why,' made a real commitment, mapped your hidden resources, built your support squad, and faced rejection head-on. You're no longer in the 'thinking' phase—you're in the 'doing' phase. The foundation is laid. You are ready for Mission 2.",
    badge_config: {
        key: "badge_mission_1",
        title: "Resourceful Founder",
        description: "Completed Mission 1: Beg. Borrow. Steel. Mastered asking, faced rejection, and mapped your initial founder assets.",
        unlocked_identity: "Resilient Action-Taker",
        icon_key: "ShieldCheck"
    },

    quests: [
        // ============================================
        // QUEST 1: The New Beginning
        // ============================================
        {
            id: "mission1_quest1",
            mission_id: "mission-1",
            title: "The New Beginning",
            content_path: "content/missions/mission1/quests/q1.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 1,
            estimated_in_app_minutes: 30,
            estimated_off_app_minutes: 60,
            content: null,
            context: ["user_profile"],
            badge_config: {
                key: "badge_quest_1_1",
                title: "Pathfinder",
                description: "Completed Quest 1: Defined your core why, made a real commitment, and faced your initial fears.",
                unlocked_identity: "Self-Aware Founder",
                icon_key: "Compass"
            },
            notes: [
                {
                    title: "Honesty is your compass",
                    type: "guide",
                    content: "Resist the urge to edit yourself. These answers are for you, not a potential investor. The strongest businesses are built on personal truth.",
                    related_url: null
                },
                {
                    title: "This might feel uncomfortable",
                    type: "nudge",
                    content: "That's the point. Comfort is where dreams go to die. You're here to build something real.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 1: The New Beginning. You know your 'why,' you've made a commitment, and you've faced your fears. That's more than most people ever do. On to the next quest.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 1.1: Why Start?
                {
                    id: "mission1_quest1_task1",
                    title: "Why Start?",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Let's be totally honest. Building a business takes serious energy, and vague goals fade the moment life gets busy. What is the actual change you want to make in your life?",
                    mission_id: "mission-1",
                    quest_id: "mission1_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/why-start-matters",
                            title: "Why Your 'Why' Matters More Than Your Idea"
                        },
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/finding-your-north-star",
                            title: "Finding Your North Star"
                        },
                        {
                            type: "youtube",
                            isInternal: false,
                            isRequired: false,
                            url_link: "https://www.youtube.com/watch?v=example",
                            title: "Simon Sinek: Start With Why"
                        }
                    ],
                    component_key: "MotivationForm",
                    reflection_prompt: "Look at your 'why_statement.' Does it resonate with you on a gut level? If not, tweak it now. This will be your anchor.",
                    observation_context: null,
                    grant_points: 25,
                    challenges: [
                        {
                            title: "The 5-Minute Timer",
                            description: "Set a timer for 5 minutes. Write non-stop about why you're starting. Don't edit. Don't judge. Just write.",
                            link: "/resources/challenges/the-5-minute-timer"
                        }
                    ],
                    ai_config: null,
                    dependencies: [],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 1.2: Commit to the Journey
                {
                    id: "mission1_quest1_task2",
                    title: "Make It Real",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 10,
                    briefing_text: "Big goals require clear constraints. Let's set realistic expectations for your time, money, and launch timeline. Be honest, not aspirational.",
                    mission_id: "mission-1",
                    quest_id: "mission1_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/the-power-of-constraints",
                            title: "The Power of Constraints"
                        },
                        {
                            type: "tools",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/tools/time-audit-template",
                            title: "Time Audit Template"
                        }
                    ],
                    component_key: "CommitmentForm",
                    reflection_prompt: "Look at your weekly hours. Is this a realistic, sustainable commitment for the next few months? If you can only do 2 hours a day, own that and build your plan around it.",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: [],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 1.3: Roadblocks
                {
                    id: "mission1_quest1_task3",
                    title: "What's Scaring You?",
                    sequence: 3,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Acknowledging your fears is a sign of strength, not weakness. Let's get them out in the open. This helps the program tailor its support for you.",
                    mission_id: "mission-1",
                    quest_id: "mission1_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/fear-is-data",
                            title: "Fear is Data"
                        },
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/overcoming-analysis-paralysis",
                            title: "Overcoming Analysis Paralysis"
                        }
                    ],
                    component_key: "RoadblockForm",
                    reflection_prompt: "What's the scariest roadblock on this list? We can help you with that. Let's make a plan.",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: [],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 2: Your Resources
        // ============================================
        {
            id: "mission1_quest2",
            mission_id: "mission-1",
            title: "What You've Got",
            content_path: "content/missions/mission1/quests/q2.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 2,
            estimated_in_app_minutes: 30,
            estimated_off_app_minutes: 60,
            content: null,
            context: ["user_profile"],
            badge_config: {
                key: "badge_quest_1_2",
                title: "Asset Mapper",
                description: "Completed Quest 2: Mapped your connections and audited your skills to unlock hidden leverage.",
                unlocked_identity: "Resourceful Strategist",
                icon_key: "Network"
            },
            notes: [
                {
                    title: "Your network is your net worth",
                    type: "guide",
                    content: "Your friends, family, former colleagues, and online networks are powerful assets. Let's map them.",
                    related_url: null
                },
                {
                    title: "Be generous with yourself",
                    type: "nudge",
                    content: "Most people underestimate their skills. If you've done it, even once, it's a skill. List it.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 2: What You've Got. You've mapped your network and skills. You're not starting from zero—you have assets. Now let's put them to work.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 2.1: Your Connections
                {
                    id: "mission1_quest2_task1",
                    title: "Map Your Network",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Who do you know? Your friends, family, former colleagues, and online networks are powerful assets. Let's map your 'social footprint' so you can see how to reach your first customers.",
                    mission_id: "mission-1",
                    quest_id: "mission1_quest2",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-network-without-being-creepy",
                            title: "How to Network Without Being Creepy"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/your-network-is-your-first-sales-channel",
                            title: "Your Network is Your First Sales Channel"
                        }
                    ],
                    component_key: "SocialFootprintForm",
                    reflection_prompt: "Who is the most valuable person in your network right now? Why? Consider reaching out to them casually this week.",
                    observation_context: null,
                    grant_points: 25,
                    challenges: [
                        {
                            title: "The Connection Challenge",
                            description: "Find 5 people in your network you haven't talked to in over a year. Send them a message. Ask how they're doing.",
                            link: "/resources/challenges/connection-challenge"
                        }
                    ],
                    ai_config: null,
                    dependencies: [],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 2.2: Your Skills
                {
                    id: "mission1_quest2_task2",
                    title: "Skill Inventory",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Business is mostly about problem-solving. What are you good at? List your skills and expertise.",
                    mission_id: "mission-1",
                    quest_id: "mission1_quest2",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/skills-are-assets",
                            title: "Your Skills Are Your Assets"
                        },
                        {
                            type: "tools",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/tools/skill-assessment-template",
                            title: "Skill Assessment Template"
                        }
                    ],
                    component_key: "SkillsForm",
                    reflection_prompt: "List your top 3 to 5 skills. How could these skills help a potential customer solve their problem?",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: [],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 3: Ask and You Shall Receive
        // ============================================
        {
            id: "mission1_quest3",
            mission_id: "mission-1",
            title: "Start Asking",
            content_path: "content/missions/mission1/quests/q3.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 3,
            estimated_in_app_minutes: 30,
            estimated_off_app_minutes: 120,
            content: null,
            context: ["user_profile"],
            badge_config: {
                key: "badge_quest_1_3",
                title: "Fearless Asker",
                description: "Completed Quest 3: Assembled your support squad, introduced yourself online, and made real asks.",
                unlocked_identity: "Proactive Initiator",
                icon_key: "Megaphone"
            },
            notes: [
                {
                    title: "Start safe, then stretch",
                    type: "guide",
                    content: "We're going to start with people who already care about you—your squad. Then we'll stretch to people who don't know you yet.",
                    related_url: null
                },
                {
                    title: "This will feel uncomfortable",
                    type: "warning",
                    content: "That's the point. Asking is a skill, and like any skill, it gets easier with practice. The worst they can say is no.",
                    related_url: null
                },
                {
                    title: "You're offering something",
                    type: "guide",
                    content: "Remember, you're not asking for a favor. You're offering a chance to be part of your journey. People love to help.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 3: Start Asking. You've built your squad, introduced yourself to the community, and asked for a discount. You're now officially an 'asker.' The fear of asking is fading. Next up: chasing rejection.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 3.1: Ask for Support (Cheer Squad)
                {
                    id: "mission1_quest3_task1",
                    title: "Build Your Squad",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 30,
                    briefing_text: "Your success hinges on a support system. Send a short message to 3-5 people (friends, family, colleagues) and tell them you're starting a business and ask if they'd be part of your 'cheer squad' to follow your progress and hold you accountable. Use the template below—just customize it.\n\nTemplate: Hey [Name], I'm starting a business and I need people in my corner. Would you be willing to be part of my 'cheer squad'? I'll share my weekly progress with you. All you need to do is check in and hold me accountable. No heavy lifting—just your support. Would you be up for that?",
                    mission_id: "mission-1",
                    quest_id: "mission1_quest3",
                    execution_environment: null,
                    checkback_delay_days: 2,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/your-cheer-squad-matters",
                            title: "Why Your Cheer Squad Matters"
                        },
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-build-your-support-system",
                            title: "How to Build Your Support System"
                        },
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-ask-for-anything",
                            title: "How to Ask for Anything"
                        }
                    ],
                    component_key: "CheerSquadForm",
                    reflection_prompt: "Who did you ask? What was their reaction? Having a support network is your secret weapon.",
                    observation_context: null,
                    grant_points: 35,
                    challenges: null,
                    ai_config: null,
                    dependencies: [],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 3.2: Introduce Yourself to the Community
                {
                    id: "mission1_quest3_task2",
                    title: "Say Hello",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "The Urge community is your tribe. Your first step is to introduce yourself. Share your 'why_statement' and what you're hoping to build.",
                    mission_id: "mission-1",
                    quest_id: "mission1_quest3",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-introduce-yourself-online",
                            title: "How to Introduce Yourself Online"
                        }
                    ],
                    component_key: "CommunityIntroForm",
                    reflection_prompt: "What is one thing you're most excited to learn from the community?",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission1_quest1_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 3.3: Ask for a Discount
                {
                    id: "mission1_quest3_task3",
                    title: "Ask for Something",
                    sequence: 3,
                    execution_type: "off-task-action",
                    estimated_minutes: 30,
                    briefing_text: "Now you're warmed up. Let's make a bigger ask. Find a service, tool, or product you use (or want to use) for your business and ask for a discount or a better deal. This could be a software subscription, a freelance service, or even a coffee shop. Practice asking without hesitation.",
                    mission_id: "mission-1",
                    quest_id: "mission1_quest3",
                    execution_environment: null,
                    checkback_delay_days: 1,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-ask-for-a-discount",
                            title: "How to Ask for a Discount"
                        }
                    ],
                    component_key: "OffAppActionForm",
                    reflection_prompt: "How did it feel? What was the response? You've just proven you can ask for something. Now, think about how much easier this will feel next time.",
                    observation_context: null,
                    grant_points: 30,
                    challenges: [
                        {
                            title: "The 3-Ask Challenge",
                            description: "Make 3 asks this week. At least 1 should be to someone you don't know well. Track what happens.",
                            link: "/resources/challenges/the-3-ask-challenge"
                        }
                    ],
                    ai_config: null,
                    dependencies: ["mission1_quest3_task1"],
                    target_count: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 4: Hearing Nos
        // ============================================
        {
            id: "mission1_quest4",
            mission_id: "mission-1",
            title: "No Is Just Data",
            content_path: "content/missions/mission1/quests/q4.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 4,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 90,
            content: null,
            context: ["user_profile"],
            badge_config: {
                key: "badge_quest_1_4",
                title: "Rejection Master",
                description: "Completed Quest 4: Collected 'Nos', made bold asks, and conquered the fear of rejection.",
                unlocked_identity: "Bulletproof Builder",
                icon_key: "Flame"
            },
            notes: [
                {
                    title: "Rejection is not reflection",
                    type: "guide",
                    content: "Rejection is not a reflection of your worth. It's data. A 'no' today is a 'not yet' or a 'not this way.'",
                    related_url: null
                },
                {
                    title: "The real goal",
                    type: "guide",
                    content: "The goal isn't to get a 'yes.' The goal is to get comfortable with asking. The 'yes' will come later.",
                    related_url: null
                },
                {
                    title: "This will feel uncomfortable",
                    type: "nudge",
                    content: "That's the point. Growth lives just outside your comfort zone.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 4: No Is Just Data. You've faced rejection, made bold asks, and survived. You're now more resilient than 99% of people who never ask. You're ready for Mission 2.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 4.1: The Warm-Up Nos
                {
                    id: "mission1_quest4_task1",
                    title: "Practice Getting Nos",
                    sequence: 1,
                    execution_type: "off-task-action",
                    estimated_minutes: 45,
                    briefing_text: "Your challenge: Get 2 'No's. This could be from asking people for feedback on an idea, asking for a sale, or any other reasonable request where 'No' is a possible response. The goal is to collect them. Each 'No' is a data point and a step forward.\n\nSuggested scenarios:\n• Ask a stranger for directions to a place you already know (see if they say no)\n• Ask a friend to buy your product/service (even if it doesn't exist yet)\n• Ask a local business if they'd partner with you (without a clear proposal)\n• Ask someone for a big favor (like covering your shift or lending you money)",
                    mission_id: "mission-1",
                    quest_id: "mission1_quest4",
                    execution_environment: null,
                    checkback_delay_days: 3,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/why-no-is-better-than-maybe",
                            title: "Why 'No' Is Better Than 'Maybe'"
                        },
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/handling-rejection-like-a-pro",
                            title: "Handling Rejection Like a Pro"
                        }
                    ],
                    component_key: "OffAppActionForm",
                    reflection_prompt: "What did you learn from each 'No'? Did any of them give you a reason why that could be helpful?",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: [],
                    target_count: 2,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 4.2: The Big Ask
                {
                    id: "mission1_quest4_task2",
                    title: "The Bold Ask",
                    sequence: 2,
                    execution_type: "off-task-action",
                    estimated_minutes: 30,
                    briefing_text: "Now it's time for the real test. Make a request that you're 95% sure will get a 'no.' Ask for something big, bold, or unreasonable. The goal isn't to get a 'yes'—it's to prove to yourself that rejection won't kill you.\n\n🔥 Examples of bold asks:\n• Ask a celebrity or influencer for a call\n• Ask a company for free lifetime access to their product\n• Ask a local business to give you something for free\n• Ask someone to introduce you to their most valuable contact\n• Ask for a 90% discount on something\n\n💡 The more unreasonable, the better. You're not trying to get a yes. You're trying to get comfortable with rejection.",
                    mission_id: "mission-1",
                    quest_id: "mission1_quest4",
                    execution_environment: null,
                    checkback_delay_days: 2,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/turning-rejection-into-fuel",
                            title: "Turning Rejection Into Fuel"
                        },
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/the-art-of-the-bold-ask",
                            title: "The Art of the Bold Ask"
                        }
                    ],
                    component_key: "OffAppActionForm",
                    reflection_prompt: "You just made a bold ask. You probably got a 'no.' And you're still standing. That's the whole point. You're now more resilient than 99% of people who never ask.",
                    observation_context: null,
                    grant_points: 35,
                    challenges: [
                        {
                            title: "The Bold Ask",
                            description: "Make a request that you're 95% sure will get a 'no.' Ask for something big, bold, or unreasonable. Track what you learn.",
                            link: "/resources/challenges/the-bold-ask"
                        }
                    ],
                    ai_config: null,
                    dependencies: ["mission1_quest4_task1"],
                    target_count: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 4.3: The Reflection
                {
                    id: "mission1_quest4_task3",
                    title: "Rejection Mastery",
                    sequence: 3,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "You've done the hard work. You've asked, been rejected, and survived. Now let's turn those experiences into fuel by defining your next milestone targets.",
                    mission_id: "mission-1",
                    quest_id: "mission1_quest4",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/rejection-is-the-price-of-admission",
                            title: "Rejection Is the Price of Admission"
                        }
                    ],
                    component_key: "AuditForm",
                    reflection_prompt: "You've proven something to yourself today. Looking at the growth goals you just set, what is the most important mindset shift you need to achieve them?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission1_quest4_task2", "mission1_quest4_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

export default mission1;