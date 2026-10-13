"""Verify every static rendition and create contact sheets for visual review."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts/qa/cast"
OUT.mkdir(parents=True, exist_ok=True)
classic = json.loads((ROOT / "assets/illustrations/species/prompts.json").read_text(encoding="utf-8"))["subjects"]
names = [name for key in classic for name in (key, f"{key}-1", f"{key}-2")] + ["common", "common-1", "common-2"]
stats = []
for name in names:
    for width in (180, 360, 600, 900, 1200):
        relative = f"sizes/{name}-{width}.webp" if width < 1200 else f"{name}.webp"
        path = ROOT / "public/illustrations/species" / relative
        image = Image.open(path)
        assert image.size == (width, width * 5 // 6), (path, image.size)
        assert image.mode == "RGBA" and image.getchannel("A").getextrema() == (0, 255), path
        stats.append({"name": name, "width": width, "bytes": path.stat().st_size})
    png = Image.open(ROOT / "assets/illustrations/species" / f"{name}.png")
    assert png.size == (600, 500) and png.mode == "RGBA", name
font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 19)
for part in range(4):
    keys = list(classic)[part * 7:(part + 1) * 7]
    sheet = Image.new("RGB", (1260, 7 * 390), "#f4f0e7")
    draw = ImageDraw.Draw(sheet)
    for row, key in enumerate(keys):
        for col, name in enumerate((key, f"{key}-1", f"{key}-2")):
            if col == 1:
                draw.rectangle((col * 420, row * 390, (col + 1) * 420 - 1, (row + 1) * 390 - 1), fill="#fbf8f1")
            image = Image.open(ROOT / "public/illustrations/species" / f"{name}.webp").convert("RGBA")
            drawing = ImageOps.contain(image, (410, 342), Image.Resampling.LANCZOS)
            sheet.paste(drawing, (col * 420 + (420 - drawing.width) // 2, row * 390 + 5), drawing)
            draw.text((col * 420 + 12, row * 390 + 352), name, fill="#161513", font=font)
    sheet.save(OUT / f"sheet-{part + 1}.jpg", quality=92)
(OUT / "asset-report.json").write_text(json.dumps({"plates": len(names), "webps": len(stats), "totalWebpBytes": sum(item["bytes"] for item in stats), "sizes": stats}, indent=2), encoding="utf-8")
print(f"Verified {len(names)} plates, {len(stats)} WebPs; {sum(item['bytes'] for item in stats) / 1024 / 1024:.1f} MiB total")
