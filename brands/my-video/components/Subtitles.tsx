import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER } from "./fonts";
import { clamp } from "./motion";
import { CHOCOLATE, SUBTITLE_TOP, WHITE } from "./tokens";

export type Cue = { text: string; from: number; to: number }; // seconds on the timeline

// Small, calm subtitles: Inter Medium, white, thin chocolate outline, a whisper of shadow.
// Only a 4-frame fade — no bouncing words, no plates.
export const Subtitles: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cue = cues.find((c) => t >= c.from && t < c.to);
  if (!cue) return null;
  const local = frame - Math.round(cue.from * fps);
  const left = Math.round(cue.to * fps) - frame;
  const opacity = Math.min(
    interpolate(local, [0, 4], [0, 1], clamp),
    interpolate(left, [0, 3], [0, 1], clamp),
  );
  return (
    <div
      style={{
        position: "absolute",
        top: SUBTITLE_TOP,
        left: 110,
        right: 110,
        textAlign: "center",
        fontFamily: INTER,
        fontWeight: 500,
        fontSize: 46,
        lineHeight: 1.18,
        letterSpacing: "-0.005em",
        color: WHITE,
        WebkitTextStroke: `5px ${CHOCOLATE}`,
        paintOrder: "stroke fill",
        textShadow: "0 2px 10px rgba(70,43,33,0.28)",
        opacity,
      }}
    >
      {cue.text}
    </div>
  );
};
