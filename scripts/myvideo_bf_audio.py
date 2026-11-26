"""My Video — Black Friday soundtrack: original calm premium music + processed voice.

Usage: python3 -I scripts/myvideo_bf_audio.py <voice.wav> <out.wav>
<voice.wav> is the cleaned, normalised (-16 LUFS) 48 kHz mono voice, already cut to the edit.
Accent times must match src/myvideo/timeline.ts.
"""
import sys
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(11)

# Soft "bloom" under the big reveals (seconds on the final timeline).
ACCENTS = [(2.14, 1.0), (15.0, 0.55), (18.05, 0.55), (25.75, 0.55), (35.2, 0.6)]


def t_axis(seconds):
    return np.arange(int(seconds * SR)) / SR


def read_mono(path):
    with wave.open(path) as w:
        assert w.getframerate() == SR
        data = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768
        if w.getnchannels() == 2:
            data = data.reshape(-1, 2).mean(1)
    return data


def fft_band(x, lo, hi):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    spec[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(spec, len(x))


def env(n, attack, release):
    e = np.ones(n)
    a = min(n, int(attack * SR))
    r = min(n - a, int(release * SR))
    if a:
        e[:a] = np.linspace(0, 1, a) ** 1.5
    if r:
        e[n - r:] = np.linspace(1, 0, r) ** 2
    return e


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


# ---------- music: warm lo-fi / ambient, 88 BPM, Db major ----------
BPM = 88
BEAT = 60 / BPM
BAR = 4 * BEAT
CHORDS = [
    [49, 60, 63, 65, 68],  # Dbmaj9
    [46, 56, 60, 61, 65],  # Bbm9
    [42, 58, 61, 65, 68],  # Gbmaj9
    [44, 56, 60, 63, 65],  # Ab6/9
]


def rhodes(freq, seconds):
    t = t_axis(seconds)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.2 * t)
    body = sum(a * np.sin(2 * np.pi * freq * h * t) * np.exp(-t * (1.2 + h)) for h, a in ((1, 1.0), (2, 0.28), (3, 0.06)))
    tine = np.sin(2 * np.pi * freq * 7.1 * t) * np.exp(-t * 28) * 0.12
    return (body + tine) * trem * (1 - np.exp(-t * 250))


def pad(freq, seconds):
    t = t_axis(seconds)
    sig = np.zeros_like(t)
    for detune in (-0.08, 0.0, 0.07):
        f = freq * 2 ** (detune / 12)
        sig += np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    return sig / 4


def soft_kick():
    t = t_axis(0.45)
    f = 48 + 60 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 0.5


def brush():
    t = t_axis(0.12)
    return fft_band(rng.standard_normal(len(t)), 4000, 11000) * np.exp(-t * 38) * 0.035


def bloom():
    t = t_axis(2.2)
    sub = np.sin(2 * np.pi * 55 * t) * np.exp(-t * 2.5) * 0.35
    air = fft_band(rng.standard_normal(len(t)), 1500, 7000) * np.exp(-((t - 0.25) ** 2) / 0.05) * 0.05
    bell = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((midi(80), 0.10), (midi(87), 0.06))) * np.exp(-t * 2.2)
    return (sub + air + bell) * env(len(t), 0.01, 1.2)


def build_music(seconds):
    n = int(seconds * SR)
    L = np.zeros(n)
    R = np.zeros(n)

    def add(sig, s0, pan=0.5, g=1.0):
        if s0 >= n:
            return
        seg = slice(s0, min(n, s0 + len(sig)))
        part = sig[: seg.stop - seg.start] * g
        L[seg] += part * (1 - pan) * 2
        R[seg] += part * pan * 2

    bars = int(np.ceil(seconds / BAR)) + 1
    for b in range(bars):
        chord = CHORDS[b % 4]
        start = int(b * BAR * SR)
        # pad bed
        for k, m in enumerate(chord[1:]):
            add(pad(midi(m), BAR + 1.0) * env(int((BAR + 1.0) * SR), 1.2, 1.0), start, 0.3 + 0.13 * k, 0.05)
        # Rhodes chord on 1 and the "and" of 2 (lazy syncopation)
        for at, g in ((0.0, 0.11), (1.5, 0.07)):
            for k, m in enumerate(chord[1:]):
                add(rhodes(midi(m), 2.6), start + int((at * BEAT + k * 0.012) * SR), 0.35 + 0.1 * k, g)
        # deep round bass: root on 1, fifth-ish pickup on 3.5
        root = midi(chord[0] - 12 if chord[0] > 45 else chord[0])
        bt = t_axis(BEAT * 2.6)
        bass = (np.sin(2 * np.pi * root * bt) + 0.2 * np.sin(4 * np.pi * root * bt)) * env(len(bt), 0.02, 0.5)
        add(bass, start, 0.5, 0.2)
        bt2 = t_axis(BEAT * 0.9)
        add(np.sin(2 * np.pi * root * 1.5 * bt2) * env(len(bt2), 0.02, 0.3), start + int(3.5 * BEAT * SR), 0.5, 0.1)
        # gentle groove: soft kick on 1 and 3, brush on off-beats (from bar 2)
        if b >= 1:
            for beat in (0, 2):
                add(soft_kick(), start + int(beat * BEAT * SR), 0.5, 0.55)
            for i in range(8):
                if i % 2:
                    add(brush(), start + int(i * BEAT / 2 * SR), 0.62 if i % 4 == 1 else 0.4, 1.0)
        # tiny melodic motif every other bar, high and quiet
        if b % 2 == 1:
            for i, m in enumerate((chord[4] + 12, chord[3] + 12, chord[2] + 12)):
                add(rhodes(midi(m), 1.6), start + int((2 + i * 0.5) * BEAT * SR), 0.6, 0.045)

    mus = np.stack([L, R])
    for ch in range(2):
        mus[ch] = fft_band(mus[ch], 28, 8500)
        wet = np.zeros_like(mus[ch])
        for delay, gain in ((0.051, 0.3), (0.083, 0.24), (0.127, 0.18), (0.191, 0.12), (0.277, 0.08)):
            d = int((delay + ch * 0.009) * SR)
            wet[d:] += mus[ch][:-d] * gain
        mus[ch] += wet
    return mus


def loudness_db(x):
    # crude K-weight-free RMS loudness of the louder half of the signal
    hop = SR // 10
    frames = x[: len(x) // hop * hop].reshape(-1, hop)
    r = np.sqrt((frames ** 2).mean(1))
    r = np.sort(r)[len(r) // 2:]
    return 20 * np.log10(np.sqrt((r ** 2).mean()) + 1e-12)


def main(voice_path, out_path):
    voice = read_mono(voice_path)
    n = len(voice)
    seconds = n / SR
    music = build_music(seconds + 1)[:, :n]

    for at, g in ACCENTS:
        b = bloom()
        i0 = int(at * SR)
        seg = slice(i0, min(n, i0 + len(b)))
        music[:, seg] += b[: seg.stop - seg.start] * g

    # level: music stem sits ~17 dB under the voice while talking, ~12 dB in pauses
    ref = loudness_db(voice)
    music *= 10 ** ((ref - 12 - loudness_db(music.mean(0))) / 20)
    hop = int(0.01 * SR)
    frames = n // hop
    rms = np.sqrt((voice[: frames * hop].reshape(frames, hop) ** 2).mean(1))
    talking = np.convolve((rms > 0.015).astype(float), np.ones(30) / 30, "same") > 0.05
    target = np.where(talking, 10 ** (-5 / 20), 1.0)
    smooth = np.empty_like(target)
    acc = target[0]
    for i, g in enumerate(target):
        acc += (g - acc) * (0.15 if g < acc else 0.025)
        smooth[i] = acc
    gain = np.repeat(smooth, hop)
    gain = np.pad(gain, (0, n - len(gain)), constant_values=gain[-1])
    fade = np.ones(n)
    fi = int(1.5 * SR)
    fade[:fi] = np.linspace(0, 1, fi) ** 1.5
    fo = int(2.0 * SR)
    fade[-fo:] = np.linspace(1, 0, fo) ** 1.6
    music *= gain * fade

    mix = music + voice[None, :]
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(mix.T, -1, 1) * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
