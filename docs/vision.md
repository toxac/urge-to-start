
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


## Notes
- Language should be as someone would speak to a friend, direct, practical and simple
- Avoid Jargons, Silicon Valley Terms and trying hypes
- Everything should be pragmatic and practical about the quests and tasks.
- Keep tasks simple and apparoachable. I want it to be first principle approach to business.
