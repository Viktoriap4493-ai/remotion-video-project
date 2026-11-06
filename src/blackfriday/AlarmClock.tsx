import React from "react";
import { BRAND_BLUE } from "./timeline";

// Vector alarm clock drawn in the brand palette; hands are driven by props.
export const AlarmClock: React.FC<{
  size: number;
  minuteAngle: number;
  hourAngle: number;
  ring: number; // 0..1, shakes the bells
}> = ({ size, minuteAngle, hourAngle, ring }) => {
  const shake = Math.sin(ring * Math.PI * 14) * 6 * ring;
  return (
    <svg width={size} height={size} viewBox="0 0 400 400">
      <defs>
        <radialGradient id="bf-body" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#3f6fe0" />
          <stop offset="55%" stopColor="#1740a8" />
          <stop offset="100%" stopColor={BRAND_BLUE} />
        </radialGradient>
        <radialGradient id="bf-bell" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#5a86ec" />
          <stop offset="100%" stopColor="#12358f" />
        </radialGradient>
        <radialGradient id="bf-face" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dfe7f7" />
        </radialGradient>
        <linearGradient id="bf-metal" x1="0" x2="1">
          <stop offset="0%" stopColor="#8e98a8" />
          <stop offset="50%" stopColor="#eef1f6" />
          <stop offset="100%" stopColor="#7d8796" />
        </linearGradient>
      </defs>
      {/* legs */}
      <path d="M128 318 L98 368" stroke="url(#bf-metal)" strokeWidth="14" strokeLinecap="round" />
      <path d="M272 318 L302 368" stroke="url(#bf-metal)" strokeWidth="14" strokeLinecap="round" />
      {/* handle */}
      <path
        d="M120 92 Q200 22 280 92"
        stroke="url(#bf-metal)"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      {/* bells */}
      <g transform={`rotate(${-24 + shake} 130 108)`}>
        <path d="M78 118 A58 58 0 0 1 182 118 Z" fill="url(#bf-bell)" />
        <rect x="124" y="54" width="12" height="16" rx="4" fill="url(#bf-metal)" />
      </g>
      <g transform={`rotate(${24 - shake} 270 108)`}>
        <path d="M218 118 A58 58 0 0 1 322 118 Z" fill="url(#bf-bell)" />
        <rect x="264" y="54" width="12" height="16" rx="4" fill="url(#bf-metal)" />
      </g>
      <rect x="194" y="68" width="12" height="26" rx="4" fill="url(#bf-metal)" />
      {/* body */}
      <circle cx="200" cy="222" r="130" fill="url(#bf-body)" />
      <circle cx="200" cy="222" r="108" fill="url(#bf-face)" />
      <ellipse cx="160" cy="160" rx="50" ry="22" fill="#ffffff" opacity="0.35" transform="rotate(-30 160 160)" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r1 = i % 3 === 0 ? 84 : 90;
        return (
          <line
            key={i}
            x1={200 + Math.sin(a) * r1}
            y1={222 - Math.cos(a) * r1}
            x2={200 + Math.sin(a) * 98}
            y2={222 - Math.cos(a) * 98}
            stroke={BRAND_BLUE}
            strokeWidth={i % 3 === 0 ? 6 : 3}
            strokeLinecap="round"
          />
        );
      })}
      <line
        x1="200"
        y1="222"
        x2={200 + Math.sin((hourAngle * Math.PI) / 180) * 52}
        y2={222 - Math.cos((hourAngle * Math.PI) / 180) * 52}
        stroke={BRAND_BLUE}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <line
        x1="200"
        y1="222"
        x2={200 + Math.sin((minuteAngle * Math.PI) / 180) * 78}
        y2={222 - Math.cos((minuteAngle * Math.PI) / 180) * 78}
        stroke="#3d6be0"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="200" cy="222" r="9" fill={BRAND_BLUE} />
    </svg>
  );
};
