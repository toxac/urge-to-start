# Optimising Program missions 
I am developing an web app for first time entrepreneur called "urge". App aim to demystify entrepreneurship and make it more pragmatic and approchable. The app has core program which is structured as missions -> quests -> tasks designed to take user through a logical steps to actually starting a business. I have developed the missions as playbook which define behaviour, context, behaviour and component. I am looking to improve them to remove redundancies, reshuffle for better flow (such that it follows logical and clear progression), make it simple so that anyone can follow and have success startinng a business. I have laid out things we need to address in form of sprints below and have provided the broader urge context. 

## To do
### Sprint 1
1. Evaluate all the missions for redundancies, duplication, complexity and bloat ( attached mission playbooks)
2. Finalized action plan for optimization and restructure

### Sprint 2
1. I will give you all the task form one mission at a time with database schema where data is goin to be saved.
2. Extract types from json fields and put together a clear plan for data. We will evaluate data plans specially in context of new tables i have planned to projects and operations. 

### Sprint 3 
1. Fix the forms and data one mission at a time 

## Urge Context
 First time entrepreneurs find it very difficult to succeed today because of the reasons below.

### Reasons People Fails to start a business
- Interia: Difficulty in even getting started
- Analysis Paralysis: Information overload and belief that they need to have all their plan perfect
- Mindset: Hesitation to ask people, and fear of rejection stops most from going out of their comfort zone
- Knowhow: There is lots of information, guides but knowing how and when to do what is quite subjective
- Unreal goals
- venture capital and investment trap: everyone seems to be trying to build what venture caps want to fund

### How Urge Aims to solve this
- First Principles of business: Urge on purpose tries to focus on things that matter and look at everything from first-principles. No matter what users are hoping to build be it a next social network or a local cake business.
- No jargon, gate-keeping: Simple language, simple structure.
- Mindset First: Emphasis on building mindset through real world challenges, which gives users first taste of stepping out the comfort zone by asking people and handling rejection.
- Built for action: Urge takes away all the parts which gets users in a analysis mess. keep them focossed through simple tasks in sequence without worrying too much about what will comes next.
- Structured Program: urge program is structured as mission (larger goals) and quests (single focus objectives), they are designed to be practical, approachable and action oriented. mission are sequential as one would approach a business and make users build their business as they go through the peogram (refer to playbook)  
- Commitment Device: Urge makes users find a cheer squad who follow their progress and hold them accountable
- Network: Network of future founders, mentors, industry experts that will help users solve problems, find collaborators and expertise they can leverage.
    - find collaborators
    - test their products internally before public launch
    - find help and support
    - find solutions and expertise tailored for startup for hire
- Marketplace: This two distinct purpose
    1. place for users to launch their product and services internally before launching to public. this give them chance to gain some early customers, validate and test.
    2. a place for providers to list products for founders (custom/tailored offering which works for people starting their business). 
- Events :
    1. Program related events related to missions
    2. Public events
    3. pop-up sales
    4. Frequently standups

### big questions we have worked hard to answer/solve
- How to make things simple and approachable?
- How to keep it real?
- how to make something that actually gets users to build something rather than know about it?
- How not to end up becoming an online course?
- How to design data and ui to minimize the unnecessary cognitive load
- How to make it apparoachable and fun?
- Will we ourselves use this framework/program for our next business?

### Monetisation
- Program enrollment fees (includes one year of network membership)
- Yearly network membership fees (same for users, mentors, providers)
- Urge will not take commissions from marketplace listings but will have a vetting process for listings. 

### The Urge Manifesto

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


## Features and app routes
- app/(marketing): no auth needed open to all
    - app/(marketing)/page.tsx - Main homepage
    - app/(marketing)/blog - Open blog pages
    - app/(marketing)/feeds - public feeds from users (content/ launches, events etc)
    - app/(marketing)/open-events - Events open to public
    - app/(marketing)/code-of-conduct
    - app/(marketing)/privacy
- app/(platform): Authenticated user area
    - app/(platform)/checkout - payments
    - app/(platform)/dashboard - main dashboard for all registered users
    - app/(platform)/events - events
    - app/(platform)/marketplace - listing of products and services for users such as packages, legal, marketing, infrastructures etc
    - app/(platform)/mentors - official mentors
    - app/(platform)/network - network main page
    - app/(platform)/program - core program that will guide users through their journey to build businesses. Its designed as simple approachable missions and quests. Mission sets up the broad goal while quests through embedded tasks complete singural objectives towards the goal
        - app/(platform)/program/page.tsx - program dashboard
        - app/(platform)/program/mission/[id]/page.tsx - mission detail page
        - app/(platform)/program/quest/[slug]/page.tsx - quest details page with task components
- app/auth - authentication pages
    - app/auth/page.tsx -> main authentication page with login and signup components
    - app/auth/forgot-password