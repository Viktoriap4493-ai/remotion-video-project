import React from "react";
import { random, useCurrentFrame } from "remotion";

// "Calculating" readout: digits churn while the calculation runs (faster
// right after each `bursts` frame) and lock left-to-right onto `value`,
// the last digit landing on `lockAt`. Non-digit characters stay fixed.
export const ScrambleNumber: React.FC<{
  initial: string;
  value: string;
  startAt: number;
  bursts: number[];
  lockAt: number;
  seed: string;
  style?: React.CSSProperties;
}> = ({ initial, value, startAt, bursts, lockAt, seed, style }) => {
  const frame = useCurrentFrame();
  if (frame < startAt) return <span style={style}>{initial}</span>;

  const inBurst = bursts.some((b) => frame >= b && frame < b + 9);
  // Between bursts the readout ticks over slowly; inside a burst every frame.
  const tickFrame = inBurst ? frame : Math.floor(frame / 4) * 4;
  const digitSlots = value.split("").filter((c) => /\d/.test(c)).length;
  let digitIndex = -1;

  return (
    <span style={{ display: "inline-flex", whiteSpace: "pre", ...style }}>
      {value.split("").map((c, i) => {
        if (!/\d/.test(c)) return <span key={i}>{c}</span>;
        digitIndex++;
        const lockFrame = lockAt - (digitSlots - 1 - digitIndex) * 2;
        const locked = frame >= lockFrame;
        const shown = locked ? c : String(Math.floor(random(`${seed}-${i}-${tickFrame}`) * 10));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: "0.46em",
              textAlign: "center",
              // Unlocked digits read as "calculating", never as a figure.
              opacity: locked ? 1 : 0.45,
              filter: locked ? undefined : "blur(4px)",
              translate: locked ? undefined : `0 ${(random(`${seed}-y-${i}-${tickFrame}`) - 0.5) * 0.25}em`,
            }}
          >
            {shown}
          </span>
        );
      })}
    </span>
  );
};
