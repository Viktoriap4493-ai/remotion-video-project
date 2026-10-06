import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_BACK, EASE_IN, EASE_OUT, punch } from "../../loadcombos/anim";
import { MaskReveal } from "../../loadcombos/components/MaskReveal";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS, GILROY } from "../../loadcombos/fonts";

const ASK = 4; // "Want to get into car hauling in the U.S.,…"
const NO_CDL = 70; // "…even without a CDL?"
const CLEAR = 96;
const LOGO = 100; // "Join Drive4USA."
const JOIN = 106;
const WANTED = 120;
const CALL = 138; // "Call or text today."
const PHONE = 146;

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const clear = interpolate(frame, [CLEAR, CLEAR + 7], [0, 1], { ...CLAMP, easing: EASE_IN });
  const noCdl = interpolate(frame, [NO_CDL, NO_CDL + 7], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const logo = interpolate(frame, [LOGO, LOGO + 12], [0, 1], { ...CLAMP, easing: EASE_BACK });
  const wanted = interpolate(frame, [WANTED, WANTED + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const call = interpolate(frame, [CALL, CALL + 7], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const phone = interpolate(frame, [PHONE, PHONE + 9], [0, 1], { ...CLAMP, easing: EASE_BACK });
  const dim = interpolate(frame, [CLEAR, CLEAR + 12], [0.45, 0.72], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 241], [1.04, 1.14], CLAMP)) }}>
        <Video src={staticFile("v3/video/cta-rig.mp4")} muted playbackRate={0.96} objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(4,16,30,${dim})` }} />

      {/* The question */}
      {clear < 1 ? (
        <div
          style={{
            position: "absolute",
            top: 560,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: BEBAS,
            lineHeight: 1,
            color: COLORS.white,
            opacity: 1 - clear,
            translate: `0 ${clear * -160}px`,
          }}
        >
          <MaskReveal start={ASK} duration={9}>
            <div style={{ fontSize: 140 }}>WANT TO HAUL CARS</div>
          </MaskReveal>
          <MaskReveal start={ASK + 8} duration={9}>
            <div style={{ fontSize: 140 }}>IN THE U.S.?</div>
          </MaskReveal>
          <div
            style={{
              marginTop: 40,
              fontSize: 240,
              color: COLORS.yellow,
              opacity: noCdl,
              scale: String(interpolate(noCdl, [0, 1], [1.8, 1]) * punch(frame, NO_CDL + 7, 0.08, 2, 8)),
              filter: `blur(${(1 - noCdl) * 10}px)`,
            }}
          >
            NO CDL?
          </div>
        </div>
      ) : null}

      {/* Final recruitment frame */}
      {frame >= LOGO ? (
        <div style={{ position: "absolute", top: 210, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: 470,
              height: 470,
              borderRadius: 36,
              background: COLORS.white,
              overflow: "hidden",
              opacity: logo > 0 ? 1 : 0,
              scale: String(interpolate(logo, [0, 1], [0.55, 1])),
              boxShadow: `0 0 ${interpolate(frame, [LOGO + 8, LOGO + 14, LOGO + 40], [0, 70, 30], CLAMP)}px rgba(227,16,27,0.55), 0 30px 60px rgba(0,0,0,0.5)`,
            }}
          >
            <Img src={staticFile("v3/img/logo.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: "1.12" }} />
          </div>
          <MaskReveal start={JOIN} duration={8} style={{ marginTop: 34 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 140, lineHeight: 1, color: COLORS.white }}>JOIN DRIVE4USA</div>
          </MaskReveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 14,
              opacity: wanted,
              translate: `0 ${(1 - wanted) * 24}px`,
            }}
          >
            <div style={{ width: 90 * wanted, height: 4, background: COLORS.yellow }} />
            <div style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 50, letterSpacing: "0.22em", color: COLORS.yellow }}>DRIVERS WANTED</div>
            <div style={{ width: 90 * wanted, height: 4, background: COLORS.yellow }} />
          </div>
          <div
            style={{
              fontFamily: GILROY,
              fontWeight: 800,
              fontSize: 42,
              letterSpacing: "0.3em",
              color: COLORS.white,
              marginTop: 36,
              opacity: call,
            }}
          >
            CALL / TEXT
          </div>
          <div
            style={{
              marginTop: 14,
              background: COLORS.red,
              borderRadius: 999,
              padding: "24px 70px 8px",
              fontFamily: BEBAS,
              fontSize: 156,
              lineHeight: 1,
              letterSpacing: "0.03em",
              color: COLORS.white,
              opacity: phone > 0 ? 1 : 0,
              scale: String(interpolate(phone, [0, 1], [0.5, 1]) * punch(frame, PHONE + 9, 0.06, 2, 8)),
              boxShadow: `0 0 ${interpolate(frame, [PHONE + 8, PHONE + 14, PHONE + 40], [0, 60, 26], CLAMP)}px rgba(227,16,27,0.75)`,
            }}
          >
            312-789-5550
          </div>
        </div>
      ) : null}

      <Sfx at={ASK - 2} name="whoosh-soft" volume={0.26} />
      <Sfx at={NO_CDL + 3} name="punch" volume={0.38} />
      <Sfx at={CLEAR} name="whoosh-fast" volume={0.24} />
      <Sfx at={LOGO + 6} name="impact-strong" volume={0.42} />
      <Sfx at={WANTED} name="punch" volume={0.26} />
      <Sfx at={PHONE + 4} name="notify" volume={0.34} />
      <Sfx at={PHONE + 16} name="resolve" volume={0.32} />
    </AbsoluteFill>
  );
};
