
# Launches Server Actions Documentation

**File Location**: `actions/launches.ts`

This module manages the lifecycle of project launches. It provides functionality to publish a launch, which involves a coordinated multi-table database operation to create both a `launches` record and a corresponding community `user_posts` entry.

## Table of Contents
- [Data Models & Schemas](#data-models--schemas)
- [Actions](#actions)
- [Logic Flow](#logic-flow)

---

## Data Models & Schemas

### `ActionResponse<T>`
Standard wrapper for action responses.

```typescript
type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false, error: string };
```

### `SubmitLaunchSchema`
Zod schema validating the input required to publish a new launch.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `project_id` | string | UUID | The ID of the project being launched. |
| `title` | string | Min 1, Max 255, Trimmed | The main title of the launch. |
| `tagline` | string | Min 1, Max 255, Trimmed | A short catchy phrase. |
| `description` | string | Min 1 | Full description of the launch. |
| `launch_url` | string | Valid URL | URL to the live product/site. |
| `thumbnail_url` | string | Valid URL, Optional | URL for the launch image. |
| `media_assets` | string[] | Array of Valid URLs | List of additional media links. |
| `sector` | string | Min 1, Trimmed | Industry category. |
| `location` | string | Min 1, Trimmed | Geographic location. |
| `business_type` | string | Min 1, Trimmed | Type of business (e.g., B2B, B2C). |
| `pricing_hint` | string | Min 1, Trimmed, Default 'Free' | Pricing description. |

---

## Actions

### `publishProjectLaunch`
**Description**: 
Publishes a project launch. This is a complex action that performs a coordinated database transaction across two tables (`launches` and `user_posts`). It generates a community discussion post automatically linked to the launch record.

**Access Level**: Authenticated User (Project Owner)

**Parameters**:
- `rawInput`: Object conforming to `SubmitLaunchSchema`.

**Returns**: `ActionResponse<{ launch: LaunchRow; postId: string }>`

**Behavior**:

1.  **Validation**: Parses and validates input using `SubmitLaunchSchema`.
2.  **Authentication**: Ensures a user is logged in.
3.  **Tenancy Guard**:
    *   Fetches the project by `project_id`.
    *   Verifies that `project.user_id` matches the current user's ID.
    *   *Error*: Returns failure if the project doesn't exist or the user doesn't own it.
4.  **Duplicate Protection**: Checks if an active launch (`is_active: true`) already exists for this project. Returns failure if true.
5.  **Slug Generation**: Creates a unique URL slug for the community post using the project business name and a random suffix (e.g., `my-project-launch-3x9k1`).
6.  **Step 1: Create Community Post**:
    *   Inserts a record into `user_posts`.
    *   Category is set to `project_launch`.
    *   Content is auto-generated Markdown including the tagline, description, and a link to the launch page.
7.  **Step 2: Create Launch Record**:
    *   Inserts a record into `launches`.
    *   Binds `post_id` to the ID created in Step 1.
    *   Sets status to `live` and `is_active` to `true`.
8.  **Rollback Safety**: If the launch insertion fails, the function attempts to delete the `user_posts` record created in Step 1 to maintain database integrity.
9.  **Cache Revalidation**: Refreshes the following paths:
    *   `/`
    *   `/launches`
    *   `/launch/${launch.id}`

**Error Scenarios**:
- Authentication required.
- Project not found.
- User lacks project ownership ("Cross-tenant violation").
- Active launch already exists for the project.
- Database insertion failures.
