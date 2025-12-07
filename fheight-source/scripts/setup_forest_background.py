#!/usr/bin/env python3
"""
Setup Digital Moons Forest Background for Frostfire Scene
Combines 10 layers into 4 layers matching Frostfire structure.
"""

from PIL import Image
import os

# Paths
SOURCE_DIR = r"C:\Users\Farukest-Working\Downloads\Parallax Forest Background (Seamless)\Parallax Forest Background (Seamless)\Parallax Forest Background - Blue"
TARGET_DIR = r"C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\dist\src\resources\scenes\frostfire"
BACKUP_DIR = r"C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\backup_originals\scenes\frostfire"

def combine_layers(layer_files, output_size=None):
    """Combine multiple PNG layers into one, preserving transparency."""
    if not layer_files:
        return None

    # Start with first layer
    base = Image.open(layer_files[0]).convert('RGBA')

    if output_size:
        base = base.resize(output_size, Image.LANCZOS)

    # Composite remaining layers on top
    for layer_file in layer_files[1:]:
        layer = Image.open(layer_file).convert('RGBA')
        if output_size:
            layer = layer.resize(output_size, Image.LANCZOS)
        base = Image.alpha_composite(base, layer)

    return base


def main():
    print("=" * 60)
    print("Setting up Digital Moons Forest Background")
    print("=" * 60)
    print()

    # Source layers (back to front):
    # 10_Sky.png      - Sky (furthest back)
    # 09_Forest.png   - Far trees
    # 08_Forest.png   - Far trees 2
    # 07_Forest.png   - Mid trees
    # 06_Forest.png   - Mid trees 2
    # 05_Particles.png - Mid particles
    # 04_Forest.png   - Near trees
    # 03_Particles.png - Near particles
    # 02_Bushes.png   - Front bushes
    # 01_Mist.png     - Front mist (closest)

    # Target size (same as original Frostfire)
    target_size = (1600, 900)  # Standard HD
    target_size_2x = (3200, 1800)  # 2x version

    layer_files = {
        'sky': os.path.join(SOURCE_DIR, '10_Sky.png'),
        'forest_09': os.path.join(SOURCE_DIR, '09_Forest.png'),
        'forest_08': os.path.join(SOURCE_DIR, '08_Forest.png'),
        'forest_07': os.path.join(SOURCE_DIR, '07_Forest.png'),
        'forest_06': os.path.join(SOURCE_DIR, '06_Forest.png'),
        'particles_05': os.path.join(SOURCE_DIR, '05_Particles.png'),
        'forest_04': os.path.join(SOURCE_DIR, '04_Forest.png'),
        'particles_03': os.path.join(SOURCE_DIR, '03_Particles.png'),
        'bushes': os.path.join(SOURCE_DIR, '02_Bushes.png'),
        'mist': os.path.join(SOURCE_DIR, '01_Mist.png'),
    }

    # Check all files exist
    for name, path in layer_files.items():
        if not os.path.exists(path):
            print(f"[ERROR] Missing: {name} at {path}")
            return

    print("All source layers found!")
    print()

    # === CREATE BACKGROUND (sky + far forests) ===
    print("[1/4] Creating background.jpg...")
    bg_layers = [
        layer_files['sky'],
        layer_files['forest_09'],
        layer_files['forest_08'],
        layer_files['forest_07'],
    ]
    background = combine_layers(bg_layers, target_size)
    # Convert to RGB for JPEG
    background_rgb = Image.new('RGB', background.size, (200, 230, 240))  # Light blue fallback
    background_rgb.paste(background, mask=background.split()[3] if background.mode == 'RGBA' else None)
    background_rgb.save(os.path.join(TARGET_DIR, 'background.jpg'), 'JPEG', quality=95)
    print("    [OK] background.jpg saved")

    # 2x version
    background_2x = combine_layers(bg_layers, target_size_2x)
    background_2x_rgb = Image.new('RGB', background_2x.size, (200, 230, 240))
    background_2x_rgb.paste(background_2x, mask=background_2x.split()[3] if background_2x.mode == 'RGBA' else None)
    background_2x_rgb.save(os.path.join(TARGET_DIR, 'background@2x.jpg'), 'JPEG', quality=95)
    print("    [OK] background@2x.jpg saved")

    # === CREATE PILLARS_FAR (mid forest layer) ===
    print("[2/4] Creating pillars_far.png...")
    pillars_far_layers = [
        layer_files['forest_06'],
    ]
    pillars_far = combine_layers(pillars_far_layers, target_size)
    pillars_far.save(os.path.join(TARGET_DIR, 'pillars_far.png'), 'PNG', optimize=True)
    print("    [OK] pillars_far.png saved")

    pillars_far_2x = combine_layers(pillars_far_layers, target_size_2x)
    pillars_far_2x.save(os.path.join(TARGET_DIR, 'pillars_far@2x.png'), 'PNG', optimize=True)
    print("    [OK] pillars_far@2x.png saved")

    # === CREATE PILLARS_NEAR (near forest + particles) ===
    print("[3/4] Creating pillars_near.png...")
    pillars_near_layers = [
        layer_files['particles_05'],
        layer_files['forest_04'],
    ]
    pillars_near = combine_layers(pillars_near_layers, target_size)
    pillars_near.save(os.path.join(TARGET_DIR, 'pillars_near.png'), 'PNG', optimize=True)
    print("    [OK] pillars_near.png saved")

    pillars_near_2x = combine_layers(pillars_near_layers, target_size_2x)
    pillars_near_2x.save(os.path.join(TARGET_DIR, 'pillars_near@2x.png'), 'PNG', optimize=True)
    print("    [OK] pillars_near@2x.png saved")

    # === CREATE FOREGROUND (front bushes + mist) ===
    print("[4/4] Creating foreground.png...")
    foreground_layers = [
        layer_files['particles_03'],
        layer_files['bushes'],
        layer_files['mist'],
    ]
    foreground = combine_layers(foreground_layers, target_size)
    foreground.save(os.path.join(TARGET_DIR, 'foreground.png'), 'PNG', optimize=True)
    print("    [OK] foreground.png saved")

    foreground_2x = combine_layers(foreground_layers, target_size_2x)
    foreground_2x.save(os.path.join(TARGET_DIR, 'foreground@2x.png'), 'PNG', optimize=True)
    print("    [OK] foreground@2x.png saved")

    # Keep original vignette (just copy from backup)
    print()
    print("Keeping original vignette.png...")
    vignette_src = os.path.join(BACKUP_DIR, 'vignette.png')
    if os.path.exists(vignette_src):
        import shutil
        shutil.copy2(vignette_src, os.path.join(TARGET_DIR, 'vignette.png'))
        print("    [OK] vignette.png copied")

    print()
    print("=" * 60)
    print("[DONE] Forest background setup complete!")
    print()
    print("Layer mapping:")
    print("  background.jpg  <- Sky + Forest 09/08/07")
    print("  pillars_far.png <- Forest 06")
    print("  pillars_near.png <- Particles 05 + Forest 04")
    print("  foreground.png  <- Particles 03 + Bushes + Mist")
    print()
    print("Refresh browser to see new login screen!")
    print("=" * 60)


if __name__ == "__main__":
    main()
