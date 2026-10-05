import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_BACK, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { CheckIcon } from "../../loadcombos/components/CheckIcon";
import { Sfx } from "../../loadcombos/components/Sfx";
import { TechBackground } from "../../loadcombos/components/TechBackground";
import { BEBAS_RU, GILROY } from "../fonts";
import { ScrambleNumber } from "../components/ScrambleNumber";

// LOAD #3 builds up from the setup: each vehicle stacks on and the readout
// recalculates, then the margin splits off the total as its own figure.
// Rows land on «Rivian», «Tesla», «и Chevy Equinox».
const ROWS = [
  { img: "rivian", label: "RIVIAN", at: 4 },
  { img: "tesla", label: "TESLA", at: 22 },
  { img: "chevrolet", label: "CHEVY EQUINOX", at: 38 },
];
const LOCK = 98; // «…двадцать четыре триста сорок восемь.»
const SPLIT = 160; // «…тысяча шестьсот пятьдесят два фунта.»
const ROW = { top: 500, height: 200, gap: 28, left: 90, width: 900 };
const TOTAL_Y = 165;
const MARGIN_Y = 1215;

const VehicleRow: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { img, label, at } = ROWS[index];
  const p = interpolate(frame, [at, at + 9], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const car = interpolate(frame, [at + 2, at + 12], [0, 1], { ...CLAMP, easing: EASE_BACK });

  return (
    <div
      style={{
        position: "absolute",
        left: ROW.left,
        top: ROW.top + index * (ROW.height + ROW.gap),
        width: ROW.width,
        height: ROW.height,
        background: COLORS.white,
        borderRadius: 10,
        boxShadow: "0 16px 34px rgba(0,0,0,0.3)",
        overflow: "hidden",
        opacity: p,
        translate: `0 ${(1 - p) * 220}px`,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 12, background: COLORS.red }} />
      <Img
        src={staticFile(`ad2/img/${img}.png`)}
        style={{
          position: "absolute",
          left: 34,
          bottom: 14,
          width: 400,
          height: ROW.height - 28,
          objectFit: "contain",
          objectPosition: "center bottom",
          translate: `0 ${(1 - car) * 40}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 460,
          right: 20,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          fontFamily: BEBAS_RU,
          fontSize: label.length > 8 ? 84 : 110,
          lineHeight: 1,
          paddingTop: 10,
          color: COLORS.navy,
        }}
      >
        <span style={{ color: COLORS.red, marginRight: 16 }}>+</span>
        {label}
      </div>
      <Sfx at={at} name="lock" volume={0.24} />
    </div>
  );
};

export const Load3Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [SPLIT, SPLIT + 14], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const splitStarted = frame >= SPLIT;
  const glow = interpolate(frame, [LOCK, LOCK + 4, LOCK + 24], [0, 1, 0.25], CLAMP);

  return (
    <AbsoluteFill>
      <TechBackground />

      {/* Running total */}
      <div
        style={{
          position: "absolute",
          top: TOTAL_Y,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: GILROY,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: "0.24em",
            color: "#8CC8FF",
          }}
        >
          {frame < ROWS[0].at ? "СЕТАП" : "СЕТАП + МАШИНЫ"}
        </div>
        <ScrambleNumber
          initial="12,500 LB"
          value="24,348 LB"
          startAt={ROWS[0].at}
          bursts={ROWS.map((r) => r.at)}
          lockAt={LOCK}
          seed="ru-load3"
          style={{
            fontFamily: BEBAS_RU,
            fontSize: 220,
            lineHeight: 1,
            marginTop: 6,
            color: frame >= LOCK ? COLORS.white : "#DDEBFA",
            scale: String(punch(frame, LOCK, 0.14, 2, 9)),
            textShadow: `0 0 ${glow * 50}px rgba(120,190,255,0.8)`,
          }}
        />
      </div>

      {ROWS.map((_, i) => (
        <VehicleRow key={i} index={i} />
      ))}

      {/* Margin peels off the total and becomes its own figure */}
      {splitStarted ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: interpolate(split, [0, 1], [TOTAL_Y + 80, MARGIN_Y]),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            scale: String(interpolate(split, [0, 1], [0.45, 1]) * punch(frame, SPLIT + 14, 0.1, 2, 9)),
            opacity: interpolate(frame, [SPLIT, SPLIT + 3], [0, 1], CLAMP),
            filter: `blur(${interpolate(split, [0, 0.5, 1], [0, 6, 0])}px)`,
          }}
        >
          <div style={{ fontFamily: BEBAS_RU, fontSize: 220, lineHeight: 1, color: COLORS.yellow }}>1,652 LB</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6 }}>
            <CheckIcon start={SPLIT + 12} size={70} />
            <div style={{ fontFamily: BEBAS_RU, fontSize: 90, lineHeight: 1, paddingTop: 8, color: COLORS.white }}>
              ДО ЛИМИТА
            </div>
          </div>
        </div>
      ) : null}

      <Sfx at={ROWS[0].at} name="count" volume={0.22} />
      <Sfx at={ROWS[1].at} name="count" volume={0.22} />
      <Sfx at={ROWS[2].at} name="count" volume={0.22} />
      <Sfx at={LOCK - 30} name="roulette" volume={0.16} />
      <Sfx at={LOCK} name="impact-strong" volume={0.42} />
      <Sfx at={SPLIT} name="whoosh-deep" volume={0.24} />
      <Sfx at={SPLIT + 13} name="bass-hit" volume={0.42} />
    </AbsoluteFill>
  );
};
