## TODOs

### Frontend

- Add activity tracking
- Fix stickers page
- Add more stickers

- Supabase production deployment
- Make production build for iphone

1. Unified Dependency Management
   Instead of duplicating deno.json files in every function, it is conventional to place a single deno.json (or
   import_map.json) in the /functions directory.
   - Why: Deno sub-directories automatically inherit the configuration. This ensures that every function uses the same
     version of supabase-js, shared aliases, and SDKs, preventing "dependency drift" where one function is on a
     different version than another.

2. SDK-Native Authentication Strategies
   For the Spotify SDK (@spotify/web-api-ts-sdk), the conventional approach is to implement an AuthenticationStrategy
   rather than manually calling getToken before every client creation.

- Approach: You would create a class SupabaseSpotifyAuthStrategy that implements the SDK's interface. It would
  handle the Supabase database calls for fetching and refreshing tokens internally.
- Value: Your business logic (fetching tracks) becomes completely decoupled from your auth logic (refreshing tokens
  in Supabase).

3. Schema-Based Validation
   Webhooks (like Strava's) are often validated using a library like Zod instead of manual isValidPayload functions.

- Why: Zod provides both runtime validation and automatic TypeScript type inference from the schema. This replaces
  manual typeof checks with a single schema.parse(payload) call that is much harder to break and easier to read.

4. Consistent SDK Usage
   Currently, you use the Strava SDK for refreshing tokens but switch to manual fetch calls for getting activity
   details.

- Approach: Use the SDK client for all interactions.
- Value: This handles URL construction, parameter encoding, and response parsing consistently across the app.

5. Centralized Error/Response Wrapper
   A common pattern in Edge Functions is to create a wrapper or middleware function that handles common tasks:

- CORS headers: Automatically adding them to every response.
- Global Error Handling: Catching all errors and returning a structured JSON response instead of a raw 500 error.
- Logging: Automatically logging the start/end of a request and its latency.
