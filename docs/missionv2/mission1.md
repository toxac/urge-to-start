# Mission 1 : Beg. Borrow. Steel.
**Blockers addressed:** I don't know if i can do this
**Big Question:** "
**Playbook config Fields:**
  - id: mission-1
  - title: Beg.Borrow.Steel
  - content: null // only to be populated in db 
  - content_path: "content/missions/mission1/mission.md"
  - sequence: 1
  - video_url : "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm"
  - big_question : Am I ready to start?
  - estimated_time_in_days : number;
  - quests : see sections below
  - context: ["user_profile]
---

**Comments**
- remove the notes from mission and add it to quests 
- remove the ai_config from quest and add it to taks, we will not have active generation from quest page



## Quest 1: The New Beginning
  - id: "mission1_quest1"
  - title: string;
  - content_path: "content/missions/mission1/quests/starting-your-new-chapter.md"
  - content: null
  - video_url : "https://evkkxeuiszjpzjpcmkwe.supabase.co/storage/v1/object/public/mission_videos/test.webm"
  - sequence: 1
  - estimated_in_app_minutes: number;
  - estimated_off_app_minutes: number;
  - context: ["user_profile]
  - on_success: 
      - grant_points: 50
      - badge_key: "PATHFINDER"
  - challenges: ChallengeSchema[] | null;
  - tasks: refer the tasks below
  - notes: null


- id: "mission1_quest1"
- title: The New Beginning
- description: not required, we will only use content from content_path
- content_path: "content/missions/mission1/quests/starting-your-new-chapter.md"
- sequence: 1
- estimated_in_app_minutes: 45,
- estimated_off_app_minutes: 0,
- content: only for populating markdown from content_path
- required_context: ["user_profiles"]
- ai_config: 
  - role: "SYSTEM_CONDUCTOR",
  - persona_name: "The Mindset Coach",
  - persona_prompt: "You are a grounded advisor and a supportive friend. Review user motivations and roadblocks in path to starting a business. Call out vague answers kindly, and help them turn big dreams into everyday actions.",
  - required_context: ["user_profiles"],
  - on_success: 
    - grant_points: 50,
    - badge_key: "PATHFINDER"
        

### Task 1 : Why Start? 
- id: "m1_q1_t1_drivers"
- title: Why start
- sequence: 1
- type: standard-form
- observation_type: none
- estimated_minutes: 15
- description: "Let's be totally honest. Building a business takes serious energy, and vague goals fade the moment life gets busy. What is the actual change you want to make in your life?"
- mission_id: "mission1"
- quest_id: "mission1_quest1"
- execution_environment: null,
- checkback_delay_days: null,
- recurring: null,
- interval: null,
- references: [],
- component_key: "MotivationForm"


### Task 2: Commit to it
- id : "m1_q1_t2_commitments"
- title: Commit to it
- sequence: 2
- type: standard-form
- observation_type: none
- estimated_minutes: 15
- description: "Let's get real about your schedule and the roadblocks you are working around. This is about being honest with yourself so you can actually make progress.",
- mission_id: "mission1"
- quest_id: "mission1_quest1"
- execution_environment: null,
- checkback_delay_days: null,
- recurring: null,
- interval: null,
- references: [],
- component_key: "CommitmentForm"


### Task 3: Meet others like you
- id : "m1_q1_t3_profile"
- title: Meet others like you
- sequence: 3
- type: standard-form
- observation_type: none
- estimated_minutes: 15
- description: "Let's get real about your schedule and the roadblocks you are working around. This is about being honest with yourself so you can actually make progress.",
- mission_id: "mission1"
- quest_id: "mission1_quest1"
- execution_environment: null,
- checkback_delay_days: null,
- recurring: null,
- interval: null,
- references: [],
- component_key: "IntroductionForm"

## Quest2: Ask & You Shall Receive

- id: "mission1_quest2"
- title: Ask & You Shall Receive
- content_path: "content/missions/mission1/quests/art-of-asking.md"
- sequence: 2
- estimated_in_app_minutes: 30,
- estimated_off_app_minutes: 120,
- content: only for populating markdown from content_path
- required_context: ["user_profiles"]
- ai_config: 
  - role: "SYSTEM_CONDUCTOR",
  - persona_name: "The Mindset Coach",
  - persona_prompt: "You are a copy editor helping user overcome hurdle of asking for things and fear of rejection. Review message drafts. Highlight hesitant filler words like 'just checking in' or 'sorry to bother you', and suggest more confident alternatives."
  - required_context: ["user_profiles"],
  - on_success: 
    - grant_points: 50,
    - badge_key: "COMMUNICATOR"

----
# Additional Notes For mission 1

## Data
### task - "m1_q1_t1_drivers"
data will be saved in profile.motivations field with following details 

```ts
const form_fields= [
      {
        id: "pushDrivers",
        type: "checkbox_group",
        label: "What are you running from?",
        description: "Select the strongest forces pushing you away from your current reality.",
        maxSelections: 3,
        required: true,
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
      {
        id: "pushOther",
        type: "text",
        label: "Please specify",
        placeholder: "What else is pushing you?",
        dependsOn: { field: "pushDrivers", value: "other" },
        required: false
      },
      {
        id: "pullDrivers",
        type: "checkbox_group",
        label: "What are you running toward?",
        description: "Select the strongest visions pulling you into the future.",
        maxSelections: 3,
        required: true,
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
      {
        id: "pullOther",
        type: "text",
        label: "Please specify",
        placeholder: "What else are you running toward?",
        dependsOn: { field: "pullDrivers", value: "other" },
        required: false
      },
      {
        id: "urgencyDrivers",
        type: "checkbox_group",
        label: "Why now?",
        description: "What happens if you wait 5 more years?",
        maxSelections: 2,
        required: true,
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
      {
        id: "urgencyOther",
        type: "text",
        label: "Please specify",
        placeholder: "Why else now?",
        dependsOn: { field: "urgencyDrivers", value: "other" },
        required: false
      },
      {
        id: "whyOneLiner",
        type: "text",
        label: "Sum it up in one sentence",
        description: "This will be your anchor. You'll see this on your dashboard.",
        placeholder: "I'm starting because...",
        required: true,
        minLength: 10,
        maxLength: 160
      }
    ]
  },

```

### task - "m1_q1_t2_commitments"


## Tasks
### type
I have changed this a bit to better suit new approach.
- standard-form: Generic form for one save action
- counter-form: where we are expecting more than one form
- action-form: where user have to take action off app and they just need to indicate they have completed the action
- community-form: Basically a form to post to user_posts table for community with a specific type

### References
I want to take off ai_config completely move the recommendation to references with type Reference[]
```ts
type Reference = {
  title: string;
  location: "internal"| "external";
  type: "insight" | "guide" | "tools" | "youtube" | "podcast"
  link_url: string;
}
```

### component_key
I am planning to have one form for each table and them based on the task render select fields

### Observation type 
We will use type with opportunities so it will be easy for us to render all entries in relevant form. As we are making observation its own feature. 
- opportunity-personal : For adding observation under personal problem
- opportunity-skill
- opportunity-people
- opportunity-broad
--- more in future
- default null





 
