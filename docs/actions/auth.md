
# Authentication Server Actions Documentation

**File Location**: `actions/auth.ts`

This module provides Server Actions for managing user authentication flows using Supabase Auth. These actions handle form submissions, error reporting via URL redirects, and session management.

## Table of Contents
- [Common Behavior](#common-behavior)
- [Actions](#actions)

---

## Common Behavior

### Error Handling
All actions follow a consistent error handling pattern. If an exception occurs or Supabase returns an error:
1. The function redirects the user to the relevant page.
2. The error message is attached to the URL as a query parameter: `?error=URL_ENCODED_MESSAGE`.

### Input Format
All actions expect standard HTML `FormData` objects, typically passed directly from a `<form>` element.

---

## Actions

### `login`
**Description**: Authenticates a user using their email and password.

**Input (FormData)**:
- `email`: string
- `password`: string

**Behavior**:
- Calls `supabase.auth.signInWithPassword`.
- **On Success**: Revalidates the root layout cache and redirects to `/platform/dashboard`.
- **On Error**: Redirects to `/login` with the error message in the query string.

---

### `signup`
**Description**: Registers a new user account.

**Input (FormData)**:
- `email`: string
- `password`: string
- `fullName`: string

**Behavior**:
- Calls `supabase.auth.signUp`.
- Stores `fullName` in the user's Supabase auth metadata under the key `full_name`.
- **On Success**: Revalidates the root layout cache and redirects to `/setup` (likely for onboarding).
- **On Error**: Redirects to `/signup` with the error message in the query string.

---

### `forgotPassword`
**Description**: Initiates the password recovery process by sending a reset email.

**Input (FormData)**:
- `email`: string

**Behavior**:
- Calls `supabase.auth.resetPasswordForEmail`.
- The email contains a link pointing to `/api/auth/callback`, which eventually redirects the user to `/change-password`.
- The base URL is determined by the `NEXT_PUBLIC_SITE_URL` environment variable (defaults to `localhost:3000`).
- **On Success**: Redirects to `/forgot-password?success=true` to display a confirmation message.
- **On Error**: Redirects to `/forgot-password` with the error message in the query string.

---

### `changePassword`
**Description**: Updates the authenticated user's password. This typically follows the link sent by `forgotPassword`.

**Input (FormData)**:
- `password`: string (The new password)

**Behavior**:
- Calls `supabase.auth.updateUser`.
- **On Success**: Redirects to `/platform/dashboard?success=password-updated`.
- **On Error**: Redirects to `/change-password` with the error message in the query string.

---

### `logout`
**Description**: Signs the user out of the application.

**Input**: None

**Behavior**:
- Calls `supabase.auth.signOut()`.
- Revalidates the root layout cache to clear any user-specific data.
- Redirects to `/login`.



