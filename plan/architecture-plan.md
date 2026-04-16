# Smart Electronics Lab Ecosystem - Architecture Plan

## Overview

This document outlines the initial architecture plan for the Smart Electronics Lab Ecosystem, a self-contained inventory management and AI assistant platform designed specifically for electronics hobbyists.

## System Architecture

### High-Level Architecture

The system follows a client-server architecture with the following components:

1. **Frontend**: React with Tailwind CSS
   - Single-page web application with split-panel interface
   - Left: Navigation sidebar (220px fixed)
   - Center: Parts data table (flexible, ~60%)
   - Right: AI Chat panel (400px fixed)

2. **Backend**: FastAPI (Python)
   - RESTful API for all client interactions
   - Business logic implementation
   - Database interaction layer

3. **Database**: SQLite
   - Lightweight, file-based database
   - Suitable for single-user personal system

4. **AI Integration**: Multi-provider support
   - Bring your own API key model
   - Multi-provider support (OpenAI compatible APIs)
   - Streaming enabled for real-time responses

### Component Architecture

#### 1. Parts Inventory Management
- Data model with rich metadata (name, part number, manufacturer, category, storage bin, quantity, documents, description, specifications, tags)
- Full CRUD operations
- Search and filtering capabilities
- CSV import/export functionality

#### 2. Hierarchical Category System
- Tree structure mirroring electronics taxonomy
- Default categories (resistors, capacitors, etc.) shipped by default
- Smart name mapping to categories (e.g., ESP... maps to ESP32 microcontroller)

#### 3. Physical Location Tracking (Bins)
- Storage location management
- Mapping digital inventory to physical storage locations
- AI-assisted location queries

#### 4. Document Management
- Link technical documentation directly to parts
- Support for external URLs and file uploads
- PDF and image support (PNG, JPG, JPEG, GIF, WebP)

#### 5. AI Assistant ("The Brain")
- Inventory-aware assistance for project planning
- Multi-provider AI support (bring your own key)
- Context-aware responses based on full inventory
- Project feasibility analysis
- Gap analysis for missing components
- Location assistance
- Technical Q&A with inventory context

#### 6. Settings Management
- API key configuration and management
- Provider selection
- Secure storage of credentials

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

## Technology Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: SQLite
- **AI Integration**: Multi-provider support (bring your own key)
- **Authentication**: None (single-user system)

## Security Considerations

- API keys stored in database, masked on retrieval
- Keys only updated when non-masked value provided
- No external authentication required (single-user system)

## Deployment Architecture

- Standalone application
- SQLite database file stored locally
- All file access through backend proxy (no presigned URLs)
- Client-side React application served by backend

## Future Considerations

- Potential extension to multi-user system
- Cloud synchronization options
- Advanced AI capabilities for circuit design assistance
- Integration with external electronics databases