import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_IN_OUT } from "../../loadcombos/anim";

export type Point = [number, number];

// Red inspection contour traced around a vehicle. Coordinates are in the
// source image's pixel space; the SVG shares the image's viewBox so the
// contour follows any camera move applied to their common parent.
export const Outline: React.FC<{
  id: string;
  points: Point[];
  width: number;
  height: number;
  start: number;
  duration?: number;
  fadeOutAt?: number;
  scan?: boolean;
}> = ({ id, points, width, height, start, duration = 20, fadeOutAt, scan = true }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [start, start + duration], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const settled = frame - (start + duration);
  const pulse = settled > 0 ? 0.65 + 0.35 * Math.cos(settled / 5) : 1;
  const fade = fadeOutAt === undefined ? 1 : interpolate(frame, [fadeOutAt, fadeOutAt + 8], [1, 0], CLAMP);
  if (frame < start || fade <= 0) return null;

  const d = `M ${points.map((p) => p.join(" ")).join(" L ")} Z`;
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const box = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  const scanX = interpolate(frame, [start + duration, start + duration + 18], [box.x, box.x + box.w], CLAMP);
  const scanOn = scan && frame >= start + duration && frame < start + duration + 18;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", opacity: fade }}
    >
      <defs>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={`${id}-clip`}>
          <path d={d} />
        </clipPath>
      </defs>
      {/* Faint fill once traced */}
      <path d={d} fill={COLORS.red} opacity={draw >= 1 ? 0.08 * pulse : 0} />
      <path
        d={d}
        fill="none"
        stroke={COLORS.red}
        strokeWidth={width / 180}
        strokeLinejoin="round"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - draw}
        opacity={pulse}
        filter={`url(#${id}-glow)`}
      />
      {scanOn ? (
        <rect
          x={scanX - width / 120}
          y={box.y}
          width={width / 60}
          height={box.h}
          fill="white"
          opacity={0.55}
          clipPath={`url(#${id}-clip)`}
        />
      ) : null}
      {/* Corner ticks on the bounding box: inspection frame */}
      {draw >= 1
        ? [
            [box.x, box.y, 1, 1],
            [box.x + box.w, box.y, -1, 1],
            [box.x, box.y + box.h, 1, -1],
            [box.x + box.w, box.y + box.h, -1, -1],
          ].map(([x, y, sx, sy], i) => (
            <path
              key={i}
              d={`M ${x - sx * 14} ${y + sy * 40} L ${x - sx * 14} ${y - sy * 14} L ${x + sx * 40} ${y - sy * 14}`}
              fill="none"
              stroke="white"
              strokeWidth={width / 360}
              opacity={0.8}
            />
          ))
        : null}
    </svg>
  );
};
