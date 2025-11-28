# 🚀 IssueFlow - Professional Issue Tracking System

> A modern, full-featured issue tracking application built with React and Node.js. Perfect for teams managing projects, bugs, and tasks with enterprise-grade features.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

## 🌟 Key Features

### 📊 **Dashboard & Analytics**
Real-time KPIs, status/priority breakdowns, team performance metrics, and recent activity feed

### 🎨 **Kanban Board**
Drag-and-drop interface with 4 status columns (Open, In Progress, Review, Closed)

### 🎫 **Ticket Management**
- Full CRUD operations with validation
- 5 ready-to-use templates (Bug, Feature, Task, Improvement, Documentation)
- Advanced filtering by status, priority, assignee, date range, tags, and overdue status
- Bulk operations (update/delete multiple tickets)
- CSV/JSON export functionality
- Ticket linking with dependency types (blocks, blocked_by, related, duplicates)

### 💬 **Collaboration**
- Comments/discussion threads on each ticket
- Complete audit trail with change history
- Due dates with overdue indicators
- Tags for categorization

### 🎯 **User Experience**
- Dark/Light theme toggle with persistence
- Toast notifications
- Debounced search (300ms)
- Optimistic UI updates
- Keyboard navigation & accessibility (ARIA)
- Loading states & error boundaries
- Saved filter combinations for quick access

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

**1. Clone & Install**
```bash
git clone https://github.com/yourusername/issueflow.git
cd issueflow

# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

**2. Configure Environment**

Backend `.env`:
```env
PORT=8080
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Frontend `.env`:
```env
VITE_API_URL=http://localhost:8080
```

**3. Seed Database (Optional)**
```bash
cd backend
npm run seed
```

**4. Start Servers**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

**5. Open Application**
Navigate to `http://localhost:5173`

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router 6 |
| **Backend** | Node.js, Express |
| **Database** | lowdb (JSON file-based) |
| **Styling** | CSS Variables, Custom CSS |
| **State** | React Hooks, Context API |

---

## 📂 Project Structure

```
issueflow/
├── backend/
│   ├── server.js          # Express API (18 endpoints)
│   ├── seed.js            # Sample data generator
│   ├── db.json            # Database file
│   ├── .env               # Environment config
│   └── tests/
│       └── server.test.js # API test suite
│
└── frontend/
    ├── src/
    │   ├── main.jsx       # Entry point
    │   ├── App.jsx        # Root layout & routing
    │   ├── api.js         # API client
    │   ├── styles.css     # Global styles
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── hooks/         # Custom hooks
    │   └── utils/         # Utilities
    ├── index.html
    └── .env               # Environment config
```

---

## 🔌 API Reference

### Core Endpoints
```
GET    /api/tickets          # List with filters & pagination
POST   /api/tickets          # Create new ticket
GET    /api/tickets/:id      # Get single ticket
PUT    /api/tickets/:id      # Update ticket
DELETE /api/tickets/:id      # Delete ticket
POST   /api/tickets/bulk     # Bulk update/delete

GET    /api/tickets/:id/comments     # Get comments
POST   /api/tickets/:id/comments     # Add comment
GET    /api/tickets/:id/history      # Get change history

POST   /api/tickets/:id/link         # Link tickets
DELETE /api/tickets/:id/link/:relId  # Unlink tickets

GET    /api/filters          # Get saved filters
POST   /api/filters          # Save filter
DELETE /api/filters/:id      # Delete filter

GET    /api/analytics        # Dashboard analytics
GET    /health               # Health check
```

### Query Parameters (GET /api/tickets)
- `q` - Search term
- `status` - Filter by status
- `priority` - Filter by priority
- `assignee` - Filter by assignee
- `tags` - Filter by tags
- `sortBy` - Sort field (updatedAt, createdAt, priority, dueDate)
- `sortOrder` - asc/desc
- `fromDate`, `toDate` - Date range
- `overdue` - Show overdue only
- `page`, `pageSize` - Pagination

---

## ✅ Validation Rules

| Field | Rules |
|-------|-------|
| **Title** | 3-100 characters, required |
| **Description** | 3-1000 characters, required |
| **Status** | open, in_progress, review, closed |
| **Priority** | low, medium, high, urgent |
| **Assignee** | max 50 characters, optional |
| **Due Date** | ISO8601 date, optional |
| **Tags** | Array of strings, optional |
| **Comments** | 1-500 characters, required |

---

## 🧪 Testing

Run backend test suite:
```bash
cd backend
npm test
```

---

## 📦 Production Build

```bash
# Frontend
cd frontend
npm run build
# Output: dist/

# Backend - already production ready
cd backend
NODE_ENV=production npm start
```

---

## 🚀 Deployment

### Backend Options
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **DigitalOcean**: Deploy as Node.js app
- **AWS**: Use Elastic Beanstalk or EC2

### Frontend Options
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Use `gh-pages` package
- **Cloudflare Pages**: Connect GitHub repo

### Environment Variables
Remember to set environment variables in your deployment platform:
- Backend: `PORT`, `ALLOWED_ORIGINS`
- Frontend: `VITE_API_URL`

---

## 🎨 Feature Highlights

### 21 Professional Features

**Foundation (12)**
- Environment configuration
- Debounced search
- Toast notifications  
- Database seeding
- Enhanced validation
- Metadata display
- Optimistic updates
- Keyboard accessibility
- Export (CSV/JSON)
- Comments system
- Error boundaries
- Loading spinners

**Professional (9)**
- Audit log/history
- Advanced filtering
- Bulk operations
- Dashboard analytics
- Ticket templates
- Due dates tracking
- Tags system
- Ticket linking
- Saved filters

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Credits

Built with modern web technologies and best practices for optimal user experience.

**Made with ❤️ by [Your Name]**

---

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

### Core Functionality
- **📋 Ticket Management** - Full CRUD operations with templates
- **🎨 Kanban Board** - Visual drag-and-drop board with 4 status columns
- **📊 Dashboard Analytics** - Real-time KPIs, status/priority breakdowns, team performance
- **💬 Comments System** - Discussion threads on each ticket
- **📜 Audit Trail** - Complete history tracking of all changes
- **🔗 Ticket Linking** - Link related tickets with dependency types (blocks, blocked_by, related, duplicates)
- **💾 Saved Filters** - Save and quickly apply custom filter combinations
- **🔍 Advanced Search** - Multi-criteria filtering with debounced search
- **📥 Export** - Export tickets to CSV or JSON format
- **🌓 Dark/Light Mode** - Toggle between themes with persistence

### Advanced Features
- **🏷️ Tags System** - Categorize tickets with multiple tags
- **📅 Due Dates** - Set deadlines with overdue indicators
- **📋 Ticket Templates** - 5 pre-defined templates (Bug, Feature, Task, Improvement, Documentation)
- **✅ Bulk Operations** - Select and update/delete multiple tickets at once
- **🔄 Sorting** - Sort by updated, created, priority, or due date
- **📊 Team Analytics** - Completion rates and workload distribution by assignee
- **🔔 Recent Activity** - Real-time feed of last 10 actions

### User Experience Enhancements
- **⚡ Optimistic Updates** - Instant UI feedback with automatic rollback on errors
- **🔔 Toast Notifications** - Beautiful, non-intrusive success/error messages
- **⌨️ Keyboard Navigation** - Full keyboard support for all operations
- **♿ Accessibility** - ARIA labels and proper semantic HTML
- **📱 Responsive Design** - Works on all screen sizes
- **⏱️ Debounced Search** - 300ms delay to reduce unnecessary API calls
- **🎨 Visual Indicators** - Color-coded priority badges, overdue highlighting

### Data & Validation
- **✅ Field Validation** - Min/max length validation on all inputs
  - Title: 3-100 characters
  - Description: 3-1000 characters
  - Assignee: max 50 characters
  - Comments: 1-500 characters
  - Tags: comma-separated
- **🎫 Ticket IDs** - Unique identifiers displayed for easy reference
- **📅 Timestamps** - Created and updated dates on all tickets
- **🛡️ Error Boundaries** - Graceful error handling with recovery options
- **📝 History Tracking** - Every change logged with before/after values

## 🏗️ Architecture

**Backend**: Node.js + Express + lowdb (file-based JSON database)  
**Frontend**: React 18 + Vite + React Router 6  
**Styling**: Custom CSS with CSS variables for theming  
**State Management**: React Hooks + Context API

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

#### 1) Backend Setup
```bash
cd backend
copy .env.example .env    # Windows
# or cp .env.example .env  # Mac/Linux
npm install
npm run seed              # Populate with sample data
npm start                 # Start on http://localhost:8080
```

For development with auto-reload:
```bash
npm run dev
```

#### 2) Frontend Setup
```bash
cd frontend
copy .env.example .env    # Windows
# or cp .env.example .env  # Mac/Linux
npm install
npm run dev               # Start on http://localhost:5173
```

Open your browser to: `http://localhost:5173`

## 📝 Environment Configuration

### Backend (.env)
```env
PORT=8080
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080
```

## 🧪 Testing

Run the backend test suite:
```bash
cd backend
npm test
```

## 📂 Project Structure

```
Issue-buddy/
├── backend/
│   ├── server.js           # Express API server with all endpoints
│   ├── seed.js             # Database seeding with sample data
│   ├── db.json             # File-based database (lowdb)
│   ├── .env                # Environment variables
│   ├── .gitignore          # Git ignore rules
│   └── tests/
│       └── server.test.js  # API tests
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── .env                # Environment variables
    ├── .gitignore          # Git ignore rules
    └── src/
        ├── main.jsx        # App entry point
        ├── App.jsx         # Layout component with routing
        ├── api.js          # API client with all endpoints
        ├── styles.css      # Global styles with theming
        ├── components/
        │   ├── Comments.jsx        # Comments component
        │   ├── ErrorBoundary.jsx   # Error handling wrapper
        │   ├── History.jsx         # Audit log display
        │   ├── RelatedTickets.jsx  # Ticket linking component
        │   ├── SavedFilters.jsx    # Filter management
        │   ├── Spinner.jsx         # Loading spinner
        │   ├── ThemeToggle.jsx     # Dark/light mode toggle
        │   ├── TicketForm.jsx      # Ticket creation/edit form
        │   └── Toast.jsx           # Toast notifications
        ├── hooks/
        │   └── useDebounce.js      # Debounce hook
        ├── pages/
        │   ├── Dashboard.jsx   # Analytics dashboard
        │   ├── Edit.jsx        # Edit ticket page with comments & history
        │   ├── Kanban.jsx      # Kanban board view
        │   └── List.jsx        # List view with advanced filters
        └── utils/
            ├── export.js       # CSV/JSON export utilities
            └── templates.js    # Ticket templates
```

## 🎨 Key Features Explained

### 1. Toast Notifications
Replaced inline messages with beautiful toast notifications that appear in the top-right corner and auto-dismiss after 3 seconds.

### 2. Debounced Search
Search inputs wait 300ms after you stop typing before making API calls, reducing server load and improving performance.

### 3. Optimistic Updates
When you drag a card in Kanban view, the UI updates immediately. If the server request fails, it automatically rolls back to the previous state.

### 4. Keyboard Accessibility
Focus on any Kanban card and press Enter to move it to the next status column. Full ARIA labels for screen readers.

### 5. Comments System
Each ticket has a discussion thread where team members can leave comments, ask questions, and collaborate.

### 6. Export Functionality
Export your current ticket view to CSV (for Excel/spreadsheets) or JSON (for backups/analysis).

### 7. Error Boundaries
If a React component crashes, the error boundary catches it and displays a friendly error message with recovery options.

## 🔌 API Endpoints

### Tickets
- `GET /api/tickets` - List tickets (with query params: q, status, priority, assignee, tags, sortBy, sortOrder, fromDate, toDate, overdue, page, pageSize)
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket (full)
- `PATCH /api/tickets/:id` - Update ticket (partial)
- `DELETE /api/tickets/:id` - Delete ticket
- `POST /api/tickets/bulk` - Bulk operations (update/delete multiple tickets)

### Comments
- `GET /api/tickets/:ticketId/comments` - Get ticket comments
- `POST /api/tickets/:ticketId/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment

### History/Audit Log
- `GET /api/tickets/:ticketId/history` - Get ticket change history

### Ticket Linking
- `POST /api/tickets/:id/link` - Link two tickets (body: { relatedId, relationship })
- `DELETE /api/tickets/:id/link/:relatedId` - Unlink tickets

### Saved Filters
- `GET /api/filters` - Get all saved filters
- `POST /api/filters` - Save a new filter (body: { name, filters })
- `DELETE /api/filters/:id` - Delete saved filter

### Analytics
- `GET /api/analytics` - Get dashboard analytics (KPIs, status/priority breakdowns, team stats)

### Health
- `GET /health` - Health check

## 🎯 Validation Rules

### Tickets
- **title**: 3-100 characters, required
- **description**: 3-1000 characters, required
- **status**: one of `open`, `in_progress`, `review`, `closed`
- **priority**: one of `low`, `medium`, `high`, `urgent`
- **assignee**: max 50 characters, optional
- **dueDate**: ISO8601 date string, optional
- **tags**: array of strings, optional
- **relatedTickets**: array of {id, type}, optional

### Comments
- **text**: 1-500 characters, required
- **author**: max 50 characters, defaults to "Anonymous"

### Filters
- **name**: max 50 characters, required
- **filters**: object containing filter criteria, required

## 🌟 Complete Feature List

### Foundation (12 features)
- ✅ Environment configuration with `.env` files
- ✅ Debounced search inputs (300ms delay)
- ✅ Toast notification system
- ✅ Database seed script with sample data
- ✅ `.gitignore` files for both frontend and backend
- ✅ Enhanced validation (max lengths)
- ✅ Ticket ID and metadata display
- ✅ Optimistic UI updates with rollback
- ✅ Keyboard accessibility
- ✅ CSV/JSON export functionality
- ✅ Comments/discussion system
- ✅ React error boundaries
- ✅ Loading spinners

### Professional Features (9 features)
- ✅ **Ticket History/Audit Log** - Complete change tracking
- ✅ **Advanced Filtering** - Multi-criteria search with date ranges
- ✅ **Advanced Sorting** - Sort by multiple fields
- ✅ **Bulk Operations** - Select and update/delete multiple tickets
- ✅ **Dashboard Analytics** - KPIs, charts, team performance
- ✅ **Ticket Templates** - 5 pre-defined templates
- ✅ **Due Dates** - With overdue indicators
- ✅ **Tags System** - Categorize with multiple tags
- ✅ **Ticket Linking** - Link related tickets with dependency types
- ✅ **Saved Filters** - Save and reuse filter combinations

**Total: 21 Professional Features** 🎉

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies and best practices for user experience.
