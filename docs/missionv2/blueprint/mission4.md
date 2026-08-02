Perfect! This gives me everything I need. Let me finalize the blueprint with all the clarifications and generate the complete `mission4.ts` file.

---

## Mission 4: The Business Engine (FINAL BLUEPRINT)

---

### MISSION OVERVIEW

**Title:** The Business Engine

**ID:** "mission-4"

**Big Question:** "How will you make money?"

**Estimated Time:** 21 days

**Context:** ["user_profile", "user_projects"]

**Success Message:** "You've completed Mission 4: The Business Engine. You've defined your offer, set your price, built your acquisition plan, run the numbers, and made a conscious decision. You know exactly how your business makes money—or if it can at all. Mission 5 awaits."

---

### QUEST 1: Shape Your Offer

**ID:** "mission4_quest1"
**Title:** "Shape Your Offer"
**Objective:** Define exactly what you're selling—your promise, features, and delivery experience.
**Estimated Time:** In-app: 45 mins | Off-app: 30 mins
**Context:** ["user_profile", "user_projects"]
**Success:** grant_points: 60, badge_key: "OFFER_DEFINER"

**Notes:**
- `{ type: "guide", title: "Your offer is your promise", content: "Your offer isn't just a list of features. It's a promise to solve a problem. Get the promise right, and the features follow." }`
- `{ type: "nudge", title: "Start with the customer", content: "What does your customer actually want? Not what you want to build. What they want to buy." }`
- `{ type: "warning", title: "Resist the temptation to add more", content: "A clear offer beats a complicated one every time. The best offers are simple." }`

**Challenges:**
- `{ title: "The 2-Minute Test", description: "Can you explain your offer in 2 minutes to a stranger? Practice until they say 'I get it.'", link: "/resources/challenges/the-2-minute-test" }`

**Success Message:** "You've completed Quest 1: Shape Your Offer. You have a clear value proposition, a focused feature set, and a mapped customer experience. You know what you're selling."

---

#### Task 1.1: Your Promise

**Title:** "Your Promise"
**ID:** "mission4_quest1_task1"
**Sequence:** 1
**Execution Type:** standard-form
**Estimated Minutes:** 20
**Component Key:** "ValuePropositionForm"
**Briefing:** "What's the core promise you're making to your customer? What's the one thing they get that they can't get elsewhere? Your value proposition is the heartbeat of your offer."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-write-a-value-proposition", title: "How to Write a Value Proposition" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/the-value-proposition-is-not-the-features", title: "The Value Proposition Is Not the Features" }`

**Reflection Prompt:** "If your customer could only remember one thing about your offer, what should it be? That's your value proposition."

**On Success:** `{ grant_points: 20, badge_key: "VALUE_PROMISE" }`

**Dependencies:** `["mission3_quest4_task3"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `value_prop`

**Form Details:**
```ts
value_proposition: {
  type: "textarea",
  label: "What's your value proposition in one sentence?",
  hint: "The single most important promise you're making. What does the customer get?",
  placeholder: "e.g., 'I help coffee shop owners save 10 hours a week on social media'",
  required: true
},
unique_value: {
  type: "textarea",
  label: "What's unique about your offer?",
  hint: "What can the customer get from you that they can't get anywhere else?",
  placeholder: "I understand coffee shop owners specifically. I've been one. I know what works.",
  required: true
},
customer_promise: {
  type: "textarea",
  label: "If you had to make a promise to your customer, what would it be?",
  hint: "This should be something you'd be proud to put on a guarantee",
  placeholder: "I promise you'll save 5 hours a week on social media within 30 days, or I'll work with you until you do.",
  required: true
}
```

---

#### Task 1.2: Feature Set

**Title:** "What's In, What's Out"
**ID:** "mission4_quest1_task2"
**Sequence:** 2
**Execution Type:** standard-form
**Estimated Minutes:** 20
**Component Key:** "FeatureBrainstormForm"
**Briefing:** "Brain dump all the features your solution could have. Don't filter, don't prioritize. Just list everything you can imagine. We'll filter in the next task."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/feature-brainstorming", title: "Feature Brainstorming" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/mvp-means-elimination", title: "MVP Means Elimination" }`

**Reflection Prompt:** "Look at your list. What features are you most excited about? Which ones are you dreading? That's a signal."

**On Success:** `{ grant_points: 15, badge_key: "FEATURE_BRAINSTORMER" }`

**Dependencies:** `["mission4_quest1_task1"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `features`

**Form Details:**
```ts
feature_title: {
  type: "input",
  label: "Feature name",
  placeholder: "e.g., Social media scheduling",
  required: true
},
feature_description: {
  type: "input",
  label: "Brief description",
  placeholder: "e.g., Schedule posts for Instagram, Facebook, and Twitter",
  required: true
}
// Users can add multiple features - each gets a temporary ID
// priority defaults to null (set in Task 1.3)
```

---

#### Task 1.3: Feature Prioritization

**Title:** "Pick Your Focus"
**ID:** "mission4_quest1_task3"
**Sequence:** 3
**Execution Type:** standard-form
**Estimated Minutes:** 20
**Component Key:** "FeaturePrioritizationForm"
**Briefing:** "Now let's be ruthless. From your brainstorm, pick 3 must-have features for your first version. Then list what you explicitly won't include. This is where the magic happens."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/prioritizing-features", title: "Prioritizing Features" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/you-are-not-your-features", title: "You Are Not Your Features" }`

**Reflection Prompt:** "You're saying 'no' to features. How does that feel? The best founders get comfortable with saying 'no' to good ideas so they can say 'yes' to great ones."

**On Success:** `{ grant_points: 20, badge_key: "FEATURE_PRIORITIZER" }`

**Dependencies:** `["mission4_quest1_task2"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `features` (updates priority field)

**Form Details:**
```ts
// Shows all features from Task 1.2 with priority dropdown
features: {
  type: "array",
  label: "Prioritize your features",
  hint: "Pick 3 must-haves. The rest become 'nice to have' or 'excluded'.",
  items: {
    title: { type: "display", label: "Feature name" },
    description: { type: "display", label: "Description" },
    priority: {
      type: "select",
      label: "Priority",
      options: [
        { value: "must_have", label: "Must Have - Version 1" },
        { value: "nice_to_have", label: "Nice to Have - Later" },
        { value: "excluded", label: "Excluded - Not in Version 1" }
      ],
      required: true
    }
  }
},
must_have_rationale: {
  type: "textarea",
  label: "Why did you pick these 3 as must-haves?",
  hint: "What makes these the core features that deliver your value proposition?",
  placeholder: "These 3 deliver the value proposition of saving time. The customer can schedule all posts for the week, use templates, and know when to post.",
  required: true
}
```

---

#### Task 1.4: Customer Experience

**Title:** "The Journey"
**ID:** "mission4_quest1_task4"
**Sequence:** 4
**Execution Type:** standard-form
**Estimated Minutes:** 15
**Component Key:** "CustomerExperienceForm"
**Briefing:** "Map the customer experience from payment to delivery. What happens after they give you money? Walk through each step."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/mapping-the-customer-journey", title: "Mapping the Customer Journey" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/customer-experience-is-the-product", title: "Customer Experience Is the Product" }`

**Reflection Prompt:** "Put yourself in your customer's shoes. What are they feeling at each step? Where does the anxiety or confusion happen?"

**On Success:** `{ grant_points: 20, badge_key: "EXPERIENCE_MAPPER" }`

**Dependencies:** `["mission4_quest1_task3"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `customer_experience`

**Form Details:**
```ts
delivery_time: {
  type: "select",
  label: "How long does it take to deliver one unit?",
  options: [
    { value: "minutes", label: "Minutes" },
    { value: "hours", label: "Hours" },
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" }
  ],
  required: true
},
customer_journey: {
  type: "textarea",
  label: "What does the customer experience from payment to delivery?",
  hint: "List 3-5 steps. Walk through it like a story.",
  placeholder: "Step 1: Customer purchases on the website\nStep 2: They get a confirmation email with a questionnaire\nStep 3: They fill out the questionnaire about their business\nStep 4: Within 24 hours, they receive a custom social media plan\nStep 5: They get a follow-up email with next steps",
  required: true
},
friction_points: {
  type: "textarea",
  label: "Where are the potential friction points?",
  hint: "Where might they get confused, frustrated, or lost?",
  placeholder: "The questionnaire might be too long. They might not know how to use the plan. The delivery might take longer than expected.",
  required: true
}
```

---

### QUEST 2: Price It Right

**ID:** "mission4_quest2"
**Title:** "Price It Right"
**Objective:** Set a price based on value, not just cost.
**Estimated Time:** In-app: 30 mins | Off-app: 20 mins
**Context:** ["user_profile", "user_projects"]
**Success:** grant_points: 50, badge_key: "PRICE_SETTER"

**Notes:**
- `{ type: "guide", title: "Price is a statement", content: "Your price says something about your product. Too cheap and it feels low-quality. Too expensive and it feels out of reach." }`
- `{ type: "guide", title: "Value first, cost second", content: "The right price is what your customer would willingly pay for the value they receive. Not what you need to survive." }`
- `{ type: "nudge", title: "Don't underprice", content: "First-time founders almost always underprice. You can always go down. Going up is much harder." }`

**Success Message:** "You've completed Quest 2: Price It Right. You have a confident price based on value, not fear."

---

#### Task 2.1: Set the Price

**Title:** "Name Your Number"
**ID:** "mission4_quest2_task1"
**Sequence:** 1
**Execution Type:** standard-form
**Estimated Minutes:** 20
**Component Key:** "PriceSettingForm"
**Briefing:** "Let's set your price. Start with what the problem costs your customer, then what they pay for alternatives, then name your number."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/how-to-price-your-offer", title: "How to Price Your Offer" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/price-is-value-perceived", title: "Price Is Value Perceived" }`

**Reflection Prompt:** "If you were your customer, would you pay this price? Why or why not?"

**On Success:** `{ grant_points: 25, badge_key: "PRICE_NAMER" }`

**Dependencies:** `["mission4_quest1_task4"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `pricing`

**Form Details:**
```ts
problem_cost_money: {
  type: "input",
  label: "What is the problem costing the customer in money?",
  hint: "What are they spending on workarounds, inefficiencies, or wasted time?",
  placeholder: "$500/month on a freelancer",
  required: false
},
problem_cost_time: {
  type: "input",
  label: "What is the problem costing the customer in time?",
  hint: "How many hours do they spend dealing with this problem?",
  placeholder: "10 hours a week",
  required: false
},
problem_cost_stress: {
  type: "textarea",
  label: "What is the problem costing the customer in stress?",
  hint: "What's the emotional cost?",
  placeholder: "They feel overwhelmed, behind, and frustrated. They hate social media but feel they have to do it.",
  required: false
},
alternatives_cost: {
  type: "input",
  label: "What do they currently pay for alternatives or workarounds?",
  hint: "Even if it's 'nothing,' their time has value. Estimate the cost.",
  placeholder: "$500/month on a freelancer OR 10 hours/week of their time",
  required: true
},
proposed_price: {
  type: "input",
  label: "What is your price for the MSP? (one number)",
  hint: "No justification yet. Just the price.",
  placeholder: "$97",
  required: true
},
payment_frequency: {
  type: "select",
  label: "How do they pay?",
  hint: "Cash flow prediction. Subscriptions feel different than one-off sales.",
  options: [
    { value: "one_time", label: "One-time payment" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "per_unit", label: "Per unit" },
    { value: "commission", label: "Commission" }
  ],
  required: true
}
```

---

#### Task 2.2: Price Assessment

**Title:** "Test Your Price"
**ID:** "mission4_quest2_task2"
**Sequence:** 2
**Execution Type:** standard-form
**Estimated Minutes:** 15
**Component Key:** "PriceAssessmentForm"
**Briefing:** "Now let's stress-test your price. Would customers pay double? Is it fair? Does it feel trustworthy?"

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/price-assessment", title: "Price Assessment" }`

**Reflection Prompt:** "If your price feels 'too cheap,' you might be sending the wrong signal. What would make it feel premium?"

**On Success:** `{ grant_points: 25, badge_key: "PRICE_ASSESSOR" }`

**Dependencies:** `["mission4_quest2_task1"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `pricing`

**Form Details:**
```ts
double_price_test: {
  type: "select",
  label: "If you charged 2x this price, would your best customers still buy?",
  hint: "Elasticity gut check. If yes, you're undercharging.",
  options: [
    { value: "yes", label: "Yes, they'd still buy" },
    { value: "maybe", label: "Maybe, but I'd lose some" },
    { value: "no", label: "No, they'd walk away" }
  ],
  required: true
},
price_fairness: {
  type: "textarea",
  label: "Why is this price fair to the customer?",
  hint: "Forces value-based thinking. Not about you.",
  placeholder: "They save 10 hours a week. Even at minimum wage, that's $150/week in saved time. $97/month is a bargain.",
  required: true
},
price_trust: {
  type: "textarea",
  label: "What would make this price feel 'too cheap' or untrustworthy?",
  hint: "Prevents race to the bottom.",
  placeholder: "If I charged $20, they'd think it was a low-quality template. $97 feels like a professional service.",
  required: true
},
confidence_score: {
  type: "select",
  label: "On a scale of 1-10, how confident are you in this price?",
  hint: "Be honest with yourself.",
  options: [
    { value: "1", label: "1 - Not confident at all" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5 - Neutral" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10 - Very confident" }
  ],
  required: true
}
```

---

### QUEST 3: Find Your Customers

**ID:** "mission4_quest3"
**Title:** "Find Your Customers"
**Objective:** Build a focused, actionable acquisition plan.
**Estimated Time:** In-app: 45 mins | Off-app: 60 mins
**Context:** ["user_profile", "user_projects"]
**Success:** grant_points: 60, badge_key: "ACQUISITION_PLANNER"

**Notes:**
- `{ type: "guide", title: "Focus is everything", content: "First-time founders die by trying five channels at once. Pick ONE channel and master it." }`
- `{ type: "guide", title: "Your first 10 customers", content: "If you can't name where you'll find your first 10 customers, you don't have a channel." }`
- `{ type: "nudge", title: "Start small", content: "You don't need a website. You need one customer. Start there." }`

**Success Message:** "You've completed Quest 3: Find Your Customers. You have a focused channel, a clear message, and a realistic acquisition plan."

---

#### Task 3.1: Choose Your Channel

**Title:** "Pick Your Channel"
**ID:** "mission4_quest3_task1"
**Sequence:** 1
**Execution Type:** standard-form
**Estimated Minutes:** 20
**Component Key:** "ChannelSelectionForm"
**Briefing:** "Where do your first 10 customers come from? Be specific. If you can't name the place, you don't have a channel."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/choosing-your-first-channel", title: "Choosing Your First Channel" }`
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/one-channel-first", title: "One Channel First" }`

**Reflection Prompt:** "Why did you pick this channel over all others? What makes it your best first bet?"

**On Success:** `{ grant_points: 20, badge_key: "CHANNEL_CHOOSER" }`

**Dependencies:** `["mission4_quest2_task2"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `customer_acquisition`

**Form Details:**
```ts
customer_source: {
  type: "textarea",
  label: "Where do your first 10 customers come from?",
  hint: "Be specific: 'Instagram DMs to local parents,' 'flyers at the gym,' 'cold email to designers on LinkedIn'",
  placeholder: "Instagram DMs to local coffee shop owners in my city",
  required: true
},
primary_channel: {
  type: "input",
  label: "Which ONE channel will you try first?",
  hint: "Focus. First-time founders die by trying five channels at once.",
  placeholder: "Instagram DMs",
  required: true
},
channel_rationale: {
  type: "textarea",
  label: "Why this channel? What makes it the best first bet?",
  hint: "Be honest. Is it because you know it? Because it's easy? Because your customers are there?",
  placeholder: "Coffee shop owners are active on Instagram. I can see who they are. I can DM them directly. It's free to start.",
  required: true
}
```

---

#### Task 3.2: Craft Your Message

**Title:** "Craft Your Message"
**ID:** "mission4_quest3_task2"
**Sequence:** 2
**Execution Type:** standard-form
**Estimated Minutes:** 15
**Component Key:** "MessagingForm"
**Briefing:** "What will you say? What's your exact offer or message? Why should they stop scrolling and buy today?"

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/crafting-your-first-message", title: "Crafting Your First Message" }`

**Reflection Prompt:** "Would you respond to this message? If not, rewrite it until you would."

**On Success:** `{ grant_points: 15, badge_key: "MESSAGE_CRAFTER" }`

**Dependencies:** `["mission4_quest3_task1"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `customer_acquisition`

**Form Details:**
```ts
offer_message: {
  type: "textarea",
  label: "What's your exact offer or message? (1 sentence)",
  hint: "Why should they stop scrolling and buy today?",
  placeholder: "I help coffee shop owners save 10 hours a week on social media. DM me 'coffee' for a free 15-minute audit.",
  required: true
},
call_to_action: {
  type: "input",
  label: "What's the call to action?",
  hint: "DM me, pre-order here, reply to this email, stop by my table",
  placeholder: "DM me 'coffee'",
  required: true
}
```

---

#### Task 3.3: Acquisition Assessment

**Title:** "Assess Your Plan"
**ID:** "mission4_quest3_task3"
**Sequence:** 3
**Execution Type:** standard-form
**Estimated Minutes:** 15
**Component Key:** "AcquisitionAssessmentForm"
**Briefing:** "Now let's be realistic. How many people do you need to reach for one sale? How many hours will you spend? What do you need to start?"

**References:**
- `{ type: "insights", isInternal: true, isRequired: false, url_link: "/resources/insights/acquisition-math", title: "Acquisition Math" }`

**Reflection Prompt:** "If this acquisition plan fails, what's your backup plan? Always have a Plan B."

**On Success:** `{ grant_points: 25, badge_key: "ACQUISITION_ASSESSOR" }`

**Dependencies:** `["mission4_quest3_task2"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `customer_acquisition`

**Form Details:**
```ts
reach_to_sale: {
  type: "input",
  label: "How many people must you reach to get 1 sale? (guess)",
  hint: "Conversion reality. If you need 1,000 views for 1 sale, Instagram might not be your channel.",
  placeholder: "50 DMs for 1 sale",
  required: true
},
hours_per_week: {
  type: "input",
  label: "How many hours per week will you spend on acquisition?",
  hint: "Time is a cost. If it's 20 hours for 2 sales, the math dies here.",
  placeholder: "5 hours/week",
  required: true
},
assets_needed: {
  type: "textarea",
  label: "What do you need to start acquiring?",
  hint: "Asset list. What do you need to buy, borrow, or build?",
  placeholder: "Instagram account (I have one), Canva for templates (I have), $20 for DMs outreach (budgeted)",
  required: true
}
```

---

### QUEST 4: The Financials

**ID:** "mission4_quest4"
**Title:** "The Financials"
**Objective:** Understand your costs, analyze the math, and check profitability.
**Estimated Time:** In-app: 60 mins | Off-app: 90 mins (with Excel)
**Context:** ["user_profile", "user_projects"]
**Success:** grant_points: 65, badge_key: "FINANCIAL_MASTER"

**Notes:**
- `{ type: "guide", title: "Use the Excel template", content: "We've provided an Excel template to help you work through the numbers. Use it alongside the app to do the detailed work." }`
- `{ type: "guide", title: "The math doesn't lie", content: "If the numbers don't work, the business doesn't work. Don't ignore the math." }`
- `{ type: "nudge", title: "Be honest with yourself", content: "First-time founders often underestimate costs and overestimate sales. Be brutal about the numbers." }`

**Success Message:** "You've completed Quest 4: The Financials. You understand your costs, your unit economics, and your profitability. The numbers tell a story—are you listening?"

---

#### Task 4.1: Cost Structure

**Title:** "What Does It Cost?"
**ID:** "mission4_quest4_task1"
**Sequence:** 1
**Execution Type:** standard-form
**Estimated Minutes:** 25
**Component Key:** "CostStructureForm"
**Briefing:** "Let's get real about costs. Don't guess—estimate as accurately as you can. We'll use these numbers to see if your business can make money."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/understanding-business-costs", title: "Understanding Business Costs" }`

**Reflection Prompt:** "Look at your costs. What surprised you? What could you reduce or eliminate?"

**On Success:** `{ grant_points: 20, badge_key: "COST_ANALYZER" }`

**Dependencies:** `["mission4_quest3_task3"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `financial_blueprint.costs`

**Form Details:**
```ts
// Section A: Materials & Production
raw_materials_per_unit: {
  type: "number",
  label: "Raw materials cost per unit",
  hint: "What does it cost to make one unit? If you're a service, this is $0.",
  placeholder: "0",
  min: 0,
  step: 0.01
},
manufacturing_cost_per_unit: {
  type: "number",
  label: "Manufacturing/production cost per unit",
  hint: "If you make it yourself, this is your time. If you outsource, this is their fee.",
  placeholder: "0",
  min: 0,
  step: 0.01
},
packaging_cost_per_unit: {
  type: "number",
  label: "Packaging cost per unit",
  hint: "Boxes, labels, wrapping, etc.",
  placeholder: "0",
  min: 0,
  step: 0.01
},
delivery_cost_per_unit: {
  type: "number",
  label: "Delivery/logistics cost per unit",
  hint: "Shipping, postage, delivery fees.",
  placeholder: "0",
  min: 0,
  step: 0.01
},

// Section B: Fixed Costs (Monthly)
equipment_costs: {
  type: "number",
  label: "Equipment costs (monthly)",
  hint: "Rentals, leases, depreciation—anything you pay monthly for equipment.",
  placeholder: "0",
  min: 0,
  step: 0.01
},
subscription_costs: {
  type: "number",
  label: "Software/Subscription costs (monthly)",
  hint: "Software, tools, memberships, hosting.",
  placeholder: "0",
  min: 0,
  step: 0.01
},
rent_costs: {
  type: "number",
  label: "Rent/workspace costs (monthly)",
  hint: "If you work from home, this is $0.",
  placeholder: "0",
  min: 0,
  step: 0.01
},
other_fixed_costs: {
  type: "number",
  label: "Other fixed costs (monthly)",
  hint: "Insurance, licenses, accounting, etc.",
  placeholder: "0",
  min: 0,
  step: 0.01
},

// Section C: People & Time
people_cost: {
  type: "number",
  label: "People cost per unit (if you hire someone)",
  hint: "If you pay someone to help deliver, what do they cost per unit?",
  placeholder: "0",
  min: 0,
  step: 0.01
},
your_time_hours: {
  type: "number",
  label: "Your time per unit (in hours)",
  hint: "How many hours does it take you to deliver one unit?",
  placeholder: "1",
  min: 0,
  step: 0.5
},
your_hourly_rate_goal: {
  type: "number",
  label: "What do you want to earn per hour?",
  hint: "Your target hourly rate. What's your time worth?",
  placeholder: "50",
  min: 0,
  step: 0.01
},

// Section D: Customer Acquisition
acquisition_cost_per_customer: {
  type: "number",
  label: "Customer acquisition cost (CAC)",
  hint: "From Quest 3: how much does it cost to get one customer?",
  placeholder: "0",
  min: 0,
  step: 0.01
},

// Auto-calculated (display only - with formula)
total_variable_cost_per_unit: {
  type: "display",
  label: "Total variable cost per unit",
  hint: "Formula: raw_materials + manufacturing + packaging + delivery + people_cost + acquisition_cost",
  value: "auto_calculated"
},
total_monthly_fixed_costs: {
  type: "display",
  label: "Total monthly fixed costs",
  hint: "Formula: equipment + subscriptions + rent + other_fixed",
  value: "auto_calculated"
},
your_time_cost_per_unit: {
  type: "display",
  label: "Your time cost per unit",
  hint: "Formula: your_time_hours × your_hourly_rate_goal",
  value: "auto_calculated"
}
```

---

#### Task 4.2: Cost Analysis

**Title:** "Understand Your Costs"
**ID:** "mission4_quest4_task2"
**Sequence:** 2
**Execution Type:** standard-form
**Estimated Minutes:** 20
**Component Key:** "CostAnalysisForm"
**Briefing:** "Now let's look at your costs differently. Fixed vs variable. What happens when you sell more?"

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/fixed-vs-variable-costs", title: "Fixed vs Variable Costs" }`

**Reflection Prompt:** "If you had to cut your costs in half, how would you do it? Would the customer experience suffer?"

**On Success:** `{ grant_points: 20, badge_key: "COST_UNDERSTANDER" }`

**Dependencies:** `["mission4_quest4_task1"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `financial_blueprint.cost_analysis`

**Form Details:**
```ts
// Auto-calculated (display only)
fixed_costs_monthly: {
  type: "display",
  label: "Fixed costs (monthly)",
  value: "auto_calculated"
},
variable_costs_per_unit: {
  type: "display",
  label: "Variable costs (per unit)",
  value: "auto_calculated"
},

// User input
economies_of_scale: {
  type: "textarea",
  label: "If you sold 10x more, which costs would stay the same and which would go down per unit?",
  hint: "Think about bulk discounts, automation, or efficiency gains.",
  placeholder: "Raw materials would get cheaper with bulk orders. My time per unit would decrease because I'd get faster.",
  required: true
},
biggest_cost_driver: {
  type: "textarea",
  label: "What's your biggest cost driver?",
  hint: "What single cost is eating up most of your revenue?",
  placeholder: "My time is the biggest cost. If I could automate, I'd save a lot.",
  required: true
},
cost_reduction_plan: {
  type: "textarea",
  label: "What's one thing you could do to reduce costs by 20%?",
  hint: "Be specific and realistic.",
  placeholder: "I could negotiate bulk pricing on materials if I order 3 months' worth at once.",
  required: true
}
```

---

#### Task 4.3: Profitability Check

**Title:** "Does the Math Work?"
**ID:** "mission4_quest4_task3"
**Sequence:** 3
**Execution Type:** standard-form
**Estimated Minutes:** 25
**Component Key:** "ProfitabilityCheckForm"
**Briefing:** "The moment of truth. Does your business make money? Let's run the numbers."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/unit-economics", title: "Unit Economics" }`

**Reflection Prompt:** "If you're not making a profit, what would need to change? More sales? Higher price? Lower costs? Be specific."

**On Success:** `{ grant_points: 25, badge_key: "PROFITABILITY_CHECKER" }`

**Dependencies:** `["mission4_quest4_task2"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `financial_blueprint.profitability`

**Form Details:**
```ts
// Auto-calculated (display only - with formulas)
price_per_sale: {
  type: "display",
  label: "Price per sale",
  hint: "From Quest 2: your proposed price",
  value: "from pricing.proposed_price"
},
total_cost_per_sale: {
  type: "display",
  label: "Cost per sale",
  hint: "Formula: total_variable_cost_per_unit + your_time_cost_per_unit",
  value: "auto_calculated"
},
profit_per_sale: {
  type: "display",
  label: "Profit per sale",
  hint: "Formula: price_per_sale - total_cost_per_sale",
  value: "auto_calculated"
},
sales_to_cover_fixed_costs: {
  type: "display",
  label: "Sales to cover monthly fixed costs",
  hint: "Formula: total_monthly_fixed_costs / profit_per_sale (rounded up)",
  value: "auto_calculated"
},
sales_to_pay_yourself: {
  type: "display",
  label: "Sales per month to pay yourself what you need",
  hint: "Formula: (total_monthly_fixed_costs + (your_hourly_rate_goal × 160 hours)) / profit_per_sale",
  value: "auto_calculated"
},
effective_hourly_rate: {
  type: "display",
  label: "Your effective hourly rate at target volume",
  hint: "Formula: (profit_per_sale × sales_to_cover_fixed_costs) / (your_time_hours × sales_to_cover_fixed_costs)",
  value: "auto_calculated"
},
setup_costs: {
  type: "display",
  label: "Total setup costs (one-time)",
  hint: "Sum of one-time expenses from Task 4.1",
  value: "auto_calculated"
},
sales_to_break_even_on_setup: {
  type: "display",
  label: "Sales to earn back your setup costs",
  hint: "Formula: setup_costs / profit_per_sale",
  value: "auto_calculated"
},

// User input
realistic_90_day_sales: {
  type: "number",
  label: "How many sales can you realistically make in 90 days?",
  hint: "Be honest. Look at your acquisition plan from Quest 3.",
  placeholder: "30",
  min: 0,
  required: true
},
monthly_fixed_costs_covered: {
  type: "select",
  label: "Can you cover your monthly fixed costs with realistic sales?",
  hint: "Look at your sales_to_cover_fixed_costs vs realistic_90_day_sales/3",
  options: [
    { value: "yes", label: "Yes, easily" },
    { value: "maybe", label: "Just barely" },
    { value: "no", label: "No, I can't" }
  ],
  required: true
},
hourly_rate_acceptable: {
  type: "select",
  label: "Is your effective hourly rate acceptable?",
  hint: "Compare to what you'd make in a job",
  options: [
    { value: "yes", label: "Yes, it's worth it" },
    { value: "maybe", label: "It's tight, but okay" },
    { value: "no", label: "No, I'd make more flipping burgers" }
  ],
  required: true
}
```

---

### QUEST 5: Go / No-Go / Iterate

**ID:** "mission4_quest5"
**Title:** "Go or No-Go"
**Objective:** Make a final decision based on the numbers.
**Estimated Time:** In-app: 20 mins | Off-app: 10 mins
**Context:** ["user_profile", "user_projects"]
**Success:** grant_points: 40, badge_key: "FINAL_DECISION"

**Notes:**
- `{ type: "guide", title: "The numbers don't lie", content: "This is the moment of truth. If the numbers don't work, the business doesn't work. Be honest with yourself." }`
- `{ type: "guide", title: "Iteration is okay", content: "If the numbers don't quite work, you can iterate. Change the price, change the MSP, change the channel. Just be specific about what you'll change." }`
- `{ type: "nudge", title: "No-Go is a win too", content: "Saying 'no' to a bad business is a win. You've saved yourself time, money, and stress. Take what you've learned to the next opportunity." }`

**Success Message:** "You've completed Mission 4: The Business Engine. You've made a conscious decision based on real numbers. This is what building a real business looks like."

---

#### Task 5.1: Make the Call

**Title:** "Make the Call"
**ID:** "mission4_quest5_task1"
**Sequence:** 1
**Execution Type:** standard-form
**Estimated Minutes:** 20
**Component Key:** "FinalDecisionForm"
**Briefing:** "You've done the work. You have the numbers. Now make a decision. No overthinking. Just pick."

**References:**
- `{ type: "guide", isInternal: true, isRequired: false, url_link: "/resources/guides/making-the-call", title: "Making the Call" }`

**Reflection Prompt:** "What did you learn from this financial exercise? If you're saying 'no' to this business, what did you learn that you'll take to the next one?"

**On Success:** `{ grant_points: 25, badge_key: "FINAL_DECISION" }`

**Dependencies:** `["mission4_quest4_task3"]`

**Storage Details:**
- **Table:** `user_projects`
- **Column:** `financial_blueprint.decision`

**Form Details:**
```ts
// Section A: Final Check (Auto-calculated)
profit_per_sale_positive: {
  type: "display",
  label: "Is your profit per sale positive?",
  hint: "If no, stop. You cannot scale a loss.",
  value: "auto_calculated"
},

// User input - Yes/No checks
profit_positive: {
  type: "select",
  label: "Is your profit per sale positive?",
  options: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" }
  ],
  required: true
},
break_even_90_days: {
  type: "select",
  label: "Can you break even within 90 days?",
  hint: "Longer than 90 days and first-time founders quit.",
  options: [
    { value: "yes", label: "Yes" },
    { value: "maybe", label: "Maybe" },
    { value: "no", label: "No" }
  ],
  required: true
},
hourly_rate_acceptable: {
  type: "select",
  label: "Is your effective hourly rate acceptable?",
  hint: "Would you be happy with this rate?",
  options: [
    { value: "yes", label: "Yes" },
    { value: "maybe", label: "It's okay" },
    { value: "no", label: "No" }
  ],
  required: true
},
cut_costs_50_percent: {
  type: "select",
  label: "If you cut costs by 50%, could you still deliver the MSP?",
  hint: "Stress test your business model.",
  options: [
    { value: "yes", label: "Yes" },
    { value: "maybe", label: "Maybe" },
    { value: "no", label: "No" }
  ],
  required: true
},
raise_price_50_percent: {
  type: "select",
  label: "If you raised prices by 50%, would anyone still buy?",
  hint: "Pricing power test from Quest 2.",
  options: [
    { value: "yes", label: "Yes" },
    { value: "maybe", label: "Maybe" },
    { value: "no", label: "No" }
  ],
  required: true
},
biggest_failure_risk: {
  type: "textarea",
  label: "What's the single biggest reason this might fail financially?",
  hint: "Be honest. This is for you.",
  placeholder: "If coffee shops go out of business, I have no customers. Or: If I can't make 30 sales in 90 days, I won't break even.",
  required: true
},

// Section B: Decision
decision: {
  type: "select",
  label: "What's your decision?",
  options: [
    { 
      value: "go", 
      label: "Go - The numbers work. I'm building this."
    },
    { 
      value: "iterate", 
      label: "Iterate - The numbers don't quite work. I need to change something."
    },
    { 
      value: "no_go", 
      label: "No-Go - The numbers don't work. I'm moving on."
    }
  ],
  required: true
},

// Section C: If Iterate (Conditional)
iteration_changes: {
  type: "textarea",
  label: "What exactly will you change?",
  hint: "Be specific. Not 'I'll try harder.' What will you actually do differently?",
  placeholder: "I'll cut my price from $97 to $67 and reduce my time per unit by automating scheduling.",
  conditional: "decision == 'iterate'"
},
iteration_count: {
  type: "number",
  label: "Iteration count",
  hint: "How many times have you iterated on this business idea? If you're on #5, something deeper is wrong.",
  placeholder: "1",
  min: 0,
  conditional: "decision == 'iterate'"
},

// Section D: AI Recommendations (Display only - after decision)
ai_recommendation: {
  type: "display",
  label: "AI Recommendation",
  hint: "Based on your numbers and decision, here's what we suggest.",
  value: "ai_generated"
}
```

---

### AI Decision Logic for Task 5.1

When a user makes a decision, the AI analyzes the scenario and provides recommendations:

```typescript
// AI Recommendation Logic

type AIRecommendationInput = {
  decision: "go" | "iterate" | "no_go";
  profit_per_sale: number;
  break_even_90_days: "yes" | "maybe" | "no";
  hourly_rate_acceptable: "yes" | "maybe" | "no";
  biggest_failure_risk: string;
  iteration_count: number | null;
};

type AIRecommendationOutput = {
  recommendation: string;
  suggested_action: "proceed" | "scrap_pick_new" | "revalidate_solution" | "rework_offer" | "warning";
  message: string;
};

// Example Logic:
// If decision = "no_go":
//   - Check if there are other opportunities from Mission 2
//   - Suggest going back to Mission 2 to pick a different opportunity
//   - "Based on your numbers, this business might not be viable. Consider returning to Mission 2 to explore other opportunities you identified."

// If decision = "iterate" AND iteration_count >= 3:
//   - "You've iterated 3+ times. The problem might be deeper than price or features. Consider revalidating the problem with customers."

// If decision = "iterate" AND profit_per_sale <= 0:
//   - "Your profit per sale is negative. Consider reworking your offer or significantly reducing costs."

// If decision = "go":
//   - "Your numbers look promising. Proceed to Mission 5 to build your launch plan."
```

---



---

### Complete Badge List for Mission 4

| Badge Key | Name | Earned In |
|-----------|------|-----------|
| OFFER_DEFINER | Offer Definer | Quest 1 (All tasks) |
| VALUE_PROMISE | Value Promise | Task 1.1 |
| FEATURE_BRAINSTORMER | Feature Brainstormer | Task 1.2 |
| FEATURE_PRIORITIZER | Feature Prioritizer | Task 1.3 |
| EXPERIENCE_MAPPER | Experience Mapper | Task 1.4 |
| PRICE_SETTER | Price Setter | Quest 2 (All tasks) |
| PRICE_NAMER | Price Namer | Task 2.1 |
| PRICE_ASSESSOR | Price Assessor | Task 2.2 |
| ACQUISITION_PLANNER | Acquisition Planner | Quest 3 (All tasks) |
| CHANNEL_CHOOSER | Channel Chooser | Task 3.1 |
| MESSAGE_CRAFTER | Message Crafter | Task 3.2 |
| ACQUISITION_ASSESSOR | Acquisition Assessor | Task 3.3 |
| FINANCIAL_MASTER | Financial Master | Quest 4 (All tasks) |
| COST_ANALYZER | Cost Analyzer | Task 4.1 |
| COST_UNDERSTANDER | Cost Understander | Task 4.2 |
| PROFITABILITY_CHECKER | Profitability Checker | Task 4.3 |
| FINAL_DECISION | Final Decision | Quest 5 (All tasks) |
| DECISION_MAKER | Decision Maker | Task 5.1 |

---

### Summary

| Quest | Tasks | Points | Badges |
|-------|-------|--------|--------|
| Quest 1: Shape Your Offer | 4 | 75 | 5 |
| Quest 2: Price It Right | 2 | 50 | 3 |
| Quest 3: Find Your Customers | 3 | 60 | 4 |
| Quest 4: The Financials | 3 | 65 | 4 |
| Quest 5: Go / No-Go / Iterate | 1 | 40 | 2 |
| **Total** | **13** | **290** | **18** |

---

