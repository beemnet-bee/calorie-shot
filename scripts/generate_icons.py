#!/usr/bin/env python3
"""Generate PNG icons (192x192 and 512x512) for CalorieShot PWA installability."""
from PIL import Image, ImageDraw
import os
import math

OUTPUT_DIR = "/home/z/my-project/public"

def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

# Brand colors
BG_DARK = hex_to_rgb("#0A0F1F")       # Deep navy
BG_MID = hex_to_rgb("#1E3A8A")        # Mid blue
BRAND_1 = hex_to_rgb("#2563EB")       # Cobalt
BRAND_2 = hex_to_rgb("#3B82F6")       # Electric blue
BRAND_3 = hex_to_rgb("#06B6D4")       # Cyan
WHITE = (255, 255, 255)

def draw_gradient_circle(draw, cx, cy, r, color_inner, color_outer):
    """Draw a radial gradient circle."""
    for i in range(r, 0, -1):
        t = 1.0 - (i / r)
        rgb = tuple(int(color_inner[j] * (1-t) + color_outer[j] * t) for j in range(3))
        draw.ellipse([cx-i, cy-i, cx+i, cy+i], fill=rgb)

def draw_gradient_ring(draw, cx, cy, r_outer, r_inner, color1, color2, color3):
    """Draw a ring with 3-stop gradient (going around)."""
    steps = 360
    for i in range(steps):
        t = i / steps
        if t < 0.5:
            tt = t * 2
            rgb = tuple(int(color1[j] * (1-tt) + color2[j] * tt) for j in range(3))
        else:
            tt = (t - 0.5) * 2
            rgb = tuple(int(color2[j] * (1-tt) + color3[j] * tt) for j in range(3))
        # Draw a small pie slice
        angle_start = i * (360 / steps) - 90
        angle_end = (i + 1) * (360 / steps) - 90
        # Pie slice won't work for rings, so draw thick segments
        # Use a thick arc
        draw.arc(
            [cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer],
            start=angle_start,
            end=angle_end + 0.5,
            fill=rgb,
            width=max(2, r_outer - r_inner),
        )

def generate_icon(size):
    """Generate a single icon at given size."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded square background — diagonal gradient
    radius = int(size * 0.22)  # 22% corner radius for very rounded
    # Draw gradient background by drawing many horizontal lines
    for y in range(size):
        t = y / size
        # diagonal: combine y and slight x influence
        rgb = tuple(int(BG_DARK[j] * (1-t) + BG_MID[j] * t) for j in range(3))
        draw.line([(0, y), (size, y)], fill=rgb)

    # Apply rounded corner mask
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, size-1, size-1], radius=radius, fill=255)
    img.putalpha(mask)

    # Re-draw on top with mask applied via compositing
    bg_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg_img)
    # Fill rounded rect with gradient
    for y in range(size):
        t = (y / size) ** 0.9
        rgb = tuple(int(BG_DARK[j] * (1-t) + BG_MID[j] * t) for j in range(3))
        bg_draw.line([(0, y), (size, y)], fill=rgb + (255,))
    # Apply rounded mask
    bg_img.putalpha(mask)
    img = Image.alpha_composite(Image.new("RGBA", (size, size), (0,0,0,0)), bg_img)
    draw = ImageDraw.Draw(img)

    cx, cy = size // 2, int(size * 0.42)
    r_outer = int(size * 0.235)
    r_inner = int(size * 0.118)
    ring_width = max(6, int(size * 0.039))

    # Draw the gradient ring (aperture)
    steps = 180
    for i in range(steps):
        t = i / steps
        if t < 0.5:
            tt = t * 2
            rgb = tuple(int(BRAND_1[j] * (1-tt) + BRAND_2[j] * tt) for j in range(3))
        else:
            tt = (t - 0.5) * 2
            rgb = tuple(int(BRAND_2[j] * (1-tt) + BRAND_3[j] * tt) for j in range(3))
        angle_start = i * (360 / steps) - 90
        angle_end = (i + 1) * (360 / steps) - 90 + 0.5
        draw.arc(
            [cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer],
            start=angle_start,
            end=angle_end,
            fill=rgb + (255,),
            width=ring_width,
        )

    # Inner solid dot — radial gradient (cyan center to cobalt edge)
    for i in range(r_inner, 0, -1):
        t = 1.0 - (i / r_inner)
        rgb = tuple(int(BRAND_3[j] * (1-t) + BRAND_1[j] * t) for j in range(3))
        draw.ellipse([cx-i, cy-i, cx+i, cy+i], fill=rgb + (255,))

    # Aperture blades — 4 triangles pointing into center, drawn in background color
    blade_len = r_outer - ring_width // 2
    blade_w = max(3, int(size * 0.065))
    # Top blade
    draw.polygon(
        [(cx, cy - blade_len), (cx + blade_w, cy - blade_len // 3), (cx - blade_w, cy - blade_len // 3)],
        fill=BG_DARK + (255,),
    )
    # Bottom blade
    draw.polygon(
        [(cx, cy + blade_len), (cx + blade_w, cy + blade_len // 3), (cx - blade_w, cy + blade_len // 3)],
        fill=BG_DARK + (255,),
    )
    # Right blade
    draw.polygon(
        [(cx + blade_len, cy), (cx + blade_len // 3, cy + blade_w), (cx + blade_len // 3, cy - blade_w)],
        fill=BG_DARK + (255,),
    )
    # Left blade
    draw.polygon(
        [(cx - blade_len, cy), (cx - blade_len // 3, cy + blade_w), (cx - blade_len // 3, cy - blade_w)],
        fill=BG_DARK + (255,),
    )

    # Wordmark text at the bottom — "CalorieShot"
    # Use system default font, scaled to icon size
    try:
        from PIL import ImageFont
        font_size = max(10, int(size * 0.085))
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()
    except:
        font = None

    # Draw text — gradient effect simulated by drawing in cyan-blue
    text = "CalorieShot"
    text_color = BRAND_2
    text_y = int(size * 0.78)
    try:
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        text_x = (size - text_w) // 2
        draw.text((text_x, text_y - text_h // 2), text, fill=text_color + (255,), font=font)
    except:
        pass

    return img

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for size in [192, 512]:
        icon = generate_icon(size)
        out_path = os.path.join(OUTPUT_DIR, f"icon-{size}.png")
        icon.save(out_path, "PNG", optimize=True)
        print(f"Saved {out_path} ({size}x{size})")

    # Also generate apple-touch-icon (180x180)
    apple_icon = generate_icon(180)
    apple_icon.save(os.path.join(OUTPUT_DIR, "apple-touch-icon.png"), "PNG", optimize=True)
    print("Saved apple-touch-icon.png (180x180)")

    # Also favicon 32x32 (simple version)
    favicon = generate_icon(32)
    favicon.save(os.path.join(OUTPUT_DIR, "icon-32.png"), "PNG", optimize=True)
    print("Saved icon-32.png (32x32)")

if __name__ == "__main__":
    main()
