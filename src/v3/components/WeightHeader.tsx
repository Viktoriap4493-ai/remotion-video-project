import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_BACK, EASE_OUT } from "../../loadcombos/anim";
import { GILROY } from "../../loadcombos/fonts";

// Top-of-frame readout used by the trailer and truck scenes: a technical
// label, a large weight (passed as a node so each scene animates it its own
// way), and a red delta pill + caption that land after the change.
export const WeightHeader: React.FC<{
  label: string;
  labelKey: string; // changes → label re-reveals
  labelAt: number;
  number: React.ReactNode;
  delta: string;
  deltaAt: number;
  caption: string;
  captionAt: number;
}> = ({ label, labelKey, labelAt, number, delta, deltaAt, caption, captionAt }) => {
  const frame = useCurrentFrame();
  const labelIn = interpolate(frame, [labelAt, labelAt + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const deltaIn = interpolate(frame, [deltaAt, deltaAt + 7], [0, 1], { ...CLAMP, easing: EASE_BACK });
  const capIn = interpolate(frame, [captionAt, captionAt + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 620,
          background: "linear-gradient(180deg, rgba(4,16,30,0.85) 0%, rgba(4,16,30,0.55) 60%, rgba(4,16,30,0) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          key={labelKey}
          style={{
            fontFamily: GILROY,
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: "0.22em",
            color: COLORS.white,
            clipPath: `inset(0 ${(1 - labelIn) * 100}% 0 0)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ width: 14, height: 14, background: COLORS.red, display: "inline-block" }} />
          {label}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 6 }}>
          {number}
          <div
            style={{
              background: COLORS.red,
              color: COLORS.white,
              fontFamily: GILROY,
              fontWeight: 800,
              fontSize: 44,
              padding: "10px 22px",
              borderRadius: 10,
              opacity: deltaIn,
              scale: String(interpolate(deltaIn, [0, 1], [0.5, 1])),
              boxShadow: "0 0 30px rgba(227,16,27,0.6)",
            }}
          >
            {delta}
          </div>
        </div>
        <div
          style={{
            fontFamily: GILROY,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "0.3em",
            color: "#9FD0FF",
            marginTop: 4,
            opacity: capIn,
            translate: `0 ${(1 - capIn) * 20}px`,
          }}
        >
          {caption}
        </div>
      </div>
    </>
  );
};
