import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_IN, EASE_OUT, punch } from "../../loadcombos/anim";
import { MaskReveal } from "../../loadcombos/components/MaskReveal";
import { Sfx } from "../../loadcombos/components/Sfx";
import { Outline, type Point } from "../../v3/components/Outline";
import { BEBAS_UA, GILROY } from "../fonts";
import { DownArrow, WeightIcon } from "../components/Icons";
import { Whip } from "../components/Whip";

// варка.mp4 (5.0s) is cut into wide / close / wide / close beats that play
// the clip forward continuously; the close-up on «модернізували» is a slow-mo
// speed ramp. Type lives in the dark ceiling band at the top.
type Cut = { from: number; to: number; trim: number; rate: number; scale: [number, number]; origin: string };
const CUTS: Cut[] = [
  { from: 0, to: 58, trim: 0, rate: 0.75, scale: [1.05, 1.12], origin: "50% 50%" },
  { from: 58, to: 100, trim: 44, rate: 0.35, scale: [2.0, 2.1], origin: "760px 900px" },
  { from: 100, to: 150, trim: 58, rate: 0.8, scale: [1.0, 1.04], origin: "50% 50%" },
  { from: 150, to: 216, trim: 98, rate: 0.8, scale: [1.6, 1.75], origin: "900px 880px" },
];

// Trailer frame visible behind the truck in the wide shot (cut 3).
const FRAME_CONTOUR: Point[] = [
  [455, 765], [560, 772], [700, 795], [820, 815], [1080, 862], [1080, 965], [860, 935], [760, 955],
  [700, 930], [560, 830], [470, 805],
];

const OFFER = [7, 26, 41]; // «Ми пропонуємо» «в оренду» «трейлер»
const MODERN = 58; // «…який ми модернізували,»
const LIGHTER = 148; // «…щоб зменшити його власну вагу»
const NO_COMPROMISE = 180; // «без зайвих компромісів у конструкції.»

const Block: React.FC<{ from: number; to?: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from) return null;
  const out = to === undefined ? 0 : interpolate(frame, [to, to + 5], [0, 1], { ...CLAMP, easing: EASE_IN });
  if (out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 130,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: BEBAS_UA,
        lineHeight: 1,
        color: COLORS.white,
        textAlign: "center",
        opacity: 1 - out,
        translate: `${-out * 160}px 0`,
      }}
    >
      {children}
    </div>
  );
};

export const ModificationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = (at: number, d = 7) => interpolate(frame, [at, at + d], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const chip = enter(OFFER[1] + 4, 9);
  const arrows = enter(118, 8);

  return (
    <Whip inFrames={6}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        {CUTS.map((c, i) => (
          <Sequence key={i} from={c.from} durationInFrames={c.to - c.from} layout="none">
            <AbsoluteFill
              style={{
                scale: String(interpolate(frame, [c.from, c.to], c.scale, CLAMP)),
                transformOrigin: c.origin,
              }}
            >
              <Video
                src={staticFile("v3/video/welding.mp4")}
                muted
                trimBefore={c.trim}
                playbackRate={c.rate}
                objectFit="cover"
                style={{ width: "100%", height: "100%" }}
              />
              {i === 2 ? <Outline id="ua-frame" points={FRAME_CONTOUR} width={1080} height={1920} start={4} duration={18} /> : null}
            </AbsoluteFill>
          </Sequence>
        ))}
        <AbsoluteFill
          style={{ background: "linear-gradient(180deg, rgba(4,16,30,0.8) 0%, rgba(4,16,30,0.45) 26%, rgba(4,16,30,0) 40%)" }}
        />

        {/* Arrows to the real frame being worked on (wide cut only) */}
        {frame >= 118 && frame < 150
          ? [
              { left: 700, top: 640 },
              { left: 930, top: 700 },
            ].map((p, i) => (
              <div key={i} style={{ position: "absolute", ...p, opacity: arrows, translate: `0 ${(1 - arrows) * -40}px` }}>
                <DownArrow size={46} draw={arrows} />
              </div>
            ))
          : null}

        {/* «Ми пропонуємо в оренду трейлер» */}
        <Block from={OFFER[0]} to={MODERN - 4}>
          <div style={{ fontSize: 110, opacity: enter(OFFER[0]), translate: `0 ${(1 - enter(OFFER[0])) * 60}px` }}>МИ ПРОПОНУЄМО</div>
          <div style={{ position: "relative", fontSize: 150, opacity: enter(OFFER[1]), scale: String(interpolate(enter(OFFER[1], 6), [0, 1], [0.8, 1])) }}>
            В ОРЕНДУ
            <div style={{ position: "absolute", left: 0, bottom: 10, height: 10, width: `${enter(OFFER[1] + 4, 8) * 100}%`, background: COLORS.red }} />
          </div>
          <div style={{ fontSize: 150, opacity: enter(OFFER[2]), translate: `${(1 - enter(OFFER[2])) * 200}px 0` }}>ТРЕЙЛЕР</div>
          <div
            style={{
              marginTop: 18,
              alignSelf: "flex-end",
              marginRight: 60,
              fontFamily: GILROY,
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: "0.24em",
              color: COLORS.white,
              border: `3px solid ${COLORS.red}`,
              padding: "8px 16px",
              opacity: chip,
              translate: `${(1 - chip) * 300}px 0`,
            }}
          >
            TRAILER RENTAL
          </div>
        </Block>

        {/* «модернізували» */}
        <Block from={MODERN} to={LIGHTER - 4}>
          <div style={{ fontSize: 170, scale: String(interpolate(enter(MODERN, 6), [0, 1], [1.4, 1]) * punch(frame, MODERN + 6, 0.06, 2, 7)), opacity: enter(MODERN, 3) }}>
            МОДЕРНІЗУВАЛИ
          </div>
          <MaskReveal start={MODERN + 8} duration={8}>
            <div style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 48, letterSpacing: "0.3em", color: COLORS.white }}>КОНСТРУКЦІЮ</div>
          </MaskReveal>
        </Block>

        {/* «щоб зменшити його власну вагу без зайвих компромісів у конструкції» */}
        <Block from={LIGHTER}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: enter(LIGHTER, 5) }}>
            <WeightIcon size={84} draw={enter(LIGHTER, 12)} />
            <DownArrow size={56} draw={enter(LIGHTER + 2, 10)} />
          </div>
          <div style={{ fontSize: 130, marginTop: 10, opacity: enter(LIGHTER + 3), translate: `0 ${(1 - enter(LIGHTER + 3)) * 50}px` }}>
            МЕНША <span style={{ color: COLORS.red }}>ВЛАСНА</span> ВАГА
          </div>
          <MaskReveal start={NO_COMPROMISE} duration={10} style={{ paddingTop: 40, marginTop: -40 }}>
            <div style={{ fontSize: 98, marginTop: 8 }}>БЕЗ ЗАЙВИХ КОМПРОМІСІВ</div>
          </MaskReveal>
        </Block>

        <Sfx at={0} name="mech-ambience" volume={0.18} />
        <Sfx at={OFFER[0]} name="whoosh-soft" volume={0.2} />
        <Sfx at={OFFER[1] + 4} name="ui-click" volume={0.24} />
        <Sfx at={MODERN} name="impact-strong" volume={0.34} />
        <Sfx at={100} name="scan" volume={0.2} />
        <Sfx at={118} name="tick" volume={0.2} />
        <Sfx at={LIGHTER} name="whoosh-fast" volume={0.22} />
        <Sfx at={NO_COMPROMISE} name="ui-click" volume={0.2} />
      </AbsoluteFill>
    </Whip>
  );
};
