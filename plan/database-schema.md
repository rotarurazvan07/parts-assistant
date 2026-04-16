# Smart Electronics Lab Ecosystem - Database Schema

## Overview

This document describes the database schema for the Smart Electronics Lab Ecosystem. The system uses SQLite as its database engine and follows a normalized relational design to efficiently store and retrieve electronic component data, categories, storage locations, and associated documentation.

## Database Engine

- **SQLite**: Lightweight, file-based database suitable for single-user personal applications

## Entity Relationship Diagram

```
Parts ──────┐
            ├───── Categories
Documents ──┘
            ├───── Bins
Settings ───┘
```

## Tables

### 1. Parts Table

Stores information about electronic components in the inventory.

```sql
CREATE TABLE parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    part_number TEXT,
    manufacturer TEXT,
    category_id INTEGER,
    bin_id INTEGER,
    quantity INTEGER DEFAULT 0,
    description TEXT,
    tags TEXT,  -- Comma-separated list of tags
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (bin_id) REFERENCES bins(id)
);
```

**Fields:**
- `id`: Primary key
- `name`: Component name (required)
- `part_number`: Manufacturer's identifier
- `manufacturer`: Component manufacturer
- `category_id`: Reference to category
- `bin_id`: Reference to storage location
- `quantity`: Current stock count
- `description`: Free-form notes
- `tags`: Flexible labeling for cross-cutting concerns
- `created_at`: Timestamp when part was created
- `updated_at`: Timestamp when part was last updated

### 2. Part Specifications Table

Stores key-value pairs for technical specifications of parts.

```sql
CREATE TABLE part_specifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    part_id INTEGER NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE CASCADE
);
```

**Fields:**
- `id`: Primary key
- `part_id`: Reference to part
- `key`: Specification name (e.g., "voltage", "resistance", "package type")
- `value`: Specification value

### 3. Categories Table

Organizes parts in a hierarchical structure mirroring electronics taxonomy.

```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    parent_id INTEGER,
    description TEXT,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);
```

**Fields:**
- `id`: Primary key
- `name`: Category name
- `parent_id`: Reference to parent category (for hierarchy)
- `description`: Category description

### 4. Bins Table

Maps digital inventory to physical storage locations.

```sql
CREATE TABLE bins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    description TEXT
);
```

**Fields:**
- `id`: Primary key
- `name`: Storage location name (e.g., "Drawer A1", "Box 3", "Shelf B-2")
- `location`: Optional location description
- `description`: Bin description

### 5. Documents Table

Links technical documentation directly to parts.

```sql
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    part_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    document_type TEXT,  -- datasheet, schematic, manual, other
    url TEXT,
    storage_path TEXT,
    original_filename TEXT,
    content_type TEXT,  -- MIME type
    file_size INTEGER,
    FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE CASCADE
);
```

**Fields:**
- `id`: Primary key
- `part_id`: Reference to part
- `name`: Document name
- `document_type`: Type of document (datasheet, schematic, manual, other)
- `url`: External link URL
- `storage_path`: Path to uploaded file
- `original_filename`: Original filename
- `content_type`: MIME type
- `file_size`: File size in bytes

### 6. Settings Table

Stores user preferences and API credentials.

```sql
CREATE TABLE settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE
);
```

**Fields:**
- `id`: Primary key
- `key`: Setting identifier
- `value`: Setting value (masked for sensitive data)
- `is_sensitive`: Flag for sensitive data (API keys)

## Indexes

To improve query performance, the following indexes should be created:

```sql
CREATE INDEX idx_parts_category ON parts(category_id);
CREATE INDEX idx_parts_bin ON parts(bin_id);
CREATE INDEX idx_parts_name ON parts(name);
CREATE INDEX idx_parts_part_number ON parts(part_number);
CREATE INDEX idx_parts_manufacturer ON parts(manufacturer);
CREATE INDEX idx_parts_tags ON parts(tags);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_part_specifications_part ON part_specifications(part_id);
CREATE INDEX idx_documents_part ON documents(part_id);
```

## Constraints

1. **Category/Bin Deletion**: Allowed even if parts reference them (fallback to no category/bin)
2. **Data Integrity**: Foreign key constraints ensure referential integrity
3. **Unique Constraints**: Settings keys must be unique

## Business Rules

1. **Category/Bin Deletion**: When categories or bins are deleted, parts referencing them fall back to no category/bin
2. **API Keys**: Must be configured before AI chat works; clear error message if missing
3. **Document Management**: Multiple documents can be associated with a single part
4. **Specifications**: Key-value pairs allow for flexible technical specifications

## Sample Queries

### Get all parts with their categories and bins:

```sql
SELECT p.*, c.name as category_name, b.name as bin_name
FROM parts p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN bins b ON p.bin_id = b.id;
```

### Get all specifications for a part:

```sql
SELECT key, value
FROM part_specifications
WHERE part_id = ?;
```

### Get all documents for a part:

```sql
SELECT *
FROM documents
WHERE part_id = ?;
```

### Get all parts in a category:

```sql
SELECT *
FROM parts
WHERE category_id = ?;
```

### Get all parts in a bin:

```sql
SELECT *
FROM parts
WHERE bin_id = ?;
```

## Security Considerations

1. **API Keys**: Stored in settings table with is_sensitive flag set to TRUE
2. **Data Encryption**: Sensitive data should be encrypted at rest
3. **Access Control**: Single-user system with no external authentication

## Performance Considerations

1. **Indexing**: Proper indexes on frequently queried fields
2. **Query Optimization**: Use of JOINs for related data retrieval
3. **Data Archiving**: Consider archiving old data to improve performance
4. **Caching**: Implement caching for frequently accessed data