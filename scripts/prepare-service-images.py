"""Prepare responsive WebP assets from the retained imagegen originals."""
import json
from pathlib import Path
from PIL import Image

repo = Path(__file__).resolve().parents[1]
manifest = json.loads((repo / "docs/service-image-prompts.json").read_text(encoding="utf-8"))
originals = repo.parent / "sudo-service-photo-originals"
output = repo / "public/illustrations"
originals.mkdir(exist_ok=True)
output.mkdir(exist_ok=True)
for item in manifest["images"]:
    source = originals / item["source"]
    with Image.open(source) as image:
        image = image.convert("RGB")
        for width in (400, 800):
            height = round(image.height * width / image.width)
            target = output / f"service-{item['id']}-{width}.webp"
            image.resize((width, height), Image.Resampling.LANCZOS).save(target, "WEBP", quality=82, method=6)
            print(f"{target.name}: {target.stat().st_size} bytes")
