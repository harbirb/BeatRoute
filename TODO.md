## TODOs

### Frontend

- Add activity tracking
- Fix stickers page
- Add more stickers

- Supabase production deployment
- Make production build for iphone

FUNCTION TECH DEBT

3. Background Processing (waitUntil)
   Webhooks should respond to the sender (Strava) as quickly as possible (usually < 2s). Currently, you are
   await-ing the entire processing flow (fetching activity, fetching songs, database inserts) before
   responding. Using EdgeRuntime.waitUntil would allow you to respond immediately and process the data in the
   background.

4. Duplicate Song Links
   In linkSongsToActivity, if the same song is processed multiple times for the same activity (e.g., due to a
   webhook retry), you might get duplicate entries or errors depending on your constraints.

5. Spotify Sync Window
   The Spotify getRecentlyPlayedTracks API only returns the last 50 tracks. If a user has a very long workout
   or processes it much later, some songs might be missed.
