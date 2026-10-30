"""Create size-limited WebP delivery copies; preserve all original files and alpha.
Requires Pillow. Run from any directory with python3 .site/scripts/images.py.
No generative retouching, invented scene content, upscaling or face alteration.
"""
from pathlib import Path
from PIL import Image, ImageOps

project = Path(__file__).resolve().parents[1]
source = project / 'materials'
output = project / 'public/assets/images'
output.mkdir(parents=True, exist_ok=True)
images = [
    ('imagem capa do primeiro bloco.png', 'mansao', [1200, 1672]),
    ('foto do enegenheiro.png', 'engenheiro-frente', [600, 900]),
    ('foto do enegenheiro1.png', 'engenheiro-projeto', [600, 900]),
    ('fachada da vilela engenharia.png', 'escritorio', [800]),
    ('portfolio1.png', 'comercial-1', [960, 1440]),
    ('portfolio2.png', 'comercial-2', [960, 1440]),
    ('projeto1.png', 'residencial-1', [None]),
    ('projeto3.png', 'residencial-2', [None]),
]
for original, name, widths in images:
    with Image.open(source / original) as im:
        im = ImageOps.exif_transpose(im)
        for width in widths:
            result = im.copy()
            if width:
                result.thumbnail((width, 4000), Image.Resampling.LANCZOS)
            filename = f'{name}-{width}.webp' if width else f'{name}.webp'
            result.save(output / filename, 'WEBP', quality=86, method=6)
            print(filename, result.size, (output / filename).stat().st_size)
