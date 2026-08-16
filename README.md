# BeatRoute

BeatRoute finds the songs you listened to during your workouts by cross-referencing your Strava activities with your Spotify listening history. It's a mobile rewrite of [MoovIt](https://github.com/harbirb/MoovIt), my earlier Express.js web app — rebuilt from the ground up to ship as a native iOS/Android app with a real backend instead of a session-based server.

## How it works

1. Link your Strava and Spotify accounts.
2. Go for a run, ride, or workout as usual.
3. When you finish, Strava fires a webhook at BeatRoute telling us the activity is done.
4. BeatRoute fetches the activity's start/end time, cross-references it against your Spotify recently-played history, and matches up the songs you listened to during that window.
5. Open the app — your soundtrack is waiting next to the activity.

No manual syncing or polling — the whole flow is event-driven off Strava's webhook.

### Stickers

BeatRoute can turn the GPS trace of a completed activity into a shareable sticker: your route polyline, pace, distance, and stats rendered as a customizable image (colors, fonts, layout) that gets copied to your clipboard and pasted anywhere — Instagram stories, messages, wherever you want to show off a workout.

## Stack

- **Frontend**: Expo / React Native (TypeScript)
- **Backend**: Supabase Edge Functions (Deno) — no long-running server
- **Database**: Postgres, managed by Supabase, with row-level security
- **Auth/Integrations**: Strava API + Spotify API (OAuth), Strava webhooks for activity events

## Why the rewrite

MoovIt was a Node/Express web app with sessions stored in MongoDB. BeatRoute ports the same core idea to a native mobile app: Expo React Native on the frontend, Supabase (Postgres + Edge Functions) on the backend instead of a hand-rolled Express server. Moving to serverless functions also meant redesigning how OAuth tokens are issued and refreshed, since there's no persistent server process to hold session state.

## OAuth token exchange

Strava and Spotify both use OAuth authorization-code flow, and BeatRoute implements the exchange and refresh logic from scratch on the backend:

- The app completes the OAuth redirect and gets back a one-time authorization `code`.
- That code is sent to a Supabase Edge Function (`exchange-oauth-token`), authenticated via the user's Supabase session token.
- The function exchanges the code for an access token + refresh token directly with Strava/Spotify's token endpoint, and stores both server-side in Postgres, scoped to the user via row-level security. The client never sees or holds these tokens.
- On subsequent requests, a shared `getToken` helper checks token expiry and transparently refreshes+persists a new access token via the provider's refresh-token flow before it's used — callers never see an expired token.

## Repo layout

- `beat-route/` — Expo React Native app (active frontend)
- `supabase/` — Postgres migrations, RLS policies, and Edge Functions (`exchange-oauth-token`, `strava-webhook`)
