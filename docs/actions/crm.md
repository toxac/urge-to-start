
# CRM Server Actions Documentation

**File Location**: `actions/crm.ts`

This document outlines the Server Actions responsible for managing Leads and Newsletters within the application. These functions provide type-safe interactions with the Supabase database, handle authentication checks, and manage email dispatch queues.

## Table of Contents
- [Types & Interfaces](#types--interfaces)
- [Validation Schemas](#validation-schemas)
- [Authentication](#authentication)
- [Lead Actions](#lead-actions)
- [Newsletter Actions](#newsletter-actions)

---

## Types & Interfaces

### `ActionResponse<T>`
A standard wrapper for all server action responses.

```typescript
type ActionResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string };
```

### Database Types
Direct mappings from the Supabase schema generation:
- `LeadRow`, `LeadInsert`, `LeadUpdate`
- `NewsletterRow`, `NewsletterInsert`, `NewsletterUpdate`

---

## Validation Schemas

All inputs are validated using Zod schemas before database interaction.

### `SubmitLeadSchema`
Used for public lead submission.

```typescript
{
  first_name?: string | null;   // max 100
  last_name?: string | null;    // max 100
  email: string;                // email, max 255
  phone?: string | null;        // max 50
  linkedin_username?: string | null; // max 100
  instagram_username?: string | null; // max 100
  source?: "manual_outbound" | "linkedin" | "instagram" | "website_form" | "referral" | "other";
  opted_in_newsletter?: boolean;
  internal_notes?: string | null;
}
```

### `CreateNewsletterSchema`
Used to create a new newsletter draft.

```typescript
{
  subject: string; // min 1, max 255
  content: string; // min 1 (Raw Markdown)
}
```

### `ScheduleNewsletterSchema`
Used to schedule a campaign.

```typescript
{
  scheduled_for: string; // ISO datetime string
}
```

---

## Authentication

### `assertAdminUser`
An internal helper function used to secure administrative endpoints.

1. Checks if a user is authenticated via Supabase Auth.
2. Fetches the user's profile from the `profiles` table.
3. Verifies that `profile.role === 'admin'`.

**Throws**:
- `'UNAUTHENTICATED'`: If no user session exists.
- `'UNAUTHORIZED_ADMIN_ONLY'`: If the user is not an admin.

---

## Lead Actions

### `submitAnonymousLead`
**Access Level**: Public (Anonymous)
**Description**: Creates a new lead or updates an existing one if the email already exists (Upsert). Uses the Admin client to bypass Row Level Security (RLS).

**Parameters**:
- `rawInput`: `SubmitLeadSchema`

**Returns**: `ActionResponse<LeadRow>`

**Example**:
```typescript
const result = await submitAnonymousLead({
  email: "jane@example.com",
  first_name: "Jane",
  source: "website_form"
});
```

---

### `getLeadsAdmin`
**Access Level**: Admin
**Description**: Fetches a paginated list of leads, ordered by creation date (newest first).

**Parameters**:
- `params` (Optional):
  - `limit`: number (default: 50)
  - `offset`: number (default: 0)

**Returns**: `ActionResponse<LeadRow[]>`

---

### `updateLeadAdmin`
**Access Level**: Admin
**Description**: Updates specific fields for a lead by ID. Invalidates the `/admin/crm/leads` cache upon success.

**Parameters**:
- `id`: string
- `rawInput`: `UpdateLeadAdminSchema` (Partial of SubmitLeadSchema)

**Returns**: `ActionResponse<LeadRow>`

---

### `deleteLeadAdmin`
**Access Level**: Admin
**Description**: Permanently deletes a lead record by ID. Invalidates the `/admin/crm/leads` cache.

**Parameters**:
- `id`: string

**Returns**: `ActionResponse<{ deleted: boolean }>`

---

## Newsletter Actions

### `createNewsletterDraft`
**Access Level**: Admin
**Description**: Initializes a new marketing message draft with status `'draft'`.

**Parameters**:
- `rawInput`: `CreateNewsletterSchema`

**Returns**: `ActionResponse<NewsletterRow>`

---

### `getNewslettersAdmin`
**Access Level**: Admin
**Description**: Retrieves all newsletter records, ordered by creation date (newest first).

**Returns**: `ActionResponse<NewsletterRow[]>`

---

### `updateNewsletterDraft`
**Access Level**: Admin
**Description**: Updates the subject or content of a newsletter. Prevents updates if the newsletter status is already `'sent'` or `'scheduled'`.

**Parameters**:
- `id`: string
- `rawInput`: `UpdateNewsletterSchema`

**Returns**: `ActionResponse<NewsletterRow>`

**Error Behavior**: Returns error `'Cannot update content of an active or fully spent campaign'` if status check fails.

---

### `scheduleNewsletterCampaign`
**Access Level**: Admin
**Description**: Locks a newsletter draft and schedules email dispatch jobs for all opted-in leads.

**Parameters**:
- `id`: string (Newsletter ID)
- `rawInput`: `ScheduleNewsletterSchema`

**Returns**: `ActionResponse<{ scheduledCount: number; status: string }>`

**Logic Flow**:
1. Validates `scheduled_for` is in the future.
2. Fetches the newsletter and ensures status is `'draft'`.
3. Fetches all leads where `opted_in_newsletter` is `true` using the Admin client.
4. Updates the newsletter status to `'scheduled'`.
5. Iterates through leads and calls `queueEmail` for each.
6. Invalidates the `/admin/crm/newsletters` cache.

**Error Behavior**:
- Returns error if `scheduled_for` is in the past.
- Returns error if no opted-in leads are found.
