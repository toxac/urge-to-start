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

## Mission : Discovery






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
}

type ReferenceSchema = {
    type: "insights" | "guide" | "tools" | "youtube" | "podacst" | "book" | "other";
    isInternal: boolean;
    url_link: string;
    title: string;
}

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
    social_footprint ?: ProfileSocialFootprintSchema[];
    assessment ?: ProfileAssessmentSchema;
    provider_metadata?: json;
    mentor_profile?: json;
    currecncy?: string;
    fullname?: string;
    roles: roles: Database["public"]["Enums"]["user_platform_role"][];
    avatar_url?: string;
    onboarding_step?: string;
}

type ProfileMotivationSchema = {
    push: string;
    push_other: string | null;
    pull: string;
    pull_other: string | null ;
    urgency: string;
    urgency_other: string | null
    why_statement: string;
}

type ProfileCommtimentSchema = {
    time_to_launch: number; // in months
    weekly_hours: number;
    capital: number | null;
}

type ProfileRoadblockSchema = {
    roadblocks: string[] | null;
    roadblocks_other: string | null;
\
}

type ProfileSocialFootprintSchema = {
    type: "platform" | "clubs" | "professional" | "network" | "other";
    name: string; 
    profile_link_url: string;
    total_connections: number | null;
}

type ProfileAssessmentSchema = {

}

```
