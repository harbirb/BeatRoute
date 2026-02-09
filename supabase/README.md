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

### Strava Types

- **How types are generated:** Strava publishes Swagger 2.0. We first convert it to OpenAPI 3.0 with `swagger2openapi`, then generate TypeScript types with `openapi-typescript` via `npm run gen-strava-types`.
- **Why not swagger-typescript-api:** With the Strava Swagger spec, `swagger-typescript-api --no-client` produced no usable type output, so we switched to the Swagger→OpenAPI→types pipeline for reliable, types-only generation.
- **How to use types:** Import the generated `paths` type and select the response you need, e.g. `paths["/activities/{id}"]["get"]["responses"][200]["content"]["application/json"]` for the activity shape.
- **Generate files:** Run `npm run gen-strava-types` (Strava) and `npm run update-types` (DB). Files are output to `types/` and are ignored in git.
- **Sync to Frontend:** Run `npm run sync-types` to generate DB types and copy them to `beat-route/types/supabase.ts` for frontend usage.

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

## Development Practices

### Edge Functions (Deno)

We use Deno for Supabase Edge Functions.

- **Dependency Management:** Use `deno.json` in each function's directory to manage imports. This keeps versions consistent and imports clean.
- **IDE Setup:** To resolve "red squigglies" and ensure your editor understands the Deno environment, run `deno install` within the specific function's folder (e.g., `cd functions/my-function && deno install`).
- **Formatting:** Run `deno fmt` to format your code.
- **Linting:** Run `deno lint` to catch common issues.

#### JSR Imports

Avoid using `import "jsr:@..."` directly in `index.ts`.

- **Why:** Direct JSR imports can cause issues with tooling (like `deno install` not properly caching them for the LSP in some contexts), are harder to read, and scatter version management across files.
- **Instead:** Map the JSR dependency in `deno.json` to a bare specifier.

**Example:**

_deno.json:_

```json
{
  "imports": {
    "@supabase/supabase-js": "jsr:@supabase/supabase-js@2"
  }
}
```

_index.ts:_

```typescript
import { createClient } from "@supabase/supabase-js";
```
