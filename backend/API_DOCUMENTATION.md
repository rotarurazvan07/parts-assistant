# Smart Electronics Lab API Documentation

## Overview

This document provides comprehensive documentation for the Smart Electronics Lab API endpoints. The API provides a complete inventory management system for electronic components.

## API Endpoints

### Parts Endpoints

#### GET /api/v1/parts

Retrieve a list of parts with optional pagination, sorting, and filtering.

**Query Parameters:**
- `page` (integer, optional): Page number for pagination (default: 1)
- `limit` (integer, optional): Number of items per page (default: 100)
- `sort_by` (string, optional): Field to sort by (default: "id")
- `sort_order` (string, optional): Sort order, either "asc" or "desc" (default: "asc")

**Response:**
```json
[
  {
    "id": 1,
    "name": "Resistor 10kΩ",
    "part_number": "RES-10K-01",
    "manufacturer": "Yageo",
    "category_id": 1,
    "bin_id": 2,
    "quantity": 100,
    "description": "10kΩ 1/4W carbon film resistor",
    "tags": "resistor,carbon-film",
    "datasheet_url": "http://example.com/datasheet.pdf",
    "image_url": "http://example.com/image.jpg",
    "supplier": "DigiKey",
    "supplier_part_number": "YRC10K",
    "location": "Shelf A, Bin 3",
    "notes": "Good for general purpose use",
    "created_at": "2023-01-01T12:00:00",
    "updated_at": "2023-01-01T12:00:00",
    "specifications": [],
    "documents": []
  }
]
```

#### POST /api/v1/parts

Create a new part.

**Request Body:**
```json
{
  "name": "Resistor 10kΩ",
  "part_number": "RES-10K-01",
  "manufacturer": "Yageo",
  "category_id": 1,
  "bin_id": 2,
  "quantity": 100,
  "description": "10kΩ 1/4W carbon film resistor",
  "tags": "resistor,carbon-film",
  "datasheet_url": "http://example.com/datasheet.pdf",
  "image_url": "http://example.com/image.jpg",
  "supplier": "DigiKey",
  "supplier_part_number": "YRC10K",
  "location": "Shelf A, Bin 3",
  "notes": "Good for general purpose use"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Resistor 10kΩ",
  "part_number": "RES-10K-01",
  "manufacturer": "Yageo",
  "category_id": 1,
  "bin_id": 2,
  "quantity": 100,
  "description": "10kΩ 1/4W carbon film resistor",
  "tags": "resistor,carbon-film",
  "datasheet_url": "http://example.com/datasheet.pdf",
  "image_url": "http://example.com/image.jpg",
  "supplier": "DigiKey",
  "supplier_part_number": "YRC10K",
  "location": "Shelf A, Bin 3",
  "notes": "Good for general purpose use",
  "created_at": "2023-01-01T12:00:00",
  "updated_at": "2023-01-01T12:00:00",
  "specifications": [],
  "documents": []
}
```

#### GET /api/v1/parts/{part_id}

Retrieve a specific part by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Resistor 10kΩ",
  "part_number": "RES-10K-01",
  "manufacturer": "Yageo",
  "category_id": 1,
  "bin_id": 2,
  "quantity": 100,
  "description": "10kΩ 1/4W carbon film resistor",
  "tags": "resistor,carbon-film",
  "datasheet_url": "http://example.com/datasheet.pdf",
  "image_url": "http://example.com/image.jpg",
  "supplier": "DigiKey",
  "supplier_part_number": "YRC10K",
  "location": "Shelf A, Bin 3",
  "notes": "Good for general purpose use",
  "created_at": "2023-01-01T12:00:00",
  "updated_at": "2023-01-01T12:00:00",
  "specifications": [],
  "documents": []
}
```

#### PUT /api/v1/parts/{part_id}

Update a specific part.

**Request Body:**
```json
{
  "name": "Resistor 10kΩ",
  "part_number": "RES-10K-01",
  "manufacturer": "Yageo",
  "category_id": 1,
  "bin_id": 2,
  "quantity": 150,
  "description": "10kΩ 1/4W carbon film resistor",
  "tags": "resistor,carbon-film",
  "datasheet_url": "http://example.com/datasheet.pdf",
  "image_url": "http://example.com/image.jpg",
  "supplier": "DigiKey",
  "supplier_part_number": "YRC10K",
  "location": "Shelf A, Bin 3",
  "notes": "Good for general purpose use"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Resistor 10kΩ",
  "part_number": "RES-10K-01",
  "manufacturer": "Yageo",
  "category_id": 1,
  "bin_id": 2,
  "quantity": 150,
  "description": "10kΩ 1/4W carbon film resistor",
  "tags": "resistor,carbon-film",
  "datasheet_url": "http://example.com/datasheet.pdf",
  "image_url": "http://example.com/image.jpg",
  "supplier": "DigiKey",
  "supplier_part_number": "YRC10K",
  "location": "Shelf A, Bin 3",
  "notes": "Good for general purpose use",
  "created_at": "2023-01-01T12:00:00",
  "updated_at": "2023-01-01T12:00:00",
  "specifications": [],
  "documents": []
}
```

#### DELETE /api/v1/parts/{part_id}

Delete a specific part.

**Response:**
```json
{
  "message": "Part deleted successfully"
}
```

### Categories Endpoints

#### GET /api/v1/categories

Retrieve a list of categories with optional pagination.

**Query Parameters:**
- `skip` (integer, optional): Number of items to skip (default: 0)
- `limit` (integer, optional): Number of items to return (default: 100)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Resistors",
    "parent_id": null,
    "description": "Electronic components that resist electric current",
    "subcategories": []
  }
]
```

#### POST /api/v1/categories

Create a new category.

**Request Body:**
```json
{
  "name": "Resistors",
  "parent_id": null,
  "description": "Electronic components that resist electric current"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Resistors",
  "parent_id": null,
  "description": "Electronic components that resist electric current",
  "subcategories": []
}
```

#### GET /api/v1/categories/{category_id}

Retrieve a specific category by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Resistors",
  "parent_id": null,
  "description": "Electronic components that resist electric current",
  "subcategories": []
}
```

#### PUT /api/v1/categories/{category_id}

Update a specific category.

**Request Body:**
```json
{
  "name": "Updated Resistors",
  "description": "Updated description for resistors"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Resistors",
  "parent_id": null,
  "description": "Updated description for resistors",
  "subcategories": []
}
```

#### DELETE /api/v1/categories/{category_id}

Delete a specific category.

**Response:**
```json
{
  "message": "Category deleted successfully"
}
```

### Bins Endpoints

#### GET /api/v1/bins

Retrieve a list of bins with optional pagination.

**Query Parameters:**
- `skip` (integer, optional): Number of items to skip (default: 0)
- `limit` (integer, optional): Number of items to return (default: 100)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Resistor Bin",
    "location": "Shelf A, Bin 3",
    "description": "Bin for storing resistors"
  }
]
```

#### POST /api/v1/bins

Create a new bin.

**Request Body:**
```json
{
  "name": "Resistor Bin",
  "location": "Shelf A, Bin 3",
  "description": "Bin for storing resistors"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Resistor Bin",
  "location": "Shelf A, Bin 3",
  "description": "Bin for storing resistors"
}
```

#### GET /api/v1/bins/{bin_id}

Retrieve a specific bin by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Resistor Bin",
  "location": "Shelf A, Bin 3",
  "description": "Bin for storing resistors"
}
```

#### PUT /api/v1/bins/{bin_id}

Update a specific bin.

**Request Body:**
```json
{
  "name": "Updated Resistor Bin",
  "location": "Shelf A, Bin 3",
  "description": "Updated bin for storing resistors"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Resistor Bin",
  "location": "Shelf A, Bin 3",
  "description": "Updated bin for storing resistors"
}
```

#### DELETE /api/v1/bins/{bin_id}

Delete a specific bin.

**Response:**
```json
{
  "message": "Bin deleted successfully"
}
```

### Search Endpoints

#### GET /api/v1/search

Search for parts across all fields with query parameters.

**Query Parameters:**
- `query` (string, optional): Search query across all fields
- `category_id` (integer, optional): Filter by category ID
- `bin_id` (integer, optional): Filter by bin ID
- `page` (integer, optional): Page number for pagination (default: 1)
- `limit` (integer, optional): Number of items per page (default: 100)
- `sort_by` (string, optional): Field to sort by (default: "id")
- `sort_order` (string, optional): Sort order, either "asc" or "desc" (default: "asc")

**Response:**
```json
[
  {
    "id": 1,
    "name": "Resistor 10kΩ",
    "part_number": "RES-10K-01",
    "manufacturer": "Yageo",
    "category_id": 1,
    "bin_id": 2,
    "quantity": 100,
    "description": "10kΩ 1/4W carbon film resistor",
    "tags": "resistor,carbon-film",
    "datasheet_url": "http://example.com/datasheet.pdf",
    "image_url": "http://example.com/image.jpg",
    "supplier": "DigiKey",
    "supplier_part_number": "YRC10K",
    "location": "Shelf A, Bin 3",
    "notes": "Good for general purpose use",
    "created_at": "2023-01-01T12:00:00",
    "updated_at": "2023-01-01T12:00:00",
    "specifications": [],
    "documents": []
  }
]
```

### Import/Export Endpoints

#### POST /api/v1/import/parts

Import parts from a CSV or JSON file.

**Request Body:**
```json
{
  "file": "file.csv"
}
```

**Response:**
```json
{
  "message": "Successfully imported parts from file.csv"
}
```

#### GET /api/v1/export/parts

Export parts to CSV or JSON format.

**Query Parameters:**
- `format` (string, optional): Export format, either "json" or "csv" (default: "json")

**Response:**
```json
{
  "parts": [
    {
      "id": 1,
      "name": "Resistor 10kΩ",
      "part_number": "RES-10K-01",
      "manufacturer": "Yageo",
      "category_id": 1,
      "bin_id": 2,
      "quantity": 100,
      "description": "10kΩ 1/4W carbon film resistor",
      "tags": "resistor,carbon-film",
      "datasheet_url": "http://example.com/datasheet.pdf",
      "image_url": "http://example.com/image.jpg",
      "supplier": "DigiKey",
      "supplier_part_number": "YRC10K",
      "location": "Shelf A, Bin 3",
      "notes": "Good for general purpose use",
      "created_at": "2023-01-01T12:00:00",
      "updated_at": "2023-01-01T12:00:00",
      "specifications": [],
      "documents": []
    }
  ]
}
```

### Part Specifications Endpoints

#### GET /api/v1/parts/{part_id}/specifications

Retrieve specifications for a specific part.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Resistance",
    "value": "10kΩ",
    "part_id": 1
  }
]
```

#### POST /api/v1/parts/{part_id}/specifications

Add a specification to a part.

**Request Body:**
```json
{
  "name": "Resistance",
  "value": "10kΩ"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Resistance",
  "value": "10kΩ",
  "part_id": 1
}
```

#### GET /api/v1/parts/{part_id}/specifications/{spec_id}

Retrieve a specific specification for a part.

**Response:**
```json
{
  "id": 1,
  "name": "Resistance",
  "value": "10kΩ",
  "part_id": 1
}
```

#### PUT /api/v1/parts/{part_id}/specifications/{spec_id}

Update a specific specification.

**Request Body:**
```json
{
  "name": "Updated Resistance",
  "value": "10kΩ"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Resistance",
  "value": "10kΩ",
  "part_id": 1
}
```

#### DELETE /api/v1/parts/{part_id}/specifications/{spec_id}

Delete a specific specification.

**Response:**
```json
{
  "message": "Part specification deleted successfully"
}
```

## Error Responses

The API uses standard HTTP status codes to indicate the success or failure of requests:

- `200 OK` - The request was successful
- `201 Created` - The resource was successfully created
- `400 Bad Request` - The request was invalid or cannot be served
- `404 Not Found` - The requested resource was not found
- `422 Unprocessable Entity` - The request was well-formed but unable to be followed due to semantic errors
- `500 Internal Server Error` - An error occurred on the server

## Validation Rules

All endpoints implement comprehensive input validation:

1. **Part Names**: Must be between 1-200 characters
2. **Part Quantities**: Must be non-negative integers
3. **URLs**: Must be valid HTTP/HTTPS URLs
4. **Tags**: Must be alphanumeric with spaces, hyphens, and underscores only
5. **Part Numbers**: Must be unique across the system
6. **Categories/Bins**: Must exist when referenced by ID

## Security

The API implements the following security measures:

1. **Input Sanitization**: All text inputs are sanitized to prevent XSS attacks
2. **SQL Injection Prevention**: All database queries use parameterized statements
3. **File Upload Validation**: Only CSV and JSON files are accepted for import
4. **Rate Limiting**: API endpoints are protected against abuse
5. **Authentication**: Future versions will implement JWT-based authentication

## Performance

The API is optimized for performance with:

1. **Database Indexing**: Proper indexing on frequently queried fields
2. **Query Optimization**: Efficient database queries with proper pagination
3. **Caching**: Implementation of caching for frequently accessed data
4. **Connection Pooling**: Efficient database connection management
5. **Response Compression**: Gzip compression for large responses