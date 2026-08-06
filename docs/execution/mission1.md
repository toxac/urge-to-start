# Sprint 2- Task forms for Mission 1
## Instructions
1. Follow the playbook for mission 1 and implement forms accordingly integrating user progress.
2. Most of the form will save and read data from profiles table ( we will have recreate this, I will attached the schema/profile types) 
3. Organization
    - We will store all common tasks forms in /components/program/tasks/common
    - And rest in mission named folders for exmaples /components/program/tasks/mission1/..
    - We should also keep the custom types for the profiles table json field in /types/profileJsonFields.ts
4. Use the patterns and UI theme in sample task form MotivationForm (included below)
5. I have also attached globals.css file for you to refer for theme and style definitions
6. We will do standard_form execution types and wait and brainstorm for common types when we get to those particular task
6. Lets do one form at a time.

## Tasks/Forms to Implement with and mapping
- **mission1_quest1_task1** (execution_type : standard-form)
    - MotivationForm : profiles.motivations (ProfileMotivationSchema)
- **mission1_quest1_task2** (execution_type : standard-form)
    - CommitmentForm : profiles.commitment (ProfileCommtimentSchema)
- **mission1_quest1_task3** (execution_type : standard-form)
    - RoadblockForm:  profiles.roadblocks (ProfileRoadblockSchema)
- **mission1_quest2_task1** (execution_type : standard-form)
    - SocialFootprintAForm: profiles.social_footprint  (ProfileSocialFootprintSchema[])- comment: we will have to integrate some sort of ai Assessment of foorprint. We will brainstorm before execution
- **mission1_quest2_task2** (execution_type : standard-form)
    - SkillsForm: profiles.skills (ProfileSkills[]), comment: we will have to think really fun way to implement this
- **mission1_quest3_task1** : (execution_type : off-task-action) this is actually standard-form. We will integrate sending request, user can create contact and get content with link to join customized for each email address
    - CheerSquadForm: data to be saved in user_contacts with following prefilled values
        - email: from form input
        - categories = ["squad"], 
        - status = "unconfirmed", 
        - source = 'personal_network', 
        - user_id
- **mission1_quest3_task2** (execution_type : standard-form)
    - CommunityIntroForm -> data gets saved to users_posts with category="project_launch"
- **mission1_quest3_task3** (execution_type : log_counter)-> This should also just be off-task-action and we can decide with there is a counter based on target_count > 1 
    - OffAppActionForm ( we will have to design this new common form) We will need to think this through. This will have to integrate counter, reflection
- **mission1_quest4_task1** (execution_type : log_counter)-> This should also just be off-task-action
    - OffAppActionForm 
- **mission1_quest4_task2** (execution_type : log_counter)-> This should also just be off-task-action
    - OffAppActionForm 
- **mission1_quest4_task3** (execution_type : standard-form)
    - RejectionReflectionForm: we will need to think about how to do this

## Questions
1. Do you want me to give you each task config from playbook for each task?
2. Are you clear about the implementation?
3. What woudl be the best and most valuable approach to integrating AI in the form components? Inside the component, Have a button which opens up a dialog? 
4. Ask me if you have any clarification or you want to see any file/code


## Relevant Context

### Profile Types for new table creation and custom /types/profileJsonFields.ts

types related to profiles (will have to delete old one and recreate)

```ts
type Profile = {
    id: string;
    user_id: string;
    username: string;
    // personal details
    fullname?: string;
    status: string| null; // we will need some default status based on users journey
    bio ?: string | null; // populated from CommunityIntroForm
    country?: string | null;
    city?: string | null;
    gender: string | null;
    currency: string | null;
    age_group : UserAgeGroup | null;
    address?: string; // needs with purchase
    avatar_url?: string;
    highest_education_level : EducationLevel | null;
    // platform data
    roles: UserRoles[] | [];
    motivations : ProfileMotivationSchema | null;
    commitment : ProfileCommtimentSchema | null;
    roadblocks : ProfileRoadblockSchema | null;
    social_footprint : ProfileSocialFootprintSchema[] | null;
    assessment : ProfileAssessmentSchema[] | null;
    skills: ProfileSkills[] | null;
    provider_metadata: JSON | null; // havent finalized the schema, to be done in future
    mentor_profile: JSON | null; // havent finalized the schema , to be done in future
    onboarding_step: string | null;
    integrations : JSON | null; // for storing integration information for other services and tools
}

type Mentor = {
    // additional information for mentors such as sector, expertise, is investor, company details etc
}

type EducationLevel = "high_school" | "undergraduate_degree" | "postgraduate_degree" | "self_taught" ;

type UserRoles = "base" | "trial" | "enrolled" | "member" | "provider" | "mentor" | "superadmin" | "admin_marketing" | "admin_accounts" ; // maps to database enum user_platform_role

type UserAgeGroup = "under_18"| "18_24"| "25_34"| "35_44"| "45_54"| "55_plus" ; // maps to database enum user_age_group

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

### user_contacts table ( to be recreated)



```ts
// user_contacts table new
type UserContact = {
  id: string; // uuid auto
  user_id: string; // fk auth
  project_id: string | null; // fk projects table
  // Basic Info
  email: string | null ;
  first_name: string | null ;
  last_name: string | null ;
  phone: string | null ;
  company: string | null ;
  job_title: string | null ;
  // Social
  linkedin_url: string | null ;
  instagram_username: string | null ;
  twitter_handle: string | null ;
  // Classification (for the founder's business)
  categories: UserContactCategory[] ;
  status: UserContactStatus // NOT NULL DEFAULT 'active'
  source: UserContactSource
  stage: UserContactStage | null ;
  // Internal notes (array for timestamped entries)
  notes: string[] | null ;
  // Communication tracking
  last_contacted_at: string;
  next_follow_up_at: string;
  // Flag for email lists
  opted_in_newsletter: boolean;
  // Extra metadata (e.g., meeting summaries, custom fields)
  metadata: Record<string, any> | null ;
  // Timestamps
  created_at: string; // date now()
  updated_at: string; // date now()
}

type UserContactStatus = 'active' | 'inactive' | 'lost' | "unconfirmed";

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
  | 'engaged' // Follows your journey, replies to updates, warm
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

## user_posts table schema ( exists now and we can keep it as it is)

```ts
user_posts: {
        Row: {
          category: Database["public"]["Enums"]["post_category"]
          content: string
          created_at: string
          downvote_count: number
          feedback: Json
          flag_count: number
          id: string
          is_published: boolean
          project_id: string | null
          slug: string
          title: string
          updated_at: string
          upvote_count: number
          user_id: string
          xp_awarded: boolean
        }

enum: post_category:
        | "build_journal"
        | "marketing_win"
        | "traction_milestone"
        | "ask_for_help"
        | "resource_share"
        | "project_launch"
        | "introduction" // i have added this

```


## Changes I have made 

### /lib/playbook/mission1.ts

- task ("mission1_quest3_task1") changed execution_type to "standard-form"
- task ("mission1_quest3_task3") changed execution_type to "off-task-action"
- task "mission1_quest4_task1" changed execution_type to "off-task-action" 
- task "mission1_quest4_task2" changed execution_type to "off-task-action" 
- task mission1_quest4_task3 added dependency -> dependencies: ["mission1_quest4_task2", "mission1_quest4_task1"]

- task ("mission1_quest3_task3") changed component_key: "OffAppActionForm"
- task "mission1_quest4_task1" changed component_key: "OffAppActionForm" 
- task "mission1_quest4_task2" changed component_key: "OffAppActionForm"


## Enum types
- post_category added "introduction"


## Sample Form Component with styles( this is old version just refer for style)
```tsx
// components/program/tasks/MotivationForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { updateMyProfile } from '@/actions/profiles';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { updateProfileStoreFields } from '@/lib/stores/profileStore';
import { BaseTaskComponentProps } from './types';

interface MotivationFormInputs {
  core_focus: string;
  freedom_metric: string;
  anti_goal: string;
}

export function MotivationForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<MotivationFormInputs>({
    defaultValues: {
      core_focus: preSavedPayload.core_focus || '',
      freedom_metric: preSavedPayload.freedom_metric || '',
      anti_goal: preSavedPayload.anti_goal || '',
    }
  });

  const onSubmit = async (formData: MotivationFormInputs) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const profileSync = await updateMyProfile({
        core_driver: formData as any
      });

      if (!profileSync.success) {
        setErrorMessage(profileSync.error);
        setIsSubmitting(false);
        return;
      }

      if (profileSync.data) {
        updateProfileStoreFields(profileSync.data as any);
      }

      const progressSync = await completeTaskExecution({
        taskId: task.id, // ✅ Using task.id
        savedPayload: formData as Record<string, any>
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        setIsEditing(false);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(progressSync.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred saving your motivations');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="w-full space-y-4 border rounded-xl p-5 bg-emerald-50/20 border-emerald-500/10">
        <div className="w-full flex items-center justify-between pb-2 border-b border-dashed">
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            ✨ Inside Your Engine
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-7 text-xs bg-background"
          >
            Edit Answers
          </Button>
        </div>
        <div className="space-y-4 text-sm leading-relaxed">
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-0.5">What you focus on if money wasn't an issue:</p>
            <p className="text-foreground font-medium italic">"{preSavedPayload.core_focus}"</p>
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-0.5">Your definition of personal freedom:</p>
            <p className="text-foreground font-medium italic">"{preSavedPayload.freedom_metric}"</p>
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-0.5">What you are escaping in your current routine:</p>
            <p className="text-foreground font-medium italic">"{preSavedPayload.anti_goal}"</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {errorMessage && (
        <div className="w-full p-4 border rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground leading-snug">
            1. Imagine money was completely taken care of forever. Your bills are paid, your family is secure, and you never have to worry about cash again. What kind of projects or problems would you still actively want to wake up and work on? *
          </Label>
          <Textarea
            className="w-full min-h-[90px] resize-none text-sm"
            placeholder="What type of work genuinely interests you when you remove the pressure of making a quick living?"
            {...register('core_focus', { required: true, minLength: 10 })}
          />
          {errors.core_focus && <p className="text-xs font-semibold text-destructive">Tell us what excites you.</p>}
        </div>

        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground leading-snug">
            2. What does personal freedom actually mean to you? *
          </Label>
          <Textarea
            className="w-full min-h-[90px] resize-none text-sm"
            placeholder="Be honest. Is it being able to work from anywhere, choosing your schedule, or building an asset you completely own?"
            {...register('freedom_metric', { required: true, minLength: 10 })}
          />
          {errors.freedom_metric && <p className="text-xs font-semibold text-destructive">Tell us what freedom looks like for you.</p>}
        </div>

        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground leading-snug">
            3. What is the single biggest thing you dislike about your current work routine that you are trying to change? *
          </Label>
          <Textarea
            className="w-full min-h-[90px] resize-none text-sm"
            placeholder="Is it a painful daily commute, endless pointless meetings, or just feeling like your time isn't actually your own?"
            {...register('anti_goal', { required: true, minLength: 10 })}
          />
          {errors.anti_goal && <p className="text-xs font-semibold text-destructive">Knowing exactly what you are escaping is powerful fuel.</p>}
        </div>

        <div className="w-full flex gap-3 mt-4">
          {isInitiallyCompleted && (
            <Button
              type="button"
              variant="ghost"
              className="h-11 text-sm font-semibold"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 h-11 text-sm font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving Drivers...' : isInitiallyCompleted ? 'Update Core Drivers' : 'Lock in Your Drivers & Earn 20 XP'}
          </Button>
        </div>
      </form>
    </div>
  );
}

```