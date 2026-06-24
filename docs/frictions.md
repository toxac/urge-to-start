
##  Playbook Friction Points & Recommendations

### Friction Point 1: Mission 3, Quest 1, Task 2 - "Psychographics" (m3_q1_t2)
- **The Issue:** The task asks users to identify *"Daily Fears & Online Hangouts"* in a single form. This is two distinct cognitive tasks crammed into one input. It creates mental friction because the user has to switch between "emotional analysis" and "locational analysis" mid-sentence.
- **Recommendation:** Split into **two separate tasks**:
  - **Task A:** *"Name 1 deep fear your buyer has about this problem."* (Short text, max 10 words)
  - **Task B:** *"Name 1 online space where your buyer hangs out."* (Short text, max 10 words)
- **Why:** Two quick hits feel easier than one complex hit. Maintains the "single focus" rule.

### Friction Point 2: Mission 3, Quest 3 - "Market Sizing" (m3_q3_t1)
- **The Issue:** The task asks the user to *"Calculate Your Category & Segment Ceiling"* using a form. This is inherently analytical and intimidating. It violates the "action over analysis" philosophy. It feels like a homework assignment, not a quest.
- **Recommendation:** Convert this from a "calculation" to a **"range selector"**:
  - Replace the free-text input with a slider or a set of radio buttons:
    - `< $100k`
    - `$100k - $1M`
    - `$1M - $10M`
    - `> $10M`
  - Add a tiny, non-intrusive label: *"Estimate. Gut-check is fine."*
- **Why:** It acknowledges that precision is impossible for a first-timer. It forces a directional answer without analysis paralysis.

### Friction Point 3: Mission 4, Quest 4, Task 2 - "Expenses" (m4_q4_t2)
- **The Issue:** The task asks users to *"List Your Absolute Minimum Software Expenses."* For a first-time entrepreneur, this is a massive research burden. They don't know what tools exist, let alone their costs. This is a "blank page" problem disguised as a form.
- **Recommendation:** Provide a **default baseline**:
  - Change the task from a blank text area to a **confirmation toggle**:
    - *"We estimate ~$30/month for basic tools (domain, email, Stripe). Do you have additional expenses? (Yes/No)."*
    - If "Yes," then prompt for specifics.
  - Alternatively, provide a **multi-select checklist** of common expenses (e.g., Hosting, Domain, Email, Payment Processor, Design Tool) with estimated price tags.
- **Why:** It removes the anxiety of starting from zero. It gives a safety net.

### Friction Point 4: Mission 6, Quest 5 - "Actual Building" (m6_q5_t1)
- **The Issue:** This is a massive jump. Quest 1-4 are about planning, sourcing, and defining "good enough." Quest 5 is literally *"Confirm Your Functional Version is Operational."* There is a giant gap between "planning" and "operational." The user likely feels a spike in anxiety at this point.
- **Recommendation:** Insert a **bridge task** *before* the confirmation:
  - **New Task (m6_q4.5):** *"Name the single core action your version 1 performs."* (Short text, max 5 words).
  - *Then* the confirmation task (`m6_q5_t1`) asks: *"Does your version perform that core action? (Yes/No)".*
- **Why:** It forces the user to crystallize the *essence* of their build. "Core action" is easier to execute than "functional version." It reduces the psychological barrier.

### Friction Point 5: Mission 7, Quest 3 & 4 - "Launch Tracks" & "Branding"
- **The Issue:** These quests are conceptual. *"Configure your modern social media content hooks"* and *"Establish your voice guidelines"* are marketing fluff. They don't translate to a single, actionable click.
- **Recommendation:** Make them concrete and verifiable:
  - **Track Selection (m7_q3_t1):** Instead of "select and configure," ask: *"Write the first tweet or LinkedIn post you will publish. Paste it below."* (Short text).
  - **Branding (m7_q4_t1):** Instead of "establish guidelines," ask: *"Pick your primary color and font from our preset options."* (Use a color picker and a font dropdown—only 3 options each).
- **Why:** It transforms a vague "strategy" exercise into an executable, tangible output. "Doing" beats "thinking about doing."

### Friction Point 6: Mission 8, Quest 3 - "System Streamlining" (Automation)
- **The Issue:** The task asks users to *"Map out your background automation workflow links."* This assumes a level of technical literacy (Zapier, Make, APIs) that many first-timers do not have. This will trigger a "I don't know how to do this" spiral.
- **Recommendation:** Make this task **heavily scaffolded** or **optional**:
  - Change the task from free-text to a **confirmation**: *"Do you have repetitive manual tasks? (Yes/No)."*
  - If "Yes," provide a link to a pre-built "Urge Automation Kit" (e.g., a simple Zapier template they can copy).
  - If "No," they skip it. 
  - Alternatively, move this to an optional quest flagged `is_optional: true` and let the user decide if they're ready for it.
- **Why:** Never force a user to build infrastructure they don't understand. Focus on what they *can* do (sell, talk, build).

---

### Summary of Friction Fixes

| Mission | Quest | Task | Issue | Fix |
| :--- | :--- | :--- | :--- | :--- |
| M3 | Q1 | Psychographics | Two questions in one | Split into 2 tasks (Fears / Hangouts) |
| M3 | Q3 | Market Ceiling | Too analytical | Change to range selector (slider/radio) |
| M4 | Q4 | Expenses | Blank page anxiety | Provide default baseline / multi-select checklist |
| M6 | Q4-5 | Active Build | Gap between planning and confirming | Add bridge task: *"Name core action"* |
| M7 | Q3-4 | Launch Tracks / Branding | Too conceptual | Change to concrete outputs (write tweet / pick preset colors) |
| M8 | Q3 | Automation | Technical literacy barrier | Make optional or change to simple Yes/No + template |

---

These recommendations are designed to **preserve your program's depth** while **eliminating cognitive bottlenecks** at the exact points where a first-time entrepreneur is most likely to freeze.

How does this feel? Shall we refine any specific friction point further before you lock the final spec?