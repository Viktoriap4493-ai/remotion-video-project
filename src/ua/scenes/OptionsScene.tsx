import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_BACK, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { MaskReveal } from "../../loadcombos/components/MaskReveal";
import { Sfx } from "../../loadcombos/components/Sfx";
import { TechBackground } from "../../loadcombos/components/TechBackground";
import { BEBAS_UA } from "../fonts";
import { Whip } from "../components/Whip";

// The supplied 12-load image (vsi.png, cropped to its card grid) cut into its
// own 12 card tiles, each kept at its exact position and scale, so the final
// frame is the original image. Cards build up 1→12, then the camera visits
// cards 1–6 and 7–12 close enough to read, and pulls back to all twelve.
// Scene frames: «А тепер погляньте…» from f3, «Ось лише 12 прикладів
// варіантів завантаження» f76–138; the full grid then stays up through the
// start of «Менша вага трейлера…» (f141) before the whip.
const TITLE = 3; // «А тепер погляньте, які можливості відкриває полегшений setup!»
const BUILD = 17; // card 1; one card every CARD_STEP frames
const CARD_STEP = 4;
const GROUP_A = 76; // «Ось лише 12…» → cards 1–6
const GROUP_B = 100; // «…прикладів варіантів…» → cards 7–12
const ALL = 118; // «…завантаження» → all twelve, held ~1.8s
const WHIP_OUT = 184;

const IMG = { w: 1053, h: 1674 };
const GRID_H = 1200;
const K = GRID_H / IMG.h;
const GRID_W = IMG.w * K;
const GRID_LEFT = (1080 - GRID_W) / 2;
const GRID_TOP = 380;
const COLS = [[4, 334], [362, 691], [717, 1047]];
const ROWS = [[5, 396], [425, 815], [849, 1239], [1279, 1669]];
const CARDS = ROWS.flatMap(([y0, y1]) => COLS.map(([x0, x1]) => ({ x0, y0, x1, y1 })));

// Camera keyframes: focus point (grid-local px) brought to screen (540, 1000).
const cam = (s: number, fy: number) => ({ s, tx: 540 - GRID_LEFT - s * (GRID_W / 2), ty: 1000 - GRID_TOP - s * fy });
const FULL = { s: 1, tx: 0, ty: 0 };
const TOP = cam(1.4, 410 * K);
const BOTTOM = cam(1.4, 1259 * K);

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
    <Whip inFrames={6} outAt={WHIP_OUT}>
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
                    src={staticFile("ad2/img/all-12-loads-grid.jpg")}
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
                {/* Number badge on the card corner */}
                <div
                  style={{
                    position: "absolute",
                    left: -16,
                    top: -16,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: COLORS.red,
                    border: `3px solid ${COLORS.white}`,
                    color: COLORS.white,
                    fontFamily: BEBAS_UA,
                    fontSize: 28,
                    lineHeight: "40px",
                    textAlign: "center",
                    scale: String(interpolate(frame, [at + 3, at + 9], [0, 1], { ...CLAMP, easing: EASE_BACK })),
                  }}
                >
                  {i + 1}
                </div>
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
          }}
        >
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
        </div>

        <Sfx at={TITLE - 2} name="whoosh-fast" volume={0.24} />
        <Sfx at={TITLE + 5} name="impact-strong" volume={0.4} />
        <Sfx at={BUILD - 2} name="assembly" volume={0.26} />
        {[0, 3, 6, 9].map((i) => (
          <Sfx key={i} at={BUILD + i * CARD_STEP} name="ui-click" volume={0.18} />
        ))}
        <Sfx at={GROUP_A} name="whoosh-soft" volume={0.22} />
        <Sfx at={GROUP_B} name="whoosh-fast" volume={0.2} />
        <Sfx at={ALL + 10} name="lock" volume={0.3} />
        <Sfx at={WHIP_OUT - 2} name="whoosh-deep" volume={0.3} />
      </AbsoluteFill>
    </Whip>
  );
};
