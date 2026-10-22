import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, COPY, FONT } from "../config";
import { clamp } from "./anim";

/**
 * Medical-ad style warning pinned to the bottom of the frame. Fades in once,
 * then stays still. Light frosted plate keeps it readable over photos; a very
 * soft glow softens the letter edges without blurring them.
 */
export const SafetyDisclaimer: React.FC<{ bottom?: number; fadeFrames?: number }> = ({ bottom = 90, fadeFrames = 8 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, fadeFrames], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom, display: "flex", justifyContent: "center", opacity }}>
      <div
        style={{
          padding: "14px 30px 12px",
          borderRadius: 18,
          background: "rgba(255,255,255,0.78)",
          boxShadow: "0 0 24px rgba(255,255,255,0.7)",
          fontFamily: FONT.family,
          fontWeight: FONT.bold,
          fontSize: 36,
          lineHeight: 1.22,
          letterSpacing: "0.03em",
          textAlign: "center",
          color: COLORS.graphite,
          textShadow: "0 0 1px rgba(32,38,48,0.45), 0 0 6px rgba(32,38,48,0.12)",
        }}
      >
        {COPY.disclaimer.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  );
};
