from PIL import Image, ImageDraw, ImageFont
import math

W, H = 1200, 630
BG = (10, 10, 10, 255)       # #0a0a0a
ACCENT = (232, 255, 90, 255)  # #e8ff5a
FG = (10, 10, 10, 255)

img = Image.new("RGBA", (W, H), BG)
draw = ImageDraw.Draw(img)

# Subtle radial-ish glow behind the icon using concentric translucent circles
cx, cy = 260, H // 2
for r, alpha in [(260, 10), (200, 16), (150, 22)]:
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(232, 255, 90, alpha))
    img = Image.alpha_composite(img, glow)
draw = ImageDraw.Draw(img)

# App icon (rounded square + dumbbell), reusing the same glyph as the app icons
icon_size = 220
icon_x, icon_y = cx - icon_size // 2, cy - icon_size // 2
r = int(icon_size * 0.2237)
draw.rounded_rectangle([icon_x, icon_y, icon_x + icon_size, icon_y + icon_size], radius=r, fill=ACCENT)

def thick_line(draw, x1, y1, x2, y2, width, fill):
    draw.line([x1, y1, x2, y2], fill=fill, width=width)
    rr = width / 2
    draw.ellipse([x1 - rr, y1 - rr, x1 + rr, y1 + rr], fill=fill)
    draw.ellipse([x2 - rr, y2 - rr, x2 + rr, y2 + rr], fill=fill)

def draw_dumbbell(draw, cx, cy, scale):
    w = 2.6 * scale
    bar_half = 5.0 * scale
    lw = max(2, int(1.6 * scale))
    ang = math.radians(-45)
    dx, dy = math.cos(ang), math.sin(ang)
    thick_line(draw, cx - bar_half * dx, cy - bar_half * dy,
                      cx + bar_half * dx, cy + bar_half * dy, lw, FG)
    perp_x, perp_y = -dy, dx
    for sign in (-1, 1):
        ex, ey = cx + sign * bar_half * dx, cy + sign * bar_half * dy
        for off in (-1, 1):
            ox, oy = ex + off * w * perp_x * 0.9, ey + off * w * perp_y * 0.9
            half = w
            draw.rounded_rectangle([ox - half, oy - half, ox + half, oy + half], radius=half * 0.4, fill=FG)

draw_dumbbell(draw, cx, cy, icon_size / 24)

# Wordmark + tagline
FONT_DIR = "/System/Library/Fonts/Supplemental/"
title_font = ImageFont.truetype(FONT_DIR + "Arial Black.ttf", 108)
tagline_font = ImageFont.truetype(FONT_DIR + "Arial.ttf", 40)
sub_font = ImageFont.truetype(FONT_DIR + "Arial.ttf", 28)

text_x = 460
draw.text((text_x, 195), "Gainz", font=title_font, fill=(255, 255, 255, 255))
draw.text((text_x, 320), "Track. Progress. Dominate.", font=tagline_font, fill=ACCENT)
draw.text((text_x, 375), "Log your lifts, visualize your gains, and", font=sub_font, fill=(160, 160, 160, 255))
draw.text((text_x, 410), "build the perfect workout plan.", font=sub_font, fill=(160, 160, 160, 255))

img.convert("RGB").save("public/og-image.png", quality=95)
print("saved public/og-image.png", img.size)
