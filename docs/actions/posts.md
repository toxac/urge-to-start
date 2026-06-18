
# Posts Server Actions Documentation

**File Location**: `actions/posts.ts`

This module manages the community feed system, handling the creation, modification, and interaction (voting, commenting, flagging) with user posts. It utilizes Supabase for storage and Zod for runtime validation.

## Table of Contents
- [Data Models & Schemas](#data-models--schemas)
- [CRUD Actions](#crud-actions)
- [Interaction Actions](#interaction-actions)
- [Moderation Actions](#moderation-actions)

---

## Data Models & Schemas

### Post Categories
Posts are strictly categorized using the following enum values:
- `build_journal`
- `marketing_win`
- `traction_milestone`
- `ask_for_help`
- `resource_share`
- `project_launch`

### `ActionResponse<T>`
Standard wrapper for action responses.

```typescript
type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false, error: string };
```

### `CreatePostSchema`
Used for creating new posts.

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Max 255 chars. |
| `content` | string | Post body content. |
| `category` | enum | One of the categories listed above. |
| `is_published` | boolean | Default `true`. |
| `project_id` | string (UUID) | Optional. Links post to a specific project. |

### `QueryPostsSchema`
Used for fetching and filtering posts.

| Field | Type | Description |
|-------|------|-------------|
| `category` | enum | Optional filter by category. |
| `projectId` | string (UUID) | Optional filter by project. |
| `limit` | number | Pagination limit (Max 100). Default 20. |
| `offset` | number | Pagination offset. Default 0. |
| `sortBy` | enum | `'latest'` (default) or `'top_voted'`. |

---

## CRUD Actions

### `createUserPost`
**Access Level**: Authenticated User
**Description**: Creates a new community post entry.

**Parameters**: `CreatePostSchema`

**Returns**: `ActionResponse<PostRow>`

**Behavior**:
- Generates a unique URL slug based on the title (e.g., `my-title-x7z9`).
- Initializes default values: `upvote_count`, `downvote_count`, `flag_count` to 0, `xp_awarded` to false.
- Revalidates the home page and community feed.

---

### `updateUserPost`
**Access Level**: Post Owner
**Description**: Modifies an existing post. Enforces strict tenancy checks.

**Parameters**:
- `id`: string (UUID of the post)
- `rawInput`: `UpdatePostSchema` (Partial of CreatePostSchema)

**Returns**: `ActionResponse<PostRow>`

**Behavior**:
- **Tenancy Check**: Verifies that `user_id` of the post matches the current user.
- **Slug Regeneration**: If the `title` is updated, the `slug` is automatically regenerated based on the new title.
- Revalidates the specific post page and general feeds.

---

### `deleteUserPost`
**Access Level**: Post Owner
**Description**: Permanently deletes a post.

**Parameters**:
- `id`: string (UUID of the post)

**Returns**: `ActionResponse<{ deleted: boolean }>`

**Behavior**:
- **Tenancy Check**: Verifies ownership before deletion.
- Revalidates paths to remove the post from UI feeds immediately.

---

### `getCommunityPosts`
**Access Level**: Public
**Description**: Fetches a paginated list of published posts.

**Parameters**: `QueryPostsSchema`

**Returns**: `ActionResponse<PostRow[]>`

**Behavior**:
- Filters by `is_published: true`.
- Allows optional filtering by `category` and `projectId`.
- Supports sorting:
  - `latest`: Orders by `created_at` (desc).
  - `top_voted`: Orders by `upvote_count` (desc).

---

## Interaction Actions

### `voteOnPost`
**Access Level**: Authenticated User
**Description**: Increments the upvote or downvote counter for a post.

**Parameters**:
- `id`: string (UUID of the post)
- `voteType`: `'upvote'` | `'downvote'`

**Returns**: `ActionResponse<{ upvotes: number; downvotes: number }>`

**Behavior**:
- Fetches current counts.
- Atomically increments the specified counter.
- Revalidates feed and post detail pages.

---

### `addCommentToPost`
**Access Level**: Authenticated User
**Description**: Adds a comment to a post. *Note: Comments are stored as a JSONB array within the post's `feedback` column rather than a separate table.*

**Parameters**: `AddCommentSchema`
- `postId`: string (UUID)
- `text`: string (Max 1000 chars)

**Returns**: `ActionResponse<{ commentCount: number }>`

**Behavior**:
- Fetches the existing `feedback` array from the post.
- Appends a new comment object containing:
  - `id`: Random unique string.
  - `user_id`: Current user ID.
  - `user_name`: Full name from user metadata.
  - `text`: Comment content.
  - `created_at`: Timestamp.
- Updates the post with the new array.
- Returns the new total count of comments.

---

## Moderation Actions

### `flagPost`
**Access Level**: Authenticated User
**Description**: Flags a post for moderation. Implements an automated safety quarantine.

**Parameters**:
- `postId`: string (UUID)

**Returns**: `ActionResponse<{ flagged: boolean; quarantined: boolean }>`

**Behavior**:
- Increments the `flag_count`.
- **Auto-Quarantine**: If the `flag_count` reaches 5 or more, the post's `is_published` status is automatically set to `false`, effectively hiding it from the public feed.

---

### `togglePostPublishStatus`
**Access Level**: Post Owner
**Description**: Toggles a post between draft (hidden) and published (visible) modes.

**Parameters**: `ToggleStatusSchema`
- `postId`: string (UUID)
- `is_published`: boolean

**Returns**: `ActionResponse<{ is_published: boolean }>`

**Behavior**:
- **Tenancy Check**: Ensures only the post owner can change visibility.
- Useful for unpublishing controversial content or re-publishing drafts.
