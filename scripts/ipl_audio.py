"""Soundtrack for the LAZERHALL IPL Black Friday ad: the original calm beauty
track from blackfriday_audio.py (84 BPM) with a few soft SFX, no voiceover.

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

SFX_EVENTS = [
    (0.1, bf.sfx_whoosh(0.6, 300, 5000, 0.3), 1.0),
    (0.6, bf.sfx_pop(), 0.6),
    (1.36, bf.sfx_bass_hit(), 0.8),
    (4.15, bf.sfx_whoosh(0.5, 300, 4000, 0.22), 1.0),
    (9.9, bf.sfx_whoosh(0.5, 300, 4000, 0.18), 1.0),
    (17.05, bf.sfx_whoosh(0.5, 300, 4000, 0.2), 1.0),
    (17.9, bf.sfx_whoosh(0.6, 350, 4500, 0.16), 1.0),
    (20.04, bf.sfx_whoosh(0.6, 350, 4500, 0.16), 1.0),
    (22.18, bf.sfx_whoosh(0.6, 350, 4500, 0.16), 1.0),
    (24.32, bf.sfx_whoosh(0.6, 350, 4500, 0.16), 1.0),
    (25.6, bf.sfx_whoosh(0.5, 300, 4000, 0.22), 1.0),
    (27.14, bf.sfx_pop(), 0.45),
    (27.5, bf.sfx_pop(), 0.45),
    (27.86, bf.sfx_pop(), 0.45),
    (28.21, bf.sfx_pop(), 0.45),
    (29.22, bf.sfx_shimmer(), 0.9),
    (31.33, bf.sfx_whoosh(0.5, 300, 4000, 0.22), 1.0),
    (33.0, bf.sfx_pop(), 0.8),
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
