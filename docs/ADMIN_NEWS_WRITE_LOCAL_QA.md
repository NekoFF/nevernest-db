# Local Admin News Write QA Guide

This guide provides step-by-step instructions for performing manual Quality Assurance (QA) on the administrative News write endpoint in a local environment.

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
npm run server:auth:bootstrap-local-admin
```

## Step 2: Start the Backend Server

```powershell
npm run server:dev
```

The server should be running at `http://localhost:4000`.

## Step 3: Fetch CSRF Token

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/csrf" -SessionVariable session
$csrfToken = ($response.Content | ConvertFrom-Json).data.token
Write-Host "CSRF Token: $csrfToken"
```

## Step 4: Login as Admin

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

## Step 5: Perform Admin News Update

Update a news post using its slug (e.g., `phase-note`).

```powershell
$updateBody = @{
    title = "Updated News Title for QA"
    description = "Updated description via admin PATCH"
} | ConvertTo-Json

$headers = @{
    "X-CSRF-Token" = $csrfToken
}

Invoke-RestMethod -Uri "http://localhost:4000/api/admin/news/phase-note" `
                  -Method Patch `
                  -Body $updateBody `
                  -Headers $headers `
                  -ContentType "application/json" `
                  -WebSession $session
```

## Step 6: Verify the Change

Check the public API to confirm the update persisted.

```powershell
$publicNews = Invoke-RestMethod -Uri "http://localhost:4000/api/news/phase-note" -Method Get
Write-Host "Updated Title: $($publicNews.data.title)"
```

## Verification Checklist

- [ ] `401 Unauthorized` if calling PATCH without login.
- [ ] `403 CSRF Error` if calling PATCH without `X-CSRF-Token` header.
- [ ] `400 Validation Error` if sending an empty body or invalid fields.
- [ ] `200 OK` and data persists in DB when all guards are passed.
- [ ] Audit logs show the `news` `update` action.
