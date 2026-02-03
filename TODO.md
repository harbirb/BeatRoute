## TODOs

### Backend

- Instead of fetching from Strava everytime, create edge function to accept Strava webhooks and store activity data in supabase
- Then fetch music history, match, and save to supabase
- Then simply perfom return a query result. No need to worry about Strava/Spotify usage limits.

### DB schema

- activities table (id, name, date)
- songs table (id, title, artist, album, duration, tracklist_id)
- activity_songs table (activity_id, song_id) (junction table linking activities and songs)

### Frontend

- Remove bottom navbar
- use native navigation components
- use react-native-safe-area-context
- Add activity tracking
