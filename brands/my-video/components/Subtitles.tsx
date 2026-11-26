import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GILROY } from "./fonts";
import { clamp, silk } from "./motion";
import { WHITE } from "./tokens";

// One subtitle line; *word* marks a key word (bigger and bolder).
export type SubLine = { text: string; at: number };
// A group = 1–2 short lines (1–2 words each): they appear one after another on the left, then clear together.
export type SubGroup = { lines: SubLine[]; until: number };

const LEFT = 64;
const TOP = 1110;
const SIZE = 60;

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
          <span key={i} style={{ fontWeight: 800, fontSize: SIZE * 1.3 }}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </div>
  );
};

// Left-aligned, phrase-by-phrase subtitles: plain white Gilroy, no outline, no shadow, max two lines.
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
        fontFamily: GILROY,
        fontWeight: 500,
        fontSize: SIZE,
        letterSpacing: "-0.05em", // −5 % tracking
        color: WHITE,
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
