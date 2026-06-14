<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/049a70b9-51ed-4678-9557-621a75dc89fd

## Architecture

The Gemini call runs on a small backend (`server/index.ts`) so the API key
**never reaches the browser**. The React frontend talks to the backend's
`/api/analyze` endpoint, and the backend serves the built frontend in
production.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set `GEMINI_API_KEY` in `.env` (or your shell) to your Gemini API key.
3. Start the backend (port 3001):
   `npm run dev:server`
4. In a second terminal, start the frontend (port 3000, proxies `/api` to the backend):
   `npm run dev`

## Deploy on Railway

The key is a **server-only** secret — it is not baked into the frontend bundle.

1. **Build command:** `npm run build`
2. **Start command:** `npm start` (runs the Express server, which serves the
   built frontend and handles `/api/analyze`)
3. Add a Railway **variable** named `GEMINI_API_KEY` with your key (no quotes or
   trailing spaces). The server reads `process.env.GEMINI_API_KEY` at runtime,
   so updating it only requires a restart — no rebuild needed.
