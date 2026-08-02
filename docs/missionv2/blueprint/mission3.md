## Mission 3: Getting Real (Complete Blueprint - UPDATED)

---

### MISSION OVERVIEW

**Title:** Getting Real
**ID:** "mission-3"
**Big Question:** "Is this business worth building?"
**Estimated Time:** 21 days
**Context:** ["user_profile", "user_opportunities", "user_projects"]
**Success Message:** "You've completed Mission 3: Getting Real. You've validated your problem with real customers, defined your Minimum Sellable Product, understood your environment, and made a conscious decision about your business. You're no longer dreaming—you're building with intention. Mission 4 awaits."

---

### QUEST 1: Revisiting the Problem

**ID:** "mission3_quest1"
**Title:** "The Deep Dive"
**Objective:** Understand your problem from a solution/business perspective.
**Estimated Time:** In-app: 45 mins | Off-app: 180 mins (interviews)
**Context:** ["user_profile", "user_opportunities", "user_projects"]
**Success:** grant_points: 65, badge_key: "PROBLEM_MASTER"

**Notes:**
- `{ type: "guide", title: "From opportunity to problem", content: "In Mission 2, you found an opportunity. Now we're turning it into a problem to solve. This shift in perspective is critical." }`
- `{ type: "guide", title: "Details matter", content: "The more specific you are about the problem, the easier it will be to build a solution that actually works." }`
- `{ type: "nudge", title: "Be specific", content: "If your problem statement could apply to anyone, it applies to no one. Get specific." }`

**Challenges:**
- `{ title: "The 5-Why Challenge", description: "Ask 'why' 5 times to get to the root cause of your problem. Don't stop at surface-level answers.", link: "/resources/challenges/the-5-why-challenge" }`

**Success Message:** "You've completed Quest 1: The Deep Dive. You now understand your problem intimately—when it happens, who it affects, and what people do about it."

---

#### Task 1.1: The Problem

**Title:** "Define the Problem"
**ID:** "mission3_quest1_task1"
**Sequence:** 1
**Execution Type:** standard-form
**Estimated Minutes:** 25
**Component Key:** "ProblemDefinitionForm"
**Briefing:** "You found an opportunity. Now let's turn it into a clear problem statement. The better you understand the problem, the better your solution will be."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-write-a-problem-statement", title: "How to Write a Problem Statement" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/the-problem-is-the-product", title: "The Problem Is the Product" }`

**Reflection Prompt:** "Looking at your problem statement, would someone who has this problem recognize themselves in it? If not, go deeper."

**On Success:** `{ grant_points: 20, badge_key: "PROBLEM_DEFINER" }`

**Dependencies:** `[]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `problem_hypothesis` (JSON)
- **Note:** This creates or updates the project record

**Form Details:**
```ts
problem_statement: {
  type: "textarea",
  label: "What's the problem in one sentence?",
  hint: "Be specific. 'Small businesses struggle with marketing' is too broad. 'Independent coffee shops spend 3 hours a day on social media they hate' is specific.",
  placeholder: "e.g., Independent coffee shops spend 3 hours a day on social media they hate",
  required: true
},
when: {
  type: "textarea",
  label: "When does this problem happen?",
  hint: "Time of day, season, specific triggers?",
  placeholder: "Every morning before opening, especially on weekends",
  required: true
},
where: {
  type: "textarea",
  label: "Where does this problem happen?",
  hint: "Physical location, digital environment, specific context?",
  placeholder: "At the coffee shop, on Instagram, during the morning rush",
  required: true
},
who: {
  type: "textarea",
  label: "Who did you observe having this problem?",
  hint: "Be specific. Who are they? What's their role? What's their context?",
  placeholder: "Independent coffee shop owners who do their own social media",
  required: true
},
frequency: {
  type: "select",
  label: "How often does this problem happen?",
  options: [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "occasionally", label: "Occasionally" },
    { value: "seasonal", label: "Seasonal" }
  ],
  required: true
},
workaround: {
  type: "textarea",
  label: "What is the current workaround?",
  hint: "What do people do today to solve this problem? (Even if it's inefficient)",
  placeholder: "They post inconsistently, use Canva templates, or hire expensive freelancers",
  required: true
}
```

---

#### Task 1.2: Talk to Customers

**Title:** "Talk to Customers"
**ID:** "mission3_quest1_task2"
**Sequence:** 2
**Execution Type:** log_counter
**Estimated Minutes:** 45 per interview
**Component Key:** "CustomerInterviewLogger"
**Briefing:** "This is the most important task in Mission 3. Talk to 5 real people who have this problem. Don't pitch your solution—just listen. Understand their pain."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-conduct-customer-interviews", title: "How to Conduct Customer Interviews" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/customer-interviews-are-gold", title: "Customer Interviews Are Gold" }`

**Reflection Prompt:** "What surprised you most in these interviews? What did you learn that you didn't expect?"

**On Success:** `{ grant_points: 30, badge_key: "CUSTOMER_TALKER" }`

**Dependencies:** `["mission3_quest1_task1"]`

**Checkback Delay:** 3 days

**target_count:** 5

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `validation_data` (JSON)
- **Note:** Each log entry is an interview record

**Form Details:**
```ts
who_did_you_talk_to: {
  type: "input",
  label: "Who did you talk to?",
  hint: "Name, role, how you found them",
  placeholder: "Sarah Johnson, Coffee shop owner, found through local business group",
  required: true
},
problem_confirmed: {
  type: "select",
  label: "Did they confirm the problem exists?",
  options: [
    { value: "yes", label: "Yes" },
    { value: "sort_of", label: "Sort of" },
    { value: "no", label: "No" }
  ],
  required: true
},
current_workaround: {
  type: "textarea",
  label: "What is their current workaround?",
  hint: "Your real competition is the workaround, not other companies",
  placeholder: "They use a free Canva template and post when they remember",
  required: true
},
buying_signal: {
  type: "select",
  label: "Did they offer to pay, ask to buy, or introduce you to someone?",
  hint: "This is the only signal that matters",
  options: [
    { value: "offer_to_pay", label: "Offered to pay" },
    { value: "asked_to_buy", label: "Asked to buy" },
    { value: "introduced", label: "Introduced me to someone" },
    { value: "none", label: "None of the above" }
  ],
  required: true
},
what_surprised_you: {
  type: "textarea",
  label: "What surprised you?",
  hint: "Where founders actually learn",
  placeholder: "I didn't realize they spend more time on comments than creating posts",
  required: false
},
problem_statement_change: {
  type: "textarea",
  label: "How did this change your problem statement?",
  hint: "Interviews should force iteration",
  placeholder: "I now understand the problem is about engagement, not just creation",
  required: false
}
```

---

#### Task 1.3: The Customer Persona

**Title:** "Create Your Customer"
**ID:** "mission3_quest1_task3"
**Sequence:** 3
**Execution Type:** standard-form
**Estimated Minutes:** 25
**Component Key:** "CustomerPersonaForm"
**Briefing:** "Create one customer persona. Focus on one person who has this problem. The more specific, the better."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-create-customer-personas", title: "How to Create Customer Personas" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/one-persona-is-enough", title: "One Persona Is Enough" }`

**Reflection Prompt:** "Would this person recognize themselves in this persona? If not, go back and add more detail."

**On Success:** `{ grant_points: 25, badge_key: "PERSONA_CREATOR" }`

**Dependencies:** `["mission3_quest1_task2"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `customer_personas` (JSON - array of persona objects)
- **Note:** Start with one persona, can add more later

**Form Details:**
```ts
persona_name: {
  type: "input",
  label: "Give your persona a name",
  hint: "Make it memorable - this is your ideal customer",
  placeholder: "e.g., 'Sarah the Coffee Shop Owner'",
  required: true
},
age_range: {
  type: "select",
  label: "Age Range",
  options: [
    { value: "18_24", label: "18-24" },
    { value: "25_34", label: "25-34" },
    { value: "35_44", label: "35-44" },
    { value: "45_54", label: "45-54" },
    { value: "55_plus", label: "55+" }
  ],
  required: true
},
gender: {
  type: "select",
  label: "Gender (if relevant)",
  options: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non_binary", label: "Non-binary" },
    { value: "not_relevant", label: "Not relevant" }
  ],
  optional: true
},
job_title: {
  type: "input",
  label: "Job Title",
  placeholder: "Independent Coffee Shop Owner",
  required: true
},
tasks: {
  type: "textarea",
  label: "Top 3 tasks related to this problem",
  hint: "What do they do that's related to this problem?",
  placeholder: "1. Planning social media content\n2. Creating posts\n3. Engaging with comments",
  required: true
},
pain_points: {
  type: "textarea",
  label: "Pain Points (ranked)",
  hint: "What frustrates them most about this problem? Rank 1-5.",
  placeholder: "1. Takes too much time\n2. Doesn't know what to post\n3. Feels unauthentic",
  required: true
},
gains_desired: {
  type: "textarea",
  label: "What would make this pain go away?",
  placeholder: "A 30-minute solution that feels authentic and builds community",
  required: true
},
current_spending: {
  type: "input",
  label: "What are they currently spending to solve this?",
  hint: "Time, money, or both",
  placeholder: "$500/month on a social media freelancer",
  required: false
},
where_to_find: {
  type: "textarea",
  label: "Where does this person hang out?",
  hint: "Places to find them—online and offline",
  placeholder: "Local business Facebook groups, Instagram, coffee industry meetups",
  required: true
},
problem_statement_customer: {
  type: "textarea",
  label: "How does your customer describe this problem in their own words?",
  hint: "Use their words, their phrases, their tone from your interviews",
  placeholder: "I'm spending 3 hours a day on social media and I hate every minute of it. I feel like I'm not connecting with my customers.",
  required: true
}
```

---

### QUEST 2: Minimum Sellable Product

**ID:** "mission3_quest2"
**Title:** "Build to Sell"
**Objective:** Define your Minimum Sellable Product—the smallest thing you can sell right now.
**Estimated Time:** In-app: 45 mins | Off-app: 60 mins
**Context:** ["user_profile", "user_projects"]
**Success:** grant_points: 60, badge_key: "MSP_DEFINER"

**Notes:**
- `{ type: "guide", title: "Build to sell, not to validate", content: "Your goal isn't to build something that might work. It's to sell something that does work." }`
- `{ type: "guide", title: "Start small", content: "The smallest sellable thing is the fastest path to learning. You can always expand later." }`
- `{ type: "nudge", title: "Resist scope creep", content: "Your first version should feel almost embarrassingly small. That's how you know it's right." }`

**Challenges:**
- `{ title: "The 7-Day Build", description: "Can you build your MSP in 7 days? If not, it's too big. Cut it down.", link: "/resources/challenges/the-7-day-build" }`

**Success Message:** "You've completed Quest 2: Build to Sell. You've defined your Minimum Sellable Product. It's small, focused, and ready to sell."

---

#### Task 2.1: Type of Solution

**Title:** "How Will You Solve It?"
**ID:** "mission3_quest2_task1"
**Sequence:** 1
**Execution Type:** standard-form
**Estimated Minutes:** 25
**Component Key:** "SolutionTypeForm"
**Briefing:** "There are many ways to solve a problem. Let's explore four approaches and pick the one that fits your customer best."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/choosing-your-solution-type", title: "Choosing Your Solution Type" }`

**Reflection Prompt:** "Why did you choose this approach? What makes it the best fit for your customer?"

**On Success:** `{ grant_points: 20, badge_key: "SOLUTION_CHOOSER" }`

**Dependencies:** `["mission3_quest1_task3"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `msp` (JSON)

**Form Details:**
```ts
solution_type: {
  type: "select",
  label: "How will you solve the problem?",
  hint: "Choose the approach that best fits your customer and your skills",
  options: [
    { 
      value: "product_service", 
      label: "📦 Product/Service: You solve the problem for the customer",
      description: "Example: A social media management service for coffee shops"
    },
    { 
      value: "tools_saas", 
      label: "💻 Tools/SaaS: You give the customer tools to solve it themselves",
      description: "Example: A social media scheduling tool with templates"
    },
    { 
      value: "marketplace", 
      label: "🤝 Marketplace: You connect the customer with someone who solves it",
      description: "Example: A platform connecting coffee shops with social media freelancers"
    },
    { 
      value: "content", 
      label: "📚 Content: You teach the customer how to solve it",
      description: "Example: A course teaching coffee shop owners social media"
    }
  ],
  required: true
},
industry_sector: {
  type: "input",
  label: "What industry or sector is this in?",
  hint: "Be specific. This helps with compliance and personalization.",
  placeholder: "e.g., Food & Beverage, Tech, Education, Healthcare",
  required: true
},
rationale: {
  type: "textarea",
  label: "Why did you choose this approach?",
  placeholder: "Because my customers don't have time to learn new tools. They want someone to just do it for them.",
  required: true
},
access_type: {
  type: "select",
  label: "How will customers access your solution?",
  hint: "Think about the best way for your customer to get value",
  options: [
    { 
      value: "one_time_purchase", 
      label: "One-time purchase",
      description: "Buy it once, keep it forever (e.g., digital product, physical item)"
    },
    { 
      value: "saas_subscription", 
      label: "SaaS Subscription",
      description: "Pay monthly/yearly for ongoing access to software"
    },
    { 
      value: "service_retainer", 
      label: "Service Retainer",
      description: "Ongoing monthly service (e.g., social media management)"
    },
    { 
      value: "service_project", 
      label: "Service (per project/hour)",
      description: "Pay per session or project (e.g., consulting call)"
    },
    { 
      value: "digital_download", 
      label: "Digital Download",
      description: "Delivered as PDF, templates, or files"
    },
    { 
      value: "membership", 
      label: "Membership",
      description: "Ongoing access to content, community, or resources"
    },
    { 
      value: "freemium", 
      label: "Freemium",
      description: "Free tier with paid upgrades"
    },
    { 
      value: "marketplace_commission", 
      label: "Marketplace Commission",
      description: "You take a cut of transactions"
    }
  ],
  required: true
},
execution_responsibility: {
  type: "select",
  label: "Who does the work in this solution?",
  options: [
    { value: "user", label: "👤 The customer does the work" },
    { value: "provider", label: "🏢 You (or your team) does the work" },
    { value: "marketplace", label: "🤝 A third-party does the work" },
    { value: "hybrid", label: "🔄 Hybrid (some customer, some provider)" }
  ],
  required: true
}
```

---

#### Task 2.2: What Does It Look Like?

**Title:** "Define Your MSP"
**ID:** "mission3_quest2_task2"
**Sequence:** 2
**Execution Type:** standard-form
**Estimated Minutes:** 15
**Component Key:** "MSPDefinitionForm"
**Briefing:** "Describe your Minimum Sellable Product in one sentence. The smallest thing you can sell right now."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/defining-your-minimum-sellable-product", title: "Defining Your Minimum Sellable Product" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/what-is-an-msp", title: "What Is a Minimum Sellable Product?" }`

**Reflection Prompt:** "Is this something you could sell today? If not, it's too big. Cut it down."

**On Success:** `{ grant_points: 15, badge_key: "MSP_DESCRIBER" }`

**Dependencies:** `["mission3_quest2_task1"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `msp` (JSON - updates with description)

**Form Details:**
```ts
msp_description: {
  type: "textarea",
  label: "Describe your MSP in one sentence",
  hint: "The smallest thing you can sell right now",
  placeholder: "A 30-minute social media consultation call that creates a weekly posting plan for coffee shop owners",
  required: true
}
```

---

#### Task 2.3: Build Your MSP

**Title:** "Build Your MSP"
**ID:** "mission3_quest2_task3"
**Sequence:** 3
**Execution Type:** standard-form
**Estimated Minutes:** 25
**Component Key:** "MSPBuildForm"
**Briefing:** "Now let's define everything about your MSP—price, delivery, resources, timeline, and differentiation."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/designing-your-minimum-sellable-product", title: "Designing Your Minimum Sellable Product" }`

**Reflection Prompt:** "Would you buy this? At this price? For this value? Be honest."

**On Success:** `{ grant_points: 25, badge_key: "MSP_BUILDER" }`

**Dependencies:** `["mission3_quest2_task2"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `msp` (JSON - full MSP definition)

**Form Details:**
```ts
price: {
  type: "input",
  label: "What would you charge for the MSP?",
  hint: "This is your price hypothesis. You can change it later.",
  placeholder: "$97",
  required: true
},
delivery_method: {
  type: "select",
  label: "How would you deliver the first one?",
  hint: "Channel clarity—where will you deliver your product?",
  options: [
    { value: "in_person", label: "In-person" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone call" },
    { value: "video_call", label: "Video call" },
    { value: "simple_website", label: "Simple website" },
    { value: "instagram_dm", label: "Instagram DM" },
    { value: "pdf_download", label: "PDF download" },
    { value: "other", label: "Other" }
  ],
  required: true
},
resources_needed: {
  type: "textarea",
  label: "What do you need to buy, borrow, or build to make the first sale?",
  hint: "Resource reality check",
  placeholder: "A simple landing page, a payment link, and 30 minutes of my time",
  required: true
},
time_to_first_sale: {
  type: "select",
  label: "How long until you could make the first sale?",
  hint: "Momentum check—this is the most important question",
  options: [
    { value: "hours", label: "Hours" },
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" }
  ],
  required: true
},
differentiation: {
  type: "textarea",
  label: "Why would they buy this from YOU instead of keeping their workaround?",
  hint: "Differentiation—not against competitors, against 'I'll just do it myself'",
  placeholder: "Because I've done this for 10 coffee shops and know what works. They save 3 hours a week.",
  required: true
}
```

---

### QUEST 3: Understand the Environment

**ID:** "mission3_quest3"
**Title:** "Know the Battlefield"
**Objective:** Understand the competitive landscape, trends, and compliance requirements.
**Estimated Time:** In-app: 45 mins | Off-app: 60 mins
**Context:** ["user_profile", "user_projects"]
**Success:** grant_points: 50, badge_key: "ENVIRONMENT_READY"

**Notes:**
- `{ type: "guide", title: "Know your battlefield", content: "Understanding the environment is as important as understanding the problem. What's working? What's hard? Where are your customers?" }`
- `{ type: "guide", title: "Your real competition", content: "Your competition isn't other companies. It's the workaround—people doing it themselves." }`
- `{ type: "nudge", title: "Be honest about risks", content: "The biggest risks are the ones you don't see coming. Name them." }`

**Success Message:** "You've completed Quest 3: Know the Battlefield. You understand the landscape, the trends, and the compliance requirements. You're ready to make an informed decision."

---

#### Task 3.1: Landscape

**Title:** "Map the Landscape"
**ID:** "mission3_quest3_task1"
**Sequence:** 1
**Execution Type:** standard-form
**Estimated Minutes:** 30
**Component Key:** "LandscapeForm"
**Briefing:** "Let's map the environment. What trends make this problem relevant? Who else solves it? What's working? What's hard? Where are your customers?"

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/mapping-the-competitive-landscape", title: "Mapping the Competitive Landscape" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/the-competition-is-the-workaround", title: "The Competition Is the Workaround" }`

**Reflection Prompt:** "Looking at this landscape, what's your biggest opportunity? What's your biggest threat?"

**On Success:** `{ grant_points: 25, badge_key: "LANDSCAPE_MAPPER" }`

**Dependencies:** `["mission3_quest2_task3"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `landscape` (JSON)

**Form Details:**
```ts
trend_or_shift: {
  type: "textarea",
  label: "What trend or shift makes this problem more relevant now?",
  hint: "Remote work, AI, cost of living, health awareness—timing is everything",
  placeholder: "Coffee shop owners are burned out from social media and looking for simpler solutions",
  required: true
},
competitors: {
  type: "textarea",
  label: "Who else solves this?",
  hint: "Direct competitors + the DIY workaround. If they aren't paying someone, you're competing with 'I'll just do it myself.'",
  placeholder: "Social media agencies, freelance designers, DIY Canva templates",
  required: true
},
whats_working: {
  type: "textarea",
  label: "What's clearly working in this space?",
  hint: "Proven demand—what are people already buying?",
  placeholder: "Coffee shops are buying pre-made social media templates and hiring short-term help",
  required: true
},
whats_hard: {
  type: "textarea",
  label: "What's clearly hard in this space?",
  hint: "Logistics, trust, distribution, seasonality—where you'll bleed if you're not careful",
  placeholder: "Trust is hard. Coffee shop owners have been burned by agencies before.",
  required: true
},
where_customers_gather: {
  type: "textarea",
  label: "Where do your exact customers already gather or buy?",
  hint: "Your path to the first 10 sales",
  placeholder: "Facebook groups like 'Coffee Shop Owners Association,' local coffee events, Instagram hashtags",
  required: true
}
```

---

#### Task 3.2: Compliance

**Title:** "Check Your Compliance"
**ID:** "mission3_quest3_task2"
**Sequence:** 2
**Execution Type:** standard-form
**Estimated Minutes:** 20
**Component Key:** "ComplianceForm"
**Briefing:** "Every business has compliance requirements. Based on your solution type and industry, we'll generate a checklist of what you need to check before you start."

**How the Component Works:**
1. **Inputs**: Takes `solution_type` and `industry_sector` from Task 2.1
2. **Logic**: Hybrid approach
   - **AI-generated**: Uses LLM to generate relevant compliance items based on context
   - **Data-driven**: Has predefined checklists for common industries
   - **User input**: Allows users to add custom items
3. **Output**: Creates a structured compliance checklist saved to `compliance_checklist`

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/business-compliance-basics", title: "Business Compliance Basics" }`

**Reflection Prompt:** "What's the biggest compliance requirement you need to address before launching?"

**On Success:** `{ grant_points: 25, badge_key: "COMPLIANCE_CHECKER" }`

**Dependencies:** `["mission3_quest3_task1"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `compliance_checklist` (JSON)

**Form Details:**
```ts
// The component generates this structure based on solution_type + industry
compliance_items: {
  type: "array",
  label: "Compliance Checklist",
  hint: "Items are generated based on your solution type and industry",
  items: {
    type: "object",
    properties: {
      item: { 
        type: "string", 
        label: "Compliance requirement",
        description: "What you need to check or do"
      },
      status: { 
        type: "select", 
        label: "Status",
        options: [
          { value: "not_started", label: "Not Started" },
          { value: "in_progress", label: "In Progress" },
          { value: "completed", label: "Completed" },
          { value: "not_applicable", label: "Not Applicable" }
        ]
      },
      urgency: {
        type: "select",
        label: "Urgency",
        options: [
          { value: "critical", label: "Critical - Must do before launch" },
          { value: "important", label: "Important - Should do soon" },
          { value: "low", label: "Low - Can do later" }
        ]
      },
      notes: { 
        type: "textarea", 
        label: "Notes",
        placeholder: "What do you need to do? Who to contact?",
        optional: true
      }
    }
  }
}
```

---

### QUEST 4: Evaluate Fit

**ID:** "mission3_quest4"
**Title:** "Go or No-Go"
**Objective:** Make a conscious decision about whether to pursue this business.
**Estimated Time:** In-app: 45 mins | Off-app: 30 mins
**Context:** ["user_profile", "user_projects"]
**Success:** grant_points: 60, badge_key: "DECISION_MAKER"

**Notes:**
- `{ type: "guide", title: "This is the hardest part", content: "Making a conscious decision—yes or no—is harder than building. But it's the most important." }`
- `{ type: "guide", title: "Be honest about the risks", content: "If you can't name your biggest risk, you haven't thought it through." }`
- `{ type: "nudge", title: "Trust your gut", content: "The data matters. But so does your instinct. Don't ignore it." }`

**Success Message:** "You've completed Mission 3: Getting Real. You've validated your problem, defined your MSP, understood the environment, and made a conscious decision. You're no longer dreaming—you're building with intention. Mission 4 awaits."

---

#### Task 4.1: Viability Check

**Title:** "Check Your Viability"
**ID:** "mission3_quest4_task1"
**Sequence:** 1
**Execution Type:** standard-form
**Estimated Minutes:** 20
**Component Key:** "ViabilityCheckForm"
**Briefing:** "Let's do a final viability check. Answer these questions honestly. This isn't about being optimistic—it's about being real."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/viability-assessment", title: "Viability Assessment" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/how-to-know-if-your-idea-is-good", title: "How to Know If Your Idea Is Good" }`

**Reflection Prompt:** "If this didn't work out, what would you regret more—starting or not starting?"

**On Success:** `{ grant_points: 25, badge_key: "VIABILITY_CHECKER" }`

**Dependencies:** `["mission3_quest3_task2"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `viability_check` (JSON)

**Form Details:**
```ts
first_sale_14_days: {
  type: "select",
  label: "Can you make the first sale within 14 days?",
  hint: "If not, the MSP is too big or the problem isn't urgent",
  options: [
    { value: "yes", label: "✅ Yes" },
    { value: "maybe", label: "🤔 Maybe, with effort" },
    { value: "no", label: "❌ No" }
  ],
  required: true
},
resources_available: {
  type: "select",
  label: "Can you do this with your current time, money, and skills?",
  hint: "Founder reality—be honest about what you have",
  options: [
    { value: "yes", label: "✅ Yes" },
    { value: "mostly", label: "🤔 Mostly, with some gaps" },
    { value: "no", label: "❌ No" }
  ],
  required: true
},
stamina_6_months: {
  type: "select",
  label: "Will you still want to do this 6 months from now?",
  hint: "Even if it grows slowly—honest stamina check",
  options: [
    { value: "absolutely", label: "✅ Absolutely" },
    { value: "probably", label: "🤔 Probably" },
    { value: "uncertain", label: "🤔 I'm not sure" },
    { value: "probably_not", label: "❌ Probably not" }
  ],
  required: true
},
biggest_risk: {
  type: "textarea",
  label: "What is the biggest risk that would kill this?",
  hint: "Honest threat assessment",
  placeholder: "If coffee shops go out of business, I have no customers. Or: If I can't build trust, no one will buy.",
  required: true
},
kill_criteria: {
  type: "textarea",
  label: "Your kill criteria: 'I will stop if...'",
  hint: "This prevents sunk cost fallacy. Be specific.",
  placeholder: "I will stop if I haven't made a sale in 30 days. OR: I will stop if I spend more than $500 and have no interest.",
  required: true
}
```

---

#### Task 4.2: What If This Doesn't Work?

**Title:** "Face the Worst Case"
**ID:** "mission3_quest4_task2"
**Sequence:** 2
**Execution Type:** standard-form
**Estimated Minutes:** 15
**Component Key:** "WorstCaseForm"
**Briefing:** "Let's face the worst-case scenario. What if this doesn't work? What if you build it and no one buys? The goal isn't to scare yourself—it's to prepare yourself."

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/facing-failure-builds-resilience", title: "Facing Failure Builds Resilience" }`

**Reflection Prompt:** "What's the worst that could happen? And what would you do next?"

**On Success:** `{ grant_points: 20, badge_key: "REALIST" }`

**Dependencies:** `["mission3_quest4_task1"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `viability_check` (JSON - updates with worst-case analysis)

**Form Details:**
```ts
worst_case_scenario: {
  type: "textarea",
  label: "What's the worst-case scenario?",
  hint: "Be specific. What would actually happen?",
  placeholder: "I spend $500 and 3 months, and no one buys. I feel embarrassed, but I learn a lot.",
  required: true
},
what_would_you_learn: {
  type: "textarea",
  label: "What would you learn if it fails?",
  hint: "Failure is data, not a verdict",
  placeholder: "I'd learn what doesn't work. I'd get better at customer research. I'd be more confident next time.",
  required: true
},
what_would_you_do_next: {
  type: "textarea",
  label: "What would you do next?",
  hint: "Have a plan B",
  placeholder: "I'd take what I learned and try a different approach. Maybe focus on a different customer segment.",
  required: true
},
regret_test: {
  type: "select",
  label: "What would you regret more?",
  options: [
    { value: "starting", label: "Starting and failing" },
    { value: "not_starting", label: "Not starting at all" }
  ],
  hint: "This tells you everything you need to know",
  required: true
}
```

---

#### Task 4.3: Go / No-Go / Pivot

**Title:** "Make the Call"
**ID:** "mission3_quest4_task3"
**Sequence:** 3
**Execution Type:** standard-form
**Estimated Minutes:** 10
**Component Key:** "DecisionGateForm"
**Briefing:** "This is it. Based on everything you've learned—the problem, the customer interviews, the MSP, the landscape, the viability check—make a conscious decision."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/making-the-go-no-go-decision", title: "Making the Go/No-Go Decision" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/the-decision-that-matters", title: "The Decision That Matters" }`

**Reflection Prompt:** "What's the one thing that pushed you to this decision?"

**On Success:** `{ grant_points: 15, badge_key: "DECISION_COMMITTED" }`

**Dependencies:** `["mission3_quest4_task2"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `viability_check` (JSON - final decision)
- **Action:** If "Go" is chosen, project status updates to "active"
- **Action:** If "Pivot" is chosen, project status updates to "pivot"

**Form Details:**
```ts
decision: {
  type: "select",
  label: "What's your decision?",
  options: [
    { 
      value: "go", 
      label: "🚀 Go",
      description: "I'm building this. The problem is real, the customer is there, and I have a viable MSP."
    },
    { 
      value: "pivot", 
      label: "🔄 Pivot",
      description: "The problem is real, but I need to change my approach—different solution, different customer, or both."
    },
    { 
      value: "no_go", 
      label: "⏸️ No-Go (for now)",
      description: "The problem isn't urgent enough, the customer isn't there, or the timing isn't right."
    }
  ],
  required: true
},
decision_rationale: {
  type: "textarea",
  label: "What's your 1-paragraph reasoning?",
  hint: "Be honest. This is for you.",
  placeholder: "I'm going because I talked to 5 coffee shop owners and 4 said they'd pay for this. I can build the MSP in 7 days. The biggest risk is trust, but I can overcome that with testimonials.",
  required: true
}
```

---

### COMPLETE BADGE LIST FOR MISSION 3

| Badge Key | Name | Earned In |
|-----------|------|-----------|
| PROBLEM_MASTER | Problem Master | Quest 1 (All tasks) |
| PROBLEM_DEFINER | Problem Definer | Task 1.1 |
| CUSTOMER_TALKER | Customer Talker | Task 1.2 |
| PERSONA_CREATOR | Persona Creator | Task 1.3 |
| MSP_DEFINER | MSP Definer | Quest 2 (All tasks) |
| SOLUTION_CHOOSER | Solution Chooser | Task 2.1 |
| MSP_DESCRIBER | MSP Describer | Task 2.2 |
| MSP_BUILDER | MSP Builder | Task 2.3 |
| ENVIRONMENT_READY | Environment Ready | Quest 3 (All tasks) |
| LANDSCAPE_MAPPER | Landscape Mapper | Task 3.1 |
| COMPLIANCE_CHECKER | Compliance Checker | Task 3.2 |
| DECISION_MAKER | Decision Maker | Quest 4 (All tasks) |
| VIABILITY_CHECKER | Viability Checker | Task 4.1 |
| REALIST | Realist | Task 4.2 |
| DECISION_COMMITTED | Decision Committed | Task 4.3 |

---

### SUMMARY OF REFERENCES NEEDED

**Insights:**
1. `/resources/insights/the-problem-is-the-product`
2. `/resources/insights/customer-interviews-are-gold`
3. `/resources/insights/one-persona-is-enough`
4. `/resources/insights/what-is-an-msp`
5. `/resources/insights/the-competition-is-the-workaround`
6. `/resources/insights/how-to-know-if-your-idea-is-good`
7. `/resources/insights/facing-failure-builds-resilience`
8. `/resources/insights/the-decision-that-matters`

**Guides:**
1. `/resources/guides/how-to-write-a-problem-statement`
2. `/resources/guides/how-to-conduct-customer-interviews`
3. `/resources/guides/how-to-create-customer-personas`
4. `/resources/guides/choosing-your-solution-type`
5. `/resources/guides/defining-your-minimum-sellable-product`
6. `/resources/guides/designing-your-minimum-sellable-product`
7. `/resources/guides/mapping-the-competitive-landscape`
8. `/resources/guides/business-compliance-basics`
9. `/resources/guides/viability-assessment`
10. `/resources/guides/making-the-go-no-go-decision`
11. `/resources/guides/finding-the-customers-voice`

**Challenges:**
1. `/resources/challenges/the-5-why-challenge`
2. `/resources/challenges/the-7-day-build`

---

