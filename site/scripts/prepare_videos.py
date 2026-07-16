#!/usr/bin/env python3
"""Fetch each demo video's poster frame and render it as a local web asset.

The player itself is a YouTube embed, but nothing should reach Google until the
visitor actually asks for the video — so the frame that sits in the thumbnail
strip is served from this site instead of from i.ytimg.com.

maxresdefault only exists for videos uploaded with a large enough source; the
older demos here fall back to hqdefault, which every video has.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path("/run/media/william/Downloads/Projects/research/guitars")
MD = ROOT / "Guitarras.md"
OUT = ROOT / "site/public/video"

THUMB = 360
# hqdefault is letterboxed to 4:3 with black bars; the frame itself is the 16:9
# middle 90%, so that band is what gets kept.
HQ_CROP = "480x270+0+45"


def blocks() -> list[tuple[str, str]]:
    """(model code, video id) for every guitar that has a video."""
    text = MD.read_text(encoding="utf-8")
    found = []
    for block in text.split("\n# ")[1:]:
        m = re.search(r"^- Código de modelo: (\S+)", block, re.M)
        v = re.search(r"^- Video: \[[^\]]+\]\([^)]*[?&]v=([\w-]{11})", block, re.M)
        if m and v:
            found.append((m.group(1).rstrip("\\* "), v.group(1)))
    return found


def download(vid: str, dest: Path) -> str:
    for name in ("maxresdefault", "hqdefault"):
        url = f"https://i.ytimg.com/vi/{vid}/{name}.jpg"
        r = subprocess.run(
            ["curl", "-sfL", "-o", str(dest), url], capture_output=True, text=True
        )
        # YouTube answers a missing size with a 404 (-f turns that into failure)
        # or, occasionally, a 120x90 grey placeholder.
        if r.returncode == 0 and dest.stat().st_size > 2000:
            return name
    raise SystemExit(f"sin miniatura para {vid}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = OUT / "_tmp.jpg"

    for code, vid in blocks():
        name = download(vid, tmp)
        args = [str(tmp)]
        if name == "hqdefault":
            args += ["-crop", HQ_CROP, "+repage"]
        args += ["-resize", f"{THUMB}x{THUMB}>", "-quality", "76", "-strip", str(OUT / f"{code}.webp")]
        subprocess.run(["magick", *args], check=True, capture_output=True)
        print(f"{code:<16} {vid}  {name}")

    tmp.unlink(missing_ok=True)


if __name__ == "__main__":
    sys.exit(main())
