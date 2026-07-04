from PIL import Image, ImageDraw
import math

BG = (232, 255, 90, 255)  # #e8ff5a
FG = (10, 10, 10, 255)    # #0a0a0a

def rounded_square(size, corner_ratio):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    r = int(size * corner_ratio)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=BG)
    return img, draw

def thick_line(draw, x1, y1, x2, y2, width, fill):
    draw.line([x1, y1, x2, y2], fill=fill, width=width)
    r = width / 2
    draw.ellipse([x1 - r, y1 - r, x1 + r, y1 + r], fill=fill)
    draw.ellipse([x2 - r, y2 - r, x2 + r, y2 + r], fill=fill)

def draw_dumbbell(draw, cx, cy, scale):
    # Simplified dumbbell: two square "weight" clusters connected by a bar,
    # diagonal like the lucide dumbbell glyph used elsewhere in the app.
    w = 2.6 * scale   # weight plate half-size
    bar_half = 5.0 * scale
    lw = max(2, int(1.6 * scale))

    ang = math.radians(-45)
    dx, dy = math.cos(ang), math.sin(ang)

    # central bar
    thick_line(draw, cx - bar_half * dx, cy - bar_half * dy,
                      cx + bar_half * dx, cy + bar_half * dy, lw, FG)

    # weight clusters at each end (small squares offset perpendicular to the bar)
    perp_x, perp_y = -dy, dx
    for sign in (-1, 1):
        ex, ey = cx + sign * bar_half * dx, cy + sign * bar_half * dy
        for off in (-1, 1):
            ox, oy = ex + off * w * perp_x * 0.9, ey + off * w * perp_y * 0.9
            half = w
            draw.rounded_rectangle(
                [ox - half, oy - half, ox + half, oy + half],
                radius=half * 0.4, fill=FG
            )

def make_icon(size, corner_ratio, path):
    img, draw = rounded_square(size, corner_ratio)
    draw_dumbbell(draw, size / 2, size / 2, size / 24)
    img.save(path)

make_icon(512, 0.2237, "public/icon-512.png")
make_icon(192, 0.2237, "public/icon-192.png")
make_icon(180, 0.2237, "public/apple-touch-icon.png")
make_icon(32, 0.2237, "public/favicon-32.png")
print("done")
