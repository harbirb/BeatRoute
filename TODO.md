## TODOs

### Backend

- Instead of fetching from Strava everytime, create edge function to accept Strava webhooks and store activity data in supabase
  - Handle CRUD events with this function
  - Fetch activity details if create or update
  - Store in activities table

- Fat Function:
  - Return 200 to Strava immediately (webhook acknowledgment)
    ├── Trigger background task via `waitUntil()`
    └── Background task:
    ├── Fetch latest Strava activity
    ├── Fetch Spotify recent tracks
    ├── Match songs to activity
    └── Store in database

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
