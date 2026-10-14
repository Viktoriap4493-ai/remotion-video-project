#!/usr/bin/env bash
# Transcodes the clinic's iPhone HEVC clips (IMG_XXXX.MOV) into vertical 1080×1920, 30 fps,
# Rec.709 H.264 files the Remotion composition reads: public/lazerhall/video/clip-XXXX.mp4.
# Usage: scripts/lazerhall/prepare_clips.sh path/to/IMG_1174.MOV path/to/IMG_1175.MOV ...
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEST="$ROOT/public/lazerhall/video"
mkdir -p "$DEST"

for src in "$@"; do
  id=$(basename "$src" | sed -E 's/.*IMG_([0-9]+)\..*/\1/')
  ffmpeg -hide_banner -loglevel error -y -i "$src" -map 0:v:0 -an \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p" \
    -c:v libx264 -preset medium -crf 17 -g 15 \
    -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -movflags +faststart "$DEST/clip-$id.mp4"
  echo "clip-$id.mp4"
done
