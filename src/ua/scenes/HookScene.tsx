import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_BACK, EASE_IN, EASE_OUT, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS_UA } from "../fonts";
import { Whip } from "../components/Whip";

// хук.MOV: the man in the chair holds the centre/lower frame, so type sits in
// a compact band at the top over the sky and the jumping truck.
// The voiceover opens on «хочете…» (original recording), so the
// «ВТРАТИЛИ CDL?» card is a fast silent opener before the spoken lines.
const W1 = 0;
const CDL = 3;
const A_OUT = 6;
const B = [10, 14, 43]; // «хочете» «продовжити працювати» «в тракінгу?»
const B_OUT = 56;
const BRAND = 61; // «У Drive4USA
const SOLUTION = 101; // є рішення!»
const WHIP_OUT = 143;
const JUMP = { lift: 5, hang: 12, land: 80, blast: 91 };

const Phase: React.FC<{ from: number; to?: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from) return null;
  const out = to === undefined ? 0 : interpolate(frame, [to, to + 5], [0, 1], { ...CLAMP, easing: EASE_IN });
  if (out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: BEBAS_UA,
        lineHeight: 1,
        color: COLORS.white,
        textAlign: "center",
        textShadow: "0 8px 30px rgba(0,0,0,0.55)",
        opacity: 1 - out,
        translate: `0 ${-out * 120}px`,
      }}
    >
      {children}
    </div>
  );
};

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = (at: number, d = 7) => interpolate(frame, [at, at + d], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const cdlScale = interpolate(frame, [CDL, CDL + 5, CDL + 10], [0.8, 1.15, 1], CLAMP);
  const underline = interpolate(frame, [CDL + 4, CDL + 12], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const glitch = frame >= BRAND && frame < BRAND + 8 ? (frame % 2 ? 1 : -1) * (BRAND + 8 - frame) * 2.5 : 0;
  const route = interpolate(frame, [B[2] + 2, B[2] + 20], [0, 1], { ...CLAMP, easing: EASE_OUT });

  return (
    <Whip outAt={WHIP_OUT}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <AbsoluteFill
          style={{
            scale: String(interpolate(frame, [0, 8, 168], [1.0, 1.07, 1.11], { ...CLAMP, easing: EASE_OUT })),
          }}
        >
          <Video src={staticFile("ua/video/hook.mp4")} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, rgba(4,16,30,0.88) 0%, rgba(4,16,30,0.72) 24%, rgba(4,16,30,0) 42%)",
          }}
        />

        {/* «Втратили CDL?» */}
        <Phase from={W1} to={A_OUT}>
          <div style={{ fontSize: 150, opacity: enter(W1), translate: `0 ${(1 - enter(W1)) * 90}px` }}>ВТРАТИЛИ</div>
          <div style={{ position: "relative", marginTop: 4, opacity: frame >= CDL ? 1 : 0, scale: String(cdlScale) }}>
            <div style={{ fontSize: 250, color: COLORS.white }}>CDL?</div>
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 14,
                height: 14,
                width: `${underline * 100}%`,
                background: COLORS.red,
                boxShadow: "0 0 20px rgba(227,16,27,0.7)",
              }}
            />
          </div>
        </Phase>

        {/* «Але хочете / продовжити працювати / в тракінгу?» */}
        <Phase from={B[0]} to={B_OUT}>
          <div style={{ fontSize: 120, opacity: enter(B[0]), translate: `${(1 - enter(B[0])) * -260}px 0` }}>АЛЕ ХОЧЕТЕ</div>
          <div
            style={{
              fontSize: 104,
              opacity: enter(B[1], 5),
              scale: String(interpolate(enter(B[1], 6), [0, 1], [0.7, 1])),
            }}
          >
            ПРОДОВЖИТИ ПРАЦЮВАТИ
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: enter(B[2], 6),
              translate: `${(1 - enter(B[2])) * 260}px 0`,
              filter: `blur(${(1 - enter(B[2], 6)) * 8}px)`,
            }}
          >
            <span style={{ fontSize: 130, color: COLORS.red }}>В ТРАКІНГУ?</span>
            {/* Truck sticker on a route line */}
            <svg width="150" height="70" viewBox="0 0 150 70">
              <path d="M4 56 H146" stroke="white" strokeWidth="4" strokeDasharray="10 8" opacity={0.8} />
              <g transform={`translate(${route * 70} 0)`}>
                <rect x="6" y="24" width="44" height="26" rx="3" fill={COLORS.red} />
                <path d="M50 30 H64 L72 40 V50 H50 Z" fill="white" />
                <circle cx="18" cy="54" r="6" fill="white" />
                <circle cx="60" cy="54" r="6" fill="white" />
              </g>
            </svg>
          </div>
        </Phase>

        {/* «У Drive4USA є рішення!» */}
        <Phase from={BRAND}>
          <div style={{ position: "relative", fontSize: 150 }}>
            {/* Digital assembly: red/cyan offsets converge on the wordmark */}
            {glitch !== 0 ? (
              <>
                <div style={{ position: "absolute", inset: 0, color: COLORS.red, translate: `${glitch}px 0`, opacity: 0.8 }}>
                  У DRIVE4USA
                </div>
                <div style={{ position: "absolute", inset: 0, color: "#7FD3FF", translate: `${-glitch}px 0`, opacity: 0.8 }}>
                  У DRIVE4USA
                </div>
              </>
            ) : null}
            <div style={{ position: "relative", clipPath: `inset(0 ${(1 - enter(BRAND, 6)) * 100}% 0 0)` }}>У DRIVE4USA</div>
          </div>
          <div
            style={{
              fontSize: 210,
              marginTop: 6,
              color: COLORS.white,
              opacity: frame >= SOLUTION ? 1 : 0,
              scale: String(
                interpolate(frame, [SOLUTION, SOLUTION + 7], [1.5, 1], { ...CLAMP, easing: EASE_BACK }) *
                  punch(frame, SOLUTION + 7, 0.06, 2, 7),
              ),
            }}
          >
            <span style={{ color: COLORS.red }}>Є</span> РІШЕННЯ!
          </div>
        </Phase>

        <Sfx at={0} name="impact-strong" volume={0.36} />
        <Sfx at={W1} name="whoosh-fast" volume={0.24} />
        <Sfx at={CDL + 2} name="punch" volume={0.38} />
        <Sfx at={B[0]} name="whoosh-soft" volume={0.2} />
        <Sfx at={B[2]} name="whoosh-fast" volume={0.22} />
        <Sfx at={BRAND} name="type" volume={0.24} />
        <Sfx at={BRAND + 3} name="ui-click" volume={0.22} />
        <Sfx at={SOLUTION + 3} name="bass-hit" volume={0.42} />
        <Sfx at={WHIP_OUT - 2} name="whoosh-deep" volume={0.3} />
        {/* Truck jump in хук.MOV (video frame = scene frame): lift-off at f7,
            hang f10–55, touch-down f81, dust blast f91. */}
        <Sfx at={JUMP.lift} name="rise-whoosh" volume={0.34} />
        <Sfx at={JUMP.hang} name="air-tension" volume={0.22} />
        <Sfx at={JUMP.land} name="drop-impact" volume={0.5} />
        <Sfx at={JUMP.blast} name="heavy-land" volume={0.32} />
      </AbsoluteFill>
    </Whip>
  );
};
