import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_BACK, EASE_OUT, punch } from "../anim";
import { BEBAS } from "../fonts";
import { MaskReveal } from "../components/MaskReveal";
import { Sfx } from "../components/Sfx";

const TITLE = 16;
const WEIGHT_IN = 36;
const WEIGHT_PUNCH = 46;

const Tile: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const start = index * 3;
  const p = interpolate(frame, [start, start + 10], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: COLORS.navyDeep,
        opacity: p,
      }}
    >
      <div style={{ position: "absolute", inset: 0, scale: String(1.25 - 0.17 * p + frame * 0.0012) }}>
        <Video
          src={staticFile(`ad2/video/rig-${index + 1}.mp4`)}
          muted
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export const SetupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [TITLE - 4, TITLE + 8], [0, 0.62], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep }}>
      <AbsoluteFill
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 8,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <Tile key={i} index={i} />
        ))}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(7,28,51,${dim + 0.2}) 0%, rgba(7,28,51,${dim}) 70%)`,
        }}
      />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 120 }}>
        <MaskReveal start={TITLE} duration={10}>
          <div
            style={{
              fontFamily: BEBAS,
              fontSize: 128,
              color: COLORS.white,
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}
          >
            DRIVE4USA SETUP
          </div>
        </MaskReveal>
        <div
          style={{
            width: interpolate(frame, [TITLE + 4, TITLE + 16], [0, 560], { ...CLAMP, easing: EASE_OUT }),
            height: 6,
            background: COLORS.red,
            margin: "14px 0 40px",
          }}
        />
        <Img
          src={staticFile("ad2/img/12500.png")}
          style={{
            width: 960,
            opacity: interpolate(frame, [WEIGHT_IN, WEIGHT_IN + 4], [0, 1], CLAMP),
            scale: String(
              interpolate(frame, [WEIGHT_IN, WEIGHT_IN + 10], [0.55, 1], { ...CLAMP, easing: EASE_BACK }) *
                punch(frame, WEIGHT_PUNCH, 0.16, 3, 10),
            ),
            translate: `0 ${interpolate(frame, [WEIGHT_IN, WEIGHT_IN + 10], [60, 0], { ...CLAMP, easing: EASE_OUT })}px`,
            filter: `drop-shadow(0 0 ${interpolate(frame, [WEIGHT_PUNCH, WEIGHT_PUNCH + 4, WEIGHT_PUNCH + 20], [0, 40, 12], CLAMP)}px rgba(40,140,255,0.8))`,
          }}
        />
      </AbsoluteFill>

      <Sfx at={0} name="mech-ambience" volume={0.22} />
      <Sfx at={TITLE} name="ui-click" volume={0.35} />
      <Sfx at={WEIGHT_IN - 3} name="whoosh-fast" volume={0.25} />
      <Sfx at={WEIGHT_PUNCH} name="bass-hit" volume={0.38} />
    </AbsoluteFill>
  );
};
