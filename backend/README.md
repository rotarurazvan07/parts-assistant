# Smart Electronics Lab Backend

This is the backend API for the Smart Electronics Lab Ecosystem, built with FastAPI and SQLAlchemy.

## Features

- RESTful API for managing electronic components inventory
- SQLite database for data persistence
- CRUD operations for parts, categories, bins, documents, and settings
- Import/export functionality for data management
- Configuration management system
- Comprehensive error handling and logging

## Prerequisites

- Python 3.9+
- pip package manager

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
4. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`
5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. Run the startup script to initialize the database:
   ```bash
   python startup.py
   ```
2. Start the development server:
   ```bash
   python run_server.py
   ```
3. Visit `http://localhost:8000` to access the API
4. Visit `http://localhost:8000/docs` for interactive API documentation

## API Endpoints

- `/api/v1/parts` - Manage electronic parts
- `/api/v1/categories` - Manage part categories
- `/api/v1/bins` - Manage storage bins
- `/api/v1/documents` - Manage part documents
- `/api/v1/settings` - Manage application settings
- `/api/v1/import/parts` - Import parts from CSV/JSON
- `/api/v1/export/parts` - Export parts to CSV/JSON

## Configuration

The application uses a configuration system with support for environment variables. Create a `.env` file in the backend directory to customize settings.

## Testing

Run tests using pytest:
```bash
pytest tests/
```

## Phase 1 Implementation Status

Phase 1 of the implementation has been successfully completed. This includes:
- Project structure setup
- Database implementation with all required tables
- Backend API with core endpoints for all entities
- Development environment setup
- Configuration management system
- Basic testing framework

All components have been tested and verified to work correctly.

## License

This project is licensed under the MIT License - see the LICENSE file for details.