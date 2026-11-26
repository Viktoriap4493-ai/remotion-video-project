import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER } from "./fonts";
import { clamp, silk } from "./motion";
import { CHOCOLATE, WHITE } from "./tokens";

// One subtitle line; *word* marks a key word (bigger and bolder).
export type SubLine = { text: string; at: number };
// A group = one short sentence: its lines appear one after another, stacked on the left, then clear together.
export type SubGroup = { lines: SubLine[]; until: number };

const LEFT = 64;
const TOP = 1110;
const SIZE = 52;

const Line: React.FC<{ line: SubLine; frame: number; fps: number }> = ({ line, frame, fps }) => {
  const p = interpolate(frame, [line.at * fps, line.at * fps + 7], [0, 1], { ...clamp, easing: silk });
  const parts = line.text.split(/(\*[^*]+\*)/).filter(Boolean);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        filter: `blur(${(1 - p) * 4}px)`,
        whiteSpace: "nowrap",
        lineHeight: 1.12,
      }}
    >
      {parts.map((part, i) =>
        part.startsWith("*") ? (
          <span key={i} style={{ fontWeight: 700, fontSize: SIZE * 1.32, letterSpacing: "-0.02em" }}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </div>
  );
};

// Left-aligned, phrase-by-phrase subtitles (reference: text at the left, beside the body).
export const Subtitles: React.FC<{ groups: SubGroup[] }> = ({ groups }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const g = groups.find((gr) => t >= gr.lines[0].at && t < gr.until);
  if (!g) return null;
  const out = interpolate(frame, [g.until * fps - 4, g.until * fps], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: LEFT,
        top: TOP,
        fontFamily: INTER,
        fontWeight: 500,
        fontSize: SIZE,
        letterSpacing: "-0.01em",
        color: WHITE,
        WebkitTextStroke: `6px ${CHOCOLATE}`,
        paintOrder: "stroke fill",
        textShadow: "0 2px 12px rgba(70,43,33,0.35)",
        opacity: out,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {g.lines
        .filter((l) => t >= l.at - 0.01)
        .map((l) => (
          <Line key={l.at} line={l} frame={frame} fps={fps} />
        ))}
    </div>
  );
};
