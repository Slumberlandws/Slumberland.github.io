#!/usr/bin/env python3
"""
Extract embedded base64 images from the design SVG files into PNG assets.
Also records where each image is used (its usage position/size) for layout reference.
"""
import base64
import os
import re
import json
import xml.etree.ElementTree as ET

SVG_FILES = {
    "first_page": os.path.join("picture", "first_page.svg"),
    "choose_page": os.path.join("picture", "choose_page.svg"),
    "PttLB_page": os.path.join("picture", "PttLB_page.svg"),
}

OUT_DIR = os.path.join("assets", "img")
META_DIR = "assets"
os.makedirs(OUT_DIR, exist_ok=True)

NS = {"svg": "http://www.w3.org/2000/svg", "xlink": "http://www.w3.org/1999/xlink"}

# Map of image id -> output filename (page-specific, meaningful names will be filled later)
id_counter = {}


def sanitize(name):
    return re.sub(r"[^A-Za-z0-9_\-]+", "_", name)


def main():
    manifest = {}
    for page, path in SVG_FILES.items():
        tree = ET.parse(path)
        root = tree.getroot()
        images = {}
        # find all <image> definitions in defs
        for img in root.iter("{http://www.w3.org/2000/svg}image"):
            img_id = img.get("id")
            href = img.get("{http://www.w3.org/1999/xlink}href") or img.get("href")
            if not href or not href.startswith("data:image"):
                continue
            width = img.get("width")
            height = img.get("height")
            # decode
            header, b64 = href.split(",", 1)
            mime = re.search(r"data:([^;]+);base64", header)
            mime = mime.group(1) if mime else "image/png"
            ext = ".png" if "png" in mime else (".jpg" if "jpeg" in mime else ".png")
            try:
                data = base64.b64decode(b64)
            except Exception as e:
                print(f"  !! failed decode {img_id}: {e}")
                continue
            fname = f"{page}_{sanitize(img_id)}{ext}"
            with open(os.path.join(OUT_DIR, fname), "wb") as f:
                f.write(data)
            images[img_id] = {"file": fname, "width": width, "height": height, "bytes": len(data)}
            print(f"{page}: {img_id} -> {fname} ({width}x{height}, {len(data)} bytes)")

        manifest[page] = {"svg": path, "images": images}

    with open(os.path.join(META_DIR, "assets_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print("\nDone. Manifest written to assets/assets_manifest.json")


if __name__ == "__main__":
    main()
