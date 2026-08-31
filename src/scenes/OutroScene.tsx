import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { KenBurnsImage } from "../components/KenBurns";
import { KineticWords } from "../components/KineticWords";
import { headlineFont, bodyFont } from "../fonts";
import { COLORS } from "../theme";

const LOGO_END = 48;
const TAGLINE_START = 68;
const TAGLINE_END = 212;
const CTA_START = 231;

const TAGLINE_LINES = [
  { words: [{ text: "Lightweight." }], start: TAGLINE_START },
  { words: [{ text: "Efficient." }], start: TAGLINE_START + 48 },
  { words: [{ text: "Ready" }, { text: "to" }, { text: "haul.", emphasis: true }], start: TAGLINE_START + 96 },
];

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(frame, [0, 22], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
    output: "perceptual-scale",
  });

  const logoCornerProgress = interpolate(frame, [LOGO_END, LOGO_END + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoFontSize = interpolate(logoCornerProgress, [0, 1], [72, 32]);
  const logoBigTop = interpolate(logoCornerProgress, [0, 1], [110, 40]);

  const bgOpacity = interpolate(frame, [LOGO_END, LOGO_END + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaLocal = frame - CTA_START;
  const ctaOpacity = interpolate(ctaLocal, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaScale = interpolate(ctaLocal, [0, 18], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
    output: "perceptual-scale",
  });
  const ctaPulse = 1 + Math.sin(Math.max(ctaLocal, 0) / 18) * 0.02;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep }}>
      {/* Backgrounds for the tagline + CTA beats */}
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        {frame < CTA_START ? (
          <KenBurnsImage
            src={staticFile("images/photos/fleet-lineup.jpg")}
            durationInFrames={TAGLINE_END - LOGO_END}
            startScale={1.05}
            endScale={1.16}
            dim={0.5}
          />
        ) : (
          <KenBurnsImage
            src={staticFile("images/photos/hero-loaded-flatbed.png")}
            durationInFrames={457 - CTA_START}
            startScale={1.02}
            endScale={1.1}
            dim={0.55}
          />
        )}
      </AbsoluteFill>

      {/* Brand wordmark: center hero pop, then settle to a persistent corner mark */}
      <div
        style={{
          position: "absolute",
          top: logoBigTop,
          left: "50%",
          transform: `translateX(-50%) scale(${logoScale})`,
          opacity: logoOpacity,
          fontFamily: headlineFont,
          fontSize: logoFontSize,
          color: COLORS.white,
          letterSpacing: 1,
          textShadow: "0 6px 24px rgba(0,0,0,0.55)",
          whiteSpace: "nowrap",
        }}
      >
        DRIVE<span style={{ color: COLORS.red }}>4</span>USA
      </div>

      {/* Tagline */}
      {frame >= TAGLINE_START && frame < CTA_START + 10 ? (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 160,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              opacity: interpolate(frame, [CTA_START - 10, CTA_START + 6], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {TAGLINE_LINES.map((line, i) => (
              <KineticWords
                key={i}
                words={line.words}
                startFrame={line.start}
                perWordFrames={6}
                fontSize={64}
                fontFamily={headlineFont}
                color={COLORS.white}
                emphasisColor={COLORS.yellow}
              />
            ))}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Call to action */}
      {frame >= CTA_START ? (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 40,
          }}
        >
          <div
            style={{
              opacity: ctaOpacity,
              transform: `scale(${ctaScale * ctaPulse})`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: headlineFont,
                fontSize: 58,
                color: COLORS.white,
                marginBottom: 26,
                textShadow: "0 6px 24px rgba(0,0,0,0.6)",
              }}
            >
              Call us today.
            </div>
            <div
              style={{
                display: "inline-block",
                backgroundColor: COLORS.red,
                borderRadius: 20,
                padding: "22px 46px",
                fontFamily: bodyFont,
                fontWeight: 900,
                fontSize: 52,
                color: COLORS.white,
                letterSpacing: 1,
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              }}
            >
              +1 (312) 789-5550
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
