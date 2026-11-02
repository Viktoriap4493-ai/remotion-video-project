import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_BACK, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { MaskReveal } from "../../loadcombos/components/MaskReveal";
import { Sfx } from "../../loadcombos/components/Sfx";
import { TechBackground } from "../../loadcombos/components/TechBackground";
import { BEBAS_UA } from "../fonts";
import { Whip } from "../components/Whip";

// The supplied 12-load image (cropped to its card grid; the cards carry their
// own numbers 1–12) cut into its 12 card tiles, each kept at its exact
// position and scale, so the final frame is the original image. Cards build
// up 1→12, the camera visits cards 1–6 and 7–12 close enough to read, pulls
// back to all twelve, and the full grid then stays up to the end of the scene.
// Scene frames: «А тепер погляньте…» from f3, «Ось лише 12 прикладів
// варіантів завантаження» f76–138, «Менша вага трейлера… для вашого вантажу»
// f142–232, «та більше гнучкості у виборі setup для вашого трака» f235–300.
const TITLE = 3; // «А тепер погляньте, які можливості відкриває полегшений setup!»
const BUILD = 17; // card 1; one card every CARD_STEP frames
const CARD_STEP = 4;
const GROUP_A = 76; // «Ось лише 12…» → cards 1–6
const GROUP_B = 100; // «…прикладів варіантів…» → cards 7–12
const ALL = 118; // «…завантаження» → all twelve, held to the end
const TITLE_OUT = 168;
const RESERVE = 176; // «…більший ваговий запас для вашого вантажу»
const CARGO = 196;
const RESERVE_OUT = 228;
const FLEX = 235; // «та більше гнучкості»
const SETUP = 257; // «…у виборі setup для вашого трака»
const END = 298;

const IMG = { w: 932, h: 1463 };
const GRID_H = 1460;
const K = GRID_H / IMG.h;
const GRID_W = IMG.w * K;
const GRID_LEFT = (1080 - GRID_W) / 2;
const GRID_TOP = 395;
const COLS = [[4, 308], [315, 618], [625, 928]];
const ROWS = [[4, 368], [380, 746], [757, 1100], [1111, 1459]];
const CARDS = ROWS.flatMap(([y0, y1]) => COLS.map(([x0, x1]) => ({ x0, y0, x1, y1 })));

// Camera keyframes: focus point (grid-local px) brought to screen (540, 1000).
const cam = (s: number, fy: number) => ({ s, tx: 540 - GRID_LEFT - s * (GRID_W / 2), ty: 1000 - GRID_TOP - s * fy });
const FULL = { s: 1, tx: 0, ty: 0 };
const TOP = cam(1.4, 375 * K);
const BOTTOM = cam(1.4, 1108 * K);

// A heading in the title band that hands over to the next one.
const Band: React.FC<{ from: number; to?: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from) return null;
  const out = to === undefined ? 0 : interpolate(frame, [to, to + 5], [0, 1], CLAMP);
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
        opacity: 1 - out,
        translate: `0 ${-out * 60}px`,
      }}
    >
      {children}
    </div>
  );
};

export const OptionsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = (at: number, d = 7) => interpolate(frame, [at, at + d], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const toTop = interpolate(frame, [GROUP_A, GROUP_A + 12], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const toBottom = interpolate(frame, [GROUP_B, GROUP_B + 12], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const toAll = interpolate(frame, [ALL, ALL + 12], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const mix = (a: number, b: number, t: number) => a + (b - a) * t;
  const pick = (k: "s" | "tx" | "ty") => mix(mix(mix(FULL[k], TOP[k], toTop), BOTTOM[k], toBottom), FULL[k], toAll);
  const s = pick("s") * punch(frame, ALL + 12, 0.03, 2, 8);
  const group = frame >= GROUP_A && frame < ALL ? (frame >= GROUP_B ? 1 : 0) : -1;

  return (
    <Whip inFrames={6}>
      <AbsoluteFill>
        <TechBackground />

        <div
          style={{
            position: "absolute",
            left: GRID_LEFT,
            top: GRID_TOP,
            width: GRID_W,
            height: GRID_H,
            transformOrigin: "0 0",
            transform: `translate(${pick("tx")}px, ${pick("ty")}px) scale(${s})`,
          }}
        >
          {CARDS.map((c, i) => {
            const at = BUILD + i * CARD_STEP;
            const p = interpolate(frame, [at, at + 8], [0, 1], { ...CLAMP, easing: EASE_BACK });
            const lit = interpolate(frame, [at, at + 4, at + 16], [0, 1, 0.55], CLAMP);
            const inGroup = group === -1 || Math.floor(i / 6) === group;
            const w = (c.x1 - c.x0) * K;
            const h = (c.y1 - c.y0) * K;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: c.x0 * K,
                  top: c.y0 * K,
                  width: w,
                  height: h,
                  opacity: p > 0 ? Math.min(1, p * 1.5) * (inGroup ? 1 : 0.45) : 0,
                  scale: String(interpolate(p, [0, 1], [0.82, 1])),
                }}
              >
                <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                  <Img
                    src={staticFile("ua/img/twelve-loads-v2.jpg")}
                    style={{ position: "absolute", left: -c.x0 * K, top: -c.y0 * K, width: GRID_W, height: GRID_H, maxWidth: "none" }}
                  />
                </div>
                {/* Thin red frame: flares as the card lands, then stays subtle */}
                <div
                  style={{
                    position: "absolute",
                    inset: -3,
                    border: `3px solid ${COLORS.red}`,
                    opacity: lit,
                    boxShadow: `0 0 ${lit * 18}px rgba(227,16,27,0.7)`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Title */}
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, rgba(7,28,51,0.95) 0%, rgba(7,28,51,0.85) 15%, rgba(7,28,51,0) 22%)",
          }}
        />
        <Band from={0} to={TITLE_OUT}>
          <div
            style={{
              fontSize: 150,
              opacity: enter(TITLE, 3),
              scale: String(interpolate(enter(TITLE, 7), [0, 1], [1.5, 1]) * punch(frame, TITLE + 7, 0.06, 2, 7)),
            }}
          >
            <span style={{ color: COLORS.red }}>12</span> ВАРІАНТІВ
          </div>
          <MaskReveal start={TITLE + 8} duration={9}>
            <div style={{ fontSize: 96, letterSpacing: "0.04em" }}>ЗАВАНТАЖЕННЯ</div>
          </MaskReveal>
          <div style={{ width: 360 * enter(TITLE + 12, 10), height: 6, background: COLORS.red, marginTop: 10 }} />
        </Band>

        {/* «…більший ваговий запас для вашого вантажу» */}
        <Band from={RESERVE} to={RESERVE_OUT}>
          <div style={{ fontSize: 112, opacity: enter(RESERVE, 3), scale: String(interpolate(enter(RESERVE, 7), [0, 1], [1.4, 1]) * punch(frame, RESERVE + 7, 0.05, 2, 7)) }}>
            БІЛЬШИЙ ВАГОВИЙ <span style={{ color: COLORS.red }}>ЗАПАС</span>
          </div>
          <MaskReveal start={CARGO} duration={9}>
            <div style={{ fontSize: 96, letterSpacing: "0.04em" }}>ДЛЯ ВАШОГО ВАНТАЖУ</div>
          </MaskReveal>
          <div style={{ width: 360 * enter(CARGO + 4, 10), height: 6, background: COLORS.red, marginTop: 10 }} />
        </Band>

        {/* «та більше гнучкості у виборі setup для вашого трака» */}
        <Band from={FLEX}>
          <div style={{ fontSize: 130, opacity: enter(FLEX, 3), scale: String(interpolate(enter(FLEX, 7), [0, 1], [1.4, 1]) * punch(frame, FLEX + 7, 0.05, 2, 7)) }}>
            БІЛЬШЕ <span style={{ color: COLORS.red }}>ГНУЧКОСТІ</span>
          </div>
          <MaskReveal start={SETUP} duration={9}>
            <div style={{ fontSize: 84, letterSpacing: "0.03em" }}>
              У ВИБОРІ <span style={{ color: COLORS.red }}>SETUP</span> ДЛЯ ВАШОГО ТРАКА
            </div>
          </MaskReveal>
          <div style={{ width: 360 * enter(SETUP + 4, 10), height: 6, background: COLORS.red, marginTop: 10 }} />
        </Band>

        <Sfx at={TITLE - 2} name="whoosh-fast" volume={0.24} />
        <Sfx at={TITLE + 5} name="impact-strong" volume={0.4} />
        <Sfx at={BUILD - 2} name="assembly" volume={0.26} />
        {[0, 3, 6, 9].map((i) => (
          <Sfx key={i} at={BUILD + i * CARD_STEP} name="ui-click" volume={0.18} />
        ))}
        <Sfx at={GROUP_A} name="whoosh-soft" volume={0.22} />
        <Sfx at={GROUP_B} name="whoosh-fast" volume={0.2} />
        <Sfx at={ALL + 10} name="lock" volume={0.3} />
        <Sfx at={RESERVE} name="punch" volume={0.28} />
        <Sfx at={FLEX} name="whoosh-fast" volume={0.2} />
        <Sfx at={FLEX + 6} name="punch" volume={0.26} />
        <Sfx at={END - 2} name="whoosh-deep" volume={0.26} />
      </AbsoluteFill>
    </Whip>
  );
};
