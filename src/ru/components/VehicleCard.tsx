import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_OUT } from "../../loadcombos/anim";
import { DriveInCar } from "../../loadcombos/components/DriveInCar";
import { Sfx, type SfxName } from "../../loadcombos/components/Sfx";
import { BRITTANY } from "../fonts";

// White card a vehicle drives into (from either side), followed by its
// hand-written name. The card itself wipes open from the entry side.
export const VehicleCard: React.FC<{
  id: string;
  img: string;
  name: string;
  left: number;
  top: number;
  width: number;
  height: number;
  openAt: number;
  carAt: number;
  drive?: number;
  from: "left" | "right";
  carSfx: SfxName;
  shadow?: string;
}> = ({ id, img, name, left, top, width, height, openAt, carAt, drive = 16, from, carSfx, shadow }) => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [openAt, openAt + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const nameAt = carAt + drive + 2;
  const write = interpolate(frame, [nameAt, nameAt + 13], [0, 1], CLAMP);
  const carWidth = Math.round(width * 0.52);
  const column = width - carWidth - 54;
  const nameSize = Math.min(78, Math.floor(column / (name.length * 0.45)));

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        background: COLORS.white,
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: shadow ?? "0 18px 40px rgba(7,28,51,0.25)",
        clipPath:
          from === "left"
            ? `inset(0 ${(1 - open) * 100}% 0 0 round 10px)`
            : `inset(0 0 0 ${(1 - open) * 100}% round 10px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: from === "left" ? 18 : undefined,
          right: from === "right" ? width - carWidth - 18 : undefined,
          bottom: 12,
          width: carWidth,
          height: height - 26,
        }}
      >
        <DriveInCar
          id={id}
          src={img}
          start={carAt}
          duration={drive}
          travel={from === "left" ? -(carWidth + 40) : width}
          width={carWidth}
          height={height - 26}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: carWidth + 40,
          right: 14,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          fontFamily: BRITTANY,
          fontSize: nameSize,
          color: COLORS.navy,
          whiteSpace: "nowrap",
          clipPath: `inset(-30% ${(1 - write) * 100}% -30% 0)`,
        }}
      >
        {name}
      </div>
      <Sfx at={carAt} name={carSfx} volume={0.34} />
      <Sfx at={carAt + drive - 1} name="card-thud" volume={0.28} />
      <Sfx at={nameAt} name="pen" volume={0.22} />
    </div>
  );
};
