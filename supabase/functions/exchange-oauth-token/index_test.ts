import { assertEquals } from "@std/assert";
import { stub } from "@std/testing/mock";

// Set up mock environment variables
Deno.env.set("SUPABASE_URL", "https://example.supabase.co");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "example-key");
Deno.env.set("STRAVA_CLIENT_ID", "123");
Deno.env.set("STRAVA_CLIENT_SECRET", "secret");
Deno.env.set("STRAVA_REDIRECT_URI", "http://localhost:3000/auth/callback");
Deno.env.set("SPOTIFY_CLIENT_ID", "spotify_123");
Deno.env.set("SPOTIFY_CLIENT_SECRET", "spotify_secret");
Deno.env.set("SPOTIFY_REDIRECT_URI", "http://localhost:3000/spotify/callback");

// Dynamically import the module so env vars are available during top-level initialization
const { exchangeHandler } = await import("./index.ts");

// Helper to normalize fetch input to URL string
const getUrl = (input: string | Request | URL) =>
  typeof input === "string"
    ? input
    : input instanceof Request
    ? input.url
    : input.toString();

Deno.test("exchangeHandler returns 401 if Authorization header is missing", async () => {
  const req = new Request("http://localhost/functions/exchange-oauth-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider: "strava", code: "test_code" }),
  });

  const response = await exchangeHandler(req);

  assertEquals(response.status, 401);
  const data = await response.json();
  assertEquals(data.msg, "Unauthorized");
});

Deno.test("exchangeHandler returns 401 if Bearer token is invalid/user not found", async () => {
  using _fetchStub = stub(globalThis, "fetch", (input) => {
    if (getUrl(input).includes("/auth/v1/user")) {
      return Promise.resolve(
        Response.json({ error: "invalid_token" }, { status: 401 }),
      );
    }
    return Promise.resolve(new Response("Not Found", { status: 404 }));
  });

  const req = new Request("http://localhost/functions/exchange-oauth-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer fake_token",
    },
    body: JSON.stringify({ provider: "strava", code: "test_code" }),
  });

  const response = await exchangeHandler(req);
  assertEquals(response.status, 401);
  const data = await response.json();
  assertEquals(data.msg, "Unauthorized");
});

Deno.test("exchangeHandler returns 400 if provider is invalid", async () => {
  using _fetchStub = stub(globalThis, "fetch", async (input) => {
    if (getUrl(input).includes("/auth/v1/user")) {
      return await Promise.resolve(Response.json({ id: "test-user-id" }, {
        status: 200,
      }));
    }
    return await Promise.resolve(Response.json("Not Found", { status: 404 }));
  });

  const req = new Request("http://localhost/functions/exchange-oauth-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer fake_valid_token",
    },
    body: JSON.stringify({ provider: "invalid_provider", code: "test_code" }),
  });

  const response = await exchangeHandler(req);
  assertEquals(response.status, 400);
  const data = await response.json();
  assertEquals(data.msg, "Invalid provider or missing code");
});

Deno.test("exchangeHandler returns 400 if code is missing", async () => {
  using _fetchStub = stub(globalThis, "fetch", async (input) => {
    await Promise.resolve(); // Ensure async behavior
    if (getUrl(input).includes("/auth/v1/user")) {
      return Response.json({ id: "test-user-id" }, { status: 200 });
    }
    return Response.json("Not Found", { status: 404 });
  });

  const req = new Request("http://localhost/functions/exchange-oauth-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer fake_valid_token",
    },
    body: JSON.stringify({ provider: "strava" }), // Missing code
  });

  const response = await exchangeHandler(req);
  assertEquals(response.status, 400);
  const data = await response.json();
  assertEquals(data.msg, "Invalid provider or missing code");
});

Deno.test("exchangeHandler returns 200 and stores tokens on successful Strava exchange", async () => {
  using _fetchStub = stub(globalThis, "fetch", async (input) => {
    await Promise.resolve();
    const url = getUrl(input);

    // 1. Mock Supabase Response
    if (url.includes("/auth/v1/user")) {
      return Response.json({ id: "test-user-id" }, { status: 200 });
    }

    // 2. Mock Strava Response
    if (url.includes("strava.com/oauth/token")) {
      return Response.json({
        access_token: "mock_access",
        refresh_token: "mock_refresh",
        expires_at: 1234567890,
        athlete: { id: 999999 },
      }, { status: 200 });
    }

    // 3. Mock DB Insert
    if (url.includes("/rest/v1/strava_tokens")) {
      return Response.json(null, { status: 201 }); // 201 Created
    }

    return Response.json("Not Found", { status: 404 });
  });

  const req = new Request("http://localhost/functions/exchange-oauth-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer fake_valid_token",
    },
    body: JSON.stringify({ provider: "strava", code: "valid_code" }),
  });

  const response = await exchangeHandler(req);
  const data = await response.json();

  assertEquals(response.status, 200);
  assertEquals(data.msg, "OAuth token exchanged successfully");
});

Deno.test("exchangeHandler returns 500 if Strava returns no athlete", async () => {
  using _fetchStub = stub(globalThis, "fetch", async (input) => {
    await Promise.resolve();
    const url = getUrl(input);

    if (url.includes("/auth/v1/user")) {
      return Response.json({ id: "test-user-id" }, { status: 200 });
    }

    // Mock Strava Response MISSING 'athlete'
    if (url.includes("strava.com/oauth/token")) {
      return Response.json({
        access_token: "mock_access",
        refresh_token: "mock_refresh",
        expires_at: 1234567890,
        // athlete is missing!
      }, { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  });

  const req = new Request("http://localhost/functions/exchange-oauth-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer fake_valid_token",
    },
    body: JSON.stringify({ provider: "strava", code: "valid_code" }),
  });

  const response = await exchangeHandler(req);
  const data = await response.json();

  assertEquals(response.status, 500);
  assertEquals(data.msg, "Failed to exchange strava token");
});

Deno.test("exchangeHandler returns 200 and stores tokens on successful Spotify exchange", async () => {
  using _fetchStub = stub(globalThis, "fetch", async (input) => {
    await Promise.resolve();
    const url = getUrl(input);

    // 1. Mock Supabase Auth Response
    if (url.includes("/auth/v1/user")) {
      return Response.json({ id: "test-user-id" }, { status: 200 });
    }

    // 2. Mock Spotify Token Response
    if (url === "https://accounts.spotify.com/api/token") {
      return Response.json({
        access_token: "mock_spotify_access",
        refresh_token: "mock_spotify_refresh",
        expires_in: 3600,
      }, { status: 200 });
    }

    // 3. Mock DB Insert for spotify_tokens
    if (url.includes("/rest/v1/spotify_tokens")) {
      return Response.json(null, { status: 201 });
    }

    return Response.json("Not Found", { status: 404 });
  });

  const req = new Request("http://localhost/functions/exchange-oauth-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer fake_valid_token",
    },
    body: JSON.stringify({ provider: "spotify", code: "valid_spotify_code" }),
  });

  const response = await exchangeHandler(req);
  const data = await response.json();

  assertEquals(response.status, 200);
  assertEquals(data.msg, "OAuth token exchanged successfully");
});

Deno.test("exchangeHandler returns 500 if Spotify token exchange fails", async () => {
  using _fetchStub = stub(globalThis, "fetch", async (input) => {
    await Promise.resolve();
    const url = getUrl(input);

    if (url.includes("/auth/v1/user")) {
      return Response.json({ id: "test-user-id" }, { status: 200 });
    }

    // Mock Spotify Error Response
    if (url === "https://accounts.spotify.com/api/token") {
      return Response.json({
        error: "invalid_grant",
        error_description: "Invalid authorization code",
      }, { status: 400 });
    }

    return Response.json("Not Found", { status: 404 });
  });

  const req = new Request("http://localhost/functions/exchange-oauth-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer fake_valid_token",
    },
    body: JSON.stringify({ provider: "spotify", code: "invalid_spotify_code" }),
  });

  const response = await exchangeHandler(req);
  const data = await response.json();

  assertEquals(response.status, 500);
  assertEquals(data.msg, "Failed to exchange spotify token");
});

Deno.test("exchangeHandler returns 500 if DB insert fails", async () => {
  using _fetchStub = stub(globalThis, "fetch", async (input) => {
    await Promise.resolve();
    const url = getUrl(input);

    if (url.includes("/auth/v1/user")) {
      return Response.json({ id: "test-user-id" }, { status: 200 });
    }

    if (url.includes("strava.com/oauth/token")) {
      return Response.json({
        access_token: "mock_access",
        refresh_token: "mock_refresh",
        expires_at: 1234567890,
        athlete: { id: 999999 },
      }, { status: 200 });
    }

    // Mock DB Failure
    if (url.includes("/rest/v1/strava_tokens")) {
      return Response.json({ message: "DB Error" }, { status: 400 });
    }

    return new Response("Not Found", { status: 404 });
  });

  const req = new Request("http://localhost/functions/exchange-oauth-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer fake_valid_token",
    },
    body: JSON.stringify({ provider: "strava", code: "valid_code" }),
  });

  const response = await exchangeHandler(req);
  const data = await response.json();

  assertEquals(response.status, 500);
  assertEquals(data.msg, "Failed to exchange strava token");
});
