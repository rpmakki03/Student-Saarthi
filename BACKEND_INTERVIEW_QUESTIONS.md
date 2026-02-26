# Backend Interview Questions for Student Saarthi

This document outlines backend-specific interview questions and answers tailored to the architecture and tech stack of the **Student Saarthi** application, which utilizes Next.js App Router API Routes, Supabase, Google Gemini API, and Google Cloud Text-to-Speech.

---

## 1. Next.js API Routes & Backend Architecture

**Q1: Student Saarthi uses Next.js 16 with the App Router. Explain the difference between Route Handlers (`app/api/.../route.ts`) and Server Actions. When would you use one over the other?**
*   **Answer:** 
    *   **Route Handlers** (`route.ts`) are used to create standard RESTful APIS (GET, POST, PUT, DELETE). They are ideal for cross-origin requests, webhooks, or endpoints that might be consumed by mobile apps or external services. In Student Saarthi, they are used for `/api/guidance` and `/api/tts`.
    *   **Server Actions** are asynchronous functions that run on the server and can be called directly from Client or Server Components. They are tightly integrated with React's form submission and data mutation paradigms.
    *   **Use Case:** I would use Route Handlers for external integrations (like calling the Gemini or TTS APIs where I need strict control over the Request/Response objects) and Server Actions for simple database mutations (like updating a user profile or saving quiz results directly from a form).

**Q2: How do you handle environment variables and secrets securely in a Next.js application to ensure they are not exposed to the client?**
*   **Answer:** Next.js distinguishes between server and client environment variables. Variables prefixed with `NEXT_PUBLIC_` (like `NEXT_PUBLIC_SUPABASE_URL`) are bundled and exposed to the browser. Sensitive secrets (like `GOOGLE_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY`) do not have this prefix, meaning they are only accessible within Node.js environments (Server Components, Route Handlers, Middleware). I ensure all third-party API keys remain strictly on the server side.

---

## 2. Authentication & Middleware (Supabase SSR)

**Q3: Describe how Server-Side Rendering (SSR) authentication works with Supabase in Next.js. What is the lifecycle of an authenticated request?**
*   **Answer:** 
    1.  **Login/Signup:** The client sends credentials to Supabase via `@supabase/ssr` methods. Supabase returns a session containing a JWT (Access Token) and a Refresh Token.
    2.  **Cookie Storage:** These tokens are securely stored in HTTP-only cookies by the server.
    3.  **Middleware (`proxy.ts` / `middleware.ts`):** On every subsequent request, Next.js Middleware intercepts the request, reads the cookies, and verifies the JWT with Supabase.
    4.  **Refresh:** If the access token is expired, the middleware seamlessly uses the refresh token to get a new access token, updates the cookies, and continues the request.
    5.  **Authorization:** If a user tries to access a protected route without a valid token, the middleware redirects them to `/login`.

**Q4: In the `app/auth/callback/route.ts` file, you handle the OAuth/Email verification callback. Why must this be handled on the server side?**
*   **Answer:** When a user clicks an email confirmation or magic link, a code is appended to the URL. The `auth/callback` route intercepts this URL, extracts the code, and securely exchanges it for an authentication session (tokens) using `supabase.auth.exchangeCodeForSession(code)`. Doing this on the server ensures that the resulting cookies are set in an HTTP-only manner, protecting them from Cross-Site Scripting (XSS) attacks.

---

## 3. Third-Party Integrations (Gemini & Cloud TTS)

**Q5: How does the `/api/guidance` endpoint integrate with the Google Gemini API? How do you ensure the AI returns a structured JSON format rather than freeform text?**
*   **Answer:** The endpoint uses the `@google/generative-ai` SDK. To ensure structured JSON:
    1.  I use "Prompt Engineering" by explicitly stating in the System Prompt to return *only* valid JSON.
    2.  I provide a strict JSON schema or template in the prompt detailing the exact keys expected (e.g., `stream`, `rationale`, `subjects`, `careers`).
    3.  I configure the model (if supported by the specific Gemini version) to use `response_mime_type: "application/json"`.
    4.  On the backend, I wrap the `JSON.parse()` call in a `try-catch` block. If the AI hallucinates bad formatting, the backend catches it and can either retry the request or return a graceful 500 error to the client.

**Q6: Walk me through the `/api/tts` endpoint. How do you stream audio back to the client from the Google Cloud TTS API?**
*   **Answer:** 
    1.  The client POSTs text to `/api/tts`.
    2.  The backend authorizes the request and uses the `@google-cloud/text-to-speech` Node.js client, authenticated via a service account JSON key.
    3.  A request payload is constructed specifying the text, the specific Hindi voice model (e.g., `hi-IN-Standard-A`), and the audio encoding (`MP3`).
    4.  Google returns a base64 encoded string or an audio buffer.
    5.  The Next.js Route Handler returns a standard HTTP `Response` object with the `Content-Type` set to `audio/mpeg`, containing the audio buffer. This allows the client browser's `<audio>` tag to stream or play it immediately.

---

## 4. Database Optimization & Security

**Q7: Supabase uses PostgreSQL under the hood. What are Row Level Security (RLS) policies, and why are they critical for this application?**
*   **Answer:** Row Level Security (RLS) is a PostgreSQL feature that restricts which rows in a table a query can interact with based on the context of the user running the query. Since modern stacks like Supabase allow clients to query the database directly via the client library, RLS is the absolute bare-minimum security layer. For instance, I would write a policy on the `quiz_results` table ensuring `auth.uid() = user_id`, guaranteeing a student can only read, update, or delete their own quiz answers and guidance results, and not those of other students.

**Q8: If a user tries to abuse the Gemini API endpoint (`/api/guidance`) by hitting it thousands of times, the costs could skyrocket. How would you implement rate limiting in Next.js?**
*   **Answer:** Several approaches exist:
    1.  **Vercel KV / Upstash Redis:** Use Redis to track the number of requests per IP address or User ID within a time window (e.g., max 5 requests per minute).
    2.  **Next.js Middleware:** Intercept requests to `/api/guidance` in `proxy.ts` and check the Redis cache. If the limit is exceeded, return a `429 Too Many Requests` response before the Gemini API is ever invoked.
    3.  **Third-Party Services:** Use a service like Cloudflare (WAF Rules) or Upstash Ratelimit to handle this at the edge.

---

## 5. Performance & Error Handling

**Q9: The Gemini API call can take a few seconds to process. How do you prevent frontend timeouts and ensure a good user experience from a backend perspective?**
*   **Answer:** 
    1.  **Configure execution timeouts:** Ensure the Next.js API route has a sufficient `maxDuration` configured (e.g., `export const maxDuration = 60;` in Next 14/15/16).
    2.  **Streaming:** Instead of waiting for the entire JSON payload to generate, use Next.js's stream capabilities (via `StreamingTextResponse`) to send chunks of the guidance object to the client as they are generated by Gemini. This allows the UI to start rendering incrementally, significantly reducing the "Time to First Byte" (TTFB).
    3.  **Background Jobs:** For very heavy processing, we could accept the request, push a job to a queue (like Inngest or Trigger.dev), immediately return a `202 Accepted` status to the client, and have the client poll for completion or use WebSockets/Server-Sent Events.
