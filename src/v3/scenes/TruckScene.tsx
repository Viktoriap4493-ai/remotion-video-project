import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS } from "../../loadcombos/fonts";
import { Outline } from "../components/Outline";
import { PhotoStage } from "../components/PhotoStage";
import { ScanSwap } from "../components/ScanSwap";
import { WeightHeader } from "../components/WeightHeader";
import { D4U_TRUCK, PHOTOS, STANDARD_TRUCK } from "../shapes";

// 9.png (standard truck) → 8.png (Drive4USA truck).
const SPOKEN_8300 = 34; // "…from eight thousand three hundred"
const SPLIT = 60;
const ROLL = [68, 72]; // 8→7, 3→4 on "…down to seven thousand four hundred…"
const MERGE = 84;
const DELTA = 90;
const SWAP = 98;

const CHARS_FROM = ["8", ",", "3", "0", "0"];
const CHARS_TO = ["7", ",", "4", "0", "0"];

// 8 | 3 | 0 | 0 pulls apart into cells, the changed cells roll to the new
// digit, and the readout snaps back together as 7,400.
const SplitNumber: React.FC = () => {
  const frame = useCurrentFrame();
  const spread =
    interpolate(frame, [SPLIT, SPLIT + 6], [0, 1], { ...CLAMP, easing: EASE_OUT }) *
    (1 - interpolate(frame, [MERGE, MERGE + 5], [0, 1], { ...CLAMP, easing: EASE_IN_OUT }));
  let rollIndex = -1;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        fontFamily: BEBAS,
        fontSize: 200,
        lineHeight: 1,
        color: COLORS.white,
        scale: String(punch(frame, SPOKEN_8300, 0.08, 3, 9) * punch(frame, MERGE + 5, 0.12, 2, 8)),
      }}
    >
      {CHARS_FROM.map((from, i) => {
        const to = CHARS_TO[i];
        const changes = from !== to;
        if (changes) rollIndex++;
        const at = changes ? ROLL[rollIndex] : 0;
        const r = changes ? interpolate(frame, [at, at + 8], [0, 1], { ...CLAMP, easing: EASE_IN_OUT }) : 0;
        const isComma = from === ",";
        return (
          <div
            key={i}
            style={{
              position: "relative",
              height: "1em",
              width: isComma ? "0.18em" : "0.42em",
              margin: `0 ${spread * 22}px`,
              overflow: "hidden",
              textAlign: "center",
              opacity: isComma ? 1 - spread : 1,
              outline: spread > 0.05 && !isComma ? `3px solid rgba(255,255,255,${spread * 0.5})` : undefined,
              outlineOffset: 6,
              background: changes && spread > 0 ? `rgba(227,16,27,${spread * 0.35})` : undefined,
            }}
          >
            <div style={{ translate: `0 ${-r}em`, filter: r > 0 && r < 1 ? "blur(3px)" : undefined }}>
              <div style={{ height: "1em" }}>{from}</div>
              <div style={{ height: "1em", color: changes ? COLORS.white : undefined }}>{to}</div>
            </div>
          </div>
        );
      })}
      <div style={{ marginLeft: "0.2em" }}>LB</div>
      {ROLL.map((at) => (
        <Sfx key={at} at={at} name="lock" volume={0.26} />
      ))}
    </div>
  );
};

export const TruckScene: React.FC = () => {
  const frame = useCurrentFrame();
  const after = frame >= SWAP + 6;
  const { standardTruck: a, d4uTruck: b } = PHOTOS;

  return (
    <AbsoluteFill>
      <ScanSwap
        at={SWAP}
        before={
          <PhotoStage
            src={a.src}
            width={a.width}
            height={a.height}
            camera={{ start: 0, end: SWAP + 10, from: { scale: 1.02, x: 340, y: 810 }, to: { scale: 1.22, x: 340, y: 810 } }}
          >
            <Outline id="std-truck" points={STANDARD_TRUCK} width={a.width} height={a.height} start={6} duration={20} />
          </PhotoStage>
        }
        after={
          <PhotoStage
            src={b.src}
            width={b.width}
            height={b.height}
            camera={{ start: SWAP, end: SWAP + 34, from: { scale: 1.12, x: 650, y: 980 }, to: { scale: 1.0, x: 650, y: 980 } }}
          >
            <Outline id="d4u-truck" points={D4U_TRUCK} width={b.width} height={b.height} start={SWAP + 8} duration={16} />
          </PhotoStage>
        }
      />

      <WeightHeader
        label={after ? "DRIVE4USA TRUCK" : "STANDARD TRUCK"}
        labelKey={after ? "b" : "a"}
        labelAt={after ? SWAP + 6 : 2}
        delta="−900 LB"
        deltaAt={DELTA}
        caption="TRUCK WEIGHT"
        captionAt={DELTA + 3}
        number={
          <div style={{ opacity: interpolate(frame, [2, 6], [0, 1], CLAMP) }}>
            <SplitNumber />
          </div>
        }
      />

      <Sfx at={0} name="whoosh-fast" volume={0.24} />
      <Sfx at={6} name="scan" volume={0.22} />
      <Sfx at={SPLIT} name="ui-click" volume={0.3} />
      <Sfx at={MERGE + 4} name="punch" volume={0.34} />
      <Sfx at={SWAP} name="whoosh-fast" volume={0.26} />
      <Sfx at={SWAP + 22} name="hard-stop" volume={0.28} />
    </AbsoluteFill>
  );
};
