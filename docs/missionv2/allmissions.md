# Broad Overview of all missions
## Mission 1: Beg.Borrow.Steel
- Refer to accompanying file for schema

### M1/Q1 - New Beginning (id: m1-q1/new-beginning)
#### M1/Q1/T1 - Why Start
I want users to reflect and think about what drives them. They need to write it explicitly so it reinforces the reason for them being here. 

**Details**
- Type:  standard-form
- Form Component: MotivationForm 
- Data: saves data to profile.motivations column json
- Fields
    - push (select) - Boos, Toxic work environment, Dead end, Potential, Autonomy, Other
    - push_other (text)
    - pull (select) - Wealth, Meaning, Time, Prove, Legacy, Community, Other
    - pull_other (text)
    - urgency (select) - Financial Cliff, Life Change, Deadline, Market, Age, Patience, Other
    - urgency_other 
    - why_statement (text)

**Notes**
After the complte the form we should show them stories from other founder which match their to further give them confidence. This will be links to blog post about starting stories. 

#### M1/Q1/T2 - Your Commitment
User have to make commitment of both time and resources to themsaelves. So that they think about it practically

**Details**
- Type: standard-form
- Form Component: CommitmentForm
- Data: User input gets saved in profile.commitment field
- Fields
    - time_to_launch (total time in months the want to give themselves to start)
    - weekly_hours - total hours they want to commit to this 
    - capital - How much money can they commit

**Notes**
We dont want to make user pick a time block or when they want to work at this point. What we want to do is make them commit to launch date and weekly hours. We can calculate if the weekly hours adds up to the launch date considering buffers.

#### M1/Q1/T3 - Roadblocks
What do users think is or would become a big roadblock for them in their Journey.

**Details**
- Type: standard-form
- Form Component: RoadBlockForm
- Data: save to profiles.roadblocks json as array
- Fields
    - roadblocks (multi select) - full time job, family, health, finance, age, skills, energy, other
    - roadblocks_other

**Note**
We want to show appropriate resources how to deal with specific roadblock and some general things to do before they start working on a business

### M1/Q2 - Resources
We want users to take stock of their resources social, professional, expertise etc

#### M1/Q2/T1 - Social resource
I want users to look at what is their social capital, how many followers/connections they have on social networks, what clubs they are part of, professional networks etc. I want them to realise that they arent starting from nothing.

**Details**
- Type: standard-form
- Form Component: SocialCapitalForm
- Data: profiles.social_footprint (json)
- Fields (array of)
    - type - platform, clubs, professional network, etc
    - name - 
    - profile_link_url (optional)
    - total_connections

#### M1/Q2/T2 - skills and expertise
I want to have them list things they are good at. This would both give us better context for AI later for targetted recommendations. This would also become good to see user as resource for the community.

**Details**
- Type: standard-form
- Form Component: SkillsForm
- Data: saves to profiles.skills field
- Fields not really sure yet

**Notes**
I want this to be simple not like a resume but something that would give a sense of capability both for the system as well as for others in the community.

#### M1/Q2/T3 - Urge community as a resource
we want users to create their first community post introdcing themselves

**Details**
- Type - standard-form
- Form Component: CommunityIntroForm
- Data: will be saved to profiles.bio and user_post (type : intro)
- Fields
    - title
    - content

### M1/Q3 - Ask and you shall recieve
Making them comfortable asking and approaching people and handling rejection.
We also want to add few challenges which are not part of the standard sequence but users can take those while they finich this quest. 

#### M1/Q3/T1 - Ask For A Discount

**Details**
- Type - action-form
- FormComponent - ActionForm 
- Data - No data is saved only progress is saved in user_progress table
- metadata -
    - reflection_prompt

**Notes**
- Action form has optional reflection built in. So after users complete (click i have completed this button) we want to show the reflection dialog and Ai can give feedback and give them an option of posting it to user_posts.


#### M1/Q3/T2 -Your first real ask
I wan tusers to send request for people to be part of their squad and hold them accountable to the commitments they have made.

**Details**
- Type: standard-form
- Form Component: SquadForm
- Data: data gets stored in people table 
- Fields
    - name
    - email
    - category (string array) "squad"
    - status

**Notes**
- Invites: When users send out email, we will add link for people to confirm, so when they click it we will update the status.
- people table -> we want to use one table for all the external people connected to the user as they all are prospective customers. These will have categories of squad, lead, customer, mentor etc


### M1/Q4 Hearing Nos

#### M1/Q4/T1 - Getting 5 nos

**Details**
- Type: action-form
- Form Component: ActionForm


#### M1/Q4/T2 - Staying Bouyant
Handling rejection a simulation based on their reflections 

---

## M2 - Mission : Discovery

### M2/Q1 - Mining Yourself
We will have users do it in two steps, first task to observe and record and then validate and add to user_opportunities table 

#### M2/Q1/T1 - Personal Frustations

We will use universal observation form and pass the related information using additional_context field

**Details**
- Type: observation-form
- Form Component: ObservationForm
- Data: User input gets saved in user_opportunities table
- Fields
    - title 
    - content
- additional_context:
    - source_type: 'opportunity_personal_frustration'
    - observation_propmt: string
    - program_item_type: "task"
    - program_item_id: "M2/Q1/T1"
- references: reference blog - how to observe your day



**Notes**
this form will list all the observation which have program_item_id as the current. We will only need to do it with task context because all observation happen in task context.


#### M2/Q1/T2 - Your Skills

**Details**
- Type: observation-form
- Form Component: ObservationForm
- Data: User input gets saved in user_opportunities table
- Fields
    - title 
    - content
- additional_context:
    - source_type: 'opportunity_skills'
    - observation_propmt: string
    - program_item_type: "task"
    - program_item_id: "M2/Q1/T2"
- dependencies : []
- ai_config: //no ai assesssment required here
    - role: string
    - prompt: none
    - context:
- references: reference blog - monetizable skills key questions to ask

#### M2/Q1/T3 - Oprtunities from your life
we want to list all the observations for M2/Q1/T2 and M2/Q1/T1(use dependencies to pull up data from user_observation using program_item_id for tasks). Have a button to add as opportunity which will open a dialog for ai synthesis and formatting the observation as opportunity to be added straight to user_opportunities table. 

**Details**
- Type: standard-form
- Form Component: ObservationOpportunityForm
- Data: User input gets saved in user_opportunities table
- Fields
    - title 
    - content
- program_context:
    - source_type: null
    - observation_propmt: null
    - program_item_type: null
    - program_item_id: "M2/Q1/T3"
- dependencies : ["M2/Q1/T2", "M2/Q1/T1"]
- ai_config: //no ai assesssment required here
    - role: "Business Analyst"
    - prompt: "Analyse the observations user has made and give user your assessment with following criteria and output result"
- references: 

### M2/Q2 - Zone of influence
#### M2/Q2/T1 - Observe
#### M2/Q2/T3 - Validate

### M2/Q3 - Broader Search

#### M2/Q3/T1 - Places to look
#### M2/Q3/T2 - Validate and add

### M2/Q4 - Picking the right opportunity

#### M2/Q4/T1 - Scoring

#### M2/Q4/T2 - Rank and pick










# Types

## mission/quest/tasks

```ts

// program_missions table
type MissionSchema  = {
    id: string;
    title: string;
    content: string | null; 
    content_path: string;
    sequence: number;
    notes : NoteSchema[] | null;
    video_url : string | null;
    big_question : string | null;
    estimated_time_in_daya : number;
    quests : QuestSchema [];
}

// program_quests table
type QuestSchema = {
    id: string;
    title: string;
    content_path: string;
    sequence: number;
    estimated_in_app_minutes: number;
    estimated_off_app_minutes: number;
    content: string |null;
    required_context: string[] | null;
    ai_config: AIConfigSchema;
    challenges: ChallengeSchema[] | null;
    tasks: TaskSchema[];
}

type AIConfigSchema = {
    role: string;
    persona_name: string;
    persona_prompt: string;
    required_context: string[] | null;
    on_success: {
        grant_points: number;
        badge_key: string;
    }
}

type ChallengeSchema = {
    title: string;
    description: string;
    link: string;
}

// program_tasks table
type TaskSchema = {
    id: string;
    title: string;
    sequence: number;
    type: string;
    observation_type: string | null;
    estimated_minutes: number;
    briefing_text: string;
    mission_id: string;
    quest_id: string;
    execution_environment:string | null;
    checkback_delay_days: number | null;
    recurring: boolean | null;
    interval: number | null;
    references: ReferenceSchema[];
    component_key: string;
    reflection_prompt: string | null;
    program_context: json;
    ai_config: json;
    dependencies: string[]| null;
}

type ReferenceSchema = {
    type: "insights" | "guide" | "tools" | "youtube" | "podacst" | "book" | "other";
    isInternal: boolean;
    url_link: string;
    title: string;
}

// user_progress table
type UserProgress = {
    completed_at: string | null;
    created_at: string ;
    id: string ;
    item_type: Database["public"]["Enums"]["program_item_type"];
    mission_id: string | null;
    project_id: string | null;
    quest_id: string | null;
    reflection: Json;
    status: Database["public"]["Enums"]["progress_status"];
    task_id: string | null;
    updated_at: string;
    repeat_at: string | null; // when user iterates this step
    user_id: string;
    additional_data: json;
}

type Database["public"]["Enums"]["progress_status"] = "not_started" | "in_progress" | "completed" | "repeat" ; // already in database

type Database["public"]["Enums"]["program_item_type"] = "mission" | "quest" | "task"
          

// user_observations table
type UserObservations = {
    id : string; //uuid auto
    user_id: string; //fk 
    title: string;
    source_type: ObservationSource; //enum
    content: string;
    program_item_type: Database["public"]["Enums"]["program_item_type"] | null;
    program_item_id: string | null;
    project_id: string | null;
    opportunity_id: string | null;
    context: json | null ;
    tags: string[] | null;
    created_at: string;  // date now()
    updated_at: string; // date now()
}

type ObservationSource = | 'opportunity_personal_frustration'
    | 'opportunity_skills'
  | 'opportunity_social_observation'
  | 'project_customer_interview'
  | 'project_competitor_research'
  | 'opportunity_market_trend'
  | 'online_forum'
  | 'product_review'
  | 'other' // not in database

// people_table  -> extending squad table to include all people

// user_opportunities table new
type UserContact = {
  id: string // uuid auto
  user_id: string // fk auth
  project_id: string // fk projects table

  // Basic Info
  email: string
  first_name: string
  last_name: string
  phone: string
  company: string
  job_title: string

  // Social
  linkedin_url: string
  instagram_username: string
  twitter_handle: string

  // Classification (for the founder's business)
  categories: UserContactCategory[]
  status: UserContactStatus // NOT NULL DEFAULT 'active'
  source: UserContactSource
  stage: UserContactStage

  // Internal notes (array for timestamped entries)
  notes: string[]

  // Communication tracking
  last_contacted_at: string
  next_follow_up_at: string

  // Flag for email lists
  opted_in_newsletter: boolean

  // Extra metadata (e.g., meeting summaries, custom fields)
  metadata: Record<string, any>

  // Timestamps
  created_at: string // date now()
  updated_at: string // date now()
}

type UserContactStatus = 'active' | 'inactive' | 'lost'

type UserContactSource =
  | 'personal_network'
  | 'social_media'
  | 'website_form'
  | 'referral'
  | 'outbound'
  | 'customer_interview'
  | 'partnership_outreach'
  | 'urge_community'
  | 'other'

type UserContactStage =
  | 'lead' // Raw contact—just met or just captured
  | 'interviewed' // Had a real customer interview (Mission 3)
  | 'engaged' // Follows your journey, replies to updates, warm
  | 'tester' // Actively using your alpha/beta product (Mission 6)
  | 'pre_sale' // Committed to buy (pre-sale, deposit, signed up)
  | 'customer' // Paid and actively using your product/service
  | 'advocate' // Loves it—gives referrals, testimonials, champions you
  | 'cold' // Went quiet, not responding to outreach
  | 'nurturing' // Keep in touch for later (not ready yet, but warm)

type UserContactCategory =
  | 'squad' // Cheer squad (Mission 1)
  | 'partner' // Business partner
  | 'tester' // Alpha/beta tester
  | 'presales' // Pre-sale customers
  | 'customer' // Paying customer


```



## profiles (profiles table)
```ts
type Profile = {
    username: string;
    bio ?: string; // populated from CommunityIntroForm
    country?: string;
    city?: string;
    gender?: string;
    age_group? : string;
    address?: string; // needs with purchase
    motivations ?: ProfileMotivationSchema;
    commitment ?: ProfileCommtimentSchema;
    roadblocks ?: ProfileRoadblockSchema;
    social_footprint : ProfileSocialFootprintSchema[] | null;
    assessment : ProfileAssessmentSchema[] | null;
    skills: ProfileSkills[] | null;
    provider_metadata?: json;
    mentor_profile?: json;
    currecncy?: string;
    fullname?: string;
    roles: roles: Database["public"]["Enums"]["user_platform_role"][];
    avatar_url?: string;
    onboarding_step?: string;
}

type ProfileSkills = { // M1/Q2/T2 - skills and expertise
    category: string;
    title: string;
    level: string;
}

type ProfileMotivationSchema = { //M1/Q1/T1 - Why Start
    push: string;
    push_other: string | null;
    pull: string;
    pull_other: string | null ;
    urgency: string;
    urgency_other: string | null
    why_statement: string;
}

type ProfileCommtimentSchema = { //M1/Q1/T2 - Your Commitment
    time_to_launch: number; // in months
    weekly_hours: number;
    capital: number | null;
}

type ProfileRoadblockSchema = { //  M1/Q1/T3 - Roadblocks
    roadblocks: string[] | null;
    roadblocks_other: string | null;
\
}

type ProfileSocialFootprintSchema = {  //M1/Q2/T1 - Social resource
    type: "platform" | "clubs" | "professional" | "network" | "other";
    name: string; 
    profile_link_url: string;
    total_connections: number | null;
}

type ProfileAssessmentSchema = {
    assessment_type: string;
    observation: string;
    recommendation: string[];
    score: number;
}

```
