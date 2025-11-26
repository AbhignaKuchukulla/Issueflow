# 🚀 Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Backend Setup (2 minutes)

```powershell
cd backend
npm install
npm run seed
npm start
```

You should see: `IssueBuddy API listening on http://localhost:3001`

## Step 2: Frontend Setup (2 minutes)

Open a **new terminal** window:

```powershell
cd frontend
npm install
npm run dev
```

You should see: `Local: http://localhost:5173/`

## Step 3: Open & Explore! (1 minute)

Open your browser to: **http://localhost:5173**

### 🎯 Try These Features:

#### Core Features:
1. **Dashboard** - View analytics, KPIs, and team performance (home page)
2. **View Tickets** - See the pre-seeded sample data in List view
3. **Search** - Type in the search box (notice the 300ms debounce)
4. **Advanced Filters** - Click "Advanced" in List view, try filtering by assignee, date, tags, overdue
5. **Create Ticket** - Use the form, optionally select a template
6. **Kanban Board** - Click "Kanban" in navigation
7. **Drag & Drop** - Drag cards between columns (optimistic updates!)
8. **Keyboard Nav** - Focus a card, press Enter to move it
9. **Edit Ticket** - Click any ticket title
10. **Ticket History** - In edit view, scroll down to see complete audit log

#### Professional Features:
11. **Bulk Operations** - Select multiple tickets with checkboxes, use bulk actions
12. **Templates** - When creating a ticket, try the template dropdown (Bug Report, Feature Request, etc.)
13. **Due Dates** - Set due dates, see overdue indicators (red highlighting)
14. **Tags** - Add comma-separated tags, see them as badges
15. **Comments** - In edit view, add comments to tickets
16. **Export Data** - Click CSV or JSON buttons in list view
17. **Sorting** - Sort by updated, created, priority, or due date
18. **Team Analytics** - Check dashboard for completion rates by assignee
19. **Recent Activity** - Dashboard shows last 10 actions across all tickets
20. **Toggle Theme** - Click the theme toggle button

### 🎨 Watch For:

- **Dashboard Analytics** - KPI cards, status/priority breakdowns, team performance
- **Toast notifications** (top-right) after actions
- **Loading spinners** during API calls
- **Optimistic updates** when dragging cards (instant feedback)
- **Validation errors** if you enter invalid data
- **Overdue highlighting** (red rows) in List view
- **Tag badges** displayed throughout the app
- **Ticket history** showing complete audit trail
- **Advanced filter panel** (collapsible) in List view
- **Bulk selection** checkboxes in List view

## 🐛 Troubleshooting

### Backend won't start?
- Make sure you're in the `backend` folder
- Check if port 8080 is already in use
- Run `npm install` again

### Frontend won't start?
- Make sure you're in the `frontend` folder
- Check if port 5173 is already in use
- Run `npm install` again

### Can't see data?
- Make sure you ran `npm run seed` in the backend
- Check that both servers are running
- Try refreshing the page

### API errors?
- Check the `.env` file in frontend has `VITE_API_URL=http://localhost:3001`
- Make sure backend is running on port 3001

## 📚 Learn More

- **IMPROVEMENTS.md** - Detailed documentation of all 19 features
- **README.md** - Complete project documentation
- Check sample data from seed script for examples of tags, due dates, etc.

## 🎉 That's It!

You're all set! Explore the features:
- Start at the **Dashboard** for an overview
- Try **advanced filtering** in List view
- Use **bulk operations** to manage multiple tickets
- Create tickets with **templates** for consistency
- Check the **audit log** to see change history

For detailed documentation, see [IMPROVEMENTS.md](IMPROVEMENTS.md)
