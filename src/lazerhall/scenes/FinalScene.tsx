import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { textBase } from "../components";
import { COLORS, EASE_IN_OUT, EASE_OUT, beat, progress, sceneStart } from "../theme";

const S = sceneStart("final");
const LOGO_WIDTH = 680;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 811) / 1052);

export const ADDRESS = "м. Львів, вул. Мирослава Скорика, 16";

// 0:27–0:30.5 — only the original logo and the address on brand navy, then a still hold.
export const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const logoAt = beat("finalLogo") - S;
  const addressAt = beat("finalAddress") - S;
  const logo = progress(frame, logoAt, 18, EASE_OUT);
  const address = progress(frame, addressAt, 13, EASE_OUT);
  // One delicate light sweep across the gold glyphs only (masked by the logo's own shapes).
  const sweep = progress(frame, logoAt + 14, 18, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          width: LOGO_WIDTH,
          height: LOGO_HEIGHT,
          marginTop: -120,
          opacity: logo,
          scale: String(0.94 + logo * 0.06),
        }}
      >
        <Img src={staticFile("lazerhall/images/logo.png")} style={{ width: "100%", height: "100%", display: "block" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            maskImage: `url(${staticFile("lazerhall/images/logo-mask.png")})`,
            maskSize: "100% 100%",
            WebkitMaskImage: `url(${staticFile("lazerhall/images/logo-mask.png")})`,
            WebkitMaskSize: "100% 100%",
            background:
              "linear-gradient(110deg, rgba(255,255,255,0) 42%, rgba(255,250,235,0.85) 50%, rgba(255,255,255,0) 58%)",
            backgroundSize: "260% 100%",
            backgroundPosition: `${100 - sweep * 100}% 0%`,
            opacity: sweep > 0 && sweep < 1 ? 0.75 : 0,
            mixBlendMode: "soft-light",
          }}
        />
      </div>
      <div
        style={{
          ...textBase,
          marginTop: 44,
          fontSize: 38,
          fontWeight: 500,
          letterSpacing: "0.02em",
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: address,
          translate: `0px ${(1 - address) * 20}px`,
        }}
      >
        <LocationPin size={40} />
        {ADDRESS}
      </div>
    </AbsoluteFill>
  );
};

/** Minimal white map-pin glyph (vector, so it never renders as a coloured emoji). */
const LocationPin: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size * 0.75} height={size} viewBox="0 0 24 32" style={{ flex: "0 0 auto", display: "block" }}>
    <path
      d="M12 1.5C6.2 1.5 1.5 6.1 1.5 11.8 1.5 19.4 12 30.5 12 30.5S22.5 19.4 22.5 11.8C22.5 6.1 17.8 1.5 12 1.5Z"
      fill="none"
      stroke={COLORS.white}
      strokeWidth={2.4}
      strokeLinejoin="round"
    />
    <circle cx={12} cy={11.8} r={3.9} fill={COLORS.white} />
  </svg>
);
