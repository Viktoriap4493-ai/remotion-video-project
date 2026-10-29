import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_IN, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS_UA } from "../fonts";
import { Whip } from "../components/Whip";

// CAT Scale clip (gross 4,760 lb): plays in from 2.23s, HOLDS 2.5s on the
// sharp, fully framed ticket at 2.83s while the camera eases towards it,
// then plays on in slow motion. A red arrow on the open road to the right
// points at the ticket; nothing is drawn over its figures. Type follows the
// voiceover in the sky band.
const HOLD = 18;
const RESUME = 93;
const WHIP_OUT = 106;
const RESERVE = 2; // «…більший ваговий запас»
const CARGO = 14; // «…для вашого вантажу»
const RESERVE_OUT = 40;
const FLEX = 45; // «та більше гнучкості»
const SETUP = 66; // «…у виборі setup»
const TRUCK = 88; // «…для вашого трака.»
const ARROW = HOLD;

const Lines: React.FC<{ from: number; to?: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from) return null;
  const out = to === undefined ? 0 : interpolate(frame, [to, to + 5], [0, 1], { ...CLAMP, easing: EASE_IN });
  if (out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 110,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: BEBAS_UA,
        lineHeight: 1,
        color: COLORS.white,
        textShadow: "0 8px 30px rgba(0,0,0,0.5)",
        opacity: 1 - out,
        translate: `0 ${-out * 80}px`,
      }}
    >
      {children}
    </div>
  );
};

export const CapacityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = (at: number, d = 7) => interpolate(frame, [at, at + d], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const push = interpolate(frame, [HOLD, RESUME], [1, 1.06], { ...CLAMP, easing: EASE_IN_OUT });
  const draw = interpolate(frame, [ARROW, ARROW + 12], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const nudge = frame > ARROW + 12 ? Math.sin((frame - ARROW - 12) / 4) * 8 : 0;

  return (
    <Whip inFrames={6} outAt={WHIP_OUT}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        {/* Gentle push towards the ticket (origin on its figures) */}
        <AbsoluteFill style={{ scale: String(push), transformOrigin: "300px 1500px" }}>
          {frame < HOLD ? (
            <Video src={staticFile("ua/video/scale-ticket-4760.mp4")} muted trimBefore={67} objectFit="cover" style={{ width: "100%", height: "100%" }} />
          ) : frame < RESUME ? (
            <Img src={staticFile("ua/img/ticket-4760-freeze.jpg")} style={{ width: "100%", height: "100%" }} />
          ) : null}
          <Sequence from={RESUME} layout="none">
            <Video src={staticFile("ua/video/scale-ticket-4760.mp4")} muted trimBefore={86} playbackRate={0.8} objectFit="cover" style={{ width: "100%", height: "100%" }} />
          </Sequence>

          {/* Arrow from the open road to the ticket's edge, beside its weights */}
          {frame >= ARROW ? (
            <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, translate: `${nudge}px 0` }}>
              <path
                d="M 960 1250 C 940 1440 820 1540 650 1565"
                fill="none"
                stroke={COLORS.red}
                strokeWidth={16}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
                style={{ filter: "drop-shadow(0 0 12px rgba(227,16,27,0.6))" }}
              />
              <path d="M 690 1520 L 640 1566 L 700 1600" fill="none" stroke={COLORS.red} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" opacity={draw >= 0.95 ? 1 : 0} />
            </svg>
          ) : null}
        </AbsoluteFill>

        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,16,30,0.78) 0%, rgba(4,16,30,0.5) 16%, rgba(4,16,30,0) 24%)" }} />

        {/* «…більший ваговий запас для вашого вантажу» */}
        <Lines from={RESERVE} to={RESERVE_OUT}>
          <div style={{ fontSize: 120, opacity: enter(RESERVE, 4), translate: `0 ${(1 - enter(RESERVE)) * 50}px` }}>
            БІЛЬШИЙ ВАГОВИЙ <span style={{ color: COLORS.red }}>ЗАПАС</span>
          </div>
          <div style={{ fontSize: 90, marginTop: 8, clipPath: `inset(-20% ${(1 - enter(CARGO, 9)) * 100}% 0 0)` }}>ДЛЯ ВАШОГО ВАНТАЖУ</div>
        </Lines>

        {/* «та більше гнучкості у виборі setup для вашого трака» */}
        <Lines from={FLEX}>
          <div style={{ fontSize: 140, opacity: enter(FLEX, 4), scale: String(interpolate(enter(FLEX, 7), [0, 1], [1.4, 1]) * punch(frame, FLEX + 7, 0.05, 2, 7)) }}>
            БІЛЬШЕ <span style={{ color: COLORS.red }}>ГНУЧКОСТІ</span>
          </div>
          <div style={{ fontSize: 110, marginTop: 6, opacity: enter(SETUP, 4), translate: `${(1 - enter(SETUP)) * -180}px 0` }}>
            У ВИБОРІ <span style={{ color: COLORS.red }}>SETUP</span>
          </div>
          <div style={{ fontSize: 80, marginTop: 6, clipPath: `inset(-20% ${(1 - enter(TRUCK, 9)) * 100}% 0 0)` }}>ДЛЯ ВАШОГО ТРАКА</div>
        </Lines>

        <Sfx at={HOLD} name="hard-stop" volume={0.24} />
        <Sfx at={ARROW + 2} name="whoosh-fast" volume={0.18} />
        <Sfx at={ARROW + 12} name="tick" volume={0.2} />
        <Sfx at={FLEX} name="punch" volume={0.3} />
        <Sfx at={SETUP} name="whoosh-soft" volume={0.18} />
        <Sfx at={WHIP_OUT - 2} name="whoosh-deep" volume={0.3} />
      </AbsoluteFill>
    </Whip>
  );
};
