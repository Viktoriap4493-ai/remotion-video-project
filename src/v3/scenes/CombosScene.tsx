import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_OUT } from "../../loadcombos/anim";
import { MaskReveal } from "../../loadcombos/components/MaskReveal";
import { Sfx } from "../../loadcombos/components/Sfx";
import { TechBackground } from "../../loadcombos/components/TechBackground";
import { BEBAS, GILROY } from "../../loadcombos/fonts";

// vsi.png as ONE composition: its 3×4 card wireframe draws, all twelve cards
// fill in on the same frame, the grid zooms out and locks.
const WIRE = 2;
const FILL = 22;
const LOCK = 40;
const TITLE = 56; // "…12 different load combinations."
const SUB = 118; // "All built around the same lightweight setup."

// Card boxes inside the cropped grid image (1053 × 1674).
const COLS = [[4, 334], [362, 691], [717, 1047]];
const ROWS = [[5, 396], [425, 815], [849, 1239], [1279, 1669]];
const IMG = { w: 1053, h: 1674 };
const H = 1220;
const W = Math.round((H * IMG.w) / IMG.h);
const TOP = 380;

export const CombosScene: React.FC = () => {
  const frame = useCurrentFrame();
  const wire = interpolate(frame, [WIRE, FILL], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const fill = interpolate(frame, [FILL, FILL + 6], [0, 1], CLAMP);
  const zoom = interpolate(frame, [0, LOCK], [1.14, 1], { ...CLAMP, easing: Easing.bezier(0.2, 0.7, 0.3, 1) });
  const lockFlash = interpolate(frame, [LOCK, LOCK + 2, LOCK + 10], [0, 0.35, 0], CLAMP);
  const brackets = interpolate(frame, [LOCK, LOCK + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const drift = interpolate(frame, [LOCK, 186], [1, 1.03], CLAMP);

  return (
    <AbsoluteFill>
      <TechBackground />
      {/* Digital data lines sliding behind the grid */}
      {[260, 560, 990, 1420, 1700].map((y, i) => (
        <div
          key={y}
          style={{
            position: "absolute",
            top: y,
            left: 0,
            width: 1080,
            height: 2,
            background: `linear-gradient(90deg, transparent, rgba(127,211,255,0.4), transparent)`,
            translate: `${((frame * (6 + i * 2)) % 1600) - 800}px 0`,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          top: TOP,
          left: (1080 - W) / 2,
          width: W,
          height: H,
          scale: String(zoom * drift),
        }}
      >
        <Img
          src={staticFile("ad2/img/all-12-loads-grid.jpg")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: fill,
            filter: `brightness(${1 + (1 - fill) * 1.5})`,
          }}
        />
        <svg viewBox={`0 0 ${IMG.w} ${IMG.h}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {COLS.flatMap(([x0, x1]) =>
            ROWS.map(([y0, y1]) => (
              <rect
                key={`${x0}-${y0}`}
                x={x0}
                y={y0}
                width={x1 - x0}
                height={y1 - y0}
                fill="none"
                stroke="#7FD3FF"
                strokeWidth={4}
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - wire}
                opacity={1 - fill * 0.85}
              />
            )),
          )}
        </svg>
        <div style={{ position: "absolute", inset: 0, background: "white", opacity: lockFlash }} />
        {[
          { left: -22, top: -22, b: "Top", s: "Left" },
          { right: -22, top: -22, b: "Top", s: "Right" },
          { left: -22, bottom: -22, b: "Bottom", s: "Left" },
          { right: -22, bottom: -22, b: "Bottom", s: "Right" },
        ].map(({ b, s, ...pos }, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: 64,
              height: 64,
              [`border${b}`]: `6px solid ${COLORS.red}`,
              [`border${s}`]: `6px solid ${COLORS.red}`,
              opacity: brackets,
              scale: String(interpolate(brackets, [0, 1], [1.6, 1])),
            }}
          />
        ))}
      </div>

      <div style={{ position: "absolute", top: 140, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <MaskReveal start={TITLE} duration={9}>
          <div style={{ fontFamily: BEBAS, fontSize: 130, lineHeight: 1, color: COLORS.white }}>
            <span style={{ color: COLORS.red }}>12</span> LOAD COMBINATIONS
          </div>
        </MaskReveal>
        <MaskReveal start={SUB} duration={8}>
          <div style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 38, letterSpacing: "0.24em", color: "#9FD0FF", marginTop: 10 }}>
            ONE LIGHTWEIGHT SETUP
          </div>
        </MaskReveal>
      </div>

      <Sfx at={WIRE} name="assembly" volume={0.4} />
      <Sfx at={LOCK} name="punch" volume={0.34} />
      <Sfx at={TITLE} name="whoosh-fast" volume={0.2} />
      <Sfx at={SUB} name="ui-click" volume={0.24} />
    </AbsoluteFill>
  );
};
