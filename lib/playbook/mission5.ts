// lib/playbook/mission5.ts
import { Mission } from "@/types/playbook";

export const mission5: Mission = {
  id: "mission5",
  title: "From Plan to Build",
  sequence: 5,
  video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
  briefing_text: "You've validated the problem, the solution, and the economics. Now it's time to transition from planning to building. But here's the secret: the best builders don't build in isolation. They build WITH an audience watching, waiting, and cheering them on. In this mission, you'll define exactly what you're building, set up your presence, gather early followers, and create your build plan. When you're done, you'll have a roadmap, a landing page, a waitlist, and people waiting for what you're building.",
  content: "",
  content_path: "content/mission5/mission.md",
  prerequisites: [
    {
      item: "A validated project with viable economics from Mission 4",
      promptRawText: "You should have completed Mission 4 and have a project that passed the economics check. If not, go back to Mission 4 and complete it first."
    },
    {
      item: "Your customer avatar from Mission 3",
      promptRawText: "You'll need your customer avatar to build a landing page that speaks to them. If you don't have one, go back to Mission 3, Quest 1, Task 1."
    },
    {
      item: "Willingness to be publicly building",
      promptRawText: "This mission requires you to put yourself out there. You'll build a landing page, create social accounts, and share your journey publicly. It's uncomfortable, but it's the fastest way to find customers."
    }
  ],
  quests: {
    quest1: {
      id: "mission5_quest1",
      slug: "what-are-you-building",
      title: "What Are You Building?",
      subtitle: "Define the exact scope of your build",
      description: "Before you build, you need to know EXACTLY what you're building. Not a vague idea. A specific, scoped, achievable version of your solution. In this quest, you'll define your build scope, create a requirements document, and set your first milestone.",
      sequence: 1,
      content: "",
      estimated_in_app_minutes: 75,
      estimated_off_app_minutes: 30,
      is_optional: false,
      mission_id: "mission5",
      content_path: "content/mission5/quests/what-are-you-building.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Architect",
        persona_prompt: "You help founders define their build scope and avoid scope creep. Challenge them to be specific. Push them to define what's IN and what's OUT. Help them set realistic first milestones.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 50,
          badge_key: "SCOPE_DEFINED"
        }
      },
      tasks: [
        {
          id: "m5_q1_t1_build_scope",
          title: "Define your build scope",
          sequence: 1,
          type: "form",
          component_key: "BuildScopeDefinition",
          grant_points: 20,
          estimated_minutes: 30,
          description: "Based on your MSP Canvas from Mission 3, what exactly are you building? Be specific. What features? What does it do? What does it NOT do? This is your build specification—the guardrails that keep you focused.",
          mission_id: "mission5",
          quest_id: "mission5_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Define Build Scope", 
                type: "blog", 
                path_or_url: "content/blog/define-build-scope.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "Saying No: The Secret to Scope Management", 
                type: "blog", 
                path_or_url: "content/blog/saying-no-scope.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q1_t2_requirements_doc",
          title: "Create your requirements document",
          sequence: 2,
          type: "form",
          component_key: "RequirementsDocument",
          grant_points: 20,
          estimated_minutes: 25,
          description: "Write it down. This is your blueprint. What does it need to do? Who's it for? What problem does it solve? How will someone use it? This isn't for investors—it's for YOU so you don't lose focus.",
          mission_id: "mission5",
          quest_id: "mission5_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Write a Requirements Document", 
                type: "blog", 
                path_or_url: "content/blog/requirements-document.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The 1-Page Spec: Keep It Simple", 
                type: "blog", 
                path_or_url: "content/blog/one-page-spec.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q1_t3_first_milestone",
          title: "Set your first milestone",
          sequence: 3,
          type: "form",
          component_key: "FirstMilestoneDefinition",
          grant_points: 10,
          estimated_minutes: 20,
          description: "What's the FIRST thing you'll deliver? The smallest, shippable version? What date? What's the definition of 'done'? Be specific. Your first milestone should be achievable in 1-2 weeks. This is your starting point.",
          mission_id: "mission5",
          quest_id: "mission5_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Set Achievable Milestones", 
                type: "blog", 
                path_or_url: "content/blog/achievable-milestones.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The 1-Week Sprint: Start Small", 
                type: "blog", 
                path_or_url: "content/blog/one-week-sprint.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest2: {
      id: "mission5_quest2",
      slug: "what-do-you-need-to-build",
      title: "What Do You Need to Build It?",
      subtitle: "Inventory everything needed to build",
      description: "Building something requires more than just an idea. What tools, supplies, skills, and resources do you need? In this quest, you'll audit everything you need, identify what you already have, and plan for what's missing.",
      sequence: 2,
      content: "",
      estimated_in_app_minutes: 60,
      estimated_off_app_minutes: 30,
      is_optional: false,
      mission_id: "mission5",
      content_path: "content/mission5/quests/what-do-you-need-to-build.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Quartermaster",
        persona_prompt: "You help founders inventory what they need to build. Help them identify tools, supplies, skills, and resources. Push them to be honest about what they have and what they need. Help them think through bottlenecks before they start.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 50,
          badge_key: "BUILD_READY"
        }
      },
      tasks: [
        {
          id: "m5_q2_t1_supplies_audit",
          title: "Audit your supplies and tools",
          sequence: 1,
          type: "form",
          component_key: "SuppliesAudit",
          grant_points: 15,
          estimated_minutes: 20,
          description: "What do you need to build this? Software? Hardware? Materials? Tools? List everything. What do you already have? What do you need to get? Be thorough—missing something small can derail your timeline.",
          mission_id: "mission5",
          quest_id: "mission5_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The Builders Inventory Checklist", 
                type: "blog", 
                path_or_url: "content/blog/builders-inventory.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q2_t2_skills_audit",
          title: "Audit your skills",
          sequence: 2,
          type: "form",
          component_key: "SkillsAudit",
          grant_points: 15,
          estimated_minutes: 15,
          description: "What skills do you have? What skills do you need? Do you need to learn something? Do you need to hire someone? Be honest about what you can and cannot do. There's no shame in not knowing something—the shame is in pretending.",
          mission_id: "mission5",
          quest_id: "mission5_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Identify Skill Gaps", 
                type: "blog", 
                path_or_url: "content/blog/identify-skill-gaps.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Learn or Hire? How to Decide", 
                type: "blog", 
                path_or_url: "content/blog/learn-or-hire.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q2_t3_bottleneck_check",
          title: "Identify your biggest bottleneck",
          sequence: 3,
          type: "form",
          component_key: "BottleneckCheck",
          grant_points: 10,
          estimated_minutes: 15,
          description: "What's most likely to slow you down? Skills? Time? Money? Tools? Motivating yourself? Identify it NOW so you can plan for it. A bottleneck you see coming is a bottleneck you can manage.",
          mission_id: "mission5",
          quest_id: "mission5_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Identify Bottlenecks", 
                type: "blog", 
                path_or_url: "content/blog/identify-bottlenecks.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "The 80/20 Bottleneck Rule", 
                type: "blog", 
                path_or_url: "content/blog/80-20-bottleneck.md", 
                subtitle: "3 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q2_t4_build_readiness",
          title: "Check your build readiness",
          sequence: 4,
          type: "form",
          component_key: "BuildReadinessChecklist",
          grant_points: 10,
          estimated_minutes: 10,
          description: "Check everything: Supplies, skills, tools, plan, timeline, budget. Are you ready to start building? If not, what's missing? What's the ONE thing you need to do before you start?",
          mission_id: "mission5",
          quest_id: "mission5_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The Build Readiness Checklist", 
                type: "blog", 
                path_or_url: "content/blog/build-readiness.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest3: {
      id: "mission5_quest3",
      slug: "where-will-people-find-you",
      title: "Where Will People Find You?",
      subtitle: "Set up your presence before you build",
      description: "You're building something for people. But if they can't find you, they can't buy from you. In this quest, you'll set up a landing page, create your social presence, and publish your first content. The goal: have a place where people can find you and follow your journey.",
      sequence: 3,
      content: "",
      estimated_in_app_minutes: 30,
      estimated_off_app_minutes: 120,
      is_optional: false,
      mission_id: "mission5",
      content_path: "content/mission5/quests/where-will-people-find-you.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Broadcaster",
        persona_prompt: "You help founders set up their presence. Encourage them to keep it simple—one landing page, one social channel, one content piece. Help them think about what their customer needs to see to get excited.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 50,
          badge_key: "PRESENCE_ESTABLISHED"
        }
      },
      tasks: [
        {
          id: "m5_q3_t1_landing_page",
          title: "Build your landing page",
          sequence: 1,
          type: "action",
          component_key: "LandingPageBuilder",
          grant_points: 20,
          estimated_minutes: 45,
          description: "Build a simple landing page. One page. One headline. One call-to-action: 'Join the waitlist.' That's it. Use whatever tool works for you—Carrd, Webflow, Simple HTML, even a Notion page. The goal is to have a place where people can find you and sign up for updates.",
          mission_id: "mission5",
          quest_id: "mission5_quest3",
          execution_environment: "off_app",
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Build a Simple Landing Page", 
                type: "blog", 
                path_or_url: "content/blog/simple-landing-page.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "10 Landing Page Examples That Convert", 
                type: "blog", 
                path_or_url: "content/blog/landing-page-examples.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The One Question Your Landing Page Must Answer", 
                type: "blog", 
                path_or_url: "content/blog/landing-page-one-question.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q3_t2_landing_page_check",
          title: "Check your landing page against sales principles",
          sequence: 2,
          type: "form",
          component_key: "LandingPageChecker",
          grant_points: 10,
          estimated_minutes: 15,
          description: "Now that you've built your landing page, let's check it against sales first principles. Does it clearly state who it's for? What problem it solves? What they should do next? This is your first sales tool—make it work.",
          mission_id: "mission5",
          quest_id: "mission5_quest3",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Sales First Principles for Landing Pages", 
                type: "blog", 
                path_or_url: "content/blog/landing-page-sales-principles.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q3_t3_social_presence",
          title: "Set up your social presence",
          sequence: 3,
          type: "action",
          component_key: "SocialPresenceSetup",
          grant_points: 10,
          estimated_minutes: 30,
          description: "Pick ONE primary channel where you'll share updates. LinkedIn, Twitter/X, Instagram, YouTube, Email Newsletter—wherever your customers are. Create the account. Put up a bio, a profile pic, and a link to your landing page. Nothing fancy—just be present.",
          mission_id: "mission5",
          quest_id: "mission5_quest3",
          execution_environment: "off_app",
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Choose Your Primary Channel", 
                type: "blog", 
                path_or_url: "content/blog/choose-primary-channel.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The Best Bio Template for Founders", 
                type: "blog", 
                path_or_url: "content/blog/founder-bio-template.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q3_t4_first_content",
          title: "Publish your first content piece",
          sequence: 4,
          type: "action",
          component_key: "FirstContentPiece",
          grant_points: 10,
          estimated_minutes: 30,
          description: "Post something. Anything. A short video. A tweet thread. A LinkedIn post. A blog post. Introduce yourself. Tell people what you're building. Share your mission, your why, your vision. This is your first public step.",
          mission_id: "mission5",
          quest_id: "mission5_quest3",
          execution_environment: "off_app",
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The 3 Things to Say in Your First Post", 
                type: "blog", 
                path_or_url: "content/blog/first-post.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "How to Introduce Your Project to the World", 
                type: "blog", 
                path_or_url: "content/blog/introduce-project.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest4: {
      id: "mission5_quest4",
      slug: "whos-watching",
      title: "Who's Watching?",
      subtitle: "Build an audience before you build",
      description: "The best builders have people waiting for what they build. In this quest, you'll build a waitlist, share your journey with your network, get early followers, and post in the Urge community. By the end, you'll have people who are genuinely interested in what you're building.",
      sequence: 4,
      content: "",
      estimated_in_app_minutes: 30,
      estimated_off_app_minutes: 120,
      is_optional: false,
      mission_id: "mission5",
      content_path: "content/mission5/quests/whos-watching.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Connector",
        persona_prompt: "You help founders build an audience. Encourage them to reach out to their personal network first—that's where their early believers are. Help them craft messages that feel natural, not salesy. Remind them: people want to support people they know.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 75,
          badge_key: "AUDIENCE_BUILDER"
        }
      },
      tasks: [
        {
          id: "m5_q4_t1_waitlist_setup",
          title: "Set up your waitlist",
          sequence: 1,
          type: "action",
          component_key: "WaitlistSetup",
          grant_points: 15,
          estimated_minutes: 20,
          description: "Set up a simple waitlist form. Ask for name and email. That's it. Add it to your landing page. The goal is to capture interest from people who want to know when you're ready.",
          mission_id: "mission5",
          quest_id: "mission5_quest4",
          execution_environment: "off_app",
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Build a Waitlist", 
                type: "blog", 
                path_or_url: "content/blog/build-waitlist.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Waitlist Tools That Work", 
                type: "blog", 
                path_or_url: "content/blog/waitlist-tools.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q4_t2_personal_network_outreach",
          title: "Reach out to your personal network",
          sequence: 2,
          type: "action",
          component_key: "PersonalNetworkOutreach",
          grant_points: 25,
          estimated_minutes: 45,
          description: "This is MANDATORY. Reach out to 10-20 people in your personal network—friends, family, former colleagues, classmates. Tell them what you're building and ask them to follow your journey. No selling. Just sharing. These are your first believers.",
          mission_id: "mission5",
          quest_id: "mission5_quest4",
          execution_environment: "off_app",
          checkback_delay_days: 2,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Tell Your Network About Your Project", 
                type: "blog", 
                path_or_url: "content/blog/tell-network.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The 3-Part Message Template", 
                type: "blog", 
                path_or_url: "content/blog/message-template.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Personal Network Outreach Template", 
                type: "download", 
                path_or_url: "/resources/network-outreach-template.pdf" 
              }
            ],
            reflection_prompt: "How did people respond? Who got excited? Who wanted to help? What did you learn from sharing your project with people who know you?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q4_t3_early_followers",
          title: "Get your first 10 followers",
          sequence: 3,
          type: "action",
          component_key: "EarlyFollowerTracker",
          grant_points: 15,
          estimated_minutes: 30,
          description: "Get 10 people to follow your journey. They can be from your personal network, your social channels, or people you've connected with. These will be your early testers, cheerleaders, and first customers. Track who they are.",
          mission_id: "mission5",
          quest_id: "mission5_quest4",
          execution_environment: "off_app",
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Get Your First Followers", 
                type: "blog", 
                path_or_url: "content/blog/first-followers.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The 10 People Who Matter Most", 
                type: "blog", 
                path_or_url: "content/blog/10-people.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q4_t4_community_update",
          title: "Share an update in the Urge community",
          sequence: 4,
          type: "community",
          component_key: "CommunityUpdate",
          grant_points: 10,
          estimated_minutes: 15,
          description: "OPTIONAL: Post an update in the Urge community. Tell everyone what you're building, where you are in the process, and what you're excited about. This is your community announcement—a chance to connect with other founders.",
          mission_id: "mission5",
          quest_id: "mission5_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Write a Community Update", 
                type: "blog", 
                path_or_url: "content/blog/community-update.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest5: {
      id: "mission5_quest5",
      slug: "whats-the-plan",
      title: "What's the Plan?",
      subtitle: "Create your build plan",
      description: "You've defined what you're building, gathered what you need, set up your presence, and built an audience. Now it's time to plan the build itself. In this quest, you'll create a timeline, a weekly sprint plan, set up accountability, and write your Build Manifesto.",
      sequence: 5,
      content: "",
      estimated_in_app_minutes: 60,
      estimated_off_app_minutes: 15,
      is_optional: false,
      mission_id: "mission5",
      content_path: "content/mission5/quests/whats-the-plan.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Planner",
        persona_prompt: "You help founders create realistic build plans. Push them to be specific and achievable. Challenge them on their timeline. Help them think through what could go wrong. Encourage them to commit to the plan.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 75,
          badge_key: "PLAN_READY"
        }
      },
      tasks: [
        {
          id: "m5_q5_t1_build_timeline",
          title: "Create your build timeline",
          sequence: 1,
          type: "form",
          component_key: "BuildTimeline",
          grant_points: 15,
          estimated_minutes: 15,
          description: "Map out your build: Week 1, Week 2, Week 3, etc. What will you deliver each week? What are the milestones? When will you be ready to launch? Be realistic. Add 50% buffer to whatever you think it'll take.",
          mission_id: "mission5",
          quest_id: "mission5_quest5",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Create a Build Timeline", 
                type: "blog", 
                path_or_url: "content/blog/build-timeline.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The 50% Buffer Rule", 
                type: "blog", 
                path_or_url: "content/blog/50-percent-buffer.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q5_t2_weekly_sprint",
          title: "Plan your first weekly sprint",
          sequence: 2,
          type: "form",
          component_key: "WeeklySprintPlan",
          grant_points: 15,
          estimated_minutes: 15,
          description: "What will you do THIS WEEK? Break it down. Day by day. This is your execution plan—not a dream, but a schedule. What's the first thing you'll do tomorrow?",
          mission_id: "mission5",
          quest_id: "mission5_quest5",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Plan a Weekly Sprint", 
                type: "blog", 
                path_or_url: "content/blog/weekly-sprint.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The 4-Hour Work Week Approach to Building", 
                type: "blog", 
                path_or_url: "content/blog/4-hour-build.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q5_t3_accountability",
          title: "Set up your accountability",
          sequence: 3,
          type: "form",
          component_key: "AccountabilitySetup",
          grant_points: 10,
          estimated_minutes: 10,
          description: "Who's going to keep you accountable? A friend? A co-founder? Your cheer squad? The Urge community? Write it down. You're more likely to finish if someone's watching. Pick at least one person who'll check in on you.",
          mission_id: "mission5",
          quest_id: "mission5_quest5",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The Accountability System That Works", 
                type: "blog", 
                path_or_url: "content/blog/accountability-system.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "How to Be Accountable to Yourself", 
                type: "blog", 
                path_or_url: "content/blog/self-accountability.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m5_q5_t4_build_manifesto",
          title: "Write your Build Manifesto",
          sequence: 4,
          type: "form",
          component_key: "BuildManifesto",
          grant_points: 10,
          estimated_minutes: 15,
          description: "Put it all together: What are you building? Why? For who? When will it be ready? What's your plan? This is your Build Manifesto—your commitment to yourself. Keep it somewhere you can see it every day.",
          mission_id: "mission5",
          quest_id: "mission5_quest5",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Write a Build Manifesto", 
                type: "blog", 
                path_or_url: "content/blog/build-manifesto.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Examples of Founder Manifestos", 
                type: "blog", 
                path_or_url: "content/blog/founder-manifestos.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    }
  }
};