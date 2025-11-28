# IssueFlow - Professional Issue Tracker

Quick reference guide for getting started.

## Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run seed      # Optional: add sample data
npm start         # Runs on http://localhost:8080
```

### Frontend Setup
```bash
cd frontend  
npm install
cp .env.example .env
npm run dev       # Runs on http://localhost:5173
```

Then open: http://localhost:5173

## Key Features
- 🎨 Kanban Board with drag & drop
- 📊 Real-time Analytics Dashboard
- 🔍 Advanced Search & Filtering
- 💬 Comments & Discussion Threads
- 📜 Complete Audit Trail
- 🔗 Ticket Linking & Dependencies
- 📥 CSV/JSON Export
- 🌓 Dark/Light Themes
- 🏷️ Tags & Due Dates
- ✅ Bulk Operations

## Tech Stack
- Frontend: React 18, Vite, React Router 6
- Backend: Node.js, Express
- Database: lowdb (JSON file-based)

## Production Build

Frontend:
```bash
cd frontend
npm run build
# Output in dist/ folder
```

Backend is production-ready as-is:
```bash
cd backend
NODE_ENV=production npm start
```

## Environment Variables

Backend (.env):
```
PORT=8080
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Frontend (.env):
```
VITE_API_URL=http://localhost:8080
```

## Documentation
See README.md for complete documentation, API reference, and deployment guides.

## License
MIT - Free to use for personal and commercial projects.

A tiny **issue tracking** app. It has:
- **Backend**: Node + Express + `lowdb` (keeps data in a file `db.json`).
- **Frontend**: React + Vite.
- Works on Windows with just Node installed. No database install needed.

## How to run

### 1) Backend
```
cd issuebuddy/backend
copy .env.example .env
npm install
npm run seed
npm start
```
You should see: `IssueBuddy API listening on http://localhost:8080`

### 2) Frontend (in a new terminal)
```
cd issuebuddy/frontend
npm install
npm run dev
```
Open: `http://localhost:5173`

Enjoy!
