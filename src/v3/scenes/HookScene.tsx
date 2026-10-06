import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_BACK, EASE_IN, EASE_OUT } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS, GILROY } from "../../loadcombos/fonts";

// 5.mov has not been supplied; HOOK_CLIP is the one line to change when it is.
const HOOK_CLIP = "v3/video/hook-rig.mp4";

const SHOW = 2;
const DROP = 30; // weight detaches on "…3,400 pounds…"
const LAND = 46;
const MINUS = 52;
const MINUS_OUT = 80;
const CUT = 88; // flash → "We did."

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const show = interpolate(frame, [SHOW, SHOW + 8], [0, 1], { ...CLAMP, easing: EASE_BACK });
  const fall = interpolate(frame, [DROP, LAND], [0, 1], { ...CLAMP, easing: EASE_IN });
  const shake = frame >= LAND && frame < LAND + 8 ? Math.sin(frame * 2.7) * (LAND + 8 - frame) * 2.2 : 0;
  const minusIn = interpolate(frame, [MINUS, MINUS + 5], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const minusOut = interpolate(frame, [MINUS_OUT, MINUS_OUT + 6], [0, 1], { ...CLAMP, easing: EASE_IN });
  const after = interpolate(frame, [CUT, CUT + 10], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const setupIn = interpolate(frame, [CUT + 6, CUT + 18], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const cable = interpolate(frame, [SHOW + 4, SHOW + 14], [0, 1], { ...CLAMP, easing: EASE_OUT }) * (1 - fall);
  const flicker = frame >= MINUS && frame < MINUS + 8 ? (frame % 2 ? 0.4 : 1) : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          scale: String(interpolate(frame, [0, 128], [1.08, 1.2], CLAMP)),
          translate: `${shake}px ${shake * 0.6}px`,
        }}
      >
        <Video src={staticFile(HOOK_CLIP)} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(4,16,30,0.75) 0%, rgba(4,16,30,0.35) 45%, rgba(4,16,30,${0.3 + after * 0.55}) 100%)`,
        }}
      />
      <AbsoluteFill style={{ background: COLORS.navyDeep, opacity: after * 0.62 }} />

      {/* 3,400 LB hanging off the setup on two cables, then dropped */}
      {frame < LAND + 2 ? (
        <>
          {[-170, 170].map((dx) => (
            <div
              key={dx}
              style={{
                position: "absolute",
                left: 540 + dx - 2,
                top: 560,
                width: 4,
                height: 170 * cable,
                background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(227,16,27,0.9))",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: 250 + fall * 1500,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: show,
              scale: `${interpolate(show, [0, 1], [1.4, 1])} ${interpolate(show, [0, 1], [1.4, 1]) * (1 + fall * 0.35)}`,
              filter: `blur(${fall * 12}px)`,
            }}
          >
            <div style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 38, letterSpacing: "0.3em", color: COLORS.white }}>
              TRUCK + TRAILER
            </div>
            <div
              style={{
                fontFamily: BEBAS,
                fontSize: 270,
                lineHeight: 0.95,
                color: COLORS.white,
                textShadow: "0 12px 40px rgba(0,0,0,0.6)",
                borderBottom: `10px solid ${COLORS.red}`,
              }}
            >
              3,400 LB
            </div>
          </div>
        </>
      ) : null}

      {/* −3,400 LB confirmation */}
      {frame >= MINUS && frame < MINUS_OUT + 6 ? (
        <div
          style={{
            position: "absolute",
            top: 640,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: BEBAS,
            fontSize: 230,
            color: COLORS.red,
            textShadow: "0 0 40px rgba(227,16,27,0.7)",
            opacity: minusIn * (1 - minusOut) * flicker,
            scale: String(interpolate(minusIn, [0, 1], [0.7, 1]) * (1 - minusOut * 0.4)),
          }}
        >
          −3,400 LB
        </div>
      ) : null}

      {/* "We did." */}
      {frame >= CUT ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 520,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: after,
              scale: String(interpolate(after, [0, 1], [1.25, 1])),
            }}
          >
            <div style={{ fontFamily: BEBAS, fontSize: 176, lineHeight: 1, color: COLORS.white }}>WE CUT THE WEIGHT</div>
            <div style={{ width: 420 * after, height: 6, background: COLORS.red, margin: "18px 0" }} />
            <div style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 40, letterSpacing: "0.3em", color: COLORS.white }}>
              TRUCK + TRAILER
            </div>
          </div>
          {/* наш сетап: the Drive4USA rig as the supporting visual */}
          <Img
            src={staticFile("ad2/img/rig-cutout.png")}
            style={{
              position: "absolute",
              left: 60,
              top: 1010,
              width: 960,
              opacity: setupIn,
              translate: `${(1 - setupIn) * 400}px 0`,
              filter: "drop-shadow(0 0 14px rgba(227,16,27,0.75))",
            }}
          />
        </>
      ) : null}

      <Sfx at={SHOW} name="whoosh-soft" volume={0.3} />
      <Sfx at={DROP} name="whoosh-deep" volume={0.4} />
      <Sfx at={LAND} name="impact-strong" volume={0.46} />
      <Sfx at={MINUS} name="lock" volume={0.32} />
      <Sfx at={CUT} name="punch" volume={0.42} />
      <Sfx at={CUT + 6} name="whoosh-fast" volume={0.24} />
    </AbsoluteFill>
  );
};
