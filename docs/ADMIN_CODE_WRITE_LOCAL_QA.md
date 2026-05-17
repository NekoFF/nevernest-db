# Local Admin Code Write QA Guide

This guide provides step-by-step instructions for performing manual Quality Assurance (QA) on the administrative Code write endpoint in a local environment.

> **WARNING:** Never perform these steps against a production database. These instructions are for **LOCAL DEVELOPMENT ONLY**.

## Prerequisites

1.  **PostgreSQL**: Ensure a local PostgreSQL instance is running (e.g., via Docker).
2.  **Environment Variables**: Create a local `.env` file or export the following variables:
    ```bash
    DATABASE_URL="postgres://user:password@localhost:5432/nevernest_db"
    SERVER_DATA_MODE="db"
    ENABLE_LOCAL_AUTH="1"
    ENABLE_LOCAL_ADMIN_WRITES="1"
    LOCAL_AUTH_SECURE_COOKIE="0" # Set to 0 for local non-HTTPS testing
    ```

## Step 1: Initialize Local Database

Run the following commands to ensure your local database is ready:

```powershell
# 1. Run migrations
npm run server:db:migrate

# 2. Seed the database with initial data
npm run server:seed:import:local

# 3. Bootstrap a local admin user
# Follow the prompts to create an admin user (e.g., admin@example.test / password123)
npm run server:auth:bootstrap-local-admin
```

## Step 2: Start the Backend Server

```powershell
npm run server:dev
```

The server should be running at `http://localhost:4000`.

## Step 3: Fetch CSRF Token

Before making any mutation requests, you must retrieve a CSRF token.

```powershell
# Use Invoke-RestMethod to fetch the token and store the cookie
$response = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/csrf" -SessionVariable session
$csrfToken = ($response.Content | ConvertFrom-Json).data.token
Write-Host "CSRF Token: $csrfToken"
```

## Step 4: Login as Admin

Login using the credentials created in Step 1.

```powershell
$loginBody = @{
    email = "admin@example.test"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/api/auth/local-login" `
                  -Method Post `
                  -Body $loginBody `
                  -ContentType "application/json" `
                  -WebSession $session
```

## Step 5: Perform Admin Code Update

Now, attempt to update a code. Find a code slug from your seeded data (e.g., `welcome-code`).

```powershell
$updateBody = @{
    rewardSummary = "Updated Reward Summary for QA"
    status = "active"
} | ConvertTo-Json

$headers = @{
    "X-CSRF-Token" = $csrfToken
}

Invoke-RestMethod -Uri "http://localhost:4000/api/admin/codes/welcome-code" `
                  -Method Patch `
                  -Body $updateBody `
                  -Headers $headers `
                  -ContentType "application/json" `
                  -WebSession $session
```

## Step 6: Verify the Change

Check the public API to confirm the update persisted.

```powershell
$publicCodes = Invoke-RestMethod -Uri "http://localhost:4000/api/codes" -Method Get
$updatedCode = $publicCodes.data | Where-Object { $_.externalId -eq "welcome-code" }
Write-Host "Updated Reward Summary: $($updatedCode.rewardSummary)"
```

## Step 7: Cleanup

Logout to clear the session.

```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/auth/logout" `
                  -Method Post `
                  -Headers $headers `
                  -WebSession $session
```

## Verification Checklist

- [ ] `401 Unauthorized` if calling PATCH without login.
- [ ] `403 CSRF Error` if calling PATCH without `X-CSRF-Token` header.
- [ ] `400 Validation Error` if sending an empty body or invalid status.
- [ ] `200 OK` and data persists in DB when all guards are passed.
- [ ] Audit logs (if currently configured to console) show the update action.
