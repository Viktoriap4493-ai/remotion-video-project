import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AccentLine, Clip, SlideIn, TEXT_SHADOW, textBase } from "../components";
import {
  COLORS,
  EASE_IN,
  EASE_IN_OUT,
  EASE_OUT,
  STRIKE_FRAMES,
  BeatKey,
  SceneKey,
  beat,
  bounce,
  mix,
  progress,
  sceneLength,
  sceneStart,
} from "../theme";

type Offer = {
  scene: SceneKey;
  name: string[];
  nameSize: number;
  oldPrice: string;
  newPrice: string;
  beats: { name: BeatKey; old: BeatKey; strike: BeatKey; newPrice: BeatKey };
  enter: "up" | "right";
  exit: boolean;
};

export const OFFERS: Offer[] = [
  {
    scene: "offer1",
    name: ["НИЖНЯ ТРЕТИНА ОБЛИЧЧЯ", "+ ПІДЩЕЛЕПНА ЗОНА"],
    nameSize: 60,
    oldPrice: "12 500",
    newPrice: "7 500",
    beats: { name: "offer1Name", old: "offer1Old", strike: "offer1Strike", newPrice: "offer1New" },
    enter: "up",
    exit: true,
  },
  {
    scene: "offer2",
    name: ["ОБЛИЧЧЯ ПОВНІСТЮ"],
    nameSize: 76,
    oldPrice: "15 000",
    newPrice: "9 000",
    beats: { name: "offer2Name", old: "offer2Old", strike: "offer2Strike", newPrice: "offer2New" },
    enter: "right",
    exit: false,
  },
];

// 0:18–0:24 — two offers, one at a time: zone → old price → red strike → new price.
export const OfferScene: React.FC<{ offer: Offer }> = ({ offer }) => {
  const frame = useCurrentFrame();
  const S = sceneStart(offer.scene);
  const LEN = sceneLength(offer.scene);
  const at = (key: BeatKey) => beat(key) - S;

  const enter = progress(frame, 0, 8, EASE_OUT);
  const exit = offer.exit ? progress(frame, LEN - 5, 5, EASE_IN) : 0;
  const strike = progress(frame, at(offer.beats.strike), STRIKE_FRAMES, EASE_IN_OUT);
  const newAt = at(offer.beats.newPrice);
  const pop = bounce(frame, newAt);
  // Light glint across the new price on the "lock" click.
  const glint = progress(frame, newAt + 9, 12, EASE_IN_OUT);

  const contentTranslate =
    offer.enter === "up" ? `0px ${(1 - enter) * 1920}px` : `${(1 - enter) * 420}px 0px`;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <AbsoluteFill style={{ translate: offer.enter === "up" ? contentTranslate : undefined }}>
        <AbsoluteFill style={{ backgroundColor: COLORS.navy }} />
        <AbsoluteFill style={{ opacity: 0.22 }}>
          <Clip name="1175" from={0} to={LEN} trim={offer.scene === "offer1" ? 0.5 : 3.0} zoom={[1.15, 1.22]} blur={24} />
        </AbsoluteFill>
        <AbsoluteFill
          style={{ background: "radial-gradient(circle at 50% 58%, rgba(40,80,180,0.35) 0%, rgba(5,29,94,0) 60%)" }}
        />

        <AbsoluteFill
          style={{
            alignItems: "center",
            ...textBase,
            textAlign: "center",
            translate: offer.enter === "right" ? contentTranslate : `${-exit * 420}px 0px`,
            filter: `blur(${(offer.enter === "right" ? (1 - enter) * 12 : 0) + exit * 14}px)`,
            opacity: offer.enter === "right" ? enter : 1 - exit * 0.7,
          }}
        >
          <div
            style={{
              marginTop: 420,
              background: COLORS.yellow,
              color: COLORS.navy,
              fontWeight: 800,
              fontSize: 44,
              padding: "10px 26px",
              borderRadius: 12,
              letterSpacing: "0.02em",
            }}
          >
            −40%
          </div>

          <SlideIn at={at(offer.beats.name)} direction="up" distance={50} style={{ marginTop: 70 }}>
            {offer.name.map((line) => (
              <div key={line} style={{ fontSize: offer.nameSize, fontWeight: 800, marginTop: 8, textShadow: TEXT_SHADOW }}>
                {line}
              </div>
            ))}
          </SlideIn>
          <AccentLine at={at(offer.beats.name) + 6} width={200} align="center" style={{ marginTop: 40 }} />

          {/* Old price with the red strike drawn left → right; numbers stay readable. */}
          <SlideIn at={at(offer.beats.old)} direction="up" distance={30} style={{ marginTop: 70 }}>
            <div style={{ position: "relative", display: "inline-block", padding: "0 18px" }}>
              <span style={{ fontSize: 104, fontWeight: 700, opacity: 0.92 }}>{offer.oldPrice}</span>
              <span style={{ fontSize: 60, fontWeight: 700, opacity: 0.92 }}> грн</span>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "52%",
                  height: 10,
                  marginTop: -5,
                  borderRadius: 10,
                  background: COLORS.red,
                  rotate: "-7deg",
                  transformOrigin: "left center",
                  scale: `${strike} 1`,
                  boxShadow: "0 0 14px rgba(229,38,43,0.55)",
                }}
              />
            </div>
          </SlideIn>

          <div
            style={{
              position: "relative",
              marginTop: 40,
              color: COLORS.yellow,
              fontWeight: 800,
              lineHeight: 1,
              scale: String(mix(pop, 0.35, 1)),
              opacity: interpolate(frame, [newAt, newAt + 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              filter: `blur(${(1 - progress(frame, newAt, 6)) * 12}px)`,
              textShadow: "0 0 50px rgba(255,216,77,0.35), 0 14px 40px rgba(2,10,36,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 210, letterSpacing: "-0.03em" }}>{offer.newPrice}</span>
            <span style={{ fontSize: 104 }}> грн</span>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(105deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 60%)",
                backgroundSize: "250% 100%",
                backgroundPosition: `${100 - glint * 100}% 0%`,
                mixBlendMode: "overlay",
                opacity: glint > 0 && glint < 1 ? 1 : 0,
              }}
            />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
