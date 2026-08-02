## Mission 2: Discovery (Complete Blueprint)

**Title:** Discovery
**ID:** "mission-2"
**Big Question:** "What problem should I solve?"
**Estimated Time:** 21 days
**Context:** ["user_profile", "mission1_data"]
**Success Message:** "You've completed Mission 2: Discovery. You've mined your own frustrations, observed the people around you, researched the wider world, and picked the best opportunity to pursue. You're no longer searching—you have a direction. Mission 3 awaits."

---

### Rationale for Mission 2

The goal of this mission is to transition users from "I want to start a business" to "I have a specific problem I want to solve." This is the most critical phase—most founders fail here because they fall in love with their solution instead of the problem.

**The Flow:**

1. **Mine Yourself** (Internal) → What frustrates you? What skills do you have?
2. **Observe Others** (Relational) → What problems do people around you have?
3. **Broader Search** (External) → What problems exist in the wider world?
4. **Pick the Best** (Decision) → Score, rank, and commit to one opportunity

This progression moves from the most accessible (your own pain) to the broadest (market trends), ensuring users have a diverse set of opportunities to evaluate.

---

### QUEST 1: Mine Yourself

**ID:** "mission2_quest1"
**Title:** "Mine Yourself"
**Objective:** Uncover problems from your own frustrations and skills.
**Estimated Time:** In-app: 45 mins | Off-app: 90 mins
**Context:** ["user_profile"]
**Success:** grant_points: 60, badge_key: "SELF_AWARE"

**Notes:**
- `{ type: "guide", title: "Start with yourself", content: "The best problems to solve are the ones you understand deeply. Your frustrations are a goldmine." }`
- `{ type: "nudge", title: "Don't overthink", content: "List everything that annoys you—big or small. We'll filter later." }`
- `{ type: "warning", title: "This is not about solutions", content: "Don't try to solve anything yet. Just observe and document the problems." }`

**Challenges:**
- `{ title: "The Frustration Log", description: "For one week, write down every frustration you encounter. Big or small. At work, at home, in public. Just observe.", link: "/resources/challenges/frustration-log" }`

**Success Message:** "You've completed Quest 1: Mine Yourself. You've identified problems from your own life and skills. You're building a foundation for your business."

---

#### Task 1: Observe What Frustrates You

**Title:** "Spot Your Frustrations"
**ID:** "mission2_quest1_task1"
**Sequence:** 1
**Execution Type:** observation_form
**Estimated Minutes:** 20
**Component Key:** "FrustrationObservationForm"
**Briefing:** "Your own frustrations are the most accessible problems to solve. What annoys you? What wastes your time? What feels broken? List them all—big and small."

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/your-pain-is-a-goldmine", title: "Your Pain Is a Goldmine" }`
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-spot-frustrations", title: "How to Spot Frustrations in Your Daily Life" }`

**Reflection Prompt:** "Look at your frustrations. Which one feels the most urgent? Which one do you wish someone would solve?"

**On Success:** `{ grant_points: 20, badge_key: "FRUSTRATION_SPOTTER" }`

**Dependencies:** `[]`

**Storage Details:**
- **Table:** `user_observations`
- **Schema:** `UserObservationSchema`
- **program_item_type:** "task"
- **program_item_id:** "mission2_quest1_task1"
- **observation_reference:** `{ reference_table: "user_opportunities", category: "personal_problems" }`
- **Note:** Users can add multiple observations

**Form Details:**
```ts
title: {
  type: "input",
  label: "What frustrates you?",
  placeholder: "e.g., I waste 2 hours every morning sorting through emails",
  required: true
},
content: {
  type: "textarea",
  label: "Describe the frustration in detail",
  placeholder: "What's happening? Why does it bother you? Who else might experience this?",
  required: true
},
tags: {
  type: "input",
  label: "Add tags to help organize (comma separated)",
  placeholder: "e.g., productivity, work-from-home, email",
  optional: true
}
```

---

#### Task 2: Your Problems as Opportunities

**Title:** "Turn Frustrations Into Opportunities"
**ID:** "mission2_quest1_task2"
**Sequence:** 2
**Execution Type:** standard-form
**Estimated Minutes:** 25
**Component Key:** "OpportunityFromFrustrationForm"
**Briefing:** "Now let's reframe your frustrations as business opportunities. A frustration is just an unsolved problem. An unsolved problem is an opportunity."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-turn-problems-into-opportunities", title: "How to Turn Problems Into Opportunities" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/why-frustrations-make-the-best-businesses", title: "Why Frustrations Make the Best Businesses" }`

**Reflection Prompt:** "Which of your frustrations could someone pay to have solved? Why?"

**On Success:** `{ grant_points: 20, badge_key: "PROBLEM_REFORMER" }`

**Dependencies:** `["mission2_quest1_task1"]`

**Storage Details:**
- **Table:** `user_opportunities`
- **Schema:** `UserOpportunities`
- **source_type:** "personal_problems"

**Form Details:**
```ts
title: {
  type: "input",
  label: "What's the opportunity?",
  placeholder: "e.g., A tool that automatically organizes emails by priority",
  required: true
},
description: {
  type: "textarea",
  label: "Describe the opportunity",
  placeholder: "What problem does this solve? Who has this problem? Why would they pay for it?",
  required: true
}
```

---

#### Task 3: Skill Observation

**Title:** "Audit Your Skills"
**ID:** "mission2_quest1_task3"
**Sequence:** 3
**Execution Type:** observation_form
**Estimated Minutes:** 20
**Component Key:** "SkillObservationForm"
**Briefing:** "Your skills are assets. What are you good at? What do people ask you for help with? What comes naturally to you? These are potential business opportunities."

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/skills-are-assets", title: "Your Skills Are Your Assets" }`
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-identify-your-valuable-skills", title: "How to Identify Your Most Valuable Skills" }`

**Reflection Prompt:** "Which of your skills could help someone solve a problem? Who needs this skill?"

**On Success:** `{ grant_points: 20, badge_key: "SKILL_AUDITOR" }`

**Dependencies:** `[]`

**Storage Details:**
- **Table:** `user_observations`
- **Schema:** `UserObservationSchema`
- **program_item_type:** "task"
- **program_item_id:** "mission2_quest1_task3"
- **observation_reference:** `{ reference_table: "user_opportunities", category: "skills" }`
- **Note:** Users can add multiple observations

**Form Details:**
```ts
title: {
  type: "input",
  label: "What skill do you have?",
  placeholder: "e.g., Graphic Design, Copywriting, Financial Analysis",
  required: true
},
content: {
  type: "textarea",
  label: "Describe your skill and experience",
  placeholder: "What can you do? How have you used this skill? What's your level of expertise?",
  required: true
},
tags: {
  type: "input",
  label: "Add tags (comma separated)",
  placeholder: "e.g., design, creative, freelance",
  optional: true
}
```

---

#### Task 4: Add Skills as Opportunities

**Title:** "Skills as a Business"
**ID:** "mission2_quest1_task4"
**Sequence:** 4
**Execution Type:** standard-form
**Estimated Minutes:** 25
**Component Key:** "SkillsOpportunityForm"
**Briefing:** "Your skills can be a business. What's a problem you could solve using your skills? Who would pay for that?"

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-turn-skills-into-a-business", title: "How to Turn Your Skills Into a Business" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/what-skills-people-pay-for", title: "What Skills Are People Willing to Pay For" }`

**Reflection Prompt:** "How could you package your skills as a service or product? What would be the simplest version?"

**On Success:** `{ grant_points: 20, badge_key: "SKILL_ENTREPRENEUR" }`

**Dependencies:** `["mission2_quest1_task3"]`

**Storage Details:**
- **Table:** `user_opportunities`
- **Schema:** `UserOpportunities`
- **source_type:** "skills"

**Form Details:**
```ts
title: {
  type: "input",
  label: "What's the business opportunity?",
  placeholder: "e.g., A social media management service for small businesses",
  required: true
},
description: {
  type: "textarea",
  label: "Describe the opportunity",
  placeholder: "What problem does this solve? Who needs this? Why would they pay you for it?",
  required: true
}
```

---

### QUEST 2: Observe People Around You

**ID:** "mission2_quest2"
**Title:** "People Watching"
**Objective:** Identify problems in your immediate circle—friends, family, colleagues.
**Estimated Time:** In-app: 30 mins | Off-app: 120 mins
**Context:** ["user_profile"]
**Success:** grant_points: 50, badge_key: "OBSERVER"

**Notes:**
- `{ type: "guide", title: "You are a detective", content: "Look at the people around you. What problems do they have? What do they complain about?" }`
- `{ type: "nudge", title: "Listen more than you talk", content: "The best insights come from listening—not to answers, but to frustrations." }`
- `{ type: "warning", title: "Don't start with solutions", content: "Just observe. Don't try to fix anything. You're gathering data." }`

**Challenges:**
- `{ title: "The 5 Conversations Challenge", description: "Have 5 conversations this week where you ask people about their biggest frustrations—and just listen.", link: "/resources/challenges/5-conversations" }`

**Success Message:** "You've completed Quest 2: People Watching. You've observed problems in your immediate circle. These people are your first potential customers."

---

#### Task 1: You Are a Detective

**Title:** "Be a Detective"
**ID:** "mission2_quest2_task1"
**Sequence:** 1
**Execution Type:** observation_form
**Estimated Minutes:** 25
**Component Key:** "DetectiveObservationForm"
**Briefing:** "Put on your detective hat. Look at the people around you—friends, family, colleagues, neighbors. What problems do they have? What frustrates them? What do they complain about?"

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-observe-problems-in-others", title: "How to Observe Problems in Others" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/people-are-the-best-problem-sources", title: "People Are the Best Problem Sources" }`

**Reflection Prompt:** "Look at your observations. Which problem feels the most urgent? Which one do you think you could help solve?"

**On Success:** `{ grant_points: 25, badge_key: "DETECTIVE" }`

**Dependencies:** `[]`

**Storage Details:**
- **Table:** `user_observations`
- **Schema:** `UserObservationSchema`
- **program_item_type:** "task"
- **program_item_id:** "mission2_quest2_task1"
- **observation_reference:** `{ reference_table: "user_opportunities", category: "zone_of_influence" }`
- **Note:** Users can add multiple observations

**Form Details:**
```ts
title: {
  type: "input",
  label: "What problem did you observe?",
  placeholder: "e.g., My friend spends 3 hours a week scheduling social media posts",
  required: true
},
content: {
  type: "textarea",
  label: "Describe the problem in detail",
  placeholder: "Who has this problem? When does it happen? Why does it frustrate them?",
  required: true
},
tags: {
  type: "input",
  label: "Add tags (comma separated)",
  placeholder: "e.g., friend, social-media, time-management",
  optional: true
}
```

---

#### Task 2: People's Problems as Opportunities

**Title:** "Spot the Opportunity"
**ID:** "mission2_quest2_task2"
**Sequence:** 2
**Execution Type:** standard-form
**Estimated Minutes:** 20
**Component Key:** "PeopleOpportunityForm"
**Briefing:** "Now turn your observations into opportunities. For each problem you observed, what could be a solution? Who would pay for it?"

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/observing-problems-around-you", title: "Observing Problems Around You" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/opportunities-are-all-around-you", title: "Opportunities Are All Around You" }`

**Reflection Prompt:** "Which of these problems could be the foundation of a business? Why?"

**On Success:** `{ grant_points: 25, badge_key: "OPPORTUNITY_SPOTTER" }`

**Dependencies:** `["mission2_quest2_task1"]`

**Storage Details:**
- **Table:** `user_opportunities`
- **Schema:** `UserOpportunities`
- **source_type:** "zone_of_influence"

**Form Details:**
```ts
title: {
  type: "input",
  label: "What's the opportunity?",
  placeholder: "e.g., A social media scheduling tool for busy professionals",
  required: true
},
description: {
  type: "textarea",
  label: "Describe the opportunity",
  placeholder: "What problem does this solve? Who has this problem? Why would they pay for it?",
  required: true
}
```

---

### QUEST 3: Broader Search

**ID:** "mission2_quest3"
**Title:** "The Wider World"
**Objective:** Discover problems beyond your immediate circle—online communities, trends, and marketplaces.
**Estimated Time:** In-app: 45 mins | Off-app: 180 mins
**Context:** ["user_profile"]
**Success:** grant_points: 50, badge_key: "WORLD_READY"

**Notes:**
- `{ type: "guide", title: "Think bigger", content: "Your immediate circle is just the beginning. The world is full of problems waiting to be solved." }`
- `{ type: "nudge", title: "Explore new spaces", content: "Visit forums, read comments, check trends. Problems are everywhere." }`
- `{ type: "warning", title: "Don't get overwhelmed", content: "You're exploring. Not committing. Gather as many problems as you can—you'll filter later." }`

**Challenges:**
- `{ title: "The Deep Dive", description: "Spend 2 hours diving deep into a community or industry you know nothing about. What problems do they discuss?", link: "/resources/challenges/the-deep-dive" }`

**Success Message:** "You've completed Quest 3: The Wider World. You've discovered problems beyond your immediate circle. Your opportunity set is now diverse."

---

#### Task 1: Discover Problems Through Online Communities

**Title:** "Search the Communities"
**ID:** "mission2_quest3_task1"
**Sequence:** 1
**Execution Type:** standard-form
**Estimated Minutes:** 30
**Component Key:** "CommunityProblemForm"
**Briefing:** "Online communities are goldmines. Reddit, Facebook Groups, LinkedIn communities, Quora—people are actively discussing their problems. Go find them."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-find-problems-in-online-communities", title: "How to Find Problems in Online Communities" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/problem-spotting-techniques", title: "Problem-Spotting Techniques for Founders" }`

**Reflection Prompt:** "What's the most common problem you're seeing in these communities? Why do you think it's common?"

**On Success:** `{ grant_points: 20, badge_key: "COMMUNITY_EXPLORER" }`

**Dependencies:** `[]`

**Storage Details:**
- **Table:** `user_opportunities`
- **Schema:** `UserOpportunities`
- **source_type:** "broader_search"

**Form Details:**
```ts
title: {
  type: "input",
  label: "What's the opportunity?",
  placeholder: "e.g., A tool that helps indie game developers market their games",
  required: true
},
description: {
  type: "textarea",
  label: "Describe the opportunity",
  placeholder: "What problem does this solve? Which community has this problem? Why would they pay for it?",
  required: true
},
tags: {
  type: "input",
  label: "Add tags (comma separated)",
  placeholder: "e.g., gaming, marketing, indie",
  optional: true
}
```

---

#### Task 2: Discover Problems Through Trends

**Title:** "Ride the Trends"
**ID:** "mission2_quest3_task2"
**Sequence:** 2
**Execution Type:** standard-form
**Estimated Minutes:** 30
**Component Key:** "TrendProblemForm"
**Briefing:** "Trends are signals. What's changing? What's new? What's growing? These changes create new problems—and new opportunities."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-spot-problems-in-trends", title: "How to Spot Problems in Trends" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/trends-are-trouble", title: "Trends Are Trouble (And That's Good)" }`

**Reflection Prompt:** "What trend is creating new problems? Who is being affected by these changes?"

**On Success:** `{ grant_points: 20, badge_key: "TREND_SPOTTER" }`

**Dependencies:** `[]`

**Storage Details:**
- **Table:** `user_opportunities`
- **Schema:** `UserOpportunities`
- **source_type:** "broader_search"

**Form Details:**
```ts
title: {
  type: "input",
  label: "What's the opportunity?",
  placeholder: "e.g., A service that helps older adults learn AI tools",
  required: true
},
description: {
  type: "textarea",
  label: "Describe the opportunity",
  placeholder: "What problem does this solve? What trend creates this problem? Why would they pay for it?",
  required: true
},
tags: {
  type: "input",
  label: "Add tags (comma separated)",
  placeholder: "e.g., AI, aging, education",
  optional: true
}
```

---

#### Task 3: Discover Problems Through Marketplaces

**Title:** "The Marketplace Scanner"
**ID:** "mission2_quest3_task3"
**Sequence:** 3
**Execution Type:** standard-form
**Estimated Minutes:** 30
**Component Key:** "MarketplaceProblemForm"
**Briefing:** "Marketplaces tell you what people are already paying for. They reveal gaps, complaints, and underserved needs. Go scan Etsy, Fiverr, Upwork, Amazon—what problems are being solved? What's missing?"

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-spot-opportunities-in-marketplaces", title: "How to Spot Opportunities in Marketplaces" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/marketplace-love-notes", title: "Marketplace Love Notes and Breakup Letters" }`

**Reflection Prompt:** "What's a problem that people are trying to solve but no one is solving well? Where's the gap?"

**On Success:** `{ grant_points: 20, badge_key: "MARKETPLACE_SCANNER" }`

**Dependencies:** `[]`

**Storage Details:**
- **Table:** `user_opportunities`
- **Schema:** `UserOpportunities`
- **source_type:** "broader_search"

**Form Details:**
```ts
title: {
  type: "input",
  label: "What's the opportunity?",
  placeholder: "e.g., A premium coaching service for small business owners on Fiverr",
  required: true
},
description: {
  type: "textarea",
  label: "Describe the opportunity",
  placeholder: "What problem does this solve? What's the gap in the marketplace? Why would they pay for it?",
  required: true
},
tags: {
  type: "input",
  label: "Add tags (comma separated)",
  placeholder: "e.g., coaching, small-business, premium",
  optional: true
}
```

---

### QUEST 4: Pick the Best Opportunity

**ID:** "mission2_quest4"
**Title:** "The Decision"
**Objective:** Score, rank, and commit to one opportunity.
**Estimated Time:** In-app: 45 mins | Off-app: 30 mins
**Context:** ["user_profile", "user_opportunities"]
**Success:** grant_points: 60, badge_key: "DECISION_MAKER"

**Notes:**
- `{ type: "guide", title: "This is the hard part", content: "You've gathered opportunities. Now you must choose. Don't fall in love—evaluate objectively." }`
- `{ type: "guide", title: "Perfect is the enemy of started", content: "No opportunity is perfect. Choose the one that's good enough to start." }`
- `{ type: "nudge", title: "Trust your gut", content: "The data matters. But so does your instinct. Don't ignore it." }`

**Success Message:** "You've completed Quest 4: The Decision. You've evaluated your opportunities, picked the best one, and committed to a direction. You're no longer searching—you're building. Mission 3 awaits."

---

#### Task 1: Scoring and Assessment

**Title:** "Score Your Opportunities"
**ID:** "mission2_quest4_task1"
**Sequence:** 1
**Execution Type:** standard-form
**Estimated Minutes:** 30
**Component Key:** "OpportunityScoringForm"
**Briefing:** "Now it's time to evaluate your opportunities. For each one, score it against 5 criteria. This isn't about finding the 'perfect' opportunity—it's about finding the one that's best for you, right now."

**Scoring Criteria:**
Each criterion is scored 1-5 (1 = Low, 5 = High)

1. **Passion:** How excited are you about this problem?
2. **Urgency:** How badly do people need this solved?
3. **Workaround Spend:** How much are people already spending to solve this?
4. **Unfair Advantage:** Do you have a unique edge?
5. **MSP Feasibility:** Can you build a Minimum Sellable Product quickly?

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-score-business-opportunities", title: "How to Score Business Opportunities" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/the-ideal-opportunity-profile", title: "The Ideal Opportunity Profile" }`

**Reflection Prompt:** "Look at your highest-scoring opportunity. Why did it score so high? What makes it the most promising?"

**On Success:** `{ grant_points: 30, badge_key: "SCORER" }`

**Dependencies:** `[]`

**Storage Details:**
- **Table:** `user_opportunities`
- **Schema:** `UserOpportunities`
- **Column:** `assessment` (JSON with OpportunityAssessment schema)

**Form Details:**
```ts
// Shown for each opportunity as a dialog/overlay
opportunity_id: {
  type: "hidden",
  value: "dynamic"
},
criteria: {
  passion: {
    type: "number",
    label: "Passion: How excited are you?",
    hint: "Do you wake up thinking about this problem?",
    min: 1,
    max: 5
  },
  urgency: {
    type: "number",
    label: "Urgency: How badly do people need this?",
    hint: "Are people actively searching for a solution?",
    min: 1,
    max: 5
  },
  workaround_spend: {
    type: "number",
    label: "Workaround Spend: Are people already paying?",
    hint: "Do people spend time or money on workarounds?",
    min: 1,
    max: 5
  },
  unfair_advantage: {
    type: "number",
    label: "Unfair Advantage: What's your edge?",
    hint: "Do you have unique skills, access, or insights?",
    min: 1,
    max: 5
  },
  msp_feasibility: {
    type: "number",
    label: "MSP Feasibility: Can you start quickly?",
    hint: "Can you build a Minimum Sellable Product fast?",
    min: 1,
    max: 5
  }
},
notes: {
  type: "textarea",
  label: "Notes on scoring",
  placeholder: "Why did you give these scores? Any thoughts to remember?",
  optional: true
}
```

---

#### Task 2: Rank and Pick One

**Title:** "Pick Your Opportunity"
**ID:** "mission2_quest4_task2"
**Sequence:** 2
**Execution Type:** standard-form
**Estimated Minutes:** 15
**Component Key:** "OpportunityPickerForm"
**Briefing:** "You've scored all your opportunities. Now it's time to pick one. Don't overthink—choose the one that feels right based on the scores and your gut."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-commit-to-an-idea", title: "How to Commit to an Idea" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/analysis-paralysis-kills-ideas", title: "Analysis Paralysis Kills Ideas" }`

**Reflection Prompt:** "Why did you pick this opportunity? What made it stand out from the others?"

**On Success:** `{ grant_points: 15, badge_key: "OPPORTUNITY_PICKER" }`

**Dependencies:** `["mission2_quest4_task1"]`

**Storage Details:**
- **Table:** `user_opportunities`
- **Column:** `status` updated to "selected"

**Form Details:**
```ts
selected_opportunity_id: {
  type: "select",
  label: "Which opportunity will you pursue?",
  hint: "This will create your first project",
  options: "dynamic from user_opportunities" // Show all opportunities with their scores
},
justification: {
  type: "textarea",
  label: "Why did you pick this one?",
  placeholder: "What made this opportunity stand out? Why is it the right one for you?",
  required: true
}
```

---

#### Task 3: Decision Gate

**Title:** "Make It Official"
**ID:** "mission2_quest4_task3"
**Sequence:** 3
**Execution Type:** standard-form
**Estimated Minutes:** 10
**Component Key:** "DecisionGateForm"
**Briefing:** "This is it. You're either committing to this opportunity or going back to discover more. There's no wrong choice—but there is a choice."

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/commitment-is-the-first-step", title: "Commitment Is the First Step" }`

**Reflection Prompt:** "What's your biggest hesitation about this opportunity? Address it now."

**On Success:** `{ grant_points: 15, badge_key: "COMMITTED" }`

**Dependencies:** `["mission2_quest4_task2"]`

**Storage Details:**
- **Table:** `projects` (new project created if option 1 is chosen)
- **Action:** If "finalize" is chosen, create a new project in `projects` table

**Form Details:**
```ts
decision: {
  type: "radio",
  label: "What do you want to do?",
  options: [
    { value: "finalize", label: "Finalize this opportunity and start Mission 3" },
    { value: "discover_more", label: "Go back and discover more opportunities" }
  ],
  required: true
},
// If "finalize" is selected:
project_name: {
  type: "input",
  label: "Name your project",
  placeholder: "e.g., Acme Corp",
  conditional: "decision == 'finalize'",
  required: true
},
project_description: {
  type: "textarea",
  label: "Describe your project",
  placeholder: "What will you build? Who will it serve?",
  conditional: "decision == 'finalize'",
  required: true
},
// If "discover_more" is selected:
discover_notes: {
  type: "textarea",
  label: "What would you like to explore further?",
  placeholder: "What areas need more research? What's missing?",
  conditional: "decision == 'discover_more'",
  optional: true
}
```

---

### COMPLETE BADGE LIST FOR MISSION 2

| Badge Key | Name | Earned In |
|-----------|------|-----------|
| SELF_AWARE | Self Aware | Quest 1 (All tasks) |
| FRUSTRATION_SPOTTER | Frustration Spotter | Task 1.1 |
| PROBLEM_REFORMER | Problem Reformer | Task 1.2 |
| SKILL_AUDITOR | Skill Auditor | Task 1.3 |
| SKILL_ENTREPRENEUR | Skill Entrepreneur | Task 1.4 |
| OBSERVER | Observer | Quest 2 (All tasks) |
| DETECTIVE | Detective | Task 2.1 |
| OPPORTUNITY_SPOTTER | Opportunity Spotter | Task 2.2 |
| WORLD_READY | World Ready | Quest 3 (All tasks) |
| COMMUNITY_EXPLORER | Community Explorer | Task 3.1 |
| TREND_SPOTTER | Trend Spotter | Task 3.2 |
| MARKETPLACE_SCANNER | Marketplace Scanner | Task 3.3 |
| DECISION_MAKER | Decision Maker | Quest 4 (All tasks) |
| SCORER | Scorer | Task 4.1 |
| OPPORTUNITY_PICKER | Opportunity Picker | Task 4.2 |
| COMMITTED | Committed | Task 4.3 |

---

### SUMMARY OF REFERENCES NEEDED

**Internal Resources to Create:**

**Insights:**
1. `/resources/insights/your-pain-is-a-goldmine`
2. `/resources/insights/why-frustrations-make-the-best-businesses`
3. `/resources/insights/skills-are-assets`
4. `/resources/insights/what-skills-people-pay-for`
5. `/resources/insights/people-are-the-best-problem-sources`
6. `/resources/insights/opportunities-are-all-around-you`
7. `/resources/insights/problem-spotting-techniques`
8. `/resources/insights/trends-are-trouble`
9. `/resources/insights/marketplace-love-notes`
10. `/resources/insights/the-ideal-opportunity-profile`
11. `/resources/insights/analysis-paralysis-kills-ideas`
12. `/resources/insights/commitment-is-the-first-step`

**Guides:**
1. `/resources/guides/how-to-spot-frustrations`
2. `/resources/guides/how-to-turn-problems-into-opportunities`
3. `/resources/guides/how-to-identify-your-valuable-skills`
4. `/resources/guides/how-to-turn-skills-into-a-business`
5. `/resources/guides/how-to-observe-problems-in-others`
6. `/resources/guides/observing-problems-around-you`
7. `/resources/guides/how-to-find-problems-in-online-communities`
8. `/resources/guides/how-to-spot-problems-in-trends`
9. `/resources/guides/how-to-spot-opportunities-in-marketplaces`
10. `/resources/guides/how-to-score-business-opportunities`
11. `/resources/guides/how-to-commit-to-an-idea`

**Challenges:**
1. `/resources/challenges/frustration-log`
2. `/resources/challenges/5-conversations`
3. `/resources/challenges/the-deep-dive`

