import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_OUT, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";

export type Step = { at: number; value: string };

// Digital counter that clicks through fixed readings (e.g. 12,800 → 13,000
// → 13,100 → 13,232): each reading pushes the previous one up and out. The
// last step "locks" with a punch.
export const StepCounter: React.FC<{
  steps: Step[];
  style?: React.CSSProperties;
  lockPunch?: number;
  sfx?: boolean;
}> = ({ steps, style, lockPunch = 0.16, sfx = true }) => {
  const frame = useCurrentFrame();
  let index = -1;
  steps.forEach((s, i) => {
    if (frame >= s.at) index = i;
  });
  if (index < 0) return null;

  const current = steps[index];
  const previous = steps[index - 1];
  const isLast = index === steps.length - 1;
  const p = interpolate(frame, [current.at, current.at + 3], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const last = steps[steps.length - 1];

  return (
    <div
      style={{
        position: "relative",
        lineHeight: 1,
        height: "1em",
        overflow: "hidden",
        whiteSpace: "nowrap",
        scale: String(punch(frame, last.at, lockPunch, 2, 9)),
        ...style,
      }}
    >
      {previous && p < 1 ? (
        <div style={{ position: "absolute", inset: 0, translate: `0 ${-p * 100}%`, opacity: 1 - p, filter: "blur(2px)" }}>
          {previous.value}
        </div>
      ) : null}
      <div
        style={{
          translate: `0 ${(1 - p) * 100}%`,
          filter: `blur(${(1 - p) * 4}px)`,
          opacity: isLast ? 1 : 0.85,
        }}
      >
        {current.value}
      </div>
      {sfx
        ? steps.map((s, i) => (
            <Sfx
              key={s.at}
              at={s.at}
              name={i === steps.length - 1 ? "lock" : "tick"}
              volume={i === steps.length - 1 ? 0.34 : 0.22}
            />
          ))
        : null}
    </div>
  );
};
