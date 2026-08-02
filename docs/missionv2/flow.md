Here's the complete master flow with both Mission 1 and Mission 2:

---

## MASTER PROGRAM FLOW

### MISSION 1: Beg. Borrow. Steel.
*Big Question: "Am I ready to start?"*
*Estimated Time: 14 days*

---

**Quest 1: The New Beginning**
*Objective: Define your "why," make a commitment, and surface your fears.*

├── **Task 1.1: Why Start?** *(standard-form)*
│   └── Save to: `profiles.motivations`
│
├── **Task 1.2: Commit to the Journey** *(standard-form)*
│   └── Save to: `profiles.commitment`
│
└── **Task 1.3: Roadblocks** *(standard-form)*
    └── Save to: `profiles.roadblocks`

**Quest 2: What You've Got**
*Objective: Inventory your network and skills. Realize you're not starting from zero.*

├── **Task 2.1: Map Your Network** *(standard-form)*
│   └── Save to: `profiles.social_footprint`
│
└── **Task 2.2: Skill Inventory** *(standard-form)*
    └── Save to: `profiles.skills`

**Quest 3: Start Asking**
*Objective: Build the habit of asking—starting with safe asks and building up.*

├── **Task 3.1: Build Your Squad** *(off-task-action)*
│   └── Save to: `user_contacts` (category: "squad")
│
├── **Task 3.2: Say Hello** *(standard-form)*
│   └── Save to: Community post
│   └── Dependencies: Task 1.1
│
└── **Task 3.3: Ask for Something** *(log_counter - 1 ask)* ⬅️ First ask
    └── Save to: `user_progress` (log_data)
    └── Dependencies: Task 3.1
    └── target_count: 1

**Quest 4: No Is Just Data**
*Objective: Deliberately seek rejection to build resilience and reframe "no" as feedback.*

├── **Task 4.1: Practice Getting Nos** *(log_counter - 2 nos)* ⬅️ Rejection practice
│   └── Save to: `user_progress` (log_data)
│   └── target_count: 2
│
├── **Task 4.2: The Bold Ask** *(log_counter - 1 bold ask)* ⬅️ The big one
│   └── Save to: `user_progress` (log_data)
│   └── Dependencies: Task 4.1
│   └── target_count: 1
│
└── **Task 4.3: Rejection Mastery** *(standard-form)*
    └── Save to: `user_progress` (reflection)
    └── Dependencies: Task 4.2

---

### MISSION 2: Discovery
*Big Question: "What problem should I solve?"*
*Estimated Time: 21 days*

---

**Quest 1: Mine Yourself**
*Objective: Uncover problems from your own frustrations and skills.*

├── **Task 1.1: Spot Your Frustrations** *(observation-form)*
│   └── Save to: `user_observations`
│   └── observation_reference: { reference_table: "user_opportunities", category: "personal_problems" }
│   └── Users can add multiple observations
│
├── **Task 1.2: Turn Frustrations Into Opportunities** *(standard-form)*
│   └── Save to: `user_opportunities`
│   └── source_type: "personal_problems"
│   └── Dependencies: Task 1.1
│
├── **Task 1.3: Audit Your Skills** *(observation-form)*
│   └── Save to: `user_observations`
│   └── observation_reference: { reference_table: "user_opportunities", category: "skills" }
│   └── Users can add multiple observations
│
└── **Task 1.4: Skills as a Business** *(standard-form)*
    └── Save to: `user_opportunities`
    └── source_type: "skills"
    └── Dependencies: Task 1.3

**Quest 2: People Watching**
*Objective: Identify problems in your immediate circle—friends, family, colleagues.*

├── **Task 2.1: Be a Detective** *(observation-form)*
│   └── Save to: `user_observations`
│   └── observation_reference: { reference_table: "user_opportunities", category: "zone_of_influence" }
│   └── Users can add multiple observations
│
└── **Task 2.2: Spot the Opportunity** *(standard-form)*
    └── Save to: `user_opportunities`
    └── source_type: "zone_of_influence"
    └── Dependencies: Task 2.1

**Quest 3: The Wider World**
*Objective: Discover problems beyond your immediate circle—online communities, trends, and marketplaces.*

├── **Task 3.1: Search the Communities** *(standard-form)*
│   └── Save to: `user_opportunities`
│   └── source_type: "broader_search"
│
├── **Task 3.2: Ride the Trends** *(standard-form)*
│   └── Save to: `user_opportunities`
│   └── source_type: "broader_search"
│
└── **Task 3.3: The Marketplace Scanner** *(standard-form)*
    └── Save to: `user_opportunities`
    └── source_type: "broader_search"

**Quest 4: The Decision**
*Objective: Score, rank, and commit to one opportunity.*

├── **Task 4.1: Score Your Opportunities** *(standard-form)*
│   └── Save to: `user_opportunities.assessment`
│   └── Uses OpportunityAssessment schema
│   └── Users score each opportunity (1-5 on 5 criteria)
│   └── Shows all saved opportunities in a dialog
│
├── **Task 4.2: Pick Your Opportunity** *(standard-form)*
│   └── Save to: `user_opportunities.status` = "selected"
│   └── Dependencies: Task 4.1
│   └── Shows all opportunities with scores
│   └── User picks one to work with
│
└── **Task 4.3: Make It Official** *(standard-form)*
    └── Save to: `projects` (new project) OR `user_opportunities` (keep searching)
    └── Dependencies: Task 4.2
    └── Two options:
        ├── Option 1: Finalize → Create new project
        └── Option 2: Discover More → Return to discovery

---


## COMPLETE EXECUTION TYPE SUMMARY

| Execution Type | Mission 1 | Mission 2 | Total |
|----------------|-----------|-----------|-------|
| standard-form | 6 | 7 | 13 |
| observation-form | 0 | 3 | 3 |
| off-task-action | 2 | 0 | 2 |
| log_counter | 3 | 0 | 3 |
| **Total** | **11** | **12** | **23** |

---

## COMPLETE BADGE SUMMARY

### Mission 1 Badges (15 total)
| Badge Key | Name | Earned In |
|-----------|------|-----------|
| PATHFINDER | Pathfinder | Quest 1 |
| HONEST_SELF | Honest Self | Task 1.1 |
| ACTION_COMMITMENT | Action Commitment | Task 1.2 |
| ROADBLOCK_ACKNOWLEDGED | Roadblock Acknowledged | Task 1.3 |
| RESOURCEFUL | Resourceful | Quest 2 |
| NETWORK_MAPPER | Network Mapper | Task 2.1 |
| SKILL_AUDITOR | Skill Auditor | Task 2.2 |
| ASKER | Asker | Quest 3 |
| SQUAD_ASSEMBLED | Squad Assembled | Task 3.1 |
| COMMUNITY_MEMBER | Community Member | Task 3.2 |
| FIRST_ASK | First Ask | Task 3.3 |
| RESILIENT | Resilient | Quest 4 |
| NO_HUNTER | No Hunter | Task 4.1 |
| BOLD_ASKER | Bold Asker | Task 4.2 |
| REJECTION_MASTER | Rejection Master | Task 4.3 |

### Mission 2 Badges (16 total)
| Badge Key | Name | Earned In |
|-----------|------|-----------|
| SELF_AWARE | Self Aware | Quest 1 |
| FRUSTRATION_SPOTTER | Frustration Spotter | Task 1.1 |
| PROBLEM_REFORMER | Problem Reformer | Task 1.2 |
| SKILL_AUDITOR | Skill Auditor | Task 1.3 |
| SKILL_ENTREPRENEUR | Skill Entrepreneur | Task 1.4 |
| OBSERVER | Observer | Quest 2 |
| DETECTIVE | Detective | Task 2.1 |
| OPPORTUNITY_SPOTTER | Opportunity Spotter | Task 2.2 |
| WORLD_READY | World Ready | Quest 3 |
| COMMUNITY_EXPLORER | Community Explorer | Task 3.1 |
| TREND_SPOTTER | Trend Spotter | Task 3.2 |
| MARKETPLACE_SCANNER | Marketplace Scanner | Task 3.3 |
| DECISION_MAKER | Decision Maker | Quest 4 |
| SCORER | Scorer | Task 4.1 |
| OPPORTUNITY_PICKER | Opportunity Picker | Task 4.2 |
| COMMITTED | Committed | Task 4.3 |

---

## COMPLETE POINTS SUMMARY

| Mission | Quests | Tasks | Total Points | Points Per Task |
|---------|--------|-------|--------------|-----------------|
| Mission 1 | 4 | 11 | 295 | 26.8 |
| Mission 2 | 4 | 12 | 250 | 20.8 |
| **Total** | **8** | **23** | **545** | **23.7** |

---


