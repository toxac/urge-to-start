// lib/playbook/mission4.ts
import { MissionSchema } from '@/types/playbook';

const mission4: MissionSchema = {
    id: "mission-4",
    title: "The Business Engine",
    content: null,
    content_path: "content/missions/mission4/mission.md",
    sequence: 4,
    video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
    big_question: "How will you make money?",
    estimated_time_in_days: 21,
    context: ["user_profile", "user_projects"],
    success_message: "You've completed Mission 4: The Business Engine. You've defined your offer, set your price, built your acquisition plan, run the numbers, and made a conscious decision. You know exactly how your business makes money—or if it can at all. Mission 5 awaits.",
    badge_config: {
        key: "badge_mission_4",
        title: "Engine Builder",
        description: "Completed Mission 4: The Business Engine. Modeled pricing, customer acquisition channels, and unit economics.",
        unlocked_identity: "Commercial Strategist",
        icon_key: "Cpu"
    },

    quests: [
        // ============================================
        // QUEST 1: Shape Your Offer
        // ============================================
        {
            id: "mission4_quest1",
            mission_id: "mission-4",
            title: "Shape Your Offer",
            content_path: "content/missions/mission4/quests/q1.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 1,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 30,
            content: null,
            context: ["user_profile", "user_projects"],
            badge_config: {
                key: "badge_quest_4_1",
                title: "Offer Architect",
                description: "Completed Quest 1: Defined your promise, focused what you're building, and mapped how customers experience your product.",
                unlocked_identity: "Value Creator",
                icon_key: "Gift"
            },
            notes: [
                {
                    title: "Your offer is your main promise",
                    type: "guide",
                    content: "Your offer isn't just a list of things you built. It's a simple promise to fix a specific problem. Get the promise clear first, and everything else falls into place naturally.",
                    related_url: null
                },
                {
                    title: "Focus on what they get, not what you built",
                    type: "nudge",
                    content: "What does your customer actually care about? They don't care about your behind-the-scenes effort—they care about how their life gets easier or better.",
                    related_url: null
                },
                {
                    title: "Keep it simple",
                    type: "warning",
                    content: "It's tempting to add a million things to make your product feel valuable. But a simple offer that works beats a complicated one every single time.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 1: Shape Your Offer! You have a crystal-clear promise, a focused list of what you're building, and a step-by-step map of how your customer will experience it.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 1.1: Your Promise
                {
                    id: "mission4_quest1_task1",
                    title: "Your Promise",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "What is the main promise you're making to your customer? What's the dream result they get when they buy from you? Let's break down who this is for, what's bothering them, and how you fix it.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-write-a-clear-promise",
                            title: "How to Write a Clear Promise"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/focus-on-outcomes-not-stuff",
                            title: "Focus on Outcomes, Not Stuff"
                        }
                    ],
                    component_key: "ValuePropositionForm",
                    reflection_prompt: "If your customer could only remember one single sentence about what you do, what would you want that to be?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: [
                        {
                            title: "The Simple Pitch Test",
                            description: "Can you explain your promise in two simple sentences to a friend? Try it until they immediately say 'Ah, that makes total sense!'",
                            link: "/resources/challenges/the-simple-pitch-test"
                        }
                    ],
                    ai_config: null,
                    dependencies: ["mission3_quest4_task3"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 1.2: Feature Brainstorm
                {
                    id: "mission4_quest1_task2",
                    title: "What Needs to Be Built?",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Keeping your promise in mind, list everything your product or service needs to actually deliver on that promise. Don't worry about order or cost yet—just brain dump all the requirements.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/brainstorming-product-requirements",
                            title: "Brainstorming What You Need to Build"
                        }
                    ],
                    component_key: "FeatureBrainstormForm",
                    reflection_prompt: "Looking at your list, which of these items are directly tied to keeping your promise, and which ones are just extra ideas?",
                    observation_context: null,
                    grant_points: 15,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission4_quest1_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 1.3: Feature Prioritization
                {
                    id: "mission4_quest1_task3",
                    title: "Pick What Matters Most",
                    sequence: 3,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Now let's sort through your list. Separate what is absolutely essential for Day 1 from what is just nice to have later. Leaving things out for now is how you get to launch quickly.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/deciding-what-to-build-first",
                            title: "Deciding What to Build First"
                        }
                    ],
                    component_key: "FeaturePrioritizationForm",
                    reflection_prompt: "Saying 'not right now' to good ideas can feel scary. What's one feature you chose to leave out for launch that actually feels like a relief?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission4_quest1_task2"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 1.4: Customer Experience Journey
                {
                    id: "mission4_quest1_task4",
                    title: "The Customer Journey",
                    sequence: 4,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Map out what happens step-by-step from the moment a customer finds you, to when they pay, to how they get what they bought, and how you stay in touch. This prepares you directly for understanding your costs next.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/mapping-the-customer-experience",
                            title: "Mapping the Customer Experience"
                        }
                    ],
                    component_key: "CustomerJourneyForm",
                    reflection_prompt: "Put yourself in your customer's shoes. At which step in the journey might they feel confused or stuck?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission4_quest1_task3"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 2: Price It Right
        // ============================================
        {
            id: "mission4_quest2",
            mission_id: "mission-4",
            title: "Price It Right",
            content_path: "content/missions/mission4/quests/q2.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 2,
            estimated_in_app_minutes: 30,
            estimated_off_app_minutes: 20,
            content: null,
            context: ["user_profile", "user_projects"],
            badge_config: {
                key: "badge_quest_4_2",
                title: "Value Pricer",
                description: "Completed Quest 2: Named your price confidently based on value perception, not fear.",
                unlocked_identity: "Monetization Strategist",
                icon_key: "DollarSign"
            },
            notes: [
                {
                    title: "Price is a statement",
                    type: "guide",
                    content: "Your price says something about your product. Too cheap and it feels low-quality. Too expensive and it feels out of reach.",
                    related_url: null
                },
                {
                    title: "Value first, cost second",
                    type: "guide",
                    content: "The right price is what your customer would willingly pay for the value they receive. Not what you need to survive.",
                    related_url: null
                },
                {
                    title: "Don't underprice",
                    type: "nudge",
                    content: "First-time founders almost always underprice. You can always go down. Going up is much harder.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 2: Price It Right. You have a confident price based on value, not fear.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 2.1: Set the Price
                {
                    id: "mission4_quest2_task1",
                    title: "Name Your Number",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Let's set your price. Start with what the problem costs your customer, then what they pay for alternatives, then name your number.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest2",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-price-your-offer",
                            title: "How to Price Your Offer"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/price-is-value-perceived",
                            title: "Price Is Value Perceived"
                        }
                    ],
                    component_key: "PriceSettingForm",
                    reflection_prompt: "If you were your customer, would you pay this price? Why or why not?",
                    observation_context: null,
                    grant_points: 25,
                    challenges: [
                        {
                            title: "The $1,000 Test",
                            description: "If your customer had $1,000 to spend on solving this problem, what would they spend it on? Are you in the top 3 choices?",
                            link: "/resources/challenges/the-1000-test"
                        }
                    ],
                    ai_config: null,
                    dependencies: ["mission4_quest1_task4"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 2.2: Price Assessment
                {
                    id: "mission4_quest2_task2",
                    title: "Test Your Price",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Now let's stress-test your price. Would customers pay double? Is it fair? Does it feel trustworthy?",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest2",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/price-assessment",
                            title: "Price Assessment"
                        }
                    ],
                    component_key: "PriceAssessmentForm",
                    reflection_prompt: "If your price feels 'too cheap,' you might be sending the wrong signal. What would make it feel premium?",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission4_quest2_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 3: Find Your Customers
        // ============================================
        {
            id: "mission4_quest3",
            mission_id: "mission-4",
            title: "Find Your Customers",
            content_path: "content/missions/mission4/quests/q3.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 3,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 60,
            content: null,
            context: ["user_profile", "user_projects"],
            badge_config: {
                key: "badge_quest_4_3",
                title: "Acquisition Planner",
                description: "Completed Quest 3: Selected a focused acquisition channel, crafted compelling messaging, and built an acquisition plan.",
                unlocked_identity: "Growth Initiator",
                icon_key: "Target"
            },
            notes: [
                {
                    title: "Focus is everything",
                    type: "guide",
                    content: "First-time founders die by trying five channels at once. Pick ONE channel and master it.",
                    related_url: null
                },
                {
                    title: "Your first 10 customers",
                    type: "guide",
                    content: "If you can't name where you'll find your first 10 customers, you don't have a channel.",
                    related_url: null
                },
                {
                    title: "Start small",
                    type: "nudge",
                    content: "You don't need a website. You need one customer. Start there.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 3: Find Your Customers. You have a focused channel, a clear message, and a realistic acquisition plan.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 3.1: Choose Your Channel
                {
                    id: "mission4_quest3_task1",
                    title: "Pick Your Channel",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Where do your first 10 customers come from? Be specific. If you can't name the place, you don't have a channel.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest3",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/choosing-your-first-channel",
                            title: "Choosing Your First Channel"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/one-channel-first",
                            title: "One Channel First"
                        }
                    ],
                    component_key: "ChannelSelectionForm",
                    reflection_prompt: "Why did you pick this channel over all others? What makes it your best first bet?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: [
                        {
                            title: "The 1-Customer Challenge",
                            description: "Try to get just one customer this week. Not 10. Not 100. Just one.",
                            link: "/resources/challenges/the-1-customer-challenge"
                        }
                    ],
                    ai_config: null,
                    dependencies: ["mission4_quest2_task2"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 3.2: Craft Your Message
                {
                    id: "mission4_quest3_task2",
                    title: "Craft Your Message",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "What will you say? What's your exact offer or message? Why should they stop scrolling and buy today?",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest3",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/crafting-your-first-message",
                            title: "Crafting Your First Message"
                        }
                    ],
                    component_key: "MessagingForm",
                    reflection_prompt: "Would you respond to this message? If not, rewrite it until you would.",
                    observation_context: null,
                    grant_points: 15,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission4_quest3_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 3.3: Acquisition Assessment
                {
                    id: "mission4_quest3_task3",
                    title: "Assess Your Plan",
                    sequence: 3,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Now let's be realistic. How many people do you need to reach for one sale? How many hours will you spend? What do you need to start?",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest3",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/acquisition-math",
                            title: "Acquisition Math"
                        }
                    ],
                    component_key: "AcquisitionAssessmentForm",
                    reflection_prompt: "If this acquisition plan fails, what's your backup plan? Always have a Plan B.",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission4_quest3_task2"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 4: The Financials
        // ============================================
        {
            id: "mission4_quest4",
            mission_id: "mission-4",
            title: "The Financials",
            content_path: "content/missions/mission4/quests/q4.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 4,
            estimated_in_app_minutes: 60,
            estimated_off_app_minutes: 90,
            content: null,
            context: ["user_profile", "user_projects"],
            badge_config: {
                key: "badge_quest_4_4",
                title: "Financial Master",
                description: "Completed Quest 4: Modeled cost structures, fixed/variable costs, and unit economics profitability.",
                unlocked_identity: "Numbers Realist",
                icon_key: "Calculator"
            },
            notes: [
                {
                    title: "Use the Excel template",
                    type: "guide",
                    content: "We've provided an Excel template to help you work through the numbers. Use it alongside the app to do the detailed work.",
                    related_url: null
                },
                {
                    title: "The math doesn't lie",
                    type: "guide",
                    content: "If the numbers don't work, the business doesn't work. Don't ignore the math.",
                    related_url: null
                },
                {
                    title: "Be honest with yourself",
                    type: "nudge",
                    content: "First-time founders often underestimate costs and overestimate sales. Be brutal about the numbers.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 4: The Financials. You understand your costs, your unit economics, and your profitability. The numbers tell a story—are you listening?",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 4.1: Cost Structure
                {
                    id: "mission4_quest4_task1",
                    title: "What Does It Cost?",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 25,
                    briefing_text: "Let's get real about costs. Don't guess—estimate as accurately as you can. We'll use these numbers to see if your business can make money.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest4",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/understanding-business-costs",
                            title: "Understanding Business Costs"
                        }
                    ],
                    component_key: "CostStructureForm",
                    reflection_prompt: "Look at your costs. What surprised you? What could you reduce or eliminate?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission4_quest3_task3"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 4.2: Cost Analysis
                {
                    id: "mission4_quest4_task2",
                    title: "Understand Your Costs",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Now let's look at your costs differently. Fixed vs variable. What happens when you sell more?",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest4",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/fixed-vs-variable-costs",
                            title: "Fixed vs Variable Costs"
                        }
                    ],
                    component_key: "CostAnalysisForm",
                    reflection_prompt: "If you had to cut your costs in half, how would you do it? Would the customer experience suffer?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission4_quest4_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 4.3: Profitability Check
                {
                    id: "mission4_quest4_task3",
                    title: "Does the Math Work?",
                    sequence: 3,
                    execution_type: "standard-form",
                    estimated_minutes: 25,
                    briefing_text: "The moment of truth. Does your business make money? Let's run the numbers.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest4",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/unit-economics",
                            title: "Unit Economics"
                        }
                    ],
                    component_key: "ProfitabilityCheckForm",
                    reflection_prompt: "If you're not making a profit, what would need to change? More sales? Higher price? Lower costs? Be specific.",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission4_quest4_task2"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 5: Go or No-Go
        // ============================================
        {
            id: "mission4_quest5",
            mission_id: "mission-4",
            title: "Go or No-Go",
            content_path: "content/missions/mission4/quests/q5.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 5,
            estimated_in_app_minutes: 20,
            estimated_off_app_minutes: 10,
            content: null,
            context: ["user_profile", "user_projects"],
            badge_config: {
                key: "badge_quest_4_5",
                title: "Commercial Decision Maker",
                description: "Completed Quest 5: Evaluated unit economics objectively and made a conscious commercial call.",
                unlocked_identity: "Data-Driven Founder",
                icon_key: "CheckSquare"
            },
            notes: [
                {
                    title: "The numbers don't lie",
                    type: "guide",
                    content: "This is the moment of truth. If the numbers don't work, the business doesn't work. Be honest with yourself.",
                    related_url: null
                },
                {
                    title: "Iteration is okay",
                    type: "guide",
                    content: "If the numbers don't quite work, you can iterate. Change the price, change the MSP, change the channel. Just be specific about what you'll change.",
                    related_url: null
                },
                {
                    title: "No-Go is a win too",
                    type: "nudge",
                    content: "Saying 'no' to a bad business is a win. You've saved yourself time, money, and stress. Take what you've learned to the next opportunity.",
                    related_url: null
                }
            ],
            success_message: "You've completed Mission 4: The Business Engine. You've made a conscious decision based on real numbers. This is what building a real business looks like.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 5.1: Make the Call
                {
                    id: "mission4_quest5_task1",
                    title: "Make the Call",
                    sequence: 1,
                    execution_type: "decision_gate",
                    estimated_minutes: 20,
                    briefing_text: "You've done the work. You have the numbers. Now make a decision. No overthinking. Just pick.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest5",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/making-the-call",
                            title: "Making the Call"
                        }
                    ],
                    component_key: "FinalDecisionForm",
                    reflection_prompt: "What did you learn from this financial exercise? If you're saying 'no' to this business, what did you learn that you'll take to the next one?",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: {
                        role: "Financial Decision Advisor",
                        persona_name: "The Numbers Coach",
                        persona_prompt: "You are a pragmatic business coach who helps founders make decisions based on numbers. You're direct, honest, and focused on what the data says. You don't sugarcoat—you tell founders what they need to hear, not what they want to hear.",
                        required_context: ["user_profile", "financial_blueprint"]
                    },
                    dependencies: ["mission4_quest4_task3"],
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

export default mission4;