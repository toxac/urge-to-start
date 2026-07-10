# Mission 2 Task Forms

I have decided not to do one form component related to a table. It might be a case of optimising way too soon. Schema might change as we build things. So i guess it better to have one form for each task and we will place it in folder /components/program/tasks/opportunity and /components/program/tasks/project. Below is outline of how i am thinking about how each task and form should behave and accomplish for mission2.  This is reference to the partial_mission2.ts(i have only kept keys which are relevant to forms) with comments.

## Component: OpportunityObservation

We want to basically render the questions and leave a textbox for users to add one observation at a time. I think we should add another field to obervation_cofig to have briefing_text (what to observe). i don't care much for min_observation and observation_perios_days so much in the sense of making them part of the progress. they have one observation or many we just suggest users add 3 and take minimum of observation_perios_days. which we will show after the briefing_text. We can save observations inside user_progress table under saved_payload. This would work for following tasks:

1. id: "m2_q1_t1_observation_week"

2. id: "m2_q1_t2_skill_reflection"

3. id: "m2_q2_t1_social_observation" ( i think we should combine "m2_q2_t1_social_observation" and "m2_q2_t2_validation_conversation" into one task what do you think? or validate all the opportunities using "m2_q4_t2_final_confirmation" later before finalising  ), then we don't need to have "m2_q2_t2_validation_conversation" we have "m2_q2_t1_social_observation" and then add opportunity id: "m2_q2_t3_add_opportunities"



## Component: OpportunityForm

Users will enter all opportunities they have comes across through this form. We should look at the schema for the table so that users can add all the relevant information. here are the fields i think would be needed to enter opportunity:

1. description: string

2. source_type: string ( we need to convert this to enum -> personal_problems, skills, zone_of_influence, broader_search)

3. status

4. title

5. user_id

6. capture_metadata: Json we need to based on quest populate observations from related tasks have show that to users above the forms with button to convert that into opportunity and when they do it we should copy observation to capture_metadata, or maybe we need to have a text array for observations that they can add to even later. 

7. Other field would be relavent later but not for now

Tasks using this form component

1. id: "m2_q1_t3_enter_opportunities"

2. id: "m2_q2_t3_add_opportunities"

3. "m2_q3_t2_forum_research" they do research and add to opportunity

4. "m2_q3_t3_marketplace_research" they do research and add to opportunity

5. We are missing one for trends and google keywords, they do research and add to opportunity



## Quest 4 needs to be rethought

1. We will first ask users to validate from customer standpoint each opportunity and we will give them relevant resources for each source_type

2. Then they rank based on their skills, preferences and finalise one

3. create project with the one selected opportunity

For these we have to see if we need to change or add to opportunity table 




