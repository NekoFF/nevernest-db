# Admin Write E2E Local QA Guide

This guide provides instructions for running the automated End-to-End (E2E) smoke test for administrative write operations.

## Prerequisites

1.  **Local Database**: Ensure PostgreSQL is running with seeded data.
2.  **Admin User**: Ensure a local admin user is bootstrapped.
3.  **Environment Variables**:
    ```bash
    # For Backend
    DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
    SERVER_DATA_MODE="db"
    ENABLE_LOCAL_AUTH="1"
    ENABLE_LOCAL_ADMIN_WRITES="1"
    LOCAL_AUTH_SECURE_COOKIE="0"

    # For Smoke Test
    LOCAL_ADMIN_EMAIL="admin@example.test"
    LOCAL_ADMIN_PASSWORD="your-password"
    VITE_API_BASE_URL="http://127.0.0.1:4000"
    ```

## Running the Test

```powershell
# 1. Start the backend
npm run server:dev

# 2. In a separate terminal, run the smoke test
npm run smoke:admin-writes
```

## What the Script Does

1.  **Backend Check**: Verifies connectivity and DB mode.
2.  **CSRF Check**: Fetches a fresh CSRF token.
3.  **Auth Check**: Performs a local login.
4.  **Mutation Check (Codes)**: Updates a random code's reward summary, verifies via public API, and restores.
5.  **Mutation Check (News)**: Updates a random news post's title, verifies via public API, and restores.
6.  **Logout Check**: Logs out and verifies the session is destroyed.

## Success Criteria

- All steps in the summary table are marked as `PASS`.
- The script exits with status `0`.
- Original data in the database remains unchanged after completion.

## Failure Troubleshooting

- **401 Unauthorized**: Check `LOCAL_ADMIN_EMAIL` and `LOCAL_ADMIN_PASSWORD`.
- **403 CSRF Error**: Ensure `ENABLE_LOCAL_AUTH=1` is set on the backend.
- **501 Not Implemented**: Ensure `ENABLE_LOCAL_ADMIN_WRITES=1` is set on the backend.
- **Unreachable**: Ensure the backend is running at the specified `VITE_API_BASE_URL`.
