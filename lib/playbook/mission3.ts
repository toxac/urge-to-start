// lib/playbook/mission3.ts
import { MissionSchema } from '@/types/playbook';

const mission3: MissionSchema = {
    id: "mission-3",
    title: "Getting Real",
    content: null,
    content_path: "content/missions/mission3/mission.md",
    sequence: 3,
    video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
    big_question: "Is this business worth building?",
    estimated_time_in_days: 21,
    context: ["user_profile", "user_opportunities", "user_projects"],
    success_message: "You've completed Mission 3: Getting Real. You've validated your problem with real customers, defined your Minimum Sellable Product, understood your environment, and made a conscious decision about your business. You're no longer dreaming—you're building with intention. Mission 4 awaits.",
    badge_config: {
        key: "badge_mission_3",
        title: "Validated Strategist",
        description: "Completed Mission 3: Getting Real. Validated customer pain, defined your MSP, and made an intentional Go/No-Go decision.",
        unlocked_identity: "Intentional Builder",
        icon_key: "ShieldCheck"
    },

    quests: [
        // ============================================
        // QUEST 1: The Deep Dive
        // ============================================
        {
            id: "mission3_quest1",
            mission_id: "mission-3",
            title: "The Deep Dive",
            content_path: "content/missions/mission3/quests/q1.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 1,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 180,
            content: null,
            context: ["user_profile", "user_opportunities", "user_projects"],
            badge_config: {
                key: "badge_quest_3_1",
                title: "Problem Master",
                description: "Completed Quest 1: Conducted real customer interviews and defined a crystal-clear customer persona.",
                unlocked_identity: "Customer-Centric Investigator",
                icon_key: "Search"
            },
            notes: [
                {
                    title: "From opportunity to problem",
                    type: "guide",
                    content: "In Mission 2, you found an opportunity. Now we're turning it into a problem to solve. This shift in perspective is critical.",
                    related_url: null
                },
                {
                    title: "Details matter",
                    type: "guide",
                    content: "The more specific you are about the problem, the easier it will be to build a solution that actually works.",
                    related_url: null
                },
                {
                    title: "Be specific",
                    type: "nudge",
                    content: "If your problem statement could apply to anyone, it applies to no one. Get specific.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 1: The Deep Dive. You now understand your problem intimately—when it happens, who it affects, and what people do about it.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 1.1: The Problem
                {
                    id: "mission3_quest1_task1",
                    title: "Talk to Customers (5 or more)",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 45,
                    briefing_text: "This is the most important task in Mission 3. Talk to 5 real people who have this problem. Don't pitch your solution—just listen. Understand their pain.",
                    mission_id: "mission-3",
                    quest_id: "mission3_quest1",
                    execution_environment: null,
                    checkback_delay_days: 3,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: true,
                            url_link: "/resources/guides/how-to-conduct-customer-interviews",
                            title: "How to Conduct Customer Interviews (includes Google Form template)"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/customer-interviews-are-gold",
                            title: "Customer Interviews Are Gold"
                        }
                    ],
                    component_key: "CustomerInterviewLogger",
                    reflection_prompt: "What surprised you most in these interviews? What did you learn that you didn't expect?",
                    observation_context: null,
                    grant_points: 30,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission3_quest1_task1"],
                    target_count: 5,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                // Task 1.2: Talk to Customers
                {
                    id: "mission3_quest1_task2",
                    title: "Define the Problem",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 25,
                    briefing_text: "You found an opportunity. Now let's turn it into a clear problem statement. The better you understand the problem, the better your solution will be.",
                    mission_id: "mission-3",
                    quest_id: "mission3_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-write-a-problem-statement",
                            title: "How to Write a Problem Statement"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/the-problem-is-the-product",
                            title: "The Problem Is the Product"
                        }
                    ],
                    component_key: "ProblemDefinitionForm",
                    reflection_prompt: "Looking at your problem statement, would someone who has this problem recognize themselves in it? If not, go deeper.",
                    observation_context: null,
                    grant_points: 20,
                    challenges: [
                        {
                            title: "The 5-Why Challenge",
                            description: "Ask 'why' 5 times to get to the root cause of your problem. Don't stop at surface-level answers.",
                            link: "/resources/challenges/the-5-why-challenge"
                        }
                    ],
                    ai_config: null,
                    dependencies: [],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 1.3: The Customer Persona
                {
                    id: "mission3_quest1_task3",
                    title: "Create Your Customer",
                    sequence: 3,
                    execution_type: "standard-form",
                    estimated_minutes: 25,
                    briefing_text: "Create one customer persona. Focus on one person who has this problem. The more specific, the better.",
                    mission_id: "mission-3",
                    quest_id: "mission3_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-create-customer-personas",
                            title: "How to Create Customer Personas"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/one-persona-is-enough",
                            title: "One Persona Is Enough"
                        }
                    ],
                    component_key: "CustomerPersonaForm",
                    reflection_prompt: "Would this person recognize themselves in this persona? If not, go back and add more detail.",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission3_quest1_task2"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 2: Build to Sell
        // ============================================
        {
            id: "mission3_quest2",
            mission_id: "mission-3",
            title: "Build to Sell",
            content_path: "content/missions/mission3/quests/q2.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 2,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 60,
            content: null,
            context: ["user_profile", "user_projects"],
            badge_config: {
                key: "badge_quest_3_2",
                title: "MSP Architect",
                description: "Completed Quest 2: Designed a lean, focused Minimum Sellable Product ready for market execution.",
                unlocked_identity: "Lean Product Strategist",
                icon_key: "Layers"
            },
            notes: [
                {
                    title: "Build to sell, not to validate",
                    type: "guide",
                    content: "Your goal isn't to build something that might work. It's to sell something that does work.",
                    related_url: null
                },
                {
                    title: "Start small",
                    type: "guide",
                    content: "The smallest sellable thing is the fastest path to learning. You can always expand later.",
                    related_url: null
                },
                {
                    title: "Resist scope creep",
                    type: "nudge",
                    content: "Your first version should feel almost embarrassingly small. That's how you know it's right.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 2: Build to Sell. You've defined your Minimum Sellable Product. It's small, focused, and ready to sell.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 2.1: Type of Solution
                {
                    id: "mission3_quest2_task1",
                    title: "How Will You Solve It?",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 25,
                    briefing_text: "There are many ways to solve a problem. Let's explore four approaches and pick the one that fits your customer best.",
                    mission_id: "mission-3",
                    quest_id: "mission3_quest2",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/choosing-your-solution-type",
                            title: "Choosing Your Solution Type"
                        }
                    ],
                    component_key: "SolutionTypeForm",
                    reflection_prompt: "Why did you choose this approach? What makes it the best fit for your customer?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: [
                        {
                            title: "The 7-Day Build",
                            description: "Can you build your MSP in 7 days? If not, it's too big. Cut it down.",
                            link: "/resources/challenges/the-7-day-build"
                        }
                    ],
                    ai_config: null,
                    dependencies: ["mission3_quest1_task3"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 2.2: What Does It Look Like?
                {
                    id: "mission3_quest2_task2",
                    title: "Define Your MSP",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Describe your Minimum Sellable Product in one sentence. The smallest thing you can sell right now.",
                    mission_id: "mission-3",
                    quest_id: "mission3_quest2",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/defining-your-minimum-sellable-product",
                            title: "Defining Your Minimum Sellable Product"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/what-is-an-msp",
                            title: "What Is a Minimum Sellable Product?"
                        }
                    ],
                    component_key: "MSPDefinitionForm",
                    reflection_prompt: "Is this something you could sell today? If not, it's too big. Cut it down.",
                    observation_context: null,
                    grant_points: 15,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission3_quest2_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 2.3: Build Your MSP
                {
                    id: "mission3_quest2_task3",
                    title: "Build Your MSP",
                    sequence: 3,
                    execution_type: "standard-form",
                    estimated_minutes: 25,
                    briefing_text: "Now let's define everything about your MSP—price, delivery, resources, timeline, and differentiation.",
                    mission_id: "mission-3",
                    quest_id: "mission3_quest2",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/designing-your-minimum-sellable-product",
                            title: "Designing Your Minimum Sellable Product"
                        }
                    ],
                    component_key: "MSPBuildForm",
                    reflection_prompt: "Would you buy this? At this price? For this value? Be honest.",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission3_quest2_task2"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 3: Know the Battlefield
        // ============================================
        {
            id: "mission3_quest3",
            mission_id: "mission-3",
            title: "Know the Battlefield",
            content_path: "content/missions/mission3/quests/q3.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 3,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 60,
            content: null,
            context: ["user_profile", "user_projects"],
            badge_config: {
                key: "badge_quest_3_3",
                title: "Landscape Analyst",
                description: "Completed Quest 3: Mapped competitive workarounds and verified essential business compliance requirements.",
                unlocked_identity: "Battlefield Strategist",
                icon_key: "Map"
            },
            notes: [
                {
                    title: "Know your battlefield",
                    type: "guide",
                    content: "Understanding the environment is as important as understanding the problem. What's working? What's hard? Where are your customers?",
                    related_url: null
                },
                {
                    title: "Your real competition",
                    type: "guide",
                    content: "Your competition isn't other companies. It's the workaround—people doing it themselves.",
                    related_url: null
                },
                {
                    title: "Be honest about risks",
                    type: "nudge",
                    content: "The biggest risks are the ones you don't see coming. Name them.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 3: Know the Battlefield. You understand the landscape, the trends, and the compliance requirements. You're ready to make an informed decision.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 3.1: Landscape
                {
                    id: "mission3_quest3_task1",
                    title: "Map the Landscape",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 30,
                    briefing_text: "Let's map the environment. What trends make this problem relevant? Who else solves it? What's working? What's hard? Where are your customers?",
                    mission_id: "mission-3",
                    quest_id: "mission3_quest3",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/mapping-the-competitive-landscape",
                            title: "Mapping the Competitive Landscape"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/the-competition-is-the-workaround",
                            title: "The Competition Is the Workaround"
                        }
                    ],
                    component_key: "LandscapeForm",
                    reflection_prompt: "Looking at this landscape, what's your biggest opportunity? What's your biggest threat?",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission3_quest2_task3"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 3.2: Compliance
                {
                    id: "mission3_quest3_task2",
                    title: "Check Your Compliance",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Every business has compliance requirements. Based on your solution type and industry, we'll generate a checklist of what you need to check before you start.",
                    mission_id: "mission-3",
                    quest_id: "mission3_quest3",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/business-compliance-basics",
                            title: "Business Compliance Basics"
                        }
                    ],
                    component_key: "ComplianceForm",
                    reflection_prompt: "What's the biggest compliance requirement you need to address before launching?",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission3_quest3_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 4: Go or No-Go
        // ============================================
        {
            id: "mission3_quest4",
            mission_id: "mission-3",
            title: "Go or No-Go",
            content_path: "content/missions/mission3/quests/q4.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 4,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 30,
            content: null,
            context: ["user_profile", "user_projects"],
            badge_config: {
                key: "badge_quest_3_4",
                title: "Decisive Gatekeeper",
                description: "Completed Quest 4: Assessed project viability, faced worst-case scenarios, and passed the official Go/No-Go gate.",
                unlocked_identity: "Determined Founder",
                icon_key: "Flag"
            },
            notes: [
                {
                    title: "This is the hardest part",
                    type: "guide",
                    content: "Making a conscious decision—yes or no—is harder than building. But it's the most important.",
                    related_url: null
                },
                {
                    title: "Be honest about the risks",
                    type: "guide",
                    content: "If you can't name your biggest risk, you haven't thought it through.",
                    related_url: null
                },
                {
                    title: "Trust your gut",
                    type: "nudge",
                    content: "The data matters. But so does your instinct. Don't ignore it.",
                    related_url: null
                }
            ],
            success_message: "You've completed Mission 3: Getting Real. You've validated your problem, defined your MSP, understood the environment, and made a conscious decision. You're no longer dreaming—you're building with intention. Mission 4 awaits.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 4.1: Viability Check
                {
                    id: "mission3_quest4_task1",
                    title: "Check Your Viability",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Let's do a final viability check. Answer these questions honestly. This isn't about being optimistic—it's about being real.",
                    mission_id: "mission-3",
                    quest_id: "mission3_quest4",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/viability-assessment",
                            title: "Viability Assessment"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/how-to-know-if-your-idea-is-good",
                            title: "How to Know If Your Idea Is Good"
                        }
                    ],
                    component_key: "ViabilityCheckForm",
                    reflection_prompt: "If this didn't work out, what would you regret more—starting or not starting?",
                    observation_context: null,
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission3_quest3_task2"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 4.2: What If This Doesn't Work?
                {
                    id: "mission3_quest4_task2",
                    title: "Face the Worst Case",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Let's face the worst-case scenario. What if this doesn't work? What if you build it and no one buys? The goal isn't to scare yourself—it's to prepare yourself.",
                    mission_id: "mission-3",
                    quest_id: "mission3_quest4",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/facing-failure-builds-resilience",
                            title: "Facing Failure Builds Resilience"
                        }
                    ],
                    component_key: "WorstCaseForm",
                    reflection_prompt: "What's the worst that could happen? And what would you do next?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission3_quest4_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 4.3: Go / No-Go / Pivot
                {
                    id: "mission3_quest4_task3",
                    title: "Make the Call",
                    sequence: 3,
                    execution_type: "decision_gate",
                    estimated_minutes: 10,
                    briefing_text: "This is it. Based on everything you've learned—the problem, the customer interviews, the MSP, the landscape, the viability check—make a conscious decision.",
                    mission_id: "mission-3",
                    quest_id: "mission3_quest4",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/making-the-go-no-go-decision",
                            title: "Making the Go/No-Go Decision"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/the-decision-that-matters",
                            title: "The Decision That Matters"
                        }
                    ],
                    component_key: "ViabilityDecisionGateForm",
                    reflection_prompt: "What's the one thing that pushed you to this decision?",
                    observation_context: null,
                    grant_points: 15,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission3_quest4_task2"],
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

export default mission3;