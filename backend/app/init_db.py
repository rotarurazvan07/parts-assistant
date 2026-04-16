from sqlalchemy import create_engine, inspect, text
from .database import DATABASE_URL
from .models import Base
import os


def init_db():
    """
    Initialize the database by creating all tables if they don't exist
    """
    print("Initializing database...")
    
    # Create database engine
    engine = create_engine(DATABASE_URL)
    
    # Check if tables exist
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    if not existing_tables:
        print("No existing tables found. Creating all tables...")
        Base.metadata.create_all(bind=engine)
        print("All tables created successfully!")
    else:
        print(f"Found existing tables: {existing_tables}")
        # Check if all required tables exist
        required_tables = [
            'parts', 'part_specifications', 'categories', 
            'bins', 'documents', 'settings'
        ]
        
        missing_tables = [table for table in required_tables if table not in existing_tables]
        
        if missing_tables:
            print(f"Creating missing tables: {missing_tables}")
            Base.metadata.create_all(bind=engine)
            print("Missing tables created successfully!")
        else:
            print("All required tables already exist.")
    
    # Create indexes if they don't exist
    create_indexes(engine)
    
    print("Database initialization completed!")


def create_indexes(engine):
    """
    Create database indexes for better performance
    """
    print("Creating database indexes...")
    
    # Define the indexes to create
    indexes_sql = [
        "CREATE INDEX IF NOT EXISTS idx_parts_category ON parts(category_id);",
        "CREATE INDEX IF NOT EXISTS idx_parts_bin ON parts(bin_id);",
        "CREATE INDEX IF NOT EXISTS idx_parts_name ON parts(name);",
        "CREATE INDEX IF NOT EXISTS idx_parts_part_number ON parts(part_number);",
        "CREATE INDEX IF NOT EXISTS idx_parts_manufacturer ON parts(manufacturer);",
        "CREATE INDEX IF NOT EXISTS idx_parts_tags ON parts(tags);",
        "CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);",
        "CREATE INDEX IF NOT EXISTS idx_part_specifications_part ON part_specifications(part_id);",
        "CREATE INDEX IF NOT EXISTS idx_documents_part ON documents(part_id);"
    ]
    
    with engine.connect() as conn:
        for sql in indexes_sql:
            conn.execute(text(sql))
        conn.commit()
    
    print("Database indexes created successfully!")


if __name__ == "__main__":
    init_db()