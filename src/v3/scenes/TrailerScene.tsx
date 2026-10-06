import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_IN, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS } from "../../loadcombos/fonts";
import { StepCounter } from "../../ru/components/StepCounter";
import { Outline } from "../components/Outline";
import { PhotoStage } from "../components/PhotoStage";
import { ScanSwap } from "../components/ScanSwap";
import { WeightHeader } from "../components/WeightHeader";
import { D4U_TRAILER, PHOTOS, STANDARD_TRAILER } from "../shapes";

// 7.png (standard Kaufman Dually) → 10.png (Drive4USA trailer).
const TRACE = 8;
const SPOKEN_7600 = 92; // "…around seven thousand six hundred…"
const COUNT = [118, 122, 126, 132]; // "…down to five thousand one hundred."
const DELTA = 136;
const SWAP = 142;

// Red slivers peel off the trailer while the counter drops: excess weight.
const Shed: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: 14 }).map((_, i) => {
        const start = COUNT[0] + (i % 7) * 2;
        const t = interpolate(frame, [start, start + 14], [0, 1], { ...CLAMP, easing: EASE_IN });
        if (t <= 0 || t >= 1) return null;
        const x0 = 540 + (random(`shed-x-${i}`) - 0.3) * 520;
        const y0 = 1120 + random(`shed-y-${i}`) * 60;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 + (random(`shed-dx-${i}`) - 0.5) * 300 * t,
              top: y0 + t * 520,
              width: 34,
              height: 8,
              background: COLORS.red,
              opacity: 1 - t,
              rotate: `${random(`shed-r-${i}`) * 360 * t}deg`,
              boxShadow: "0 0 10px rgba(227,16,27,0.8)",
            }}
          />
        );
      })}
    </>
  );
};

export const TrailerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const after = frame >= SWAP + 6;
  const { standardTrailer: a, d4uTrailer: b } = PHOTOS;

  return (
    <AbsoluteFill>
      <ScanSwap
        at={SWAP}
        before={
          <PhotoStage
            src={a.src}
            width={a.width}
            height={a.height}
            camera={{ start: 0, end: SWAP + 10, from: { scale: 1, x: 800, y: 900 }, to: { scale: 1.3, x: 800, y: 900 } }}
          >
            <Outline id="std-trailer" points={STANDARD_TRAILER} width={a.width} height={a.height} start={TRACE} duration={22} />
          </PhotoStage>
        }
        after={
          <PhotoStage
            src={b.src}
            width={b.width}
            height={b.height}
            camera={{ start: SWAP, end: SWAP + 40, from: { scale: 1.12, x: 650, y: 950 }, to: { scale: 1.0, x: 650, y: 950 } }}
          >
            <Outline id="d4u-trailer" points={D4U_TRAILER} width={b.width} height={b.height} start={SWAP + 8} duration={16} />
          </PhotoStage>
        }
      />
      <Shed />

      <WeightHeader
        label={after ? "DRIVE4USA TRAILER" : "STANDARD KAUFMAN DUALLY"}
        labelKey={after ? "b" : "a"}
        labelAt={after ? SWAP + 6 : 2}
        delta="−2,500 LB"
        deltaAt={DELTA}
        caption="TRAILER WEIGHT"
        captionAt={DELTA + 3}
        number={
          <StepCounter
            lockPunch={0.14}
            sfx={false}
            style={{
              fontFamily: BEBAS,
              fontSize: 200,
              color: frame >= COUNT[3] ? COLORS.white : "#E8F1FA",
              scale: String(punch(frame, SPOKEN_7600, 0.08, 3, 9)),
            }}
            steps={[
              { at: 4, value: "7,600 LB" },
              { at: COUNT[0], value: "7,100 LB" },
              { at: COUNT[1], value: "6,500 LB" },
              { at: COUNT[2], value: "5,900 LB" },
              { at: COUNT[3], value: "5,100 LB" },
            ]}
          />
        }
      />

      <Sfx at={TRACE} name="scan" volume={0.22} />
      <Sfx at={SPOKEN_7600} name="tick" volume={0.2} />
      {COUNT.map((at, i) => (
        <Sfx key={at} at={at} name={i === COUNT.length - 1 ? "lock" : "tick"} volume={i === COUNT.length - 1 ? 0.34 : 0.24} />
      ))}
      <Sfx at={COUNT[0] - 2} name="count" volume={0.2} />
      <Sfx at={DELTA} name="punch" volume={0.3} />
      <Sfx at={SWAP} name="whoosh-fast" volume={0.26} />
      <Sfx at={SWAP + 22} name="hard-stop" volume={0.3} />
    </AbsoluteFill>
  );
};
