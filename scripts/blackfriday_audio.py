"""Builds the Black Friday ad soundtrack: original calm ambient music,
synthesized SFX and the processed voiceover, mixed into one stereo WAV.

Usage: python3 -I scripts/blackfriday_audio.py <voice.wav> <out.wav>
Event times must match src/blackfriday/timeline.ts.
"""
import sys
import wave

import numpy as np

SR = 48000
DURATION = 41.7
VO_OFFSET = 0.5
rng = np.random.default_rng(7)


def t_axis(seconds):
    return np.arange(int(seconds * SR)) / SR


def read_mono(path):
    with wave.open(path) as w:
        data = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768
        if w.getnchannels() == 2:
            data = data.reshape(-1, 2).mean(1)
        assert w.getframerate() == SR
    return data


def fft_band(x, lo, hi):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    spec[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(spec, len(x))


def env_adsr(n, attack, release):
    e = np.ones(n)
    a = min(n, int(attack * SR))
    r = min(n - a, int(release * SR))
    if a:
        e[:a] = np.linspace(0, 1, a)
    if r:
        e[n - r:] = np.linspace(1, 0, r) ** 2
    return e


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


# ---------- music: calm ambient, 84 BPM, Fmaj9 – Am7 – Dm9 – Bbmaj7 ----------
BPM = 84
BAR = 4 * 60 / BPM
CHORDS = [
    [53, 60, 64, 67, 69],  # Fmaj9
    [57, 60, 64, 67, 71],  # Am7(9)
    [50, 57, 60, 64, 65],  # Dm9
    [46, 53, 57, 62, 65],  # Bbmaj7
]


def pad_voice(freq, seconds):
    t = t_axis(seconds)
    sig = np.zeros_like(t)
    for detune in (-0.12, 0.0, 0.11):
        f = freq * 2 ** (detune / 12)
        for h, amp in ((1, 1.0), (2, 0.35), (3, 0.12)):
            sig += amp * np.sin(2 * np.pi * f * h * t + rng.uniform(0, 6.28))
    return sig / 4.5


def pluck(freq, seconds=1.6):
    t = t_axis(seconds)
    e = np.exp(-t * 3.2) * (1 - np.exp(-t * 400))
    sig = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 6)
    return sig * e


def piano(freq, seconds=2.2):
    t = t_axis(seconds)
    e = np.exp(-t * 2.4) * (1 - np.exp(-t * 300))
    sig = sum(amp * np.sin(2 * np.pi * freq * h * t) * np.exp(-t * h * 0.8) for h, amp in ((1, 1.0), (2, 0.45), (3, 0.2), (4, 0.08)))
    return sig * e


def build_music():
    n = int((DURATION + 1) * SR)
    left = np.zeros(n)
    right = np.zeros(n)
    bars = int(np.ceil((DURATION + 1) / BAR))
    for b in range(bars):
        chord = CHORDS[b % 4]
        start = int(b * BAR * SR)
        length = BAR + 0.8
        for k, m in enumerate(chord):
            v = pad_voice(midi(m), length) * env_adsr(int(length * SR), 0.9, 1.2) * 0.16
            pan = 0.35 + 0.3 * (k / len(chord))
            seg = slice(start, min(n, start + len(v)))
            left[seg] += v[: seg.stop - seg.start] * (1 - pan)
            right[seg] += v[: seg.stop - seg.start] * pan
        # sub bass on the root
        bass = np.sin(2 * np.pi * midi(chord[0] - 12) * t_axis(BAR)) * env_adsr(int(BAR * SR), 0.3, 0.8) * 0.22
        seg = slice(start, min(n, start + len(bass)))
        left[seg] += bass[: seg.stop - seg.start]
        right[seg] += bass[: seg.stop - seg.start]
        # gentle electric-piano arpeggio on eighths
        arp = [chord[1] + 12, chord[2] + 12, chord[3] + 12, chord[4] + 12, chord[3] + 12, chord[2] + 12, chord[4] + 12, chord[3] + 12]
        for i, m in enumerate(arp):
            p = pluck(midi(m)) * (0.11 if i % 2 == 0 else 0.07)
            s0 = start + int(i * BAR / 8 * SR)
            if s0 >= n:
                continue
            seg = slice(s0, min(n, s0 + len(p)))
            pan = 0.3 if i % 2 else 0.7
            left[seg] += p[: seg.stop - seg.start] * (1 - pan)
            right[seg] += p[: seg.stop - seg.start] * pan
    # upper-register piano chords on beats 1 and 3: they stay audible on phone speakers
    for b in range(bars):
        chord = CHORDS[b % 4]
        for half in (0, 1):
            s0 = int((b * BAR + half * BAR / 2) * SR)
            if s0 >= n:
                continue
            for k, m in enumerate(chord[2:]):
                p = piano(midi(m + 24)) * (0.075 if half == 0 else 0.05)
                p = np.pad(p, (int(k * 0.018 * SR), 0))  # slight strum
                seg = slice(s0, min(n, s0 + len(p)))
                pan = 0.4 + 0.1 * k
                left[seg] += p[: seg.stop - seg.start] * (1 - pan)
                right[seg] += p[: seg.stop - seg.start] * pan
    # soft shaker on off-beats for a little motion
    beat = 60 / BPM
    for i in range(int((DURATION + 1) / beat * 2)):
        if i % 2 == 0:
            continue
        s0 = int(i * beat / 2 * SR)
        noise = fft_band(rng.standard_normal(int(0.09 * SR)), 5000, 12000) * np.exp(-t_axis(0.09) * 45) * 0.03
        seg = slice(s0, min(n, s0 + len(noise)))
        left[seg] += noise[: seg.stop - seg.start]
        right[seg] += noise[: seg.stop - seg.start] * 0.8
    # warm it up and add a simple stereo reverb tail
    mus = np.stack([left, right])
    for ch in range(2):
        mus[ch] = fft_band(mus[ch], 30, 9000)
        wet = np.zeros_like(mus[ch])
        for delay, gain in ((0.043, 0.35), (0.071, 0.28), (0.113, 0.22), (0.167, 0.16), (0.241, 0.1)):
            d = int((delay + ch * 0.007) * SR)
            wet[d:] += mus[ch][:-d] * gain
        mus[ch] = mus[ch] + wet
    return mus[:, : int(DURATION * SR)]


# ---------- SFX ----------
def sfx_impact():
    t = t_axis(1.6)
    sweep = np.sin(2 * np.pi * np.cumsum(35 + 90 * np.exp(-t * 9)) / SR) * np.exp(-t * 2.6)
    noise = fft_band(rng.standard_normal(len(t)), 40, 1800) * np.exp(-t * 7) * 0.6
    return (sweep + noise) * 0.75


def sfx_whoosh(seconds=0.7, lo=250, hi=4500, gain=0.35):
    t = t_axis(seconds)
    noise = rng.standard_normal(len(t))
    out = np.zeros_like(t)
    chunks = 24
    step = len(t) // chunks
    for c in range(chunks):
        frac = c / (chunks - 1)
        f = lo * (hi / lo) ** np.sin(np.pi * frac / 2)
        seg = slice(c * step, (c + 1) * step + int(0.01 * SR))
        out[seg] += fft_band(noise[seg], f * 0.6, f * 1.6)[: len(out[seg])]
    e = np.sin(np.pi * np.clip(t / seconds, 0, 1)) ** 2
    return out * e * gain


def sfx_bass_hit():
    t = t_axis(1.2)
    f = 45 + 110 * np.exp(-t * 18)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    click = fft_band(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t * 90) * 0.3
    return (body + click) * 0.8


def sfx_bell():
    # small alarm-clock ring: quick hammer strikes on an inharmonic bell
    out = np.zeros(int(0.9 * SR))
    for k in range(7):
        t = t_axis(0.5)
        tone = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((2350, 1.0), (3170, 0.55), (4720, 0.3)))
        tone *= np.exp(-t * 14)
        s0 = int(k * 0.055 * SR)
        seg = slice(s0, min(len(out), s0 + len(tone)))
        out[seg] += tone[: seg.stop - seg.start]
    return out * env_adsr(len(out), 0.002, 0.3) * 0.12


def sfx_tick():
    t = t_axis(0.03)
    return fft_band(rng.standard_normal(len(t)), 2500, 9000) * np.exp(-t * 300) * 0.22


def sfx_shimmer():
    t = t_axis(1.4)
    tone = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((1318.5, 0.5), (1975.5, 0.35), (2637, 0.2)))
    sub = np.sin(2 * np.pi * 65 * t) * np.exp(-t * 5) * 0.6
    return (tone * np.exp(-t * 3.5) * 0.25 + sub * 0.5) * env_adsr(len(t), 0.005, 0.5)


def sfx_pop():
    t = t_axis(0.18)
    f = 380 + 600 * np.exp(-t * 40)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 28) * 0.35


SFX_EVENTS = [
    (0.02, sfx_impact(), 1.0),
    (0.05, sfx_whoosh(0.6, 300, 5000, 0.4), 1.0),
    (0.72, sfx_pop(), 0.8),
    (3.25, sfx_whoosh(0.5, 400, 4000, 0.3), 1.0),
    (3.52, sfx_bell(), 1.0),
    (5.82, sfx_whoosh(0.35, 500, 5000, 0.3), 1.0),
    (5.96, sfx_bass_hit(), 0.9),
    (9.15, sfx_whoosh(0.55, 250, 3500, 0.22), 1.0),
    (12.1, sfx_whoosh(0.45, 300, 3000, 0.12), 1.0),
    (15.12, sfx_whoosh(0.45, 300, 3000, 0.12), 1.0),
    (18.47, sfx_whoosh(0.45, 300, 3000, 0.12), 1.0),
    (22.1, sfx_whoosh(0.5, 300, 4000, 0.2), 1.0),
    (22.93, sfx_whoosh(0.6, 350, 4500, 0.2), 1.0),
    (25.73, sfx_whoosh(0.6, 350, 4500, 0.2), 1.0),
    (28.93, sfx_whoosh(0.6, 350, 4500, 0.2), 1.0),
    (31.1, sfx_whoosh(0.5, 300, 4000, 0.25), 1.0),
    (33.6, sfx_shimmer(), 0.9),
    (35.45, sfx_whoosh(0.5, 300, 4000, 0.25), 1.0),
    (37.85, sfx_pop(), 0.9),
]
TICKS = [3.8 + 0.5 * i for i in range(4)]


def main(voice_path, out_path):
    n = int(DURATION * SR)
    voice = np.zeros(n)
    v = read_mono(voice_path)
    s0 = int(VO_OFFSET * SR)
    voice[s0 : s0 + len(v)] = v[: n - s0]

    music = build_music()
    # duck music under speech: ~10 dB below the voice, rising in pauses and at the end
    hop = int(0.01 * SR)
    frames = len(voice) // hop
    rms = np.sqrt((voice[: frames * hop].reshape(frames, hop) ** 2).mean(1))
    talking = np.convolve((rms > 0.01).astype(float), np.ones(35) / 35, "same") > 0.05
    target = np.where(talking, 10 ** (-8 / 20), 10 ** (-4 / 20))
    smooth = np.empty_like(target)
    acc = target[0]
    for i, g in enumerate(target):
        coef = 0.18 if g < acc else 0.03
        acc += (g - acc) * coef
        smooth[i] = acc
    gain = np.repeat(smooth, hop)
    gain = np.pad(gain, (0, n - len(gain)), constant_values=gain[-1])
    fade_out = np.ones(n)
    fo = int(2.2 * SR)
    fade_out[-fo:] = np.linspace(1, 0, fo) ** 1.5
    fade_in = np.ones(n)
    fi = int(0.4 * SR)
    fade_in[:fi] = np.linspace(0, 1, fi)
    music *= gain * fade_out * fade_in

    sfx = np.zeros((2, n))
    for at, clip, g in SFX_EVENTS:
        i0 = int(at * SR)
        seg = slice(i0, min(n, i0 + len(clip)))
        sfx[0, seg] += clip[: seg.stop - seg.start] * g
        sfx[1, seg] += clip[: seg.stop - seg.start] * g
    for at in TICKS:
        clip = sfx_tick()
        i0 = int(at * SR)
        sfx[:, i0 : i0 + len(clip)] += clip

    mix = music + sfx + voice[None, :]
    peak = np.abs(mix).max()
    if peak > 0.89:
        mix *= 0.89 / peak
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(mix.T, -1, 1) * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
