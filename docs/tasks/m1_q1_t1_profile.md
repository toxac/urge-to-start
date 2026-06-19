# Task - mission1/quest1/m1_q1_t1_profile

## Details
```ts
tasks: [
          {
            id: "m1_q1_t1_profile",
            title: "Claim Your Public Username",
            type: "form",
            component_key: "ProfileSetupForm",
            sequence: 1,
            grant_points: 10 // Awarded instantly when form is saved
          },
          ...
        ]
```

## Form Details

### id: "m1_q1_t1_profile"

**Form Details**

Instead of "Claim Your Public Username", which they have already done during the onboarding process we should use this to add more information about themselve so that the platyform and communities knows them better. As they say "Everything good in life—begins with a conversation.". We have to explain why should they provide the information, we need to add description to tasks in playbook and tasks table. We ask user to describe themselves further with following fields from profile.
- full_name
- age_group
- avatar_url (this will be a file upload which we will have to factor in our form renderer and config as well)
- social_profiles
- highest_education
- city (so that they can be alerted for events in the city/country)
- country
- address (optional)
- description (paragraph that describes them best)

### Updates 
- add description field to tasks table and playbook tasks. We will need to render this in form rendered above the form elements
- add file upload to form config and renderer: files will be stored in storage bucket in supabase. we will have to create one with RLS and i think we should keep all users files in folder name of user id and we will uploaded everything from user in this folder. that way if user needs to download assests we can provide the whole folder as zipped file.

### Table Schema
```sql
create table public.profiles (
  id uuid not null,
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  full_name text null,
  onboarding_step integer not null default 1,
  username text not null,
  age_group public.user_age_group null,
  country text not null,
  avatar_url text null,
  accumulated_xp integer not null default 0,
  currency character varying(10) not null default 'INR'::character varying,
  capital_available_local numeric(12, 2) not null default 0.00,
  social_profiles jsonb not null default '{}'::jsonb,
  core_driver text null,
  highest_education public.education_tier null,
  role public.user_platform_role not null default 'lead'::user_platform_role,
  mentor_metadata jsonb not null default '{}'::jsonb,
  provider_metadata jsonb not null default '{}'::jsonb,
  city text null,
  address text null,
  description text null,
  constraint profiles_pkey primary key (id),
  constraint profiles_username_key unique (username),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint username_length_check check ((char_length(username) >= 3))
) TABLESPACE pg_default;

create index IF not exists idx_profiles_mentor_metadata_gin on public.profiles using gin (mentor_metadata) TABLESPACE pg_default;

create index IF not exists idx_profiles_provider_metadata_gin on public.profiles using gin (provider_metadata) TABLESPACE pg_default;

create trigger on_profile_role_updated
after
update OF role on profiles for EACH row
execute FUNCTION handle_profile_role_sync_to_user_jwt ();

```

## Instructions
- Tell me what do you think of this approach for first task being an ice breaker/introduction
- updating things



