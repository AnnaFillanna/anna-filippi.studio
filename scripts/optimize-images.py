"""Offline image derivatives. Requires Pillow with WebP; no application dependency.
Run with the existing manifest, or --sources JSON_ARRAY for first generation.
Originals are never modified. ICC profiles and alpha are preserved.
"""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'src/data/image-variants.json'
parser = argparse.ArgumentParser()
parser.add_argument('--sources', type=Path)
args = parser.parse_args()
sources = json.loads(args.sources.read_text()) if args.sources else list(json.loads(MANIFEST.read_text()))
output = ROOT / 'public/images/optimized'
output.mkdir(exist_ok=True)
manifest = {}
for source in sorted(sources):
    original = ROOT / ('public' + source)
    digest = hashlib.sha256(original.read_bytes()).hexdigest()[:12]
    with Image.open(original) as opened:
        icc = opened.info.get('icc_profile')
        image = ImageOps.exif_transpose(opened)
        if image.mode not in ('RGB', 'RGBA'):
            image = image.convert('RGBA' if 'A' in image.getbands() else 'RGB')
        w, h = image.size
        # The aligned hero alpha mask is already tiny; preserve it byte-for-byte.
        if 'mask-alpha' in source:
            variants = [{'src': source, 'width': w, 'height': h, 'bytes': original.stat().st_size}]
        else:
            widths = sorted(set([min(w, size) for size in (320, 640, 960, 1280, 1600, 1920)]))
            variants = []
            for width in widths:
                height = round(h * width / w)
                resized = image if width == w else image.resize((width, height), Image.Resampling.LANCZOS)
                file = output / f'{digest}-{width}.webp'
                options = dict(format='WEBP', quality=92, method=6, exact=True)
                # UI text and existing WebP originals should not suffer another lossy encode.
                if '/projects/' in source or original.suffix == '.webp':
                    options['lossless'] = True
                if icc:
                    options['icc_profile'] = icc
                resized.save(file, **options)
                path = '/images/optimized/' + file.name
                if width == w and file.stat().st_size >= original.stat().st_size:
                    path = source  # No bandwidth regression for already efficient originals.
                variants.append({'src': path, 'width': width, 'height': height,
                                 'bytes': (ROOT / ('public' + path)).stat().st_size})
        manifest[source] = {'width': w, 'height': h, 'originalBytes': original.stat().st_size,
                            'format': opened.format, 'variants': variants}
MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(f'Generated responsive sets for {len(manifest)} sources')
for source, data in manifest.items():
    v = data['variants'][-1]
    if v['bytes'] > 500_000: print('Quality-first exception:', source, v['bytes'])
