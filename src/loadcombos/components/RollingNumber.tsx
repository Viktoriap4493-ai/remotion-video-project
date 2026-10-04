import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { CLAMP } from "../anim";

// Fast spin that brakes hard into the final digit (no soft ease-out tail).
const SPIN_EASE = Easing.bezier(0.3, 0.45, 0.55, 1);

const reelPosition = (
  frame: number,
  start: number,
  land: number,
  from: number,
  to: number,
  spins: number,
) => {
  const total = spins * 10 + ((to - from + 10) % 10);
  const p = interpolate(frame, [start, land], [0, 1], {
    ...CLAMP,
    easing: SPIN_EASE,
  });
  // Mechanical clack: the reel kicks 12% past the digit and snaps back.
  const kick = interpolate(frame, [land, land + 2, land + 5], [0, 0.12, 0], CLAMP);
  return from + total * p + kick;
};

const Reel: React.FC<{
  digit: number;
  from: number;
  start: number;
  land: number;
  spins: number;
  filterId: string;
}> = ({ digit, from, start, land, spins, filterId }) => {
  const frame = useCurrentFrame();
  const pos = reelPosition(frame, start, land, from, digit, spins);
  const velocity = Math.abs(pos - reelPosition(frame - 1, start, land, from, digit, spins));
  // Vertical-only blur scaled to the reel speed (em-relative via percentage).
  const blur = Math.min(velocity * 9, 26);
  const offset = ((pos % 10) + 10) % 10;

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        width: "0.42em",
        height: "1em",
        overflow: "hidden",
        verticalAlign: "top",
      }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={filterId} x="0" y="-50%" width="100%" height="200%">
          <feGaussianBlur stdDeviation={`0 ${blur}`} />
        </filter>
      </svg>
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          display: "flex",
          flexDirection: "column",
          translate: `0 ${-offset}em`,
          filter: blur > 0.5 ? `url(#${filterId})` : undefined,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
          <span key={i} style={{ height: "1em", lineHeight: "1em", textAlign: "center" }}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
};

// Renders `value` with every digit on its own reel. Digits start from the
// matching digit of `fromValue` (so one total can roll into the next) and
// land left-to-right, the last one exactly on `land`.
export const RollingNumber: React.FC<{
  value: string;
  fromValue?: string;
  start: number;
  land: number;
  idPrefix: string;
  spins?: number;
  stagger?: number;
  style?: React.CSSProperties;
}> = ({ value, fromValue, start, land, idPrefix, spins = 2, stagger = 2, style }) => {
  const chars = value.split("");
  const digitCount = chars.filter((c) => /\d/.test(c)).length;
  let digitIndex = -1;

  return (
    <span style={{ display: "inline-flex", lineHeight: "1em", whiteSpace: "pre", ...style }}>
      {chars.map((c, i) => {
        if (!/\d/.test(c)) {
          return (
            <span key={i} style={{ height: "1em", lineHeight: "1em" }}>
              {c}
            </span>
          );
        }
        digitIndex++;
        const fromChar = fromValue?.[i];
        const from = fromChar && /\d/.test(fromChar) ? Number(fromChar) : 0;
        return (
          <Reel
            key={i}
            digit={Number(c)}
            from={from}
            start={start}
            land={land - (digitCount - 1 - digitIndex) * stagger}
            spins={spins + (digitCount - 1 - digitIndex === 0 ? 1 : 0)}
            filterId={`${idPrefix}-${i}`}
          />
        );
      })}
    </span>
  );
};
