import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, punch } from "../anim";
import { BEBAS } from "../fonts";
import { MaskReveal } from "../components/MaskReveal";
import { Sfx } from "../components/Sfx";

const LINE_1 = 4;
const LINE_2 = 26;
const PUNCH_26K = 38;

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 102], [1.12, 1.02], CLAMP)) }}>
        <Video src={staticFile("ad2/video/lineup.mp4")} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,16,30,0.15) 0%, rgba(4,16,30,0.72) 30%, rgba(4,16,30,0.72) 55%, rgba(4,16,30,0.1) 85%)",
          opacity: interpolate(frame, [0, 8], [0.4, 1], CLAMP),
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 260,
          fontFamily: BEBAS,
          color: COLORS.white,
          textAlign: "center",
          lineHeight: 0.98,
          textShadow: "0 6px 24px rgba(0,0,0,0.45)",
        }}
      >
        <MaskReveal start={LINE_1} duration={11}>
          <div style={{ fontSize: 138 }}>CAN YOU LOAD 3 CARS</div>
        </MaskReveal>
        <div
          style={{
            width: interpolate(frame, [LINE_1 + 6, LINE_1 + 18], [0, 300], CLAMP),
            height: 8,
            background: COLORS.red,
            margin: "18px 0 22px",
          }}
        />
        <MaskReveal start={LINE_2} duration={10} from="left">
          <div style={{ fontSize: 138 }}>
            AND STAY UNDER{" "}
            <span
              style={{
                display: "inline-block",
                color: COLORS.yellow,
                scale: String(punch(frame, PUNCH_26K, 0.32, 3, 10)),
              }}
            >
              26K
            </span>
            ?
          </div>
        </MaskReveal>
      </AbsoluteFill>

      <Sfx at={LINE_1 - 2} name="whoosh-soft" volume={0.32} />
      <Sfx at={LINE_2 - 2} name="whoosh-fast" volume={0.28} />
      <Sfx at={PUNCH_26K} name="punch" volume={0.42} />
      <Sfx at={96} name="whoosh-deep" volume={0.3} />
    </AbsoluteFill>
  );
};
