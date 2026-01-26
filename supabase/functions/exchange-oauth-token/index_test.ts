import { assertEquals } from "@std/assert";
import { stub } from "@std/testing/mock";

// Set up mock environment variables
Deno.env.set("SUPABASE_URL", "https://example.supabase.co");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "example-key");
Deno.env.set("STRAVA_CLIENT_ID", "123");
Deno.env.set("STRAVA_CLIENT_SECRET", "secret");

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
    await Promise.resolve(); // Ensure async behavior
    if (getUrl(input).includes("/auth/v1/user")) {
      return Response.json({ id: "test-user-id" }, {
        status: 200,
      });
    }
    return new Response("Not Found", { status: 404 });
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
    return new Response("Not Found", { status: 404 });
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
