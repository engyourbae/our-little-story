#!/usr/bin/env python3
"""Membuat ikon PWA (PNG) tanpa dependensi eksternal. Jalankan: npm run icons"""
import struct, zlib, os

HEART = [
    "..XX...XX..",
    ".XXXX.XXXX.",
    "XXXXXXXXXXX",
    "XXXXXXXXXXX",
    "XXXXXXXXXXX",
    ".XXXXXXXXX.",
    "..XXXXXXX..",
    "...XXXXX...",
    "....XXX....",
    ".....X.....",
]

def png(path, size, pad_ratio):
    bg = (47, 74, 58, 255)
    fg = (244, 163, 176, 255)
    hi = (255, 240, 242, 255)
    cols = len(HEART[0]); rows = len(HEART)
    inner = size * (1 - 2 * pad_ratio)
    cell = int(inner // cols)
    w = cell * cols; h = cell * rows
    ox = (size - w) // 2; oy = (size - h) // 2
    raw = bytearray()
    for y in range(size):
        raw.append(0)
        for x in range(size):
            c = bg
            if ox <= x < ox + w and oy <= y < oy + h:
                gx = (x - ox) // cell; gy = (y - oy) // cell
                if HEART[gy][gx] == 'X':
                    c = hi if (gx == 1 and gy <= 1) or (gx == 2 and gy == 1) else fg
            raw.extend(c)
    def chunk(t, d):
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    data = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)) \
        + chunk(b'IDAT', zlib.compress(bytes(raw), 9)) + chunk(b'IEND', b'')
    with open(path, 'wb') as f:
        f.write(data)

out = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
os.makedirs(out, exist_ok=True)
png(os.path.join(out, 'icon-192.png'), 192, 0.12)
png(os.path.join(out, 'icon-512.png'), 512, 0.12)
png(os.path.join(out, 'icon-maskable-512.png'), 512, 0.22)
png(os.path.join(out, 'apple-touch-icon.png'), 180, 0.14)
print('ikon dibuat di', os.path.abspath(out))
