"""Normalize generated transparent plates; encode WebP for pages and PNG for Satori.

Requires Pillow. Run with --species KEY --source FILE, or --manifest a JSON key/path map.
"""

import argparse
import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PROMPTS = ROOT / "assets/illustrations/species/prompts.json"


def prepare(key: str, source: str) -> None:
    if key not in json.loads(PROMPTS.read_text(encoding="utf-8"))["subjects"]:
        raise ValueError(f"Unknown species: {key}; add its prompt first")
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    if alpha.getextrema()[0] != 0 or alpha.getextrema()[1] != 255:
        raise ValueError(f"{key}: source must have a transparent background and opaque artwork")
    bounds = alpha.getbbox()
    if not bounds:
        raise ValueError(f"{key}: empty image")
    drawing = ImageOps.contain(image.crop(bounds), (1104, 920), Image.Resampling.LANCZOS)
    plate = Image.new("RGBA", (1200, 1000), (0, 0, 0, 0))
    plate.paste(drawing, ((1200 - drawing.width) // 2, 960 - drawing.height))
    webp = ROOT / "public/illustrations/species" / f"{key}.webp"
    png = ROOT / "assets/illustrations/species" / f"{key}.png"
    webp.parent.mkdir(parents=True, exist_ok=True)
    png.parent.mkdir(parents=True, exist_ok=True)
    plate.save(webp, "WEBP", quality=85, method=6, exact=True)
    plate.resize((600, 500), Image.Resampling.LANCZOS).save(png, optimize=True)
    print(f"{key}: WebP {webp.stat().st_size // 1024} KB; PNG {png.stat().st_size // 1024} KB")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--species")
    parser.add_argument("--source")
    parser.add_argument("--manifest", type=Path)
    args = parser.parse_args()
    if args.manifest:
        for species, path in json.loads(args.manifest.read_text(encoding="utf-8")).items():
            prepare(species, path)
    elif args.species and args.source:
        prepare(args.species, args.source)
    else:
        parser.error("provide --species and --source, or --manifest")
