# IssueBuddy (Kid-friendly Issue Tracker)

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
