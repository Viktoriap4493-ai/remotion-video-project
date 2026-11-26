import React from "react";
import { Easing, Img, interpolate, useCurrentFrame } from "remotion";
import { ASSETS } from "./assets";
import { GILROY, WEIGHT } from "./fonts";
import { clamp, fadeUp } from "./motion";
import { BRAND_NAME, COLORS, SHADOWS } from "./tokens";

// Blue pill with the procedure name in white Medium caps.
export const ProcedurePlate: React.FC<{ text: string; top?: number; fontSize?: number }> = ({
  text,
  top = 430,
  fontSize = 47,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: "50%",
      transform: "translate(-50%, -50%)",
      height: 100,
      padding: "0 30px",
      borderRadius: 50,
      backgroundColor: COLORS.blue,
      display: "flex",
      alignItems: "center",
      whiteSpace: "nowrap",
      fontFamily: GILROY,
      fontWeight: WEIGHT.medium,
      fontSize,
      color: COLORS.white,
    }}
  >
    {text}
  </div>
);

// Top block over footage: small logo, LAZERHALL, procedure plate.
export const LogoHeader: React.FC<{ procedure: string; procedureFontSize?: number }> = ({
  procedure,
  procedureFontSize,
}) => (
  <>
    <Img
      src={ASSETS.logo}
      style={{ position: "absolute", top: 128, left: "50%", height: 104, transform: "translateX(-50%)" }}
    />
    <div
      style={{
        position: "absolute",
        top: 315,
        width: "100%",
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: GILROY,
        fontWeight: WEIGHT.extraBold,
        fontSize: 80,
        lineHeight: 1,
        color: COLORS.white,
        textShadow: SHADOWS.text,
      }}
    >
      {BRAND_NAME}
    </div>
    <ProcedurePlate text={procedure} fontSize={procedureFontSize} />
  </>
);

// Procedure title between two thin rules, address above and subtitle below
// ("RF ЛІФТИНГ" layout). The title fills the rule width.
export const SectionTitle: React.FC<{
  title: string;
  subtitle?: string;
  address?: string;
  start?: number;
  titleFontSize?: number;
}> = ({ title, subtitle, address, start = 0, titleFontSize = 147 }) => {
  const frame = useCurrentFrame();
  const rule = interpolate(frame, [start, start + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ruleStyle: React.CSSProperties = {
    position: "absolute",
    left: 140,
    width: 800,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.85)",
    transform: `scaleX(${rule})`,
  };
  const reveal = interpolate(frame, [start + 2, start + 11], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <>
      {address ? (
        <div
          style={{
            position: "absolute",
            top: 216,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            fontFamily: GILROY,
            fontWeight: WEIGHT.medium,
            fontSize: 34,
            color: COLORS.white,
            textShadow: SHADOWS.text,
            ...fadeUp(frame, start + 30, 8, -20),
          }}
        >
          <MapPin />
          {address}
        </div>
      ) : null}
      <div style={{ ...ruleStyle, top: 282 }} />
      <div
        style={{
          position: "absolute",
          top: 300,
          width: "100%",
          textAlign: "center",
          fontFamily: GILROY,
          fontWeight: WEIGHT.extraBold,
          fontSize: titleFontSize,
          lineHeight: 1,
          color: COLORS.white,
          textShadow: SHADOWS.text,
          clipPath: `inset(${(1 - reveal) * 100}% 0 0 0)`,
          transform: `translateY(${(1 - reveal) * 40}px)`,
        }}
      >
        {title}
      </div>
      <div style={{ ...ruleStyle, top: 462 }} />
      {subtitle ? (
        <div
          style={{
            position: "absolute",
            top: 486,
            left: 60,
            right: 60,
            textAlign: "center",
            whiteSpace: "pre-line",
            fontFamily: GILROY,
            fontWeight: WEIGHT.medium,
            fontSize: 46,
            lineHeight: 1.25,
            color: COLORS.white,
            textShadow: SHADOWS.text,
            ...fadeUp(frame, start + 15, 8, 30),
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </>
  );
};

export const MapPin: React.FC<{ color?: string; size?: number }> = ({ color = COLORS.pinRed, size = 30 }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 24 30" style={{ flexShrink: 0 }}>
    <path d="M12 0C5.4 0 0 5.2 0 11.6 0 20.3 12 30 12 30s12-9.7 12-18.4C24 5.2 18.6 0 12 0z" fill={color} />
    <circle cx="12" cy="11.5" r="4.6" fill="#fff" />
  </svg>
);
