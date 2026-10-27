import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_IN_OUT, EASE_OUT } from "../../loadcombos/anim";
import { RollingNumber } from "../../loadcombos/components/RollingNumber";
import { Sfx } from "../../loadcombos/components/Sfx";
import { Outline, type Point } from "../../v3/components/Outline";
import { BEBAS_UA, GILROY } from "../fonts";
import { DownArrow } from "../components/Icons";

// 3.MOV runs into its widest trailer frame (5.8s) and holds there, so the
// red contour can be traced exactly onto the real trailer.
const FREEZE = 22;
const RESULT = 21; // «Результат —»
const ONLY = 58; // «…трейлер вагою лише…»
const ROLL = 64; // «чотири тисячі…»
const LAND = 92; // «…сімсот шістдесят фунтів.»
const SCENE_END = 120;

const TRAILER: Point[] = [
  [0, 787], [225, 796], [570, 897], [1080, 1012], [1080, 1171], [930, 1147], [802, 1144], [705, 1122],
  [547, 1117], [540, 990], [210, 949], [90, 957], [0, 949],
];

export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = (at: number, d = 7) => interpolate(frame, [at, at + d], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const result = enter(RESULT) * (1 - interpolate(frame, [ONLY - 2, ONLY + 4], [0, 1], CLAMP));
  const arrows = enter(FREEZE + 14, 8);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          scale: String(interpolate(frame, [0, SCENE_END], [1.0, 1.08], { ...CLAMP, easing: EASE_IN_OUT })),
          transformOrigin: "540px 1000px",
        }}
      >
        {frame < FREEZE ? (
          <Video src={staticFile("ua/video/trailer-reveal.mp4")} muted trimBefore={152} objectFit="cover" style={{ width: "100%", height: "100%" }} />
        ) : (
          <Img src={staticFile("ua/img/trailer-freeze.jpg")} style={{ width: "100%", height: "100%" }} />
        )}
        <Outline id="ua-reveal" points={TRAILER} width={1080} height={1920} start={FREEZE - 2} duration={18} />
        {[
          { left: 160, top: 690 },
          { left: 560, top: 780 },
          { left: 820, top: 860 },
        ].map((p, i) => (
          <div key={i} style={{ position: "absolute", ...p, opacity: arrows, translate: `0 ${(1 - arrows) * -40}px` }}>
            <DownArrow size={44} draw={arrows} />
          </div>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,16,30,0.82) 0%, rgba(4,16,30,0.6) 24%, rgba(4,16,30,0) 38%)" }} />

      <div style={{ position: "absolute", top: 140, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: BEBAS_UA, fontSize: 96, lineHeight: 1, color: COLORS.white, opacity: result, height: 96 }}>РЕЗУЛЬТАТ</div>
        <div
          style={{
            marginTop: -96,
            fontFamily: GILROY,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: "0.2em",
            color: COLORS.white,
            background: COLORS.red,
            padding: "6px 18px",
            opacity: enter(ONLY, 5),
            scale: String(interpolate(enter(ONLY, 6), [0, 1], [0.6, 1])),
          }}
        >
          ЛИШЕ
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 22, marginTop: 14, opacity: frame >= ROLL ? 1 : 0 }}>
          <RollingNumber
            value="4,760"
            start={ROLL}
            land={LAND}
            idPrefix="ua-4760"
            style={{ fontFamily: BEBAS_UA, fontSize: 280, color: COLORS.red, textShadow: "0 0 40px rgba(227,16,27,0.45)" }}
          />
          <span
            style={{
              fontFamily: BEBAS_UA,
              fontSize: 150,
              lineHeight: 1,
              color: COLORS.white,
              opacity: enter(LAND + 2, 5),
              translate: `${(1 - enter(LAND + 2)) * 60}px 0`,
            }}
          >
            LB
          </span>
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: GILROY,
            fontWeight: 800,
            fontSize: 36,
            letterSpacing: "0.18em",
            color: COLORS.white,
            opacity: enter(LAND + 8),
            translate: `0 ${(1 - enter(LAND + 8)) * 20}px`,
          }}
        >
          ВАГА ТРЕЙЛЕРА DRIVE4USA
        </div>
      </div>

      <Sfx at={0} name="whoosh-soft" volume={0.2} />
      <Sfx at={FREEZE} name="scan" volume={0.22} />
      <Sfx at={RESULT} name="ui-click" volume={0.24} />
      <Sfx at={ONLY} name="tick" volume={0.22} />
      <Sfx at={ROLL} name="roulette" volume={0.26} />
      <Sfx at={LAND} name="hard-stop" volume={0.3} />
      <Sfx at={LAND + 1} name="bass-hit" volume={0.42} />
    </AbsoluteFill>
  );
};
