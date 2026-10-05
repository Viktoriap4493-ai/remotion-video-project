import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_BACK, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { TechBackground } from "../../loadcombos/components/TechBackground";
import { BEBAS_RU } from "../fonts";
import { StepCounter } from "../components/StepCounter";

const STRIP_STAGGER = 5;
const COMPRESS = 26;
const BRAND = 38;
const COUNT = [54, 62, 70];
const FIX = 80; // «…двенадцати с половиной тысяч фунтов.»

// Full-bleed strip geometry → compact panel geometry.
const STRIP_W = 270;
const PANEL = { top: 250, width: 760, height: 640, gap: 10 };

const Strip: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const start = index * STRIP_STAGGER;
  const reveal = interpolate(frame, [start, start + 7], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const c = interpolate(frame, [COMPRESS, COMPRESS + 14], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const panelStripW = (PANEL.width - PANEL.gap * 3) / 4;

  const left = interpolate(c, [0, 1], [index * STRIP_W, (1080 - PANEL.width) / 2 + index * (panelStripW + PANEL.gap)]);
  const width = interpolate(c, [0, 1], [STRIP_W, panelStripW]);
  const top = interpolate(c, [0, 1], [0, PANEL.top]);
  const height = interpolate(c, [0, 1], [1920, PANEL.height]);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        overflow: "hidden",
        borderRadius: c * 14,
        clipPath: `inset(${(1 - reveal) * 100}% 0 0 0)`,
        boxShadow: c > 0 ? `0 ${20 * c}px ${40 * c}px rgba(0,0,0,0.45)` : undefined,
      }}
    >
      <Video
        src={staticFile(`ad2/video/rig-${index + 1}.mp4`)}
        muted
        objectFit="cover"
        style={{ width: "100%", height: "100%", scale: String(1.15 - 0.15 * reveal) }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          opacity: interpolate(frame, [start + 2, start + 6], [0.5, 0], CLAMP),
        }}
      />
    </div>
  );
};

export const SetupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const brandIn = interpolate(frame, [BRAND, BRAND + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const fixIn = interpolate(frame, [FIX, FIX + 9], [0, 1], { ...CLAMP, easing: EASE_BACK });

  return (
    <AbsoluteFill>
      <TechBackground />
      {[0, 1, 2, 3].map((i) => (
        <Strip key={i} index={i} />
      ))}

      {/* Brand plate across the panel centre */}
      <div
        style={{
          position: "absolute",
          top: PANEL.top + PANEL.height / 2 - 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: COLORS.red,
            padding: "18px 60px 2px",
            fontFamily: BEBAS_RU,
            fontSize: 150,
            lineHeight: 1,
            color: COLORS.white,
            clipPath: `inset(0 ${(1 - brandIn) * 50}% 0 ${(1 - brandIn) * 50}%)`,
            boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
          }}
        >
          DRIVE4USA
        </div>
      </div>

      {/* Weight readout under the panel */}
      <div
        style={{
          position: "absolute",
          top: PANEL.top + PANEL.height + 70,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          fontFamily: BEBAS_RU,
          color: COLORS.white,
        }}
      >
        {frame < FIX ? (
          <StepCounter
            style={{ fontSize: 190, opacity: frame >= COUNT[0] ? 1 : 0 }}
            lockPunch={0}
            sfx={false}
            steps={[
              { at: COUNT[0], value: "12,100 LB" },
              { at: COUNT[1], value: "12,300 LB" },
              { at: COUNT[2], value: "12,500 LB" },
            ]}
          />
        ) : (
          <Img
            src={staticFile("ad2/img/12500.png")}
            style={{
              width: 940,
              marginTop: -10,
              scale: String(interpolate(fixIn, [0, 1], [0.7, 1]) * punch(frame, FIX + 9, 0.12, 2, 9)),
              filter: `drop-shadow(0 0 ${interpolate(frame, [FIX + 6, FIX + 10, FIX + 30], [0, 44, 14], CLAMP)}px rgba(40,140,255,0.85))`,
            }}
          />
        )}
      </div>

      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} at={i * STRIP_STAGGER} name={i % 2 ? "ui-click" : "tick"} volume={0.3} />
      ))}
      <Sfx at={COMPRESS} name="whoosh-fast" volume={0.24} />
      <Sfx at={BRAND} name="punch" volume={0.26} />
      <Sfx at={COUNT[0] - 2} name="count" volume={0.3} />
      <Sfx at={FIX} name="bass-hit" volume={0.4} />
    </AbsoluteFill>
  );
};
