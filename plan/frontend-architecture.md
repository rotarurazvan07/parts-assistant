# Frontend Architecture and Component Structure

## Component Hierarchy

### App Root
- App.js - Main application component

### Layout Components
- Layout/ - Main layout container
  - Header/ - Application header (if needed)
  - Sidebar/ - Main sidebar component
    - CategoryTree/ - Hierarchical category navigation
      - CategoryItem/ - Individual category item
    - BinsList/ - Storage location list
      - BinItem/ - Individual bin item
    - SidebarFooter/ - Footer with import/export and settings
  - MainContent/ - Center panel content
    - SearchArea/ - Search input and add part button
    - StatsBar/ - Total parts and in-context parts count
    - PartsTable/ - Main data table
      - TableHeader/ - Table column headers
      - TableRow/ - Individual part row
        - TableCell/ - Individual cell component
      - TablePagination/ - Pagination controls
  - AIChatPanel/ - Right sidebar AI interface
    - ChatHeader/ - "The Brain" branding and indicator
    - ContextDisplay/ - Selected parts chips
    - MessageHistory/ - Chat message display
    - ChatInput/ - Input area with send button
    - SuggestionChips/ - Common query suggestions

### Modal Components
- Modals/ - Container for all modal components
  - PartModal/ - Part creation/editing modal
    - DetailsTab/ - Part details form
    - SpecificationsTab/ - Technical specifications
    - DocumentsTab/ - Document management
  - SettingsModal/ - Configuration interface
    - ProviderSelection/ - AI provider dropdown
    - APIKeyManagement/ - API key inputs
    - ConfigurationStatus/ - Configured indicator
  - ImportExportModal/ - Data portability interface
    - ImportTab/ - CSV import functionality
    - ExportTab/ - Data export functionality

### Utility Components
- Form/ - Form-related components
  - InputField/ - Standard input field
  - SelectField/ - Dropdown selection
  - TextArea/ - Multi-line text input
  - Checkbox/ - Checkbox component
  - Button/ - Standard button component
- UI/ - Generic UI components
  - LoadingSpinner/ - Loading indicator
  - Toast/ - Notification component
  - Icon/ - Icon component library
  - Modal/ - Base modal component
  - Tabs/ - Tabbed interface component

## State Management Structure

### Global State (Context API or Redux)
- User Preferences
  - Theme settings
  - Language preferences
  - Sidebar collapsed state
- AI Configuration
  - Selected provider
  - API key status
- UI State
  - Modal visibility
  - Loading states
  - Error states

### Server State (React Query)
- Parts Data
  - Parts list with pagination
  - Individual part details
  - Part specifications
  - Part documents
- Categories Data
  - Category tree structure
  - Individual category details
- Bins Data
  - Bins list
  - Individual bin details
- AI Chat Data
  - Chat history
  - Current context parts
  - Message responses

### Local State (Component-level)
- Form States
  - Validation errors
  - Input values
  - Submission status
- UI Interaction States
  - Hover states
  - Focus states
  - Active/inactive states

## Data Flow Architecture

### Component Communication
1. Parent to Child: Props passing
2. Child to Parent: Callback functions
3. Sibling Components: Shared state management
4. Global State: Context API or Redux store

### API Integration Flow
1. Parts Data:
   - Fetch: GET /api/v1/parts
   - Create: POST /api/v1/parts
   - Update: PUT /api/v1/parts/{id}
   - Delete: DELETE /api/v1/parts/{id}
2. Categories Data:
   - Fetch: GET /api/v1/categories
   - Create: POST /api/v1/categories
   - Update: PUT /api/v1/categories/{id}
   - Delete: DELETE /api/v1/categories/{id}
3. Bins Data:
   - Fetch: GET /api/v1/bins
   - Create: POST /api/v1/bins
   - Update: PUT /api/v1/bins/{id}
   - Delete: DELETE /api/v1/bins/{id}
4. Specifications Data:
   - Fetch: GET /api/v1/p1arts/{id}/specifications
   - Create: POST /api/v1/parts/{id}/specifications
   - Update: PUT /api/v1/parts/{id}/specifications/{spec_id}
   - Delete: DELETE /api/v1/parts/{id}/specifications/{spec_id}
5. Search Data:
   - Fetch: GET /api/v1/search
6. Import/Export:
   - Import: POST /api/v1/import/parts
   - Export: GET /api/v1/export/parts

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.js
│   │   ├── Sidebar.js
│   │   ├── MainContent.js
│   │   └── AIChatPanel.js
│   ├── parts/
│   │   ├── PartsTable.js
│   │   ├── SearchArea.js
│   │   └── StatsBar.js
│   ├── modals/
│   │   ├── PartModal.js
│   │   ├── SettingsModal.js
│   │   └── ImportExportModal.js
│   └── ui/
│       ├── Button.js
│       ├── InputField.js
│       ├── SelectField.js
│       └── LoadingSpinner.js
├── hooks/
│   ├── useParts.js
│   ├── useCategories.js
│   ├── useBins.js
│   └── useAI.js
├── context/
│   ├── AppContext.js
│   └── ThemeContext.js
├── utils/
│   ├── api.js
│   ├── validation.js
│   └── helpers.js
├── services/
│   ├── partsService.js
│   ├── categoriesService.js
│   ├── binsService.js
│   └── aiService.js
├── styles/
│   └── tailwind.css
├── App.js
└── main.js