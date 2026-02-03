# Strava Webhook Local Test

## Prereqs

- Local Supabase running: `npx supabase start`
- `STRAVA_VERIFY_TOKEN` set for edge functions (see Supabase CLI env)
- Ensure the function allows unauthenticated requests in [supabase/config.toml](supabase/config.toml):
  ```toml
  [functions.strava-webhook]
  enabled = true
  verify_jwt = false
  import_map = "./functions/strava-webhook/deno.json"
  entrypoint = "./functions/strava-webhook/index.ts"
  ```

## 1) Subscription Validation (GET)

```bash
curl -i "http://127.0.0.1:54381/functions/v1/strava-webhook?hub.verify_token=some_random_verify_token&hub.challenge=15f7d1a91c1f40f8a748fd134752feb3&hub.mode=subscribe"
```

Expected response:

```json
{ "hub.challenge": "15f7d1a91c1f40f8a748fd134752feb3" }
```

## 2) Activity Event (POST)

```bash
curl -i "http://127.0.0.1:54381/functions/v1/strava-webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "aspect_type": "update",
    "event_time": 1516126040,
    "object_id": 1360128428,
    "object_type": "activity",
    "owner_id": 134815,
    "subscription_id": 120475,
    "updates": {
      "title": "Messy"
    }
  }'
```

Expected response:

```json
{ "received": true }
```
