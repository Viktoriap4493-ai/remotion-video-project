"""Soundtrack for the LAZERHALL IPL Black Friday ad: the original calm beauty
track from blackfriday_audio.py (84 BPM) with paper and mouse-click SFX, no voiceover.

Usage: python3 -I scripts/ipl_audio.py <out.wav>
Event times must match src/ipl/IplAd.tsx.
"""
import os
import sys
import wave

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import blackfriday_audio as bf  # noqa: E402

DURATION = 36.43
bf.DURATION = DURATION
SR = bf.SR

rng = np.random.default_rng(11)


def sfx_paper(seconds=0.45, gain=0.5, bright=1.0):
    """Paper swish: a filtered noise sweep with random crinkle grains on top."""
    t = bf.t_axis(seconds)
    n = len(t)
    noise = rng.standard_normal(n)
    body = bf.fft_band(noise, 900, 6500 * bright)
    env = np.sin(np.pi * np.clip(t / seconds, 0, 1)) ** 1.5
    crinkle = np.zeros(n)
    for _ in range(int(seconds * 90)):
        i0 = rng.integers(0, max(1, n - 400))
        g = np.exp(-np.arange(400) / rng.uniform(25, 90)) * rng.uniform(0.3, 1.0)
        crinkle[i0 : i0 + 400] += g * rng.choice((-1, 1))
    crinkle = bf.fft_band(crinkle * rng.standard_normal(n), 1500, 9000 * bright)
    out = body * env * 0.55 + crinkle * env * 0.9
    return out / (np.abs(out).max() + 1e-9) * gain


def sfx_click(gain=0.55):
    """Mouse click: a sharp press transient followed by a softer release."""
    n = int(0.09 * SR)
    out = np.zeros(n)
    for t0, amp, f, decay in ((0.0, 1.0, 3200, 0.0016), (0.052, 0.6, 4200, 0.0012)):
        i0 = int(t0 * SR)
        k = np.arange(int(0.03 * SR))
        burst = np.exp(-k / (SR * decay)) * (0.55 * rng.uniform(-1, 1, len(k)) + 0.45 * np.sin(2 * np.pi * f * k / SR))
        out[i0 : i0 + len(k)] += amp * burst[: n - i0]
    return out / np.abs(out).max() * gain


# Paper on transitions and before/after wipes, mouse clicks on every pop-in.
SFX_EVENTS = [
    (0.08, sfx_paper(0.5, 0.45), 1.0),  # Black Friday badge slides in
    (0.53, sfx_click(), 1.0),  # SALE tag
    (1.38, sfx_click(0.75), 1.0),  # "-50%"
    (1.46, sfx_click(0.5), 1.0),  # double click for weight
    (4.12, sfx_paper(0.5, 0.4), 1.0),
    (9.85, sfx_paper(0.5, 0.35), 1.0),
    (10.07, sfx_click(0.4), 1.0),  # benefit lines
    (11.5, sfx_click(0.4), 1.0),
    (12.93, sfx_click(0.4), 1.0),
    (14.36, sfx_click(0.4), 1.0),
    (15.79, sfx_click(0.4), 1.0),
    (17.0, sfx_paper(0.5, 0.4), 1.0),
    (17.85, sfx_paper(0.6, 0.38, 0.8), 1.0),  # wipes
    (19.99, sfx_paper(0.6, 0.38, 0.8), 1.0),
    (22.13, sfx_paper(0.6, 0.38, 0.8), 1.0),
    (24.27, sfx_paper(0.6, 0.38, 0.8), 1.0),
    (25.55, sfx_paper(0.5, 0.4), 1.0),
    (27.14, sfx_click(0.45), 1.0),  # four session cards
    (27.5, sfx_click(0.45), 1.0),
    (27.86, sfx_click(0.45), 1.0),
    (28.21, sfx_click(0.45), 1.0),
    (28.55, sfx_paper(0.35, 0.35), 1.0),  # cards gather
    (29.29, sfx_click(0.7), 1.0),  # price
    (31.28, sfx_paper(0.5, 0.4), 1.0),
    (33.0, sfx_click(0.65), 1.0),  # ЗАПИСАТИСЯ
]


def main(out_path):
    n = int(DURATION * SR)
    music = bf.build_music()[:, :n]
    fade_in = np.ones(n)
    fade_in[: int(0.3 * SR)] = np.linspace(0, 1, int(0.3 * SR))
    fade_out = np.ones(n)
    fo = int(2.5 * SR)
    fade_out[-fo:] = np.linspace(1, 0, fo) ** 1.5
    mix = music * fade_in * fade_out * 0.55
    for at, clip, gain in SFX_EVENTS:
        i0 = int(at * SR)
        seg = slice(i0, min(n, i0 + len(clip)))
        mix[:, seg] += clip[: seg.stop - seg.start] * gain
    peak = np.abs(mix).max()
    if peak > 0.89:
        mix *= 0.89 / peak
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(mix.T, -1, 1) * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    main(sys.argv[1])
