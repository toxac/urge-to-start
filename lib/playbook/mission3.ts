// lib/playbook/mission3.ts
import { Mission } from "@/types/playbook";

export const mission3: Mission = {
  id: "mission3",
  title: "Project's Viability",
  sequence: 3,
  video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
  briefing_text: "You've picked an opportunity. Now let's make sure it's actually viable before you invest serious time and money. We'll talk to real customers, understand the competition, figure out what permissions you need, design your Minimum Sellable Product, and do a final reality check. By the end of this mission, you'll know if this is worth pursuing—or if you should go back to the drawing board.",
  content: "",
  content_path: "content/mission3/mission.md",
  prerequisites: [
    {
      item: "A project selected from Mission 2",
      promptRawText: "You should have a project saved from Mission 2. If you don't, go back to Mission 2, Quest 4, Task 3 and create your project first."
    },
    {
      item: "Willingness to talk to strangers",
      promptRawText: "You'll need to talk to people you don't know. This is the hardest part of validation. Remember: you're doing research, not selling. People love talking about their problems."
    },
    {
      item: "Openness to being wrong",
      promptRawText: "The goal here is to find out if your idea is viable. That means you might find out it's NOT viable. That's a success—you saved yourself months of wasted effort. Be open to whatever you discover."
    }
  ],
  quests: {
    quest1: {
      id: "mission3_quest1",
      slug: "who-are-your-customers",
      title: "Who Are Your Customers?",
      subtitle: "Understand the people who have this problem deeply",
      description: "Before you build anything, you need to understand who you're building for. Not 'everyone.' Real people with real problems. In this quest, you'll create a customer avatar, find real people to talk to, have conversations, and synthesize what you learn.",
      sequence: 1,
      content: "",
      estimated_in_app_minutes: 90,
      estimated_off_app_minutes: 240,
      is_optional: false,
      mission_id: "mission3",
      content_path: "content/mission3/quests/who-are-your-customers.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Anthropologist",
        persona_prompt: "You are a customer research expert. Help the user understand their customers deeply. Encourage them to be specific. Push them to talk to real people. Help them see patterns in what they learn.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 75,
          badge_key: "CUSTOMER_OBSERVER"
        }
      },
      tasks: [
        {
          id: "m3_q1_t1_customer_avatar",
          title: "Create your customer avatar",
          sequence: 1,
          type: "form",
          component_key: "CustomerAvatarForm",
          grant_points: 20,
          estimated_minutes: 20,
          description: "Who exactly has this problem? Be specific. Age? Job? What do they do on weekends? What frustrates them about this problem? What do they currently do to cope? The more specific you are, the easier it'll be to find and talk to them.",
          mission_id: "mission3",
          quest_id: "mission3_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Create a Customer Avatar", 
                type: "blog", 
                path_or_url: "content/blog/customer-avatar-guide.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Why 'Everyone' Is Not Your Customer", 
                type: "blog", 
                path_or_url: "content/blog/everyone-is-not-your-customer.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m3_q1_t2_find_five_people",
          title: "Find 5 people to talk to",
          sequence: 2,
          type: "action",
          component_key: "OutreachPlanner",
          grant_points: 20,
          estimated_minutes: 45,
          description: "Now that you know who your customer is, find 5 real people who fit that profile. Friends of friends, colleagues, LinkedIn connections, community members, people in online forums. List them here. You'll reach out to them in the next task.",
          mission_id: "mission3",
          quest_id: "mission3_quest1",
          execution_environment: "off_app",
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Find People to Interview", 
                type: "blog", 
                path_or_url: "content/blog/find-interview-subjects.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Cold Outreach That Works", 
                type: "blog", 
                path_or_url: "content/blog/cold-outreach.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m3_q1_t3_customer_interviews",
          title: "Have the customer conversations",
          sequence: 3,
          type: "action",
          component_key: "InterviewGuide",
          grant_points: 30,
          estimated_minutes: 120,
          description: "Have real conversations with your 5 potential customers. Ask about the problem, not your solution. Listen more than you talk. Ask: 'What do you do about this now?' 'What have you tried?' 'What would make this easier?' Take notes. What surprised you?",
          mission_id: "mission3",
          quest_id: "mission3_quest1",
          execution_environment: "off_app",
          checkback_delay_days: 3,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The Mom Test: How to Ask Questions That Don't Suck", 
                type: "blog", 
                path_or_url: "content/blog/the-mom-test.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "Customer Interview Template", 
                type: "download", 
                path_or_url: "/resources/interview-template.pdf" 
              },
              { 
                title: "How to Listen Without Selling", 
                type: "youtube", 
                path_or_url: "https://www.youtube.com/watch?v=QpYVIGWqRiM", 
                subtitle: "10 min watch" 
              }
            ],
            reflection_prompt: "After your interviews, what surprised you most? What did you learn that you didn't expect? What did you get wrong about your customer?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m3_q1_t4_synthesize_interviews",
          title: "What did you learn?",
          sequence: 4,
          type: "form",
          component_key: "InterviewSynthesis",
          grant_points: 25,
          estimated_minutes: 25,
          description: "Review your interview notes. What patterns emerged? What did you get wrong? What surprised you? What did you learn about your customer that you didn't know before? What does this mean for your solution?",
          mission_id: "mission3",
          quest_id: "mission3_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Synthesize Customer Interviews", 
                type: "blog", 
                path_or_url: "content/blog/synthesize-interviews.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Finding Patterns in Customer Feedback", 
                type: "blog", 
                path_or_url: "content/blog/patterns-in-feedback.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest2: {
      id: "mission3_quest2",
      slug: "who-else-is-doing-this",
      title: "Who Else Is Doing This?",
      subtitle: "Understand the competitive landscape",
      description: "You're not the first person to solve this problem. Understanding who else is out there helps you find your place. You'll research competitors, identify your unfair advantage, and craft a positioning statement that makes you stand out.",
      sequence: 2,
      content: "",
      estimated_in_app_minutes: 60,
      estimated_off_app_minutes: 90,
      is_optional: false,
      mission_id: "mission3",
      content_path: "content/mission3/quests/who-else-is-doing-this.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Strategist",
        persona_prompt: "You are a competitive strategy expert. Help the user understand their competitive landscape. Encourage them to look at both direct and indirect competitors. Help them identify what makes them unique.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 50,
          badge_key: "COMPETITIVE_INTELLIGENCE"
        }
      },
      tasks: [
        {
          id: "m3_q2_t1_competitor_research",
          title: "Map the competition",
          sequence: 1,
          type: "action",
          component_key: "CompetitorResearch",
          grant_points: 20,
          estimated_minutes: 60,
          description: "Who else is solving this problem? Direct competitors (same solution) and indirect (different solution, same problem). What do they charge? What do people complain about? What do they do well? What's missing?",
          mission_id: "mission3",
          quest_id: "mission3_quest2",
          execution_environment: "off_app",
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Do Competitor Research", 
                type: "blog", 
                path_or_url: "content/blog/competitor-research.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "What to Look for in Competitor Reviews", 
                type: "blog", 
                path_or_url: "content/blog/competitor-reviews.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m3_q2_t2_unfair_advantage",
          title: "What's your unfair advantage?",
          sequence: 2,
          type: "form",
          component_key: "UnfairAdvantageForm",
          grant_points: 15,
          estimated_minutes: 15,
          description: "Why you? What do you bring that others don't? Be honest. If you don't have one yet, that's okay—what could you build or learn to get one? What would make people choose you over the competition?",
          mission_id: "mission3",
          quest_id: "mission3_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Finding Your Unfair Advantage", 
                type: "blog", 
                path_or_url: "content/blog/unfair-advantage.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "When 'Better' Isn't Enough", 
                type: "blog", 
                path_or_url: "content/blog/better-isnt-enough.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m3_q2_t3_positioning_statement",
          title: "Craft your positioning statement",
          sequence: 3,
          type: "form",
          component_key: "PositioningStatement",
          grant_points: 15,
          estimated_minutes: 15,
          description: "Based on your research, write a 2-sentence positioning statement: 'We help [customer] [solve problem] by [unique approach], unlike [competitors] who [what they do differently].' This will be your North Star.",
          mission_id: "mission3",
          quest_id: "mission3_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Write a Positioning Statement", 
                type: "blog", 
                path_or_url: "content/blog/positioning-statement.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Examples of Great Positioning", 
                type: "blog", 
                path_or_url: "content/blog/great-positioning-examples.md", 
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
      id: "mission3_quest3",
      slug: "the-rules-of-the-game",
      title: "The Rules of the Game",
      subtitle: "Understand what permissions and policies you need",
      description: "Every business has rules. Some are simple, some are complex. The key is knowing what you need BEFORE you start, so you don't get surprised later. Answer a few questions about your business, and we'll generate a personalized compliance checklist showing you exactly what you need to handle—and what can wait.",
      sequence: 3,
      content: "",
      estimated_in_app_minutes: 60,
      estimated_off_app_minutes: 30,
      is_optional: false,
      mission_id: "mission3",
      content_path: "content/mission3/quests/the-rules-of-the-game.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Advisor",
        persona_prompt: "You are a practical business advisor. Help the user understand what permissions and policies they need. Be realistic—tell them what they need NOW versus what can wait. Don't scare them, but don't sugarcoat it either.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 75,
          badge_key: "RULE_AWARE"
        }
      },
      tasks: [
        {
          id: "m3_q3_t1_compliance_checklist",
          title: "Your compliance checklist",
          sequence: 1,
          type: "form",
          component_key: "ComplianceChecklist",
          grant_points: 40,
          estimated_minutes: 45,
          description: "We'll ask you a few questions about your business—what you're building, where, how, and at what scale. Then we'll generate a personalized compliance checklist showing you exactly what permissions, registrations, and policies you need to handle, and what can wait until later.",
          mission_id: "mission3",
          quest_id: "mission3_quest3",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Common Business Permissions by Industry", 
                type: "blog", 
                path_or_url: "content/blog/common-permissions.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "What Permissions Can Wait?", 
                type: "blog", 
                path_or_url: "content/blog/permissions-that-can-wait.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Business Registration Guide (PDF)", 
                type: "download", 
                path_or_url: "/resources/business-registration-guide.pdf" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m3_q3_t2_go_nogo_decision",
          title: "Make your go/no-go decision",
          sequence: 2,
          type: "form",
          component_key: "ComplianceGoNoGo",
          grant_points: 35,
          estimated_minutes: 15,
          description: "Now that you've gone through the compliance checklist, look at everything: what's required, what's optional, what can wait. Does this seem doable? Is it too complicated for where you are right now? Make your decision and commit to it.",
          mission_id: "mission3",
          quest_id: "mission3_quest3",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "When to Walk Away from an Idea", 
                type: "blog", 
                path_or_url: "content/blog/when-to-walk-away.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "It's Okay to Pivot", 
                type: "blog", 
                path_or_url: "content/blog/its-okay-to-pivot.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Sunk Cost Fallacy: Why You Should Quit Sometimes", 
                type: "blog", 
                path_or_url: "content/blog/sunk-cost-fallacy.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest4: {
      id: "mission3_quest4",
      slug: "what-will-you-build",
      title: "What Will You Build?",
      subtitle: "Define your Minimum Sellable Product",
      description: "Most people, when they find a problem worth solving, immediately picture one specific solution. If you're a developer, you see an app. If you're a consultant, you see a service. If you're a writer, you see a course. But there are multiple ways to solve the same problem. In this quest, we'll explore all the options and define the smallest thing you can build that someone will actually pay for.",
      sequence: 4,
      content: "",
      estimated_in_app_minutes: 75,
      estimated_off_app_minutes: 30,
      is_optional: false,
      mission_id: "mission3",
      content_path: "content/mission3/quests/what-will-you-build.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Architect",
        persona_prompt: "You are a product strategist. Help the user explore the solution space and define their Minimum Sellable Product. Push them to think beyond their default solution. Help them identify the smallest, most sellable thing they could build.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 75,
          badge_key: "SOLUTION_ARCHITECT"
        }
      },
      tasks: [
        {
          id: "m3_q4_t1_core_problem",
          title: "Define the core problem",
          sequence: 1,
          type: "form",
          component_key: "CoreProblemStatement",
          grant_points: 15,
          estimated_minutes: 15,
          description: "What is the ONE problem you're solving? Not 5 problems. Not 3. One. What's the single biggest pain point for your customer? 'Small business owners struggle with bookkeeping' is okay. 'Sarah, who runs a bakery, spends 4 hours every Sunday doing bookkeeping and hates it' is better.",
          mission_id: "mission3",
          quest_id: "mission3_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Define a Problem Statement", 
                type: "blog", 
                path_or_url: "content/blog/problem-statement.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "The 5 Whys of Problem Definition", 
                type: "blog", 
                path_or_url: "content/blog/5-whys.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m3_q4_t2_solution_space",
          title: "Explore the solution space",
          sequence: 2,
          type: "form",
          component_key: "SolutionSpaceExplorer",
          grant_points: 20,
          estimated_minutes: 20,
          description: "Most people jump straight to one solution format. Let's pause and explore ALL the ways you could solve this problem. There are four main formats: Service/Agency, Software/SaaS, Marketplace/Platform, and Information/Course. Which one fits you best?",
          mission_id: "mission3",
          quest_id: "mission3_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The 4 Types of Business Solutions", 
                type: "blog", 
                path_or_url: "content/blog/4-business-solutions.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "How to Pick the Right Solution Format", 
                type: "blog", 
                path_or_url: "content/blog/pick-solution-format.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m3_q4_t3_pick_your_path",
          title: "Pick your path",
          sequence: 3,
          type: "form",
          component_key: "SolutionPathPicker",
          grant_points: 10,
          estimated_minutes: 10,
          description: "Based on exploring all 4 formats, which one feels right for you? There's no wrong answer—just the one that fits your skills, resources, and goals. Choose one and explain why.",
          mission_id: "mission3",
          quest_id: "mission3_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Choose Your Business Model", 
                type: "blog", 
                path_or_url: "content/blog/choose-business-model.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m3_q4_t4_minimum_sellable_product",
          title: "Define your Minimum Sellable Product",
          sequence: 4,
          type: "form",
          component_key: "MSPDefinition",
          grant_points: 20,
          estimated_minutes: 20,
          description: "What's the smallest thing you could build that someone would actually pay for? Not the dream. The thing that gets them from A to B. What's the ONE thing they need right now? What would someone hand over money for TODAY?",
          mission_id: "mission3",
          quest_id: "mission3_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Minimum Sellable Product vs. Minimum Viable Product", 
                type: "blog", 
                path_or_url: "content/blog/msp-vs-mvp.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "How to Find Your First Paying Customer", 
                type: "blog", 
                path_or_url: "content/blog/first-paying-customer.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The 20% That Gets 80% of the Value", 
                type: "blog", 
                path_or_url: "content/blog/20-80-rule.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m3_q4_t5_msp_canvas",
          title: "Build your MSP Canvas",
          sequence: 5,
          type: "form",
          component_key: "MSPCanvas",
          grant_points: 10,
          estimated_minutes: 15,
          description: "Put it all together. This is your blueprint for what you're building first. The problem, the customer, the solution format, the minimal solution, the sellable feature, the first customer, the price. This is your starting point.",
          mission_id: "mission3",
          quest_id: "mission3_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Use the MSP Canvas", 
                type: "blog", 
                path_or_url: "content/blog/msp-canvas.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "From Canvas to First Build", 
                type: "blog", 
                path_or_url: "content/blog/canvas-to-build.md", 
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
      id: "mission3_quest5",
      slug: "does-this-actually-make-sense",
      title: "Does This Actually Make Sense?",
      subtitle: "Final viability check before you commit",
      description: "You've done the work. You've talked to customers, researched competition, figured out permissions, and designed your MSP. Now let's do one final check: Does this actually make sense? Can you do this? Should you do this?",
      sequence: 5,
      content: "",
      estimated_in_app_minutes: 45,
      estimated_off_app_minutes: 0,
      is_optional: false,
      mission_id: "mission3",
      content_path: "content/mission3/quests/does-this-actually-make-sense.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Realist",
        persona_prompt: "You are a grounded advisor who helps founders make hard decisions. Don't be a cheerleader. Challenge their assumptions. Ask the tough questions. Help them see if this is truly viable. If it's not, help them accept that and move on.",
        required_context: ["user_profiles", "projects", "opportunities"],
        on_success: {
          grant_points: 100,
          badge_key: "VIABILITY_VERIFIED"
        }
      },
      tasks: [
        {
          id: "m3_q5_t1_numbers_check",
          title: "The numbers check",
          sequence: 1,
          type: "form",
          component_key: "ViabilityNumbers",
          grant_points: 15,
          estimated_minutes: 15,
          description: "Let's get real about money. What's the minimum price someone would pay? How many customers do you need to make this worth your time? Can you acquire them for less than they pay you? Be honest. If the numbers don't work, that's good to know now.",
          mission_id: "mission3",
          quest_id: "mission3_quest5",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Basic Unit Economics for Beginners", 
                type: "blog", 
                path_or_url: "content/blog/unit-economics.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "How to Price Your First Product", 
                type: "blog", 
                path_or_url: "content/blog/how-to-price.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Customer Acquisition Cost Calculator", 
                type: "download", 
                path_or_url: "/resources/cac-calculator.xlsx" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m3_q5_t2_timeline_check",
          title: "The timeline check",
          sequence: 2,
          type: "form",
          component_key: "ViabilityTimeline",
          grant_points: 15,
          estimated_minutes: 15,
          description: "How long will this take? What's the earliest date you could have something people can buy? What's your personal timeline—can you sustain this? Be realistic. Add 50% to whatever you think it'll take.",
          mission_id: "mission3",
          quest_id: "mission3_quest5",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Estimate Build Time", 
                type: "blog", 
                path_or_url: "content/blog/estimate-build-time.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "The 50% Rule: Why Everything Takes Longer", 
                type: "blog", 
                path_or_url: "content/blog/50-percent-rule.md", 
                subtitle: "3 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m3_q5_t3_final_viability_check",
          title: "The final viability check",
          sequence: 3,
          type: "form",
          component_key: "FinalViabilityCheck",
          grant_points: 20,
          estimated_minutes: 15,
          description: "Look at everything: Customers, competition, permissions, solution, numbers, timeline. Does this work? Are you excited? Is it worth doing? If yes, let's move forward. If no, that's okay—go back to Mission 2 and pick a different opportunity. There's no shame in pivoting.",
          mission_id: "mission3",
          quest_id: "mission3_quest5",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Make a Go/No-Go Decision", 
                type: "blog", 
                path_or_url: "content/blog/go-no-go.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The Best Founders Pivot", 
                type: "blog", 
                path_or_url: "content/blog/best-founders-pivot.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "Sunk Cost Fallacy: Why You Should Quit Sometimes", 
                type: "blog", 
                path_or_url: "content/blog/sunk-cost-fallacy.md", 
                subtitle: "4 min read" 
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