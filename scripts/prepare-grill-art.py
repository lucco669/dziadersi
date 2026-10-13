"""Encode the saved ImageGen sources without altering their drawings or alpha."""
from pathlib import Path
import json
import shutil
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets/illustrations/grill"
PUBLIC = ROOT / "public/illustrations/grill"
manifest = json.loads((ASSETS / "prompts.json").read_text(encoding="utf-8"))
PUBLIC.mkdir(parents=True, exist_ok=True)
for key, source in manifest["sources"].items():
    saved = ASSETS / f"{key}.png"
    if not saved.exists():
        shutil.copy2(source, saved)
    image = Image.open(saved).convert("RGBA")
    if image.getchannel("A").getextrema()[0] != 0:
        raise ValueError(f"{key}: source lacks transparency")
    widths = [360, 600, 900] if key in ("hero", "grill", "grill-mobile") else [300] if key.startswith("sausage") else [160]
    for width in widths:
        height = round(image.height * width / image.width)
        resized = image.resize((width, height), Image.Resampling.LANCZOS)
        name = f"{key}.webp" if width == widths[-1] else f"{key}-{width}.webp"
        resized.save(PUBLIC / name, "WEBP", quality=88, method=6)
        if key == "hero" and width == 600:
            resized.save(ASSETS / "hero-600.png", "PNG", optimize=True)
    print(f"{key}: alpha checked, {', '.join(str(w) for w in widths)} px")
