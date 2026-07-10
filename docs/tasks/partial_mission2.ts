// lib/playbook/mission2.ts

export const mission2 = {
  id: "mission2",
  title: "Find Problems Worth Solving",
  briefing_text: "Before you build anything, you need to find a problem worth solving. We're going to start with what you know best—your own frustrations—and gradually expand outward. By the end of this mission, you'll have a real opportunity you can turn into a business.",
  quests: {
    quest1: {
      id: "mission2_quest1",
      slug: "your-frustrations",
      description: "The best problems to solve are often the ones you experience yourself. You understand them intimately. You know the pain points. You're the expert. In this quest, we're going to mine your own frustrations and skills for business opportunities.",
      tasks: [
        {
          id: "m2_q1_t1_observation_week",
          title: "Collect your frustrations and annoyances",
          sequence: 1,
          component_key: "OpportunityObservationNotepad",
          description: "For the next 7 days, keep your observation journal with you. Every time something frustrates you, annoys you, or makes you think 'there has to be a better way'—write it down. Don't judge it. Just collect. Aim for at least 10 entries. Notice patterns. What comes up again and again?",
          execution_environment: "off_app",
          checkback_delay_days: null,
          observation_config: {
            pdf_url: "/resources/observation-journal.pdf",
            guide_questions: [
              "What annoyed you today? Why?",
              "What made you think 'I wish there was a better way'?",
              "What did you spend too much time on?",
              "What did you find yourself explaining to someone else?",
              "What made you say 'that's just how it is'?"
            ],
            min_observations: 10,
            observation_period_days: 7
          },
          ai_config: {
            recommendations: [
              { 
                title: "Download Observation Journal (PDF)", 
                type: "download", 
                path_or_url: "/resources/observation-journal.pdf" 
              },
              { 
                title: "How to Spot Hidden Opportunities in Your Frustrations", 
                type: "blog", 
                path_or_url: "content/blog/spot-opportunities-in-yourself.md",
                subtitle: "5 min read"
              }
            ],
            observation_prompt: "You've spent a week observing your own frustrations. Share what you noticed—what patterns emerged? What surprised you? What felt most frustrating or most frequent?",
            observation_analysis_prompt: `
            `,
            reflection_prompt: "After a week of observing and getting Kip's feedback, what patterns have you noticed? What are you most excited to explore further?"
          }
        },
        {
          id: "m2_q1_t2_skill_reflection",
          title: "What are you better at than most people?",
          sequence: 2,
          component_key: "SkillReflectionNotepad",
          description: "Now let's look at your skills. What do you do better than most people you know? This could be anything—cooking, organizing, explaining, fixing things, making people feel comfortable. Ask 3 people who know you well: 'What am I unusually good at?' And ask yourself: 'Would people pay me to do this for them?'",
          execution_environment: "off_app",
          checkback_delay_days: null,
          observation_config: {
            pdf_url: "/resources/skill-reflection.pdf",
            guide_questions: [
              "What do people come to you for help with?",
              "What do you do that feels effortless to you but hard for others?",
              "What have you been doing since you were young?",
              "What do you enjoy doing so much that you lose track of time?",
              "What do you know more about than the average person?"
            ],
            min_observations: 3,
            observation_period_days: 3
          },
          ai_config: {
            recommendations: [
              { 
                title: "Skill Reflection Worksheet (PDF)", 
                type: "download", 
                path_or_url: "/resources/skill-reflection.pdf" 
              },
              { 
                title: "How to Turn Your Skills Into a Business", 
                type: "blog", 
                path_or_url: "content/blog/skills-to-business.md",
                subtitle: "4 min read"
              }
            ],
            observation_prompt: "You've reflected on your skills and asked others what you're good at. Share what you discovered—what are you better at than most people? What did others say? What surprised you?",
            observation_analysis_prompt: `
              You are Kip, a grounded mentor helping an entrepreneur reflect on their unique skills and abilities.

              The user has spent time reflecting on their skills—what they're good at, what comes naturally to them, what others appreciate about them.

              Your job:
              1. Listen to their reflection on their skills
              2. Help them see the connection between their skills and potential business opportunities
              3. Ask questions that help them think about how their skills could solve problems:
                 - "What problems could you solve with this skill?"
                 - "Who would benefit from what you're good at?"
                 - "Is there a market for what you can do?"
                 - "What skills complement your main skill?"
              4. Encourage them to think about how to monetize their skills
              5. Help them see that skills don't have to be "business-y"—everyday skills can become businesses
              6. Keep it conversational and supportive—like a friend helping you see your own potential
              7. Don't give answers—ask questions that help them discover insights themselves

              After they share their reflections, respond with:
              - Pattern recognition: What skills seem most valuable?
              - Deeper questions: What would help them think more about monetizing their skills?
              - Potential opportunities: Where could their skills lead?
              - Encouragement: Acknowledge their unique abilities
              - Next steps: How can they use this insight?
            `,
            reflection_prompt: "What did people say you're good at? Did any of their answers surprise you? How might your skills connect to the frustrations you observed?"
          }
        },
        {
          id: "m2_q1_t3_enter_opportunities",
          title: "Enter your best opportunities",
          sequence: 3,
          component_key: "OpportunityForm",
          description: "Open your observation journal. Pick the 3-5 frustrations that felt most real, most frequent, or most interesting. Also look at your skill reflections. Where do your skills and frustrations intersect? Enter them into the system as opportunities—these are the raw materials for your business.",
          execution_environment: null,
          checkback_delay_days: null,
          observation_config: null,
          ai_config: {
            recommendations: [
              { 
                title: "From Frustration to Business Idea", 
                type: "blog", 
                path_or_url: "content/blog/frustration-to-business.md" 
              },
              { 
                title: "How to Write a Clear Problem Statement", 
                type: "blog", 
                path_or_url: "content/blog/problem-statement.md" 
              }
            ]
          }
        }
      ]
    },
    quest2: {
      id: "mission2_quest2",
      slug: "people-in-your-circle",
      description: "Now we're expanding outward. The people you know—friends, family, colleagues, classmates—have problems too. And because you know them, you can observe their frustrations firsthand. This is research you can do without leaving your comfort zone.",
      tasks: [
        {
          id: "m2_q2_t1_social_observation",
          title: "Observe the problems of people around you",
          sequence: 1,
          component_key: "OpportunityObservation",
          description: "Pick 3 people in your life. Could be a friend, a colleague, a family member, someone at your gym. Over the next week, observe them. What are they complaining about? What do they do that seems unnecessarily hard? What do they buy to fix their problems? Don't ask them yet—just watch. Take notes. Notice patterns.",
          execution_environment: "off_app",
          checkback_delay_days: null,
          observation_config: {
            pdf_url: "/resources/social-observation.pdf",
            guide_questions: [
              "What does this person complain about regularly?",
              "What tasks do they avoid or procrastinate on?",
              "What do they spend money on to solve problems?",
              "What do they do that seems inefficient?",
              "What makes them frustrated or stressed?"
            ],
            min_observations: 5,
            observation_period_days: 7
          },
          ai_config: {
            recommendations: [
              { 
                title: "Social Observation Worksheet (PDF)", 
                type: "download", 
                path_or_url: "/resources/social-observation.pdf" 
              },
              { 
                title: "How to Observe Without Judging", 
                type: "blog", 
                path_or_url: "content/blog/observing-without-judging.md",
                subtitle: "4 min read"
              }
            ],
            observation_prompt: "You've spent time observing the problems of people around you. Share what you noticed—what frustrations did you see? Who seemed most frustrated? What problems seemed most consistent or frequent?",
            observation_analysis_prompt: `
              You are Kip, a grounded mentor helping an entrepreneur reflect on their observations of people in their social circle.

              The user has spent time observing friends, family, colleagues, or classmates—noticing their frustrations, annoyances, and workarounds.

              Your job:
              1. Listen carefully to what they observed about other people's problems
              2. Identify patterns across their observations—what themes keep coming up across different people?
              3. Help them think about whether these problems are real enough to build a business around:
                 - "Is this a one-time frustration or a recurring problem?"
                 - "How do people currently deal with this?"
                 - "Is there a workaround people use?"
                 - "Does this problem affect just one person or many?"
              4. Ask questions that help them think about the value of solving these problems
              5. Encourage them to talk to people directly in the next task
              6. Keep it conversational and supportive—like a friend helping you think through something
              7. Don't give answers—ask questions that help them discover insights themselves

              After they share their observations, respond with:
              - Pattern recognition: What themes do you see across different people?
              - Deeper questions: What would help them understand these problems better?
              - Potential opportunities: Which problems seem most worth solving?
              - Encouragement: Acknowledge their effort and what they've noticed
              - Next steps: Prepare them for having conversations to validate these observations
            `,
            reflection_prompt: "What surprised you about people's frustrations? Was there a pattern across different people? Which problem seemed most real?"
          }
        },
        {
          id: "m2_q2_t2_validation_conversation",
          title: "Have the 'Is this real?' conversation",
          sequence: 2,
          component_key: "ValidationConversationWidget",
          description: "Now you've got some observations. Time to check if they're real. Approach each person and say: 'I noticed [problem]. Is that actually a thing for you? What do you do about it now?' Your job is to listen, not to sell. If they say 'that's not really a problem,' thank them and move on. If they light up and start complaining, you've found something.",
          execution_environment: "off_app",
          checkback_delay_days: 3,
          observation_config: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Ask Without Pitching", 
                type: "blog", 
                path_or_url: "content/blog/ask-without-pitching.md" 
              },
              { 
                title: "The Art of Listening", 
                type: "youtube", 
                path_or_url: "https://www.youtube.com/watch?v=QpYVIGWqRiM", 
                subtitle: "TED talk on active listening" 
              }
            ],
            observation_prompt: "You've had conversations with people about their problems. Share what you learned—what did people say? Who got excited? Who dismissed it? What surprised you?",
            observation_analysis_prompt: `
              You are Kip, a grounded mentor helping an entrepreneur reflect on conversations they had about problems people face.

              The user has had conversations with people in their circle, asking if the problems they observed were real, and how they currently deal with them.

              Your job:
              1. Listen to what they learned from these conversations
              2. Help them distinguish between real problems and minor annoyances:
                 - "Did people light up when you asked about the problem?"
                 - "What was their current workaround or solution?"
                 - "How much does this problem actually cost them in time or money?"
                 - "Did they seem interested in a better solution?"
              3. Help them identify which problems are most worth pursuing
              4. Encourage them to think about whether the problem is big enough to build a business around
              5. Keep it conversational and supportive—like a friend helping you think through something
              6. Don't give answers—ask questions that help them discover insights themselves

              After they share what they learned, respond with:
              - Pattern recognition: What themes came up across conversations?
              - Deeper questions: What would help them understand these problems better?
              - Potential opportunities: Which problems seem most real and most solvable?
              - Encouragement: Acknowledge their courage in having these conversations
              - Next steps: What should they do with this insight?
            `,
            reflection_prompt: "How did it feel to ask people about their problems? Did anyone get excited? Did anyone dismiss it? What did you learn from the conversations that you didn't expect?"
          }
        },
        {
          id: "m2_q2_t3_add_opportunities",
          title: "Add validated opportunities to your list",
          sequence: 3,
          component_key: "OpportunityForm",
          description: "Add the validated problems to your growing list. If 3 people told you 'yes, that's a real pain,' that's worth noting. If someone got excited, that's even better. Keep building your list—you're getting closer.",
          execution_environment: null,
          checkback_delay_days: null,
          observation_config: null,
          ai_config: {
            recommendations: [
              { 
                title: "From Observation to Opportunity", 
                type: "blog", 
                path_or_url: "content/blog/observation-to-opportunity.md" 
              }
            ]
          }
        }
      ]
    },
    quest3: {
      id: "mission2_quest3",
      slug: "the-world-out-there",
      description: "Now we're looking at the broader market. This is where you find problems that affect enough people to make a real business. You'll use tools like Google Trends, Reddit, Facebook Groups, and marketplaces to see what people are struggling with on a larger scale.",
      tasks: [
        {
          id: "m2_q3_t1_trend_research",
          title: "What are people searching for?",
          sequence: 1,
          component_key: "TrendResearchWidget",
          description: "Open Google Trends. Search 5 terms related to problems you're curious about. Look at related queries—what are people searching for? Also check Reddit: what are people complaining about in subreddits related to your interests? This isn't about copying trends. It's about finding patterns of unmet need.",
          execution_environment: "off_app",
          checkback_delay_days: null,
          observation_config: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Use Google Trends for Business Ideas", 
                type: "blog", 
                path_or_url: "content/blog/google-trends-guide.md" 
              },
              { 
                title: "Reddit: The World's Largest Focus Group", 
                type: "blog", 
                path_or_url: "content/blog/reddit-focus-group.md" 
              }
            ],
            observation_prompt: "You've researched trends and online discussions. Share what you found—what patterns did you notice? What problems seem to be discussed frequently? What surprised you?",
            observation_analysis_prompt: `
              You are Kip, a grounded mentor helping an entrepreneur reflect on their research into broader market problems and trends.

              The user has used tools like Google Trends, Reddit, and other platforms to understand what problems people are talking about on a larger scale.

              Your job:
              1. Listen to what they found in their research
              2. Help them distinguish between passing trends and real problems:
                 - "Is this a growing concern or a flash in the pan?"
                 - "How many people seem to be affected by this problem?"
                 - "What are people currently doing to solve this?"
                 - "Are there existing solutions that aren't working well?"
              3. Help them think about whether these problems align with their skills and interests
              4. Encourage them to think about market size and viability
              5. Keep it conversational and supportive—like a friend helping you think through something
              6. Don't give answers—ask questions that help them discover insights themselves

              After they share what they found, respond with:
              - Pattern recognition: What themes emerged across different platforms?
              - Deeper questions: What would help them understand these problems better?
              - Potential opportunities: Which problems seem most worth exploring further?
              - Encouragement: Acknowledge their research effort
              - Next steps: What should they do with this insight?
            `,
            reflection_prompt: "What surprised you in the search results? Was there a problem that seemed more common than you expected?"
          }
        },
        {
          id: "m2_q3_t2_forum_research",
          title: "Where do people talk about their problems?",
          sequence: 2,
          component_key: "ForumResearchWidget",
          description: "Check Facebook Groups, LinkedIn communities, industry forums. Look for questions that keep coming up. Look for hacks and workarounds. If people are actively discussing a problem, it's worth paying attention to. Join the conversation—ask questions, not pitch.",
          execution_environment: "off_app",
          checkback_delay_days: 2,
          observation_config: null,
          ai_config: {
            recommendations: [
              { 
                title: "Finding Problems in Online Communities", 
                type: "blog", 
                path_or_url: "content/blog/online-communities-problems.md" 
              },
              { 
                title: "How to Ask Research Questions in Forums", 
                type: "blog", 
                path_or_url: "content/blog/ask-research-questions.md" 
              }
            ],
            observation_prompt: "You've researched online communities and forums. Share what you discovered—what problems are people actively discussing? What questions keep coming up? What workarounds do people share?",
            observation_analysis_prompt: `
              You are Kip, a grounded mentor helping an entrepreneur reflect on their research into online communities and forums.

              The user has explored Facebook Groups, LinkedIn communities, and industry forums to understand what problems people are actively discussing.

              Your job:
              1. Listen to what they found in their community research
              2. Help them identify problems that people are actively seeking solutions for:
                 - "What questions keep coming up without good answers?"
                 - "What workarounds do people share?"
                 - "How engaged is the community around this problem?"
                 - "What would happen if someone solved this problem for them?"
              3. Encourage them to think about whether the problem is big enough to build a business around
              4. Keep it conversational and supportive—like a friend helping you think through something
              5. Don't give answers—ask questions that help them discover insights themselves

              After they share what they found, respond with:
              - Pattern recognition: What themes emerged across different communities?
              - Deeper questions: What would help them understand these problems better?
              - Potential opportunities: Which problems seem most worth solving?
              - Encouragement: Acknowledge their research effort
              - Next steps: What should they do with this insight?
            `,
            reflection_prompt: "Which community had the most engaged discussions about problems? What does that tell you?"
          }
        },
        {
          id: "m2_q3_t3_marketplace_research",
          title: "What's already being sold?",
          sequence: 3,
          component_key: "MarketplaceResearchWidget",
          description: "Go to Amazon, Etsy, or wherever relevant. Search for products related to your problem area. What do people complain about in the reviews? 'I wish this had...' 'If only it could...' Those complaints are gold. They represent unmet needs that existing products aren't solving.",
          execution_environment: "off_app",
          checkback_delay_days: null,
          observation_config: null,
          ai_config: {
            recommendations: [
              { 
                title: "Reading Between the Lines of Product Reviews", 
                type: "blog", 
                path_or_url: "content/blog/product-review-insights.md" 
              },
              { 
                title: "Competitor Analysis for Beginners", 
                type: "blog", 
                path_or_url: "content/blog/competitor-analysis.md" 
              }
            ],
            observation_prompt: "You've researched marketplaces and product reviews. Share what you discovered—what complaints keep coming up? What gaps did you find in existing solutions?",
            observation_analysis_prompt: `
              You are Kip, a grounded mentor helping an entrepreneur reflect on their research into existing products and market gaps.

              The user has explored marketplaces like Amazon and Etsy to understand what problems people have with existing solutions.

              Your job:
              1. Listen to what they found in their marketplace research
              2. Help them identify gaps and unmet needs:
                 - "What complaints keep coming up in reviews?"
                 - "What features do people wish existing products had?"
                 - "What do people say they would pay for?"
                 - "Is there a gap between what's available and what people actually need?"
              3. Help them think about whether they could fill that gap
              4. Keep it conversational and supportive—like a friend helping you think through something
              5. Don't give answers—ask questions that help them discover insights themselves

              After they share what they found, respond with:
              - Pattern recognition: What complaints came up most frequently?
              - Deeper questions: What would help them understand these gaps better?
              - Potential opportunities: Which gaps seem most worth filling?
              - Encouragement: Acknowledge their research effort
              - Next steps: What should they do with this insight?
            `,
            reflection_prompt: "What complaints kept coming up? Is there a gap in the market you could fill?"
          }
        },
        {
          id: "m2_q3_t4_consolidate_opportunities",
          title: "Consolidate your opportunity list",
          sequence: 4,
          component_key: "OpportunityListReview",
          description: "You've done a lot of research. You've got observations from yourself, from people you know, and from the broader market. Now it's time to review everything. Look at your list. Which problems seem most real? Which affect the most people? Which are you most excited to solve? Add the best ones to your master opportunity list.",
          execution_environment: null,
          checkback_delay_days: null,
          observation_config: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Prioritize Business Ideas", 
                type: "blog", 
                path_or_url: "content/blog/prioritize-ideas.md" 
              },
              { 
                title: "The Problem Filter: Separating Wheat from Chaff", 
                type: "blog", 
                path_or_url: "content/blog/problem-filter.md" 
              }
            ]
          }
        }
      ]
    },
    quest4: {
      id: "mission2_quest4",
      slug: "pick-your-path",
      description: "You've explored problems from every angle. You've looked inward, outward, and across the market. Now it's time to choose. This isn't about picking the 'perfect' idea—there's no such thing. It's about picking the idea you'll actually pursue. The one that passes the tests. The one that feels right.",
      tasks: [
        {
          id: "m2_q4_t1_opportunity_scoring",
          title: "Score your opportunities honestly",
          sequence: 1,
          component_key: "OpportunityScoringForm",
          description: "Here's the truth: you can't pursue all of them. Let's get real. For each opportunity on your list, score it honestly on these 5 criteria:\n\n• **Do I actually care about this problem?** (1-10)\n• **Do I know people who have this problem?** (1-10)\n• **Could I talk to them easily?** (1-10)\n• **Do I have any unfair advantage here?** (1-10)\n• **Is there a clear way I could get paid?** (1-10)",
          execution_environment: null,
          checkback_delay_days: null,
          observation_config: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Choose the Right Business Idea", 
                type: "blog", 
                path_or_url: "content/blog/choose-right-idea.md" 
              },
              { 
                title: "The 5 Tests of a Good Business Opportunity", 
                type: "blog", 
                path_or_url: "content/blog/5-tests-opportunity.md" 
              }
            ],
            observation_prompt: "You've scored your opportunities. Share what you discovered—which opportunities scored highest? What patterns did you notice? Which one feels most aligned with your skills and interests?",
            observation_analysis_prompt: `
              You are Kip, a grounded mentor helping an entrepreneur make a clear decision about which opportunity to pursue.

              The user has scored their opportunities on key criteria including: care about the problem, access to people who have it, ability to get feedback, unfair advantage, and clarity of getting paid.

              Your job:
              1. Listen to what they discovered through the scoring process
              2. Help them think through which opportunity feels most aligned:
                 - "Which opportunity scored highest across all criteria?"
                 - "Which one feels most energizing to you?"
                 - "Which one would you be most excited to work on?"
                 - "Which one has the clearest path to getting paid?"
              3. Help them trust their gut while also being realistic
              4. Remind them: they can always change direction later
              5. Keep it conversational and supportive—like a friend helping you make a decision
              6. Don't give answers—ask questions that help them discover their own priorities

              After they share their scoring insights, respond with:
              - Pattern recognition: What themes emerged in their scoring?
              - Deeper questions: What would help them decide more confidently?
              - Potential opportunities: Which opportunity seems most promising?
              - Encouragement: Acknowledge their thorough evaluation
              - Next steps: Prepare them for the confirmation conversation
            `,
            reflection_prompt: "Looking at your scores, which opportunity stands out? Which one would you be most excited to tell people about?"
          }
        },
        {
          id: "m2_q4_t2_final_confirmation",
          title: "Have the confirmation conversation",
          sequence: 2,
          component_key: "ConfirmationConversationWidget",
          description: "Take your top 3 opportunities. Go back to the people you spoke with. Say: 'I'm thinking about solving [problem]. Does this actually sound valuable to you? Would you pay for a solution?' If they hesitate or give you a 'maybe,' that's your answer. If they get excited, you're onto something.",
          execution_environment: "off_app",
          checkback_delay_days: 2,
          observation_config: null,
          ai_config: {
            recommendations: [
              { 
                title: "How to Ask 'Would You Pay?' Without Being Pushy", 
                type: "blog", 
                path_or_url: "content/blog/ask-would-you-pay.md" 
              }
            ],
            observation_prompt: "You've had the confirmation conversations. Share what you learned—what did people say? Who got excited? Who said they'd pay? What surprised you?",
            observation_analysis_prompt: `
              You are Kip, a grounded mentor helping an entrepreneur make their final decision after confirmation conversations.

              The user has had conversations with people, asking them if the problem is real and if they'd pay for a solution.

              Your job:
              1. Listen to what they learned from these conversations
              2. Help them interpret the signals they received:
                 - "Who got genuinely excited about your idea?"
                 - "Who said they'd pay or use it?"
                 - "Who hesitated or gave you a maybe?"
                 - "What did you learn that you didn't expect?"
              3. Help them identify which opportunity has the strongest signals
              4. Encourage them to trust both the data and their gut
              5. Remind them: you can always pivot later—you just need to start
              6. Keep it conversational and supportive—like a friend helping you think through a decision

              After they share what they learned, respond with:
              - Pattern recognition: What themes came up across conversations?
              - Deeper questions: What would help them decide with confidence?
              - Potential opportunities: Which one feels most likely to succeed?
              - Encouragement: Acknowledge their courage in having these conversations
              - Next steps: Prepare them to commit to their project
            `,
            reflection_prompt: "What did people say? Did anyone get genuinely excited? Did anyone tell you they'd pay? That's your signal."
          }
        },
        {
          id: "m2_q4_t3_create_project",
          title: "Save your project",
          sequence: 3,
          component_key: "ProjectCreationForm",
          description: "You've found it. The opportunity that passes the test. Save it as your project. This is your starting point. Everything from here on is about making this real. Congratulations—you've taken the hardest step.",
          execution_environment: null,
          checkback_delay_days: null,
          observation_config: null,
          ai_config: {
            recommendations: [
              { 
                title: "What to Do After You Pick Your Business Idea", 
                type: "blog", 
                path_or_url: "content/blog/after-picking-idea.md" 
              },
              { 
                title: "Your First 30 Days as a Founder", 
                type: "blog", 
                path_or_url: "content/blog/first-30-days.md" 
              }
            ]
          }
        }
      ]
    }
  }
};