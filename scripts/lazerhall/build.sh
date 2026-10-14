#!/usr/bin/env bash
# Builds the Lazer Hall "SMAS −40%" ad end to end:
#   1. synthesizes the music + SFX stems from src/lazerhall/cues.json
#   2. renders the Remotion composition (picture only)
#   3. mixes the audio to -14 LUFS / -1.5 dBTP and muxes the final MP4s
# Source clips must already be transcoded into public/lazerhall/video (see README in this folder).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/output/lazerhall"
WORK="${WORK:-$(mktemp -d)}"
AUDIO="$ROOT/public/lazerhall/audio"
mkdir -p "$OUT"

cd "$ROOT"
python3 scripts/lazerhall/make_audio.py

npx remotion bundle --out-dir="$WORK/bundle" --log=error
npx remotion render "$WORK/bundle" LazerHallSmas40 "$WORK/video_only.mp4" \
  --codec=h264 --crf=16 --muted --log=error

# Measure integrated loudness of a mix, print the gain (dB) needed to hit -14 LUFS.
gain_to_target() {
  local filter="$1"; shift
  local lufs
  lufs=$(ffmpeg -hide_banner -nostats "$@" -filter_complex "$filter,ebur128" -f null - 2>&1 \
    | awk '/Integrated loudness/{f=1} f && /I:/{print $2; exit}')
  python3 -c "print(round(-14 - ($lufs), 2))"
}

MIX="[0][1]amix=inputs=2:normalize=0:weights='1 1.25'"
SFX_ONLY="[1]anull"

mux() {
  local filter="$1" target="$2"
  local gain
  gain=$(gain_to_target "$filter" -i "$AUDIO/music.wav" -i "$AUDIO/sfx.wav")
  ffmpeg -hide_banner -loglevel error -y \
    -i "$AUDIO/music.wav" -i "$AUDIO/sfx.wav" -i "$WORK/video_only.mp4" \
    -filter_complex "$filter,volume=${gain}dB,alimiter=limit=0.79:level=false,aresample=48000[a]" \
    -map 2:v:0 -map "[a]" -c:v copy \
    -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1 -c:a aac -b:a 256k -ar 48000 \
    -shortest -movflags +faststart "$target"
}

mux "$MIX" "$OUT/laser_hall_smas_40_percent.mp4"
mux "$SFX_ONLY" "$OUT/laser_hall_smas_40_percent_no_music.mp4"

echo "Done: $OUT"
