import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";

export type TypeSpan = { text: string; style?: React.CSSProperties };

// Hard "printed" reveal: each character stamps in at full size from 160%,
// one every `rate` frames. Spans keep their own styling (e.g. a highlighted
// number). A key clack plays on every other character.
export const Typewriter: React.FC<{
  start: number;
  spans: TypeSpan[];
  rate?: number;
  style?: React.CSSProperties;
}> = ({ start, spans, rate = 1.6, style }) => {
  const frame = useCurrentFrame();
  let n = 0;

  return (
    <div style={{ whiteSpace: "pre", ...style }}>
      {spans.map((span, si) => (
        <span key={si} style={{ display: "inline-block", ...span.style }}>
          {span.text.split("").map((ch, ci) => {
            const at = start + n * rate;
            const key = n;
            n++;
            const p = interpolate(frame, [at, at + 2], [0, 1], CLAMP);
            return (
              <span
                key={ci}
                style={{
                  display: "inline-block",
                  opacity: p > 0 ? 1 : 0,
                  scale: String(interpolate(p, [0, 1], [1.6, 1])),
                  filter: `blur(${(1 - p) * 3}px)`,
                }}
              >
                {ch === " " ? "\u00A0" : ch}
                {ch !== " " && key % 2 === 0 ? <Sfx at={at} name="type" volume={0.16} /> : null}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};
