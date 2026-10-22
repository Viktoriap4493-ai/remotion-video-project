"""Original music bed + sound effects for the OBABKO DENT ad.

Everything here is synthesized from scratch (no samples, no third-party
material), so the audio carries no outside licence obligations.

Usage:  python3 scripts/obabko/generate_audio.py
Writes: public/obabko/audio/music.wav and public/obabko/audio/sfx/*.wav
"""

import os
import wave

import numpy as np

SR = 44100
BPM = 120  # every scene boundary (3.5 / 7 / 11 / 15 / 19 s) lands on a beat
BEAT = 60 / BPM
DURATION = 25.0

ROOT = os.path.join(os.path.dirname(__file__), "..", "..", "public", "obabko", "audio")
rng = np.random.default_rng(7)


def write_wav(path, data):
    data = np.clip(data, -1, 1)
    if data.ndim == 1:
        data = np.stack([data, data], axis=1)
    pcm = (data * 32767).astype("<i2")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def t_axis(seconds):
    return np.arange(int(seconds * SR)) / SR


def lowpass(x, cutoff):
    """One-pole low-pass; cutoff may be a scalar or a per-sample array."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(buf, clip, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    end = min(len(buf), i + len(clip))
    buf[i:end] += clip[: end - i] * gain


# ---------------------------------------------------------------- instruments


def kick(soft=False):
    t = t_axis(0.42)
    f = 46 + 110 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (9 if soft else 7))
    click = rng.standard_normal(len(t)) * np.exp(-t * 400) * 0.15
    return np.tanh((body + click) * 1.6) * 0.9


def clap():
    t = t_axis(0.25)
    n = rng.standard_normal(len(t))
    env = np.zeros_like(t)
    for off in (0, 0.011, 0.022):
        env += np.where(t >= off, np.exp(-(t - off) * 60), 0)
    env += np.exp(-t * 18) * 0.35
    return highpass(lowpass(n * env, 3200), 900) * 0.55


def hat(open_=False):
    t = t_axis(0.22 if open_ else 0.05)
    n = highpass(rng.standard_normal(len(t)), 7000)
    return n * np.exp(-t * (14 if open_ else 90)) * (0.22 if open_ else 0.16)


def bass_note(freq, length):
    t = t_axis(length)
    x = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * freq * 2 * t)
    env = np.minimum(1, t / 0.008) * np.exp(-t * 3.2)
    return np.tanh(x * 1.3) * env * 0.5


def pad_chord(notes, length):
    t = t_axis(length)
    x = np.zeros_like(t)
    for n in notes:
        for det in (-0.12, 0.0, 0.12):
            f = midi(n + det)
            # soft saw: a few harmonics only
            for h in range(1, 6):
                x += np.sin(2 * np.pi * f * h * t + rng.uniform(0, 6.28)) / (h * 1.6)
    att = np.minimum(1, t / 0.35)
    rel = np.minimum(1, (length - t) / 0.4)
    return x * att * np.clip(rel, 0, 1) / (len(notes) * 9)


def stab(notes):
    t = t_axis(0.32)
    x = np.zeros_like(t)
    for n in notes:
        f = midi(n)
        for h in range(1, 7):
            x += np.sin(2 * np.pi * f * h * t) / h
    x = lowpass(x, 1400 + 3000 * np.exp(-t * 18))
    return x * np.exp(-t * 11) / len(notes) * 0.35


def pluck(n):
    t = t_axis(0.5)
    f = midi(n)
    x = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    return x * np.exp(-t * 9) * 0.12


def simple_reverb(x, mix=0.25):
    out = x.copy()
    for d, g in ((0.031, 0.5), (0.047, 0.45), (0.071, 0.4), (0.113, 0.33), (0.167, 0.27), (0.241, 0.2), (0.337, 0.14)):
        k = int(d * SR)
        out[k:] += x[:-k] * g * mix
    return lowpass(out, 6000)


# ------------------------------------------------------------------- arrangement

# A minor, warm and positive: Am9 - Fmaj7 - Cmaj7 - G6, one bar (2 s) each
PROG = [
    ([57, 60, 64, 67, 71], 45),  # Am9
    ([53, 57, 60, 64], 41),  # Fmaj7
    ([48, 55, 59, 64], 48),  # Cmaj7
    ([55, 59, 62, 64], 43),  # G6
]
BAR = BEAT * 4


def chord_at(time):
    return PROG[int(time // BAR) % len(PROG)]


def music():
    n = int(DURATION * SR)
    drums = np.zeros(n)
    bass = np.zeros(n)
    pads = np.zeros(n)
    keys = np.zeros(n)
    fx = np.zeros(n)

    # Pads all the way through
    bar = 0.0
    while bar < DURATION:
        notes, _ = chord_at(bar)
        place(pads, pad_chord(notes, BAR + 0.4), bar)
        bar += BAR

    beats = np.arange(0, DURATION, BEAT)
    for b in beats:
        notes, root = chord_at(b)
        # Intro (0-3.5 s): plucked arpeggio only, groove waits for the reveal
        if b < 3.5:
            for k, sub in enumerate((0, 0.5)):
                place(keys, pluck(notes[(int(b / BEAT) * 2 + k) % len(notes)] + 12), b + sub * BEAT)
            continue
        main = 3.5 <= b < 19.0
        if main:
            place(drums, kick(), b)
            place(drums, hat(), b + BEAT / 2)
            if int(round(b / BEAT)) % 2 == 1:
                place(drums, clap(), b)
            if b >= 11.0:
                place(drums, hat(True), b + BEAT / 2, 0.8)
            if b >= 7.0:
                place(drums, hat(), b + BEAT * 0.25, 0.5)
            # Deep-house off-beat bass
            place(bass, bass_note(midi(root), BEAT * 0.45), b + BEAT / 2)
            # Chord stabs on the "and" of 2 and 4
            if int(round(b / BEAT)) % 2 == 1:
                place(keys, stab([x + 12 for x in notes[:4]]), b + BEAT * 0.5)
        else:
            # End card: calmer, soft kick on bar starts only, plucks
            if b < 23.0 and abs((b / BEAT) % 4) < 1e-6:
                place(drums, kick(soft=True), b, 0.55)
            if b < 24.0:
                place(keys, pluck(notes[int(b / BEAT) % len(notes)] + 12), b, 0.9)
            if b < 21.0:
                place(bass, bass_note(midi(root), BEAT * 1.6), b, 0.6 if b % BAR < 1e-6 else 0)

    # Risers into the reveal (3.5 s) and into the end card (19 s)
    for start, end, gain in ((2.3, 3.5, 0.18), (17.9, 19.0, 0.16)):
        t = t_axis(end - start)
        nz = rng.standard_normal(len(t))
        swept = lowpass(nz, 300 + 6000 * (t / t[-1]) ** 2)
        place(fx, swept * (t / t[-1]) ** 2 * gain * 2.4, start)
    # Impact at the first beat of the main groove and of the end card
    for at, g in ((3.5, 0.6), (19.0, 0.45)):
        t = t_axis(1.2)
        boom = np.sin(2 * np.pi * (40 + 30 * np.exp(-t * 8)) * t) * np.exp(-t * 3.5)
        place(fx, boom, at, g)

    mix = drums * 0.85 + bass * 0.9 + simple_reverb(pads, 0.4) * 0.8 + simple_reverb(keys, 0.35) * 0.9 + fx

    # Sidechain-style pump against the kick in the main section
    t = np.arange(n) / SR
    phase = (t % BEAT) / BEAT
    pump = np.where((t >= 3.5) & (t < 19.0), 0.55 + 0.45 * np.minimum(1, phase * 3.2), 1.0)
    mix = drums * 0.85 + (mix - drums * 0.85) * pump

    # Gentle fade in / long fade out so nothing is cut abruptly
    fade_in = np.minimum(1, t / 0.25)
    fade_out = np.clip((DURATION - t) / 2.6, 0, 1) ** 1.5
    mix = mix * fade_in * fade_out

    mix = np.tanh(mix * 1.2)
    mix /= np.max(np.abs(mix)) / 0.82

    # Light stereo width: delay the pad-heavy side slightly on the right
    right = np.concatenate([np.zeros(int(0.009 * SR)), mix])[: len(mix)]
    stereo = np.stack([mix * 0.97 + right * 0.03, mix * 0.85 + right * 0.15], axis=1)
    return stereo


# ------------------------------------------------------------------- sfx


def sfx_click():
    t = t_axis(0.06)
    tone = np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 160)
    nz = highpass(rng.standard_normal(len(t)), 2500) * np.exp(-t * 300) * 0.4
    return (tone + nz) * 0.5


def sfx_mouse_click():
    t = t_axis(0.09)
    a = highpass(rng.standard_normal(len(t)), 1800) * np.exp(-t * 420)
    b = np.zeros_like(t)
    k = int(0.045 * SR)
    b[k:] = highpass(rng.standard_normal(len(t) - k), 1500) * np.exp(-t[: len(t) - k] * 380) * 0.6
    body = np.sin(2 * np.pi * 1100 * t) * np.exp(-t * 250) * 0.4
    return (a + b + body) * 0.55


def sfx_whoosh(length=0.3):
    t = t_axis(length)
    nz = rng.standard_normal(len(t))
    env = np.sin(np.pi * t / length) ** 2
    cutoff = 400 + 5000 * np.sin(np.pi * t / length)
    return highpass(lowpass(nz, cutoff), 150) * env * 0.5


def sfx_pop():
    t = t_axis(0.14)
    f = 300 + 700 * np.exp(-t * 40)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30) * 0.6


def sfx_boing():
    t = t_axis(0.35)
    f = 220 + 90 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 6)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 0.35


def sfx_bass():
    t = t_axis(0.6)
    return np.tanh(np.sin(2 * np.pi * (48 + 40 * np.exp(-t * 20)) * t) * 1.5) * np.exp(-t * 6) * 0.7


def sfx_confirm():
    t = t_axis(0.5)
    a = np.sin(2 * np.pi * 880 * t) * np.exp(-t * 10)
    b = np.where(t > 0.08, np.sin(2 * np.pi * 1318.5 * t) * np.exp(-(t - 0.08) * 8), 0)
    return (a * 0.6 + b * 0.5) * 0.35


def sfx_riser(length=0.45):
    t = t_axis(length)
    nz = lowpass(rng.standard_normal(len(t)), 300 + 5000 * (t / length) ** 2)
    tone = np.sin(2 * np.pi * np.cumsum(300 + 900 * (t / length) ** 2) / SR) * 0.15
    return (nz + tone) * (t / length) ** 2 * 0.45


def main():
    write_wav(os.path.join(ROOT, "music.wav"), music())
    effects = {
        "click": sfx_click(),
        "mouse-click": sfx_mouse_click(),
        "whoosh": sfx_whoosh(0.3),
        "whoosh-short": sfx_whoosh(0.2),
        "pop": sfx_pop(),
        "boing": sfx_boing(),
        "bass": sfx_bass(),
        "confirm": sfx_confirm(),
        "riser": sfx_riser(),
    }
    for name, data in effects.items():
        fade = np.minimum(1, (len(data) - np.arange(len(data))) / (0.005 * SR))
        write_wav(os.path.join(ROOT, "sfx", f"{name}.wav"), data * fade)
    print("audio written to", os.path.abspath(ROOT))


if __name__ == "__main__":
    main()
