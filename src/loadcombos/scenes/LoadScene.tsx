import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_BACK, EASE_IN, EASE_OUT, punch } from "../anim";
import { BEBAS, BRITTANY, GILROY } from "../fonts";
import type { Load } from "../data";
import { CheckIcon } from "../components/CheckIcon";
import { DriveInCar } from "../components/DriveInCar";
import { MaskReveal } from "../components/MaskReveal";
import { Sfx, type SfxName } from "../components/Sfx";
import { TechBackground } from "../components/TechBackground";

export type LoadTiming = {
  cars: number[]; // frame each vehicle starts driving into its card
  drive: number; // drive-in duration in frames
  cargo: number;
  total: number;
  under: number;
  exit?: number; // frame the board starts clearing for the next load
  energetic?: boolean;
};

const BOARD_LEFT = 90;
const BOARD_WIDTH = 900;
const BOARD_TOP = 236;
const CAR_SFX: SfxName[] = ["car-a", "car-b", "car-c"];

const parseWeight = (w: string) => Number(w.replace(/[^\d]/g, ""));
const formatWeight = (n: number) => `${n.toLocaleString("en-US")} LB`;

// Script names are fitted to the text column instead of wrapping
// (Allura averages ~0.45em per character).
const nameSize = (name: string, max: number, column: number) =>
  Math.min(max, Math.floor(column / (name.length * 0.45)));

const VehicleCard: React.FC<{
  index: number;
  top: number;
  height: number;
  vehicle: Load["vehicles"][number];
  carStart: number;
  drive: number;
  big: boolean;
  idPrefix: string;
}> = ({ index, top, height, vehicle, carStart, drive, big, idPrefix }) => {
  const frame = useCurrentFrame();
  const cardIn = interpolate(frame, [index * 3, index * 3 + 9], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const nameAt = carStart + drive + 1;
  const weightAt = nameAt + 5;
  const write = interpolate(frame, [nameAt, nameAt + 12], [0, 1], CLAMP);
  const weightIn = interpolate(frame, [weightAt, weightAt + 6], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const carWidth = big ? 450 : 420;
  const textColumn = BOARD_WIDTH - carWidth - 34 - 20;

  return (
    <div
      style={{
        position: "absolute",
        left: BOARD_LEFT,
        top,
        width: BOARD_WIDTH,
        height,
        background: COLORS.white,
        borderRadius: 6,
        overflow: "hidden",
        boxShadow: "0 14px 30px rgba(0,0,0,0.28)",
        clipPath: `inset(0 ${(1 - cardIn) * 100}% 0 0)`,
        translate: `${(1 - cardIn) * -40}px 0`,
      }}
    >
      <div style={{ position: "absolute", left: 16, bottom: 10, width: carWidth, height: height - 22 }}>
        <DriveInCar
          id={`${idPrefix}-car-${index}`}
          src={vehicle.img}
          start={carStart}
          duration={drive}
          travel={BOARD_WIDTH - 10}
          width={carWidth}
          height={height - 22}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: carWidth + 34,
          right: 20,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: BRITTANY,
            fontSize: nameSize(vehicle.name, big ? 76 : 66, textColumn),
            color: COLORS.navy,
            lineHeight: 1.15,
            whiteSpace: "nowrap",
            clipPath: `inset(-20% ${(1 - write) * 100}% -30% 0)`,
            translate: `0 ${(1 - write) * 6}px`,
          }}
        >
          {vehicle.name}
        </div>
        <div
          style={{
            fontFamily: BEBAS,
            fontSize: big ? 132 : 112,
            color: COLORS.red,
            lineHeight: 0.95,
            opacity: weightIn,
            translate: `${(1 - weightIn) * 40}px 0`,
            scale: String(punch(frame, weightAt + 5, 0.12, 2, 7)),
            transformOrigin: "left center",
          }}
        >
          {vehicle.weight}
        </div>
      </div>

      <Sfx at={carStart} name={CAR_SFX[index % 3]} volume={0.34} />
      <Sfx at={carStart + drive - 1} name="card-thud" volume={0.3} />
      <Sfx at={nameAt} name="pen" volume={0.22} />
      <Sfx at={weightAt + 4} name="tick" volume={0.2} />
    </div>
  );
};

export const LoadScene: React.FC<{ load: Load; timing: LoadTiming; idPrefix: string }> = ({
  load,
  timing,
  idPrefix,
}) => {
  const frame = useCurrentFrame();
  const n = load.vehicles.length;
  const big = n === 2;
  const cardH = big ? 320 : 236;
  const gap = big ? 36 : 26;
  const cardsBottom = BOARD_TOP + n * cardH + (n - 1) * gap;
  const infoTop = cardsBottom + 36;
  const boxTop = infoTop + 222;

  const { cargo, total, under, exit, energetic } = timing;
  const cargoValue = parseWeight(load.cargo);
  const countP = interpolate(frame, [cargo + 2, cargo + 12], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const boxIn = interpolate(frame, [total, total + 7], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const underIn = interpolate(frame, [under, under + 7], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const exitP =
    exit === undefined
      ? 0
      : interpolate(frame, [exit, exit + 6], [0, 1], { ...CLAMP, easing: EASE_IN });
  const sheen = interpolate(frame, [under + 12, under + 30], [-30, 130], CLAMP);
  const push = energetic ? interpolate(frame, [under, under + 60], [1, 1.035], CLAMP) : 1;

  return (
    <AbsoluteFill>
      <TechBackground />
      <AbsoluteFill
        style={{
          opacity: 1 - exitP,
          translate: `0 ${exitP * -60}px`,
          scale: String(push),
        }}
      >
        {/* Load tag */}
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: interpolate(frame, [0, 10], [0, 70], { ...CLAMP, easing: EASE_OUT }),
              height: 5,
              background: COLORS.red,
            }}
          />
          <MaskReveal start={1} duration={9}>
            <div
              style={{
                fontFamily: GILROY,
                fontWeight: 800,
                fontSize: 40,
                letterSpacing: "0.22em",
                color: COLORS.white,
              }}
            >
              {load.label}
            </div>
          </MaskReveal>
          <div
            style={{
              width: interpolate(frame, [0, 10], [0, 70], { ...CLAMP, easing: EASE_OUT }),
              height: 5,
              background: COLORS.red,
            }}
          />
        </div>

        {load.vehicles.map((v, i) => (
          <VehicleCard
            key={i}
            index={i}
            top={BOARD_TOP + i * (cardH + gap)}
            height={cardH}
            vehicle={v}
            carStart={timing.cars[i]}
            drive={timing.drive}
            big={big}
            idPrefix={idPrefix}
          />
        ))}

        {/* "+" joints between cards */}
        {load.vehicles.slice(1).map((_, i) => {
          const at = timing.cars[i + 1] - 2;
          const p = interpolate(frame, [at, at + 7], [0, 1], { ...CLAMP, easing: EASE_BACK });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: BOARD_LEFT - 30,
                top: BOARD_TOP + (i + 1) * (cardH + gap) - gap / 2 - 26,
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: COLORS.red,
                border: `4px solid ${COLORS.white}`,
                color: COLORS.white,
                fontFamily: GILROY,
                fontWeight: 800,
                fontSize: 40,
                lineHeight: "42px",
                textAlign: "center",
                scale: String(p),
                zIndex: 2,
              }}
            >
              +
            </div>
          );
        })}

        {/* Cargo weight + UNDER row */}
        <div
          style={{
            position: "absolute",
            top: infoTop,
            left: 60,
            right: 60,
            height: 180,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ width: 470, paddingLeft: 20 }}>
            <MaskReveal start={cargo} duration={8}>
              <div
                style={{
                  fontFamily: GILROY,
                  fontWeight: 800,
                  fontSize: 40,
                  color: COLORS.white,
                  letterSpacing: "0.04em",
                }}
              >
                CARGO WEIGHT:
              </div>
            </MaskReveal>
            <div
              style={{
                fontFamily: BEBAS,
                fontSize: 128,
                lineHeight: 0.95,
                color: COLORS.white,
                opacity: interpolate(frame, [cargo + 2, cargo + 4], [0, 1], CLAMP),
                scale: String(punch(frame, cargo + 12, 0.18, 3, 9)),
                transformOrigin: "left center",
              }}
            >
              {formatWeight(Math.round(cargoValue * countP))}
            </div>
          </div>
          <div
            style={{
              width: 4,
              height: interpolate(frame, [cargo, cargo + 10], [0, 160], { ...CLAMP, easing: EASE_OUT }),
              background: "rgba(255,255,255,0.85)",
              borderRadius: 2,
            }}
          />
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 18, paddingLeft: 28 }}>
            <CheckIcon start={under} size={92} />
            <div>
              <div
                style={{
                  fontFamily: BEBAS,
                  fontSize: 104,
                  lineHeight: 0.95,
                  color: COLORS.yellow,
                  opacity: underIn,
                  scale: String(interpolate(underIn, [0, 1], [1.8, 1]) * punch(frame, under + 8, 0.14, 2, 8)),
                  transformOrigin: "left center",
                  filter: `blur(${(1 - underIn) * 8}px)`,
                }}
              >
                {load.under}
              </div>
              <MaskReveal start={under + 5} duration={8}>
                <div
                  style={{
                    fontFamily: GILROY,
                    fontWeight: 800,
                    fontSize: 48,
                    lineHeight: 1,
                    color: COLORS.white,
                    letterSpacing: "0.06em",
                  }}
                >
                  UNDER
                </div>
              </MaskReveal>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            position: "absolute",
            top: infoTop + 196,
            left: 60,
            height: 3,
            width: interpolate(frame, [cargo + 4, cargo + 16], [0, 960], { ...CLAMP, easing: EASE_OUT }),
            background: "rgba(255,255,255,0.8)",
          }}
        />

        {/* Setup + cargo total */}
        <div
          style={{
            position: "absolute",
            top: boxTop,
            left: 60,
            width: 960,
            height: 280,
            borderRadius: 28,
            background: `linear-gradient(180deg, #F0262E 0%, ${COLORS.red} 55%, #C00A14 100%)`,
            boxShadow: energetic
              ? `0 0 ${interpolate(frame, [under + 4, under + 14, under + 40], [0, 60, 24], CLAMP)}px rgba(255,60,60,0.65)`
              : "0 18px 40px rgba(0,0,0,0.3)",
            scale: `1 ${boxIn}`,
            opacity: boxIn > 0 ? 1 : 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 160,
              left: `${sheen}%`,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
              transform: "skewX(-18deg)",
            }}
          />
          <MaskReveal start={total + 3} duration={7}>
            <div
              style={{
                fontFamily: GILROY,
                fontWeight: 700,
                fontSize: 34,
                letterSpacing: "0.24em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              SETUP + CARGO
            </div>
          </MaskReveal>
          <div
            style={{
              fontFamily: BEBAS,
              fontSize: 156,
              lineHeight: 0.92,
              color: COLORS.yellow,
              textShadow: "0 5px 0 rgba(120,0,0,0.35)",
              opacity: interpolate(frame, [total + 5, total + 8], [0, 1], CLAMP),
              scale: String(
                interpolate(frame, [total + 5, total + 12], [0.7, 1], { ...CLAMP, easing: EASE_BACK }) *
                  punch(frame, total + 12, 0.12, 2, 8),
              ),
            }}
          >
            {load.total}
          </div>
          <MaskReveal start={total + 9} duration={7}>
            <div
              style={{
                fontFamily: GILROY,
                fontWeight: 800,
                fontSize: 50,
                letterSpacing: "0.08em",
                color: COLORS.white,
              }}
            >
              TOTAL SETUP
            </div>
          </MaskReveal>
        </div>
      </AbsoluteFill>

      <Sfx at={0} name="whoosh-fast" volume={0.22} />
      <Sfx at={cargo} name="ui-click" volume={0.3} />
      <Sfx at={cargo + 12} name="punch" volume={0.36} />
      <Sfx at={total} name="whoosh-fast" volume={0.18} />
      <Sfx at={total + 12} name="hard-stop" volume={0.24} />
      <Sfx at={under + 4} name="impact-strong" volume={energetic ? 0.48 : 0.4} />
      {energetic ? <Sfx at={under + 14} name="whoosh-soft" volume={0.16} /> : null}
    </AbsoluteFill>
  );
};
