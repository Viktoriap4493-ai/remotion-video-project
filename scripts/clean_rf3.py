"""Prepares the "3рф" reference footage for the SMAS-lifting adaptation.

Its text is burned into the video and static, so each frame is processed:
  * the old procedure title and the "-45%" line are inpainted away (new text
    is set on top in Remotion);
  * violet icons, the call-to-action line and the arrow are hue-shifted to
    blue, keeping their lightness, so the design keeps its contrast.
The price pill and the date plate are covered by redrawn plates in Remotion.

Usage: python3 -I scripts/clean_rf3.py <in.mp4> <out.mp4>
Boxes are in the source's 720x1280 coordinates.
"""
import subprocess
import sys

import cv2
import numpy as np

W, H = 720, 1280
# (x0, y0, x1, y1)
INPAINT_BOXES = [(36, 142, 690, 262), (176, 1052, 546, 1094)]
RECOLOR_BOXES = [(70, 900, 112, 1012), (380, 900, 422, 1010), (158, 1096, 562, 1128), (344, 1144, 376, 1180)]
BLUE_HUE = 112  # OpenCV hue (0-179) of #051D5E


def build_masks(median):
    hsv = cv2.cvtColor(median, cv2.COLOR_RGB2HSV)
    lum = median.mean(2)
    violet = (hsv[..., 0] > 115) & (hsv[..., 0] < 170) & (hsv[..., 1] > 20)
    inpaint = np.zeros((H, W), np.uint8)
    for x0, y0, x1, y1 in INPAINT_BOXES:
        text = (lum[y0:y1, x0:x1] > 105) | violet[y0:y1, x0:x1]
        inpaint[y0:y1, x0:x1] = text.astype(np.uint8) * 255
    inpaint = cv2.dilate(inpaint, np.ones((7, 7), np.uint8))
    recolor = np.zeros((H, W), bool)
    for x0, y0, x1, y1 in RECOLOR_BOXES:
        recolor[y0:y1, x0:x1] = True
    return inpaint, recolor


def main(src, dst):
    frames = np.frombuffer(
        subprocess.run(
            ["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
            capture_output=True,
            check=True,
        ).stdout,
        np.uint8,
    ).reshape(-1, H, W, 3)
    median = np.median(frames[::4], axis=0).astype(np.uint8)
    inpaint_mask, recolor_box = build_masks(median)
    enc = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "30",
         "-i", "-", "-c:v", "libx264", "-crf", "12", "-preset", "slow", "-pix_fmt", "yuv420p", dst],
        stdin=subprocess.PIPE,
    )
    for frame in frames:
        out = cv2.inpaint(frame, inpaint_mask, 6, cv2.INPAINT_TELEA)
        hsv = cv2.cvtColor(out, cv2.COLOR_RGB2HSV)
        violet = recolor_box & (hsv[..., 0] > 115) & (hsv[..., 0] < 170) & (hsv[..., 1] > 15)
        hsv[..., 0][violet] = BLUE_HUE
        out = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
        enc.stdin.write(out.tobytes())
    enc.stdin.close()
    enc.wait()


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
