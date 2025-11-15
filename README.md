# TaskGenius — AI-Enhanced Task Management

A full-stack task manager that combines standard CRUD with AI-driven task breakdowns and project summaries.

**Why Use TaskGenius?**
- **Smart Planning**: Turn high-level goals into 3–5 actionable sub-tasks with one click.
- **Project Summaries**: Generate professional summary paragraphs from completed tasks.
- **Secure by Design**: The Gemini API key is used only on the server and never exposed to the client.

**Tech Stack**
- **Frontend**: React 
- **Backend**: Node.js, Express
- **Database**: MongoDB 
- **AI**: Google Gemini API


**Project Structure (top-level)**
- **`client/`** — React app (Vite) with `src/` and `public/`
- **`server/`** — Express API, routes, and Mongoose models

**Core Features**
- **Full CRUD**: Create, read, update (toggle complete), and delete tasks.
- **AI Task Breakdown**: Provide a goal and receive multiple actionable sub-tasks.
- **AI Project Summary**: Summarize completed tasks into a single paragraph.
- **Filtering**: View `All`, `Active`, or `Completed` tasks.

**Quick Start**
Run backend and frontend in separate terminals. From the repository root:

1) Start the backend

```powershell
cd server
npm install
# Create a `.env` file (see below)
npm run dev
```

2) Start the frontend

```powershell
cd client
npm install
npm run dev
```

The backend defaults to `http://localhost:5000` and the frontend to `http://localhost:5173` (Vite). The client is configured to proxy API calls to the server.

**Environment Variables (server/.env)**
Create a `.env` file inside `server/` with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**API Endpoints**
- **Tasks**
	- `POST /api/tasks` — Create a task.
	- `GET /api/tasks` — List all tasks.
	- `PUT /api/tasks/:id` — Update a task (e.g., toggle `completed`).
	- `DELETE /api/tasks/:id` — Remove a task.
- **AI**
	- `POST /api/ai/breakdown` — Provide a title; returns AI-generated sub-tasks.
	- `POST /api/ai/summary` — Provide completed task titles; returns an AI summary paragraph.



