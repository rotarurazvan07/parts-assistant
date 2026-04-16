# Smart Electronics Lab Ecosystem - Project Brief

## Executive Summary

A self-contained inventory management and AI assistant platform designed specifically for electronics hobbyists. Unlike generic inventory tools, this system unifies component tracking with intelligent project planning, enabling users to manage their parts collection while leveraging AI to suggest what they can build with their current stock.

---

## System Architecture

### Application Type
Single-page web application with split-panel interface

### Technology Stack
- **Frontend**: React with Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: SQLite
- **AI Integration**: Multi-provider support (bring your own key, like OpenAI compatible, you put the base url, the api key, the model id, with streaming enabled, possible reasoning)


### Authentication Model
None - single-user system designed for personal use

---

## Core Modules

### 1. Parts Inventory Management

**Purpose**: Track electronic components with rich metadata beyond basic inventory fields

**Data Model - Part**:
- Name (required)
- Part Number (manufacturer's identifier)
- Manufacturer
- Category (hierarchical reference)
- Storage Bin (location reference)
- Quantity (current stock)
- Documents (more info at chapter 4)
- Description (free-form notes)
- Specifications (key-value pairs for technical specs like voltage, resistance, package type)
- Tags (flexible labeling for cross-cutting concerns)
- Timestamps (created, updated)

**Capabilities**:
- Full CRUD operations
- Search across name, part number, manufacturer, description, and tags
- Filter by category
- Filter by storage bin
- Bulk operations via CSV import

---

### 2. Hierarchical Category System

**Purpose**: Organize parts in a tree structure mirroring electronics taxonomy

**Data Model - Category**:
- Name
- Parent Category (optional, for hierarchy)
- Description

**Example Hierarchy**:
```
Active Components
├── Microcontrollers
│   ├── ARM
│   ├── AVR
│   └── ESP32
├── Transistors - NPN, PNP...
└── ICs - clock, mux, ...

Passive Components
├── Resistors
├── Capacitors
└── Inductors

Connectors
├── Headers
└── Terminals
```

**Capabilities**:
- Create categories at any level
- Delete categories
- Filter parts by category selection

Default categories MUST be shipped by default, like resistors, capacitors etc.
Also, a smart name mapping to a given category must be implemented, like
when you write ESP... the engine must determine its an espresiff microcontroller, featuring wifi, ble, etc.
---

### 3. Physical Location Tracking (Bins)

**Purpose**: Map digital inventory to physical storage locations

**Data Model - Bin**:
- Name (e.g., "Drawer A1", "Box 3", "Shelf B-2")
- Location (optional description)
- Description

**Capabilities**:
- Create and manage storage locations
- Assign parts to bins
- Filter view by bin
- AI can respond to queries like "Where did I put the NRF24 modules?"

---

### 4. Document Management

**Purpose**: Link technical documentation directly to parts for quick reference and AI context

**Data Model - Document**:
- Name
- Document Type (datasheet, schematic, manual, other)
- URL (for external links)
- Storage Path (for uploaded files)
- Original Filename
- Content Type (MIME type)
- File Size

**Supported Operations**:
- Add external URL links (e.g., manufacturer datasheet links)
- Upload files directly (PDF, images)
- Multiple documents per part
- View/download uploaded documents
- Delete documents

**Supported File Types**:
- PDF documents
- Images (PNG, JPG, JPEG, GIF, WebP)

---

### 5. AI Assistant ("The Brain")

**Purpose**: Provide intelligent, inventory-aware assistance for project planning and technical questions

**Provider Support**:
- Bring your own api key and endpoint

eg:
```
from openai import OpenAI

client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = "$NVIDIA_API_KEY"
)

completion = client.chat.completions.create(
  model="minimaxai/minimax-m2.7",
  messages=[{"role":"user","content":""}],
  temperature=1,
  top_p=0.95,
  max_tokens=8192,
  stream=True
)

for chunk in completion:
  if not getattr(chunk, "choices", None):
    continue
  if chunk.choices[0].delta.content is not None:
    print(chunk.choices[0].delta.content, end="")
```

**Key Configuration**:
- Bring Your Own API Key model
- User stores their preferred API keys in settings
- Select default provider
- Keys stored securely, displayed masked after save

**AI Capabilities**:
1. **Inventory Awareness**: Every AI request includes full inventory context
   - All parts with quantities, categories, bins, specifications
   - Documents associated with context-selected parts
   - AI MUST read and understand the documents to get better idea on parts

2. **Project Feasibility**: Answer questions like:
   - "What can I build with my current inventory?"
   - "Do I have the parts for an Arduino weather station?"
   - "What speed are the I2C lines on the ESP32C6"?

3. **Gap Analysis**: Identify missing components:
   - "You have the ESP32 and BME280 sensor, but you're missing a 10k resistor"

4. **Location Assistance**: Help find parts:
   - "Where did I store the NRF24 modules?" → "They're in Bin A3"

5. **Technical Q&A**: Answer electronics questions with inventory context

6. **Memory bank**: Must implement a memory bank approach so each session remembers things from the past and its not started from ground zero


**Context Selection**:
- Users can select specific parts to include in AI context
- Selected parts shown as chips in the chat panel
- Clear all or remove individual parts from context

---

### 6. CSV Import/Export

**Purpose**: Enable data portability, backup, and bulk operations

**Import Behavior**:
- Auto-create categories if they don't exist
- Auto-create bins if they don't exist
- Specifications as JSON string
- Tags as comma-separated values
- Report success count and any row errors

---

### 7. Settings Management

**Purpose**: Configure user preferences and API credentials

**Security**:
- Keys stored in database
- Keys masked on retrieval (show only last 4 characters)
- Only update keys when non-masked value provided

---

## User Interface Design

### Layout Architecture
**Split-Panel Design**:
- Left: Navigation sidebar (220px fixed)
- Center: Parts data table (flexible, ~60%)
- Right: AI Chat panel (400px fixed)

### Design System

**Theme**: Dark mode with Swiss/High-Contrast archetype + Terminal Retro-Futurism

**Color Palette**:
| Element | Color | Hex |
|---------|-------|-----|
| Background | Near Black | #050505 |
| Panels/Cards | Dark Grey | #0A0A0A |
| Borders | Medium Grey | #262626 |
| Text Primary | Off-White | #F5F5F5 |
| Text Muted | Grey | #808080 |
| Primary Action | Warning Yellow | #FFB000 |
| AI Accent | Terminal Green | #00FF41 |
| Destructive | Red | #FF3B30 |
| Hover State | Light Grey | #1A1A1A |

**Typography**:
| Usage | Font | Weight |
|-------|------|--------|
| Headings (H1-H4) | IBM Plex Sans | 700 (Bold) |
| Body Text | Inter | 400 (Regular) |
| Data/Monospace | JetBrains Mono | 400-500 |
| Labels | JetBrains Mono | Uppercase, wide tracking |

**Component Styling**:
- Border radius: Maximum 2px (sharp, rigid aesthetic)
- Borders: 1px solid, always visible
- No soft shadows
- Dense spacing for data areas
- Generous spacing for AI panel

### UI Components

**Sidebar**:
- Collapsible category tree
- Collapsible bins list
- Inline add forms for categories/bins
- Footer with Import/Export and Settings buttons

**Parts Table**:
- Search input with icon
- Add Part button (primary action)
- Stats bar: Total count, In context count
- Dense table rows with hover highlight
- Columns: AI context toggle, Name, Part #, Category, Bin, Qty, Manufacturer, Actions
- Row actions: Edit, Delete (visible on hover)

**AI Chat Panel**:
- Header with "The Brain" branding and green accent
- Context parts display (removable chips)
- Selected part info bar
- Message history with role styling
- Empty state with suggestions
- Input area with send button
- Typing/processing indicator with glow effect

**Part Modal**:
- Tabbed interface: Details, Specifications, Documents (if editing)
- Form fields for all part attributes
- Tag management (add/remove chips)
- Specification management (key-value pairs)
- Document links and upload

**Settings Modal**:
- Provider selection dropdown
- API key inputs with show/hide toggle
- Any other endpoint related settings as seen in example for parameters.
- Configured indicator for saved keys

**Import/Export Modal**:
- Tabbed interface: Import, Export
- Drag-and-drop zone for CSV upload
- Sample CSV format display
- Export download button
- Import result summary

---

## Data Flow

### Part Creation Flow
1. User clicks "Add Part"
2. Modal opens with empty form
3. User fills details, adds specs/tags
4. Submit saves to database
5. Table refreshes with new part
6. Toast confirms success

### AI Chat Flow
1. User types message or clicks suggestion
2. Frontend sends message + chat history + context part IDs
3. Backend fetches all inventory data
4. Backend builds system prompt with inventory context
5. Backend calls selected AI provider
6. Response returned and displayed
7. Conversation continues with history and memory saves

### CSV Import Flow
1. User drops/selects CSV file
2. Backend parses CSV rows
3. For each row:
   - Create category if new
   - Create bin if new
   - Create part with references
4. Return success count and errors
5. Frontend refreshes data

---

## Business Rules

1. **Category/Bin Deletion**: Allowed even if parts reference them (fallback to no category)
2. **AI Context**: Maximum context includes all parts; specific parts can be highlighted
3. **API Keys**: Must be configured before AI chat works; clear error message if missing

---

## Error Handling

- API key not configured: 400 error with clear message
- Invalid API key: 400 error with authentication message
- File upload failure: Toast notification
- Import errors: Per-row error reporting
- Network errors: Console logging + toast notification

---

## Constraints & Limitations

1. **Single User**: No authentication or multi-tenancy
2. **No Presigned URLs**: All file access through backend proxy
3. **AI Rate Limits**: Subject to provider limits on user's API keys
4. **CSV Format**: Must match expected column structure

---

This brief captures the complete high-level specification of the Smart Electronics Lab Ecosystem as implemented.