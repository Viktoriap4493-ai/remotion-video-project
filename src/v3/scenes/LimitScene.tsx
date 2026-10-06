import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_OUT, punch } from "../../loadcombos/anim";
import { CheckIcon } from "../../loadcombos/components/CheckIcon";
import { MaskReveal } from "../../loadcombos/components/MaskReveal";
import { Sfx } from "../../loadcombos/components/Sfx";
import { TechBackground } from "../../loadcombos/components/TechBackground";
import { BEBAS, GILROY } from "../../loadcombos/fonts";

// Measurement interface: true-to-scale columns (from 0 LB) rise under the
// 26,000 LB line. Only load totals whose arithmetic checks out are used.
const BASE_Y = 1380;
const LIMIT_Y = 640;
const PX_PER_LB = (BASE_Y - LIMIT_Y) / 26000;

const LOADS = [
  { total: "25,337 LB", lb: 25337, under: "663", combo: "2× F-150 + COROLLA", at: 22 },
  { total: "25,732 LB", lb: 25732, under: "268", combo: "2× RIVIAN VAN", at: 34 },
];
const MORE = 62; // "…and more opportunities…"
const WITHOUT = 72;

const Bar: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const l = LOADS[i];
  const grow = interpolate(frame, [l.at, l.at + 14], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const h = l.lb * PX_PER_LB * grow;
  const left = i === 0 ? 250 : 590;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left,
          width: 240,
          top: BASE_Y - h,
          height: h,
          background: `linear-gradient(180deg, ${COLORS.white} 0%, #9FD0FF 12%, rgba(46,110,170,0.65) 100%)`,
          borderRadius: "8px 8px 0 0",
          boxShadow: "0 0 30px rgba(127,211,255,0.25)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left,
          width: 240,
          top: BASE_Y - l.lb * PX_PER_LB + 26,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: interpolate(frame, [l.at + 12, l.at + 16], [0, 1], CLAMP),
          scale: String(punch(frame, l.at + 14, 0.1, 2, 7)),
        }}
      >
        <div style={{ fontFamily: BEBAS, fontSize: 70, lineHeight: 1, color: COLORS.navy }}>{l.total}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <CheckIcon start={l.at + 14} size={36} />
          <span style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 24, color: COLORS.navy }}>{l.under} UNDER</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: left - 40,
          width: 320,
          top: BASE_Y + 16,
          textAlign: "center",
          whiteSpace: "nowrap",
          fontFamily: GILROY,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: "0.08em",
          color: "#BFD9F2",
          opacity: grow,
        }}
      >
        {l.combo}
      </div>
      <Sfx at={l.at} name="count" volume={0.2} />
      <Sfx at={l.at + 14} name="lock" volume={0.36} />
    </>
  );
};

export const LimitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const big = interpolate(frame, [2, 9], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const line = interpolate(frame, [8, 20], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const scanY = interpolate(frame, [8, 24], [BASE_Y, LIMIT_Y], CLAMP);

  return (
    <AbsoluteFill>
      <TechBackground image />
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: BEBAS,
          fontSize: 230,
          lineHeight: 1,
          color: COLORS.white,
          opacity: big,
          scale: String(interpolate(big, [0, 1], [1.5, 1])),
          filter: `blur(${(1 - big) * 12}px)`,
        }}
      >
        26,000 LB
      </div>

      {/* Baseline, scale ticks and the limit line */}
      <div style={{ position: "absolute", left: 100, right: 100, top: BASE_Y, height: 4, background: "rgba(255,255,255,0.6)" }} />
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 100,
            width: 30,
            top: BASE_Y - (i + 1) * 5000 * PX_PER_LB,
            height: 2,
            background: "rgba(255,255,255,0.3)",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: LIMIT_Y - 4,
          width: 960 * line,
          height: 8,
          background: COLORS.red,
          boxShadow: "0 0 26px rgba(227,16,27,0.9)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 60,
          top: LIMIT_Y - 46,
          fontFamily: GILROY,
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: "0.22em",
          color: COLORS.red,
          opacity: line,
        }}
      >
        LIMIT
      </div>
      {frame >= 8 && frame < 24 ? (
        <div style={{ position: "absolute", left: 60, right: 60, top: scanY, height: 3, background: "#7FD3FF", boxShadow: "0 0 20px #7FD3FF" }} />
      ) : null}

      {LOADS.map((_, i) => (
        <Bar key={i} i={i} />
      ))}

      <div style={{ position: "absolute", top: 1450, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <MaskReveal start={MORE} duration={8}>
          <div style={{ fontFamily: BEBAS, fontSize: 120, lineHeight: 1, color: COLORS.white }}>MORE OPTIONS</div>
        </MaskReveal>
        <MaskReveal start={WITHOUT} duration={8}>
          <div style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 38, letterSpacing: "0.18em", color: COLORS.red, marginTop: 6 }}>
            WITHOUT PUSHING THE LIMIT
          </div>
        </MaskReveal>
      </div>

      <Sfx at={2} name="impact-strong" volume={0.34} />
      <Sfx at={8} name="scan" volume={0.22} />
      <Sfx at={MORE} name="whoosh-fast" volume={0.22} />
      <Sfx at={WITHOUT + 2} name="notify" volume={0.18} />
    </AbsoluteFill>
  );
};
