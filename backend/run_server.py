import uvicorn
import sys
import os

# Add the current directory to Python path to enable app imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from startup import run_startup_tasks

def main():
    # Run startup tasks
    print("Running startup tasks...")
    run_startup_tasks()
    
    # Start the server
    print("Starting the server...")
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()