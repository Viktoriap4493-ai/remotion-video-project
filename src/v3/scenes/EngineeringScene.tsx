import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_IN, EASE_OUT, punch } from "../../loadcombos/anim";
import { MaskReveal } from "../../loadcombos/components/MaskReveal";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS } from "../../loadcombos/fonts";

// варка.mov: welding fills the middle band (y ≈ 380–950); type lives on the
// floor area below it so the work stays visible.
const A = 6; // "We didn't just build a truck and trailer."
const A_OUT = 58;
const B = 66; // "We analyzed the entire setup…"
const B_OUT = 110;
const C = 116; // "…and engineered it around real driver needs."

const Phase: React.FC<{ start: number; end?: number; children: React.ReactNode }> = ({ start, end, children }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const out = end === undefined ? 0 : interpolate(frame, [end, end + 6], [0, 1], { ...CLAMP, easing: EASE_IN });
  if (out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 1160,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: BEBAS,
        lineHeight: 1.02,
        color: COLORS.white,
        textAlign: "center",
        opacity: 1 - out,
        translate: `${out * -200}px 0`,
        filter: `blur(${out * 8}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const EngineeringScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scanY = interpolate(frame, [B + 2, B + 30], [380, 960], CLAMP);
  const hud = interpolate(frame, [B, B + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 183], [1.04, 1.14], CLAMP)), transformOrigin: "50% 40%" }}>
        <Video src={staticFile("v3/video/welding.mp4")} muted playbackRate={0.83} objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(4,16,30,0.88) 64%, rgba(4,16,30,0.92) 100%)" }} />

      {/* Analysis HUD over the work area while "analyzed" is spoken */}
      {frame >= B && frame < C + 10 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 120,
              top: 380,
              width: 840,
              height: 580,
              border: `3px solid rgba(127,211,255,${0.7 * hud})`,
              scale: String(interpolate(hud, [0, 1], [1.08, 1])),
              opacity: interpolate(frame, [C, C + 10], [1, 0], CLAMP),
            }}
          />
          {frame < B + 30 ? (
            <div style={{ position: "absolute", left: 120, width: 840, top: scanY, height: 3, background: "#7FD3FF", boxShadow: "0 0 18px #7FD3FF" }} />
          ) : null}
        </>
      ) : null}

      <Phase start={A} end={A_OUT}>
        <MaskReveal start={A} duration={9}>
          <div style={{ fontSize: 120 }}>WE DIDN'T JUST BUILD</div>
        </MaskReveal>
        <MaskReveal start={A + 8} duration={9}>
          <div style={{ fontSize: 120 }}>A TRUCK + TRAILER.</div>
        </MaskReveal>
      </Phase>
      <Phase start={B} end={B_OUT}>
        <MaskReveal start={B} duration={9} from="left">
          <div style={{ fontSize: 132 }}>
            WE <span style={{ color: COLORS.red }}>ANALYZED</span>
          </div>
        </MaskReveal>
        <MaskReveal start={B + 7} duration={9} from="left">
          <div style={{ fontSize: 112 }}>THE ENTIRE SETUP.</div>
        </MaskReveal>
      </Phase>
      <Phase start={C}>
        <div style={{ fontSize: 132, scale: String(punch(frame, C + 4, 0.12, 2, 9)) }}>
          WE <span style={{ color: COLORS.red }}>ENGINEERED</span> IT
        </div>
        <MaskReveal start={C + 8} duration={9}>
          <div style={{ fontSize: 100 }}>AROUND REAL DRIVER NEEDS.</div>
        </MaskReveal>
      </Phase>

      <Sfx at={0} name="mech-ambience" volume={0.18} />
      <Sfx at={A} name="whoosh-soft" volume={0.24} />
      <Sfx at={B} name="scan" volume={0.28} />
      <Sfx at={B + 2} name="ui-click" volume={0.24} />
      <Sfx at={C} name="impact-strong" volume={0.44} />
    </AbsoluteFill>
  );
};
