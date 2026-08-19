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
                    id: "mission4_quest1_task4",
                    title: "The Customer Journey",
                    sequence: 3,
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
                },
                // Task 1.4: Customer Experience Journey
                {
                    id: "mission4_quest1_task3",
                    title: "Pick What Matters Most",
                    sequence: 4,
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

            ]
        },

        // ============================================
        // QUEST 2: Price It Right
        // ============================================
        {
            id: "mission4_quest2",
            mission_id: "mission-4",
            title: "The Costs",
            content_path: "content/missions/mission4/quests/q2.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 2,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 30,
            content: null,
            context: ["user_profile", "user_projects"],
            badge_config: {
                key: "badge_quest_4_2",
                title: "Cost Analyst",
                description: "Completed Quest 2: Mapped out unit costs, operational overhead, acquisition budgets, and financial risk.",
                unlocked_identity: "Cost Realist",
                icon_key: "Calculator"
            },
            notes: [
                {
                    title: "Know your true cost per order",
                    type: "guide",
                    content: "Many first-time founders forget packaging, payment fees, or shipping costs. Make sure every single rupee that leaves your pocket per order is accounted for.",
                    related_url: null
                },
                {
                    title: "Overhead can sneak up on you",
                    type: "nudge",
                    content: "Small monthly software subscriptions and legal fees add up fast. Knowing your monthly baseline helps you understand how many sales you need just to keep the lights on.",
                    related_url: null
                },
                {
                    title: "Customer acquisition is not free",
                    type: "warning",
                    content: "Even if you don't run paid ads, your time, samples, and outreach materials cost money. Plan for it up front so you aren't surprised later.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 2: The Costs! You now know exactly what it costs to make one item, run your operations monthly, and win new customers. You have a realistic view of your financial foundation.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 2.1: Unit Costs
                {
                    id: "mission4_quest2_task1",
                    title: "Cost to Make & Deliver One Unit",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Let's figure out what it costs out-of-pocket every time someone buys from you. List your raw materials, packaging, delivery charges, and payment processing fees.",
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
                            url_link: "/resources/guides/finding-your-unit-cost",
                            title: "How to Calculate Your Cost Per Unit"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/the-hidden-costs-of-delivery-and-packaging",
                            title: "Don't Forget Packaging and Payment Fees"
                        }
                    ],
                    component_key: "UnitCostForm",
                    reflection_prompt: "Looking at your cost to make one item, what was higher or lower than you expected?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: [
                        {
                            title: "The Packaging Reality Check",
                            description: "Buy or estimate a single complete shipping box/envelope with tape, label, and filler. Did you account for every small piece?",
                            link: "/resources/challenges/packaging-reality-check"
                        }
                    ],
                    ai_config: null,
                    dependencies: ["mission4_quest1_task4"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 2.2: Setup & Monthly Overhead
                {
                    id: "mission4_quest2_task2",
                    title: "Setup & Monthly Overhead",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Now let's map out the one-time costs to start (like permits or equipment) and the regular monthly bills required to keep the business open (like software, rent, or accounting fees).",
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
                            url_link: "/resources/guides/startup-costs-vs-monthly-bills",
                            title: "One-Time Setup Costs vs. Monthly Bills"
                        }
                    ],
                    component_key: "OtherCostsForm",
                    reflection_prompt: "Which of your monthly bills are absolute must-haves, and which ones could you start without?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission4_quest2_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 2.3: Finding & Winning Customers
                {
                    id: "mission4_quest2_task3",
                    title: "Finding & Winning Customers",
                    sequence: 3,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Getting customers takes budget and effort. Using the target customer persona from Mission 2, map out what you will spend on ads, printed flyers, sample giveaways, or marketing tools.",
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
                            url_link: "/resources/guides/budgeting-for-first-customers",
                            title: "Budgeting to Get Your First 10 Customers"
                        }
                    ],
                    component_key: "CustomerAcquisitionCostForm",
                    reflection_prompt: "If your main marketing idea doesn't work, what is your secondary, low-cost backup plan to get buyers?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: [
                        {
                            title: "The 10-Sample Test",
                            description: "If giving out free samples or running local promo, calculate the exact total cost of getting 10 samples into real target hands.",
                            link: "/resources/challenges/the-10-sample-test"
                        }
                    ],
                    ai_config: null,
                    dependencies: ["mission4_quest2_task2"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 2.4: Cost Analysis & Risk Review
                {
                    id: "mission4_quest2_task4",
                    title: "Cost Analysis & Risk Review",
                    sequence: 4,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Let's review the big picture. We'll summarize your total setup capital, monthly bills, and unit costs to highlight financial risks and opportunities like bulk savings.",
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
                            url_link: "/resources/guides/spotting-financial-risks-early",
                            title: "Spotting Financial Risks Before Launching"
                        }
                    ],
                    component_key: "CostAnalysisForm",
                    reflection_prompt: "How can you reduce your unit costs as your order volume grows over time?",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission4_quest2_task3"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 3: Price It Right
        // ============================================
        {
            id: "mission4_quest3",
            mission_id: "mission-4",
            title: "Price It Right",
            sequence: 3,
            estimated_in_app_minutes: 35,
            estimated_off_app_minutes: 20,
            content_path: "content/missions/mission4/quests/q3.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            content: null,
            context: ["user_profile", "user_projects"],
            badge_config: {
                key: "badge_quest_4_3",
                title: "Pricing Strategist",
                description: "Completed Quest 3: Simulated pricing models, analyzed profit margins, and set a break-even launch target.",
                unlocked_identity: "Value Pricer",
                icon_key: "Tag"
            },
            notes: [
                {
                    title: "Don't underprice out of fear",
                    type: "guide",
                    content: "First-time founders often charge too little because they fear rejection. Underpricing makes it almost impossible to cover customer acquisition costs.",
                    related_url: null
                },
                {
                    title: "Value > Cost",
                    type: "nudge",
                    content: "Customers don't buy based on what it costs you to make an item. They buy based on how much value or time saving it brings to them.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 3: Price It Right! You now have a clear launch price, healthy profit margins, and a precise break-even target.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 3.1: Explore Pricing Strategies
                {
                    id: "mission4_quest3_task1",
                    title: "Explore Pricing Strategies",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 10,
                    briefing_text: "Let's review your early value estimates from Mission 1 and select the pricing approach that best fits your product positioning.",
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
                            isRequired: true,
                            url_link: "/resources/guides/the-3-pricing-strategies-for-founders",
                            title: "Required Reading: The 3 Pricing Strategies Every Founder Must Know"
                        }
                    ],
                    component_key: "PricingStrategyForm",
                    reflection_prompt: "Which pricing strategy felt most natural for your product type, and why?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission4_quest2_task4"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 3.2: The Price Simulator
                {
                    id: "mission4_quest3_task2",
                    title: "The Price Simulator",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Play around with different price points and sales volumes to watch how your profit margins and break-even sales targets react in real time.",
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
                            url_link: "/resources/guides/understanding-gross-margins-and-breakeven",
                            title: "Understanding Gross Margins and Break-Even Targets"
                        }
                    ],
                    component_key: "PriceSimulatorForm",
                    reflection_prompt: "How did increasing or decreasing your price impact the number of sales you need each month to break even?",
                    observation_context: null,
                    grant_points: 25,
                    challenges: [
                        {
                            title: "The 20% Price Sensitivity Test",
                            description: "Simulate a price 20% higher than your original guess. Notice how many fewer sales you need to cover your fixed monthly bills.",
                            link: "/resources/challenges/price-sensitivity-test"
                        }
                    ],
                    ai_config: null,
                    dependencies: ["mission4_quest3_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 3.3: Lock In Your Launch Price
                {
                    id: "mission4_quest3_task3",
                    title: "Lock In Your Launch Price",
                    sequence: 3,
                    execution_type: "standard-form",
                    estimated_minutes: 10,
                    briefing_text: "Finalize your Day 1 selling price, set your monthly unit target, and lock in your profitability roadmap.",
                    mission_id: "mission-4",
                    quest_id: "mission4_quest3",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [],
                    component_key: "PricingLockInForm",
                    reflection_prompt: "Why is this launch price realistic for your first 10 customers?",
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