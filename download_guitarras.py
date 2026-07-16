#!/usr/bin/env python3
from __future__ import annotations

import json
import mimetypes
import re
import sys
from dataclasses import dataclass
from html import unescape
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse, urlunparse

import requests


ROOT = Path(__file__).resolve().parent
INPUT_MD = ROOT / "Guitarras.md"
OUTPUT_DIR = ROOT / "images"
MANIFEST_PATH = OUTPUT_DIR / "manifest.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
}


@dataclass
class GuitarSpec:
    code: str
    title: str
    source_urls: list[str]
    note: str = ""


MODEL_SOURCES: dict[str, GuitarSpec] = {
    "0374090557": GuitarSpec(
        code="0374090557",
        title="Squier Classic Vibe '70s Jaguar",
        source_urls=[
            "https://intl.fender.com/products/classic-vibe-70s-jaguar",
        ],
    ),
    "EIJBLPCBGB1": GuitarSpec(
        code="EIJBLPCBGB1",
        title="Epiphone Joe Bonamassa 1959 Les Paul Custom (Antique Ebony)",
        source_urls=[
            "https://ksmusic.com/epiphone-joe-bonamassa-1959-les-paul-custom-with-original-hardshell-case-antique-ebony/",
            "https://store.royalmusic.com.br/epiphone/guitarra/les-paul/guitarra-epiphone-joe-bonamassa-1959-les-paul-custom-antique-ebony",
        ],
    ),
    "EISCEBGH1": GuitarSpec(
        code="EISCEBGH1",
        title="Epiphone SG Custom (Ebony)",
        source_urls=[
            "https://www.billsmusic.com/eiscebgh1/",
        ],
    ),
    "AAD50CELG": GuitarSpec(
        code="AAD50CELG",
        title="Ibanez AAD50CELG",
        source_urls=[
            "https://www.guitarcenter.com/Ibanez/AAD50CE-Advanced-Acoustic-Grand-Dreadnought-Acoustic-Electric-Guitar-Natural-Low-Gloss-1500000366042.gc",
        ],
    ),
    "0374005540": GuitarSpec(
        code="0374005540",
        title="Squier Classic Vibe '50s Stratocaster",
        source_urls=[
            "https://intl.fender.com/products/classic-vibe-50s-stratocaster",
        ],
    ),
    "2910124568": GuitarSpec(
        code="2910124568",
        title="Jackson JS Series Kelly JS32T",
        source_urls=[
            "https://intl.jacksonguitars.com/products/js-series-kelly-js32t",
        ],
    ),
    "EIFVEBNH1": GuitarSpec(
        code="EIFVEBNH1",
        title="Epiphone Flying V (Ebony)",
        source_urls=[
            "https://bensmusicstop.com/product/flying-v-ebony-eifvebnh/",
            "https://www.marksguitarexchange.com/shop/Electric-Guitars/p/Epiphone-Flying-V-Ebony.htm",
            "https://astrings.co.uk/products/epiphone-inspired-by-gibson-flying-v-ebony",
            "https://www.megasom.com.br/cordas/guitarra/guitarra-epiphone-flying-v-ebony",
        ],
    ),
    "TL": GuitarSpec(
        code="TL",
        title="Newen TL",
        source_urls=[
            "https://www.newenguitars.com/product-page/newen-tl",
        ],
    ),
    "MLAU185297625": GuitarSpec(
        code="MLAU185297625",
        title="Ranger (Azul Profundo)",
        source_urls=[
            "https://www.pinterest.com/pin/blue-and-black-electric-guitar--300122762679787231/",
            "https://uk.pinterest.com/pin/6685099439525450/",
            "https://mx.pinterest.com/pin/75927943713127015/",
            "https://www.pinterest.com/pin/945263409277043875/",
            "https://www.pinterest.com/pin/guitar-jammin--356699232978732152/",
            "https://fr.pinterest.com/pin/cool-electric-guitar-on-blue-and-white-striped-flooring--470978073502905626/",
        ],
        note="Exact MercadoLibre listing was blocked; these are visual proxies with the same blue/black striped aesthetic.",
    ),
    "LMH103QMSTB": GuitarSpec(
        code="LMH103QMSTB",
        title="ESP LTD MH-103QM (See-Thru Blue)",
        source_urls=[
            "https://jakewildwood.blogspot.com/2024/07/2014-esp-ltd-mh-103qm-superstrat-style.html",
        ],
    ),
}


def parse_guitars(md_path: Path) -> list[dict[str, str]]:
    text = md_path.read_text(encoding="utf-8")
    headings = list(re.finditer(r"(?m)^# (.+)$", text))
    items: list[dict[str, str]] = []
    for idx, heading in enumerate(headings):
        start = heading.end()
        end = headings[idx + 1].start() if idx + 1 < len(headings) else len(text)
        block = text[start:end]
        title = heading.group(1).strip()
        m = re.search(r"Código de modelo:\s*([A-Z0-9]+)", block)
        if not m:
            continue
        items.append({"title": title, "code": m.group(1), "block": block})
    return items


def normalize_url(url: str) -> str:
    parsed = urlparse(url)
    return urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))


def is_probable_image_url(url: str) -> bool:
    path = urlparse(url).path.lower()
    if any(skip in path for skip in ("logo", "icon", "sprite", "favicon", "avatar", "placeholder")):
        return False
    if "d53b014d86a6b6761bf649a0ed813c2b" in path:
        return False
    return bool(re.search(r"\.(?:jpg|jpeg|png|webp)(?:$|/)", path))


def score_image_url(url: str) -> int:
    parsed = urlparse(url)
    path = parsed.path.lower()
    score = 0
    if "originals" in path:
        score += 60
    if "/1200x/" in path or "1280" in path or "2000x2000" in path:
        score += 50
    if "/736x/" in path or "/564x/" in path or "/474x/" in path:
        score += 35
    if "large" in path or "main" in path or "hero" in path:
        score += 20
    if any(host in parsed.netloc for host in ("pinimg.com", "guitarcenter.com", "bigcommerce.com", "fmicassets.com", "blogger.googleusercontent.com", "wixstatic.com", "tcdn.com.br", "shopify.com")):
        score += 10
    if parsed.query:
        score += 2
    return score


def pinterest_extras(html: str) -> list[str]:
    urls = set()
    patterns = [
        r'"imageLargeUrl"\s*:\s*"(https://i\.pinimg\.com/[^"]+)"',
        r'"images_orig"\s*:\s*\{\s*"url"\s*:\s*"(https://i\.pinimg\.com/[^"]+)"',
        r'"url"\s*:\s*"(https://i\.pinimg\.com/[^"]+)"',
    ]
    for pattern in patterns:
        for match in re.findall(pattern, html):
            urls.add(unescape(match))
    return sorted(urls, key=score_image_url, reverse=True)


def extract_image_urls(page_url: str) -> list[str]:
    if re.match(r"^https?://[^?#]+\.(?:jpg|jpeg|png|webp)(?:\?.*)?$", page_url, re.I):
        return [normalize_url(page_url)]

    try:
        response = requests.get(page_url, headers=HEADERS, timeout=30)
        response.raise_for_status()
    except Exception as exc:
        print(f"[warn] {page_url}: {exc}", file=sys.stderr)
        return []

    html = response.text
    urls: list[str] = []

    urls.extend(pinterest_extras(html))

    generic = re.findall(r'https?://[^"\'\)\s>]+?\.(?:jpg|jpeg|png|webp)(?:\?[^"\'\)\s>]*)?', html, flags=re.I)
    urls.extend(unescape(u) for u in generic)

    for attr in ("src", "data-src", "data-image", "data-large_image", "content"):
        matches = re.findall(rf'{attr}=["\'](https?://[^"\']+?)["\']', html, flags=re.I)
        urls.extend(unescape(u) for u in matches)

    seen = set()
    clean: list[str] = []
    for url in urls:
        url = normalize_url(url)
        if not is_probable_image_url(url):
            continue
        key = normalize_image_key(url)
        if key in seen:
            continue
        seen.add(key)
        clean.append(url)

    clean.sort(key=score_image_url, reverse=True)
    return clean


def normalize_image_key(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path
    name = Path(path).name
    stem = Path(name).stem
    suffix = Path(name).suffix.lower()

    stem = re.sub(r"(_\d+x\d+|_\d+w|_grande|_large|_medium|_thumb|_small)$", "", stem, flags=re.I)
    path = str(Path(parsed.netloc) / Path(path).with_name(stem + suffix))

    if "pinimg.com" in parsed.netloc:
        m = re.search(r"/([0-9a-f]{2})/([0-9a-f]{2})/([0-9a-f]{2})/([0-9a-f]{32})\.", parsed.path, flags=re.I)
        if m:
            return f"pinimg:{m.group(4).lower()}"

    return f"{parsed.netloc}{path}"


def guess_extension(url: str, content_type: str | None) -> str:
    path = urlparse(url).path.lower()
    suffix = Path(path).suffix.lower()
    if suffix in {".jpg", ".jpeg", ".png", ".webp"}:
        return suffix
    if content_type:
        ext = mimetypes.guess_extension(content_type.split(";", 1)[0].strip())
        if ext in {".jpg", ".jpeg", ".png", ".webp"}:
            return ext
    return ".jpg"


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "image"


def download_file(url: str, dest: Path) -> bool:
    try:
        with requests.get(url, headers=HEADERS, timeout=45, stream=True) as response:
            response.raise_for_status()
            content_type = response.headers.get("content-type")
            if dest.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
                dest = dest.with_suffix(guess_extension(url, content_type))
            dest.parent.mkdir(parents=True, exist_ok=True)
            with dest.open("wb") as fh:
                for chunk in response.iter_content(chunk_size=1024 * 32):
                    if chunk:
                        fh.write(chunk)
        return True
    except Exception as exc:
        print(f"[warn] download failed {url}: {exc}", file=sys.stderr)
        return False


def safe_filename(base: str, idx: int, url: str, content_type: str | None = None) -> str:
    parsed = urlparse(url)
    name = Path(parsed.path).name
    stem = Path(name).stem
    stem = re.sub(r"(_\d+x\d+|_\d+w|_grande|_large|_medium|_thumb|_small)$", "", stem, flags=re.I)
    ext = guess_extension(url, content_type)
    if not stem:
        stem = "image"
    return f"{idx:02d}_{stem}{ext}"


def collect_candidates(spec: GuitarSpec) -> list[str]:
    all_urls: list[str] = []
    for source in spec.source_urls:
        all_urls.extend(extract_image_urls(source))

    if spec.code == "MLAU185297625":
        # Keep one image per pin, ordered by quality.
        unique: dict[str, str] = {}
        for url in all_urls:
            key = normalize_image_key(url)
            if key not in unique or score_image_url(url) > score_image_url(unique[key]):
                unique[key] = url
        return sorted(unique.values(), key=score_image_url, reverse=True)

    unique: dict[str, str] = {}
    for url in all_urls:
        key = normalize_image_key(url)
        if key not in unique or score_image_url(url) > score_image_url(unique[key]):
            unique[key] = url
    return sorted(unique.values(), key=score_image_url, reverse=True)


def main() -> int:
    OUTPUT_DIR.mkdir(exist_ok=True)
    parsed_items = parse_guitars(INPUT_MD)
    manifest = {
        "source": str(INPUT_MD.name),
        "items": [],
    }

    missing = []
    for item in parsed_items:
        code = item["code"]
        title = item["title"]
        spec = MODEL_SOURCES.get(code)
        if not spec:
            print(f"[warn] no source mapping for {code} - {title}", file=sys.stderr)
            missing.append(code)
            continue

        folder = OUTPUT_DIR / code
        folder.mkdir(parents=True, exist_ok=True)

        candidates = collect_candidates(spec)
        downloaded: list[dict[str, str]] = []
        used_keys: set[str] = set()

        for url in candidates:
            if len(downloaded) >= 5:
                break
            key = normalize_image_key(url)
            if key in used_keys:
                continue
            used_keys.add(key)

            tmp_path = folder / safe_filename(code, len(downloaded) + 1, url)
            if tmp_path.exists() and tmp_path.stat().st_size > 0:
                downloaded.append({"url": url, "path": str(tmp_path)})
                continue

            try:
                with requests.get(url, headers=HEADERS, timeout=45, stream=True) as response:
                    response.raise_for_status()
                    content_type = response.headers.get("content-type")
                    final_name = safe_filename(code, len(downloaded) + 1, url, content_type)
                    dest = folder / final_name
                    with dest.open("wb") as fh:
                        for chunk in response.iter_content(chunk_size=1024 * 32):
                            if chunk:
                                fh.write(chunk)
                downloaded.append({"url": url, "path": str(dest)})
            except Exception as exc:
                print(f"[warn] {code}: failed {url}: {exc}", file=sys.stderr)

        manifest["items"].append(
            {
                "code": code,
                "title": title,
                "source_urls": spec.source_urls,
                "note": spec.note,
                "downloaded_count": len(downloaded),
                "downloads": downloaded,
            }
        )

    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    print(json.dumps(
        {
            "output_dir": str(OUTPUT_DIR),
            "manifest": str(MANIFEST_PATH),
            "missing_mappings": missing,
            "counts": {item["code"]: item["downloaded_count"] for item in manifest["items"]},
        },
        ensure_ascii=False,
        indent=2,
    ))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
