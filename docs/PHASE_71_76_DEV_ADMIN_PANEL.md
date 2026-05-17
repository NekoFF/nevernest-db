# PHASE 71–76: Dev-only Admin Panel Shell + Admin Runtime QA Page

This phase implements a browser-based developer-only admin QA panel. It allows local developers to manually verify the complete authentication, CSRF, and admin write flow within the application without relying on external scripts or manual API calls.

## Goals
- Provide a browser UI for `api/me` state verification.
- Allow manual retrieval of CSRF tokens.
- Support local login/logout for development accounts.
- Enable controlled "Update -> Verify -> Restore" QA tests for admin-writable entities (Codes, News).
- Ensure no sensitive data (passwords, tokens, CSRF) is persisted in `localStorage`.
- Maintain strict dev-only gating.

## Implementation Details

### DevAdminPage
- **Route**: `/dev/admin` (also aliases `/admin-dev`).
- **Gating**: Only accessible if `import.meta.env.DEV` is true AND `VITE_ENABLE_DEV_ADMIN_PANEL === "1"`.
- **UI Components**:
  - **Runtime Status**: Shows data source, API base URL, and CSRF readiness.
  - **Auth State**: Displays current authenticated user info from `/api/me`.
  - **CSRF Section**: Manual fetch button for CSRF token (stored only in React state).
  - **Local Login**: Clean login form (no persistence).
  - **Mutation QA**: Buttons to run automated test cycles for one Code and one News entry.

### Safety Measures
- **No Persistence**: Tokens and passwords never touch `localStorage` or `sessionStorage`.
- **Explicit Actions**: Mutations require manual button clicks.
- **Auto-Restore**: QA tests automatically restore original values after successful verification.
- **Visual Warning**: Clear indicators that this is a "Local Only" and "Not for Production" panel.
- **CORS Support**: Backend allows credentialed requests from `localhost` and `127.0.0.1` for local verification.

## Environment Configuration

To enable the panel, set the following in your `.env.local`:

```env
VITE_ENABLE_DEV_ADMIN_PANEL=1
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://127.0.0.1:4000
```

The backend must also be configured for local admin writes:

```env
ENABLE_LOCAL_AUTH=1
ENABLE_LOCAL_ADMIN_WRITES=1
LOCAL_AUTH_SECURE_COOKIE=0
```

## Verifications
- CSRF retrieval: OK
- Local login: OK
- PATCH /api/admin/codes: OK
- PATCH /api/admin/news: OK
- Navigation gating: OK
