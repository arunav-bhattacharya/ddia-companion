#!/usr/bin/env python3
"""Flag SVG diagrams where lines/polygons cross text bounding boxes.

Static analysis of diagram .astro components: extracts <text>, <line>,
<polygon> and <rect> elements with literal coordinates, estimates each text
node's bounding box (width ~ 0.58 * font-size * char count), and reports any
line segment or polygon edge that passes through a text box. JSX-generated
geometry (inside {...map(...)}) is skipped and listed for manual review.
"""

import glob
import re
import sys

CHAR_W = 0.58  # average glyph width as a fraction of font-size (sans)
PAD = 1.0      # shrink text boxes by this much before testing (tolerance)


def floatval(attrs, key, default=None):
    m = re.search(rf'{key}="([-\d.]+)"', attrs)
    return float(m.group(1)) if m else default


def text_boxes(src):
    boxes = []
    for m in re.finditer(r'<text\b([^>]*)>([^<]*)</text>', src):
        attrs, content = m.group(1), m.group(2)
        content = re.sub(r'&#\d+;', 'x', content).strip()
        if not content or '{' in content or '{' in attrs:
            continue  # dynamic — handled as manual-review
        x, y = floatval(attrs, 'x'), floatval(attrs, 'y')
        if x is None or y is None:
            continue
        fs = floatval(attrs, 'font-size', 12.0)
        w = CHAR_W * fs * len(content)
        anchor_m = re.search(r'text-anchor="(\w+)"', attrs)
        anchor = anchor_m.group(1) if anchor_m else 'start'
        if anchor == 'middle':
            x0 = x - w / 2
        elif anchor == 'end':
            x0 = x - w
        else:
            x0 = x
        # y is the baseline; box spans roughly [y - 0.8*fs, y + 0.2*fs]
        boxes.append((x0 + PAD, y - 0.8 * fs + PAD, x0 + w - PAD, y + 0.2 * fs - PAD, content))
    return boxes


def segments(src):
    segs = []
    for m in re.finditer(r'<line\b([^>]*?)/?>', src):
        a = m.group(1)
        if '{' in a:
            continue
        c = [floatval(a, k) for k in ('x1', 'y1', 'x2', 'y2')]
        if None not in c:
            segs.append((tuple(c), 'line'))
    for m in re.finditer(r'<polygon\b[^>]*points="([^"{]+)"', m_src := src):
        pts = re.findall(r'([-\d.]+),([-\d.]+)', m.group(1))
        pts = [(float(a), float(b)) for a, b in pts]
        for i in range(len(pts)):
            x1, y1 = pts[i]
            x2, y2 = pts[(i + 1) % len(pts)]
            segs.append(((x1, y1, x2, y2), 'polygon'))
    return segs


def seg_intersects_box(seg, box):
    x1, y1, x2, y2 = seg
    bx0, by0, bx1, by1 = box[:4]
    if bx0 >= bx1 or by0 >= by1:
        return False
    # both endpoints on one outside side -> no
    if max(x1, x2) < bx0 or min(x1, x2) > bx1 or max(y1, y2) < by0 or min(y1, y2) > by1:
        return False
    # endpoint inside?
    for px, py in ((x1, y1), (x2, y2)):
        if bx0 < px < bx1 and by0 < py < by1:
            return True
    # segment crossing: sample points along the segment
    for t in (i / 24 for i in range(25)):
        px, py = x1 + (x2 - x1) * t, y1 + (y2 - y1) * t
        if bx0 < px < bx1 and by0 < py < by1:
            return True
    return False


def main():
    flagged, dynamic = [], []
    for path in sorted(glob.glob('src/components/diagrams/ch*/*.astro')):
        src = open(path).read()
        boxes = text_boxes(src)
        segs = segments(src)
        has_dynamic = bool(re.search(r'\{\s*\[?[\w.]+\.map\(', src)) or '${' in src
        hits = []
        for seg, kind in segs:
            for box in boxes:
                if seg_intersects_box(seg, box):
                    hits.append((kind, seg, box[4]))
        if hits:
            flagged.append((path, hits))
        elif has_dynamic:
            dynamic.append(path)
    for path, hits in flagged:
        print(f'OVERLAP {path}')
        for kind, seg, text in hits:
            print(f'   {kind} {seg} crosses text "{text[:48]}"')
    print(f'\n{len(flagged)} flagged; {len(dynamic)} dynamic-only (manual review):')
    for p in dynamic:
        print(f'   DYNAMIC {p}')


if __name__ == '__main__':
    main()
