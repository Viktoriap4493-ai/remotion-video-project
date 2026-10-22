"""Cut the supplied tooth mascot into animation layers (a simple 2D rig).

Input : the supplied render (transparent PNG/WebP), path as argv[1]
Output: public/obabko/mascot/*.png + rig.json

Layers
  body.png        whole character, arms (outside the body) removed, left
                  (winking) eye painted out so it can be animated
  arm-left.png    hand-on-hip arm, pivots at the shoulder
  arm-right.png   thumbs-up arm, pivots at the shoulder
  eye-r-g{n}.png  right eye, iris moved for gaze n
  eye-l-*.png     left eye: open (per gaze), closing steps, original closed art

The source is a single still in which the left eye is already closed. The
open left eye is rebuilt from the right eye (mirrored lids/lashes, same iris),
so the wink can go open → closed → open with the original closed-eye art.
"""

import json
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), "..", "..", "public", "obabko", "mascot")
PREVIEW = sys.argv[2] if len(sys.argv) > 2 else None

im = np.asarray(Image.open(SRC).convert("RGBA")).astype(np.float32)
H, W = im.shape[:2]


def poly_mask(points, feather=0.0):
    m = Image.new("L", (W, H), 0)
    ImageDraw.Draw(m).polygon(points, fill=255)
    if feather:
        m = m.filter(ImageFilter.GaussianBlur(feather))
    return np.asarray(m).astype(np.float32) / 255


def save_layer(name, rgba, pad=4):
    a = rgba[..., 3]
    ys, xs = np.nonzero(a > 1)
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, W)
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, H)
    crop = np.clip(rgba[y0:y1, x0:x1], 0, 255).astype(np.uint8)
    Image.fromarray(crop, "RGBA").save(os.path.join(OUT, f"{name}.png"), optimize=True)
    return {"x": int(x0), "y": int(y0), "w": int(x1 - x0), "h": int(y1 - y0)}


os.makedirs(OUT, exist_ok=True)
rig = {"width": W, "height": H, "layers": {}}

# ------------------------------------------------------------------ arms
# Outer parts follow the body contour; the arm layers reach ~12-20 px into
# the body (soft edge) so nothing gaps open when they rotate a few degrees.
ARM_R_OUT = [(1068, 430), (1012, 612), (990, 680), (975, 725), (982, 765), (1010, 800), (1268, 845), (1268, 430)]
ARM_R_LAYER = [(1066, 430), (1040, 540), (998, 612), (972, 680), (960, 725), (968, 765), (1005, 805), (1268, 845), (1268, 430)]
ARM_L_OUT = [(90, 600), (245, 605), (300, 650), (340, 722), (375, 790), (395, 845), (392, 900), (368, 945), (345, 970), (90, 970)]
ARM_L_LAYER = [(90, 590), (250, 598), (330, 615), (362, 700), (392, 790), (410, 845), (408, 915), (380, 960), (350, 975), (90, 975)]

arm_r_out = cv2.dilate(poly_mask(ARM_R_OUT), np.ones((5, 5), np.uint8))
arm_l_out = poly_mask(ARM_L_OUT)
arm_r = poly_mask(ARM_R_LAYER, 4)
arm_l = poly_mask(ARM_L_LAYER, 4)

body = im.copy()
body[..., 3] *= 1 - np.maximum(arm_r_out, arm_l_out)

for name, mask, pivot in (("arm-right", arm_r, (1000, 690)), ("arm-left", arm_l, (335, 690))):
    layer = im.copy()
    layer[..., 3] *= mask
    box = save_layer(name, layer)
    box["pivot"] = {"x": pivot[0], "y": pivot[1]}
    rig["layers"][name] = box

# ------------------------------------------------------------------ eyes
lum = im[..., :3].mean(axis=2)


def inpaint(rgba, mask):
    """Fill `mask` (bool) with surrounding skin."""
    rgb = rgba[..., :3].astype(np.uint8)[..., ::-1].copy()
    m = (mask * 255).astype(np.uint8)
    out = cv2.inpaint(rgb, m, 9, cv2.INPAINT_TELEA)[..., ::-1].astype(np.float32)
    res = rgba.copy()
    res[..., :3] = out
    return res


# Right eye geometry (source px)
R_OPEN = [(806, 478), (812, 440), (830, 405), (858, 384), (895, 377), (930, 388), (952, 412), (962, 445), (963, 480), (958, 507), (930, 518), (880, 527), (840, 529), (815, 518)]
R_IRIS = (856, 463, 50, 68)  # cx, cy, rx, ry
R_BOX = (790, 314, 1010, 545)

# Left (closed) eye: area to paint out and the original closed-eye art
L_CLOSED_BOX = (398, 462, 668, 566)

ys, xs = np.mgrid[0:H, 0:W]


def ellipse_mask(cx, cy, rx, ry):
    return (((xs - cx) / rx) ** 2 + ((ys - cy) / ry) ** 2) <= 1


r_open = poly_mask(R_OPEN) > 0.5
r_iris = ellipse_mask(*R_IRIS) & r_open

# Sclera plate: bright white with soft shading under the upper lid
sclera_col = np.array([246, 243, 241], np.float32)


def sclera_plate(open_mask, top_curve_y):
    plate = np.zeros_like(im)
    plate[..., :3] = sclera_col
    depth = np.clip((ys - top_curve_y) / 30.0, 0, 1)
    shade = 0.80 + 0.20 * depth
    plate[..., :3] *= shade[..., None]
    plate[..., 3] = open_mask * 255
    return plate


def upper_curve(points):
    """y of the upper lid edge for every column (interpolated)."""
    pts = sorted(points, key=lambda p: p[0])
    top = {}
    for x, y in points:
        top[x] = min(y, top.get(x, 1e9))
    xs_ = np.array(sorted(top))
    ys_ = np.array([top[x] for x in xs_])
    return np.interp(np.arange(W), xs_, ys_)


r_top = upper_curve([p for p in R_OPEN if p[1] < 470])
r_top_img = r_top[None, :].repeat(H, 0)


def composite(base, layer):
    a = layer[..., 3:4] / 255
    out = base.copy()
    out[..., :3] = base[..., :3] * (1 - a) + layer[..., :3] * a
    out[..., 3] = np.maximum(base[..., 3], layer[..., 3])
    return out


def shift(arr, dx, dy):
    M = np.float32([[1, 0, dx], [0, 1, dy]])
    return cv2.warpAffine(arr, M, (W, H), flags=cv2.INTER_LINEAR, borderValue=0)


iris_layer = im.copy()
iris_layer[..., 3] = ellipse_mask(*R_IRIS) * 255
iris_layer[..., 3] = cv2.GaussianBlur(iris_layer[..., 3], (0, 0), 0.8)

GAZES = [(0, 0), (-6, 9)]  # 0: at the viewer, 1: toward the headline (down-left)
rig["gazes"] = GAZES

bx0, by0, bx1, by1 = R_BOX
for gi, (dx, dy) in enumerate(GAZES):
    plate = sclera_plate(r_open, r_top_img)
    moved = shift(iris_layer, dx, dy)
    moved[..., 3] *= r_open
    eye = composite(plate, moved)
    # Re-apply the original lid lines/lashes on top (dark pixels outside the opening)
    lids = im.copy()
    lids[..., 3] = (~r_open) * 255
    eye = composite(eye, lids)
    region = np.zeros((H, W), np.float32)
    region[by0:by1, bx0:bx1] = 1
    eye[..., 3] = np.where(r_open, 255, 0) * region
    # soften the edge into the lid line
    eye[..., 3] = cv2.GaussianBlur(eye[..., 3], (0, 0), 0.7) * r_open + 0
    rig["layers"][f"eye-r-g{gi}"] = save_layer(f"eye-r-g{gi}", eye)

# --- left eye: paint out the closed art from the body
lx0, ly0, lx1, ly1 = L_CLOSED_BOX
closed_region = np.zeros((H, W), bool)
closed_region[ly0:ly1, lx0:lx1] = True
lash_pixels = closed_region & (lum < 215)
lash_pixels = cv2.dilate(lash_pixels.astype(np.uint8), np.ones((7, 7), np.uint8)).astype(bool)
body = inpaint(body, lash_pixels)

closed_art = im.copy()
closed_alpha = np.zeros((H, W), np.float32)
closed_alpha[lash_pixels] = 255
closed_art[..., 3] = cv2.GaussianBlur(closed_alpha, (0, 0), 1.2)
rig["layers"]["eye-l-closed"] = save_layer("eye-l-closed", closed_art)

# --- left eye open: mirror the right eye's lids/lashes, keep iris orientation
L_SCALE = 0.9
L_ANGLE = 12  # degrees, follows the face's turn
L_CENTER = (548, 538)  # where the opening's centre goes
r_center = (885, 455)


def place_mirrored(layer):
    flipped = layer[:, ::-1].copy()
    fcx = W - 1 - r_center[0]
    M = cv2.getRotationMatrix2D((fcx, r_center[1]), L_ANGLE, L_SCALE)
    M[0, 2] += L_CENTER[0] - fcx
    M[1, 2] += L_CENTER[1] - r_center[1]
    return cv2.warpAffine(flipped, M, (W, H), flags=cv2.INTER_LINEAR, borderValue=0)


def place_iris(layer):
    # same transform for position, but not mirrored (keeps the highlight side)
    M = cv2.getRotationMatrix2D(r_center, L_ANGLE * 0, L_SCALE)
    # mirror the iris *position* inside the opening so both eyes look the same way
    M[0, 2] += L_CENTER[0] - r_center[0]
    M[1, 2] += L_CENTER[1] - r_center[1]
    return cv2.warpAffine(layer, M, (W, H), flags=cv2.INTER_LINEAR, borderValue=0)


r_patch = np.zeros((H, W), np.float32)
r_patch[by0:by1, bx0:bx1] = 1
lids_r = im.copy()
lids_r[..., 3] = r_patch * (~r_open) * (lum < 205) * 255
lids_r[..., 3] = cv2.GaussianBlur(lids_r[..., 3], (0, 0), 0.8)
open_r = np.zeros((H, W, 4), np.float32)
open_r[..., 3] = r_open * 255

l_lids = place_mirrored(lids_r)
l_open = place_mirrored(open_r)[..., 3] / 255 > 0.5
# round off the corners left by the mirrored patch
l_open = cv2.GaussianBlur(l_open.astype(np.float32), (0, 0), 6) > 0.5
_y, _x = np.nonzero(l_open)
# taper the inner corner (the mirrored side was straight where the iris used to cut it)
l_open &= ellipse_mask((_x.min() + _x.max()) / 2 - 8, (_y.min() + _y.max()) / 2, (_x.max() - _x.min()) * 0.56, (_y.max() - _y.min()) * 0.62)
l_top = upper_curve([(int(x), int(y)) for y, x in zip(*np.nonzero(l_open))][::1]) if False else None

# per-column top of the left opening
cols = np.where(l_open.any(0))[0]
l_top_cols = np.full(W, H, np.float32)
for c in cols:
    l_top_cols[c] = np.argmax(l_open[:, c])
l_top_img = l_top_cols[None, :].repeat(H, 0)
l_bottom_cols = np.full(W, 0, np.float32)
for c in cols:
    l_bottom_cols[c] = H - 1 - np.argmax(l_open[::-1, c])

_o = l_open.astype(np.uint8)
l_ring = (cv2.dilate(_o, np.ones((3, 3), np.uint8)) - cv2.erode(_o, np.ones((3, 3), np.uint8))).astype(np.float32) * 255

# Iris for the left eye: same art, sits at the same relative spot (looks the same way)
rel_x = (R_IRIS[0] - r_center[0]) * L_SCALE
l_iris_c = (L_CENTER[0] + rel_x - 8, L_CENTER[1] + (R_IRIS[1] - r_center[1]) * L_SCALE)

skin = body.copy()  # painted-out skin under the eye


def left_eye(gaze, openness):
    """openness 1 = fully open, 0 = lid down to the lower lash line."""
    dx, dy = gaze
    eye = np.zeros_like(im)
    plate = sclera_plate(l_open, l_top_img)
    eye = composite(eye, plate)
    il = shift(iris_layer, l_iris_c[0] - R_IRIS[0] + dx, l_iris_c[1] - R_IRIS[1] + dy)
    il[..., 3] *= l_open
    eye = composite(eye, il)
    # Thin lid outline around the opening (the mirrored inner corner has none)
    ring = np.zeros_like(im)
    ring[..., :3] = (52, 30, 24)
    ring[..., 3] = cv2.GaussianBlur(l_ring, (0, 0), 0.8) * 0.6
    # Lid comes down: skin covers the opening above the lid edge
    travel = (l_bottom_cols - l_top_cols) * (1 - openness) * 0.92
    lid_edge = (l_top_cols + travel)[None, :].repeat(H, 0)
    lid_skin = skin.copy()
    lid_skin[..., 3] = ((ys < lid_edge) & l_open) * 255
    eye = composite(eye, lid_skin)
    ring[..., 3] *= ys > lid_edge + 4
    eye = composite(eye, ring)
    eye[..., 3] = np.maximum(eye[..., 3], 0)
    eye[..., 3] = np.maximum(np.where(l_open, 255, 0).astype(np.float32), ring[..., 3])
    # lids + lashes ride down with the lid edge, flattening a little
    drop = float(np.median(travel[cols]))
    lids = shift(l_lids, 0, drop)
    if openness < 1:
        sy = 1 - 0.35 * (1 - openness)
        cy = L_CENTER[1] + drop
        M = np.float32([[1, 0, 0], [0, sy, cy * (1 - sy)]])
        lids = cv2.warpAffine(lids, M, (W, H), flags=cv2.INTER_LINEAR, borderValue=0)
    # keep the lower lash line (bottom part of the mirrored lids) in place
    lower = l_lids.copy()
    lower[..., 3] *= (ys > (L_CENTER[1] + 25))
    eye = composite(eye, lower)
    eye = composite(eye, lids)
    eye[..., 3] = np.maximum(eye[..., 3], lids[..., 3])
    eye[..., 3] = np.maximum(eye[..., 3], lower[..., 3])
    return eye


rig["layers"]["eye-l-open-g0"] = save_layer("eye-l-open-g0", left_eye(GAZES[0], 1.0))
rig["layers"]["eye-l-open-g1"] = save_layer("eye-l-open-g1", left_eye(GAZES[1], 1.0))
for k, o in enumerate((0.6, 0.25)):
    rig["layers"][f"eye-l-close{k}"] = save_layer(f"eye-l-close{k}", left_eye(GAZES[0], o))

rig["layers"]["body"] = save_layer("body", body)

with open(os.path.join(OUT, "rig.json"), "w") as f:
    json.dump(rig, f, indent=2)
TS = os.path.join(os.path.dirname(__file__), "..", "..", "src", "obabko", "mascotRig.ts")
with open(TS, "w") as f:
    f.write("// Generated by scripts/obabko/build_mascot_rig.py — do not edit by hand.\n")
    f.write("export const MASCOT_RIG = " + json.dumps(rig, indent=2) + " as const;\n")

if PREVIEW:
    def comp(names):
        canvas = Image.new("RGBA", (W, H), (245, 245, 244, 255))
        for n in names:
            L = rig["layers"][n]
            canvas.alpha_composite(Image.open(os.path.join(OUT, f"{n}.png")), (L["x"], L["y"]))
        return canvas.convert("RGB")

    base = ["body", "arm-left", "arm-right", "eye-r-g0"]
    shots = [
        comp(base + ["eye-l-open-g0"]),
        comp(base[:-1] + ["eye-r-g1", "eye-l-open-g1"]),
        comp(base + ["eye-l-close0"]),
        comp(base + ["eye-l-close1"]),
        comp(base + ["eye-l-closed"]),
    ]
    crop = (330, 230, 1050, 680)
    tiles = [s.crop(crop) for s in shots]
    sheet = Image.new("RGB", (tiles[0].width * 3, tiles[0].height * 2), "white")
    for i, t in enumerate(tiles):
        sheet.paste(t, ((i % 3) * t.width, (i // 3) * t.height))
    sheet.save(PREVIEW)
    comp(["body"]).save(PREVIEW.replace(".jpg", "-body.jpg"))
print("rig written to", os.path.abspath(OUT))
