import React from "react";
import { Easing, Img, interpolate, useCurrentFrame } from "remotion";
import { ASSETS } from "./assets";
import { GILROY, WEIGHT } from "./fonts";
import { clamp } from "./motion";
import { COLORS, SHADOWS } from "./tokens";

// Red push-pin next to each advantage (the client chose a pin, not a clip).
export const PushPin: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
    <g transform="rotate(40 32 32)">
      <rect x="29.5" y="36" width="5" height="24" rx="2" fill="#9aa3ad" />
      <path d="M20 10 h24 l-4 14 l8 10 H16 l8-10z" fill="#e5322d" />
      <rect x="18" y="6" width="28" height="7" rx="3.5" fill="#c41e1a" />
    </g>
  </svg>
);

const SWAP = 12;

// Advantages in caps, one at a time: the current line leaves left as the
// next one arrives from the right. `at` values are frame-local; pair each
// with a mouse click from ASSETS.audio.click.
export const AdvantageSwipe: React.FC<{ items: { text: string; at: number }[]; top?: number }> = ({ items, top = 542 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {items.map(({ text, at }, i) => {
        const next = items[i + 1]?.at;
        if (frame < at || (next !== undefined && frame > next + SWAP)) {
          return null;
        }
        const enter = interpolate(frame, [at, at + SWAP], [1080, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
        const exit =
          next === undefined ? 0 : interpolate(frame, [next, next + SWAP], [0, -1080], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <div
            key={text}
            style={{
              position: "absolute",
              top,
              width: "100%",
              transform: `translate(${enter + exit}px, -50%)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              whiteSpace: "nowrap",
              fontFamily: GILROY,
              fontWeight: WEIGHT.medium,
              fontSize: 39,
              color: COLORS.white,
              textShadow: SHADOWS.text,
            }}
          >
            <PushPin />
            <span style={{ whiteSpace: "pre-line", textAlign: "center", lineHeight: 1.2 }}>{text}</span>
          </div>
        );
      })}
    </>
  );
};

// Benefits band: blue strip of "• …" items, wiping open from the left.
export const BenefitsBand: React.FC<{ items: string[]; start?: number; top?: number }> = ({ items, start = 0, top = 1418 }) => {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, [start, start + 9], [100, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: 1080,
        height: 78,
        backgroundColor: COLORS.blue,
        clipPath: `inset(0 ${wipe}% 0 0)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 34,
        fontFamily: GILROY,
        fontWeight: WEIGHT.medium,
        fontSize: 36,
        color: COLORS.white,
        whiteSpace: "nowrap",
      }}
    >
      {items.map((item, i) => (
        <span key={item} style={{ opacity: interpolate(frame, [start + 5 + i * 4, start + 11 + i * 4], [0, 1], clamp) }}>
          • {item}
        </span>
      ))}
    </div>
  );
};

// Icon + two-line benefit in a 2×2 grid (the SMAS info block).
const ICONS = { drop: ASSETS.icons.drop, waves: ASSETS.icons.waves, loop: ASSETS.icons.loop, check: ASSETS.icons.check };

export const BenefitGrid: React.FC<{
  items: { icon: keyof typeof ICONS; text: string }[];
  top?: number;
}> = ({ items, top = 1166 }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 100,
      right: 60,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      rowGap: 26,
      columnGap: 40,
    }}
  >
    {items.map((item) => (
      <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <Img
          src={ICONS[item.icon]}
          style={{
            width: 42,
            // white masks tinted to the brand's light blue
            filter: "brightness(0) saturate(100%) invert(72%) sepia(29%) saturate(1095%) hue-rotate(194deg) brightness(99%) contrast(92%)",
          }}
        />
        <div
          style={{
            whiteSpace: "pre-line",
            fontFamily: GILROY,
            fontWeight: WEIGHT.medium,
            fontSize: 34,
            lineHeight: 1.08,
            color: COLORS.white,
            textShadow: SHADOWS.text,
          }}
        >
          {item.text}
        </div>
      </div>
    ))}
  </div>
);
