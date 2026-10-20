import React from "react";
import { COLORS } from "../../loadcombos/anim";

// Small line icons used as secondary accents. `draw` (0–1) strokes them on.
const stroke = (draw: number) => ({
  fill: "none",
  strokeWidth: 6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  pathLength: 1,
  strokeDasharray: "1",
  strokeDashoffset: 1 - draw,
});

export const DownArrow: React.FC<{ size: number; draw: number; color?: string }> = ({ size, draw, color = COLORS.red }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 60 78">
    <path d="M30 4 V68 M8 46 L30 70 L52 46" stroke={color} {...stroke(draw)} strokeWidth={9} />
  </svg>
);

export const WeightIcon: React.FC<{ size: number; draw: number }> = ({ size, draw }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    <path d="M28 22 a12 12 0 1 1 24 0 M14 26 H66 L74 72 H6 Z" stroke={COLORS.white} {...stroke(draw)} />
    <text x="40" y="60" textAnchor="middle" fontSize="20" fontWeight="800" fill={COLORS.white} opacity={draw}>
      LB
    </text>
  </svg>
);

export const CargoIcon: React.FC<{ size: number; draw: number }> = ({ size, draw }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    <path d="M10 26 L40 12 L70 26 V58 L40 72 L10 58 Z M10 26 L40 40 L70 26 M40 40 V72" stroke={COLORS.white} {...stroke(draw)} />
  </svg>
);

export const PhoneIcon: React.FC<{ size: number; color?: string }> = ({ size, color = COLORS.white }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path
      d="M18 6 L28 18 L22 26 C26 34 30 38 38 42 L46 36 L58 46 L52 58 C30 58 6 34 6 12 Z"
      fill="none"
      stroke={color}
      strokeWidth={5}
      strokeLinejoin="round"
    />
  </svg>
);

export const ChatIcon: React.FC<{ size: number; color?: string }> = ({ size, color = COLORS.white }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M8 10 H56 V42 H26 L14 54 V42 H8 Z" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <path d="M20 26 H44" stroke={color} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

// Truck ── trailer link: two blocks joined by a line that draws across.
export const SetupLink: React.FC<{ draw: number }> = ({ draw }) => (
  <svg width={520} height={90} viewBox="0 0 520 90">
    <rect x="4" y="22" width="120" height="56" rx="8" stroke={COLORS.white} {...stroke(Math.min(1, draw * 2))} />
    <text x="64" y="58" textAnchor="middle" fontSize="20" fontWeight="800" fill={COLORS.white} opacity={draw}>
      TRUCK
    </text>
    <path d="M124 50 H300" stroke={COLORS.red} {...stroke(Math.max(0, draw * 2 - 0.6))} strokeWidth={7} />
    <rect x="300" y="22" width="214" height="56" rx="8" stroke={COLORS.red} {...stroke(Math.max(0, draw * 2 - 1))} />
    <text x="407" y="58" textAnchor="middle" fontSize="20" fontWeight="800" fill={COLORS.white} opacity={Math.max(0, draw * 2 - 1)}>
      TRAILER
    </text>
  </svg>
);
