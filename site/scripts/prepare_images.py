#!/usr/bin/env python3
"""Turn the scraped source images into web assets, and classify each guitar.

The sources arrive in three shapes: transparent PNG press shots (Fender,
Jackson, Gibson), white-backdrop catalogue JPEGs (Ibanez, Newen), and plain
environmental photographs (ESP LTD, Ranger). The first two can be made to match
— a guitar floating on the page — by keying the white backdrop out. The third
cannot, so it is labelled `photo` and the site frames it instead.
"""
import json
import subprocess
from pathlib import Path

ROOT = Path("/run/media/william/Downloads/Projects/research/guitars")
SRC = ROOT / "images"
OUT = ROOT / "site/public/images"
KINDS = ROOT / "site/scripts/image-kinds.json"

FULL = 1400
THUMB = 360
# Low enough to spare the pale spruce tops and white pickguards, high enough to
# clear JPEG noise in the backdrop.
FUZZ = 18


def magick(*args: str) -> str:
    return subprocess.run(["magick", *args], capture_output=True, text=True).stdout.strip()


def has_alpha(path: Path) -> bool:
    return magick(str(path), "-format", "%A", "info:").lower() in {"blend", "true", "on"}


def corners_white(path: Path) -> bool:
    """True when the image sits on a studio backdrop.

    Three corners out of four, not all four: in tight crops the instrument
    itself can run into a corner (the AAD50CE headstock shot does exactly that).
    """
    fmt = "%[fx:p{0,0}.intensity] %[fx:p{w-1,0}.intensity] %[fx:p{0,h-1}.intensity] %[fx:p{w-1,h-1}.intensity]"
    out = magick(str(path), "-format", fmt, "info:")
    try:
        return sum(float(v) > 0.94 for v in out.split()) >= 3
    except ValueError:
        return False


def classify(path: Path) -> str:
    if has_alpha(path):
        return "cutout"
    return "backdrop" if corners_white(path) else "photo"


def render(src: Path, dst: Path, kind: str, size: int, quality: int) -> None:
    args = [str(src)]
    if kind == "backdrop":
        # Flood from the corner only, so white *inside* the guitar (pickguard,
        # soundhole label, binding) is left alone.
        args += [
            "-alpha", "set",
            "-bordercolor", "white", "-border", "1",
            "-fuzz", f"{FUZZ}%", "-fill", "none", "-floodfill", "+0+0", "white",
            "-shave", "1x1",
            "-trim", "+repage",
        ]
    elif kind == "cutout":
        args += ["-trim", "+repage"]
    args += ["-resize", f"{size}x{size}>", "-quality", str(quality), "-strip", str(dst)]
    subprocess.run(["magick", *args], check=True, capture_output=True)


def main() -> None:
    kinds: dict[str, str] = {}

    for folder in sorted(p for p in SRC.iterdir() if p.is_dir()):
        code = folder.name
        files = sorted(f for f in folder.iterdir() if f.suffix.lower() in {".jpg", ".jpeg", ".png"})
        if not files:
            continue

        dest = OUT / code
        dest.mkdir(parents=True, exist_ok=True)
        for stale in dest.glob("*.webp"):
            stale.unlink()

        per_file = [classify(f) for f in files]
        # One guitar renders one way; the majority shape wins.
        kind = "photo" if per_file.count("photo") > len(per_file) / 2 else "cutout"
        kinds[code] = kind

        for i, (src, file_kind) in enumerate(zip(files, per_file), start=1):
            n = f"{i:02d}"
            render(src, dest / f"{n}.webp", file_kind, FULL, 82)
            render(src, dest / f"{n}_t.webp", file_kind, THUMB, 76)

        print(f"{code:<16} {len(files)} imgs  kind={kind:<7} ({', '.join(sorted(set(per_file)))})")

    KINDS.write_text(json.dumps(kinds, indent=2) + "\n")


if __name__ == "__main__":
    main()
