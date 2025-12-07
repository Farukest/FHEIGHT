#!/usr/bin/env python3
"""
FHEIGHT Background Modifier
Modifies the login screen backgrounds to create a unique look while maintaining quality.
"""

from PIL import Image, ImageEnhance, ImageFilter
import colorsys
import os

# Paths
SCENES_DIR = r"C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\dist\src\resources\scenes\magaari_ember_highlands"
BACKUP_DIR = r"C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\backup_originals\scenes\magaari_ember_highlands"

# Modification settings
HUE_SHIFT = 0.15  # 0-1, shifts color wheel (0.15 = ~54 degrees, cyan->purple)
SATURATION_MULT = 1.1  # Slightly more vibrant
BRIGHTNESS_MULT = 1.0  # Keep same
FLIP_HORIZONTAL = True  # Mirror the images


def shift_hue(image, amount):
    """Shift the hue of an image by a given amount (0-1)."""
    if image.mode == 'RGBA':
        # Handle transparency
        r, g, b, a = image.split()
        rgb_image = Image.merge('RGB', (r, g, b))
    elif image.mode == 'RGB':
        rgb_image = image
        a = None
    else:
        rgb_image = image.convert('RGB')
        a = None

    # Convert to HSV and shift hue
    pixels = rgb_image.load()
    width, height = rgb_image.size

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            # Normalize to 0-1
            r_norm, g_norm, b_norm = r / 255.0, g / 255.0, b / 255.0
            # Convert to HSV
            h, s, v = colorsys.rgb_to_hsv(r_norm, g_norm, b_norm)
            # Shift hue
            h = (h + amount) % 1.0
            # Convert back to RGB
            r_new, g_new, b_new = colorsys.hsv_to_rgb(h, s, v)
            # Denormalize
            pixels[x, y] = (int(r_new * 255), int(g_new * 255), int(b_new * 255))

    if a is not None:
        return Image.merge('RGBA', (*rgb_image.split(), a))
    return rgb_image


def modify_image(input_path, output_path, hue_shift=0, saturation=1.0, brightness=1.0, flip=False):
    """Apply modifications to an image."""
    print(f"  Processing: {os.path.basename(input_path)}")

    # Open image
    img = Image.open(input_path)
    original_mode = img.mode

    # Apply hue shift
    if hue_shift != 0:
        print(f"    - Applying hue shift: {hue_shift}")
        img = shift_hue(img, hue_shift)

    # Apply saturation
    if saturation != 1.0:
        print(f"    - Applying saturation: {saturation}")
        if img.mode == 'RGBA':
            r, g, b, a = img.split()
            rgb_img = Image.merge('RGB', (r, g, b))
            enhancer = ImageEnhance.Color(rgb_img)
            rgb_img = enhancer.enhance(saturation)
            img = Image.merge('RGBA', (*rgb_img.split(), a))
        else:
            enhancer = ImageEnhance.Color(img)
            img = enhancer.enhance(saturation)

    # Apply brightness
    if brightness != 1.0:
        print(f"    - Applying brightness: {brightness}")
        if img.mode == 'RGBA':
            r, g, b, a = img.split()
            rgb_img = Image.merge('RGB', (r, g, b))
            enhancer = ImageEnhance.Brightness(rgb_img)
            rgb_img = enhancer.enhance(brightness)
            img = Image.merge('RGBA', (*rgb_img.split(), a))
        else:
            enhancer = ImageEnhance.Brightness(img)
            img = enhancer.enhance(brightness)

    # Flip horizontally
    if flip:
        print(f"    - Flipping horizontally")
        img = img.transpose(Image.FLIP_LEFT_RIGHT)

    # Save
    if output_path.lower().endswith('.jpg') or output_path.lower().endswith('.jpeg'):
        # Convert to RGB for JPEG
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        img.save(output_path, 'JPEG', quality=95)
    else:
        img.save(output_path, 'PNG', optimize=True)

    print(f"    [OK] Saved: {os.path.basename(output_path)}")


def main():
    print("=" * 60)
    print("FHEIGHT Background Modifier")
    print("=" * 60)
    print(f"\nSettings:")
    print(f"  Hue Shift: {HUE_SHIFT} ({int(HUE_SHIFT * 360)} deg)")
    print(f"  Saturation: {SATURATION_MULT}x")
    print(f"  Brightness: {BRIGHTNESS_MULT}x")
    print(f"  Flip: {FLIP_HORIZONTAL}")
    print()

    # Files to modify
    files = [
        "magaari_ember_highlands_background.jpg",
        "magaari_ember_highlands_background@2x.jpg",
        "magaari_ember_highlands_middleground.png",
        "magaari_ember_highlands_middleground@2x.png",
        "magaari_ember_highlands_foreground.png",
        "magaari_ember_highlands_foreground@2x.png",
        "magaari_ember_highlands_trees_001.png",
        "magaari_ember_highlands_trees_001@2x.png",
        "magaari_ember_highlands_trees_002.png",
        "magaari_ember_highlands_trees_002@2x.png",
        "magaari_ember_highlands_light_ray.jpg",
        "magaari_ember_highlands_vignette.png",  # Keep vignette as-is (just flip if needed)
    ]

    for filename in files:
        input_path = os.path.join(BACKUP_DIR, filename)
        output_path = os.path.join(SCENES_DIR, filename)

        if not os.path.exists(input_path):
            print(f"  [SKIP] Not found: {filename}")
            continue

        # Don't shift hue on vignette (it's just darkening effect)
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
    print("[DONE] All modifications complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
