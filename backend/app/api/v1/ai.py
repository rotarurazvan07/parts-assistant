import asyncio
import json
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload

from app.database import get_db, SessionLocal
from app.models.models import Setting, Part, ChatMessageModel, MemoryNote
from app.schemas.schemas import ChatRequest, StoredMessage, MemoryNoteOut

router = APIRouter(prefix="/ai", tags=["ai"])

# ── Tuning knobs ───────────────────────────────────────────────────
HISTORY_WINDOW    = 40    # messages sent to the LLM as conversation history
SUMMARIZE_EVERY   = 20   # trigger re-summarization after every N new messages
MAX_STORED        = 500  # prune oldest beyond this ceiling

SMART_KEYWORDS = {
    "esp": "Espressif ESP32/ESP8266 — WiFi+BLE MCU 240MHz",
    "arduino": "Arduino AVR/ARM MCU — 8/32-bit hobbyist board",
    "stm32": "STMicroelectronics STM32 — 32-bit ARM Cortex-M",
    "rpi": "Raspberry Pi — Linux SBC or RP2040 MCU",
    "nrf24": "Nordic nRF24L01 — 2.4GHz RF transceiver, SPI",
    "nrf52": "Nordic nRF52 — Bluetooth 5.0 SoC",
    "bme280": "Bosch BME280 — humidity/pressure/temp I2C sensor",
    "bmp": "Bosch BMP pressure/temperature sensor",
    "mpu": "InvenSense MPU — 6/9-axis IMU accelerometer+gyroscope",
    "hc-sr04": "Ultrasonic distance sensor 2-400cm",
    "ds18": "Dallas DS18B20 — 1-Wire temperature sensor",
    "ina219": "TI INA219 — I2C current/voltage/power monitor",
    "ssd1306": "SSD1306 — OLED display driver I2C/SPI 128x64",
    "ili9341": "ILI9341 — 240x320 TFT LCD SPI driver",
    "w25": "Winbond W25 — SPI NOR Flash memory",
    "at24": "Microchip AT24 — I2C EEPROM",
    "74hc": "74HC logic gate IC",
    "l298": "L298N dual H-bridge motor driver",
    "a4988": "A4988 stepper motor driver",
    "drv8825": "DRV8825 stepper motor driver",
    "ch340": "CH340 USB-to-Serial converter",
    "ft232": "FTDI FT232 USB-to-Serial converter",
}


def enrich_name(name: str) -> str:
    lower = name.lower()
    for kw, desc in SMART_KEYWORDS.items():
        if kw in lower:
            return f"{name} [{desc}]"
    return name


def build_inventory_context(db: Session, context_part_ids: list[int]) -> str:
    all_parts = db.query(Part).options(
        joinedload(Part.category),
        joinedload(Part.bin),
        joinedload(Part.specifications),
        joinedload(Part.documents),
    ).all()

    ctx = set(context_part_ids)
    lines = ["=== ELECTRONICS LAB INVENTORY ===", f"Total parts: {len(all_parts)}", ""]

    if ctx:
        lines.append("=== HIGHLIGHTED CONTEXT PARTS (user-selected) ===")
        for p in all_parts:
            if p.id in ctx:
                lines.append(_fmt(p, detailed=True))
        lines.append("")

    lines.append("=== FULL INVENTORY ===")
    for p in all_parts:
        lines.append(_fmt(p, detailed=(p.id in ctx)))

    return "\n".join(lines)


def _fmt(part: Part, detailed: bool = False) -> str:
    cat = part.category.name if part.category else "Uncategorized"
    bin_ = part.bin.name if part.bin else "Unknown"
    line = (
        f"• {enrich_name(part.name)} | Part#: {part.part_number or 'N/A'} | "
        f"Mfr: {part.manufacturer or 'N/A'} | Cat: {cat} | Loc: {bin_} | Qty: {part.quantity}"
    )
    if part.tags:
        line += f" | Tags: {part.tags}"
    if part.description:
        line += f"\n  Desc: {part.description}"
    if detailed:
        if part.specifications:
            line += "\n  Specs: " + ", ".join(f"{s.key}={s.value}" for s in part.specifications)
        if part.documents:
            line += "\n  Docs: " + ", ".join(f"{d.name}({d.document_type})" for d in part.documents)
    return line


def get_ai_settings(db: Session):
    cfg = {s.key: s.value for s in db.query(Setting).all()}
    key = cfg.get("api_key")
    if not key:
        raise HTTPException(400, "AI API key not configured. Please add your API key in Settings.")
    return key, cfg.get("base_url", "https://api.openai.com/v1"), cfg.get("model", "gpt-4o-mini")


# ── Memory helpers ─────────────────────────────────────────────────

def get_memory_note(db: Session) -> Optional[str]:
    note = db.query(MemoryNote).first()
    return note.content if note else None


def get_recent_history(db: Session, limit: int = HISTORY_WINDOW) -> list[dict]:
    rows = (
        db.query(ChatMessageModel)
        .order_by(ChatMessageModel.id.desc())
        .limit(limit)
        .all()
    )
    return [{"role": r.role, "content": r.content} for r in reversed(rows)]


def persist_exchange(user_content: str, assistant_content: str):
    """Write both turns; prune if over ceiling. Uses its own session."""
    db = SessionLocal()
    try:
        db.add(ChatMessageModel(role="user", content=user_content))
        db.add(ChatMessageModel(role="assistant", content=assistant_content))
        db.commit()

        total = db.query(ChatMessageModel).count()
        if total > MAX_STORED:
            excess_ids = (
                db.query(ChatMessageModel.id)
                .order_by(ChatMessageModel.id.asc())
                .limit(total - MAX_STORED)
                .all()
            )
            db.query(ChatMessageModel).filter(
                ChatMessageModel.id.in_([r[0] for r in excess_ids])
            ).delete(synchronize_session=False)
            db.commit()

        return db.query(ChatMessageModel).count()
    finally:
        db.close()


async def _run_summarization(api_key: str, base_url: str, model: str):
    """Background task: summarise recent history → upsert MemoryNote."""
    db = SessionLocal()
    try:
        rows = (
            db.query(ChatMessageModel)
            .order_by(ChatMessageModel.id.desc())
            .limit(80)
            .all()
        )
        if not rows:
            return

        history_text = "\n".join(
            f"{r.role.upper()}: {r.content[:400]}" for r in reversed(rows)
        )

        prompt = (
            "You are building a persistent memory note for an AI assistant that manages "
            "an electronics parts lab.\n\n"
            "Write a compact memory note (max 400 words) capturing:\n"
            "- Key topics, projects, and goals the user discussed\n"
            "- Parts/components of interest, including any the user is looking to acquire\n"
            "- Lab-specific facts: storage locations mentioned, custom setups, preferences\n"
            "- Any open questions or next steps the user mentioned\n\n"
            "Be factual and terse. No filler. This is injected verbatim into future system "
            "prompts so the AI remembers context across browser sessions.\n\n"
            f"CONVERSATION:\n{history_text}\n\nMEMORY NOTE:"
        )

        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=api_key, base_url=base_url)
        resp = await client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.3,
        )
        summary = resp.choices[0].message.content.strip()

        note = db.query(MemoryNote).first()
        if note:
            note.content = summary
        else:
            db.add(MemoryNote(content=summary))
        db.commit()
        print(f"[Memory] Summary updated ({len(summary)} chars)")

    except Exception as e:
        print(f"[Memory] Summarization failed: {e}")
    finally:
        db.close()


# ── System prompt ──────────────────────────────────────────────────

SYSTEM_PROMPT = """\
You are "The Brain" — an intelligent AI assistant embedded in a Smart Electronics Lab Inventory system.

Your purpose:
1. Help the user understand what they can BUILD with their current inventory
2. Identify MISSING components for specific projects
3. Locate parts: tell users where specific components are stored
4. Answer technical electronics questions using inventory context
5. Provide component specifications and application notes
6. Suggest project ideas based on available parts

Guidelines:
- Be concise but thorough
- Use the inventory data to give specific, grounded answers
- When a part quantity is 0, mention it's out of stock
- For project feasibility, list both available and missing parts
- Use technical terminology appropriate for electronics hobbyists
- If a question is unrelated to electronics, politely redirect
{memory_section}
{inventory_context}
"""

MEMORY_BLOCK = """
=== MEMORY FROM PAST SESSIONS ===
{memory}
=== END MEMORY ===
"""


# ── Endpoints ──────────────────────────────────────────────────────

@router.get("/history", response_model=list[StoredMessage])
def get_history(limit: int = 100, db: Session = Depends(get_db)):
    """Return last `limit` messages for frontend hydration on mount."""
    rows = (
        db.query(ChatMessageModel)
        .order_by(ChatMessageModel.id.desc())
        .limit(limit)
        .all()
    )
    return list(reversed(rows))


@router.delete("/history", status_code=204)
def clear_history(db: Session = Depends(get_db)):
    db.query(ChatMessageModel).delete()
    db.commit()


@router.get("/memory", response_model=Optional[MemoryNoteOut])
def get_memory(db: Session = Depends(get_db)):
    return db.query(MemoryNote).first()


@router.delete("/memory", status_code=204)
def clear_memory(db: Session = Depends(get_db)):
    db.query(MemoryNote).delete()
    db.commit()


@router.post("/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    api_key, base_url, model = get_ai_settings(db)

    memory_text = get_memory_note(db)
    memory_section = MEMORY_BLOCK.format(memory=memory_text) if memory_text else ""

    inventory_context = build_inventory_context(db, request.context_parts or [])
    system_prompt = SYSTEM_PROMPT.format(
        memory_section=memory_section,
        inventory_context=inventory_context,
    )

    db_history = get_recent_history(db, limit=HISTORY_WINDOW)
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(db_history)
    messages.append({"role": "user", "content": request.message})

    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=api_key, base_url=base_url)

    async def stream_and_persist():
        accumulated = ""
        error_occurred = False
        try:
            stream = await client.chat.completions.create(
                model=model,
                messages=messages,
                stream=True,
                max_tokens=4096,
                temperature=0.7,
            )
            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    token = chunk.choices[0].delta.content
                    accumulated += token
                    yield f"data: {json.dumps({'token': token})}\n\n"

        except Exception as e:
            error_occurred = True
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

        finally:
            yield "data: [DONE]\n\n"

            if accumulated and not error_occurred:
                total_after = persist_exchange(request.message, accumulated)
                # Trigger summarization every SUMMARIZE_EVERY messages
                if total_after % SUMMARIZE_EVERY == 0:
                    asyncio.create_task(
                        _run_summarization(api_key, base_url, model)
                    )

    return StreamingResponse(
        stream_and_persist(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
