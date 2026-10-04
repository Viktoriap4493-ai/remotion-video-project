import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_BACK, EASE_OUT, punch } from "../anim";
import { BEBAS, GILROY } from "../fonts";
import { MaskReveal } from "../components/MaskReveal";
import { Sfx } from "../components/Sfx";

const LIGHTER = 6;
const SMARTER = 36;
const BRAND = 68;
const WANTED = 100;
const PHONE = 122;

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const brandIn = interpolate(frame, [BRAND, BRAND + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const phoneIn = interpolate(frame, [PHONE, PHONE + 10], [0, 1], { ...CLAMP, easing: EASE_BACK });
  const wantedLine = interpolate(frame, [WANTED, WANTED + 12], [0, 150], { ...CLAMP, easing: EASE_OUT });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 210], [1.04, 1.14], CLAMP)) }}>
        {/* Picks up the lineup clip where the hook left it, in slow motion. */}
        <Video
          src={staticFile("ad2/video/lineup.mp4")}
          muted
          trimBefore={102}
          playbackRate={0.72}
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,16,30,0.35) 0%, rgba(4,16,30,0.78) 22%, rgba(4,16,30,0.82) 70%, rgba(4,16,30,0.5) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 330,
          fontFamily: BEBAS,
          color: COLORS.white,
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        <MaskReveal start={LIGHTER} duration={9}>
          <div style={{ fontSize: 150 }}>DRIVE LIGHTER.</div>
        </MaskReveal>
        <MaskReveal start={SMARTER} duration={9} style={{ marginTop: 10 }}>
          <div style={{ fontSize: 150 }}>LOAD SMARTER.</div>
        </MaskReveal>

        <div
          style={{
            marginTop: 50,
            background: COLORS.red,
            padding: "22px 56px 6px",
            borderRadius: 18,
            fontSize: 220,
            opacity: brandIn,
            scale: String(interpolate(brandIn, [0, 1], [1.6, 1]) * punch(frame, BRAND + 8, 0.08, 2, 8)),
            filter: `blur(${(1 - brandIn) * 12}px)`,
            boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
          }}
        >
          DRIVE4USA
        </div>

        <div
          style={{
            marginTop: 70,
            display: "flex",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div style={{ width: wantedLine, height: 4, background: COLORS.yellow }} />
          <MaskReveal start={WANTED} duration={9}>
            <div
              style={{
                fontFamily: GILROY,
                fontWeight: 800,
                fontSize: 54,
                letterSpacing: "0.22em",
                color: COLORS.yellow,
              }}
            >
              DRIVERS WANTED
            </div>
          </MaskReveal>
          <div style={{ width: wantedLine, height: 4, background: COLORS.yellow }} />
        </div>

        <div
          style={{
            marginTop: 40,
            background: COLORS.white,
            color: COLORS.navy,
            borderRadius: 999,
            padding: "26px 70px 12px",
            fontSize: 150,
            letterSpacing: "0.03em",
            opacity: interpolate(frame, [PHONE, PHONE + 4], [0, 1], CLAMP),
            scale: String(interpolate(phoneIn, [0, 1], [0.6, 1]) * punch(frame, PHONE + 10, 0.07, 2, 8)),
            boxShadow: `0 0 ${interpolate(frame, [PHONE + 8, PHONE + 14, PHONE + 40], [0, 50, 22], CLAMP)}px rgba(255,210,31,0.7)`,
          }}
        >
          312-789-5550
        </div>
      </AbsoluteFill>

      <Sfx at={LIGHTER - 2} name="whoosh-soft" volume={0.26} />
      <Sfx at={SMARTER - 2} name="whoosh-soft" volume={0.26} />
      <Sfx at={BRAND + 3} name="impact-strong" volume={0.42} />
      <Sfx at={WANTED} name="punch" volume={0.3} />
      <Sfx at={PHONE + 4} name="notify" volume={0.34} />
      <Sfx at={PHONE + 14} name="resolve" volume={0.3} />
    </AbsoluteFill>
  );
};
