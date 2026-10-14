#!/usr/bin/env python3
"""Synthesize the original music bed and the sound effects for the Lazer Hall SMAS ad.

Everything is generated from scratch (no samples, no third-party audio), so the
result carries no external licensing. Timings come from src/lazerhall/cues.json,
the same file that drives the on-screen animation, so every effect lands on the
frame its visual event happens.

Outputs (48 kHz, stereo, float WAV):
  public/lazerhall/audio/music.wav
  public/lazerhall/audio/sfx.wav
"""

import json
import os
import wave

import numpy as np
from scipy import signal

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CUES = json.load(open(os.path.join(ROOT, "src", "lazerhall", "cues.json")))
OUT_DIR = os.path.join(ROOT, "public", "lazerhall", "audio")

SR = 48000
DURATION = CUES["duration"]
N = int(DURATION * SR)
BEAT = 60.0 / CUES["bpm"]
BAR = 4 * BEAT
RNG = np.random.default_rng(7)


# ---------------------------------------------------------------- helpers

def t_axis(seconds):
    return np.arange(int(seconds * SR)) / SR


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def noise(seconds):
    return RNG.standard_normal(int(seconds * SR))


def bandpass(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="bandpass", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def lowpass(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype="lowpass", fs=SR, output="sos"), x)


def highpass(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype="highpass", fs=SR, output="sos"), x)


def sweep_filter(x, f_start, f_end, q=1.2, curve=1.0, block=256):
    """Band-pass whose centre frequency glides from f_start to f_end (log scale)."""
    y = np.zeros_like(x)
    n_blocks = int(np.ceil(len(x) / block))
    zi = None
    for b in range(n_blocks):
        p = (b / max(n_blocks - 1, 1)) ** curve
        fc = f_start * (f_end / f_start) ** p
        bw = fc / q
        lo, hi = max(fc - bw / 2, 30), min(fc + bw / 2, SR / 2 - 100)
        sos = signal.butter(1, [lo, hi], btype="bandpass", fs=SR, output="sos")
        if zi is None:
            zi = np.zeros((sos.shape[0], 2))
        seg = x[b * block:(b + 1) * block]
        out, zi = signal.sosfilt(sos, seg, zi=zi)
        y[b * block:b * block + len(seg)] = out
    return y


def env_exp(seconds, decay, attack=0.002):
    t = t_axis(seconds)
    a = np.clip(t / attack, 0, 1) if attack > 0 else 1
    return a * np.exp(-t * decay)


def reverb_ir(seconds=2.2, decay=2.6, tone=6000):
    t = t_axis(seconds)
    ir = np.stack([noise(seconds), noise(seconds)]) * np.exp(-t * decay)
    ir = np.stack([lowpass(ch, tone) for ch in ir])
    ir[:, : int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))  # pre-delay softness
    return ir / np.sqrt((ir ** 2).sum(axis=1, keepdims=True))


IR = reverb_ir()


def reverb(stereo, wet):
    out = np.stack([signal.fftconvolve(stereo[i], IR[i])[: stereo.shape[1]] for i in range(2)])
    return stereo * (1 - wet * 0.4) + out * wet


def to_stereo(mono, pan=0.0):
    left = np.cos((pan + 1) * np.pi / 4)
    right = np.sin((pan + 1) * np.pi / 4)
    return np.stack([mono * left * np.sqrt(2), mono * right * np.sqrt(2)])


def place(bus, sound, at):
    """Add a stereo sound into a stereo bus starting at `at` seconds."""
    if sound.ndim == 1:
        sound = to_stereo(sound)
    start = int(round(at * SR))
    if start < 0:
        sound = sound[:, -start:]
        start = 0
    end = min(start + sound.shape[1], bus.shape[1])
    if end > start:
        bus[:, start:end] += sound[:, : end - start]


def write_wav(path, stereo):
    stereo = np.clip(stereo, -1, 1)
    data = (stereo.T * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def peak_db(x):
    return 20 * np.log10(np.max(np.abs(x)) + 1e-9)


# ---------------------------------------------------------------- instruments

def kick(gain=1.0):
    t = t_axis(0.45)
    f = 48 + 120 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8.5)
    click = highpass(noise(0.45), 2500) * np.exp(-t * 400) * 0.25
    return np.tanh(1.6 * (body + click)) * gain


def clap(gain=1.0):
    length = 0.35
    t = t_axis(length)
    e = sum(np.exp(-np.clip(t - d, 0, None) * 220) * (t >= d) for d in (0, 0.011, 0.022))
    e = e + 0.55 * np.exp(-np.clip(t - 0.03, 0, None) * 16) * (t >= 0.03)
    return bandpass(noise(length), 900, 3200) * e * 0.55 * gain


def hat(open_=False, gain=1.0):
    length = 0.28 if open_ else 0.07
    t = t_axis(length)
    decay = 13 if open_ else 70
    return highpass(noise(length), 7500, order=4) * np.exp(-t * decay) * 0.55 * gain


def bass_note(m, seconds, gain=1.0):
    t = t_axis(seconds)
    f = midi_hz(m)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)
    e = np.clip(t / 0.006, 0, 1) * np.exp(-t * 3.2)
    e[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))
    return np.tanh(1.3 * x * e) * gain


def pad_chord(notes, seconds, detune_cents=9):
    t = t_axis(seconds)
    out = np.zeros((2, len(t)))
    for m in notes:
        f = midi_hz(m)
        for ch, d in enumerate((-detune_cents, detune_cents)):
            for k in (-0.5, 0.5):
                ff = f * 2 ** ((d + k * 4) / 1200)
                ph = RNG.uniform(0, 1)
                out[ch] += signal.sawtooth(2 * np.pi * (ff * t + ph))
    out = np.stack([lowpass(ch, 2300, order=2) for ch in out]) / (len(notes) * 2)
    attack = np.clip(t / 0.35, 0, 1)
    release = np.clip((seconds - t) / 0.35, 0, 1)
    return out * attack * release


def pluck(m, gain=1.0, seconds=0.45):
    t = t_axis(seconds)
    f = midi_hz(m)
    x = np.zeros_like(t)
    for k in range(1, 14):
        if f * k > 12000:
            break
        x += (1 / k) * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (7 + 4.5 * k))
    x *= np.clip(t / 0.002, 0, 1)
    return x * 0.5 * gain


def bell(m, seconds=3.0, gain=1.0):
    t = t_axis(seconds)
    f = midi_hz(m)
    index = 2.2 * np.exp(-t * 3.0)
    mod = np.sin(2 * np.pi * f * 3.5 * t) * index
    x = np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 1.5)
    x += 0.3 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 2.4)
    return x * np.clip(t / 0.004, 0, 1) * gain


# ---------------------------------------------------------------- music

# A-minor progression, one chord per bar: Am9 – Fmaj9 – Cmaj7 – G6.
PROGRESSION = [
    {"root": 45, "pad": [57, 60, 64, 67, 71], "arp": [69, 72, 76, 79, 81, 79, 76, 72]},
    {"root": 41, "pad": [53, 57, 60, 64, 67], "arp": [65, 69, 72, 76, 77, 76, 72, 69]},
    {"root": 48, "pad": [55, 59, 60, 64, 67], "arp": [67, 71, 72, 76, 79, 76, 72, 71]},
    {"root": 43, "pad": [55, 59, 62, 64, 67], "arp": [67, 71, 74, 76, 79, 76, 74, 71]},
]

MAIN_START = CUES["scenes"]["discount"][0]  # the drop lands on −40%
DRUMS_END = DURATION  # the groove carries through the logo and simply fades out
OUTRO = DURATION
FADE_OUT = 2.0  # seconds of smooth fade at the very end
OFFERS_START = CUES["scenes"]["offer1"][0]


def build_music():
    drums = np.zeros((2, N))
    bass = np.zeros((2, N))
    pads = np.zeros((2, N))
    arps = np.zeros((2, N))
    kick_times = []

    n_bars = int(np.ceil(DURATION / BAR))
    for bar in range(n_bars):
        bar_t = bar * BAR
        chord = PROGRESSION[bar % 4]

        # Pad: each chord overlaps the next slightly.
        if bar_t < OUTRO:
            place(pads, pad_chord(chord["pad"], min(BAR, OUTRO - bar_t) + 0.4), bar_t)

        for step in range(16):  # 16th-note grid
            t = bar_t + step * BEAT / 4
            if t >= DURATION:
                break
            in_main = MAIN_START <= t < DRUMS_END
            in_intro = t < MAIN_START - 0.5  # half-bar break before the drop
            pre_offer_gap = OFFERS_START - 0.5 <= t < OFFERS_START
            on_beat = step % 4 == 0

            if (in_main or in_intro) and not pre_offer_gap:
                if on_beat:
                    place(drums, kick(0.95), t)
                    kick_times.append(t)
                if in_main and step in (4, 12):
                    place(drums, to_stereo(clap(0.9), 0.0), t)
                swing = 0.012 if step % 2 else 0
                if in_main:
                    vel = 0.9 if step % 4 == 2 else (0.45 if step % 2 else 0.6)
                    if step % 4 == 2:
                        place(drums, to_stereo(hat(True, 0.55), 0.25), t)
                    else:
                        place(drums, to_stereo(hat(False, vel), -0.2), t + swing)
                elif step % 2 == 0:
                    place(drums, to_stereo(hat(False, 0.5), -0.2), t)

            # Bass: driving off-beat eighths in the main section, sustained roots in the intro.
            if t < DRUMS_END and not pre_offer_gap:
                if in_main and step % 2 == 0 and step % 4 != 0:
                    place(bass, bass_note(chord["root"], BEAT / 2 * 0.95, 0.8), t)
                elif in_main and step == 0:
                    place(bass, bass_note(chord["root"], BEAT / 2 * 0.95, 0.6), t)
                elif in_intro and step == 0:
                    place(bass, bass_note(chord["root"], BAR * 0.7, 0.7), t)

            # Pluck arpeggio on 8ths through the main section.
            if in_main and step % 2 == 0:
                note = chord["arp"][(step // 2) % 8]
                pan = -0.35 if (step // 2) % 2 else 0.35
                place(arps, to_stereo(pluck(note, 0.55), pan), t)

    # Big snare-roll build into the drop (under the riser).
    roll_start = MAIN_START - 1.0
    for i in range(16):
        t = roll_start + i * (1.0 / 16)
        place(drums, to_stereo(clap(0.15 + 0.5 * i / 15)), t)

    # Ping-pong delay on the arp (3/16 note).
    d = int(BEAT * 0.75 * SR)
    delayed = np.zeros_like(arps)
    for k, g in enumerate((0.38, 0.2, 0.1), start=1):
        src = arps[::-1] if k % 2 else arps
        delayed[:, d * k:] += src[:, : N - d * k] * g
    arps = arps + lowpass(delayed, 4000)

    # Sidechain pump from the kick on bass, pad and arp.
    duck = np.ones(N)
    for kt in kick_times:
        s = int(kt * SR)
        length = int(0.3 * SR)
        e = 1 - 0.55 * np.exp(-np.arange(length) / SR * 14)
        duck[s:s + length] = np.minimum(duck[s:s + length], e[: max(0, min(length, N - s))])

    pads = reverb(pads, 0.45) * duck * 0.55
    arps = reverb(arps, 0.3) * duck * 0.5
    bass = bass * duck * 0.45
    drums = reverb(drums, 0.12) * 0.72

    music = drums + bass + pads + arps
    music = np.stack([highpass(ch, 28) for ch in music])

    # Smooth equal-power fade over the last FADE_OUT seconds, landing exactly on silence.
    t = np.arange(N) / SR
    p = np.clip((DURATION - t) / FADE_OUT, 0, 1)
    music *= np.sin(p * np.pi / 2) ** 2
    return music


# ---------------------------------------------------------------- sound effects

def sfx_impact():
    length = 1.6
    t = t_axis(length)
    f = 32 + 48 * np.exp(-t * 7)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    thump = lowpass(noise(length), 220) * np.exp(-t * 14) * 1.4
    crack = bandpass(noise(length), 1200, 6000) * np.exp(-t * 60) * 0.35
    x = np.tanh(1.8 * (sub + thump + crack))
    return reverb(to_stereo(x), 0.18)


def sfx_soft_impact():
    length = 0.9
    t = t_axis(length)
    f = 52 + 50 * np.exp(-t * 12)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    x += lowpass(noise(length), 400) * np.exp(-t * 22) * 0.6
    return reverb(to_stereo(np.tanh(1.3 * x) * 0.75), 0.2)


def sfx_whoosh(length=0.5, lo=350, hi=3800, pan_from=-0.6, pan_to=0.6):
    t = t_axis(length)
    x = sweep_filter(noise(length), lo, hi, q=1.4, curve=0.8)
    peak = 0.62
    e = np.where(t < peak * length, (t / (peak * length)) ** 2.2, np.exp(-(t - peak * length) * 18))
    x = x * e
    x /= np.max(np.abs(x)) + 1e-9
    pan = np.linspace(pan_from, pan_to, len(t))
    left = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
    right = np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
    return reverb(np.stack([x * left, x * right]) * 0.6, 0.25)


def sfx_swipe():
    length = 0.26
    t = t_axis(length)
    x = sweep_filter(noise(length), 1800, 9000, q=2.0, curve=1.0)
    e = np.clip(t / 0.03, 0, 1) * np.exp(-np.clip(t - 0.06, 0, None) * 22)
    x = x * e
    x /= np.max(np.abs(x)) + 1e-9
    pan = np.linspace(-0.5, 0.5, len(t))
    return np.stack([x * np.cos((pan + 1) * np.pi / 4), x * np.sin((pan + 1) * np.pi / 4)]) * 0.75


def sfx_click():
    length = 0.08
    t = t_axis(length)
    x = np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 120) * 0.6
    x += highpass(noise(length), 3000) * np.exp(-t * 600) * 0.5
    return to_stereo(x)


def sfx_tick():
    length = 0.12
    t = t_axis(length)
    x = np.sin(2 * np.pi * 2900 * t) * np.exp(-t * 85) * 0.45
    x += np.sin(2 * np.pi * 1450 * t) * np.exp(-t * 60) * 0.25
    return reverb(to_stereo(x), 0.15)


def sfx_riser(length):
    t = t_axis(length)
    x = sweep_filter(noise(length), 250, 7000, q=1.6, curve=1.4) * 1.2
    tone_f = 180 * (6 ** (t / length))
    x += 0.25 * np.sin(2 * np.pi * np.cumsum(tone_f) / SR)
    e = (t / length) ** 2.4
    e[-int(0.015 * SR):] *= np.linspace(1, 0, int(0.015 * SR))
    x = x * e
    x /= np.max(np.abs(x)) + 1e-9
    return reverb(to_stereo(x * 0.55), 0.2)


def sfx_reverse_swell(length):
    t = t_axis(length)
    x = lowpass(highpass(noise(length), 300), 6000)
    e = (t / length) ** 3
    e[-int(0.04 * SR):] *= np.linspace(1, 0, int(0.04 * SR))
    x = x * e
    return reverb(to_stereo(x / (np.max(np.abs(x)) + 1e-9) * 0.4), 0.35)


def sfx_stab():
    out = np.zeros((2, int(1.4 * SR)))
    for i, m in enumerate([57, 64, 67, 71, 72]):
        place(out, to_stereo(pluck(m, 0.6, 1.2), (i - 2) * 0.2), 0)
    place(out, bass_note(45, 0.5, 0.6), 0)
    return reverb(out, 0.35) * 0.8


def sfx_sonic_logo():
    out = np.zeros((2, int(3.6 * SR)))
    for i, m in enumerate([69, 76, 81, 83]):
        place(out, to_stereo(bell(m, 3.2, 0.32), (i - 1.5) * 0.3), i * 0.07)
    t = t_axis(3.6)
    swell = np.sin(2 * np.pi * midi_hz(45) * t) * np.clip(t / 0.25, 0, 1) * np.exp(-t * 1.2) * 0.25
    out += to_stereo(swell)
    return reverb(out, 0.5)


def build_sfx():
    beats = CUES["beats"]
    bus = np.zeros((2, N))
    for cue in CUES["sfx"]:
        at = cue["at"]
        t = (beats[at] if isinstance(at, str) else at) + cue.get("offset", 0)
        g = cue.get("gain", 1.0)
        kind = cue["type"]
        if kind == "impact":
            place(bus, sfx_impact() * g, t)
        elif kind == "softImpact":
            place(bus, sfx_soft_impact() * g, t)
        elif kind == "whoosh":
            snd = sfx_whoosh()
            place(bus, snd * g, t - 0.5 * 0.62 + 0.06)  # loudest point just after the visual entry
        elif kind == "swipe":
            place(bus, sfx_swipe() * g, t)
        elif kind == "click":
            place(bus, sfx_click() * g, t)
        elif kind == "tick":
            place(bus, sfx_tick() * g, t)
        elif kind == "riser":
            place(bus, sfx_riser(cue["length"]) * g, t)
        elif kind == "reverseSwell":
            place(bus, sfx_reverse_swell(cue["length"]) * g, t)
        elif kind == "stab":
            place(bus, sfx_stab() * g, t)
        elif kind == "sonicLogo":
            place(bus, sfx_sonic_logo() * g, t)
        else:
            raise ValueError(f"unknown sfx type {kind}")
    return bus


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    music = build_music()
    sfx = build_sfx()
    # Keep both stems at sane, matching headroom; final loudness is set at mux time.
    music *= 10 ** ((-6 - peak_db(music)) / 20)
    sfx *= 10 ** ((-4 - peak_db(sfx)) / 20)
    write_wav(os.path.join(OUT_DIR, "music.wav"), music)
    write_wav(os.path.join(OUT_DIR, "sfx.wav"), sfx)
    print(f"music peak {peak_db(music):.1f} dBFS, sfx peak {peak_db(sfx):.1f} dBFS, {DURATION}s")


if __name__ == "__main__":
    main()
