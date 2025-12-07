#!/usr/bin/env python3
"""
FHEIGHT Frostfire Background Modifier
Modifies the LOGIN screen backgrounds (Frostfire scene).
"""

from PIL import Image, ImageEnhance
import colorsys
import os

# Paths
SCENES_DIR = r"C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\dist\src\resources\scenes\frostfire"
BACKUP_DIR = r"C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\backup_originals\scenes\frostfire"

# Modification settings
HUE_SHIFT = 0.12  # Shift colors slightly (cyan/purple -> more green/teal)
SATURATION_MULT = 1.15  # More vibrant
BRIGHTNESS_MULT = 1.0
FLIP_HORIZONTAL = True


def shift_hue(image, amount):
    """Shift the hue of an image by a given amount (0-1)."""
    if image.mode == 'RGBA':
        r, g, b, a = image.split()
        rgb_image = Image.merge('RGB', (r, g, b))
    elif image.mode == 'RGB':
        rgb_image = image
        a = None
    else:
        rgb_image = image.convert('RGB')
        a = None

    pixels = rgb_image.load()
    width, height = rgb_image.size

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            r_norm, g_norm, b_norm = r / 255.0, g / 255.0, b / 255.0
            h, s, v = colorsys.rgb_to_hsv(r_norm, g_norm, b_norm)
            h = (h + amount) % 1.0
            r_new, g_new, b_new = colorsys.hsv_to_rgb(h, s, v)
            pixels[x, y] = (int(r_new * 255), int(g_new * 255), int(b_new * 255))

    if a is not None:
        return Image.merge('RGBA', (*rgb_image.split(), a))
    return rgb_image


def modify_image(input_path, output_path, hue_shift=0, saturation=1.0, brightness=1.0, flip=False):
    """Apply modifications to an image."""
    print(f"  Processing: {os.path.basename(input_path)}")

    img = Image.open(input_path)

    if hue_shift != 0:
        print(f"    - Hue shift: {hue_shift}")
        img = shift_hue(img, hue_shift)

    if saturation != 1.0:
        print(f"    - Saturation: {saturation}")
        if img.mode == 'RGBA':
            r, g, b, a = img.split()
            rgb_img = Image.merge('RGB', (r, g, b))
            enhancer = ImageEnhance.Color(rgb_img)
            rgb_img = enhancer.enhance(saturation)
            img = Image.merge('RGBA', (*rgb_img.split(), a))
        else:
            enhancer = ImageEnhance.Color(img)
            img = enhancer.enhance(saturation)

    if brightness != 1.0:
        print(f"    - Brightness: {brightness}")
        if img.mode == 'RGBA':
            r, g, b, a = img.split()
            rgb_img = Image.merge('RGB', (r, g, b))
            enhancer = ImageEnhance.Brightness(rgb_img)
            rgb_img = enhancer.enhance(brightness)
            img = Image.merge('RGBA', (*rgb_img.split(), a))
        else:
            enhancer = ImageEnhance.Brightness(img)
            img = enhancer.enhance(brightness)

    if flip:
        print(f"    - Flip horizontal")
        img = img.transpose(Image.FLIP_LEFT_RIGHT)

    if output_path.lower().endswith('.jpg') or output_path.lower().endswith('.jpeg'):
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        img.save(output_path, 'JPEG', quality=95)
    else:
        img.save(output_path, 'PNG', optimize=True)

    print(f"    [OK] Saved")


def main():
    print("=" * 60)
    print("FHEIGHT Frostfire (Login Screen) Modifier")
    print("=" * 60)
    print(f"\nSettings:")
    print(f"  Hue Shift: {HUE_SHIFT} ({int(HUE_SHIFT * 360)} deg)")
    print(f"  Saturation: {SATURATION_MULT}x")
    print(f"  Flip: {FLIP_HORIZONTAL}")
    print()

    # Main layer files
    files = [
        "background.jpg",
        "background@2x.jpg",
        "pillars_far.png",
        "pillars_far@2x.png",
        "pillars_near.png",
        "pillars_near@2x.png",
        "foreground.png",
        "foreground@2x.png",
        "vignette.png",  # No hue shift for vignette
    ]

    for filename in files:
        input_path = os.path.join(BACKUP_DIR, filename)
        output_path = os.path.join(SCENES_DIR, filename)

        if not os.path.exists(input_path):
            print(f"  [SKIP] Not found: {filename}")
            continue

        if 'vignette' in filename:
            modify_image(input_path, output_path,
                        hue_shift=0,
                        saturation=1.0,
                        brightness=1.0,
                        flip=FLIP_HORIZONTAL)
        else:
            modify_image(input_path, output_path,
                        hue_shift=HUE_SHIFT,
                        saturation=SATURATION_MULT,
                        brightness=BRIGHTNESS_MULT,
                        flip=FLIP_HORIZONTAL)

    print()
    print("=" * 60)
    print("[DONE] Frostfire login screen modified!")
    print("=" * 60)


if __name__ == "__main__":
    main()
