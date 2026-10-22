import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, COPY, FONT } from "../config";
import { clamp, ease, progress } from "./anim";

type Props = {
  top: number;
  at: number; // first line starts here (local frames)
  secondDelay?: number;
  underlineAt?: number;
  recedeAt?: number;
};

export const IntroHeadline: React.FC<Props> = ({ top, at, secondDelay = 5, underlineAt, recedeAt }) => {
  const frame = useCurrentFrame();
  const line1 = progress(frame, at, at + 12);
  const line2 = progress(frame, at + secondDelay, at + secondDelay + 12);
  const line3 = progress(frame, at + secondDelay + 2, at + secondDelay + 14);
  const ul = progress(frame, underlineAt ?? at + 16, (underlineAt ?? at + 16) + 9);
  const recede = recedeAt === undefined ? 0 : progress(frame, recedeAt, recedeAt + 9);

  const base: React.CSSProperties = {
    fontFamily: FONT.family,
    color: COLORS.graphite,
    lineHeight: 1.08,
    letterSpacing: "-0.01em",
    whiteSpace: "nowrap",
  };

  const rise = (p: number): React.CSSProperties => ({
    transform: `translateY(${interpolate(p, [0, 1], [70, 0], clamp)}px)`,
    opacity: interpolate(p, [0, 0.4], [0, 1], { ...clamp, easing: ease }),
  });

  return (
    <div style={{ position: "absolute", left: 80, right: 60, top, opacity: 1 - 0.2 * recede }}>
      <div style={{ ...base, fontWeight: FONT.bold, fontSize: 100, clipPath: `inset(-10px ${(1 - line1) * 100}% -10px 0)` }}>
        {COPY.headline1}
      </div>
      <div style={{ overflow: "hidden", paddingTop: 6 }}>
        <div style={{ ...base, fontWeight: FONT.semibold, fontSize: 76, ...rise(line2) }}>{COPY.headline2}</div>
      </div>
      <div style={{ overflow: "hidden", paddingBottom: 26 }}>
        <div style={{ ...base, position: "relative", display: "inline-block", fontWeight: FONT.semibold, fontSize: 88, color: COLORS.brand, ...rise(line3) }}>
          {COPY.headline2Accent}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -14,
              height: 8,
              borderRadius: 4,
              background: COLORS.brand,
              transformOrigin: "0 50%",
              transform: `scaleX(${ul})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
