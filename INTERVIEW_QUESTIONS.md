# Interview Questions for Student Saarthi

This document outlines potential interview questions and topics based on the architecture, tech stack, and features of the **Student Saarthi** application.

## 1. Next.js 16 & React Architecture
**Q1: Student Saarthi uses Next.js 16 with the App Router. What are the primary benefits of the App Router over the older Pages Router, especially for a project like this?**
*Expected Points:* Server Components by default, improved layout nesting, better performance via streaming, optimized data fetching, and simpler routing mechanics.

**Q2: I see you implemented middleware for Supabase Auth in `proxy.ts`. Can you explain the role of Next.js Middleware and why you chose to handle authentication checks there?**
*Expected Points:* Middleware runs before a request is completed. It's ideal for authentication because it can intercept unauthenticated users attempting to access protected routes (like `/timeline` or `/guidance`) and redirect them to the `/login` page securely before rendering any page content.

**Q3: How do you decide which components should be Server Components (`Server`) and which should be Client Components (`'use client'`) in this application?**
*Expected Points:* Data fetching, database interactions, and secure operations (like calling Gemini API or Supabase securely) should be Server Components. Interactivity, state management (useState, useEffect), hooks like `useForm`, or browser APIs (like Web Speech API) must be in Client components.

## 2. Artificial Intelligence (Gemini Integration)
**Q4: How did you integrate the Google Gemini 1.5 Flash model? Describe the prompt engineering approach you used to generate career guidance.**
*Expected Points:* Discussion of the `google/generative-ai` SDK, how system instructions and user inputs (from the quiz) are combined. Use of structured JSON output prompting to ensure the AI returns data (stream, rationale, subjects, careers) that can be reliably rendered in the UI.

**Q5: AI APIs can sometimes be slow or fail. How do you handle error states, timeouts, or malformed JSON responses from the Gemini API when generating guidance?**
*Expected Points:* Using try-catch blocks, providing fallback UI/error messages to the user, validating the JSON payload before passing it to the frontend, and perhaps implementing loading skeletons while waiting for the response.

## 3. Database & Authentication (Supabase)
**Q6: You migrated to Supabase Auth using Server-Side Rendering (SSR). What are the security and user experience benefits of SSR authentication compared to purely client-side authentication?**
*Expected Points:* SSR allows the server to know the user's auth state on the first request, preventing the "flicker" of unauthenticated content before client checking finishes. It relies on secure, HttpOnly cookies rather than local storage.

**Q7: How did you implement user profile creation upon signup?**
*Expected Points:* Discuss intercepting the signup flow or using Supabase Database Webhooks / Triggers to automatically insert a new row in a `users` or `profiles` table whenever a new user is created in Supabase Auth.

## 4. Voice & Interactive Features
**Q8: The app features Hindi speech output using Google Cloud TTS. Walk me through the data flow from when the AI generates the text to when the user hears the audio.**
*Expected Points:* Frontend requests audio for the generated text via a `/api/tts` endpoint. The backend securely authenticates with Google Cloud using the Service Account, sends the text payload, receives an MP3/audio stream, and sends it back to the client where it is played using the HTML5 `<audio>` element or Web Audio API.

**Q9: For the Speech-to-Text feature, you used the Web Speech API. What challenges did you face with browser compatibility, and how do you handle browsers that do not support this API?**
*Expected Points:* Acknowledging that Web Speech API (like `webkitSpeechRecognition`) is not supported uniformly across all browsers (e.g., Firefox or older iOS Safari). Providing fallback UI (standard keyboard input) and checking `window.SpeechRecognition` before mounting the microphone interface.

## 5. Styling & the UI
**Q10: You've implemented a Dark/Light mode toggle utilizing `next-themes` and Tailwind CSS v4. How does `next-themes` integrate with Tailwind's dark mode strategy?**
*Expected Points:* `next-themes` handles injecting the `dark` class into the `<html>` or `<body>` tag based on user preference or system settings. Tailwind CSS then applies utility classes prefixed with `dark:` (e.g., `dark:bg-slate-900`) when that class is present at the root level.

**Q11: The project uses `shadcn/ui` for components. Why choose `shadcn/ui` over a traditional component library like Material UI or Chakra UI?**
*Expected Points:* `shadcn/ui` is not installed as an npm package but instead components are copied directly into the codebase. This allows for total customization, better performance (no styling overhead), native Tailwind integration, and prevents bloated bundle sizes.

## 6. General Software Engineering
**Q12: If we wanted to scale this app to support 10,000 concurrent students taking the quiz and requesting AI guidance simultaneously, what potential bottlenecks would you anticipate and how would you address them?**
*Expected Points:* 
- **Database Limits:** Supabase connection pooling.
- **API Rate Limits:** Google Gemini and Cloud TTS rate limits (implementing request queuing, caching identical responses, or load balancing).
- **Compute:** Ensuring Next.js API routes are optimized, potentially offloading heavy tasks to background queues.

**Q13: What was the most challenging technical hurdle you faced while building Student Saarthi, and how did you overcome it?**
*(Candidate should provide a personal anecdote, e.g., handling Supabase SSR cookie logic, dealing with AI JSON hallucinations, or syncing audio files with the UI).*
