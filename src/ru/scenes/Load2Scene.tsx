import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_BACK, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { BlueprintBackground } from "../../loadcombos/components/BlueprintBackground";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS_RU, GILROY } from "../fonts";
import { StepCounter } from "../components/StepCounter";
import { VehicleCard } from "../components/VehicleCard";

// LOAD #2 opens on the result, then shows the vehicles behind it.
const CARGO = [4, 10, 16, 22];
const LIFT = 28;
const CARDS = 32;
const CARS = 36;
const TOTAL_PANEL = 78;
const TOTAL = [84, 90, 96, 104]; // «…двадцать пять семьсот тридцать два.»
const LIMIT = 152; // «…двести шестьдесят восемь фунтов.»

const CARD = { left: 90, width: 900, height: 300, top: 430, gap: 40 };

export const Load2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const lift = interpolate(frame, [LIFT, LIFT + 12], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const panel = interpolate(frame, [TOTAL_PANEL, TOTAL_PANEL + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const limit = interpolate(frame, [LIMIT, LIMIT + 9], [0, 1], { ...CLAMP, easing: EASE_BACK });

  return (
    <AbsoluteFill>
      <BlueprintBackground trimBefore={0} />

      {/* Cargo weight: big and centred first, then lifts to the header */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: interpolate(lift, [0, 1], [700, 150]),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          scale: String(interpolate(lift, [0, 1], [1, 0.62])),
          transformOrigin: "50% 0%",
        }}
      >
        <div
          style={{
            fontFamily: GILROY,
            fontWeight: 800,
            fontSize: 46,
            letterSpacing: "0.24em",
            color: COLORS.red,
            opacity: interpolate(frame, [0, 6], [0, 1], CLAMP),
          }}
        >
          ВЕС МАШИН
        </div>
        <StepCounter
          style={{ fontFamily: BEBAS_RU, fontSize: 250, color: COLORS.navy, marginTop: 8 }}
          steps={CARGO.map((at, i) => ({ at, value: ["12,800 LB", "13,000 LB", "13,100 LB", "13,232 LB"][i] }))}
        />
      </div>

      <VehicleCard
        id="ru-l2-a"
        img="rivian"
        name="Rivian Amazon Van"
        left={CARD.left}
        top={CARD.top}
        width={CARD.width}
        height={CARD.height}
        openAt={CARDS}
        carAt={CARS}
        from="left"
        carSfx="car-a"
      />
      <VehicleCard
        id="ru-l2-b"
        img="rivian"
        name="Rivian Amazon Van"
        left={CARD.left}
        top={CARD.top + CARD.height + CARD.gap}
        width={CARD.width}
        height={CARD.height}
        openAt={CARDS + 2}
        carAt={CARS}
        from="right"
        carSfx="car-b"
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 32,
          top: CARD.top + CARD.height + CARD.gap / 2 - 32,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: COLORS.red,
          border: `5px solid ${COLORS.white}`,
          color: COLORS.white,
          fontFamily: GILROY,
          fontWeight: 800,
          fontSize: 48,
          lineHeight: "52px",
          textAlign: "center",
          scale: String(interpolate(frame, [CARS + 16, CARS + 24], [0, 1], { ...CLAMP, easing: EASE_BACK })),
        }}
      >
        +
      </div>

      {/* Setup + vehicles total */}
      <div
        style={{
          position: "absolute",
          left: 90,
          width: 900,
          top: 1120,
          height: 200,
          borderRadius: 18,
          background: COLORS.navy,
          boxShadow: "0 18px 40px rgba(7,28,51,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 50px",
          clipPath: `inset(${(1 - panel) * 50}% 0 ${(1 - panel) * 50}% 0 round 18px)`,
        }}
      >
        <div
          style={{
            fontFamily: GILROY,
            fontWeight: 800,
            fontSize: 38,
            lineHeight: 1.2,
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          ОБЩИЙ
          <br />
          ВЕС
        </div>
        <StepCounter
          style={{ fontFamily: BEBAS_RU, fontSize: 160, color: COLORS.white, paddingTop: 10 }}
          steps={TOTAL.map((at, i) => ({ at, value: ["25,100 LB", "25,400 LB", "25,600 LB", "25,732 LB"][i] }))}
        />
      </div>

      {/* The key beat: margin to the limit */}
      <div
        style={{
          position: "absolute",
          left: 60,
          width: 960,
          top: 1360,
          height: 180,
          borderRadius: 18,
          background: `linear-gradient(180deg, #F0262E 0%, ${COLORS.red} 60%, #BF0912 100%)`,
          boxShadow: `0 0 ${interpolate(frame, [LIMIT + 6, LIMIT + 12, LIMIT + 40], [0, 60, 20], CLAMP)}px rgba(227,16,27,0.6)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          fontFamily: BEBAS_RU,
          lineHeight: 1,
          opacity: limit > 0 ? 1 : 0,
          translate: `0 ${(1 - limit) * 140}px`,
          scale: String(punch(frame, LIMIT + 9, 0.1, 2, 9)),
        }}
      >
        <span style={{ fontSize: 150, color: COLORS.yellow, paddingTop: 12 }}>268 LB</span>
        <span style={{ fontSize: 100, color: COLORS.white, paddingTop: 10 }}>ДО ЛИМИТА</span>
      </div>

      <Sfx at={CARGO[0] - 2} name="count" volume={0.28} />
      <Sfx at={LIFT} name="whoosh-soft" volume={0.2} />
      <Sfx at={TOTAL[0] - 2} name="count" volume={0.26} />
      <Sfx at={LIMIT + 4} name="impact-strong" volume={0.46} />
    </AbsoluteFill>
  );
};
