# Smart Electronics Lab Ecosystem

Electronics inventory management + AI assistant for hobbyists.

## Architecture

- **Backend**: FastAPI + SQLite (Python)
- **Frontend**: React 18 + Vite + Tailwind CSS
- **AI**: Any OpenAI-compatible provider (bring your own key)

---

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

Backend runs at: http://localhost:8000  
Swagger docs: http://localhost:8000/docs

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: http://localhost:3000

---

## Configuration

1. Open the app at http://localhost:3000
2. Click **⚙ Settings** in the sidebar footer
3. Select a provider preset (OpenAI, Groq, NVIDIA NIM, etc.)
4. Enter your API key
5. Set the model ID
6. Click **Save Settings**

The AI chat panel ("The Brain") will now be active.

---

## Directory Structure

```
smart-electronics-lab/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + lifespan
│   │   ├── database.py          # SQLAlchemy engine + category seeding
│   │   ├── models/
│   │   │   └── models.py        # ORM models
│   │   ├── schemas/
│   │   │   └── schemas.py       # Pydantic schemas
│   │   └── api/v1/
│   │       ├── parts.py         # Parts + specs CRUD
│   │       ├── categories.py    # Categories CRUD (tree)
│   │       ├── bins.py          # Bins CRUD
│   │       ├── documents.py     # Documents + file upload
│   │       ├── settings.py      # Settings w/ masking
│   │       ├── search.py        # Full-text search
│   │       ├── import_export.py # CSV import/export
│   │       └── ai.py            # Streaming AI chat
│   ├── uploads/                 # Uploaded files (gitignored)
│   ├── electronics_lab.db       # SQLite database (auto-created)
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   ├── context/
    │   │   └── AppContext.jsx   # Global state
    │   ├── hooks/
    │   │   └── useData.js       # React Query hooks
    │   ├── services/
    │   │   └── api.js           # Axios API client
    │   └── components/
    │       ├── layout/
    │       │   ├── Sidebar.jsx      # Category tree + bins
    │       │   └── AIChatPanel.jsx  # Streaming AI chat
    │       ├── parts/
    │       │   └── PartsTable.jsx   # Main data table
    │       ├── modals/
    │       │   ├── PartModal.jsx        # Create/edit part
    │       │   ├── SettingsModal.jsx    # AI config
    │       │   └── ImportExportModal.jsx
    │       └── ui/
    │           └── index.jsx   # Button, Input, Modal, etc.
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Features (Phases 1–3)

### Phase 1 — Foundation
- SQLite database with all tables
- SQLAlchemy ORM models
- Default category tree (400+ categories seeded)
- FastAPI server with CORS

### Phase 2 — Backend API
- Full CRUD: parts, categories, bins, documents, settings
- Part specifications (key-value)
- File uploads (PDF, PNG, JPEG, GIF, WebP)
- Full-text search across all fields
- CSV import with auto-create categories/bins
- CSV export
- Streaming AI chat (OpenAI-compatible)
- Settings with API key masking

### Phase 3 — Frontend
- Three-panel layout (sidebar / table / AI chat)
- Collapsible sidebar + AI panel
- Category tree navigation with inline add/delete
- Bins list with inline add/delete
- Parts table: search, sort, paginate, filter
- AI context selection per row (checkbox)
- Part modal: Details + Specs + Documents tabs
- Settings modal with provider presets
- Import/Export modal with drag-and-drop
- Streaming AI chat with SSE
- Dark theme: terminal retro-futurism aesthetic

---

## CSV Import Format

```csv
name,part_number,manufacturer,category,bin,quantity,description,tags,specifications
Resistor 10kΩ,RES-10K,Yageo,Resistors,Drawer A1,100,THT 1/4W,resistor,[{"key":"resistance","value":"10kΩ"}]
ESP32-WROOM-32,ESP32-WROOM,Espressif,ESP32,Shelf B2,5,WiFi+BLE,esp32;wifi,[]
```

- **category** and **bin** are auto-created if they don't exist
- **tags**: semicolons converted to commas
- **specifications**: JSON array of `{key, value}` objects

---

## Production Build

```bash
# Frontend
cd frontend
npm run build
# Output in frontend/dist/

# Backend (serve with gunicorn for production)
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
