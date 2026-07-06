
# Urge Context
I am developing an web app for first time entrepreneur called "urge". App aim to demystify entrepreneurship and make it more pragmatic and approchable. First time entrepreneurs find it very difficult to succeed today because of the following:
- Interia: Difficulty in even getting started
- Analysis Paralysis: Information overload and belief that they need to have all their plan perfect
- Mindset: Hesitation to ask people, and fear of rejection stops most from going out of their comfort zone
- Knowhow: There is lots of information, guides but knowing how and when to do what is quite subjective
- venture capital and investment trap: everyone seems to be trying to build what venture caps want to fund

## The Urge Manifesto

**We reject the myth of the "overnight success."**

We reject the idea that a business is built for an exit, not for a customer. We are turning our backs on the venture capital circus, where the product is a pitch deck and the metric is hype. We believe that business, at its core, is profoundly human.

**We are returning to the fundamentals.**

We believe a business is a simple, beautiful equation: **Solve a real problem, for a real person, and get paid for it.**

We are the anti-thesis of the "solution in search of a problem." We don't fall in love with our ideas; we fall in love with the problems our customers have. We start not with a brilliant flash of inspiration, but with a quiet act of observation. We seek friction, frustration, and despair, because within them lie the seeds of the greatest opportunities.

**We are builders, not visionaries.**

We believe in the **Minimum Sellable Product (MSP)** over the Minimum Viable Product. We don't build to "validate" for investors. We build to sell. We don't test for "traction"; we test for trust. Our only true investors are our customers, and their currency is their time, their money, and their loyalty.

**We are doers, not analysts.**

Analysis paralysis is the silent killer of dreams. We trade endless spreadsheets for a single, focused experiment. We understand that the market is a living thing, not a theory to be proven. It speaks to those who are willing to listen—and the best way to listen is to act.

**We believe the journey starts from within.**

Before you can build a product, you must build a mindset. You need the right fuel. Money is not the fuel for a startup; it is the reward for a job well done. The true fuel is a deep, intrinsic urge: the urge to solve, to serve, and to build something of genuine value.

**Urge is not just an app. It is a compass.**

It’s for the pragmatist. The tinkerer. The person who is tired of waiting for permission and ready to just **start**. We don't offer a quick fix. We offer a clear path. We turn the overwhelming chaos of a startup into a series of simple, human-sized quests. We strip away the noise and bring you back to what matters: the customer, the problem, and the next action.

**This is a rebellion. Not against success, but against the hollow pursuit of it.**

We are here to make business approachable, enjoyable, pragmatic, and action-driven. We are here to help you build something that matters.

**This is The Urge. Listen to it. Let’s build.**

---

## Urge Solution:
- Commitment Device: Urge makes users find a cheer squad who follow their progress and hold them accountable
- Structured Program: urge program is structured as mission (larger goals) and quests (single focus objectives), they are designed to be practical, approachable and action oriented. mission are sequential as one would approach a business and make users build their business as they go through the peogram (refer to playbook)
- Challenges: some tasks inside quests are designed as challenges which get user out of their comfort zone. Lot of mindset quests use challenges as tool for mindset change. (refer to playbook)
- Network: Network of future founders, mentors, industry experts that will help users solve problems, find collaborators and expertise they can leverage.
- Marketplace: This two distinct purpose
    1. place for users to launch their product and services internally before launching to public. this give them chance to gain some early customers, validate and test.
    2. a place for providers to list products for founders (custom/tailored offering which works for people starting their business). 
- Events :
    1. Program related events related to missions
    2. Public events
    3. pop-up sales
    4. Frequently standups

## Monetisation
- Program enrollment fees (includes one year of network membership)
- Yearly network membership fees (same for users, mentors, providers)
- Urge will not take commissions from marketplace listings but will have a vetting process for listings. 


## Features
- program: core program that will guide users through their journey to build businesses. Its designed as simple approachable missions and quests. Mission sets up the broad goal while quests through embedded tasks complete singural objectives towards the goal
    - program is action focussed
    - built from personal experience and experience for over a decade of working with entreprenurs and businesses
    - program is designed in a way that user build their business in real through the missions.
- Events: Virtual and real events and regular standups to keep useers on track and motivated
- community: a collective of mentors, experts, users, solution providers
    - users posts, talking about their journey
    - forum to share insights, tools, resources etc
- Marketplace: 
    - Internal portal where user can launch their business for getting early users inside community and get validation
    - Listing of product and services from providers which is tailor made for people starting their business

## Program Content
program is structured in logical sequence and has core components of missions (broad goals) which has tasks (actions) arranged under quests (objectives under mission). 

Content is organized through playbook config which lays out following
- sequence of content
- where the markdown content is located for mission and quests
- AI config for recommendations, reflections etc
- mission has a page -> app/(platform)/program/mission/[id]/page.tsx
- quest has a page and the tasks are rendered on the quest page -> app/(platform)/program/quest/[slug]/page.tsx
- Tasks have dedicated component refer to "types/playbook.ts"
- Quest page has a companion AI which is located in the sidebars to  let users focus on the task. Companion is aware of the users profile and current progress mission/quest/tasks and does the following
    - in Mission context: shows users the prerequesites and lets them get more info on them if needed through llm call
    - in quest context
        - lets user plan out tasks and manage calendar
        - rewards points and badges on task completion
    - in Task context:
        - provides recommended reference blogs (and quick summary if they dont want to navigate to different page)
        - provides recommended external links
        - asks for reflections and thoughts on tasks where needed
        - can also provide input onn the tasks itself and user entries (planned)

### Mission1 : "Build Your Founder Mindset" (completed)
- Status: this mission is complete and should be used as reference for rest refer /lib/playbook/mission1.ts
- Goals: To help user undertand their motivations to start a business, condition their mindset, understand their constraints and resources and set goals.

### Mission2: "Find Problems Worth Solving"
- Status: I am working on it now and it needs lot of changes. the sequence of quests
- Goals: To help users observe problems and identify opportunities in those problems. The approach is start with what users understand the most (themselves) and progress towards lesser known ( people around them, broader market). This will help users focus on things they can handle and understand there by increasing chances ofg success from the get-go.

### Sequence of quests
1. quest 1: Your skills, pain and frustations: idea is to give user tools to understand their frustations and pains and what they do better than others around them. All the entries should be just entry in OpportunityForm (in app), rest will be observation off-app.
    1. Task 1: Your annoyances from the week ( off-app observation and note taking, we just have to leave them with questions for inquiry) maybe we need new type of task which if observation.
    2. Task 2: What are you better at than people around you. Give them questions to self reflect and ask them to inquire in their circle if others will pay for them to do any of it for them (off-app)
    3. Task3: Enter Identified opportunities from above two in form (in-app)
2. Quest 2: Your zone of influence, They will look at few groups of people in their circle, could be social groups, colleagues, classmates, clubmembers. focus on one group at a time and Observed their problems, check with them if the problem is real and what do they do to solve it now (manage/workaround)
    1. Task 1: Observe (off-app), observe not interact ( we will give them list of things to notice and questions to ask)
    2. Task 2: Interact to check if observation are valid and if these are real probelms
    3. task 3: Add to the opportunity list (in-app)
3. Quest 3: Broader search (Findinf problems through google trends, keywords research, reddit/facebook, marketplaces)
    1. task 1: trends and Keywords
    2. task 2: Social Networks and forum (reddit and Facebook)
    3. task 3: Marketplaces
    4. Task 4: enter opportunities
4. Quest 4 : Validate and Pick one
    1. Task1: Validation checklist for each identified opportunity form (in-app)
    2. Task2: Select one from validated and save that as project (form)
### Mission3: "Project's Viability": 
From here on we will work on project not that we have finalised one opportunity. We are goign to ask users to carry out some basic market research to understand customers, marketplace, regulations, permissions, supply and solutions.
1. Quest 1: Understanding Customers
2. Quest 2: Competition and Market Environment
3. Quest 3: Regulations and Permissions
4. Quest 4: Suitable Solution
5. Quest 5: Viability
### Mission4: "How will you make money"
Pricing, Channels, partners, Costs, Unit Economics, 
### Mission5: "The Legal Reality Check & Ways to Get Paid"
Admin, company, accounts, records
### Mission6: "Building Your Solution & Gathering Traction"
Developing solution, building market, POC, Testing, Pre-Sales, Landing Page
### Mission7: "The Public Launch & Market Engine"
Finding New customers, Selling, Marketing, Campaigns
### Mission8: "True Review & The Reality Crossroads"
Optimizing, retrospective, areas to improve, Big decisions

## Notes
- Language should be as someone would speak to a friend, direct, practical and simple
- Avoid Jargons, Silicon Valley Terms and trying hypes
- Everything should be pragmatic and practical about the quests and tasks.
- Keep tasks simple and apparoachable. I want it to be first principle approach to business.

## Tasks
1. Tell me if you have an understanding of what i am trying to create and the structure of the program.
2. Look at playbook missions (mission1) and other code and suggest quests and tasks for future missions. No code just brainstorm first.
2. Ask me if you need to refer to anything else (code) or if you have any clarifications. 



# Understanding Your Vision ✅

I've carefully reviewed your playbook structure, the complete mission1 implementation, and your detailed explanation of Urge's philosophy. I believe I have a solid grasp of what you're creating:

## What I Understand

**The Core Problem You're Solving:**
First-time entrepreneurs face a paralyzing gap between wanting to start and actually taking action. They're drowning in information but starved for practical, sequential guidance that respects their real-world constraints.

**The Urge Solution:**
You're building a pragmatic "operating system" for first-time founders that:
- Breaks the overwhelming chaos into **human-sized missions and quests**
- Forces **action over analysis** through structured challenges
- Builds **mindset through exposure** (asking, rejection, community)
- Uses **AI companions as pragmatic coaches**, not hype machines
- Treats customers as the **only valid investors**
- Emphasizes **Minimum Sellable Product** over Minimum Viable Product

**The Playbook Architecture:**
- **Missions**: Broad thematic goals with clear sequence
- **Quests**: Focused objectives under each mission  
- **Tasks**: Specific actions with clear types (form, simulator, log_counter, action, community)
- **AI Config**: Provides context-aware guidance, recommendations, and reflection prompts

**The Tone:**
Direct, friend-to-friend conversation. No jargon. No Silicon Valley hype. Pragmatic and actionable first principles.

---


## Mission 2: "Find Problems Worth Solving"


### Quest 1: "Your Own Frustrations" 
*Goal: Mine personal pain points and unique skills*

- **Task 1: The Week's Annoyances** (NEW TYPE: `observation`)
  - Component: `ObservationNotepad` gives broad overview, key questions and pdf to download as well as page to refer to
  - we should also have a config for a feature for each observation where users can share their observation with AI and ai will guid them through. We will provide the right context through prompt and liek reflection set it up so user can provide input.

- **Task 2: What's Your Superpower?** (observation), we will do the same pdf, AI suggestion like in task 1
  - Component: `SkillReflectionForm`  

- **Task 3: Enter Your Opportunities** (form)
  - Component: `OpportunityForm`

#### Quest 2: "People in Your Circle"
*Goal: Observe and validate problems of people you know*

- **Task 1: Observation Week** (observation)
  - Component: `SocialObservationLog`
  - PDF + AI Suggestion for observation

- **Task 2: The 'Is This Real?' Conversation** (action)
  - Component: `ValidationConversationWidget`
  - Description: "Now you've got some observations. Time to check if they're real. Ask each person: 'I noticed [problem]. Is that actually a thing for you? What do you do about it now?' Your job is to listen, not to sell. If they say 'that's not really a problem,' thank them and move on. If they light up and start complaining, you've found something."
  - Off-app, with reflection prompts

- **Task 3: Add to Opportunity List** (form)
  - Component: `OpportunityForm` (reused)

#### Quest 3: "The World Out There"
*Goal: Broader market signals*

- **Task 1: What's Trending?** (action)
  - Component: `TrendResearchWidget`
  - Description: "Let's see what people are actually searching for. Open Google Trends. Search 5 terms related to problems you're curious about. Look at Reddit—what are people complaining about in subreddits related to your interests? This isn't about copying trends. It's about finding patterns of unmet need."
  - Guided research prompts

- **Task 2: Where Do People Talk About It?** (action)
  - Component: `ForumResearchWidget`  
  - Description: "Check Facebook Groups, LinkedIn communities, industry forums. Are people asking questions that don't have good answers? Are they sharing hacks and workarounds? That's an opportunity."
  - Action with checkback

- **Task 3: What's Already Being Sold?** (action)
  - Component: `MarketplaceResearchWidget`
  - Description: "Go to Amazon, Etsy, or wherever relevant. Search for products related to your problem area. What do people complain about in the reviews? 'I wish this had...' 'If only it could...' Those complaints are gold."
  - Off-app research

- **Task 4: Consolidate Your List** (form)
  - Component: `OpportunityListReview`
  - Description: "You've got a list. It might be messy. That's fine. Review everything you've collected and add the best ones to your master opportunity list in the system."

#### Quest 4: "Pick Your Path"
*Goal: Select and commit*

- **Task 1: The Vibe Check** (form)
  - Component: `OpportunityScoringForm`
  - Description: "Look at your list. Here's the truth: you can't pursue all of them. Let's get real. For each opportunity, score it honestly:
    - Do I actually care about this problem? (1-10)
    - Do I know people who have this problem? (1-10)
    - Could I talk to them easily? (1-10)
    - Do I have any unfair advantage here? (1-10)
    - Is there a clear way I could get paid? (1-10)
  " 
  - Scoring matrix with reflection

- **Task 2: The Conversation** (action)
  - Component: `ConfirmationConversationWidget`
  - Description: "Take your top 3 opportunities. Go back to the people you spoke with. Say: 'I'm thinking about solving [problem]. Does this actually sound valuable to you? Would you pay for a solution?' If they hesitate or give you a 'maybe,' that's your answer. If they get excited, you're onto something."
  - Reflection prompt

- **Task 3: Save Your Project** (form)
  - Component: `ProjectCreationForm`
  - Description: "You've found it. The opportunity that passes the test. Save it as your project. This is your starting point. Everything from here on is about making this real."
  - Creates project entity in database

---

### Mission 3: "Project's Viability"
*Now they have a project—time to understand if it makes sense*

#### Quest 1: "Who Are Your Customers?"
- **Task 1: Customer Avatar** (form)
  - Description: "The people who have this problem—who are they really? Not 'everyone.' Be specific. Age? Work? What do they do on weekends? What frustrates them about this problem?"
  
- **Task 2: Talk to 5 Potential Customers** (action, checkback)
  - Description: "Find 5 people who fit your avatar. Ask them about the problem. Don't pitch. Just listen. Ask: 'How do you deal with this now?' 'What would you pay for a solution?' 'What would make this a no-brainer?'"

- **Task 3: What Did You Learn?** (form)
  - Description: "What surprised you? What did you get wrong? Update your understanding."

#### Quest 2: "Who Else Is Doing This?"
- **Task 1: Competitor Mapping** (form)
  - Description: "Who else is solving this? Direct competitors (same solution) and indirect (different solution, same problem). What do they charge? What do people complain about?"

- **Task 2: Your Unfair Advantage** (form)
  - Description: "Why you? What do you bring that others don't? Be honest. If you don't have one yet, that's okay—what could you build or learn to get one?"

#### Quest 3: "The Rules of the Game"
- **Task 1: What Do You Need Permission For?** (action)
  - Description: "Do you need a license? Insurance? Industry certifications? Talk to someone who's done this. Google it. Don't guess."

#### Quest 4: "What Will You Build?"
- **Task 1: The Minimal Solution** (form)
  - Description: "What's the smallest thing that solves the core problem? Not the dream solution. The thing that gets them from A to B. What could you build in 2 weeks that they'd actually use?"

#### Quest 5: "Does This Actually Make Sense?"
- **Task 1: Reality Check** (form)
  - Description: "Look at everything. Does this work? Can you actually do this with your time and money? Is there a path to getting paid? Be brutally honest. It's better to kill it now than 6 months from now."

---

### Mission 4: "How Will You Make Money?"

#### Quest 1: "What's It Worth?"
- Task: Customer pricing interviews (action + form)
- Task: Competitive pricing analysis (form)
- Task: Price range decision (form)

#### Quest 2: "Who Can Help You Sell?"
- Task: Partner mapping (form)
- Task: Channel exploration (action)

#### Quest 3: "The Numbers"
- Task: Cost calculation (form)
- Task: Unit economics (form)
- Task: Break-even point (form)

---

### Mission 5: "The Legal Reality Check"

#### Quest 1: "Setting Up Properly"
- Tasks for admin setup, company structure, basic accounting

#### Quest 2: "Getting Paid"
- Task: Payment setup (Stripe, bank, invoicing)
- Task: Basic contract template review

---

### Mission 6: "Building Your Solution"

#### Quest 1: "First Sellable Version"
- Task: Minimal build plan
- Task: Build week (with checkback)

#### Quest 2: "Pre-Sell"
- Task: Landing page setup
- Task: Waitlist/Pre-sale campaign
- Task: 10 conversations with potential buyers (action)

#### Quest 3: "Testing"
- Task: Feedback collection
- Task: Iteration based on feedback

---

### Mission 7: "The Public Launch"

#### Quest 1: "Getting Your First Customers"
- Task: Launch plan
- Task: Outreach to 20 potential customers
- Task: First 3 sales

#### Quest 2: "Tell the World"
- Task: Social launch
- Task: Community announcement

---

### Mission 8: "True Review"

#### Quest 1: "What's Working?"
- Task: Business review
- Task: Customer feedback review

#### Quest 2: "What's Next?"
- Task: Big decision: optimize, expand, or pivot?

---
