export const PROVIDERS = {
  strava: {
    table: "strava_tokens",
    clientIdEnv: "STRAVA_CLIENT_ID",
    clientSecretEnv: "STRAVA_CLIENT_SECRET",
    tokenUrl: "https://www.strava.com/oauth/token",
    redirectUriEnv: "STRAVA_REDIRECT_URI",
  },
  spotify: {
    table: "spotify_tokens",
    clientIdEnv: "SPOTIFY_CLIENT_ID",
    clientSecretEnv: "SPOTIFY_CLIENT_SECRET",
    tokenUrl: "https://accounts.spotify.com/api/token",
    redirectUriEnv: "SPOTIFY_REDIRECT_URI",
  },
} as const;

export type ProviderName = keyof typeof PROVIDERS;
