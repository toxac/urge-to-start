// lib/playbook/mission5.ts
import { MissionSchema } from '@/types/playbook';

const mission5: MissionSchema = {
    id: "mission-5",
    title: "Build & Launch",
    content: null,
    content_path: "content/missions/mission5/mission.md",
    sequence: 5,
    video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
    big_question: "Can you actually build this?",
    estimated_time_in_days: 30,
    context: ["user_profile", "user_projects", "user_builds", "user_contacts"],
    success_message: "You've completed Mission 5: Build & Launch. You planned your build, executed your plan, gathered testers, validated your product, and launched. You're no longer a person with an idea—you're a founder with a live business. Welcome to the other side. 🎉",

    quests: [
        // ============================================
        // QUEST 1: Plan the Build
        // ============================================
        {
            id: "mission5_quest1",
            mission_id: "mission-5",
            title: "Plan the Build",
            content_path: "content/missions/mission5/quests/q1.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 1,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 60,
            content: null,
            context: ["user_profile", "user_projects"],
            on_success: {
                grant_points: 60,
                badge_key: "BUILD_PLANNER"
            },
            notes: [
                {
                    title: "Plan, but don't overplan",
                    type: "guide",
                    content: "A good plan gives you direction. A perfect plan keeps you from starting. Get it good enough and start building.",
                    related_url: null
                },
                {
                    title: "Start with the end in mind",
                    type: "nudge",
                    content: "What does 'done' look like? Work backwards from launch.",
                    related_url: null
                },
                {
                    title: "Resources are real",
                    type: "guide",
                    content: "Your time, money, and tools are limited. Plan accordingly.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 1: Plan the Build. You have a timeline, a resource plan, and a build checklist. Now it's time to execute.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 1.1: Set Your Timeline
                {
                    id: "mission5_quest1_task1",
                    title: "Plan Your Timeline",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Let's set your build timeline. We'll generate suggested dates based on your project type, and you can adjust them. Remember: this is your roadmap, not a prison.",
                    mission_id: "mission-5",
                    quest_id: "mission5_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/creating-a-build-timeline",
                            title: "Creating a Build Timeline"
                        }
                    ],
                    component_key: "BuildTimelineForm",
                    reflection_prompt: "What's the most ambitious but realistic date you could launch? What would make that possible?",
                    observation_context: null,
                    on_success: {
                        grant_points: 20,
                        badge_key: "TIMELINE_SETTER"
                    },
                    challenges: [
                        {
                            title: "The 30-Day Sprint",
                            description: "Can you build and launch in 30 days? If not, what's the smallest version you can build in that time?",
                            link: "/resources/challenges/the-30-day-sprint"
                        }
                    ],
                    ai_config: null,
                    dependencies: ["mission4_quest5_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 1.2: Evaluate Resources
                {
                    id: "mission5_quest1_task2",
                    title: "What Do You Need?",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Let's get real about what you need to build. What do you already have? What do you need to buy? What's your budget?",
                    mission_id: "mission-5",
                    quest_id: "mission5_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/build-resource-planning",
                            title: "Resource Planning for Your Build"
                        }
                    ],
                    component_key: "BuildResourcesForm",
                    reflection_prompt: "What's the one resource you're missing that would make this 10x easier? Can you get it?",
                    observation_context: null,
                    on_success: {
                        grant_points: 20,
                        badge_key: "RESOURCE_PLANNER"
                    },
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission5_quest1_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 1.3: Create Build Tasks
                {
                    id: "mission5_quest1_task3",
                    title: "Build Your Checklist",
                    sequence: 3,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "Now let's break down the build into actionable tasks. We'll auto-generate tasks from your features and milestones, and you can add your own.",
                    mission_id: "mission-5",
                    quest_id: "mission5_quest1",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/breaking-down-the-build",
                            title: "Breaking Down the Build"
                        }
                    ],
                    component_key: "BuildTasksForm",
                    reflection_prompt: "What's the first thing you'll build? Start there.",
                    observation_context: null,
                    on_success: {
                        grant_points: 20,
                        badge_key: "TASK_CREATOR"
                    },
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission5_quest1_task2"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 2: Build Dashboard
        // ============================================
        {
            id: "mission5_quest2",
            mission_id: "mission-5",
            title: "Build Dashboard",
            content_path: "content/missions/mission5/quests/q2.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 2,
            estimated_in_app_minutes: 5,
            estimated_off_app_minutes: 0,
            content: null,
            context: ["user_profile", "user_builds", "build_tasks"],
            on_success: {
                grant_points: 70,
                badge_key: "BUILDER"
            },
            notes: [
                {
                    title: "Build every day",
                    type: "guide",
                    content: "Even 15 minutes a day keeps the momentum going. Show up every day.",
                    related_url: null
                },
                {
                    title: "Stay focused",
                    type: "guide",
                    content: "Don't add features. Don't change direction. Build the MSP and nothing else.",
                    related_url: null
                },
                {
                    title: "Share your progress",
                    type: "nudge",
                    content: "Post build logs on social media. The more people watching, the more accountable you'll be.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 2: The Build. You've built your product, tracked your costs, and have something testers can test. The foundation is solid.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 2.1: Build Dashboard
                {
                    id: "mission5_quest2_task1",
                    title: "Build Dashboard",
                    sequence: 1,
                    execution_type: "dashboard-view",
                    estimated_minutes: 0,
                    briefing_text: "Welcome to your Build Dashboard. This is where you'll manage everything—tasks, progress, costs, and milestones. Use this until you have something testers can test. Come back to the program when your POC is ready.\n\nDashboard Features:\n• Overview: Project status, progress, days until launch\n• Task Board: Simple Kanban (To Do, In Progress, Done, Blocked)\n• Progress: Timeline with milestones, days ahead/behind\n• Costs: Budget vs actual, breakdown by category\n• POC Check: Feature completion, cost check, viability\n• Build Log: Share progress, export summary, take notes",
                    mission_id: "mission-5",
                    quest_id: "mission5_quest2",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [],
                    component_key: "BuildDashboard",
                    reflection_prompt: "What's the one thing you're most excited to build? What's the one thing you're most nervous about?",
                    observation_context: null,
                    on_success: {
                        grant_points: 15,
                        badge_key: "DASHBOARD_VIEWER"
                    },
                    challenges: [
                        {
                            title: "The Daily Build Challenge",
                            description: "Build something every day for 7 days. Even if it's just 15 minutes. Report your progress.",
                            link: "/resources/challenges/the-daily-build"
                        }
                    ],
                    ai_config: null,
                    dependencies: ["mission5_quest1_task3"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 3: Get Testers
        // ============================================
        {
            id: "mission5_quest3",
            mission_id: "mission-5",
            title: "Get Testers",
            content_path: "content/missions/mission5/quests/q3.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 3,
            estimated_in_app_minutes: 45,
            estimated_off_app_minutes: 60,
            content: null,
            context: ["user_profile", "user_contacts", "user_builds"],
            on_success: {
                grant_points: 60,
                badge_key: "TESTER_HUNTER"
            },
            notes: [
                {
                    title: "Testers are gold",
                    type: "guide",
                    content: "Real feedback from real users is the most valuable thing you can get. Don't waste it.",
                    related_url: null
                },
                {
                    title: "Listen to understand, not to defend",
                    type: "guide",
                    content: "When testers give feedback, don't defend your product. Just listen.",
                    related_url: null
                },
                {
                    title: "Start with your squad",
                    type: "nudge",
                    content: "Your cheer squad from Mission 1 is the perfect place to start. They already want you to succeed.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 3: Get Testers. You've recruited, onboarded, and collected feedback from testers. You have real data to work with.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 3.1: Recruit Testers
                {
                    id: "mission5_quest3_task1",
                    title: "Find Your Testers",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Who will test your product? You need real people who have the problem you're solving. Start with your squad, then expand.",
                    mission_id: "mission-5",
                    quest_id: "mission5_quest3",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/recruiting-testers",
                            title: "Recruiting Testers"
                        }
                    ],
                    component_key: "TesterRecruitmentForm",
                    reflection_prompt: "What's the best place to find people who have this problem? That's where your testers are.",
                    observation_context: null,
                    on_success: {
                        grant_points: 15,
                        badge_key: "TESTER_RECRUITER"
                    },
                    challenges: [
                        {
                            title: "The 5-Tester Challenge",
                            description: "Get 5 people to test your product. Not friends and family—real potential customers.",
                            link: "/resources/challenges/the-5-tester-challenge"
                        }
                    ],
                    ai_config: null,
                    dependencies: ["mission5_quest2_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 3.2: Onboard Testers
                {
                    id: "mission5_quest3_task2",
                    title: "Onboard Your Testers",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "How will you onboard testers? What instructions will you give them? How will they know what to do?",
                    mission_id: "mission-5",
                    quest_id: "mission5_quest3",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/onboarding-testers",
                            title: "Onboarding Testers"
                        }
                    ],
                    component_key: "TesterOnboardingForm",
                    reflection_prompt: "Put yourself in your tester's shoes. What would you need to know to give helpful feedback?",
                    observation_context: null,
                    on_success: {
                        grant_points: 20,
                        badge_key: "TESTER_ONBOARDER"
                    },
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission5_quest3_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 3.3: Collect Feedback
                {
                    id: "mission5_quest3_task3",
                    title: "Collect Feedback",
                    sequence: 3,
                    execution_type: "standard-form",
                    estimated_minutes: 20,
                    briefing_text: "What did your testers say? What did you learn? What surprised you? What are you going to change?",
                    mission_id: "mission-5",
                    quest_id: "mission5_quest3",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "insights",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/insights/feedback-is-a-gift",
                            title: "Feedback Is a Gift"
                        }
                    ],
                    component_key: "FeedbackCollectionForm",
                    reflection_prompt: "What was the most surprising piece of feedback? What will you do with it?",
                    observation_context: null,
                    on_success: {
                        grant_points: 25,
                        badge_key: "FEEDBACK_COLLECTOR"
                    },
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission5_quest3_task2"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 4: Validate & Tweak
        // ============================================
        {
            id: "mission5_quest4",
            mission_id: "mission-5",
            title: "Validate & Tweak",
            content_path: "content/missions/mission5/quests/q4.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 4,
            estimated_in_app_minutes: 30,
            estimated_off_app_minutes: 30,
            content: null,
            context: ["user_profile", "user_builds"],
            on_success: {
                grant_points: 50,
                badge_key: "VALIDATOR"
            },
            notes: [
                {
                    title: "Validation is not perfection",
                    type: "guide",
                    content: "You're not looking for perfection. You're looking for 'good enough to launch.'",
                    related_url: null
                },
                {
                    title: "Listen to the patterns",
                    type: "guide",
                    content: "If one tester says something, it's an opinion. If three testers say it, it's a pattern. Act on patterns.",
                    related_url: null
                },
                {
                    title: "Don't over-iterate",
                    type: "nudge",
                    content: "You can always improve after launch. Don't let perfect be the enemy of launched.",
                    related_url: null
                }
            ],
            success_message: "You've completed Quest 4: Validate & Tweak. You've validated your product with real users and made meaningful improvements. You're ready to launch.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 4.1: Validation Check
                {
                    id: "mission5_quest4_task1",
                    title: "Validation Check",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Based on tester feedback, is your product ready? Do people want this? Would they pay for it? Let's check.",
                    mission_id: "mission-5",
                    quest_id: "mission5_quest4",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/validation-check",
                            title: "Validation Check"
                        }
                    ],
                    component_key: "ValidationCheckForm",
                    reflection_prompt: "If you had to launch today, would you? Why or why not?",
                    observation_context: null,
                    on_success: {
                        grant_points: 25,
                        badge_key: "VALIDATION_CHECKER"
                    },
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission5_quest3_task3"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 4.2: Final Tweaks Plan
                {
                    id: "mission5_quest4_task2",
                    title: "Final Tweaks Plan",
                    sequence: 2,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "What changes are you making before launch? Be specific. What will you change, and how long will it take?",
                    mission_id: "mission-5",
                    quest_id: "mission5_quest4",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/final-tweaks",
                            title: "Final Tweaks"
                        }
                    ],
                    component_key: "FinalTweaksForm",
                    reflection_prompt: "What's the smallest change that would make the biggest difference?",
                    observation_context: null,
                    on_success: {
                        grant_points: 25,
                        badge_key: "FINAL_TWEAKER"
                    },
                    challenges: null,
                    ai_config: null,
                    dependencies: ["mission5_quest4_task1"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        },

        // ============================================
        // QUEST 5: Launch
        // ============================================
        {
            id: "mission5_quest5",
            mission_id: "mission-5",
            title: "Launch",
            content_path: "content/missions/mission5/quests/q5.md",
            video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
            sequence: 5,
            estimated_in_app_minutes: 30,
            estimated_off_app_minutes: 30,
            content: null,
            context: ["user_profile", "user_builds"],
            on_success: {
                grant_points: 60,
                badge_key: "LAUNCHER"
            },
            notes: [
                {
                    title: "Launch is not the end",
                    type: "guide",
                    content: "Launch is the beginning. Your real work starts when people start buying.",
                    related_url: null
                },
                {
                    title: "Perfect is the enemy of launched",
                    type: "guide",
                    content: "If you're waiting for perfect, you'll never launch. Good enough is good enough.",
                    related_url: null
                },
                {
                    title: "Celebrate this moment",
                    type: "nudge",
                    content: "You're about to do what most people never do: launch a real business. Be proud.",
                    related_url: null
                }
            ],
            success_message: "You've completed Mission 5: Build & Launch. You've launched your business. You're no longer a person with an idea—you're a founder with a live business. Welcome to the other side. 🎉",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            tasks: [
                // Task 5.1: Launch Checklist
                {
                    id: "mission5_quest5_task1",
                    title: "Launch Checklist",
                    sequence: 1,
                    execution_type: "standard-form",
                    estimated_minutes: 15,
                    briefing_text: "Before you launch, let's run through the checklist. Is everything ready?",
                    mission_id: "mission-5",
                    quest_id: "mission5_quest5",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/launch-checklist",
                            title: "Launch Checklist"
                        }
                    ],
                    component_key: "LaunchChecklistForm",
                    reflection_prompt: "If you had to launch right now, what would you be worried about?",
                    observation_context: null,
                    on_success: {
                        grant_points: 20,
                        badge_key: "LAUNCH_CHECKER"
                    },
                    challenges: [
                        {
                            title: "The First Sale Challenge",
                            description: "Launch and get your first real customer. Not a friend, not family—a real customer.",
                            link: "/resources/challenges/the-first-sale"
                        }
                    ],
                    ai_config: null,
                    dependencies: ["mission5_quest4_task2"],
                    target_count: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },

                // Task 5.2: Launch Decision
                {
                    id: "mission5_quest5_task2",
                    title: "Launch Decision",
                    sequence: 2,
                    execution_type: "decision_gate",
                    estimated_minutes: 15,
                    briefing_text: "It's time. Is your product ready to launch? Make the call.",
                    mission_id: "mission-5",
                    quest_id: "mission5_quest5",
                    execution_environment: null,
                    checkback_delay_days: null,
                    recurring: false,
                    interval: null,
                    resources: [
                        {
                            type: "guide",
                            isInternal: true,
                            isRequired: false,
                            url_link: "/resources/guides/launch-decision",
                            title: "Launch Decision"
                        }
                    ],
                    component_key: "LaunchDecisionForm",
                    reflection_prompt: "What's the scariest part of launching? What excites you the most?",
                    observation_context: null,
                    on_success: {
                        grant_points: 25,
                        badge_key: "LAUNCH_DECISION"
                    },
                    challenges: null,
                    ai_config: {
                        role: "Launch Advisor",
                        persona_name: "The Launch Coach",
                        persona_prompt: "You are a pragmatic launch coach who helps founders make the final decision to launch. You focus on readiness signals, not fear. You help founders recognize that 'good enough' is the right time to launch. You remind them that launch is the beginning, not the end.",
                        required_context: ["user_profile", "user_builds", "user_projects"]
                    },
                    dependencies: ["mission5_quest5_task1"],
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

export default mission5;