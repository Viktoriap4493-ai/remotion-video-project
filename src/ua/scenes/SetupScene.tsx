import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { RollingNumber } from "../../loadcombos/components/RollingNumber";
import { Sfx } from "../../loadcombos/components/Sfx";
import { Outline, type Point } from "../../v3/components/Outline";
import { PhotoStage } from "../../v3/components/PhotoStage";
import { BEBAS_UA } from "../fonts";
import { DownArrow } from "../components/Icons";
import { Whip } from "../components/Whip";

// Whole-setup comparison: 4.MOV (the Drive4USA rig driving in), the standard
// setup photo at 15,800 LB, then the supplied sticker on the blue paper while
// the total counts down to 12,060 LB, and the 3,740 LB difference.
const MAIN = 6; // «Але головна перевага —»
const MAIN_SETUP = 33; // «…у всьому setup.»
const STD_CUT = 60; // «Стандартний setup із траком…»
const STD_TITLE = 63;
const STD_WEIGHT = 116; // «…важить 15 800 фунтів,»
const PAPER = 170; // «тоді як нам вдалося знизити загальну вагу…»
const D4U_TITLE = 174;
const ROLL = 232; // «…до 12 060 фунтів.»
const LAND = 270;
const DIFF = 288; // «Це на 3 740 фунтів менше!»
const LIGHTER = 306;
const WHIP_OUT = 339;

// The whole standard setup (black Ford dually + Kaufman car hauler) in the
// photo's pixel space.
const STANDARD_SETUP: Point[] = [
  [10, 985], [60, 962], [112, 948], [150, 928], [180, 924], [318, 924], [330, 972], [350, 972], [350, 937],
  [380, 930], [530, 925], [565, 930], [700, 965], [930, 1030], [932, 1045], [855, 1048], [846, 1070],
  [757, 1072], [752, 1050], [548, 1052], [470, 1062], [455, 1082], [388, 1084], [372, 1062], [160, 1062],
  [145, 1092], [85, 1094], [70, 1070], [14, 1068],
];

const fmt = (n: number) => n.toLocaleString("en-US");

// Fixed-width digits, so the countdown does not jitter sideways.
const Count: React.FC<{ value: number; style: React.CSSProperties }> = ({ value, style }) => (
  <span style={{ display: "inline-flex", lineHeight: 1, ...style }}>
    {fmt(value)
      .split("")
      .map((c, i) => (
        <span key={i} style={{ width: /\d/.test(c) ? "0.42em" : undefined, textAlign: "center" }}>
          {c}
        </span>
      ))}
  </span>
);

export const SetupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = (at: number, d = 7) => interpolate(frame, [at, at + d], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const paperWipe = interpolate(frame, [PAPER, PAPER + 10], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const stickerIn = enter(PAPER + 2, 16);
  const total = Math.round(interpolate(frame, [ROLL, LAND], [15800, 12060], { ...CLAMP, easing: EASE_OUT }) / 10) * 10;
  const landed = frame >= LAND;

  return (
    <Whip outAt={WHIP_OUT}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        {/* «Але головна перевага — у всьому setup.» */}
        <AbsoluteFill style={{ scale: String(interpolate(frame, [0, STD_CUT], [1.04, 1.12], CLAMP)) }}>
          <Video src={staticFile("v3/video/hook-rig.mp4")} muted trimBefore={10} objectFit="cover" style={{ width: "100%", height: "100%" }} />
        </AbsoluteFill>
        {frame < STD_CUT ? (
          <>
            <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,16,30,0.8) 0%, rgba(4,16,30,0.5) 22%, rgba(4,16,30,0) 34%)" }} />
            <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: BEBAS_UA, lineHeight: 1, color: COLORS.white, textShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
              <div style={{ fontSize: 130, opacity: enter(MAIN, 4), translate: `0 ${(1 - enter(MAIN)) * 60}px` }}>ГОЛОВНА ПЕРЕВАГА —</div>
              <div
                style={{
                  fontSize: 160,
                  marginTop: 6,
                  opacity: enter(MAIN_SETUP, 4),
                  scale: String(interpolate(enter(MAIN_SETUP, 7), [0, 1], [1.4, 1]) * punch(frame, MAIN_SETUP + 7, 0.05, 2, 7)),
                }}
              >
                У ВСЬОМУ <span style={{ color: COLORS.red }}>SETUP</span>
              </div>
            </div>
          </>
        ) : null}

        {/* Standard setup: 15,800 LB */}
        <Sequence from={STD_CUT} durationInFrames={PAPER + 10 - STD_CUT} layout="none">
          <PhotoStage
            src="ua/img/standard-5png.jpg"
            width={941}
            height={1672}
            camera={{ start: 0, end: PAPER - STD_CUT, from: { scale: 1.06, x: 470, y: 1000 }, to: { scale: 1.16, x: 470, y: 1000 } }}
          >
            <Outline id="ua-std-setup" points={STANDARD_SETUP} width={941} height={1672} start={STD_TITLE - STD_CUT + 2} duration={20} />
          </PhotoStage>
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,16,30,0.82) 0%, rgba(4,16,30,0.55) 26%, rgba(4,16,30,0) 40%)" }} />
        </Sequence>
        {frame >= STD_CUT && frame < PAPER + 10 ? (
          <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: BEBAS_UA, lineHeight: 1, color: COLORS.white }}>
            <div style={{ fontSize: 120, clipPath: `inset(-20% ${(1 - enter(STD_TITLE, 9)) * 100}% 0 0)` }}>СТАНДАРТНИЙ SETUP</div>
            <div
              style={{
                fontSize: 230,
                marginTop: 6,
                opacity: enter(STD_WEIGHT, 4),
                scale: String(interpolate(enter(STD_WEIGHT, 7), [0, 1], [1.4, 1]) * punch(frame, STD_WEIGHT + 7, 0.05, 2, 7)),
              }}
            >
              15,800 LB
            </div>
          </div>
        ) : null}

        {/* Drive4USA setup on the blue paper, wiped in from the right */}
        <Sequence from={PAPER} layout="none">
          <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${(1 - paperWipe) * 100}%)` }}>
            <AbsoluteFill style={{ overflow: "hidden" }}>
              <Img
                src={staticFile("ua/img/paper-blue.jpg")}
                style={{ width: "100%", height: "100%", scale: String(interpolate(frame, [PAPER, WHIP_OUT + 6], [1.0, 1.06], CLAMP)) }}
              />
            </AbsoluteFill>

            <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: BEBAS_UA, lineHeight: 1, color: COLORS.navy }}>
              <div style={{ fontSize: 120, clipPath: `inset(-20% ${(1 - enter(D4U_TITLE, 9)) * 100}% 0 0)` }}>
                <span style={{ color: COLORS.red }}>DRIVE4USA</span> SETUP
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 20,
                  marginTop: 6,
                  opacity: enter(D4U_TITLE + 6, 5),
                  scale: String(punch(frame, LAND, 0.07, 2, 8)),
                }}
              >
                <Count value={total} style={{ fontSize: 240, color: landed ? COLORS.red : COLORS.navy }} />
                <span style={{ fontSize: 130 }}>LB</span>
              </div>
            </div>

            {/* The supplied sticker drives in under the figures */}
            <div
              style={{
                position: "absolute",
                left: 40,
                top: 610,
                width: 1000,
                translate: `${(1 - stickerIn) * 1100}px 0`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 30,
                  right: 40,
                  bottom: 6,
                  height: 40,
                  borderRadius: "50%",
                  background: "radial-gradient(ellipse at center, rgba(7,28,51,0.45) 0%, rgba(7,28,51,0) 70%)",
                }}
              />
              <Img src={staticFile("ua/img/setup-sticker.png")} style={{ position: "relative", width: "100%" }} />
            </div>

            {/* «Це на 3 740 фунтів менше!» (the reels run in this Sequence's frames) */}
            {frame >= DIFF - 2 ? (
              <div style={{ position: "absolute", top: 1130, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: BEBAS_UA, lineHeight: 1, color: COLORS.navy }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 22, opacity: enter(DIFF - 2, 4) }}>
                  <span style={{ fontSize: 120 }}>НА</span>
                  <RollingNumber
                    value="3,740"
                    fromValue="0,000"
                    start={DIFF - PAPER}
                    land={DIFF + 14 - PAPER}
                    idPrefix="ua-3740"
                    style={{ fontFamily: BEBAS_UA, fontSize: 260, color: COLORS.red, scale: String(punch(frame, DIFF + 14, 0.08, 2, 8)) }}
                  />
                  <span style={{ fontSize: 130 }}>LB</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 4 }}>
                  <span style={{ fontSize: 150, clipPath: `inset(-20% ${(1 - enter(LIGHTER, 9)) * 100}% 0 0)` }}>LIGHTER</span>
                  <DownArrow size={60} draw={enter(LIGHTER + 6, 10)} />
                </div>
              </div>
            ) : null}
          </AbsoluteFill>
          {paperWipe > 0 && paperWipe < 1 ? (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: (1 - paperWipe) * 1080 - 4,
                width: 8,
                background: "white",
                boxShadow: `0 0 40px 12px rgba(255,255,255,0.55), 0 0 90px 30px ${COLORS.red}`,
              }}
            />
          ) : null}
        </Sequence>

        <Sfx at={0} name="whoosh-deep" volume={0.26} />
        <Sfx at={MAIN} name="whoosh-fast" volume={0.18} />
        <Sfx at={MAIN_SETUP + 4} name="punch" volume={0.26} />
        <Sfx at={STD_CUT} name="whoosh-soft" volume={0.22} />
        <Sfx at={STD_TITLE} name="scan" volume={0.16} />
        <Sfx at={STD_WEIGHT} name="punch" volume={0.32} />
        <Sfx at={PAPER - 2} name="whoosh-fast" volume={0.24} />
        <Sfx at={PAPER + 4} name="rise-whoosh" volume={0.18} />
        <Sfx at={ROLL} name="count" volume={0.2} />
        <Sfx at={LAND} name="hard-stop" volume={0.28} />
        <Sfx at={LAND + 1} name="bass-hit" volume={0.36} />
        <Sfx at={DIFF} name="roulette" volume={0.22} />
        <Sfx at={DIFF + 14} name="impact-strong" volume={0.4} />
        <Sfx at={LIGHTER} name="whoosh-fast" volume={0.18} />
        <Sfx at={WHIP_OUT - 2} name="whoosh-deep" volume={0.28} />
      </AbsoluteFill>
    </Whip>
  );
};
