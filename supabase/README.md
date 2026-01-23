# Supabase Backend

## Setup

1. **Install & Start:**
   ```bash
   cd supabase
   npm install
   npx supabase start
   ```
   _Requires Docker._

## Commands

### Local Dev

- **Stop:** `npx supabase stop`
- **Status:** `npx supabase status`

### Edge Functions

- **Serve (All):** `npx supabase functions serve`
- **Serve (Specific):** `npx supabase functions serve <name>`
- **Deploy:** `npx supabase functions deploy <name>`

### Database

- **New Migration:** `npx supabase migration new <name>`
- **Reset DB:** `npx supabase db reset`
- **Apply Pending:** `npx supabase migration up` _Apply any pending migrations
  to the local database._
- **Diff Changes:** `npx supabase db diff -f <name>` _Generate a migration from
  local schema changes._

### Remote Sync

- **Login:** `npx supabase login`
- **Link Project:** `npx supabase link --project-ref <project-id>`
- **Pull Remote Schema:** `npx supabase db pull` _Pull changes from remote DB
  into a local migration._
- **Push Migrations:** `npx supabase db push` _Push local migrations to the
  remote database._

## Structure

- `functions/`: Edge Functions.
- `migrations/`: SQL migrations.
- `config.toml`: CLI config.
