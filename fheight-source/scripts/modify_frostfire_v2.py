#!/usr/bin/env python3
"""
FHEIGHT Frostfire Background Modifier v2
Creates a unique variation of the login screen by applying
DIFFERENT transformations to each layer for a cohesive but distinct look.

Strategy:
- Background: Flip + shift to "dawn" colors (cooler, more purple/cyan)
- Pillars Far: NO flip, enhance cyan tones
- Pillars Near: Flip (bird moves to left), warm highlights
- Foreground: NO flip (character stays facing same direction), warmer tones

This creates a mirror-world effect where some elements are flipped
but not others, making it feel like a new scene.
"""

from PIL import Image, ImageEnhance, ImageFilter
import colorsys
import os
import numpy as np

# Paths
SCENES_DIR = r"C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\dist\src\resources\scenes\frostfire"
BACKUP_DIR = r"C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\backup_originals\scenes\frostfire"


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


def adjust_color_temperature(image, temperature):
    """
    Adjust color temperature.
    temperature > 0: warmer (more orange/red)
    temperature < 0: cooler (more blue/cyan)
    """
    if image.mode == 'RGBA':
        r, g, b, a = image.split()
    elif image.mode == 'RGB':
        r, g, b = image.split()
        a = None
    else:
        image = image.convert('RGB')
        r, g, b = image.split()
        a = None

    # Adjust red and blue channels based on temperature
    if temperature > 0:
        # Warmer: increase red, decrease blue
        r = r.point(lambda x: min(255, int(x * (1 + temperature * 0.3))))
        b = b.point(lambda x: max(0, int(x * (1 - temperature * 0.2))))
    else:
        # Cooler: decrease red, increase blue
        temp = abs(temperature)
        r = r.point(lambda x: max(0, int(x * (1 - temp * 0.2))))
        b = b.point(lambda x: min(255, int(x * (1 + temp * 0.3))))

    if a is not None:
        return Image.merge('RGBA', (r, g, b, a))
    return Image.merge('RGB', (r, g, b))


def add_color_overlay(image, color, opacity):
    """Add a color overlay with given opacity (0-1)."""
    if image.mode != 'RGBA':
        image = image.convert('RGBA')

    overlay = Image.new('RGBA', image.size, color + (int(255 * opacity),))
    return Image.alpha_composite(image, overlay)


def modify_background(input_path, output_path):
    """
    Background transformation:
    - Flip horizontal (city moves from left to right)
    - Shift to "dawn" colors (cooler, more purple/cyan sky)
    - Slight contrast boost
    """
    print(f"  [BACKGROUND] {os.path.basename(input_path)}")

    img = Image.open(input_path)

    # 1. Flip horizontal - city goes to other side
    print("    - Flipping horizontal")
    img = img.transpose(Image.FLIP_LEFT_RIGHT)

    # 2. Shift hue towards purple/cyan (away from orange)
    print("    - Shifting to dawn colors (hue -0.08)")
    img = shift_hue(img, -0.08)  # Shift towards cooler colors

    # 3. Cool down the temperature
    print("    - Cooling temperature")
    img = adjust_color_temperature(img, -0.3)

    # 4. Boost saturation slightly
    print("    - Saturation boost")
    if img.mode == 'RGBA':
        r, g, b, a = img.split()
        rgb_img = Image.merge('RGB', (r, g, b))
        enhancer = ImageEnhance.Color(rgb_img)
        rgb_img = enhancer.enhance(1.15)
        img = Image.merge('RGBA', (*rgb_img.split(), a))
    else:
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.15)

    # Save
    if output_path.lower().endswith(('.jpg', '.jpeg')):
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        img.save(output_path, 'JPEG', quality=95)
    else:
        img.save(output_path, 'PNG', optimize=True)

    print("    [OK] Saved")


def modify_pillars_far(input_path, output_path):
    """
    Pillars Far transformation:
    - NO flip (keep original orientation)
    - Enhance cyan/teal tones
    - Slight brightness reduction for depth
    """
    print(f"  [PILLARS_FAR] {os.path.basename(input_path)}")

    img = Image.open(input_path)

    # 1. NO flip - keep original
    print("    - Keeping original orientation")

    # 2. Shift slightly towards cyan
    print("    - Enhancing cyan tones (hue +0.03)")
    img = shift_hue(img, 0.03)

    # 3. Cool temperature slightly
    print("    - Slight cool adjustment")
    img = adjust_color_temperature(img, -0.15)

    # Save
    img.save(output_path, 'PNG', optimize=True)
    print("    [OK] Saved")


def modify_pillars_near(input_path, output_path):
    """
    Pillars Near transformation:
    - Flip horizontal (bird statue moves to left side)
    - Add warm edge lighting effect
    - Slightly more saturated
    """
    print(f"  [PILLARS_NEAR] {os.path.basename(input_path)}")

    img = Image.open(input_path)

    # 1. Flip horizontal - bird goes to left
    print("    - Flipping horizontal (bird to left)")
    img = img.transpose(Image.FLIP_LEFT_RIGHT)

    # 2. Slight hue shift for variety
    print("    - Slight hue variation (+0.02)")
    img = shift_hue(img, 0.02)

    # 3. Warm up slightly (like catching sunset light)
    print("    - Adding warm highlights")
    img = adjust_color_temperature(img, 0.1)

    # 4. Boost saturation
    print("    - Saturation boost")
    if img.mode == 'RGBA':
        r, g, b, a = img.split()
        rgb_img = Image.merge('RGB', (r, g, b))
        enhancer = ImageEnhance.Color(rgb_img)
        rgb_img = enhancer.enhance(1.1)
        img = Image.merge('RGBA', (*rgb_img.split(), a))

    # Save
    img.save(output_path, 'PNG', optimize=True)
    print("    [OK] Saved")


def modify_foreground(input_path, output_path):
    """
    Foreground transformation:
    - NO flip (character keeps facing same direction)
    - Warmer tones (catching light from new sun position)
    - Slightly more contrast
    """
    print(f"  [FOREGROUND] {os.path.basename(input_path)}")

    img = Image.open(input_path)

    # 1. NO flip - character keeps original direction
    print("    - Keeping character direction")

    # 2. Warm up (character catching warm light)
    print("    - Warming tones")
    img = adjust_color_temperature(img, 0.2)

    # 3. Slight hue shift
    print("    - Subtle hue shift (+0.01)")
    img = shift_hue(img, 0.01)

    # 4. Boost contrast slightly
    print("    - Contrast boost")
    if img.mode == 'RGBA':
        r, g, b, a = img.split()
        rgb_img = Image.merge('RGB', (r, g, b))
        enhancer = ImageEnhance.Contrast(rgb_img)
        rgb_img = enhancer.enhance(1.08)
        img = Image.merge('RGBA', (*rgb_img.split(), a))

    # Save
    img.save(output_path, 'PNG', optimize=True)
    print("    [OK] Saved")


def copy_unchanged(input_path, output_path):
    """Copy file without modifications."""
    print(f"  [COPY] {os.path.basename(input_path)}")
    img = Image.open(input_path)
    if output_path.lower().endswith(('.jpg', '.jpeg')):
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        img.save(output_path, 'JPEG', quality=95)
    else:
        img.save(output_path, 'PNG', optimize=True)
    print("    [OK] Copied")


def main():
    print("=" * 60)
    print("FHEIGHT Frostfire Modifier v2 - Smart Layer Transformation")
    print("=" * 60)
    print()
    print("Strategy:")
    print("  - Background: FLIP + cool dawn colors")
    print("  - Pillars Far: NO flip, cyan enhancement")
    print("  - Pillars Near: FLIP, warm highlights")
    print("  - Foreground: NO flip, warm tones")
    print("  - Vignette: Unchanged")
    print()

    # Define transformations for each file
    transformations = {
        "background.jpg": modify_background,
        "background@2x.jpg": modify_background,
        "pillars_far.png": modify_pillars_far,
        "pillars_far@2x.png": modify_pillars_far,
        "pillars_near.png": modify_pillars_near,
        "pillars_near@2x.png": modify_pillars_near,
        "foreground.png": modify_foreground,
        "foreground@2x.png": modify_foreground,
        "vignette.png": copy_unchanged,  # Vignette stays the same
    }

    for filename, transform_func in transformations.items():
        input_path = os.path.join(BACKUP_DIR, filename)
        output_path = os.path.join(SCENES_DIR, filename)

        if not os.path.exists(input_path):
            print(f"  [SKIP] Not found: {filename}")
            continue

        transform_func(input_path, output_path)
        print()

    # Copy lantern files unchanged (particle effects)
    lantern_files = [
        "lantern_large_1.png", "lantern_large_2.png", "lantern_large_3.png",
        "lantern_small.png", "lanterns_large_1.plist", "lanterns_large_2.plist",
        "lanterns_large_3.plist", "lanterns_small.plist", "stars.plist"
    ]

    print("Copying particle/lantern files...")
    for filename in lantern_files:
        input_path = os.path.join(BACKUP_DIR, filename)
        output_path = os.path.join(SCENES_DIR, filename)
        if os.path.exists(input_path):
            import shutil
            shutil.copy2(input_path, output_path)
            print(f"  [OK] {filename}")

    print()
    print("=" * 60)
    print("[DONE] Frostfire transformed!")
    print()
    print("Changes made:")
    print("  - Background flipped + cooler 'dawn' colors")
    print("  - Far pillars: enhanced cyan, original position")
    print("  - Near pillars: flipped (bird on left), warm highlights")
    print("  - Foreground: warmer tones, original position")
    print("=" * 60)


if __name__ == "__main__":
    main()
