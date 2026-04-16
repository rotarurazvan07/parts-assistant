from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from .api.v1 import parts, categories, bins, documents, settings, import_export, part_specifications, search
from .config import settings as app_settings

# Set up logging
logging.basicConfig(level=getattr(logging, app_settings.log_level.upper()))

app = FastAPI(
    title=app_settings.app_name,
    description="API for managing electronic components inventory",
    version=app_settings.app_version
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(parts.router, prefix=app_settings.api_v1_prefix, tags=["parts"])
app.include_router(categories.router, prefix=app_settings.api_v1_prefix, tags=["categories"])
app.include_router(bins.router, prefix=app_settings.api_v1_prefix, tags=["bins"])
app.include_router(documents.router, prefix=app_settings.api_v1_prefix, tags=["documents"])
app.include_router(settings.router, prefix=app_settings.api_v1_prefix, tags=["settings"])
app.include_router(import_export.router, prefix=app_settings.api_v1_prefix, tags=["import_export"])
app.include_router(part_specifications.router, prefix=app_settings.api_v1_prefix, tags=["part_specifications"])
app.include_router(search.router, prefix=app_settings.api_v1_prefix, tags=["search"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Electronics Lab API"}

@app.on_event("startup")
async def startup_event():
    print("Starting up Smart Electronics Lab API...")
    # Any startup tasks can go here

@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down Smart Electronics Lab API...")
    # Any cleanup tasks can go here