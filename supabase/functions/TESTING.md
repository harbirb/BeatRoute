# Testing Guide for Supabase Edge Functions

This project uses two distinct strategies for testing Edge Functions, depending on the goal: **Unit Testing** (internal logic) and **Integration Testing** (end-to-end endpoints).

## 1. Unit Testing (Recommended for logic)

**Goal:** Test individual functions, classes, and logic in isolation without running the Supabase server.
**Location:** Inside the specific function's directory.

### Why this approach?
*   **Import Resolution:** Deno automatically resolves imports using the `deno.json` located in the same folder. If you move tests outside, you lose access to these mapped imports (like `supabase`, `shared-utils`) and have to manually redefine them.
*   **Speed:** These tests run instantly without network overhead.

### Setup
1.  Ensure your function folder (e.g., `functions/my-feature/`) has a `deno.json`.
2.  Add testing libraries to that `deno.json`:
    ```json
    {
      "imports": {
        "supabase": "jsr:@supabase/supabase-js@2",
        "@std/assert": "jsr:@std/assert@1"
      }
    }
    ```
3.  Create your test file **inside** that folder (e.g., `functions/my-feature/logic_test.ts`).

### Running Unit Tests
Since imports are defined in the function's local `deno.json`, you must run the test from within that directory or point to the config file.

**Option 1 (Simplest):**
Change into the directory and run:
```bash
cd functions/my-feature
deno test --allow-all
```

**Option 2 (From Root):**
Point to the specific config file:
```bash
deno test --config functions/my-feature/deno.json --allow-all functions/my-feature/
```

---

## 2. Integration / E2E Testing (Supabase Recommended)

**Goal:** Test the actual HTTP endpoints of a running function.
**Location:** `functions/tests/`

### Why this approach?
*   It verifies that the function handles HTTP requests, headers, and environment variables correctly in a production-like environment.
*   It is "black box" testing (input -> output).

### Setup
1.  Create a test file in the global tests folder: `functions/tests/my-feature-test.ts`.
2.  **Note:** You cannot easily import internal logic from your functions here because the import maps won't match. Focus on `fetch()` calls.

### Running Integration Tests
Start the local Supabase server and run the test:
```bash
supabase start
deno test --allow-net --env-file .env functions/tests/
```
