import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_BACK, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS_RU } from "../fonts";

const A_IN = 3; // «Легче сетап.»
const A_ASIDE = 28;
const B_IN = 34; // «Больше вариантов.»
const COMPRESS = 62;
const BRAND = 70; // «Drive4USA.»
const CARD = 110; // «Присоединяйся сегодня.»
const PHONE = 118;

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const aIn = interpolate(frame, [A_IN, A_IN + 8], [0, 1], { ...CLAMP, easing: EASE_BACK });
  const aside = interpolate(frame, [A_ASIDE, A_ASIDE + 8], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const bIn = interpolate(frame, [B_IN, B_IN + 8], [0, 1], { ...CLAMP, easing: EASE_BACK });
  const squeeze = interpolate(frame, [COMPRESS, COMPRESS + 9], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const brand = interpolate(frame, [BRAND, BRAND + 7], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const card = interpolate(frame, [CARD, CARD + 10], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const phone = interpolate(frame, [PHONE, PHONE + 9], [0, 1], { ...CLAMP, easing: EASE_BACK });

  // Phrase A: centre → pushed aside up-left → compressed into the header.
  const aY = interpolate(aside, [0, 1], [700, 470]) + interpolate(squeeze, [0, 1], [0, -190]);
  const aX = interpolate(aside, [0, 1], [0, -150]) + interpolate(squeeze, [0, 1], [0, 150]);
  const aScale = interpolate(aIn, [0, 1], [1.4, 1]) * interpolate(aside, [0, 1], [1, 0.62]) * interpolate(squeeze, [0, 1], [1, 0.75]);
  // Phrase B: arrives larger, then compresses under A.
  const bY = interpolate(squeeze, [0, 1], [700, 410]);
  const bScale = interpolate(bIn, [0, 1], [0.5, 1]) * interpolate(squeeze, [0, 1], [1, 0.5]);

  const headline: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: BEBAS_RU,
    lineHeight: 1,
    color: COLORS.white,
    textShadow: "0 8px 30px rgba(0,0,0,0.5)",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 192], [1.06, 1.16], CLAMP)) }}>
        <Video
          src={staticFile("ad2/video/lineup.mp4")}
          muted
          trimBefore={126}
          playbackRate={0.68}
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,16,30,0.4) 0%, rgba(4,16,30,0.75) 25%, rgba(4,16,30,0.85) 75%, rgba(4,16,30,0.6) 100%)",
        }}
      />

      <div style={{ ...headline, top: aY - 90, fontSize: 180, translate: `${aX}px 0`, scale: String(aScale), opacity: aIn }}>
        ЛЁГКИЙ СЕТАП
      </div>
      <div
        style={{
          ...headline,
          top: bY - 90,
          fontSize: 150,
          color: COLORS.yellow,
          scale: String(bScale),
          opacity: bIn,
        }}
      >
        БОЛЬШЕ ВАРИАНТОВ
      </div>

      <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            background: COLORS.red,
            padding: "24px 60px 4px",
            borderRadius: 18,
            fontFamily: BEBAS_RU,
            fontSize: 230,
            lineHeight: 1,
            color: COLORS.white,
            opacity: brand,
            scale: String(interpolate(brand, [0, 1], [2, 1]) * punch(frame, BRAND + 7, 0.08, 2, 8)),
            filter: `blur(${(1 - brand) * 14}px)`,
            boxShadow: "0 22px 50px rgba(0,0,0,0.5)",
          }}
        >
          DRIVE4USA
        </div>
      </div>

      {/* Recruitment card */}
      <div
        style={{
          position: "absolute",
          left: 90,
          width: 900,
          top: 1020,
          height: 440,
          borderRadius: 30,
          background: COLORS.white,
          boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: card,
          translate: `0 ${(1 - card) * 200}px`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14, background: COLORS.red }} />
        <div style={{ fontFamily: BEBAS_RU, fontSize: 120, lineHeight: 1, color: COLORS.navy, paddingTop: 10 }}>
          НУЖНЫ ВОДИТЕЛИ
        </div>
        <div style={{ width: 120, height: 5, background: COLORS.red, margin: "18px 0 20px" }} />
        <div
          style={{
            fontFamily: BEBAS_RU,
            fontSize: 160,
            lineHeight: 1,
            color: COLORS.red,
            letterSpacing: "0.03em",
            opacity: phone > 0 ? 1 : 0,
            scale: String(interpolate(phone, [0, 1], [0.5, 1]) * punch(frame, PHONE + 9, 0.06, 2, 8)),
          }}
        >
          312-789-5550
        </div>
      </div>

      <Sfx at={A_IN - 2} name="whoosh-soft" volume={0.26} />
      <Sfx at={A_ASIDE} name="whoosh-fast" volume={0.2} />
      <Sfx at={B_IN - 2} name="whoosh-soft" volume={0.26} />
      <Sfx at={COMPRESS} name="whoosh-fast" volume={0.22} />
      <Sfx at={BRAND + 4} name="impact-strong" volume={0.44} />
      <Sfx at={CARD} name="card-thud" volume={0.3} />
      <Sfx at={PHONE + 4} name="notify" volume={0.34} />
      <Sfx at={PHONE + 16} name="resolve" volume={0.3} />
    </AbsoluteFill>
  );
};
