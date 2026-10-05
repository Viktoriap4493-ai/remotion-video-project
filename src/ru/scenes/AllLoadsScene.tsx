import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_IN_OUT, EASE_OUT } from "../../loadcombos/anim";
import { MaskReveal } from "../../loadcombos/components/MaskReveal";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS_RU, GILROY } from "../fonts";

// Dark screen → "this is just the beginning" → the vsi.png grid is scanned
// in top-to-bottom like an interface booting, then locks as one piece.
const INTRO = 2;
const SCAN = 18;
const SCAN_LEN = 24;
const LOCK = SCAN + SCAN_LEN + 1;
const TITLE = 40;
const SUB = 50;
const BANDS = 4;

const GRID_TOP = 330;
const GRID_HEIGHT = 1250;
const GRID_WIDTH = Math.round((GRID_HEIGHT * 1053) / 1674);
const GRID_LEFT = (1080 - GRID_WIDTH) / 2;

export const AllLoadsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const intro = interpolate(frame, [INTRO, INTRO + 8, SCAN - 2, SCAN + 4], [0, 1, 1, 0], CLAMP);
  const scan = interpolate(frame, [SCAN, SCAN + SCAN_LEN], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const flash = interpolate(frame, [LOCK, LOCK + 2, LOCK + 10], [0, 0.45, 0], CLAMP);
  const brackets = interpolate(frame, [LOCK, LOCK + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const scanY = GRID_TOP + scan * GRID_HEIGHT;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 55%, rgba(30,80,130,0.45) 0%, rgba(7,28,51,0) 60%)",
          opacity: interpolate(frame, [SCAN, SCAN + 10], [0, 1], CLAMP),
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 900,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: GILROY,
          fontWeight: 800,
          fontSize: 40,
          color: COLORS.white,
          letterSpacing: `${0.2 + intro * 0.12}em`,
          opacity: intro,
        }}
      >
        ЭТО ТОЛЬКО НАЧАЛО
      </div>

      {/* Grid: faint wireframe ahead of the scan line, live behind it */}
      <div
        style={{
          position: "absolute",
          top: GRID_TOP,
          left: GRID_LEFT,
          width: GRID_WIDTH,
          height: GRID_HEIGHT,
          opacity: frame >= SCAN ? 1 : 0,
        }}
      >
        <Img
          src={staticFile("ad2/img/all-12-loads-grid.jpg")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.12,
            filter: "grayscale(1) brightness(1.6) sepia(1) hue-rotate(170deg)",
          }}
        />
        {Array.from({ length: BANDS }).map((_, i) => {
          const bandTop = i / BANDS;
          const passed = scan > bandTop;
          const local = (scan - bandTop) * BANDS;
          const flicker = passed && local < 1 ? (Math.floor(frame / 2) % 2 ? 0.55 : 1) : 1;
          const visible = Math.min(1, Math.max(0, local));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                clipPath: `inset(${bandTop * 100}% 0 ${(1 - bandTop - visible / BANDS) * 100}% 0)`,
                opacity: passed ? flicker : 0,
              }}
            >
              <Img
                src={staticFile("ad2/img/all-12-loads-grid.jpg")}
                style={{ width: "100%", height: "100%", display: "block" }}
              />
            </div>
          );
        })}
        <div style={{ position: "absolute", inset: 0, background: "white", opacity: flash }} />
      </div>

      {/* Scan line */}
      {scan > 0 && scan < 1 ? (
        <div
          style={{
            position: "absolute",
            left: GRID_LEFT - 30,
            width: GRID_WIDTH + 60,
            top: scanY - 3,
            height: 6,
            background: "#7FD3FF",
            boxShadow: "0 0 30px 8px rgba(127,211,255,0.7)",
          }}
        />
      ) : null}

      {/* HUD corner brackets once locked */}
      {[
        { left: GRID_LEFT - 22, top: GRID_TOP - 22, b: "Top", s: "Left" },
        { left: GRID_LEFT + GRID_WIDTH - 38, top: GRID_TOP - 22, b: "Top", s: "Right" },
        { left: GRID_LEFT - 22, top: GRID_TOP + GRID_HEIGHT - 38, b: "Bottom", s: "Left" },
        { left: GRID_LEFT + GRID_WIDTH - 38, top: GRID_TOP + GRID_HEIGHT - 38, b: "Bottom", s: "Right" },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.left,
            top: c.top,
            width: 60,
            height: 60,
            [`border${c.b}`]: `6px solid ${COLORS.red}`,
            [`border${c.s}`]: `6px solid ${COLORS.red}`,
            opacity: brackets,
            scale: String(interpolate(brackets, [0, 1], [1.6, 1])),
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <MaskReveal start={TITLE} duration={9}>
          <div style={{ fontFamily: BEBAS_RU, fontSize: 112, lineHeight: 1, color: COLORS.white }}>
            <span style={{ color: COLORS.red }}>12</span> ВАРИАНТОВ ЗАГРУЗКИ
          </div>
        </MaskReveal>
        <MaskReveal start={SUB} duration={8}>
          <div
            style={{
              fontFamily: GILROY,
              fontWeight: 800,
              fontSize: 34,
              letterSpacing: "0.2em",
              color: COLORS.yellow,
              marginTop: 8,
            }}
          >
            И ЭТО ТОЛЬКО ПРИМЕРЫ
          </div>
        </MaskReveal>
      </div>

      <Sfx at={INTRO} name="ui-click" volume={0.2} />
      <Sfx at={SCAN} name="scan" volume={0.34} />
      <Sfx at={SCAN + 6} name="assembly" volume={0.26} />
      <Sfx at={LOCK} name="punch" volume={0.38} />
      <Sfx at={TITLE} name="whoosh-fast" volume={0.2} />
    </AbsoluteFill>
  );
};
