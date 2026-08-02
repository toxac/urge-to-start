import { MissionSchema } from './types';

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

    quests: [
        // ============================================
        // QUEST 1: Shape Your Offer
        // ============================================
        {
            id: "mission4_quest1",
            title: "Shape Your Offer",
            content_path: "content/missions/mission4/quests/shape-your-offer.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 1,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 30,
            content: null,
            context: ["user_profile", "user_projects"],
            on_success: {
                grant_points: 60,
                badge_key: "OFFER_DEFINER"
            },
            notes: [
                {
                    title: "Your offer is your promise",
                    type: "guide",
                    content: "Your offer isn't just a list of features. It's a promise to solve a problem. Get the promise right, and the features follow.",
                    related_url: null
                },
                {
                    title: "Start with the customer",
                    type: "nudge",
                    content: "What does your customer actually want? Not what you want to build. What they want to buy.",
                    related_url: null
                },
                {
                    title: "Resist the temptation to add more",
                    type: "warning",
                    content: "A clear offer beats a complicated one every time. The best offers are simple.",
                    related_url: null
                }
            ],
            challenges: [
                {
                    title: "The 2-Minute Test",
                    description: "Can you explain your offer in 2 minutes to a stranger? Practice until they say 'I get it.'",
                    link: "/resources/challenges/the-2-minute-test"
                }
            ],
            success_message: "You've completed Quest 1: Shape Your Offer. You have a clear value proposition, a focused feature set, and a mapped customer experience. You know what you're selling.",

            tasks: [
                // Task 1.1: Value Proposition
                {
                    id: "mission4_quest1_task1",
                    title: "Your Promise",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "What's the core promise you're making to your customer? What's the one thing they get that they can't get elsewhere? Your value proposition is the heartbeat of your offer.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: null,
                    interval: null,
                    references: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-write-a-value-proposition",
                            title: "How to Write a Value Proposition"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/the-value-proposition-is-not-the-features",
                            title: "The Value Proposition Is Not the Features"
                        }
                    ],
                    component_key: "ValuePropositionForm",
                    reflection_prompt: "If your customer could only remember one thing about your offer, what should it be? That's your value proposition.",
                    observation_context: null,
                    on_success: {
                        grant_points: 20,
                        badge_key: "VALUE_PROMISE"
                    },
                    ai_config: null,
                    dependencies: ["mission3_quest4_task3"]
                },

                // Task 1.2: Feature Set
                {
                    id: "mission4_quest1_task2",
                    title: "What's In, What's Out",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Brain dump all the features your solution could have. Don't filter, don't prioritize. Just list everything you can imagine. We'll filter in the next task.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: null,
                    interval: null,
                    references: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/feature-brainstorming",
                            title: "Feature Brainstorming"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/mvp-means-elimination",
                            title: "MVP Means Elimination"
                        }
                    ],
                    component_key: "FeatureBrainstormForm",
                    reflection_prompt: "Look at your list. What features are you most excited about? Which ones are you dreading? That's a signal.",
                    observation_context: null,
                    on_success: {
                        grant_points: 15,
                        badge_key: "FEATURE_BRAINSTORMER"
                    },
                    ai_config: null,
                    dependencies: ["mission4_quest1_task1"]
                },

                // Task 1.3: Feature Prioritization
                {
                    id: "mission4_quest1_task3",
                    title: "Pick Your Focus",
                    sequence: 3,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Now let's be ruthless. From your brainstorm, pick 3 must-have features for your first version. Then list what you explicitly won't include. This is where the magic happens.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: null,
                    interval: null,
                    references: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/prioritizing-features",
                            title: "Prioritizing Features"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/you-are-not-your-features",
                            title: "You Are Not Your Features"
                        }
                    ],
                    component_key: "FeaturePrioritizationForm",
                    reflection_prompt: "You're saying 'no' to features. How does that feel? The best founders get comfortable with saying 'no' to good ideas so they can say 'yes' to great ones.",
                    observation_context: null,
                    on_success: {
                        grant_points: 20,
                        badge_key: "FEATURE_PRIORITIZER"
                    },
                    ai_config: null,
                    dependencies: ["mission4_quest1_task2"]
                },

                // Task 1.4: Customer Experience
                {
                    id: "mission4_quest1_task4",
                    title: "The Journey",
                    sequence: 4,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Map the customer experience from payment to delivery. What happens after they give you money? Walk through each step.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: null,
                    interval: null,
                    references: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/mapping-the-customer-journey",
                            title: "Mapping the Customer Journey"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/customer-experience-is-the-product",
                            title: "Customer Experience Is the Product"
                        }
                    ],
                    component_key: "CustomerExperienceForm",
                    reflection_prompt: "Put yourself in your customer's shoes. What are they feeling at each step? Where does the anxiety or confusion happen?",
                    observation_context: null,
                    on_success: {
                        grant_points: 20,
                        badge_key: "EXPERIENCE_MAPPER"
                    },
                    ai_config: null,
                    dependencies: ["mission4_quest1_task3"]
                }
            ]
        },

        // ============================================
        // QUEST 2: Price It Right
        // ============================================
        {
            id: "mission4_quest2",
            title: "Price It Right",
            content_path: "content/missions/mission4/quests/price-it-right.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 2,
            estimated_in_app_minutes: 30,
            estimated_off_app_minutes: 20,
            content: null,
            context: ["user_profile", "user_projects"],
            on_success: {
                grant_points: 50,
                badge_key: "PRICE_SETTER"
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
            challenges: [
                {
                    title: "The $1,000 Test",
                    description: "If your customer had $1,000 to spend on solving this problem, what would they spend it on? Are you in the top 3 choices?",
                    link: "/resources/challenges/the-1000-test"
                }
            ],
            success_message: "You've completed Quest 2: Price It Right. You have a confident price based on value, not fear.",

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
                    recurring: null,
                    interval: null,
                    references: [
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
                    on_success: {
                        grant_points: 25,
                        badge_key: "PRICE_NAMER"
                    },
                    ai_config: null,
                    dependencies: ["mission4_quest1_task4"]
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
                    recurring: null,
                    interval: null,
                    references: [
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
                    on_success: {
                        grant_points: 25,
                        badge_key: "PRICE_ASSESSOR"
                    },
                    ai_config: null,
                    dependencies: ["mission4_quest2_task1"]
                }
            ]
        },

        // ============================================
        // QUEST 3: Find Your Customers
        // ============================================
        {
            id: "mission4_quest3",
            title: "Find Your Customers",
            content_path: "content/missions/mission4/quests/find-your-customers.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 3,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 60,
            content: null,
            context: ["user_profile", "user_projects"],
            on_success: {
                grant_points: 60,
                badge_key: "ACQUISITION_PLANNER"
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
            challenges: [
                {
                    title: "The 1-Customer Challenge",
                    description: "Try to get just one customer this week. Not 10. Not 100. Just one.",
                    link: "/resources/challenges/the-1-customer-challenge"
                }
            ],
            success_message: "You've completed Quest 3: Find Your Customers. You have a focused channel, a clear message, and a realistic acquisition plan.",

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
                    recurring: null,
                    interval: null,
                    references: [
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
                    on_success: {
                        grant_points: 20,
                        badge_key: "CHANNEL_CHOOSER"
                    },
                    ai_config: null,
                    dependencies: ["mission4_quest2_task2"]
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
                    recurring: null,
                    interval: null,
                    references: [
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
                    on_success: {
                        grant_points: 15,
                        badge_key: "MESSAGE_CRAFTER"
                    },
                    ai_config: null,
                    dependencies: ["mission4_quest3_task1"]
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
                    recurring: null,
                    interval: null,
                    references: [
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
                    on_success: {
                        grant_points: 25,
                        badge_key: "ACQUISITION_ASSESSOR"
                    },
                    ai_config: null,
                    dependencies: ["mission4_quest3_task2"]
                }
            ]
        },

        // ============================================
        // QUEST 4: The Financials
        // ============================================
        {
            id: "mission4_quest4",
            title: "The Financials",
            content_path: "content/missions/mission4/quests/the-financials.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 4,
            estimated_in_app_minutes: 60,
            estimated_off_app_minutes: 90,
            content: null,
            context: ["user_profile", "user_projects"],
            on_success: {
                grant_points: 65,
                badge_key: "FINANCIAL_MASTER"
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
            challenges: [],
            success_message: "You've completed Quest 4: The Financials. You understand your costs, your unit economics, and your profitability. The numbers tell a story—are you listening?",

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
                    recurring: null,
                    interval: null,
                    references: [
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
                    on_success: {
                        grant_points: 20,
                        badge_key: "COST_ANALYZER"
                    },
                    ai_config: null,
                    dependencies: ["mission4_quest3_task3"]
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
                    recurring: null,
                    interval: null,
                    references: [
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
                    on_success: {
                        grant_points: 20,
                        badge_key: "COST_UNDERSTANDER"
                    },
                    ai_config: null,
                    dependencies: ["mission4_quest4_task1"]
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
                    recurring: null,
                    interval: null,
                    references: [
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
                    on_success: {
                        grant_points: 25,
                        badge_key: "PROFITABILITY_CHECKER"
                    },
                    ai_config: null,
                    dependencies: ["mission4_quest4_task2"]
                }
            ]
        },

        // ============================================
        // QUEST 5: Go or No-Go
        // ============================================
        {
            id: "mission4_quest5",
            title: "Go or No-Go",
            content_path: "content/missions/mission4/quests/go-or-no-go.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 5,
            estimated_in_app_minutes: 20,
            estimated_off_app_minutes: 10,
            content: null,
            context: ["user_profile", "user_projects"],
            on_success: {
                grant_points: 40,
                badge_key: "FINAL_DECISION"
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
            challenges: [],
            success_message: "You've completed Mission 4: The Business Engine. You've made a conscious decision based on real numbers. This is what building a real business looks like.",

            tasks: [
                // Task 5.1: Make the Call
                {
                    id: "mission4_quest5_task1",
                    title: "Make the Call",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "You've done the work. You have the numbers. Now make a decision. No overthinking. Just pick.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest5",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: null,
                    interval: null,
                    references: [
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
                    on_success: {
                        grant_points: 25,
                        badge_key: "DECISION_MAKER"
                    },
                    ai_config: {
                        role: "Financial Decision Advisor",
                        persona_name: "The Numbers Coach",
                        persona_prompt: "You are a pragmatic business coach who helps founders make decisions based on numbers. You're direct, honest, and focused on what the data says. You don't sugarcoat—you tell founders what they need to hear, not what they want to hear.",
                        required_context: ["user_profile", "financial_blueprint"]
                    },
                    dependencies: ["mission4_quest4_task3"]
                }
            ]
        }
    ]
};

export default mission4;