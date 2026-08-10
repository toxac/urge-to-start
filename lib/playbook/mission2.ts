// lib/playbook/mission2.ts
import { MissionSchema } from '@/types/playbook';

const mission2: MissionSchema = {
    id: "mission-2",
    title: "Discovery",
    content: null,
    content_path: "content/missions/mission2/mission.md",
    sequence: 2,
    video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
    big_question: "What problem should I solve?",
    estimated_time_in_days: 21,
    context: ["user_profile", "mission1_data"],
    success_message: "You've completed Mission 2: Discovery. You've mined your own frustrations, observed the people around you, researched the wider world, and picked the best opportunity to pursue. You're no longer searching—you have a direction. Mission 3 awaits.",
    badge_config: {
        key: "badge_mission_2",
        title: "Opportunity Architect",
        description: "Completed Mission 2: Discovery. Uncovered market pains, evaluated ideas objectively, and committed to a high-potential direction.",
        unlocked_identity: "Focused Opportunity Hunter",
        icon_key: "Search"
    },

    quests: [
        // ============================================
        // QUEST 1: Mine Yourself
        // ============================================
        {
            id: "mission2_quest1",
            mission_id: "mission-2",
            title: "Mine Yourself",
            content_path: "content/missions/mission2/quests/q1.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 1,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 90,
            content: null,
            context: ["user_profile"],
            badge_config: {
                key: "badge_quest_2_1",
                title: "Self Miner",
                description: "Completed Quest 1: Mined your daily frustrations and skills to uncover high-leverage business opportunities.",
                unlocked_identity: "Self-Aware Problem Finder",
                icon_key: "Key"
            },
            notes: [
                {
                    title: "Start with yourself",
                    type: "guide",
                    content: "The best problems to solve are the ones you understand deeply. Your frustrations are a goldmine.",
                    related_url: null
                },
                {
                    title: "Don't overthink",
                    type: "nudge",
                    content: "List everything that annoys you—big or small. We'll filter later.",
                    related_url: null
                },
                {
                    title: "This is not about solutions",
                    type: "warning",
                    content: "Don't try to solve anything yet. Just observe and document the problems.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 1: Mine Yourself. You've identified problems from your own life and skills. You're building a foundation for your business.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 1.1: Observe What Frustrates You
                {
                    id: "mission2_quest1_task1",
                    title: "Spot Your Frustrations",
                    sequence: 1,
                    execution_type: "observation-form",
                    estimated_minutes: 20,
                    briefing_text: "Your own frustrations are the most accessible problems to solve. What annoys you? What wastes your time? What feels broken? List them all—big and small.",
                    mission_id: "mission-2",
                    quest_id: "mission2_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/your-pain-is-a-goldmine",
                            title: "Your Pain Is a Goldmine"
                        },
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-spot-frustrations",
                            title: "How to Spot Frustrations in Your Daily Life"
                        }
                    ],
                    component_key: "ObservationForm",
                    reflection_prompt: "Look at your frustrations. Which one feels the most urgent? Which one do you wish someone would solve?",
                    observation_context: {
                        category: "personal_problems",
                        reference: "user_opportunities"
                    },
                    grant_points: 20,
                    challenges: [
                        {
                            title: "The Frustration Log",
                            description: "For one week, write down every frustration you encounter. Big or small. At work, at home, in public. Just observe.",
                            link: "/resources/challenges/frustration-log"
                        }
                    ],
                    ai_config: null,
                    dependencies: [],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 1.2: Your Problems as Opportunities
                {
                    id: "mission2_quest1_task2",
                    title: "Turn Frustrations Into Opportunities",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 25,
                    briefing_text: "Now let's reframe your frustrations as business opportunities. A frustration is just an unsolved problem. An unsolved problem is an opportunity.",
                    mission_id: "mission-2",
                    quest_id: "mission2_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-turn-problems-into-opportunities",
                            title: "How to Turn Problems Into Opportunities"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/why-frustrations-make-the-best-businesses",
                            title: "Why Frustrations Make the Best Businesses"
                        }
                    ],
                    component_key: "OpportunityForm",
                    reflection_prompt: "Which of your frustrations could someone pay to have solved? Why?",
                    observation_context: {
                        category: "personal_problems",
                        reference: "user_opportunities"
                    },
                    grant_points: 20,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission2_quest1_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 1.3: Skill Observation
                {
                    id: "mission2_quest1_task3",
                    title: "Audit Your Skills",
                    sequence: 3,
                    execution_type: "observation-form",
                    estimated_minutes: 20,
                    briefing_text: "Your skills are assets. What are you good at? What do people ask you for help with? What comes naturally to you? These are potential business opportunities.",
                    mission_id: "mission-2",
                    quest_id: "mission2_quest1",
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
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-identify-your-valuable-skills",
                            title: "How to Identify Your Most Valuable Skills"
                        }
                    ],
                    component_key: "ObservationForm",
                    reflection_prompt: "Which of your skills could help someone solve a problem? Who needs this skill?",
                    observation_context: {
                        category: "skills",
                        reference: "user_opportunities"
                    },
                    grant_points: 20,
                    challenges: null,
                    ai_config: null,
                    dependencies: [],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 1.4: Add Skills as Opportunities
                {
                    id: "mission2_quest1_task4",
                    title: "Skills as a Business",
                    sequence: 4,
                    execution_type: "standard-form",
                    estimated_minutes: 25,
                    briefing_text: "Your skills can be a business. What's a problem you could solve using your skills? Who would pay for that?",
                    mission_id: "mission-2",
                    quest_id: "mission2_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-turn-skills-into-a-business",
                            title: "How to Turn Your Skills Into a Business"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/what-skills-people-pay-for",
                            title: "What Skills Are People Willing to Pay For"
                        }
                    ],
                    component_key: "OpportunityForm",
                    reflection_prompt: "How could you package your skills as a service or product? What would be the simplest version?",
                    observation_context: {
                        category: "skills",
                        reference: "user_opportunities"
                    },
                    grant_points: 20,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission2_quest1_task3"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 2: Observe People Around You
        // ============================================
        {
            id: "mission2_quest2",
            mission_id: "mission-2",
            title: "People Watching",
            content_path: "content/missions/mission2/quests/q2.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 2,
            estimated_in_app_minutes: 30,
            estimated_off_app_minutes: 120,
            content: null,
            context: ["user_profile"],
            badge_config: {
                key: "badge_quest_2_2",
                title: "Keen Observer",
                description: "Completed Quest 2: Observed real-world complaints and identified target audience pain points.",
                unlocked_identity: "Empathetic Investigator",
                icon_key: "Eye"
            },
            notes: [
                {
                    title: "You are a detective",
                    type: "guide",
                    content: "Look at the people around you. What problems do they have? What do they complain about?",
                    related_url: null
                },
                {
                    title: "Listen more than you talk",
                    type: "nudge",
                    content: "The best insights come from listening—not to answers, but to frustrations.",
                    related_url: null
                },
                {
                    title: "Don't start with solutions",
                    type: "warning",
                    content: "Just observe. Don't try to fix anything. You're gathering data.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 2: People Watching. You've observed problems in your immediate circle. These people are your first potential customers.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 2.1: You Are a Detective
                {
                    id: "mission2_quest2_task1",
                    title: "Be a Detective",
                    sequence: 1,
                    execution_type: "observation-form",
                    estimated_minutes: 25,
                    briefing_text: "Put on your detective hat. Look at the people around you—friends, family, colleagues, neighbors. What problems do they have? What frustrates them? What do they complain about?",
                    mission_id: "mission-2",
                    quest_id: "mission2_quest2",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-observe-problems-in-others",
                            title: "How to Observe Problems in Others"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/people-are-the-best-problem-sources",
                            title: "People Are the Best Problem Sources"
                        }
                    ],
                    component_key: "ObservationForm",
                    reflection_prompt: "Look at your observations. Which problem feels the most urgent? Which one do you think you could help solve?",
                    observation_context: {
                        category: "zone_of_influence",
                        reference: "user_opportunities"
                    },
                    grant_points: 25,
                    challenges: [
                        {
                            title: "The 5 Conversations Challenge",
                            description: "Have 5 conversations this week where you ask people about their biggest frustrations—and just listen.",
                            link: "/resources/challenges/5-conversations"
                        }
                    ],
                    ai_config: null,
                    dependencies: [],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 2.2: People's Problems as Opportunities
                {
                    id: "mission2_quest2_task2",
                    title: "Spot the Opportunity",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Now turn your observations into opportunities. For each problem you observed, what could be a solution? Who would pay for it?",
                    mission_id: "mission-2",
                    quest_id: "mission2_quest2",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/observing-problems-around-you",
                            title: "Observing Problems Around You"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/opportunities-are-all-around-you",
                            title: "Opportunities Are All Around You"
                        }
                    ],
                    component_key: "OpportunityForm",
                    reflection_prompt: "Which of these problems could be the foundation of a business? Why?",
                    observation_context: {
                        category: "zone_of_influence",
                        reference: "user_opportunities"
                    },
                    grant_points: 25,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission2_quest2_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 3: Broader Search
        // ============================================
        {
            id: "mission2_quest3",
            mission_id: "mission-2",
            title: "The Wider World",
            content_path: "content/missions/mission2/quests/q3.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 3,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 180,
            content: null,
            context: ["user_profile"],
            badge_config: {
                key: "badge_quest_2_3",
                title: "Market Explorer",
                description: "Completed Quest 3: Scanned online communities, macro trends, and marketplaces to spot hidden demand gaps.",
                unlocked_identity: "Broad-Spectrum Researcher",
                icon_key: "Globe"
            },
            notes: [
                {
                    title: "Think bigger",
                    type: "guide",
                    content: "Your immediate circle is just the beginning. The world is full of problems waiting to be solved.",
                    related_url: null
                },
                {
                    title: "Explore new spaces",
                    type: "nudge",
                    content: "Visit forums, read comments, check trends. Problems are everywhere.",
                    related_url: null
                },
                {
                    title: "Don't get overwhelmed",
                    type: "warning",
                    content: "You're exploring. Not committing. Gather as many problems as you can—you'll filter later.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 3: The Wider World. You've discovered problems beyond your immediate circle. Your opportunity set is now diverse.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 3.1: Discover Problems Through Online Communities
                {
                    id: "mission2_quest3_task1",
                    title: "Search the Communities",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 30,
                    briefing_text: "Online communities are goldmines. Reddit, Facebook Groups, LinkedIn communities, Quora—people are actively discussing their problems. Go find them.",
                    mission_id: "mission-2",
                    quest_id: "mission2_quest3",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-find-problems-in-online-communities",
                            title: "How to Find Problems in Online Communities"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/problem-spotting-techniques",
                            title: "Problem-Spotting Techniques for Founders"
                        }
                    ],
                    component_key: "CommunityProblemForm",
                    reflection_prompt: "What's the most common problem you're seeing in these communities? Why do you think it's common?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: [
                        {
                            title: "The Deep Dive",
                            description: "Spend 2 hours diving deep into a community or industry you know nothing about. What problems do they discuss?",
                            link: "/resources/challenges/the-deep-dive"
                        }
                    ],
                    ai_config: null,
                    dependencies: [],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 3.2: Discover Problems Through Trends
                {
                    id: "mission2_quest3_task2",
                    title: "Ride the Trends",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 30,
                    briefing_text: "Trends are signals. What's changing? What's new? What's growing? These changes create new problems—and new opportunities.",
                    mission_id: "mission-2",
                    quest_id: "mission2_quest3",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-spot-problems-in-trends",
                            title: "How to Spot Problems in Trends"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/trends-are-trouble",
                            title: "Trends Are Trouble (And That's Good)"
                        }
                    ],
                    component_key: "TrendProblemForm",
                    reflection_prompt: "What trend is creating new problems? Who is being affected by these changes?",
                    observation_context: null,
                    grant_points: 20,
                    challenges: null,
                    ai_config: null,
                    dependencies: [],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 3.3: Discover Problems Through Marketplaces
                {
                    id: "mission2_quest3_task3",
                    title: "The Marketplace Scanner",
                    sequence: 3,
                    execution_type: "standard-form",
                    estimated_minutes: 30,
                    briefing_text: "Marketplaces tell you what people are already paying for. They reveal gaps, complaints, and underserved needs. Go scan Etsy, Fiverr, Upwork, Amazon—what problems are being solved? What's missing?",
                    mission_id: "mission-2",
                    quest_id: "mission2_quest3",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-spot-opportunities-in-marketplaces",
                            title: "How to Spot Opportunities in Marketplaces"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/marketplace-love-notes",
                            title: "Marketplace Love Notes and Breakup Letters"
                        }
                    ],
                    component_key: "MarketplaceProblemForm",
                    reflection_prompt: "What's a problem that people are trying to solve but no one is solving well? Where's the gap?",
                    observation_context: null,
                    grant_points: 20,
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
        // QUEST 4: Pick the Best Opportunity
        // ============================================
        {
            id: "mission2_quest4",
            mission_id: "mission-2",
            title: "The Decision",
            content_path: "content/missions/mission2/quests/q4.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 4,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 30,
            content: null,
            context: ["user_profile", "user_opportunities"],
            badge_config: {
                key: "badge_quest_2_4",
                title: "Decisive Founder",
                description: "Completed Quest 4: Scored opportunities objectively, picked your target problem, and passed the decision gate.",
                unlocked_identity: "Committed Business Builder",
                icon_key: "CheckCircle"
            },
            notes: [
                {
                    title: "This is the hard part",
                    type: "guide",
                    content: "You've gathered opportunities. Now you must choose. Don't fall in love—evaluate objectively.",
                    related_url: null
                },
                {
                    title: "Perfect is the enemy of started",
                    type: "guide",
                    content: "No opportunity is perfect. Choose the one that's good enough to start.",
                    related_url: null
                },
                {
                    title: "Trust your gut",
                    type: "nudge",
                    content: "The data matters. But so does your instinct. Don't ignore it.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 4: The Decision. You've evaluated your opportunities, picked the best one, and committed to a direction. You're no longer searching—you're building. Mission 3 awaits.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 4.1: Scoring and Assessment
                {
                    id: "mission2_quest4_task1",
                    title: "Score Your Opportunities",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 30,
                    briefing_text: "Now it's time to evaluate your opportunities. For each one, score it against 5 criteria. This isn't about finding the 'perfect' opportunity—it's about finding the one that's best for you, right now.\n\nScoring Criteria (1-5):\n• Passion: How excited are you about this problem?\n• Urgency: How badly do people need this solved?\n• Workaround Spend: How much are people already spending to solve this?\n• Unfair Advantage: Do you have a unique edge?\n• MSP Feasibility: Can you build a Minimum Sellable Product quickly?",
                    mission_id: "mission-2",
                    quest_id: "mission2_quest4",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-score-business-opportunities",
                            title: "How to Score Business Opportunities"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/the-ideal-opportunity-profile",
                            title: "The Ideal Opportunity Profile"
                        }
                    ],
                    component_key: "OpportunityScoringForm",
                    reflection_prompt: "Look at your highest-scoring opportunity. Why did it score so high? What makes it the most promising?",
                    observation_context: null,
                    grant_points: 30,
                    challenges: null,
                    ai_config: null,
                    dependencies: [],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 4.2: Rank and Pick One
                {
                    id: "mission2_quest4_task2",
                    title: "Pick Your Opportunity",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "You've scored all your opportunities. Now it's time to pick one. Don't overthink—choose the one that feels right based on the scores and your gut.",
                    mission_id: "mission-2",
                    quest_id: "mission2_quest4",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/how-to-commit-to-an-idea",
                            title: "How to Commit to an Idea"
                        },
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/analysis-paralysis-kills-ideas",
                            title: "Analysis Paralysis Kills Ideas"
                        }
                    ],
                    component_key: "OpportunityPickerForm",
                    reflection_prompt: "Why did you pick this opportunity? What made it stand out from the others?",
                    observation_context: null,
                    grant_points: 15,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission2_quest4_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 4.3: Decision Gate
                {
                    id: "mission2_quest4_task3",
                    title: "Make It Official",
                    sequence: 3,
                    execution_type: "decision_gate",
                    estimated_minutes: 10,
                    briefing_text: "This is it. You're either committing to this opportunity or going back to discover more. There's no wrong choice—but there is a choice.",
                    mission_id: "mission-2",
                    quest_id: "mission2_quest4",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/commitment-is-the-first-step",
                            title: "Commitment Is the First Step"
                        }
                    ],
                    component_key: "DecisionGateForm",
                    reflection_prompt: "What's your biggest hesitation about this opportunity? Address it now.",
                    observation_context: null,
                    grant_points: 15,
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission2_quest4_task2"],
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

export default mission2;