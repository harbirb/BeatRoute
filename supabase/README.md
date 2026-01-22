# Supabase Backend

This directory contains the Supabase configuration, cloud functions, and database migrations.

## Prerequisites

- Node.js and npm installed.
- Docker Desktop installed and running (required for local Supabase instance).

## Getting Started

1.  **Navigate to the supabase directory:**

    ```bash
    cd supabase
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the local Supabase instance:**

    ```bash
    npx supabase start
    ```

    This will spin up the local database, auth, and other services. It will output the API URL and Anon Key.

## Common Commands

### Local Development

- **Stop the local instance:**

  ```bash
  npx supabase stop
  ```

- **Check status of the local instance:**
  ```bash
  npx supabase status
  ```

### Edge Functions

- **Serve functions locally:**

  ```bash
  npx supabase functions serve
  ```

  To serve a specific function:

  ```bash
  npx supabase functions serve <function-name>
  ```

- **Deploy functions:**
  ```bash
  npx supabase functions deploy <function-name>
  ```

### Database Migrations

- **Create a new migration:**

  ```bash
  npx supabase migration new <migration_name>
  ```

- **Reset the database (applies all migrations):**
  ```bash
  npx supabase db reset
  ```

## Project Structure

- `functions/`: Deno-based Edge Functions.
- `migrations/`: SQL migration files.
- `config.toml`: Supabase CLI configuration.
