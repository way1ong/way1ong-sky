# Reads the place of the Sun and the scale of NASA's picture of the Milky Way from its annotated version.
#
#   python3 scripts/galaxy/measure.py <clean picture> <annotated picture>
#
# The clean picture is the largest file of the record PIA10748 of the NASA Image and Video Library; the
# annotated one is the "Annotated" file of https://science.nasa.gov/resource/the-milky-way-galaxy/ at
# 1600 px. What the annotation adds — the difference of the two — is a grid: circles round the Sun every
# 5,000 light-years and rays of galactic longitude. The numbers printed go to src/data/milky-way.json.
# Needs Pillow and numpy; nothing is fetched.
import sys

import numpy as np
from PIL import Image

clean = Image.open(sys.argv[1]).convert('L')
annotated = Image.open(sys.argv[2]).convert('L')
n = annotated.size[0]
a = np.asarray(clean.resize((n, n), Image.LANCZOS), dtype=float)
b = np.asarray(annotated, dtype=float)


def likeness(x, y):
    x = x - x.mean()
    y = y - y.mean()
    return float((x * y).sum() / np.sqrt((x * x).sum() * (y * y).sum()))


# The two versions have one frame: the best match is within a pixel of no shift.
m = 40
best = max((likeness(a[m:n - m, m:n - m], b[m + dy:n - m + dy, m + dx:n - m + dx]), dx, dy) for dy in range(-6, 7) for dx in range(-6, 7))
print('best match (likeness, shift x, shift y):', best)

added = np.clip(b - a, 0, None)
# The two axes through the Sun are the brightest whole row and column of the added lines.
rows = added[:, 100:n - 100].mean(axis=1)
cols = added[100:n - 100, :].mean(axis=0)
sun_y = int(np.argmax(rows[n // 2:])) + n // 2
sun_x = int(np.argmax(cols[n // 4:3 * n // 4])) + n // 4
print('frame', n, 'Sun at', sun_x, sun_y)

# The circles round the Sun: the added light, averaged over all directions, at each distance.
angles = np.deg2rad(np.arange(0, 360, 0.25))
profile = []
for r in range(20, 950):
    x = np.round(sun_x + r * np.sin(angles)).astype(int)
    y = np.round(sun_y - r * np.cos(angles)).astype(int)
    ok = (x >= 0) & (x < n) & (y >= 0) & (y < n)
    profile.append(added[y[ok], x[ok]].mean() if ok.sum() > 200 else 0)
profile = np.array(profile)
rings = [r + 20 for r in range(2, len(profile) - 2) if profile[r] == profile[r - 2:r + 3].max() and profile[r] > 2.5 * np.median(profile[max(0, r - 25):r + 25]) and profile[r] > 3]
print('circles at', rings)
print('one step', round((rings[-1] - rings[0]) / (len(rings) - 1), 2), 'px')

# The middle of the Galaxy is the brightest spot of the clean picture.
small = np.asarray(Image.fromarray(a.astype('uint8')).resize((n // 8, n // 8), Image.BOX), dtype=float)
y, x = np.unravel_index(np.argmax(small), small.shape)
print('brightest spot near', x * 8 + 4, y * 8 + 4, '->', sun_y - (y * 8 + 4), 'px above the Sun')
