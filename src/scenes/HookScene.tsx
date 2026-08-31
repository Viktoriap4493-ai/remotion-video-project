import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Video } from "@remotion/media";
import { KenBurnsImage } from "../components/KenBurns";
import { KineticWords } from "../components/KineticWords";
import { headlineFont } from "../fonts";

const HOOK_WORDS = [
  { text: "How" },
  { text: "much" },
  { text: "can" },
  { text: "this" },
  { text: "setup" },
  { text: "really" },
  { text: "haul?", emphasis: true },
];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  const flashOpacity = interpolate(frame, [0, 12, 15], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const flashZoom = interpolate(frame, [0, 15], [1.25, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const payoffStart = 54;
  const payoffLocal = frame - payoffStart;
  const payoffZoom = interpolate(payoffLocal, [0, 20], [1.18, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const payoffOpacity = interpolate(payoffLocal, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#050d1c" }}>
      {/* Beat 2: dramatic empty trailer with the spoken question */}
      <AbsoluteFill style={{ opacity: frame >= 15 ? 1 : 0 }}>
        <KenBurnsImage
          src={staticFile("images/photos/empty-trailer-wide-2.jpg")}
          durationInFrames={54}
          startScale={1.05}
          endScale={1.18}
          dim={0.45}
        />
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 220,
            paddingLeft: 60,
            paddingRight: 60,
          }}
        >
          <KineticWords
            words={HOOK_WORDS}
            startFrame={17}
            perWordFrames={5}
            fontSize={82}
            fontFamily={headlineFont}
            color="#ffffff"
            emphasisColor="#ef3b3b"
          />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Beat 3: hard-cut payoff during the dramatic pause */}
      {frame >= payoffStart ? (
        <AbsoluteFill style={{ opacity: payoffOpacity }}>
          <Img
            src={staticFile("images/photos/hero-loaded-flatbed.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              scale: String(payoffZoom),
            }}
          />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(to top, rgba(5,13,28,0.75) 0%, rgba(5,13,28,0) 45%)",
            }}
          />
        </AbsoluteFill>
      ) : null}

      {/* Beat 1: quick flash cut, grille close-up */}
      {frame < 15 ? (
        <AbsoluteFill style={{ opacity: flashOpacity }}>
          <Video
            src={staticFile("video/clip-grille-fleet-a.mov")}
            style={{
              width: "100%",
              height: "100%",
              scale: String(flashZoom),
            }}
            objectFit="cover"
            muted
          />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
