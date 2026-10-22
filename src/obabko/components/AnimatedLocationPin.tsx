import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config";
import { clamp, ease, progress } from "./anim";

type Props = {
  dotAt: number; // dot appears
  dropAt: number; // marker falls into place
  landAt: number; // touch-down: settle + ring
  size?: number;
};

/**
 * Brand geo-marker: red dot → grows into a pin → drops in → small settle on
 * landing → a ring spreads and fades under it. Holds still afterwards.
 */
export const AnimatedLocationPin: React.FC<Props> = ({ dotAt, dropAt, landAt, size = 96 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dot = progress(frame, dotAt, dotAt + 5);
  const grow = progress(frame, dotAt + 3, dropAt);
  const fall = interpolate(frame, [dropAt, landAt], [-110, 0], {
    ...clamp,
    easing: (t) => t * t,
  });
  const settle = spring({ frame: frame - landAt, fps, config: { damping: 12, stiffness: 260 } });
  const squash = frame >= landAt ? 1 - 0.1 * (1 - settle) : 1;
  const ring = progress(frame, landAt, landAt + 16, ease);

  const h = size * 1.32;
  const morph = grow; // 0 = dot, 1 = full pin

  return (
    <div style={{ position: "relative", width: size, height: h }}>
      {/* landing ring */}
      <div
        style={{
          position: "absolute",
          left: size / 2,
          top: h - 4,
          width: size * 1.6 * ring,
          height: size * 0.5 * ring,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: `3px solid ${COLORS.brand}`,
          opacity: frame >= landAt ? (1 - ring) * 0.9 : 0,
        }}
      />
      {/* contact shadow */}
      <div
        style={{
          position: "absolute",
          left: size / 2,
          top: h - 4,
          width: size * 0.5,
          height: size * 0.14,
          transform: `translate(-50%, -50%) scaleX(${interpolate(fall, [-110, 0], [0.4, 1])})`,
          borderRadius: "50%",
          background: "rgba(32,38,48,0.22)",
          opacity: morph,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 100%",
          transform: `translateY(${morph < 1 ? 0 : fall}px) scale(${1 / squash ** 0.5}, ${squash})`,
        }}
      >
        {morph < 1 ? (
          // dot stage, centred where the pin head will be
          <div
            style={{
              position: "absolute",
              left: size / 2,
              top: size / 2,
              width: interpolate(morph, [0, 1], [22, size], clamp) * dot,
              height: interpolate(morph, [0, 1], [22, size], clamp) * dot,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: COLORS.brand,
            }}
          />
        ) : (
          <svg width={size} height={h} viewBox="0 0 100 132">
            <path
              d="M50 130 C50 130 6 76 6 46 C6 21.7 25.7 2 50 2 C74.3 2 94 21.7 94 46 C94 76 50 130 50 130 Z"
              fill={COLORS.brand}
            />
            <circle cx="50" cy="46" r="17" fill={COLORS.white} />
          </svg>
        )}
      </div>
    </div>
  );
};
