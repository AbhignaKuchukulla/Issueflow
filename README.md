# IssueBuddy - Enhanced Issue Tracker 🎯

A modern, feature-rich issue tracking application with a beautiful UI and excellent user experience.

## ✨ Features

### Core Functionality
- **📋 Ticket Management** - Create, edit, delete, and organize tickets
- **🎨 Kanban Board** - Visual drag-and-drop board with 4 status columns
- **📊 Analytics** - Stacked area chart showing ticket distribution over time
- **💬 Comments** - Discussion threads on each ticket
- **🔍 Smart Search** - Debounced search with real-time filtering
- **📥 Export** - Export tickets to CSV or JSON format
- **🌓 Dark/Light Mode** - Toggle between themes with persistence

### User Experience Enhancements
- **⚡ Optimistic Updates** - Instant UI feedback with automatic rollback on errors
- **🔔 Toast Notifications** - Beautiful, non-intrusive success/error messages
- **⌨️ Keyboard Navigation** - Press Enter on Kanban cards to move to next status
- **♿ Accessibility** - ARIA labels and proper semantic HTML
- **📱 Responsive Design** - Works on all screen sizes
- **⏱️ Debounced Search** - 300ms delay to reduce unnecessary API calls

### Data & Validation
- **✅ Field Validation** - Min/max length validation on all inputs
  - Title: 3-100 characters
  - Description: 3-1000 characters
  - Assignee: max 50 characters
  - Comments: 1-500 characters
- **🎫 Ticket IDs** - Unique identifiers displayed for easy reference
- **📅 Timestamps** - Created and updated dates on all tickets
- **🛡️ Error Boundaries** - Graceful error handling with recovery options

## 🏗️ Architecture

**Backend**: Node.js + Express + lowdb (file-based JSON database)  
**Frontend**: React + Vite + React Router  
**Styling**: Custom CSS with CSS variables for theming

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
│   ├── server.js           # Express API server
│   ├── seed.js             # Database seeding script
│   ├── db.json             # File-based database
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
        ├── App.jsx         # Layout component
        ├── api.js          # API client
        ├── styles.css      # Global styles
        ├── components/
        │   ├── Comments.jsx        # Comments component
        │   ├── ErrorBoundary.jsx   # Error handling
        │   ├── ThemeToggle.jsx     # Dark/light mode
        │   ├── TicketForm.jsx      # Ticket creation/edit form
        │   └── Toast.jsx           # Toast notifications
        ├── hooks/
        │   └── useDebounce.js      # Debounce hook
        ├── pages/
        │   ├── Edit.jsx    # Edit ticket page
        │   ├── Kanban.jsx  # Kanban board view
        │   └── List.jsx    # List view with filters
        └── utils/
            └── export.js   # CSV/JSON export utilities
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
- `GET /api/tickets` - List tickets (with query params: q, status, priority, page, pageSize)
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket (full)
- `PATCH /api/tickets/:id` - Update ticket (partial)
- `DELETE /api/tickets/:id` - Delete ticket

### Comments
- `GET /api/tickets/:ticketId/comments` - Get ticket comments
- `POST /api/tickets/:ticketId/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment

### Health
- `GET /health` - Health check

## 🎯 Validation Rules

### Tickets
- **title**: 3-100 characters, required
- **description**: 3-1000 characters, required
- **status**: one of `open`, `in_progress`, `review`, `closed`
- **priority**: one of `low`, `medium`, `high`, `urgent`
- **assignee**: max 50 characters, optional

### Comments
- **text**: 1-500 characters, required
- **author**: max 50 characters, defaults to "Anonymous"

## 🌟 Recent Improvements

- ✅ Environment configuration with `.env` files
- ✅ Debounced search inputs (300ms delay)
- ✅ Toast notification system
- ✅ Database seed script with sample data
- ✅ `.gitignore` files for both frontend and backend
- ✅ Enhanced validation (max lengths)
- ✅ Ticket ID and created date display
- ✅ Optimistic UI updates with rollback
- ✅ Keyboard accessibility for Kanban
- ✅ CSV/JSON export functionality
- ✅ Comments/discussion system
- ✅ React error boundaries

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
