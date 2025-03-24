// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const { name } = await req.json();
  console.log("Hello, " + name + "! You've hit the Supabase Functions API.");
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  console.log(token);

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Insert a new row (id and timestamp are handled by the database)
    const { data: data1, error: error1 } = await supabaseClient
      .from("testtable")
      .insert({});
    console.log(data1, error1);
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: data2, error: error2 } = await supabaseClient.auth.getUser(
      token
    );
    if (error2 || !data2.user) {
      return new Response("Unauthorized", { status: 401 });
      console.log(error2);
    }
    console.log("The user who sent the request: " + data2.user.id);

    if (error2) {
      console.log(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({ message: "Entry added successfully" }),
      { status: 200 }
    );
  } catch (error) {
    // console.log(err);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" + error }),
      {
        status: 500,
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
