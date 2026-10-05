import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_IN, EASE_OUT } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS_RU } from "../fonts";
import { Typewriter } from "../components/Typewriter";

const CARS = 4; // «Три машины на загрузке.»
const TYPE = 44; // «Реально остаться в пределах…»
const RATE = 1.6;
const PULSE = 88; // «…двадцати шести тысяч?»
const EXIT = 112;

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Close-up that whips out to the lineup: starts tight and drifting sideways.
  const zoom = interpolate(frame, [0, 40, 126], [1.55, 1.22, 1.1], {
    ...CLAMP,
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });
  const pan = interpolate(frame, [0, 126], [90, -40], CLAMP);
  const exit = interpolate(frame, [EXIT, EXIT + 10], [0, 1], { ...CLAMP, easing: EASE_IN });
  const carsIn = interpolate(frame, [CARS, CARS + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const pulse = interpolate(frame, [PULSE, PULSE + 4, PULSE + 10, PULSE + 14, PULSE + 20], [0, 1, 0.3, 1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ scale: String(zoom), translate: `${pan}px 0` }}>
        <Video src={staticFile("ad2/video/lineup.mp4")} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,16,30,0.2) 0%, rgba(4,16,30,0.78) 32%, rgba(4,16,30,0.78) 62%, rgba(4,16,30,0.15) 90%)",
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 220,
          fontFamily: BEBAS_RU,
          color: COLORS.white,
          textAlign: "center",
          lineHeight: 1,
          translate: `0 ${exit * -260}px`,
          opacity: 1 - exit,
          filter: `blur(${exit * 14}px)`,
        }}
      >
        <div
          style={{
            fontSize: 230,
            letterSpacing: "0.02em",
            opacity: carsIn,
            scale: String(interpolate(carsIn, [0, 1], [0.6, 1])),
            textShadow: "0 8px 30px rgba(0,0,0,0.5)",
          }}
        >
          <span style={{ color: COLORS.red }}>3</span> МАШИНЫ
        </div>
        <Typewriter
          start={TYPE}
          rate={RATE}
          style={{ fontSize: 112, marginTop: 30, textShadow: "0 6px 24px rgba(0,0,0,0.5)" }}
          spans={[
            {
              text: "26,000 LB",
              style: {
                color: COLORS.yellow,
                scale: String(1 + pulse * 0.14),
                textShadow: `0 0 ${pulse * 40}px rgba(255,210,31,0.85)`,
              },
            },
            { text: "— ЭТО ЛИМИТ?", style: { marginLeft: "0.3em" } },
          ]}
        />
      </AbsoluteFill>

      <Sfx at={CARS - 2} name="whoosh-fast" volume={0.3} />
      <Sfx at={PULSE} name="hard-stop" volume={0.36} />
      <Sfx at={PULSE + 1} name="punch" volume={0.3} />
      <Sfx at={EXIT - 2} name="whoosh-deep" volume={0.3} />
    </AbsoluteFill>
  );
};
