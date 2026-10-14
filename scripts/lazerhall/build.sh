#!/usr/bin/env bash
# Builds the Lazer Hall "SMAS −40%" ad end to end:
#   1. synthesizes the music + SFX stems from src/lazerhall/cues.json
#   2. renders the Remotion composition (picture only)
#   3. mixes the audio to -14 LUFS (music version), encodes Rec.709 limited-range H.264, muxes the MP4s
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

# Measure integrated loudness of a mix, print the gain (dB) needed to hit the target LUFS.
gain_to_target() {
  local filter="$1" target="$2"; shift 2
  local lufs
  lufs=$(ffmpeg -hide_banner -nostats "$@" -filter_complex "$filter,ebur128" -f null - 2>&1 \
    | awk '/Integrated loudness/{f=1} f && /I:/{print $2; exit}')
  python3 -c "print(round($target - ($lufs), 2))"
}

MIX="[0][1]amix=inputs=2:normalize=0:weights='1 1.25'"
SFX_ONLY="[1]anull"

mux() {
  local filter="$1" lufs="$2" target="$3"
  local gain
  gain=$(gain_to_target "$filter" "$lufs" -i "$AUDIO/music.wav" -i "$AUDIO/sfx.wav")
  ffmpeg -hide_banner -loglevel error -y \
    -i "$AUDIO/music.wav" -i "$AUDIO/sfx.wav" -i "$WORK/video_only.mp4" \
    -filter_complex "$filter,volume=${gain}dB,alimiter=limit=0.79:level=false,aresample=48000[a]" \
    -map 2:v:0 -map "[a]" \
    -vf "scale=in_range=full:out_range=limited:out_color_matrix=bt709,format=yuv420p" \
    -c:v libx264 -preset slow -crf 15 -profile:v high -r 30 \
    -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
    -c:a aac -b:a 256k -ar 48000 \
    -shortest -movflags +faststart "$target"
}

mux "$MIX" -14 "$OUT/laser_hall_smas_40_percent.mp4"
# Effects alone are sparse transients, so they sit a little lower to keep true peak under -1 dBTP.
mux "$SFX_ONLY" -17 "$OUT/laser_hall_smas_40_percent_no_music.mp4"

echo "Done: $OUT"
