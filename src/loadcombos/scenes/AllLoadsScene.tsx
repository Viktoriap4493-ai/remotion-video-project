import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_OUT } from "../anim";
import { BEBAS, GILROY } from "../fonts";
import { BlueprintBackground } from "../components/BlueprintBackground";
import { MaskReveal } from "../components/MaskReveal";
import { Sfx } from "../components/Sfx";

const GRID_IN = 5;
// vsi.png cropped to the 12-card grid (1053 × 1674).
const GRID_HEIGHT = 1250;
const GRID_WIDTH = Math.round((GRID_HEIGHT * 1053) / 1674);

export const AllLoadsScene: React.FC = () => {
  const frame = useCurrentFrame();
  // One coordinated assembly: scale up past 100% and settle, no per-card motion.
  const scale = interpolate(frame, [GRID_IN, GRID_IN + 9, GRID_IN + 16], [0.72, 1.035, 1], {
    ...CLAMP,
    easing: Easing.bezier(0.2, 0.8, 0.3, 1),
  });
  const drift = interpolate(frame, [GRID_IN + 16, 110], [1, 1.025], CLAMP);
  const sheen = interpolate(frame, [GRID_IN + 18, GRID_IN + 40], [-40, 140], CLAMP);

  return (
    <AbsoluteFill>
      <BlueprintBackground trimBefore={150} />

      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <MaskReveal start={0} duration={9}>
          <div style={{ fontFamily: BEBAS, fontSize: 124, lineHeight: 1, color: COLORS.navy }}>
            <span style={{ color: COLORS.red }}>12</span> LOAD COMBINATIONS
          </div>
        </MaskReveal>
        <MaskReveal start={14} duration={9}>
          <div
            style={{
              fontFamily: GILROY,
              fontWeight: 800,
              fontSize: 34,
              letterSpacing: "0.2em",
              color: COLORS.red,
              marginTop: 6,
            }}
          >
            JUST A FEW OF THE POSSIBILITIES
          </div>
        </MaskReveal>
      </div>

      <div
        style={{
          position: "absolute",
          top: 330,
          left: (1080 - GRID_WIDTH) / 2,
          width: GRID_WIDTH,
          height: GRID_HEIGHT,
          scale: String(scale * drift),
          opacity: interpolate(frame, [GRID_IN, GRID_IN + 4], [0, 1], CLAMP),
          filter: `blur(${interpolate(frame, [GRID_IN, GRID_IN + 8], [10, 0], { ...CLAMP, easing: EASE_OUT })}px)`,
          boxShadow: "0 30px 60px rgba(7,28,51,0.35)",
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("ad2/img/all-12-loads-grid.jpg")}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 180,
            left: `${sheen}%`,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent)",
            transform: "skewX(-16deg)",
          }}
        />
      </div>

      <Sfx at={0} name="whoosh-soft" volume={0.22} />
      <Sfx at={GRID_IN - 2} name="assembly" volume={0.4} />
      <Sfx at={GRID_IN + 9} name="punch" volume={0.3} />
    </AbsoluteFill>
  );
};
