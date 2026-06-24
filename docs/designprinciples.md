

##  Urge Design Guide (Principles & Application)

### The 8 Core Design Principles (Urge Edition)

#### 1. Emphasis: The "Single Action" Rule
- **Definition:** The most important element on any page must be the single, specific action the user must take right now.
- **Application:** The Active Task input and its primary CTA occupy **70% of the viewport height**. The page title, progress indicators, and navigation are demoted to thin, low-contrast strips at the very edges.
- **Anti-Pattern:** Never show a list of all tasks with equal visual weight. If the user can see 5 things to do, they will do 0.

#### 2. Balance: Asymmetrical Action
- **Definition:** Balance is achieved not by symmetry, but by distributing visual weight dynamically.
- **Application:** The Mission page (pure content) uses symmetrical, centered text (poetic, formal). The Quest page (pure action) uses asymmetrical layout—the task card is flush-left, but the "Back" button and progress indicator are top-right. This subtle imbalance signals *movement* and *progress*.
- **Anti-Pattern:** Centering everything on the Quest page. Centering implies "read this." Flush-left implies "do this."

#### 3. Contrast: The "Urge Orange" Rule
- **Definition:** Contrast drives action and legibility.
- **Application:** 
  - Background: Warm Off-White (`#F9F7F4`)
  - Text: Deep Charcoal (`#1A1A1A`)
  - Primary CTA: **Urge Orange** (`#E86A33`) – used *exclusively* for the final action button. No other element (icons, borders, highlights) uses this color.
  - Secondary Info: Muted Stone (`#8C8580`)
- **Anti-Pattern:** Using the accent color for decorative elements (icons, dividers, backgrounds). This dilutes its power.

#### 4. Repetition: The Atomic Component Library
- **Definition:** Reuse the same visual elements to build familiarity and reduce cognitive load.
- **Application:** The `<UrgeCard>` is the only container. It has a thin top border, generous padding, and a subtle shadow. It is used for:
  - The Active Task
  - The Companion Drawer
  - Mission briefings
  - Completed task summaries (collapsed)
- **Anti-Pattern:** Building unique card styles for different pages. The user should never learn a new visual language.

#### 5. Proportion: The "Tiny Top Bar" Rule
- **Definition:** Scale indicates importance. The more prominent an element, the more attention it demands.
- **Application:**
  - **Mission Title:** Large, Serif, Poetic (e.g., 2.5rem).
  - **Quest Title:** Medium, Sans-Serif, Utilitarian (e.g., 1.2rem).
  - **Task Title:** Bold, Readable (e.g., 1.1rem).
  - **Task Description:** Small, Muted (e.g., 0.9rem).
- **Anti-Pattern:** Making the Mission Title and Task Title the same size. The hierarchy must be visually obvious: Mission is *why*, Quest is *what*, Task is *how*.

#### 6. Movement: The "Downward Gradient" Line
- **Definition:** Movement guides the user's eye smoothly across the composition.
- **Application:** On the Quest page, a thin, vertical line runs down the left edge. As the user completes tasks, a gradient fills this line from top to bottom. This creates a continuous, satisfying visual flow that says *"You are moving forward."*
- **Anti-Pattern:** Using arrows or aggressive directional cues. The line is passive; the user notices it subconsciously.

#### 7. White Space: The "Moat" Around the CTA
- **Definition:** White space is an active tool to give elements room to breathe and increase focus.
- **Application:** The Primary CTA button has a **minimum of 40px of empty padding** around it on all sides. No text, no icons, no dividers touch this zone. This creates a "moat" that screams *"Click here."*
- **Anti-Pattern:** Crowding the CTA with helper text, tooltips, or secondary buttons.

#### 8. Singularity (New): One Logical Action per Screen
- **Definition:** At any given moment, there is only one thing the user can do.
- **Application:** The Quest page has **only one primary CTA** (e.g., "Mark Done", "Submit", "Log It"). The "Back" button and "Companion" icon are secondary, low-opacity elements placed in the extreme corners. The user never has to choose between two equally prominent actions.
- **Anti-Pattern:** Having "Save Draft" and "Submit" on the same page. If saving is needed, make it auto-save.

---

