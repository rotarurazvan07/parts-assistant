import subprocess
import sys
import os

def run_startup_tasks():
    """Run all startup tasks for the application"""
    print("Running startup tasks...")
    
    # Initialize the database
    print("Initializing database...")
    from app.init_db import init_db
    init_db()
    
    # Populate initial data
    print("Populating initial data...")
    from app.initial_data import init_default_data
    init_default_data()
    
    print("Startup tasks completed successfully!")

if __name__ == "__main__":
    run_startup_tasks()