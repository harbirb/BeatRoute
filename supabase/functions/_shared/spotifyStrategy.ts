import { AccessToken, IAuthStrategy, SdkConfiguration } from "spotify-sdk";
import { getToken } from "./tokens.ts";

/**
 * A custom Spotify Authentication Strategy that leverages our shared Supabase token management.
 */
export class SupabaseSpotifyAccessTokenStrategy implements IAuthStrategy {
  private configuration: SdkConfiguration | null = null;

  constructor(private userId: string) {}

  public setConfiguration(configuration: SdkConfiguration): void {
    this.configuration = configuration;
  }

  public async getOrCreateAccessToken(): Promise<AccessToken> {
    const token = await getToken(this.userId, "spotify");

    return {
      access_token: token,
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: "",
    };
  }

  public getAccessToken(): Promise<AccessToken | null> {
    return this.getOrCreateAccessToken();
  }

  public removeAccessToken(): void {
    // Tokens are managed in the database
  }
}
