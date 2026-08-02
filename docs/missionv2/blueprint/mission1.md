Absolutely! Let me update the `mission1.md` blueprint to reflect our latest decisions - the log_counter tasks with 2 asks, 2 rejections, and 1 bold ask. I'll keep the markdown clean and aligned with our types.

```markdown
## Revised Mission 1: Beg. Borrow. Steel. (FINAL BLUEPRINT)

---

### MISSION OVERVIEW

**Title:** Beg. Borrow. Steel.

**ID:** "mission-1"

**Big Question:** "Am I ready to start?"

**Estimated Time:** 14 days

**Success Message:** "You've completed Mission 1: Beg. Borrow. Steel. You defined your 'why,' made a real commitment, mapped your hidden resources, built your support squad, and faced rejection head-on. You're no longer in the 'thinking' phase—you're in the 'doing' phase. The foundation is laid. You are ready for Mission 2."

**Context:** ["user_profile"]

**Video URL:** "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm"

---

### QUEST 1: The New Beginning

**ID:** "mission1_quest1"  
**Title:** "The New Beginning"  
**Objective:** Define your "why," make a commitment, and surface your fears.  
**Estimated Time:** In-app: 30 mins | Off-app: 60 mins  
**Context:** ["user_profile"]  
**Success:** grant_points: 50, badge_key: "PATHFINDER"

**Notes:**
- `{ type: "guide", title: "Honesty is your compass", content: "Resist the urge to edit yourself. These answers are for you, not a potential investor. The strongest businesses are built on personal truth." }`
- `{ type: "nudge", title: "This might feel uncomfortable", content: "That's the point. Comfort is where dreams go to die. You're here to build something real." }`

**Challenges:**
- `{ title: "The 5-Minute Timer", description: "Set a timer for 5 minutes. Write non-stop about why you're starting. Don't edit. Don't judge. Just write.", link: "/resources/challenges/the-5-minute-timer" }`

**Success Message:** "You've completed Quest 1: The New Beginning. You know your 'why,' you've made a commitment, and you've faced your fears. That's more than most people ever do. On to the next quest."

---

#### Task 1: Why Start?

**Title:** "Why Start?"  
**ID:** "mission1_quest1_task1"  
**Sequence:** 1  
**Execution Type:** standard-form  
**Estimated Minutes:** 15  
**Component Key:** "MotivationForm"  
**Briefing:** "Let's be totally honest. Building a business takes serious energy, and vague goals fade the moment life gets busy. What is the actual change you want to make in your life?"

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/why-start-matters", title: "Why Your 'Why' Matters More Than Your Idea" }`
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/finding-your-north-star", title: "Finding Your North Star" }`
- `{ type: "youtube", isInternal: false, isRequired: false, url_link: "https://www.youtube.com/watch?v=example", title: "Simon Sinek: Start With Why" }`

**Reflection Prompt:** "Look at your 'why_statement.' Does it resonate with you on a gut level? If not, tweak it now. This will be your anchor."

**On Success:** `{ grant_points: 25, badge_key: "HONEST_SELF" }`

**Dependencies:** `[]`

**Form Details (ProfileMotivationSchema):**
```ts
push: {
  type: "select",
  label: "What are you running from?",
  hint: "Select the strongest forces pushing you away from your current reality.",
  options: [
    { value: "boss", label: "Tired of answering to a boss" },
    { value: "toxic", label: "Sick of a toxic work environment" },
    { value: "paycheck", label: "Living paycheck to paycheck" },
    { value: "dead_end", label: "Stuck in a dead-end career" },
    { value: "potential", label: "Terrified of wasting my potential" },
    { value: "autonomy", label: "Desperate for freedom and autonomy" },
    { value: "other", label: "Other (please specify)" }
  ]
},
push_other: {
  type: "input",
  label: "Please specify",
  placeholder: "What else is pushing you?",
  conditional: "push == 'other'"
},
pull: {
  type: "select",
  label: "What are you running toward?",
  hint: "Select the strongest visions pulling you into the future.",
  options: [
    { value: "wealth", label: "Build generational wealth" },
    { value: "meaning", label: "Create something deeply meaningful" },
    { value: "time", label: "Complete control over my time" },
    { value: "prove", label: "Prove to myself I can do it" },
    { value: "legacy", label: "Leave a legacy for my family" },
    { value: "community", label: "Build a team and serve a community" },
    { value: "other", label: "Other (please specify)" }
  ]
},
pull_other: {
  type: "input",
  label: "Please specify",
  placeholder: "What else are you running toward?",
  conditional: "pull == 'other'"
},
urgency: {
  type: "select",
  label: "Why now?",
  hint: "What happens if you wait 5 more years?",
  options: [
    { value: "financial_cliff", label: "Approaching a financial cliff" },
    { value: "life_change", label: "Major life change (marriage, kids, aging parents)" },
    { value: "deadline", label: "I set a strict personal deadline" },
    { value: "market", label: "The market opportunity is closing" },
    { value: "patience", label: "Simply out of patience — can't wait anymore" },
    { value: "age", label: "I'm young enough to take the risk now" },
    { value: "other", label: "Other (please specify)" }
  ]
},
urgency_other: {
  type: "input",
  label: "Please specify",
  placeholder: "Why else now?",
  conditional: "urgency == 'other'"
},
why_statement: {
  type: "textarea",
  label: "Sum it up in one sentence",
  hint: "This will be your anchor. You'll see this on your dashboard.",
  placeholder: "I'm starting because..."
}
```

---

#### Task 2: Commit to the Journey

**Title:** "Make It Real"  
**ID:** "mission1_quest1_task2"  
**Sequence:** 2  
**Execution Type:** standard-form  
**Estimated Minutes:** 10  
**Component Key:** "CommitmentForm"  
**Briefing:** "Big goals require clear constraints. Let's set realistic expectations for your time, money, and launch timeline. Be honest, not aspirational."

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/the-power-of-constraints", title: "The Power of Constraints" }`
- `{ type: "tools", isInternal: true, isRequired: false, url_link: "/resources/tools/time-audit-template", title: "Time Audit Template" }`

**Reflection Prompt:** "Look at your weekly hours. Is this a realistic, sustainable commitment for the next few months? If you can only do 2 hours a day, own that and build your plan around it."

**On Success:** `{ grant_points: 25, badge_key: "ACTION_COMMITMENT" }`

**Dependencies:** `[]`

**Form Details (ProfileCommitmentSchema):**
```ts
weekly_hours: {
  type: "number",
  label: "How many hours can you dedicate each week?",
  hint: "Be realistic. 5-10 hours is great. 20+ hours is a part-time job.",
  placeholder: "e.g., 8",
  min: 1,
  max: 80
},
capital: {
  type: "number",
  label: "How much capital do you have available to get started?",
  hint: "Include savings, credit you're willing to use, or funds from an early job. This is for getting the business started, not for a marketing blitz.",
  placeholder: "e.g., 1000",
  min: 0
},
time_to_launch: {
  type: "select",
  label: "What is your goal for launching a Minimum Sellable Product (MSP)?",
  hint: "This is your MVP, but a Minimum Sellable Product. Something simple you can start selling. Let's build to sell, not just to build.",
  options: [
    { value: 1, label: "In the next month" },
    { value: 3, label: "In the next 3 months" },
    { value: 6, label: "In the next 6 months" },
    { value: 12, label: "In the next year" }
  ]
}
```

---

#### Task 3: Roadblocks

**Title:** "What's Scaring You?"  
**ID:** "mission1_quest1_task3"  
**Sequence:** 3  
**Execution Type:** standard-form  
**Estimated Minutes:** 15  
**Component Key:** "RoadblockForm"  
**Briefing:** "Acknowledging your fears is a sign of strength, not weakness. Let's get them out in the open. This helps the program tailor its support for you."

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/fear-is-data", title: "Fear is Data" }`
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/overcoming-analysis-paralysis", title: "Overcoming Analysis Paralysis" }`

**Reflection Prompt:** "What's the scariest roadblock on this list? We can help you with that. Let's make a plan."

**On Success:** `{ grant_points: 25, badge_key: "ROADBLOCK_ACKNOWLEDGED" }`

**Dependencies:** `[]`

**Form Details (ProfileRoadblockSchema):**
```ts
roadblocks: {
  type: "multi-select",
  label: "What are your biggest concerns or fears right now?",
  options: [
    { value: "no_buyers", label: "Afraid no one will buy what I'm selling" },
    { value: "no_time", label: "I don't have enough time" },
    { value: "no_knowledge", label: "I don't know the first step" },
    { value: "public_failure", label: "Worried about failing publicly" },
    { value: "no_money", label: "I don't have the money to do this" },
    { value: "wrong_skills", label: "I don't have the right skills" },
    { value: "burnout", label: "I fear I'll burn out" }
  ]
},
roadblocks_other: {
  type: "input",
  label: "Any other concerns?",
  placeholder: "What else is holding you back?",
  optional: true
}
```

---

### QUEST 2: Your Resources

**ID:** "mission1_quest2"  
**Title:** "What You've Got"  
**Objective:** Inventory your network and skills. Realize you're not starting from zero.  
**Estimated Time:** In-app: 30 mins | Off-app: 60 mins  
**Context:** ["user_profile"]  
**Success:** grant_points: 50, badge_key: "RESOURCEFUL"

**Notes:**
- `{ type: "guide", title: "Your network is your net worth", content: "Your friends, family, former colleagues, and online networks are powerful assets. Let's map them." }`
- `{ type: "nudge", title: "Be generous with yourself", content: "Most people underestimate their skills. If you've done it, even once, it's a skill. List it." }`

**Challenges:**
- `{ title: "The Connection Challenge", description: "Find 5 people in your network you haven't talked to in over a year. Send them a message. Ask how they're doing.", link: "/resources/challenges/connection-challenge" }`

**Success Message:** "You've completed Quest 2: What You've Got. You've mapped your network and skills. You're not starting from zero—you have assets. Now let's put them to work."

---

#### Task 1: Your Connections

**Title:** "Map Your Network"  
**ID:** "mission1_quest2_task1"  
**Sequence:** 1  
**Execution Type:** standard-form  
**Estimated Minutes:** 15  
**Component Key:** "SocialFootprintForm"  
**Briefing:** "Who do you know? Your friends, family, former colleagues, and online networks are powerful assets. Let's map your 'social footprint' so you can see how to reach your first customers."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-network-without-being-creepy", title: "How to Network Without Being Creepy" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/your-network-is-your-first-sales-channel", title: "Your Network is Your First Sales Channel" }`

**Reflection Prompt:** "Who is the most valuable person in your network right now? Why? Consider reaching out to them casually this week."

**On Success:** `{ grant_points: 25, badge_key: "NETWORK_MAPPER" }`

**Dependencies:** `[]`

**Form Details (ProfileSocialFootprintSchema - array of objects):**
```ts
# Group 1: Online Platforms
platform_type: {
  type: "select",
  label: "What platform is your primary online presence?",
  options: [
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter/X" },
    { value: "instagram", label: "Instagram" },
    { value: "other", label: "Other" }
  ]
},
platform_name: {
  type: "input",
  label: "What is your profile name/URL?",
  placeholder: "@yourusername"
},
platform_link: {
  type: "input",
  label: "What is the link to your profile?",
  placeholder: "https://linkedin.com/in/yourname"
},
platform_connections: {
  type: "number",
  label: "How many followers or connections do you have?",
  hint: "This is a quick number to give a sense of scale.",
  placeholder: "e.g., 500",
  optional: true
},

# Group 2: Communities
community_type: {
  type: "select",
  label: "What type of community are you a part of?",
  options: [
    { value: "professional_association", label: "Professional Association" },
    { value: "meetup", label: "Meetup Group" },
    { value: "online_forum", label: "Online Forum (Reddit, Discord)" },
    { value: "alumni", label: "Alumni Network" },
    { value: "other", label: "Other" }
  ]
},
community_name: {
  type: "input",
  label: "What is the name of the community?",
  placeholder: "e.g., 'NYC Tech Meetup'"
},
community_link: {
  type: "input",
  label: "Link to the community or your profile within it",
  placeholder: "https://meetup.com/nyc-tech",
  optional: true
},
community_members: {
  type: "number",
  label: "How many active members are in this community?",
  placeholder: "e.g., 200",
  optional: true
},

# Group 3: Personal & Professional
network_type: {
  type: "select",
  label: "What's your most valuable professional network?",
  options: [
    { value: "former_colleagues", label: "Former Colleagues" },
    { value: "classmates", label: "Classmates" },
    { value: "industry_peers", label: "Industry Peers" },
    { value: "mentors", label: "Mentors" },
    { value: "other", label: "Other" }
  ]
},
network_name: {
  type: "input",
  label: "A short name for this group",
  placeholder: "e.g., 'Ex-Google Peeps'"
},
network_link: {
  type: "input",
  label: "Link to a relevant group or your profile",
  placeholder: "https://linkedin.com/company/google",
  optional: true
},
network_connections: {
  type: "number",
  label: "Approximately how many people is this?",
  placeholder: "e.g., 50",
  optional: true
}
```

---

#### Task 2: Your Skills

**Title:** "Skill Inventory"  
**ID:** "mission1_quest2_task2"  
**Sequence:** 2  
**Execution Type:** standard-form  
**Estimated Minutes:** 15  
**Component Key:** "SkillsForm"  
**Briefing:** "Business is mostly about problem-solving. What are you good at? List your skills and expertise."

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/skills-are-assets", title: "Your Skills Are Your Assets" }`
- `{ type: "tools", isInternal: true, isRequired: false, url_link: "/resources/tools/skill-assessment-template", title: "Skill Assessment Template" }`

**Reflection Prompt:** "List your top 3 to 5 skills. How could these skills help a potential customer solve their problem?"

**On Success:** `{ grant_points: 25, badge_key: "SKILL_AUDITOR" }`

**Dependencies:** `[]`

**Form Details (ProfileSkills - array of objects):**
```ts
skill_category: {
  type: "select",
  label: "What category does this skill fall into?",
  options: [
    { value: "creative", label: "Creative (Design, Writing)" },
    { value: "technical", label: "Technical (Coding, Data, Engineering)" },
    { value: "business", label: "Business (Sales, Finance, Marketing)" },
    { value: "interpersonal", label: "Interpersonal (Communication, Leadership)" },
    { value: "craft", label: "Craft (Cooking, Woodworking, etc.)" },
    { value: "other", label: "Other" }
  ]
},
skill_title: {
  type: "input",
  label: "What is your skill?",
  placeholder: "e.g., Project Management, UX Design, Financial Modeling"
},
skill_level: {
  type: "select",
  label: "How would you rate your proficiency?",
  options: [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" }
  ]
}
```

---

### QUEST 3: Ask and You Shall Receive

**ID:** "mission1_quest3"  
**Title:** "Start Asking"  
**Objective:** Build the habit of asking—starting with safe asks and building up.  
**Estimated Time:** In-app: 30 mins | Off-app: 120 mins  
**Context:** ["user_profile"]  
**Success:** grant_points: 60, badge_key: "ASKER"

**Notes:**
- `{ type: "guide", title: "Start safe, then stretch", content: "We're going to start with people who already care about you—your squad. Then we'll stretch to people who don't know you yet." }`
- `{ type: "warning", title: "This will feel uncomfortable", content: "That's the point. Asking is a skill, and like any skill, it gets easier with practice. The worst they can say is no." }`
- `{ type: "guide", title: "You're offering something", content: "Remember, you're not asking for a favor. You're offering a chance to be part of your journey. People love to help." }`

**Challenges:**
- `{ title: "The 3-Ask Challenge", description: "Make 3 asks this week. At least 1 should be to someone you don't know well. Track what happens.", link: "/resources/challenges/the-3-ask-challenge" }`

**Success Message:** "You've completed Quest 3: Start Asking. You've built your squad, introduced yourself to the community, and asked for a discount. You're now officially an 'asker.' The fear of asking is fading. Next up: chasing rejection."

---

#### Task 1: Ask for Support (Cheer Squad)

**Title:** "Build Your Squad"  
**ID:** "mission1_quest3_task1"  
**Sequence:** 1  
**Execution Type:** off-task-action  
**Estimated Minutes:** 30 (for the action)  
**Component Key:** "CheerSquadForm"  
**Briefing:** "Your success hinges on a support system. Send a short message to 3-5 people (friends, family, colleagues) and tell them you're starting a business and ask if they'd be part of your 'cheer squad' to follow your progress and hold you accountable. Use the template below—just customize it."

**Script Template:**
```
Hey [Name],

I'm starting a business and I need people in my corner. 
Would you be willing to be part of my "cheer squad"? 
I'll share my weekly progress with you. All you need to do is check in and hold me accountable. No heavy lifting—just your support.

Would you be up for that?
```

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/your-cheer-squad-matters", title: "Why Your Cheer Squad Matters" }`
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-build-your-support-system", title: "How to Build Your Support System" }`
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-ask-for-anything", title: "How to Ask for Anything" }`

**Reflection Prompt:** "Who did you ask? What was their reaction? Having a support network is your secret weapon."

**On Success:** `{ grant_points: 35, badge_key: "SQUAD_ASSEMBLED" }`

**Dependencies:** `[]`

**Checkback Delay:** 2 days

**Form Details (UserContact with category: "squad"):**
```ts
first_name: {
  type: "input",
  label: "First Name",
  placeholder: "Sarah"
},
last_name: {
  type: "input",
  label: "Last Name",
  placeholder: "Johnson",
  optional: true
},
email: {
  type: "input",
  label: "Email Address",
  placeholder: "sarah@email.com"
},
phone: {
  type: "input",
  label: "Phone Number",
  placeholder: "+1 234 567 890",
  optional: true
},
notes: {
  type: "textarea",
  label: "What did you ask them for specifically?",
  placeholder: "I asked Sarah to check in on my progress every week and give me honest feedback."
}
```

---

#### Task 2: Introduce Yourself to the Community

**Title:** "Say Hello"  
**ID:** "mission1_quest3_task2"  
**Sequence:** 2  
**Execution Type:** standard-form  
**Estimated Minutes:** 15  
**Component Key:** "CommunityIntroForm"  
**Briefing:** "The Urge community is your tribe. Your first step is to introduce yourself. Share your 'why_statement' and what you're hoping to build."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-introduce-yourself-online", title: "How to Introduce Yourself Online" }`

**Reflection Prompt:** "What is one thing you're most excited to learn from the community?"

**On Success:** `{ grant_points: 25, badge_key: "COMMUNITY_MEMBER" }`

**Dependencies:** `["mission1_quest1_task1"]`

**Form Details:**
```ts
post_title: {
  type: "input",
  label: "A short title for your intro post",
  placeholder: "Hi, I'm [Name] and I'm building..."
},
post_content: {
  type: "textarea",
  label: "Tell the community about yourself",
  hint: "Share your 'why_statement' and what you're working on. Ask a question to get the conversation started!",
  placeholder: "I'm starting because... I'd love to hear from anyone who..."
}
```

---

#### Task 3: Ask for a Discount

**Title:** "Ask for Something"  
**ID:** "mission1_quest3_task3"  
**Sequence:** 3  
**Execution Type:** log_counter  
**Estimated Minutes:** 30 (for the action)  
**Component Key:** "DiscountAskLogger"  
**Briefing:** "Now you're warmed up. Let's make a bigger ask. Find a service, tool, or product you use (or want to use) for your business and ask for a discount or a better deal. This could be a software subscription, a freelance service, or even a coffee shop. Practice asking without hesitation."

**💡 Ideas for asking:**
- Your favorite software subscription (ask for a student/startup discount)
- A local coffee shop (ask for a bulk discount if you buy weekly)
- A service you use (ask for a referral discount if you bring them a client)
- Your internet/cell phone provider (ask for a loyalty discount)

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-ask-for-a-discount", title: "How to Ask for a Discount" }`

**Reflection Prompt:** "How did it feel? What was the response? You've just proven you can ask for something. Now, think about how much easier this will feel next time."

**On Success:** `{ grant_points: 30, badge_key: "FIRST_ASK" }`

**Dependencies:** `["mission1_quest3_task1"]`

**Checkback Delay:** 1 day

**target_count:** 1

**Form Details (log each ask):**
```ts
contact_name: {
  type: "input",
  label: "Who did you ask?",
  placeholder: "e.g., Sarah from the coffee shop"
},
result: {
  type: "select",
  label: "What was the result?",
  options: [
    { value: "yes", label: "Yes, I got the discount!" },
    { value: "no", label: "No, they said no." },
    { value: "waiting", label: "Not yet, still waiting." }
  ]
},
notes: {
  type: "textarea",
  label: "What did you learn? How did it feel?",
  placeholder: "I was nervous, but I asked anyway..."
}
```

---

### QUEST 4: Hearing Nos

**ID:** "mission1_quest4"  
**Title:** "No Is Just Data"  
**Objective:** Deliberately seek rejection to build resilience and reframe "no" as feedback.  
**Estimated Time:** In-app: 45 mins | Off-app: 90 mins  
**Context:** ["user_profile"]  
**Success:** grant_points: 60, badge_key: "RESILIENT"

**Notes:**
- `{ type: "guide", title: "Rejection is not reflection", content: "Rejection is not a reflection of your worth. It's data. A 'no' today is a 'not yet' or a 'not this way.'" }`
- `{ type: "guide", title: "The real goal", content: "The goal isn't to get a 'yes.' The goal is to get comfortable with asking. The 'yes' will come later." }`
- `{ type: "nudge", title: "This will feel uncomfortable", content: "That's the point. Growth lives just outside your comfort zone." }`

**Challenges:**
- `{ title: "The Bold Ask", description: "Make a request that you're 95% sure will get a 'no.' Ask for something big, bold, or unreasonable. Track what you learn.", link: "/resources/challenges/the-bold-ask" }`

**Success Message:** "You've completed Quest 4: No Is Just Data. You've faced rejection, made a bold ask, and survived. You're now more resilient than 99% of people who never ask. You're ready for Mission 2."

---

#### Task 1: The Warm-Up Nos

**Title:** "Practice Getting Nos"  
**ID:** "mission1_quest4_task1"  
**Sequence:** 1  
**Execution Type:** log_counter  
**Estimated Minutes:** 60+ (Depends on user's pace)  
**Component Key:** "NoCounter"  
**Briefing:** "Your challenge: Get 2 'No's. This could be from asking people for feedback on an idea, asking for a sale, or any other reasonable request where 'No' is a possible response. The goal is to collect them. Each 'No' is a data point and a step forward."

**💡 Suggested Scenarios:**
- Ask a stranger for directions to a place you already know (see if they say no)
- Ask a friend to buy your product/service (even if it doesn't exist yet)
- Ask a local business if they'd partner with you (without a clear proposal)
- Ask someone for a big favor (like covering your shift or lending you money)

> The ask doesn't have to be "business-related." The skill is the same: asking and handling rejection.

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/why-no-is-better-than-maybe", title: "Why 'No' Is Better Than 'Maybe'" }`
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/handling-rejection-like-a-pro", title: "Handling Rejection Like a Pro" }`

**Reflection Prompt:** "What did you learn from each 'No'? Did any of them give you a reason why that could be helpful?"

**On Success:** `{ grant_points: 25, badge_key: "NO_HUNTER" }`

**Dependencies:** `[]`

**Checkback Delay:** 3 days

**target_count:** 2

**Form Details (log each 'No'):**
```ts
context: {
  type: "textarea",
  label: "Who did you ask? What was the ask?",
  placeholder: "I asked a local coffee shop if they'd stock my product. They said no because..."
},
reason: {
  type: "input",
  label: "What was their specific reason (if any)?",
  placeholder: "They said they only work with established suppliers.",
  optional: true
},
learned: {
  type: "textarea",
  label: "What did you learn from this 'No'?",
  placeholder: "I learned that I need to focus on smaller, independent shops first..."
}
```

---

#### Task 2: The Bold Ask

**Title:** "The Bold Ask"  
**ID:** "mission1_quest4_task2"  
**Sequence:** 2  
**Execution Type:** log_counter  
**Estimated Minutes:** 30 (for the action)  
**Component Key:** "BoldAskLogger"  
**Briefing:** "Now it's time for the real test. Make a request that you're 95% sure will get a 'no.' Ask for something big, bold, or unreasonable. The goal isn't to get a 'yes'—it's to prove to yourself that rejection won't kill you."

**🔥 Examples of bold asks:**
- Ask a celebrity or influencer for a call
- Ask a company for free lifetime access to their product
- Ask a local business to give you something for free
- Ask someone to introduce you to their most valuable contact
- Ask for a 90% discount on something

> The more unreasonable, the better. You're not trying to get a yes. You're trying to get comfortable with rejection.

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/turning-rejection-into-fuel", title: "Turning Rejection Into Fuel" }`
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/the-art-of-the-bold-ask", title: "The Art of the Bold Ask" }`

**Reflection Prompt:** "You just made a bold ask. You probably got a 'no.' And you're still standing. That's the whole point. You're now more resilient than 99% of people who never ask."

**On Success:** `{ grant_points: 35, badge_key: "BOLD_ASKER" }`

**Dependencies:** `["mission1_quest4_task1"]`

**Checkback Delay:** 2 days

**target_count:** 1

**Form Details (log the bold ask):**
```ts
what_did_you_ask: {
  type: "textarea",
  label: "What did you ask for?",
  placeholder: "I asked Tim Ferriss for a 15-minute call about..."
},
who_did_you_ask: {
  type: "input",
  label: "Who did you ask?",
  placeholder: "Tim Ferriss"
},
result: {
  type: "select",
  label: "What was the result?",
  options: [
    { value: "no", label: "No (as expected)" },
    { value: "yes", label: "Yes (unexpected!)" },
    { value: "waiting", label: "Still waiting..." }
  ]
},
how_did_it_feel: {
  type: "textarea",
  label: "How did it feel?",
  placeholder: "I was terrified but I did it anyway. Even though they said no, I feel empowered."
},
what_did_you_learn: {
  type: "textarea",
  label: "What did you learn?",
  placeholder: "I learned that rejection is temporary. The feeling of regret would have lasted much longer."
}
```

---

#### Task 3: The Reflection

**Title:** "Rejection Mastery"  
**ID:** "mission1_quest4_task3"  
**Sequence:** 3  
**Execution Type:** standard-form  
**Estimated Minutes:** 15  
**Component Key:** "RejectionReflectionForm"  
**Briefing:** "You've done the hard work. You've asked, been rejected, and survived. Now let's reflect on what this means for your journey."

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/rejection-is-the-price-of-admission", title: "Rejection Is the Price of Admission" }`

**Reflection Prompt:** "You've proven something to yourself today. What's the most important thing you learned about rejection? How will this change how you approach your business?"

**On Success:** `{ grant_points: 20, badge_key: "REJECTION_MASTER" }`

**Dependencies:** `["mission1_quest4_task2"]`

**Form Details:**
```ts
how_did_it_feel: {
  type: "textarea",
  label: "How did it feel to ask for and receive these 'Nos'?",
  placeholder: "At first, it was uncomfortable. But by the third one, I was almost relieved..."
},
what_did_you_learn: {
  type: "textarea",
  label: "What did you learn from the process?",
  placeholder: "I learned that 'no' is rarely personal. It's usually about timing, fit, or context."
},
what_next: {
  type: "textarea",
  label: "How will you approach a 'No' differently in the future?",
  placeholder: "I'll ask for feedback instead of getting defensive. Each 'no' is a chance to improve."
}
```

---

### COMPLETE BADGE LIST FOR MISSION 1

| Badge Key | Name | Earned In |
|-----------|------|-----------|
| PATHFINDER | Pathfinder | Quest 1 (All tasks) |
| HONEST_SELF | Honest Self | Task 1.1 |
| ACTION_COMMITMENT | Action Commitment | Task 1.2 |
| ROADBLOCK_ACKNOWLEDGED | Roadblock Acknowledged | Task 1.3 |
| RESOURCEFUL | Resourceful | Quest 2 (All tasks) |
| NETWORK_MAPPER | Network Mapper | Task 2.1 |
| SKILL_AUDITOR | Skill Auditor | Task 2.2 |
| ASKER | Asker | Quest 3 (All tasks) |
| SQUAD_ASSEMBLED | Squad Assembled | Task 3.1 |
| COMMUNITY_MEMBER | Community Member | Task 3.2 |
| FIRST_ASK | First Ask | Task 3.3 |
| RESILIENT | Resilient | Quest 4 (All tasks) |
| NO_HUNTER | No Hunter | Task 4.1 |
| BOLD_ASKER | Bold Asker | Task 4.2 |
| REJECTION_MASTER | Rejection Master | Task 4.3 |

---

### SUMMARY OF REFERENCES NEEDED

**Internal Resources to Create:**

**Insights:**
1. `/resources/insights/why-start-matters`
2. `/resources/insights/finding-your-north-star`
3. `/resources/insights/the-power-of-constraints`
4. `/resources/insights/fear-is-data`
5. `/resources/insights/your-network-is-your-first-sales-channel`
6. `/resources/insights/skills-are-assets`
7. `/resources/insights/your-cheer-squad-matters`
8. `/resources/insights/why-no-is-better-than-maybe`
9. `/resources/insights/turning-rejection-into-fuel`
10. `/resources/insights/rejection-is-the-price-of-admission`

**Guides:**
1. `/resources/guides/finding-your-north-star`
2. `/resources/guides/overcoming-analysis-paralysis`
3. `/resources/guides/how-to-network-without-being-creepy`
4. `/resources/guides/how-to-ask-for-anything`
5. `/resources/guides/how-to-build-your-support-system`
6. `/resources/guides/how-to-introduce-yourself-online`
7. `/resources/guides/handling-rejection-like-a-pro`
8. `/resources/guides/how-to-ask-for-a-discount`
9. `/resources/guides/the-art-of-the-bold-ask`

**Tools:**
1. `/resources/tools/time-audit-template`
2. `/resources/tools/skill-assessment-template`

**Challenges:**
1. `/resources/challenges/the-5-minute-timer`
2. `/resources/challenges/connection-challenge`
3. `/resources/challenges/the-3-ask-challenge`
4. `/resources/challenges/the-bold-ask`

---

### IMPLEMENTATION NOTES

**For `log_counter` Tasks (Task 3.3, Task 4.1, Task 4.2):**

| Task | target_count | What to Log |
|------|--------------|-------------|
| Task 3.3: Ask for a Discount | 1 | One discount ask |
| Task 4.1: Warm-Up Nos | 2 | Two rejections |
| Task 4.2: The Bold Ask | 1 | One bold ask |

**Progress Tracking:**
- User progresses when they submit a log entry
- Task completes when `log_count >= target_count`
- After completion, user is prompted with `reflection_prompt`
- Reflection is saved to `user_progress` with `type: "reflection"`

**Component Responsibility:**
The UI component for `log_counter` tasks should:
1. Display progress indicator (e.g., "1/2 logs completed")
2. Provide form fields for each log entry
3. Save logs to `user_progress` with `log_data` JSON
4. Show `reflection_prompt` after all logs are complete
5. Save reflection to `user_progress`

---

### MISSION 1 SUMMARY

**Total Quests:** 4
**Total Tasks:** 12
**Total Points Possible:** 350
**Total Badges Possible:** 14

| Quest | Tasks | Points | Badges |
|-------|-------|--------|--------|
| Quest 1: The New Beginning | 3 | 75 | 4 |
| Quest 2: Your Resources | 2 | 50 | 3 |
| Quest 3: Start Asking | 3 | 90 | 4 |
| Quest 4: No Is Just Data | 3 | 80 | 4 |
| **Total** | **11** | **295** | **15** |

