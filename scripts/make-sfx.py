"""Synthesises the SFX library used by the LoadCombos ad.

Run: python3 scripts/make-sfx.py  (needs numpy)
Writes 44.1 kHz mono WAVs into public/ad2/sfx/. Every sound is generated from
noise/oscillators so the mix has no third-party licensing.
"""

import os
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "ad2", "sfx")
rng = np.random.default_rng(7)


def t(dur):
    return np.arange(int(dur * SR)) / SR


def noise(dur):
    return rng.uniform(-1, 1, int(dur * SR))


def brown(dur):
    b = np.cumsum(noise(dur))
    b -= np.convolve(b, np.ones(2000) / 2000, mode="same")
    return b / (np.abs(b).max() + 1e-9)


def lowpass(x, cutoff):
    """One-pole lowpass; cutoff may be a scalar or a per-sample array."""
    cutoff = np.broadcast_to(np.asarray(cutoff, float), x.shape)
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def bandpass(x, lo, hi):
    return highpass(lowpass(lowpass(x, hi), hi), lo)


def env(n, attack, release, curve=3.0):
    """Attack/exponential-release envelope over n samples."""
    e = np.ones(n)
    a = max(1, int(attack * SR))
    e[:a] = np.linspace(0, 1, a)
    r = n - a
    e[a:] = np.exp(-curve * np.linspace(0, 1, r)) * (1 - np.linspace(0, 1, r) ** 4)
    return e


def sine_sweep(dur, f0, f1, shape=2.0):
    tt = t(dur)
    f = f1 + (f0 - f1) * (1 - tt / dur) ** shape
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def reverb(x, size=0.6, mix=0.25):
    ir_t = t(size)
    ir = rng.normal(0, 1, len(ir_t)) * np.exp(-ir_t * 7 / size)
    ir = lowpass(ir, 5000)
    n = len(x) + len(ir)
    wet = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)
    wet /= np.abs(wet).max() + 1e-9
    dry = np.concatenate([x, np.zeros(len(ir))])
    return dry * (1 - mix) + wet * mix * np.abs(x).max()


def pad(x, dur):
    n = int(dur * SR)
    return np.concatenate([x, np.zeros(max(0, n - len(x)))])[:n] if dur else x


def write(name, x, peak=0.9):
    x = np.asarray(x, float)
    x = x / (np.abs(x).max() + 1e-9) * peak
    fade = min(len(x), 400)
    x[-fade:] *= np.linspace(1, 0, fade)
    data = (x * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"{name}.wav {len(x) / SR:.2f}s")


def whoosh(dur, f0, f1, peak_at=0.6):
    n = int(dur * SR)
    pos = np.linspace(0, 1, n)
    shape = np.where(pos < peak_at, (pos / peak_at) ** 2, ((1 - pos) / (1 - peak_at)) ** 1.6)
    cutoff = f0 + (f1 - f0) * shape
    x = highpass(lowpass(noise(dur), cutoff), 180)
    return reverb(x * shape, 0.4, 0.2)


def car_move(dur, engine_hz, seed_shift):
    """Tyre roll + low engine drone that decelerates and settles."""
    n = int(dur * SR)
    pos = np.linspace(0, 1, n)
    speed = (1 - pos) ** 1.4
    tyre = bandpass(noise(dur), 250, 1400 + 1800 * speed) * (0.25 + speed)
    rumble = lowpass(brown(dur), 160 + 140 * speed) * 1.6
    f = engine_hz * (0.75 + 0.5 * speed) + seed_shift
    drone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.35
    drone += np.sin(2 * np.pi * np.cumsum(f * 2.01) / SR) * 0.12
    shape = np.minimum(pos / 0.12, 1) * (0.25 + 0.75 * speed)
    return (tyre + rumble + drone) * shape


def thud(dur=0.3, f0=110, f1=45):
    x = sine_sweep(dur, f0, f1, 3) * env(int(dur * SR), 0.002, 1, 6)
    click = highpass(noise(0.012), 1500) * np.linspace(1, 0, int(0.012 * SR))
    return pad(click * 0.5, dur) + x


def tick(freq=2600, dur=0.035):
    tt = t(dur)
    return np.sin(2 * np.pi * freq * tt) * np.exp(-tt * 140) + highpass(
        noise(dur), 3000
    ) * np.exp(-tt * 400) * 0.4


def build():
    os.makedirs(OUT, exist_ok=True)

    write("whoosh-soft", whoosh(0.7, 300, 5200), 0.8)
    write("whoosh-fast", whoosh(0.38, 600, 7500, 0.5), 0.85)
    write("whoosh-deep", whoosh(0.9, 120, 2600, 0.7), 0.85)

    write("car-a", car_move(1.0, 62, 0), 0.8)
    write("car-b", car_move(1.0, 74, 3), 0.8)
    write("car-c", car_move(1.0, 54, -2), 0.8)

    write("card-thud", thud(0.3, 130, 50), 0.8)

    pen_d = 0.55
    tt = t(pen_d)
    strokes = 0.5 + 0.5 * np.sin(2 * np.pi * (7 + 5 * np.sin(2 * np.pi * 1.3 * tt)) * tt)
    pen = bandpass(noise(pen_d), 2500, 7000) * strokes * env(len(tt), 0.04, 1, 1.5)
    write("pen", pen, 0.6)

    write("tick", tick(), 0.7)
    ui = np.concatenate([tick(1800, 0.03), tick(3200, 0.04)])
    write("ui-click", ui, 0.7)

    d = 0.45
    punch = sine_sweep(d, 160, 42, 4) * env(int(d * SR), 0.001, 1, 5)
    punch += pad(lowpass(noise(0.05), 3000) * np.linspace(1, 0, int(0.05 * SR)), d) * 0.7
    write("punch", punch, 0.9)

    d = 1.4
    sub = sine_sweep(d, 75, 38, 2) * env(int(d * SR), 0.003, 1, 3.5)
    sub = np.tanh(sub * 2.2)
    bass = sub + pad(lowpass(noise(0.08), 1800) * np.linspace(1, 0, int(0.08 * SR)), d) * 0.6
    write("bass-hit", reverb(bass, 0.8, 0.18), 0.95)

    d = 1.1
    impact = sine_sweep(d, 140, 36, 4) * env(int(d * SR), 0.001, 1, 4)
    impact = np.tanh(impact * 1.8)
    impact += pad(bandpass(noise(0.18), 300, 6000) * env(int(0.18 * SR), 0.001, 1, 6), d) * 0.8
    write("impact-strong", reverb(impact, 1.0, 0.25), 0.95)

    # Mechanical counter spin: ticks that start dense and slow into the stop.
    d = 0.85
    x = np.zeros(int(d * SR))
    pos, gap = 0.0, 0.022
    while pos < d - 0.04:
        tk = tick(2100 + rng.uniform(-200, 200), 0.03) * (0.6 + 0.4 * rng.random())
        i = int(pos * SR)
        x[i : i + len(tk)] += tk[: len(x) - i]
        pos += gap
        gap *= 1.07
    x += highpass(brown(d), 400) * 0.05
    write("roulette", x, 0.6)

    d = 0.18
    tt = t(d)
    clack = (
        np.sin(2 * np.pi * 1850 * tt) * 0.6 + np.sin(2 * np.pi * 3170 * tt) * 0.4
    ) * np.exp(-tt * 45)
    clack += bandpass(noise(d), 800, 5000) * np.exp(-tt * 90)
    clack += sine_sweep(d, 180, 70) * np.exp(-tt * 30) * 0.8
    write("hard-stop", clack, 0.85)

    d = 1.3
    tt = t(d)
    riser = sine_sweep(d, 900, 180, 1.2) * 0.25 + bandpass(noise(d), 400, 400 + 6000 * tt / d) * 0.6
    riser *= (tt / d) ** 2
    write("riser", riser, 0.6)

    d = 0.9
    tt = t(d)
    note = lambda f, start: pad(
        np.zeros(int(start * SR)).tolist()
        + list(
            (np.sin(2 * np.pi * f * t(d - start)) + 0.3 * np.sin(2 * np.pi * f * 2 * t(d - start)))
            * np.exp(-t(d - start) * 6)
        ),
        d,
    )
    write("notify", reverb(note(1318.5, 0) + note(1975.5, 0.09), 0.5, 0.2), 0.6)

    d = 3.0
    tt = t(d)
    chord = sum(
        np.sin(2 * np.pi * f * tt + rng.uniform(0, 6)) * a
        for f, a in [(110, 1), (164.8, 0.6), (220, 0.5), (277.2, 0.35), (329.6, 0.3), (440, 0.15)]
    )
    shimmer = bandpass(noise(d), 3000, 9000) * 0.05
    resolve = (chord + shimmer) * np.minimum(tt / 0.6, 1) * np.exp(-np.maximum(tt - 0.6, 0) * 1.2)
    write("resolve", reverb(resolve, 1.2, 0.3), 0.55)

    d = 4.0
    tt = t(d)
    hum = (
        np.sin(2 * np.pi * 55 * tt) * 0.5
        + np.sin(2 * np.pi * 110.3 * tt) * 0.25
        + np.sin(2 * np.pi * 165 * tt) * 0.08
    ) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.7 * tt))
    hum += lowpass(brown(d), 300) * 0.5 + bandpass(noise(d), 1500, 3000) * 0.03
    hum *= np.minimum(tt / 0.4, 1) * np.minimum((d - tt) / 0.6, 1)
    write("mech-ambience", hum, 0.5)

    d = 0.8
    x = np.zeros(int(d * SR))
    for k in range(14):
        tk = tick(1500 + 120 * k, 0.025) * (0.5 + 0.03 * k)
        i = int((0.02 + k * 0.024) * SR)
        x[i : i + len(tk)] += tk
    snap = thud(0.3, 220, 60) + pad(highpass(noise(0.02), 2000) * np.linspace(1, 0, int(0.02 * SR)), 0.3)
    i = int(0.38 * SR)
    x[i : i + len(snap)] += snap[: len(x) - i] * 1.4
    write("assembly", reverb(x, 0.5, 0.2), 0.8)

    # Russian-version additions -------------------------------------------
    d = 0.9
    tt = t(d)
    sweep = sine_sweep(d, 900, 3400, 1.0) * 0.18
    scan = bandpass(noise(d), 1500, 1500 + 6000 * tt / d) * 0.7 + sweep
    scan *= np.minimum(tt / 0.05, 1) * np.minimum((d - tt) / 0.15, 1)
    scan *= 0.75 + 0.25 * np.sign(np.sin(2 * np.pi * 28 * tt))
    write("scan", scan, 0.55)

    d = 0.5
    x = np.zeros(int(d * SR))
    for k in range(16):
        tk = tick(3000 + 60 * k, 0.02) * (0.5 + 0.03 * k)
        i = int(k * 0.028 * SR)
        x[i : i + len(tk)] += tk[: len(x) - i]
    write("count", x, 0.55)

    d = 0.12
    tt = t(d)
    key = bandpass(noise(d), 1200, 6000) * np.exp(-tt * 70)
    key += np.sin(2 * np.pi * 420 * tt) * np.exp(-tt * 60) * 0.6
    write("type", key, 0.7)

    d = 0.45
    lock = pad(tick(1600, 0.03), d) + pad(np.zeros(int(0.05 * SR)).tolist() + list(tick(2400, 0.03)), d)
    lock += pad(np.zeros(int(0.05 * SR)).tolist() + list(thud(0.3, 160, 55)), d) * 0.9
    write("lock", reverb(lock, 0.35, 0.15), 0.8)


if __name__ == "__main__":
    build()
