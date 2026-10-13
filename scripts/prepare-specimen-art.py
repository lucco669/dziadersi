"""Encode the complete cast and responsive sizes locally; no runtime image service.

python scripts/prepare-specimen-art.py --manifest artifacts/qa/specimen-sources.json --existing --site
Pillow is required. Generated alpha is preserved; artwork is never stretched.
"""
import argparse
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
WIDTHS = (180, 360, 600, 900, 1200)

def save_sizes(image: Image.Image, target: Path, *, full=True):
    target.parent.mkdir(parents=True, exist_ok=True)
    folder = target.parent / "sizes"
    folder.mkdir(exist_ok=True)
    for width in WIDTHS:
        if width >= image.width:
            continue
        height = round(image.height * width / image.width)
        image.resize((width, height), Image.Resampling.LANCZOS).save(
            folder / f"{target.stem}-{width}.webp", "WEBP", quality=85, method=6, exact=True)
    if full:
        image.save(target, "WEBP", quality=85, method=6, exact=True)

def prepare(key, source):
    prompts = json.loads((ROOT / "assets/illustrations/specimens/prompts.json").read_text(encoding="utf-8"))
    if key not in prompts["subjects"]:
        raise ValueError(f"Unknown specimen: {key}")
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    if alpha.getextrema() != (0, 255):
        raise ValueError(f"{key}: expected transparent background and opaque subject")
    bounds = alpha.getbbox()
    if not bounds:
        raise ValueError(f"{key}: empty image")
    drawing = ImageOps.contain(image.crop(bounds), (1104, 920), Image.Resampling.LANCZOS)
    plate = Image.new("RGBA", (1200, 1000), (0, 0, 0, 0))
    plate.paste(drawing, ((1200 - drawing.width) // 2, 960 - drawing.height))
    save_sizes(plate, ROOT / "public/illustrations/species" / f"{key}.webp")
    png = ROOT / "assets/illustrations/species" / f"{key}.png"
    png.parent.mkdir(parents=True, exist_ok=True)
    plate.resize((600, 500), Image.Resampling.LANCZOS).save(png, optimize=True)
    print(f"Prepared {key}", flush=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path)
    parser.add_argument("--existing", action="store_true")
    parser.add_argument("--site", action="store_true")
    args = parser.parse_args()
    if args.manifest:
        for key, source in json.loads(args.manifest.read_text(encoding="utf-8")).items():
            prepare(key, source)
    if args.existing:
        classic = json.loads((ROOT / "assets/illustrations/species/prompts.json").read_text(encoding="utf-8"))["subjects"]
        for key in classic:
            path = ROOT / "public/illustrations/species" / f"{key}.webp"
            save_sizes(Image.open(path).convert("RGBA"), path, full=False)
    if args.site:
        for folder in ("illustrations", "plansze"):
            for path in (ROOT / "public" / folder).glob("*.webp"):
                save_sizes(Image.open(path).convert("RGBA"), path, full=False)
