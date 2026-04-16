from sqlalchemy.orm import sessionmaker
from .database import engine, SessionLocal
from .models import Category, Bin, Setting

def init_default_data():
    db = SessionLocal()
    try:
        # Check if categories already exist
        category_count = db.query(Category).count()
        if category_count == 0:
            # Create default categories
            default_categories = [
                Category(name="Resistors", description="Various types of resistors"),
                Category(name="Capacitors", description="Different capacitor types and values"),
                Category(name="ICs", description="Integrated circuits"),
                Category(name="Transistors", description="BJTs, FETs, MOSFETs"),
                Category(name="Diodes", description="Rectifier, Zener, LED diodes"),
                Category(name="Connectors", description="Headers, sockets, plugs"),
                Category(name="Passive Components", description="Inductors, transformers, etc."),
                Category(name="Electromechanical", description="Switches, relays, fans"),
                Category(name="Power Supplies", description="Voltage regulators, power modules"),
                Category(name="Sensors", description="Temperature, light, motion sensors"),
            ]
            
            for category in default_categories:
                db.add(category)
            
            db.commit()
            print("Default categories created successfully!")
        else:
            print(f"Found {category_count} existing categories, skipping default creation.")
        
        # Check if bins already exist
        bin_count = db.query(Bin).count()
        if bin_count == 0:
            # Create default bins
            default_bins = [
                Bin(name="Drawer A1", location="Workbench", description="Top left drawer"),
                Bin(name="Drawer A2", location="Workbench", description="Top right drawer"),
                Bin(name="Shelf B-1", location="Storage", description="Left shelf"),
                Bin(name="Shelf B-2", location="Storage", description="Right shelf"),
                Bin(name="Box 1", location="Cabinet", description="Small components box"),
            ]
            
            for bin in default_bins:
                db.add(bin)
            
            db.commit()
            print("Default bins created successfully!")
        else:
            print(f"Found {bin_count} existing bins, skipping default creation.")
        
        # Check if settings already exist
        setting_count = db.query(Setting).count()
        if setting_count == 0:
            # Create default settings
            default_settings = [
                Setting(key="app_name", value="Smart Electronics Lab", is_sensitive=False),
                Setting(key="version", value="1.0.0", is_sensitive=False),
                Setting(key="default_currency", value="USD", is_sensitive=False),
                Setting(key="auto_backup_enabled", value="false", is_sensitive=False),
            ]
            
            for setting in default_settings:
                db.add(setting)
            
            db.commit()
            print("Default settings created successfully!")
        else:
            print(f"Found {setting_count} existing settings, skipping default creation.")
            
    except Exception as e:
        print(f"Error initializing default data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_default_data()