#!/usr/bin/env python3
"""Dump per-chapter text from the DDIA 2nd-edition PDF for authoring reference.

Usage:
    python3 tools/extract_chapter.py            # extract all chapters + glossary
    python3 tools/extract_chapter.py 4          # extract chapter 4 only

Output goes to tools/extracted/chNN.txt (gitignored — never commit book text).
"""

import re
import sys
from pathlib import Path

from pypdf import PdfReader

PDF_PATH = (
    "/Users/arunav/Documents/learn/books & pdfs/architecture and software design/"
    "Designing Data-Intensive Applications The Big Ideas Behind Reliable, Scalable, "
    "and Maintainable Systems (Martin Kleppmann, Chris Riccomini).pdf"
)

# 0-indexed inclusive page ranges from the PDF outline.
RANGES = {
    1: (24, 55),
    2: (56, 87),
    3: (88, 137),
    4: (138, 183),
    5: (184, 219),
    6: (220, 273),
    7: (274, 299),
    8: (300, 367),
    9: (368, 423),
    10: (424, 473),
    11: (474, 509),
    12: (510, 561),
    13: (562, 607),
    14: (608, 625),
    "glossary": (626, 631),
}


def clean(text: str) -> str:
    # pypdf renders soft hyphens at line breaks as '!' in this PDF
    # (e.g. "corre!sponded" -> "corresponded").
    text = re.sub(r"(\w)!\n?(\w)", r"\1\2", text)
    # Ligature artifacts like "De/f_ining" -> best-effort fix
    text = text.replace("/f_", "f").replace("/T_", "T")
    return text


def extract(reader: PdfReader, key, out_dir: Path) -> None:
    start, end = RANGES[key]
    parts = []
    for i in range(start, end + 1):
        parts.append(reader.pages[i].extract_text() or "")
    name = f"ch{key:02d}" if isinstance(key, int) else str(key)
    out = out_dir / f"{name}.txt"
    out.write_text(clean("\n".join(parts)), encoding="utf-8")
    print(f"{out}  ({end - start + 1} pages)")


def main() -> None:
    out_dir = Path(__file__).parent / "extracted"
    out_dir.mkdir(exist_ok=True)
    reader = PdfReader(PDF_PATH)
    if len(sys.argv) > 1:
        keys = [int(a) if a.isdigit() else a for a in sys.argv[1:]]
    else:
        keys = list(RANGES)
    for key in keys:
        extract(reader, key, out_dir)


if __name__ == "__main__":
    main()
