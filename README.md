# VedaAI

VedaAI is a production-oriented AI assessment creator for teachers. It uses a Next.js 15 App Router frontend, an Express/TypeScript backend, MongoDB, Redis, BullMQ workers, Socket.IO realtime progress, structured AI generation, and server-side PDF export.

For a fuller guided walkthrough of setup, main file purposes, and the complete frontend-to-backend generation pipeline, open `walkthrough.html` in the project root.

## Monorepo

- `apps/frontend`: Next.js 15, Tailwind CSS, Zustand, React Hook Form, Zod, Socket.IO client, Framer Motion, local shadcn-style primitives.
- `apps/backend`: Express, Mongoose, Redis, BullMQ, Socket.IO, file extraction, AI generation, PDF generation.
- `packages/shared-types`: shared assignment, paper, and job status contracts.

## Local Setup

```bash
npm install
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
docker compose up mongo redis
npm run dev:backend
npm run worker --workspace @vedaai/backend
npm run dev:frontend
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:4000/api/health`

If `OPENAI_API_KEY` is absent, the worker uses a deterministic structured fallback so the end-to-end flow still works locally. With an API key, responses are requested as JSON only and parsed into the shared `GeneratedPaper` schema before rendering.

The frontend dev script clears `.next` before starting. This avoids stale Next.js vendor chunk errors when switching between production builds and the dev server.

## Demo Data

The backend seeds two completed example assignments for the mock teacher when a fresh MongoDB database is first accessed:

- `Quiz on Electricity`
- `English Grammar Practice`

Each demo assignment includes generated paper JSON and a server-side PDF, so the dashboard can show the filled assignment state immediately after the first API request.

## Docker

```bash
docker compose up --build
```

The compose stack starts MongoDB, Redis, backend API, BullMQ worker, and frontend.

## Main Flow

1. Teacher creates an assignment with files or manual text.
2. Backend validates the request and stores an assignment.
3. BullMQ processes extraction and AI generation.
4. Worker stores the generated paper and creates a PDF with `pdf-lib`.
5. Socket.IO emits `queued`, `processing`, `generating_questions`, `generating_answers`, `creating_pdf`, `completed`, or `failed`.
6. Frontend updates the progress UI and renders the exam-paper output page.

## Deployment Notes

- Set `MONGODB_URI`, `REDIS_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `FRONTEND_URL`, and public frontend API/socket URLs.
- Run the backend API and worker as separate processes.
- Persist `UPLOAD_DIR` and `GENERATED_DIR` or replace them with object storage.
- Put the API behind TLS and keep `FRONTEND_URL` restricted to the deployed frontend origin.
