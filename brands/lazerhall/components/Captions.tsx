import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { GILROY, WEIGHT } from "./fonts";
import { clamp } from "./motion";
import { COLORS, SHADOWS } from "./tokens";

export type CaptionWord = { text: string; accent?: boolean };

// "Виразні *вилиці й рівний" → words; "*" marks a highlighted word and "_"
// keeps words together inside one highlight.
export const words = (line: string): CaptionWord[] =>
  line.split(" ").map((part) =>
    part.startsWith("*")
      ? { text: part.slice(1).replace(/_/g, " "), accent: true }
      : { text: part.replace(/_/g, " ") },
  );

// White ExtraBold caption, words appearing one by one out of a blur, key
// words in caption blue. Fades out over its last frames.
export const WordCaption: React.FC<{ lines: CaptionWord[][]; lengthInFrames: number; top?: number }> = ({
  lines,
  lengthInFrames,
  top = 1392,
}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [lengthInFrames - 4, lengthInFrames], [1, 0], clamp);
  let index = 0;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: GILROY,
        fontWeight: WEIGHT.extraBold,
        fontSize: 50,
        lineHeight: 1.18,
        opacity: out,
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {line.map((word, wi) => {
            const at = 2 + index++ * 2;
            const t = interpolate(frame, [at, at + 6], [0, 1], clamp);
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  marginRight: wi < line.length - 1 ? "0.25em" : 0,
                  color: word.accent ? COLORS.captionAccent : COLORS.white,
                  textShadow: word.accent ? "0 0 14px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.6)" : SHADOWS.text,
                  opacity: t,
                  filter: `blur(${(1 - t) * 8}px)`,
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Blue plate caption that opens from the centre (benefit headlines).
export const CaptionPlate: React.FC<{ text: string; lengthInFrames: number; top?: number }> = ({
  text,
  lengthInFrames,
  top = 1400,
}) => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const close = interpolate(frame, [lengthInFrames - 6, lengthInFrames], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top, width: "100%", display: "flex", justifyContent: "center", opacity: close }}>
      <div
        style={{
          padding: "26px 46px",
          borderRadius: 30,
          backgroundColor: COLORS.blue,
          clipPath: `inset(0 ${(1 - open) * 50}% 0 ${(1 - open) * 50}% round 30px)`,
          boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
          maxWidth: 960,
          textAlign: "center",
          fontFamily: GILROY,
          fontWeight: WEIGHT.extraBold,
          fontSize: 52,
          lineHeight: 1.15,
          color: COLORS.white,
        }}
      >
        <span style={{ opacity: interpolate(frame, [4, 10], [0, 1], clamp), whiteSpace: "pre-line" }}>{text}</span>
      </div>
    </div>
  );
};

// Small subtitle for spoken lines that have no headline on screen.
export const Subtitle: React.FC<{ text: string; lengthInFrames: number; top?: number }> = ({
  text,
  lengthInFrames,
  top = 280,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 4, lengthInFrames - 4, lengthInFrames], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", top, width: "100%", display: "flex", justifyContent: "center", opacity }}>
      <div
        style={{
          maxWidth: 900,
          padding: "10px 24px",
          borderRadius: 16,
          backgroundColor: "rgba(5,29,94,0.55)",
          fontFamily: GILROY,
          fontWeight: WEIGHT.medium,
          fontSize: 38,
          lineHeight: 1.25,
          color: COLORS.white,
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </div>
  );
};
