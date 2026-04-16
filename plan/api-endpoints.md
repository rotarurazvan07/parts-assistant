# Smart Electronics Lab Ecosystem - API Endpoints

## Overview

This document describes the REST API endpoints for the Smart Electronics Lab Ecosystem. The API follows REST conventions and uses standard HTTP methods (GET, POST, PUT, DELETE) for CRUD operations.

## Base URL

All API endpoints are relative to the base URL: `/api/v1`

## Authentication

No authentication is required as this is a single-user system.

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

Error responses follow this format:
```json
{
  "detail": "Error message"
}
```

## Parts Endpoints

### GET /parts

**Description**: Retrieve a list of parts with optional filtering and pagination

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Number of items per page (default: 10)
- `search` (string, optional): Search term for name, part number, manufacturer, description, or tags
- `category_id` (integer, optional): Filter by category
- `bin_id` (integer, optional): Filter by bin
- `sort_by` (string, optional): Sort field (name, part_number, manufacturer, category_id, bin_id, quantity)
- `sort_order` (string, optional): Sort order (asc or desc)

**Response**:
```json
{
  "parts": [
    {
      "id": 1,
      "name": "Resistor 10kΩ",
      "part_number": "RES-10K-01",
      "manufacturer": "Yageo",
      "category_id": 5,
      "bin_id": 3,
      "quantity": 25,
      "description": "10kΩ 1/4W carbon film resistor",
      "tags": "resistor,carbon-film",
      "created_at": "2023-01-15T10:30:00Z",
      "updated_at": "2023-01-15T10:30:00Z",
      "category": {
        "id": 5,
        "name": "Resistors"
      },
      "bin": {
        "id": 3,
        "name": "Resistor Drawer"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```

### GET /parts/{id}

**Description**: Retrieve a specific part by ID

**Response**:
```json
{
  "id": 1,
  "name": "Resistor 10kΩ",
  "part_number": "RES-10K-01",
  "manufacturer": "Yageo",
  "category_id": 5,
  "bin_id": 3,
  "quantity": 25,
  "description": "10kΩ 1/4W carbon film resistor",
  "tags": "resistor,carbon-film",
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2023-01-15T10:30:00Z"
}
```

### POST /parts

**Description**: Create a new part

**Request Body**:
```json
{
  "name": "Resistor 10kΩ",
  "part_number": "RES-10K-01",
  "manufacturer": "Yageo",
  "category_id": 5,
  "bin_id": 3,
  "quantity": 25,
  "description": "10kΩ 1/4W carbon film resistor",
  "tags": "resistor,carbon-film"
}
```

**Response**:
```json
{
  "id": 1,
  "name": "Resistor 10kΩ",
  "part_number": "RES-10K-01",
  "manufacturer": "Yageo",
  "category_id": 5,
  "bin_id": 3,
  "quantity": 25,
  "description": "10kΩ 1/4W carbon film resistor",
  "tags": "resistor,carbon-film",
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2023-01-15T10:30:00Z"
}
```

### PUT /parts/{id}

**Description**: Update a specific part

**Request Body**:
```json
{
  "name": "Resistor 10kΩ",
  "part_number": "RES-10K-01",
  "manufacturer": "Yageo",
  "category_id": 5,
  "bin_id": 3,
  "quantity": 30,
  "description": "10kΩ 1/4W carbon film resistor",
  "tags": "resistor,carbon-film"
}
```

**Response**:
```json
{
  "id": 1,
  "name": "Resistor 10kΩ",
  "part_number": "RES-10K-01",
  "manufacturer": "Yageo",
  "category_id": 5,
  "bin_id": 3,
  "quantity": 30,
  "description": "10kΩ 1/4W carbon film resistor",
  "tags": "resistor,carbon-film",
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2023-01-15T11:00:00Z"
}
```

### DELETE /parts/{id}

**Description**: Delete a specific part

**Response**: 204 No Content

### GET /parts/{id}/specifications

**Description**: Retrieve specifications for a specific part

**Response**:
```json
[
  {
    "id": 1,
    "part_id": 1,
    "key": "resistance",
    "value": "10kΩ"
  },
  {
    "id": 2,
    "part_id": 1,
    "key": "power",
    "value": "0.25W"
  }
]
```

### POST /parts/{id}/specifications

**Description**: Add a specification to a part

**Request Body**:
```json
{
  "key": "resistance",
  "value": "10kΩ"
}
```

**Response**:
```json
{
  "id": 1,
  "part_id": 1,
  "key": "resistance",
  "value": "10kΩ"
}
```

### PUT /parts/{id}/specifications/{spec_id}

**Description**: Update a specific specification

**Request Body**:
```json
{
  "key": "resistance",
  "value": "10kΩ"
}
```

**Response**:
```json
{
  "id": 1,
  "part_id": 1,
  "key": "resistance",
  "value": "10kΩ"
}
```

### DELETE /parts/{id}/specifications/{spec_id}

**Description**: Delete a specific specification

**Response**: 204 No Content

## Categories Endpoints

### GET /categories

**Description**: Retrieve a list of categories with hierarchical structure

**Response**:
```json
[
  {
    "id": 1,
    "name": "Active Components",
    "parent_id": null,
    "description": "Components that require power to operate",
    "subcategories": [
      {
        "id": 2,
        "name": "Microcontrollers",
        "parent_id": 1,
        "description": "Microcontroller units"
      }
    ]
  }
]
```

### GET /categories/{id}

**Description**: Retrieve a specific category by ID

**Response**:
```json
{
  "id": 1,
  "name": "Active Components",
  "parent_id": null,
  "description": "Components that require power to operate"
}
```

### POST /categories

**Description**: Create a new category

**Request Body**:
```json
{
  "name": "Active Components",
  "parent_id": null,
  "description": "Components that require power to operate"
}
```

**Response**:
```json
{
  "id": 1,
  "name": "Active Components",
  "parent_id": null,
  "description": "Components that require power to operate"
}
```

### PUT /categories/{id}

**Description**: Update a specific category

**Request Body**:
```json
{
  "name": "Active Components",
  "parent_id": null,
  "description": "Components that require power to operate"
}
```

**Response**:
```json
{
  "id": 1,
  "name": "Active Components",
  "parent_id": null,
  "description": "Components that require power to operate"
}
```

### DELETE /categories/{id}

**Description**: Delete a specific category

**Response**: 204 No Content

## Bins Endpoints

### GET /bins

**Description**: Retrieve a list of bins

**Response**:
```json
[
  {
    "id": 1,
    "name": "Resistor Drawer",
    "location": "Electronics Cabinet",
    "description": "Storage for resistors"
  }
]
```

### GET /bins/{id}

**Description**: Retrieve a specific bin by ID

**Response**:
```json
{
  "id": 1,
  "name": "Resistor Drawer",
  "location": "Electronics Cabinet",
  "description": "Storage for resistors"
}
```

### POST /bins

**Description**: Create a new bin

**Request Body**:
```json
{
  "name": "Resistor Drawer",
  "location": "Electronics Cabinet",
  "description": "Storage for resistors"
}
```

**Response**:
```json
{
  "id": 1,
  "name": "Resistor Drawer",
  "location": "Electronics Cabinet",
  "description": "Storage for resistors"
}
```

### PUT /bins/{id}

**Description**: Update a specific bin

**Request Body**:
```json
{
  "name": "Resistor Drawer",
  "location": "Electronics Cabinet",
  "description": "Storage for resistors"
}
```

**Response**:
```json
{
  "id": 1,
  "name": "Resistor Drawer",
  "location": "Electronics Cabinet",
  "description": "Storage for resistors"
}
```

### DELETE /bins/{id}

**Description**: Delete a specific bin

**Response**: 204 No Content

## Documents Endpoints

### GET /parts/{id}/documents

**Description**: Retrieve documents for a specific part

**Response**:
```json
[
  {
    "id": 1,
    "part_id": 1,
    "name": "Datasheet",
    "document_type": "datasheet",
    "url": "https://example.com/datasheet.pdf",
    "storage_path": null,
    "original_filename": "datasheet.pdf",
    "content_type": "application/pdf",
    "file_size": 1024000
  }
]
```

### GET /documents/{id}

**Description**: Retrieve a specific document by ID

**Response**:
```json
{
  "id": 1,
  "part_id": 1,
  "name": "Datasheet",
  "document_type": "datasheet",
  "url": "https://example.com/datasheet.pdf",
  "storage_path": null,
  "original_filename": "datasheet.pdf",
  "content_type": "application/pdf",
  "file_size": 1024000
}
```

### POST /parts/{id}/documents

**Description**: Add a document to a part

**Request Body**:
```json
{
  "name": "Datasheet",
  "document_type": "datasheet",
  "url": "https://example.com/datasheet.pdf",
  "storage_path": null,
  "original_filename": "datasheet.pdf",
  "content_type": "application/pdf",
  "file_size": 1024000
}
```

**Response**:
```json
{
  "id": 1,
  "part_id": 1,
  "name": "Datasheet",
  "document_type": "datasheet",
  "url": "https://example.com/datasheet.pdf",
  "storage_path": null,
  "original_filename": "datasheet.pdf",
  "content_type": "application/pdf",
  "file_size": 1024000
}
```

### PUT /documents/{id}

**Description**: Update a specific document

**Request Body**:
```json
{
  "name": "Datasheet",
  "document_type": "datasheet",
  "url": "https://example.com/datasheet.pdf",
  "storage_path": null,
  "original_filename": "datasheet.pdf",
  "content_type": "application/pdf",
  "file_size": 1024000
}
```

**Response**:
```json
{
  "id": 1,
  "part_id": 1,
  "name": "Datasheet",
  "document_type": "datasheet",
  "url": "https://example.com/datasheet.pdf",
  "storage_path": null,
  "original_filename": "datasheet.pdf",
  "content_type": "application/pdf",
  "file_size": 1024000
}
```

### DELETE /documents/{id}

**Description**: Delete a specific document

**Response**: 204 No Content

## Settings Endpoints

### GET /settings

**Description**: Retrieve all settings

**Response**:
```json
[
  {
    "id": 1,
    "key": "api_key",
    "value": "**********",
    "is_sensitive": true
  }
]
```

### GET /settings/{key}

**Description**: Retrieve a specific setting by key

**Response**:
```json
{
  "id": 1,
  "key": "api_key",
  "value": "**********",
  "is_sensitive": true
}
```

### POST /settings

**Description**: Create a new setting

**Request Body**:
```json
{
  "key": "api_key",
  "value": "sk-1234567890",
  "is_sensitive": true
}
```

**Response**:
```json
{
  "id": 1,
  "key": "api_key",
  "value": "**********",
  "is_sensitive": true
}
```

### PUT /settings/{key}

**Description**: Update a specific setting

**Request Body**:
```json
{
  "key": "api_key",
  "value": "sk-0987654321",
  "is_sensitive": true
}
```

**Response**:
```json
{
  "id": 1,
  "key": "api_key",
  "value": "**********",
  "is_sensitive": true
}
```

### DELETE /settings/{key}

**Description**: Delete a specific setting

**Response**: 204 No Content

## AI Endpoints

### POST /ai/chat

**Description**: Send a message to the AI assistant

**Request Body**:
```json
{
  "message": "What can I build with my current inventory?",
  "context_parts": [1, 2, 3],
  "history": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi, how can I help you today?"
    }
  ]
}
```

**Response**:
```json
{
  "response": "Based on your inventory, you can build several projects...",
  "context_parts": [1, 2, 3]
}
```

## Import/Export Endpoints

### POST /import

**Description**: Import parts from CSV

**Request Body**:
```json
{
  "csv_data": "name,part_number,manufacturer,category_id,bin_id,quantity\ntest,123,TestCorp,1,1,5"
}
```

**Response**:
```json
{
  "imported": 1,
  "errors": []
}
```

### GET /export

**Description**: Export parts to CSV

**Response**: CSV file content

## Search Endpoints

### GET /search

**Description**: Search for parts across all fields

**Query Parameters**:
- `q` (string, required): Search query
- `category_id` (integer, optional): Filter by category
- `bin_id` (integer, optional): Filter by bin

**Response**:
```json
[
  {
    "id": 1,
    "name": "Resistor 10kΩ",
    "part_number": "RES-10K-01",
    "manufacturer": "Yageo",
    "category_id": 5,
    "bin_id": 3,
    "quantity": 25,
    "description": "10kΩ 1/4W carbon film resistor",
    "tags": "resistor,carbon-film",
    "created_at": "2023-01-15T10:30:00Z",
    "updated_at": "2023-01-15T10:30:00Z"
  }
]