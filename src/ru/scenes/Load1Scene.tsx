import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_BACK, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { TechBackground } from "../../loadcombos/components/TechBackground";
import { BEBAS_RU, BRITTANY, GILROY } from "../fonts";
import { ScrambleNumber } from "../components/ScrambleNumber";

// LOAD #1: the screen splits into three vertical sections, each vehicle is
// revealed from behind a sliding mask, then the sections compress into one
// row and the maths plays out underneath.
const SECTIONS = [
  { img: "ford", name: "Ford F-150", at: 6 },
  { img: "ford", name: "Ford F-150", at: 14 },
  { img: "toyota", name: "Toyota Corolla", at: 22 },
];
const COMPRESS = 58;
const CARGO = 76;
const SETUP_LINE = 88;
const TOTAL_LOCK = 106; // «…двадцать пять триста тридцать семь.»
const LIMIT = 170; // «…шестьсот шестьдесят три фунта.»

const TALL = { top: 0, height: 1920, width: 356, gap: 6 };
const ROW = { top: 190, height: 330, width: 300, gap: 30 };

const Section: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { img, name, at } = SECTIONS[index];
  const reveal = interpolate(frame, [at, at + 9], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const c = interpolate(frame, [COMPRESS, COMPRESS + 16], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const write = interpolate(frame, [at + 12, at + 24], [0, 1], CLAMP);

  const rowLeft = (1080 - (ROW.width * 3 + ROW.gap * 2)) / 2 + index * (ROW.width + ROW.gap);
  const left = interpolate(c, [0, 1], [index * (TALL.width + TALL.gap), rowLeft]);
  const width = interpolate(c, [0, 1], [TALL.width, ROW.width]);
  const top = interpolate(c, [0, 1], [TALL.top, ROW.top]);
  const height = interpolate(c, [0, 1], [TALL.height, ROW.height]);
  const carTop = interpolate(c, [0, 1], [720, 30]);
  const carHeight = interpolate(c, [0, 1], [230, 190]);
  const nameTop = interpolate(c, [0, 1], [990, 240]);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        background: "linear-gradient(180deg, #FFFFFF 0%, #EEF3F8 100%)",
        borderRadius: c * 14,
        overflow: "hidden",
        boxShadow: c > 0 ? `0 ${18 * c}px ${36 * c}px rgba(0,0,0,0.35)` : undefined,
        // Lateral mask: the section opens left → right.
        clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
      }}
    >
      <Img
        src={staticFile(`ad2/img/${img}.png`)}
        style={{
          position: "absolute",
          left: "4%",
          width: "92%",
          top: carTop,
          height: carHeight,
          objectFit: "contain",
          translate: `${(1 - reveal) * -120}px 0`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: nameTop,
          textAlign: "center",
          fontFamily: BRITTANY,
          fontSize: interpolate(c, [0, 1], [56, 48]),
          color: COLORS.navy,
          whiteSpace: "nowrap",
          clipPath: `inset(-30% ${(1 - write) * 100}% -30% 0)`,
        }}
      >
        {name}
      </div>
      <Sfx at={at} name="ui-click" volume={0.32} />
      <Sfx at={at + 12} name="pen" volume={0.18} />
    </div>
  );
};

export const Load1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const cargoIn = interpolate(frame, [CARGO, CARGO + 8], [0, 1], { ...CLAMP, easing: EASE_BACK });
  const setupIn = interpolate(frame, [SETUP_LINE, SETUP_LINE + 7], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const rule = interpolate(frame, [SETUP_LINE + 4, SETUP_LINE + 12], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const limitIn = interpolate(frame, [LIMIT, LIMIT + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });

  return (
    <AbsoluteFill>
      <TechBackground />
      {SECTIONS.map((_, i) => (
        <Section key={i} index={i} />
      ))}

      {/* Calculation, centred under the compressed row */}
      <div
        style={{
          position: "absolute",
          top: 590,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: BEBAS_RU,
          lineHeight: 1,
          color: COLORS.white,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 26,
            opacity: cargoIn > 0 ? 1 : 0,
            scale: String(interpolate(cargoIn, [0, 1], [0.6, 1])),
          }}
        >
          <span style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 34, letterSpacing: "0.16em", color: "#8CC8FF" }}>
            ВЕС МАШИН
          </span>
          <span style={{ fontSize: 150 }}>12,837 LB</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 26,
            marginTop: 10,
            opacity: setupIn,
            translate: `${(1 - setupIn) * 80}px 0`,
          }}
        >
          <span style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 34, letterSpacing: "0.16em", color: "#8CC8FF" }}>
            + СЕТАП
          </span>
          <span style={{ fontSize: 150, color: "#BFD9F2" }}>12,500 LB</span>
        </div>
        <div style={{ width: 860 * rule, height: 5, background: COLORS.white, margin: "26px 0 20px" }} />
        {frame >= SETUP_LINE + 8 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 36, letterSpacing: "0.22em", color: COLORS.white }}>
              ОБЩИЙ ВЕС
            </span>
            <ScrambleNumber
              initial="25,337 LB"
              value="25,337 LB"
              startAt={SETUP_LINE + 8}
              bursts={[SETUP_LINE + 8]}
              lockAt={TOTAL_LOCK}
              seed="ru-load1"
              style={{
                fontSize: 220,
                color: COLORS.yellow,
                marginTop: 4,
                scale: String(punch(frame, TOTAL_LOCK, 0.14, 2, 9)),
              }}
            />
          </div>
        ) : null}
      </div>

      {/* Final margin */}
      <div
        style={{
          position: "absolute",
          left: 60,
          width: 960,
          top: 1400,
          height: 170,
          borderRadius: 999,
          background: COLORS.red,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          fontFamily: BEBAS_RU,
          lineHeight: 1,
          opacity: limitIn,
          scale: String(interpolate(limitIn, [0, 1], [1.5, 1]) * punch(frame, LIMIT + 8, 0.12, 2, 9)),
          filter: `blur(${(1 - limitIn) * 10}px)`,
          boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ fontSize: 150, color: COLORS.yellow, paddingTop: 12 }}>663 LB</span>
        <span style={{ fontSize: 100, color: COLORS.white, paddingTop: 10 }}>ДО ЛИМИТА</span>
      </div>

      <Sfx at={COMPRESS} name="whoosh-soft" volume={0.28} />
      <Sfx at={COMPRESS + 15} name="card-thud" volume={0.3} />
      <Sfx at={CARGO} name="tick" volume={0.26} />
      <Sfx at={SETUP_LINE} name="ui-click" volume={0.26} />
      <Sfx at={SETUP_LINE + 8} name="count" volume={0.26} />
      <Sfx at={TOTAL_LOCK} name="impact-strong" volume={0.4} />
      <Sfx at={LIMIT + 6} name="punch" volume={0.44} />
      <Sfx at={LIMIT + 7} name="bass-hit" volume={0.3} />
    </AbsoluteFill>
  );
};
