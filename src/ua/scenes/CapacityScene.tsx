import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_IN, EASE_OUT, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS_UA } from "../fonts";
import { CargoIcon, DownArrow, SetupLink } from "../components/Icons";
import { Whip } from "../components/Whip";

// вага.MOV: plays in from 2.1s, HOLDS one full second on the 2.7s frame
// (nothing is drawn over the ticket: 12,520 LB is the whole setup's weight,
// not the trailer's, so it is not highlighted), then plays on in slow motion.
// Type stays in the sky band above y ≈ 560.
const HOLD = 18;
const RESUME = 48; // «…більший ваговий запас…»
const MORE = 48;
const RESERVE = 56;
const FLEX = 103; // «та більше гнучкості у виборі setup для вашого трака.»
const FLEX_2 = 112;
const WHIP_OUT = 158;

const Block: React.FC<{ from: number; to?: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from) return null;
  const out = to === undefined ? 0 : interpolate(frame, [to, to + 5], [0, 1], { ...CLAMP, easing: EASE_IN });
  if (out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: BEBAS_UA,
        lineHeight: 1,
        color: COLORS.white,
        opacity: 1 - out,
        translate: `0 ${-out * 100}px`,
      }}
    >
      {children}
    </div>
  );
};

export const CapacityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = (at: number, d = 7) => interpolate(frame, [at, at + d], [0, 1], { ...CLAMP, easing: EASE_OUT });

  return (
    <Whip outAt={WHIP_OUT}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        {frame < HOLD ? (
          <Video src={staticFile("v3/video/scale-ticket.mp4")} muted trimBefore={63} objectFit="cover" style={{ width: "100%", height: "100%" }} />
        ) : frame < RESUME ? (
          <Img src={staticFile("v3/img/ticket-freeze.jpg")} style={{ width: "100%", height: "100%" }} />
        ) : null}
        <Sequence from={RESUME} layout="none">
          <AbsoluteFill style={{ scale: String(interpolate(frame, [RESUME, 164], [1, 1.06], CLAMP)) }}>
            <Video src={staticFile("v3/video/scale-ticket.mp4")} muted trimBefore={81} playbackRate={0.67} objectFit="cover" style={{ width: "100%", height: "100%" }} />
          </AbsoluteFill>
        </Sequence>

        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, rgba(4,16,30,0.88) 0%, rgba(4,16,30,0.7) 22%, rgba(4,16,30,0) 30%)",
            opacity: interpolate(frame, [RESUME - 6, RESUME], [0, 1], CLAMP),
          }}
        />

        <Block from={MORE} to={FLEX - 4}>
          <div style={{ fontSize: 200, opacity: enter(MORE, 3), scale: String(interpolate(enter(MORE, 6), [0, 1], [1.5, 1]) * punch(frame, MORE + 6, 0.05, 2, 6)) }}>
            БІЛЬШЕ
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 4 }}>
            <div style={{ fontSize: 110, clipPath: `inset(0 ${(1 - enter(RESERVE, 9)) * 100}% 0 0)` }}>ВАГОВОГО ЗАПАСУ</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: enter(RESERVE + 6) }}>
              <CargoIcon size={70} draw={enter(RESERVE + 6, 10)} />
            </div>
          </div>
          <div style={{ marginTop: 10, opacity: enter(RESERVE + 8) }}>
            <DownArrow size={50} draw={enter(RESERVE + 8, 10)} />
          </div>
        </Block>

        <Block from={FLEX}>
          <div style={{ fontSize: 140, opacity: enter(FLEX, 5), translate: `${(1 - enter(FLEX)) * -200}px 0` }}>БІЛЬШЕ ГНУЧКОСТІ</div>
          <div style={{ fontSize: 120, opacity: enter(FLEX_2, 5), translate: `${(1 - enter(FLEX_2)) * 200}px 0` }}>
            ДЛЯ ВАШОГО <span style={{ color: COLORS.red }}>SETUP</span>
          </div>
          <div style={{ marginTop: 18 }}>
            <SetupLink draw={enter(FLEX_2 + 6, 22)} />
          </div>
        </Block>

        <Sfx at={HOLD} name="hard-stop" volume={0.26} />
        <Sfx at={HOLD + 2} name="tick" volume={0.2} />
        <Sfx at={MORE} name="punch" volume={0.34} />
        <Sfx at={RESERVE} name="whoosh-fast" volume={0.2} />
        <Sfx at={FLEX} name="whoosh-soft" volume={0.22} />
        <Sfx at={FLEX_2 + 6} name="lock" volume={0.26} />
        <Sfx at={WHIP_OUT - 2} name="whoosh-deep" volume={0.3} />
      </AbsoluteFill>
    </Whip>
  );
};
