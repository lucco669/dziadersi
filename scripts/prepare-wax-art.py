"""Encode the Lanie wosku casts from their saved ImageGen sources.

Each source is a transparent PNG (assets/wosk/prompts.json lists the prompts and sources). The
drawing is trimmed to its alpha, fitted without stretching into a square transparent canvas and
written as WebP for the page (public/wosk/, 360, 600 and 900 px) and as 600 px PNGs for share
images: the cast itself and its shadow, a flat ink silhouette (Satori has no CSS filters).

    python scripts/prepare-wax-art.py [--sources PATH_TO_KEY_SOURCE_MAP]

Without --sources the sources recorded in prompts.json are used.
"""
from pathlib import Path
import argparse
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets/wosk"
PUBLIC = ROOT / "public/wosk"
CANVAS = 1000
MARGIN = 0.05
WIDTHS = (360, 600, 900)
INK = (22, 21, 19)

parser = argparse.ArgumentParser()
parser.add_argument("--sources", type=Path)
args = parser.parse_args()

manifest = json.loads((ASSETS / "prompts.json").read_text(encoding="utf-8"))
sources = json.loads(args.sources.read_text(encoding="utf-8")) if args.sources else manifest["sources"]
PUBLIC.mkdir(parents=True, exist_ok=True)

for key in manifest["subjects"]:
    image = Image.open(sources[key]).convert("RGBA")
    alpha = image.getchannel("A")
    if alpha.getextrema()[0] != 0:
        raise ValueError(f"{key}: source lacks transparency")
    # Drop the faint fringe the generator leaves around the drawing before trimming.
    box = alpha.point(lambda a: 255 if a > 8 else 0).getbbox()
    drawing = image.crop(box)
    inner = round(CANVAS * (1 - 2 * MARGIN))
    scale = min(inner / drawing.width, inner / drawing.height)
    drawing = drawing.resize((round(drawing.width * scale), round(drawing.height * scale)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    canvas.alpha_composite(drawing, ((CANVAS - drawing.width) // 2, (CANVAS - drawing.height) // 2))

    for width in WIDTHS:
        resized = canvas.resize((width, width), Image.Resampling.LANCZOS)
        name = f"{key}.webp" if width == WIDTHS[-1] else f"{key}-{width}.webp"
        resized.save(PUBLIC / name, "WEBP", quality=86, method=6)

    small = canvas.resize((600, 600), Image.Resampling.LANCZOS)
    small.save(ASSETS / f"{key}.png", "PNG", optimize=True)
    shadow = Image.new("RGBA", small.size, (*INK, 0))
    shadow.putalpha(small.getchannel("A"))
    shadow.save(ASSETS / f"{key}-cien.png", "PNG", optimize=True)
    print(f"{key}: alpha checked, {', '.join(map(str, WIDTHS))} px WebP, 600 px PNG and shadow")
