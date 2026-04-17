from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os

SQLALCHEMY_DATABASE_URL = "sqlite:///./electronics_lab.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False,
)


@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


DEFAULT_CATEGORIES = [
    {"name": "Active Components", "parent_id": None, "description": "Components that require power to operate", "children": [
        {"name": "Microcontrollers", "parent_id": None, "description": "MCU units", "children": [
            {"name": "ARM", "parent_id": None, "description": "ARM-based MCUs"},
            {"name": "AVR", "parent_id": None, "description": "AVR-based MCUs (Arduino)"},
            {"name": "ESP32", "parent_id": None, "description": "Espressif ESP32/ESP8266 WiFi+BLE MCUs"},
            {"name": "STM32", "parent_id": None, "description": "STMicroelectronics 32-bit MCUs"},
            {"name": "PIC", "parent_id": None, "description": "Microchip PIC MCUs"},
            {"name": "RP2040", "parent_id": None, "description": "Raspberry Pi RP2040 MCUs"},
        ]},
        {"name": "Transistors", "parent_id": None, "description": "BJT and FET transistors", "children": [
            {"name": "NPN", "parent_id": None, "description": "NPN bipolar transistors"},
            {"name": "PNP", "parent_id": None, "description": "PNP bipolar transistors"},
            {"name": "MOSFET N-Channel", "parent_id": None, "description": "N-Channel MOSFETs"},
            {"name": "MOSFET P-Channel", "parent_id": None, "description": "P-Channel MOSFETs"},
        ]},
        {"name": "Integrated Circuits", "parent_id": None, "description": "General ICs", "children": [
            {"name": "Logic Gates", "parent_id": None, "description": "Digital logic ICs"},
            {"name": "Timers", "parent_id": None, "description": "Timer ICs (555, etc.)"},
            {"name": "Shift Registers", "parent_id": None, "description": "Shift register ICs"},
            {"name": "Multiplexers", "parent_id": None, "description": "Mux/Demux ICs"},
            {"name": "Clock Oscillators", "parent_id": None, "description": "Clock generation ICs"},
        ]},
        {"name": "Diodes", "parent_id": None, "description": "All diode types", "children": [
            {"name": "Rectifier Diodes", "parent_id": None, "description": "Standard rectifier diodes"},
            {"name": "Zener Diodes", "parent_id": None, "description": "Zener voltage reference diodes"},
            {"name": "Schottky Diodes", "parent_id": None, "description": "Schottky fast-switching diodes"},
            {"name": "LEDs", "parent_id": None, "description": "Light-emitting diodes"},
        ]},
        {"name": "Voltage Regulators", "parent_id": None, "description": "Linear and switching regulators", "children": [
            {"name": "Linear LDO", "parent_id": None, "description": "Low-dropout linear regulators"},
            {"name": "Buck Converters", "parent_id": None, "description": "Step-down DC-DC converters"},
            {"name": "Boost Converters", "parent_id": None, "description": "Step-up DC-DC converters"},
        ]},
        {"name": "Op-Amps", "parent_id": None, "description": "Operational amplifiers"},
        {"name": "Sensors", "parent_id": None, "description": "Electronic sensors", "children": [
            {"name": "Temperature Sensors", "parent_id": None, "description": "Temp and humidity sensors"},
            {"name": "Pressure Sensors", "parent_id": None, "description": "Barometric pressure sensors"},
            {"name": "IMU / Accelerometers", "parent_id": None, "description": "Motion and orientation sensors"},
            {"name": "Light Sensors", "parent_id": None, "description": "Photoresistors, photodiodes, etc."},
            {"name": "Distance Sensors", "parent_id": None, "description": "Ultrasonic, IR, ToF sensors"},
            {"name": "Gas Sensors", "parent_id": None, "description": "Air quality and gas sensors"},
        ]},
        {"name": "RF Modules", "parent_id": None, "description": "Radio frequency modules", "children": [
            {"name": "WiFi Modules", "parent_id": None, "description": "WiFi communication modules"},
            {"name": "Bluetooth Modules", "parent_id": None, "description": "Bluetooth/BLE modules"},
            {"name": "LoRa / RF", "parent_id": None, "description": "LoRa and sub-GHz RF modules (NRF24, etc.)"},
            {"name": "GPS Modules", "parent_id": None, "description": "GPS/GNSS modules"},
        ]},
        {"name": "Display Drivers", "parent_id": None, "description": "LCD, OLED, LED display drivers"},
        {"name": "Memory", "parent_id": None, "description": "RAM, Flash, EEPROM chips"},
    ]},
    {"name": "Passive Components", "parent_id": None, "description": "Components that do not require power to operate", "children": [
        {"name": "Resistors", "parent_id": None, "description": "Fixed and variable resistors", "children": [
            {"name": "Through-Hole Resistors", "parent_id": None, "description": "THT resistors"},
            {"name": "SMD Resistors", "parent_id": None, "description": "Surface mount resistors"},
            {"name": "Potentiometers", "parent_id": None, "description": "Variable resistors"},
            {"name": "Resistor Networks", "parent_id": None, "description": "Resistor array packages"},
        ]},
        {"name": "Capacitors", "parent_id": None, "description": "All capacitor types", "children": [
            {"name": "Ceramic Capacitors", "parent_id": None, "description": "MLCC and ceramic disc caps"},
            {"name": "Electrolytic Capacitors", "parent_id": None, "description": "Aluminum electrolytic caps"},
            {"name": "Tantalum Capacitors", "parent_id": None, "description": "Tantalum electrolytic caps"},
            {"name": "Film Capacitors", "parent_id": None, "description": "Polyester and polypropylene film caps"},
            {"name": "Supercapacitors", "parent_id": None, "description": "Ultracapacitors / supercaps"},
        ]},
        {"name": "Inductors", "parent_id": None, "description": "Inductors and chokes", "children": [
            {"name": "Power Inductors", "parent_id": None, "description": "High-current power inductors"},
            {"name": "RF Inductors", "parent_id": None, "description": "Small signal RF inductors"},
            {"name": "Ferrite Beads", "parent_id": None, "description": "EMI suppression beads"},
        ]},
        {"name": "Crystals & Oscillators", "parent_id": None, "description": "Quartz crystals and oscillators"},
        {"name": "Transformers", "parent_id": None, "description": "Signal and power transformers"},
        {"name": "Fuses", "parent_id": None, "description": "Fuses and resettable PTC fuses"},
    ]},
    {"name": "Electromechanical", "parent_id": None, "description": "Mechanical and electromechanical parts", "children": [
        {"name": "Switches", "parent_id": None, "description": "Tactile, toggle, slide, DIP switches"},
        {"name": "Relays", "parent_id": None, "description": "Electromechanical and SSR relays"},
        {"name": "Motors", "parent_id": None, "description": "DC, stepper, and servo motors"},
        {"name": "Buzzers", "parent_id": None, "description": "Piezo and magnetic buzzers"},
        {"name": "Fans", "parent_id": None, "description": "Cooling fans"},
    ]},
    {"name": "Connectors", "parent_id": None, "description": "All connectors and terminals", "children": [
        {"name": "Pin Headers", "parent_id": None, "description": "2.54mm male/female pin headers"},
        {"name": "JST Connectors", "parent_id": None, "description": "JST series connectors"},
        {"name": "USB Connectors", "parent_id": None, "description": "USB-A, USB-B, USB-C, Micro/Mini USB"},
        {"name": "Power Connectors", "parent_id": None, "description": "DC barrel jacks, XT60, etc."},
        {"name": "Screw Terminals", "parent_id": None, "description": "PCB screw terminal blocks"},
        {"name": "FPC / FFC", "parent_id": None, "description": "Flat flex cable connectors"},
        {"name": "Audio Connectors", "parent_id": None, "description": "3.5mm, RCA, XLR connectors"},
        {"name": "RF Connectors", "parent_id": None, "description": "SMA, BNC, U.FL connectors"},
    ]},
    {"name": "Displays", "parent_id": None, "description": "Display modules and panels", "children": [
        {"name": "OLED Displays", "parent_id": None, "description": "OLED display modules"},
        {"name": "LCD Displays", "parent_id": None, "description": "Character and graphic LCD modules"},
        {"name": "TFT / IPS Displays", "parent_id": None, "description": "Color TFT display modules"},
        {"name": "E-Ink Displays", "parent_id": None, "description": "Electronic paper displays"},
        {"name": "7-Segment Displays", "parent_id": None, "description": "Numeric 7-segment LED displays"},
        {"name": "LED Matrices", "parent_id": None, "description": "LED dot matrix displays"},
    ]},
    {"name": "Power", "parent_id": None, "description": "Power supply components", "children": [
        {"name": "Batteries", "parent_id": None, "description": "Primary and secondary batteries"},
        {"name": "Battery Holders", "parent_id": None, "description": "Battery holder mounts"},
        {"name": "Power Modules", "parent_id": None, "description": "Complete power supply modules"},
        {"name": "Solar Cells", "parent_id": None, "description": "Solar panels and cells"},
    ]},
    {"name": "Prototyping", "parent_id": None, "description": "Prototyping materials and tools", "children": [
        {"name": "Breadboards", "parent_id": None, "description": "Solderless breadboards"},
        {"name": "PCBs", "parent_id": None, "description": "Bare and protoboards"},
        {"name": "Development Boards", "parent_id": None, "description": "Arduino, Raspberry Pi, etc."},
        {"name": "Jumper Wires", "parent_id": None, "description": "Dupont and jumper cables"},
    ]},
    {"name": "Hardware", "parent_id": None, "description": "Mechanical hardware", "children": [
        {"name": "Standoffs & Spacers", "parent_id": None, "description": "PCB standoffs and spacers"},
        {"name": "Screws & Nuts", "parent_id": None, "description": "Metric and imperial fasteners"},
        {"name": "Heat Shrink", "parent_id": None, "description": "Heat shrink tubing"},
        {"name": "Enclosures", "parent_id": None, "description": "Project boxes and enclosures"},
    ]},
    {"name": "Uncategorized", "parent_id": None, "description": "Parts without a specific category"},
]


def seed_categories(db):
    from app.models.models import Category

    existing = db.query(Category).count()
    if existing > 0:
        return

    def insert_category(cat_data, parent_id=None):
        children = cat_data.pop("children", [])
        cat = Category(
            name=cat_data["name"],
            parent_id=parent_id,
            description=cat_data.get("description", ""),
        )
        db.add(cat)
        db.flush()
        for child in children:
            insert_category(dict(child), parent_id=cat.id)
        return cat

    for cat in DEFAULT_CATEGORIES:
        insert_category(dict(cat))

    db.commit()
