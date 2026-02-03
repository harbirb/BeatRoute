## TODOs

### Backend

- Instead of fetching from Strava everytime, create edge function to accept Strava webhooks and store activity data in supabase
  - Handle CRUD events with this function
  - Fetch activity details if create or update
  - Store in activities table

- Fat Function:
  - parse activity_id and stuff first
  - trigger your background logic using EdgeRuntime.waitUntil().
  - return 200 ok immediately
  - have helper files for logic (strava.ts, spotify.ts, matcher.ts, index as entry point)

- In same fat edge function, fetch music history, match, and save to supabase
  - create songs table
  - create activity_songs table
  - add logic to fetch and save songs
- ## Then simply perfom return a query result. No need to worry about Strava/Spotify usage limits.

### DB schema

- activities table (id, name, date)
- songs table (id, title, artist, album, duration, tracklist_id)
- activity_songs table (activity_id, song_id) (junction table linking activities and songs)

### Frontend

- Remove bottom navbar
- use native navigation components
- use react-native-safe-area-context
- Add activity tracking
