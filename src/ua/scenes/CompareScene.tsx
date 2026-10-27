import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_IN, EASE_IN_OUT, EASE_OUT } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { Outline, type Point } from "../../v3/components/Outline";
import { PhotoStage } from "../../v3/components/PhotoStage";
import { BEBAS_UA, GILROY } from "../fonts";
import { DownArrow } from "../components/Icons";

// 5.png: the outline and the 7,600 LB label point at the TRAILER, not the
// truck. Then a vertical mask wipes to the Drive4USA trailer in 1.MOV.
const TITLE = 5; // «Для порівняння, стандартний Kaufman Dually…»
const WEIGHT = 62; // «…важить 7 600 фунтів.»
const WIPE = 96;
const WIPE_LEN = 18;
const NA = 107; // «Різниця —»
const DIFF = 122; // «2 840 фунтів»
const SCENE_END = 170;

const STANDARD_TRAILER: Point[] = [
  [350, 937], [380, 930], [530, 925], [565, 930], [700, 965], [930, 1030], [932, 1045], [855, 1048],
  [846, 1070], [757, 1072], [752, 1050], [548, 1052], [527, 1055], [527, 1000], [420, 955], [352, 978],
];

export const CompareScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = (at: number, d = 7) => interpolate(frame, [at, at + d], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const wipe = interpolate(frame, [WIPE, WIPE + WIPE_LEN], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const standardOut = interpolate(frame, [WIPE, WIPE + 8], [0, 1], { ...CLAMP, easing: EASE_IN });
  const diffScale = interpolate(frame, [DIFF, DIFF + 5, DIFF + 11], [0.8, 1.15, 1], CLAMP);
  const glow = interpolate(frame, [DIFF + 4, DIFF + 10, DIFF + 30], [0, 1, 0.4], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <PhotoStage
        src="ua/img/standard-5png.jpg"
        width={941}
        height={1672}
        camera={{ start: 0, end: WIPE + WIPE_LEN, from: { scale: 1.04, x: 420, y: 1000 }, to: { scale: 1.16, x: 620, y: 1000 } }}
      >
        <Outline id="ua-std" points={STANDARD_TRAILER} width={941} height={1672} start={4} duration={18} />
      </PhotoStage>

      {/* Vertical mask: 1.MOV revealed left → right behind a bright edge */}
      <Sequence from={WIPE - 8} layout="none">
        <AbsoluteFill style={{ clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}>
          <AbsoluteFill style={{ scale: String(interpolate(frame, [WIPE, SCENE_END], [1.1, 1.0], { ...CLAMP, easing: EASE_OUT })) }}>
            <Video src={staticFile("v3/video/cta-rig.mp4")} muted trimBefore={70} playbackRate={0.9} objectFit="cover" style={{ width: "100%", height: "100%" }} />
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>
      {wipe > 0 && wipe < 1 ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: wipe * 1080 - 4,
            width: 8,
            background: "white",
            boxShadow: `0 0 40px 12px rgba(255,255,255,0.55), 0 0 90px 30px ${COLORS.red}`,
          }}
        />
      ) : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,16,30,0.78) 0%, rgba(4,16,30,0.5) 24%, rgba(4,16,30,0) 38%)" }} />

      {/* Standard trailer */}
      {standardOut < 1 ? (
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: 1 - standardOut,
            translate: `${-standardOut * 300}px 0`,
          }}
        >
          <div style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 40, letterSpacing: "0.24em", color: COLORS.white, opacity: enter(TITLE) }}>
            СТАНДАРТНИЙ
          </div>
          <div style={{ fontFamily: BEBAS_UA, fontSize: 150, lineHeight: 1, color: COLORS.white, clipPath: `inset(0 ${(1 - enter(TITLE + 4, 9)) * 100}% 0 0)` }}>
            KAUFMAN DUALLY
          </div>
          <div
            style={{
              fontFamily: BEBAS_UA,
              fontSize: 230,
              lineHeight: 1,
              color: COLORS.white,
              opacity: enter(WEIGHT, 5),
              translate: `0 ${(1 - enter(WEIGHT)) * 70}px`,
              scale: String(interpolate(enter(WEIGHT), [0, 1], [0.85, 1])),
            }}
          >
            7,600 LB
          </div>
          <div style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 32, letterSpacing: "0.24em", color: "#9FD0FF", opacity: enter(WEIGHT + 6) }}>
            ВАГА ТРЕЙЛЕРА
          </div>
        </div>
      ) : null}

      {/* The difference */}
      {frame >= NA ? (
        <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: BEBAS_UA, lineHeight: 1 }}>
          <div style={{ fontSize: 110, color: COLORS.white, opacity: enter(NA, 5) }}>НА</div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: frame >= DIFF ? 1 : 0 }}>
            <span
              style={{
                fontSize: 260,
                color: COLORS.red,
                scale: String(diffScale),
                textShadow: `0 0 ${glow * 50}px rgba(227,16,27,0.8)`,
                borderBottom: `10px solid rgba(227,16,27,${glow})`,
              }}
            >
              2,840
            </span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 130, color: COLORS.white, opacity: enter(DIFF + 4, 5) }}>LB</span>
              <DownArrow size={48} draw={enter(DIFF + 6, 8)} />
            </div>
          </div>
          <div style={{ fontSize: 140, color: COLORS.white, opacity: enter(DIFF + 10, 6), translate: `0 ${(1 - enter(DIFF + 10)) * 40}px` }}>ЛЕГШИЙ</div>
          <div style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 30, letterSpacing: "0.3em", color: "#9FD0FF", marginTop: 8, opacity: enter(DIFF + 16) }}>
            LB LIGHTER
          </div>
        </div>
      ) : null}

      <Sfx at={TITLE} name="whoosh-soft" volume={0.2} />
      <Sfx at={4} name="scan" volume={0.18} />
      <Sfx at={WEIGHT} name="punch" volume={0.32} />
      <Sfx at={WIPE - 2} name="whoosh-deep" volume={0.32} />
      <Sfx at={NA} name="tick" volume={0.2} />
      <Sfx at={DIFF} name="count" volume={0.22} />
      <Sfx at={DIFF + 4} name="impact-strong" volume={0.46} />
    </AbsoluteFill>
  );
};
