import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../config";
import { progress } from "./anim";

type Props = {
  text: string;
  pillAt: number; // light pill unfolds from the marker
  textAt: number; // address revealed left → right
  fontSize?: number;
};

export const AddressReveal: React.FC<Props> = ({ text, pillAt, textAt, fontSize = 46 }) => {
  const frame = useCurrentFrame();
  const pill = progress(frame, pillAt, pillAt + 10);
  const txt = progress(frame, textAt, textAt + 12);
  return (
    <div
      style={{
        position: "relative",
        padding: "26px 40px 22px",
        borderRadius: 999,
        background: COLORS.light,
        border: `2px solid rgba(184,74,66,0.18)`,
        clipPath: `inset(0 ${(1 - pill) * 100}% 0 0 round 999px)`,
        opacity: pill > 0 ? 1 : 0,
      }}
    >
      <div
        style={{
          fontFamily: FONT.family,
          fontWeight: FONT.semibold,
          fontSize,
          color: COLORS.graphite,
          whiteSpace: "nowrap",
          clipPath: `inset(-10px ${(1 - txt) * 100}% -10px 0)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
