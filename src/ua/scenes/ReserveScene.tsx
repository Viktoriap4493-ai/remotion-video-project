import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_IN, EASE_OUT, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS_UA } from "../fonts";
import { CargoIcon } from "../components/Icons";
import { Whip } from "../components/Whip";

// «А отже, більше вагового запасу…» on the cars-on-a-scale shot, then the
// rig with «БІЛЬШЕ ГНУЧКОСТІ» / «UNDER 26,000 LB», and a rig shot with the
// spoken condition «за умови правильного підбору трака й завантаження» as type.
const RESERVE = 16; // «…більше вагового запасу для вашого вантажу»
const FLEX_CUT = 78; // «та можливість залишатися…»
const FLEX = 80;
const UNDER = 121; // «…в межах 26 000 фунтів»
const TEXT_OUT = 148;
const RIG_CUT = 153; // «за умови правильного підбору трака й завантаження.»
const CONDITION = 155;
const TRUCK = 189; // «…трака…»
const LOADING = 196; // «…й завантаження.»

const Shot: React.FC<{ src: string; from: number; to?: number; trim?: number; zoom: [number, number] }> = ({ src, from, to, trim = 0, zoom }) => {
  const frame = useCurrentFrame();
  return (
    <Sequence from={from} durationInFrames={to === undefined ? undefined : to - from} layout="none">
      <AbsoluteFill style={{ scale: String(interpolate(frame, [from, to ?? from + 90], zoom, CLAMP)) }}>
        <Video src={staticFile(src)} muted trimBefore={trim} objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
    </Sequence>
  );
};

export const ReserveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = (at: number, d = 7) => interpolate(frame, [at, at + d], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const out = (at: number) => interpolate(frame, [at, at + 5], [0, 1], { ...CLAMP, easing: EASE_IN });

  return (
    <Whip inFrames={6}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <Shot src="v3/video/balance-new.mp4" from={0} to={FLEX_CUT} zoom={[1.02, 1.1]} />
        <Shot src="ad2/video/rig-3.mp4" from={FLEX_CUT} to={RIG_CUT} zoom={[1.16, 1.1]} />
        <Shot src="ad2/video/rig-1.mp4" from={RIG_CUT} trim={6} zoom={[1.04, 1.12]} />

        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, rgba(4,16,30,0.86) 0%, rgba(4,16,30,0.62) 22%, rgba(4,16,30,0) 32%)",
          }}
        />

        {/* «Більше вагового запасу» */}
        {frame >= RESERVE && frame < FLEX_CUT + 5 ? (
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
              opacity: 1 - out(FLEX_CUT - 4),
            }}
          >
            <div style={{ fontSize: 200, opacity: enter(RESERVE, 3), scale: String(interpolate(enter(RESERVE, 6), [0, 1], [1.5, 1]) * punch(frame, RESERVE + 6, 0.05, 2, 6)) }}>
              БІЛЬШЕ
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 4 }}>
              <div style={{ fontSize: 120, clipPath: `inset(-20% ${(1 - enter(RESERVE + 8, 9)) * 100}% 0 0)` }}>ВАГОВОГО ЗАПАСУ</div>
              <div style={{ opacity: enter(RESERVE + 14) }}>
                <CargoIcon size={76} draw={enter(RESERVE + 14, 10)} />
              </div>
            </div>
          </div>
        ) : null}

        {/* «Більше гнучкості» + «Under 26,000 LB» */}
        {frame >= FLEX && frame < TEXT_OUT + 6 ? (
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
              opacity: 1 - out(TEXT_OUT),
            }}
          >
            <div style={{ fontSize: 140, opacity: enter(FLEX, 5), translate: `${(1 - enter(FLEX)) * -220}px 0` }}>БІЛЬШЕ ГНУЧКОСТІ</div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 22,
                marginTop: 10,
                opacity: enter(UNDER, 4),
                scale: String(interpolate(enter(UNDER, 7), [0, 1], [1.4, 1]) * punch(frame, UNDER + 7, 0.06, 2, 8)),
              }}
            >
              <span style={{ fontSize: 120 }}>UNDER</span>
              <span style={{ fontSize: 230, color: COLORS.red, textShadow: "0 0 40px rgba(227,16,27,0.45)" }}>26,000</span>
              <span style={{ fontSize: 120 }}>LB</span>
            </div>
          </div>
        ) : null}

        {/* «за умови правильного підбору трака й завантаження» */}
        {frame >= CONDITION ? (
          <div style={{ position: "absolute", top: 140, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: BEBAS_UA, lineHeight: 1, color: COLORS.white }}>
            <div style={{ fontSize: 90, clipPath: `inset(-20% ${(1 - enter(CONDITION, 9)) * 100}% 0 0)` }}>ЗА УМОВИ ПРАВИЛЬНОГО ПІДБОРУ</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 22, fontSize: 116, marginTop: 10, whiteSpace: "nowrap" }}>
              <span style={{ color: COLORS.red, opacity: enter(TRUCK, 4), scale: String(interpolate(enter(TRUCK, 6), [0, 1], [1.4, 1])) }}>ТРАКА</span>
              <span style={{ opacity: enter(LOADING, 4), translate: `${(1 - enter(LOADING)) * 160}px 0` }}>
                Й <span style={{ color: COLORS.red }}>ЗАВАНТАЖЕННЯ</span>
              </span>
            </div>
          </div>
        ) : null}

        <Sfx at={RESERVE} name="punch" volume={0.32} />
        <Sfx at={RESERVE + 8} name="whoosh-fast" volume={0.18} />
        <Sfx at={FLEX_CUT - 2} name="whoosh-soft" volume={0.22} />
        <Sfx at={UNDER} name="impact-strong" volume={0.38} />
        <Sfx at={RIG_CUT - 2} name="whoosh-soft" volume={0.18} />
        <Sfx at={TRUCK} name="ui-click" volume={0.22} />
        <Sfx at={LOADING} name="whoosh-fast" volume={0.16} />
      </AbsoluteFill>
    </Whip>
  );
};
