## Note for Logs & Reflections
### Implementation Note for log_counter Tasks

When implementing log_counter execution type:

1. Logs: User progress entries are stored in user_progress table with:
    - task_id reference
    - log_data JSON field containing the log entry fields
    - log_number sequential count (e.g., 1 of 2)
2. Reflections: The reflection_prompt field in TaskSchema is used to prompt the user for reflection after completing the task (once all logs are submitted). This reflection is stored in user_progress with type: "reflection".
3. Component Responsibility: The UI component handling log_counter tasks should:
- Display a progress indicator (e.g., "2/3 logs completed")
- Provide form fields for each log entry (defined in the component's implementation)
- Save logs to user_progress with log_data JSON
- Show the reflection_prompt after all logs are complete
- Save the reflection to user_progress

4. Validation: Task is considered complete when:
- log_count >= target_count\
- Reflection has been submitted (if reflection_prompt is present)