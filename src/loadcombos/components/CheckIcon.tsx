import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_BACK, EASE_OUT } from "../anim";

// Green check badge: circle pops in, tick stroke draws, a ring pulses out.
export const CheckIcon: React.FC<{ start: number; size: number }> = ({
  start,
  size,
}) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [start, start + 8], [0, 1], {
    ...CLAMP,
    easing: EASE_BACK,
  });
  const draw = interpolate(frame, [start + 3, start + 11], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const ring = interpolate(frame, [start + 4, start + 20], [0, 1], CLAMP);

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `4px solid ${COLORS.green}`,
          scale: String(1 + ring * 0.8),
          opacity: ring > 0 && ring < 1 ? 1 - ring : 0,
        }}
      />
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ scale: String(pop), position: "absolute" }}
      >
        <circle cx="50" cy="50" r="47" fill="#FFFFFF" />
        <circle cx="50" cy="50" r="40" fill={COLORS.green} />
        <path
          d="M30 52 L44 66 L71 37"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="70"
          strokeDashoffset={70 * (1 - draw)}
        />
      </svg>
    </div>
  );
};
