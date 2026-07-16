#!/usr/bin/env python3
"""Parse Guitarras.md into a typed TS module for the site."""
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path("/run/media/william/Downloads/Projects/research/guitars")
MD = ROOT / "Guitarras.md"
IMG = ROOT / "site/public/images"
OUT = ROOT / "site/src/data/guitars.ts"
KINDS = ROOT / "site/scripts/image-kinds.json"

# Accent = the instrument's actual finish/hardware colour.
ACCENT = {
    "0374090557": "#6FAF98",   # Surf Green
    "EIJBLPCBGB1": "#C9A24D",  # gold hardware on antique ebony
    "EISCEBGH1": "#A8863A",    # gold hardware on ebony
    "AAD50CELG": "#C89F6B",    # natural sitka spruce, low gloss
    "0374005540": "#DD6E62",   # Fiesta Red
    "2910124568": "#8E9BA6",   # satin black + black hardware -> steel
    "EIFVEBNH1": "#A9AFB3",    # nickel hardware on ebony
    "TL": "#D8573B",           # sampled from the custom paintwork on the actual guitar
    "MLAU185297625": "#C6983A",  # sampled from the flame top on the actual guitar
    "LMH103QMSTB": "#9A8F87",  # smoked warm grey of the see-thru black quilted top
}

# Short labels for the fretboard selector — what you'd actually call each one.
SHORT = {
    "0374090557": "Jaguar",
    "EIJBLPCBGB1": "Les Paul",
    "EISCEBGH1": "SG",
    "AAD50CELG": "AAD50CE",
    "0374005540": "Strato",
    "2910124568": "Kelly",
    "EIFVEBNH1": "Flying V",
    "TL": "Newen TL",
    "MLAU185297625": "Ranger",
    "LMH103QMSTB": "MH-103",
}

# Image folder is keyed by model code; the md code needs light cleanup.
CODE_FIX = {
    "TL (American Classic Series)": "TL",
    "MLAU185297625 (Mercado Libre Product ID)": "MLAU185297625",
    "0374090557 (Surf green)": "0374090557",
    "0374005540 (Fiesta red)": "0374005540",
    "2910124568 (Satin Black)": "2910124568",
    "AAD50CELG": "AAD50CELG",
}


def unescape(s: str) -> str:
    return re.sub(r"\\([-+*_()\[\]])", r"\1", s).strip()


def slug(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def parse():
    kinds = json.loads(KINDS.read_text()) if KINDS.exists() else {}
    text = MD.read_text(encoding="utf-8")
    # Blocks start at a level-1 heading; skip the document title and the notes.
    blocks = re.split(r"^# ", text, flags=re.M)[1:]
    guitars = []

    for block in blocks:
        lines = block.strip("\n").split("\n")
        name = unescape(lines[0])
        if name.startswith("Inventario"):
            continue

        rows = []
        for raw in lines[1:]:
            line = raw.strip()
            if not line.startswith("- "):
                continue
            body = unescape(line[2:])
            if ":" not in body:
                continue
            label, _, value = body.partition(":")
            rows.append([unescape(label), unescape(value)])

        # "Selector:" carries its positions as following sibling bullets.
        merged, i = [], 0
        while i < len(rows):
            label, value = rows[i]
            if not value and i + 1 < len(rows) and rows[i + 1][0].startswith("Posici"):
                parts = []
                i += 1
                while i < len(rows) and rows[i][0].startswith("Posici"):
                    parts.append(f"{rows[i][0].split()[-1]}. {rows[i][1]}")
                    i += 1
                merged.append([label, " · ".join(parts)])
                continue
            merged.append([label, value])
            i += 1

        fields = {label: value for label, value in merged}

        source = ""
        m = re.search(r"\[([^\]]+)\]\(([^)]+)\)", fields.get("Fuente", ""))
        if m:
            source = m.group(2)

        # Trailing asterisks are footnote markers pointing at the Notas section,
        # not part of the code.
        raw_code = fields.get("Código de modelo", "").rstrip("* ")
        code = CODE_FIX.get(raw_code, raw_code.split()[0].rstrip("*") if raw_code else "")

        # Specs = everything except what the header already shows.
        skip = {"Código de modelo", "Marca", "Serie", "Fuente", "Tipo", "Fabricación"}
        specs = [
            {"label": label, "value": value}
            for label, value in merged
            if label not in skip and value
        ]

        folder = IMG / code
        shots = sorted(p.name for p in folder.glob("[0-9][0-9].webp")) if folder.is_dir() else []

        guitars.append(
            {
                "id": slug(name),
                "code": code,
                "name": name,
                "short": SHORT.get(code, name.split()[0]),
                "brand": fields.get("Marca", ""),
                "series": fields.get("Serie", ""),
                "type": fields.get("Tipo", ""),
                "origin": fields.get("Fabricación", ""),
                "accent": ACCENT.get(code, "#9BA0A3"),
                "imageKind": kinds.get(code, "photo"),
                "images": [f"images/{code}/{s}" for s in shots],
                "thumbs": [f"images/{code}/{s[:2]}_t.webp" for s in shots],
                "specs": specs,
                "source": source,
            }
        )

    return guitars


def main():
    guitars = parse()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    body = json.dumps(guitars, ensure_ascii=False, indent=2)
    OUT.write_text(
        "// Generated from Guitarras.md — edit that file and re-run scripts/parse_md.py.\n"
        "export interface Spec {\n  label: string;\n  value: string;\n}\n\n"
        "export interface Guitar {\n"
        "  id: string;\n  code: string;\n  name: string;\n  short: string;\n  brand: string;\n"
        "  series: string;\n  type: string;\n  origin: string;\n  accent: string;\n"
        "  /** cutout: the guitar floats free. photo: a real photograph, framed. */\n"
        "  imageKind: 'cutout' | 'photo';\n"
        "  images: string[];\n  thumbs: string[];\n  specs: Spec[];\n  source: string;\n}\n\n"
        f"export const guitars: Guitar[] = {body};\n",
        encoding="utf-8",
    )

    for g in guitars:
        print(f"{g['code']:<16} {len(g['images'])} imgs  {len(g['specs']):>2} specs  {g['name']}")


if __name__ == "__main__":
    main()
