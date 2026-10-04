import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_OUT, punch } from "../anim";
import { BEBAS, GILROY } from "../fonts";
import { LOADS } from "../data";
import { CheckIcon } from "../components/CheckIcon";
import { MaskReveal } from "../components/MaskReveal";
import { RollingNumber } from "../components/RollingNumber";
import { Sfx } from "../components/Sfx";
import { TechBackground } from "../components/TechBackground";

// Banner values "663 LB" read as "663 UNDER" here.
const underDigits = (under: string) => under.replace(/\s*LB$/, "");

const ROWS = [
  { y: 470, start: 6, land: 26 },
  { y: 870, start: 38, land: 58 },
  { y: 1270, start: 70, land: 92 },
];
const FINAL = 104;

const ResultRow: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { y, start, land } = ROWS[index];
  const load = LOADS[index];
  const prev = index > 0 ? LOADS[index - 1] : undefined;
  const next = ROWS[index + 1];

  const appear = interpolate(frame, [start - 2, start + 3], [0, 1], CLAMP);
  const active = interpolate(frame, [start, start + 6], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const settle = interpolate(frame, [land + 8, land + 16], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const dimmed = next ? interpolate(frame, [next.start, next.start + 6, FINAL, FINAL + 8], [0, 1, 1, 0], CLAMP) : 0;
  const scale = (1.06 * active - 0.12 * settle + (1 - active) * 0.9) * punch(frame, land + 1, 0.1, 2, 8);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y - 165,
        height: 330,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: appear * (1 - dimmed * 0.5),
        scale: String(scale),
      }}
    >
      <div
        style={{
          fontFamily: GILROY,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: "0.3em",
          color: "#8CC8FF",
          marginBottom: 6,
        }}
      >
        {load.label}
      </div>
      <RollingNumber
        value={load.total}
        fromValue={prev?.total}
        start={start}
        land={land}
        idPrefix={`reveal-total-${index}`}
        style={{
          fontFamily: BEBAS,
          fontSize: 196,
          color: COLORS.white,
          textShadow: "0 8px 30px rgba(0,0,0,0.45)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
        <CheckIcon start={land + 2} size={74} />
        <RollingNumber
          value={underDigits(load.under)}
          fromValue={prev ? underDigits(prev.under) : undefined}
          start={start + 4}
          land={land + 4}
          idPrefix={`reveal-under-${index}`}
          spins={1}
          style={{ fontFamily: BEBAS, fontSize: 104, color: COLORS.yellow }}
        />
        <div
          style={{
            fontFamily: GILROY,
            fontWeight: 800,
            fontSize: 52,
            color: COLORS.white,
            letterSpacing: "0.06em",
            opacity: interpolate(frame, [land + 4, land + 8], [0, 1], CLAMP),
          }}
        >
          UNDER
        </div>
      </div>

      <Sfx at={start} name="roulette" volume={0.3} />
      <Sfx at={land} name="hard-stop" volume={0.34} />
      <Sfx at={land + 1} name={index === 2 ? "impact-strong" : "bass-hit"} volume={index === 2 ? 0.42 : 0.32} />
      <Sfx at={land + 4} name="tick" volume={0.2} />
    </div>
  );
};

export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <TechBackground image />
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <MaskReveal start={0} duration={9}>
          <div
            style={{
              fontFamily: GILROY,
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: "0.26em",
              color: COLORS.white,
              borderBottom: `5px solid ${COLORS.red}`,
              paddingBottom: 10,
            }}
          >
            SETUP + CARGO
          </div>
        </MaskReveal>
      </div>

      {ROWS.map((_, i) => (
        <ResultRow key={i} index={i} />
      ))}

      <div
        style={{
          position: "absolute",
          top: 1475,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: COLORS.red,
            padding: "10px 40px 4px",
            borderRadius: 14,
            clipPath: `inset(0 ${(1 - interpolate(frame, [FINAL, FINAL + 9], [0, 1], { ...CLAMP, easing: EASE_OUT })) * 100}% 0 0)`,
            fontFamily: BEBAS,
            fontSize: 84,
            color: COLORS.white,
            lineHeight: 1,
          }}
        >
          ALL UNDER 26,000 LB
        </div>
      </div>

      <Sfx at={0} name="riser" volume={0.16} />
      <Sfx at={FINAL} name="whoosh-soft" volume={0.2} />
      <Sfx at={FINAL + 2} name="resolve" volume={0.26} />
    </AbsoluteFill>
  );
};
