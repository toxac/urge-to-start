// lib/playbook/mission8.ts
import { Mission } from "@/types/playbook";

export const mission8: Mission = {
  id: "mission8",
  title: "True Review & The Reality Crossroads",
  sequence: 8,
  video_url: "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm",
  briefing_text: "You've come a long way. From your first observation to your public launch, you've built something real. Now it's time to stop, look back, and decide what's next. This mission is about honest reflection—what worked, what didn't, and where you go from here. You'll review your journey, your business, and your life. Then you'll make the big decision: optimize, expand, or pivot.",
  content: "",
  content_path: "content/mission8/mission.md",
  prerequisites: [
    {
      item: "Completed Mission 7 (Public Launch & Market Engine)",
      promptRawText: "You should have completed your first quarter of public operations. Complete Mission 7 first."
    },
    {
      item: "3+ months of real customer data",
      promptRawText: "You need enough data to make informed decisions. At least 3 months of customer feedback and revenue data."
    },
    {
      item: "Willingness to be brutally honest",
      promptRawText: "This mission is about honest reflection. It's okay if things didn't work out—that's data, not failure."
    }
  ],
  quests: {
    quest1: {
      id: "mission8_quest1",
      slug: "review-your-journey",
      title: "Review Your Journey",
      subtitle: "Look back at everything you've built",
      description: "Before you decide where to go, you need to understand where you've been. This quest is about honest reflection—reviewing your entire journey from Mission 1 to now. What did you learn? What surprised you? What would you do differently?",
      sequence: 1,
      content: "",
      estimated_in_app_minutes: 90,
      estimated_off_app_minutes: 120,
      is_optional: false,
      mission_id: "mission8",
      content_path: "content/mission8/quests/review-your-journey.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Reflector",
        persona_prompt: "You help founders reflect on their journey. Ask deep questions. Help them see patterns. Celebrate their wins. Challenge their assumptions. This is about honest reflection, not self-criticism.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 75,
          badge_key: "REFLECTED"
        }
      },
      tasks: [
        {
          id: "m8_q1_t1_journey_timeline",
          title: "Map your journey timeline",
          sequence: 1,
          type: "form",
          component_key: "JourneyTimeline",
          grant_points: 25,
          estimated_minutes: 30,
          description: "Look back at every mission. What did you learn in each one? What was the hardest part? What was the most rewarding? Map your journey from Mission 1 to now. This is your founder story.",
          mission_id: "mission8",
          quest_id: "mission8_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Reflect on Your Founder Journey", 
                type: "blog", 
                path_or_url: "content/blog/reflect-journey.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The Founder's Reflection Template", 
                type: "download", 
                path_or_url: "/resources/founder-reflection-template.pdf" 
              }
            ],
            reflection_prompt: "Looking back at your journey, what's the one moment that changed everything? What are you most proud of?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m8_q1_t2_lessons_learned",
          title: "Document your lessons learned",
          sequence: 2,
          type: "form",
          component_key: "LessonsLearned",
          grant_points: 25,
          estimated_minutes: 30,
          description: "What did you learn? What surprised you? What would you do differently? What would you tell someone starting today? This is your hard-won wisdom—capture it.",
          mission_id: "mission8",
          quest_id: "mission8_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Document Lessons Learned", 
                type: "blog", 
                path_or_url: "content/blog/lessons-learned.md", 
                subtitle: "4 min read" 
              }
            ],
            reflection_prompt: "What's the most important lesson you learned? What's the one thing you'd tell your past self?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m8_q1_t3_biggest_wins",
          title: "Celebrate your biggest wins",
          sequence: 3,
          type: "form",
          component_key: "BiggestWins",
          grant_points: 25,
          estimated_minutes: 30,
          description: "This isn't just about learning—it's also about celebrating. What were your biggest wins? First customer? First pre-sale? First positive feedback? First repeat customer? This is your victory lap.",
          mission_id: "mission8",
          quest_id: "mission8_quest1",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "Why Celebrating Wins Matters", 
                type: "blog", 
                path_or_url: "content/blog/celebrate-wins.md", 
                subtitle: "4 min read" 
              }
            ],
            reflection_prompt: "What's the win you're most proud of? Why does it matter to you?"
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest2: {
      id: "mission8_quest2",
      slug: "review-your-business",
      title: "Review Your Business",
      subtitle: "Look at the data—what actually happened?",
      description: "Now let's get real. Look at the data. Revenue, customers, feedback, growth, costs. What actually happened? This isn't about judgment—it's about understanding the truth of your business.",
      sequence: 2,
      content: "",
      estimated_in_app_minutes: 90,
      estimated_off_app_minutes: 60,
      is_optional: false,
      mission_id: "mission8",
      content_path: "content/mission8/quests/review-your-business.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Analyst",
        persona_prompt: "You help founders look at their business data honestly. Help them see patterns. Challenge their assumptions. Celebrate their successes. Help them learn from their mistakes.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 75,
          badge_key: "BUSINESS_REVIEWED"
        }
      },
      tasks: [
        {
          id: "m8_q2_t1_revenue_review",
          title: "Review your revenue",
          sequence: 1,
          type: "form",
          component_key: "RevenueReview",
          grant_points: 25,
          estimated_minutes: 30,
          description: "How much revenue did you generate? What was your growth rate? What were your best months? What were your worst? What patterns do you see?",
          mission_id: "mission8",
          quest_id: "mission8_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Review Business Revenue", 
                type: "blog", 
                path_or_url: "content/blog/review-revenue.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Revenue Review Template", 
                type: "download", 
                path_or_url: "/resources/revenue-review-template.xlsx" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m8_q2_t2_customer_review",
          title: "Review your customers",
          sequence: 2,
          type: "form",
          component_key: "CustomerReview",
          grant_points: 25,
          estimated_minutes: 30,
          description: "Who are your customers? What do they love? What do they complain about? Why do they stay? Why do they leave? What patterns do you see?",
          mission_id: "mission8",
          quest_id: "mission8_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Review Customer Data", 
                type: "blog", 
                path_or_url: "content/blog/review-customers.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Customer Review Template", 
                type: "download", 
                path_or_url: "/resources/customer-review-template.pdf" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m8_q2_t3_operations_review",
          title: "Review your operations",
          sequence: 3,
          type: "form",
          component_key: "OperationsReview",
          grant_points: 25,
          estimated_minutes: 30,
          description: "What's working in your operations? What's breaking? What's taking too much time? What could be automated? What's draining your energy?",
          mission_id: "mission8",
          quest_id: "mission8_quest2",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Review Business Operations", 
                type: "blog", 
                path_or_url: "content/blog/review-operations.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest3: {
      id: "mission8_quest3",
      slug: "the-reality-crossroads",
      title: "The Reality Crossroads",
      subtitle: "Make the big decision: optimize, expand, or pivot",
      description: "You've reviewed your journey and your business. Now you have to decide: What's next? There are three paths: Optimize (make what you have better), Expand (grow what you have), or Pivot (try something new). This is the hardest decision you'll make as a founder.",
      sequence: 3,
      content: "",
      estimated_in_app_minutes: 60,
      estimated_off_app_minutes: 60,
      is_optional: false,
      mission_id: "mission8",
      content_path: "content/mission8/quests/the-reality-crossroads.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Crossroads Guide",
        persona_prompt: "You help founders make big decisions. Don't sugarcoat it. Help them see the reality of their situation. Encourage them to trust their gut but also look at the data. This is about clarity, not comfort.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 100,
          badge_key: "CROSSROADS_DECIDED"
        }
      },
      tasks: [
        {
          id: "m8_q3_t1_three_paths",
          title: "Explore the three paths",
          sequence: 1,
          type: "form",
          component_key: "ThreePathsExplorer",
          grant_points: 25,
          estimated_minutes: 30,
          description: "There are three paths forward: Optimize, Expand, or Pivot. Each has different implications for your time, energy, and resources. Explore each one honestly.",
          mission_id: "mission8",
          quest_id: "mission8_quest3",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The Three Paths: Optimize, Expand, Pivot", 
                type: "blog", 
                path_or_url: "content/blog/three-paths.md", 
                subtitle: "7 min read" 
              },
              { 
                title: "How to Choose the Right Path", 
                type: "blog", 
                path_or_url: "content/blog/choose-right-path.md", 
                subtitle: "6 min read" 
              },
              { 
                title: "What Each Path Requires", 
                type: "blog", 
                path_or_url: "content/blog/what-each-path-requires.md", 
                subtitle: "5 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m8_q3_t2_the_decision",
          title: "Make your decision",
          sequence: 2,
          type: "form",
          component_key: "CrossroadsDecision",
          grant_points: 25,
          estimated_minutes: 20,
          description: "Based on everything you've reviewed, what's your decision? Optimize? Expand? Pivot? There's no right answer—only the right answer for you.",
          mission_id: "mission8",
          quest_id: "mission8_quest3",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Make a Founder Decision", 
                type: "blog", 
                path_or_url: "content/blog/founder-decision.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "Trusting Your Gut vs. Following the Data", 
                type: "blog", 
                path_or_url: "content/blog/gut-vs-data.md", 
                subtitle: "4 min read" 
              }
            ],
            reflection_prompt: "What's your decision? Why? What does it feel like in your gut?"
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m8_q3_t3_the_commitment",
          title: "Commit to your path",
          sequence: 3,
          type: "form",
          component_key: "PathCommitment",
          grant_points: 50,
          estimated_minutes: 30,
          description: "Write it down. What's your decision? Why? What will you do next? What will success look like? This is your commitment to yourself. Keep it somewhere you can see it.",
          mission_id: "mission8",
          quest_id: "mission8_quest3",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Commit to a Path", 
                type: "blog", 
                path_or_url: "content/blog/commit-to-path.md", 
                subtitle: "4 min read" 
              },
              { 
                title: "The Commitment Template", 
                type: "download", 
                path_or_url: "/resources/commitment-template.pdf" 
              }
            ],
            reflection_prompt: "How does it feel to commit? What's the first step you'll take?"
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    },
    quest4: {
      id: "mission8_quest4",
      slug: "whats-next",
      title: "What's Next?",
      subtitle: "Plan your next chapter",
      description: "You've made your decision. Now let's plan what comes next. This quest is about turning your decision into action—setting goals, building a plan, and committing to your next chapter.",
      sequence: 4,
      content: "",
      estimated_in_app_minutes: 45,
      estimated_off_app_minutes: 60,
      is_optional: false,
      mission_id: "mission8",
      content_path: "content/mission8/quests/whats-next.md",
      ai_config: {
        role: "SYSTEM_CONDUCTOR",
        persona_name: "The Planner",
        persona_prompt: "You help founders turn decisions into plans. Help them set realistic goals and timelines. Encourage them to dream big but start small.",
        required_context: ["user_profiles", "projects"],
        on_success: {
          grant_points: 100,
          badge_key: "FOUNDER"
        }
      },
      tasks: [
        {
          id: "m8_q4_t1_next_goals",
          title: "Set your next goals",
          sequence: 1,
          type: "form",
          component_key: "NextGoals",
          grant_points: 25,
          estimated_minutes: 25,
          description: "Based on your decision, what are your goals for the next 3 months? 6 months? 12 months? Be specific. Write them down.",
          mission_id: "mission8",
          quest_id: "mission8_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Set Founder Goals", 
                type: "blog", 
                path_or_url: "content/blog/founder-goals.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The 3-Month Goal Framework", 
                type: "blog", 
                path_or_url: "content/blog/3-month-goals.md", 
                subtitle: "4 min read" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m8_q4_t2_the_next_plan",
          title: "Build your next plan",
          sequence: 2,
          type: "form",
          component_key: "NextPlan",
          grant_points: 25,
          estimated_minutes: 30,
          description: "What's the plan? What will you do first? What milestones do you need to hit? This is your roadmap for the next chapter.",
          mission_id: "mission8",
          quest_id: "mission8_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Build a Founder Plan", 
                type: "blog", 
                path_or_url: "content/blog/founder-plan.md", 
                subtitle: "5 min read" 
              },
              { 
                title: "The 90-Day Plan Template", 
                type: "download", 
                path_or_url: "/resources/90-day-plan-template.pdf" 
              }
            ]
          },
          observation_config: null,
          metadata_config: {}
        },
        {
          id: "m8_q4_t3_final_reflection",
          title: "Final reflection",
          sequence: 3,
          type: "form",
          component_key: "FinalReflection",
          grant_points: 50,
          estimated_minutes: 20,
          description: "You've come so far. One last reflection: Who are you now compared to when you started? What's changed? What's the same? What's your message to your past self? This is your founder story.",
          mission_id: "mission8",
          quest_id: "mission8_quest4",
          execution_environment: null,
          checkback_delay_days: null,
          recurring: null,
          interval: null,
          ai_config: {
            recommendations: [
              { 
                title: "The Final Founder Reflection", 
                type: "blog", 
                path_or_url: "content/blog/final-reflection.md", 
                subtitle: "5 min read" 
              }
            ],
            reflection_prompt: "Who are you now? What's your message to the person who started this journey? What's your advice to someone starting today?"
          },
          observation_config: null,
          metadata_config: {}
        }
      ]
    }
  }
};