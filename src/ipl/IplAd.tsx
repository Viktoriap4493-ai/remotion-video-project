import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio, Video } from "@remotion/media";
import { gilroy } from "../lazerhall/fonts";

// LAZERHALL IPL-therapy Black Friday ad. No voiceover: scenes and text land on
// the beat grid of the supplied music track (120 BPM, first beat at 0.16s), and
// the SFX times in scripts/ipl_audio.py match the moments below.
export const FPS = 30;
const BEAT = 0.5;
const PHASE = 0.16;
const s = (seconds: number) => Math.round(seconds * FPS);
// duration of n beats
const b = (beats: number) => beats * BEAT;
// absolute time of beat n
const k = (beat: number) => PHASE + beat * BEAT;
// the music runs 29.7s and fades out at the very end
export const DURATION_IN_FRAMES = s(29.6);

const BRAND_BLUE = "#051D5E";
const LIGHT_BG = "#EEF1F8";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const shadow = "0 2px 14px rgba(0,0,0,0.45)";

const SCENES = {
  intro: { from: 0, to: k(8) },
  about: { from: k(8), to: k(17) },
  benefits: { from: k(17), to: k(28) },
  results: { from: k(28), to: k(42) },
  offer: { from: k(42), to: k(51) },
  final: { from: k(51), to: 29.6 },
};

const sceneSeq = (name: keyof typeof SCENES) => ({
  from: s(SCENES[name].from),
  durationInFrames: s(SCENES[name].to) - s(SCENES[name].from),
});

// Scene-local frame of an absolute timeline second.
const local = (name: keyof typeof SCENES, seconds: number) => s(seconds) - s(SCENES[name].from);

const fadeUp = (frame: number, start: number, length = 9, distance = 34) => ({
  opacity: interpolate(frame, [start, start + length], [0, 1], clamp),
  transform: `translateY(${interpolate(frame, [start, start + length], [distance, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  })}px)`,
});

const usePop = (start: number, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping, stiffness: 180, mass: 0.7 } });
};

const Clip: React.FC<{ src: string; sourceStart: number; length: number; fadeIn?: boolean; zoom?: [number, number] }> = ({
  src,
  sourceStart,
  length,
  fadeIn = true,
  zoom = [1.02, 1.09],
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{ overflow: "hidden", opacity: fadeIn ? interpolate(frame, [0, 6], [0, 1], clamp) : 1 }}
    >
      <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, length], zoom)})` }}>
        <Video
          src={staticFile(`lazerhall/video/${src}.mp4`)}
          trimBefore={s(sourceStart)}
          style={{ width: "100%", height: "100%" }}
          objectFit="cover"
          muted
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type Shot = { src: string; from: number; to: number; sourceStart: number };

// Shots are given in scene-local seconds.
const Shots: React.FC<{ shots: Shot[] }> = ({ shots }) => (
  <>
    {shots.map((shot, i) => {
      const length = s(shot.to) - s(shot.from) + (i < shots.length - 1 ? 6 : 0);
      return (
        <Sequence key={`${shot.src}-${shot.from}`} from={s(shot.from)} durationInFrames={length}>
          <Clip src={shot.src} sourceStart={shot.sourceStart} length={length} fadeIn={i > 0} />
        </Sequence>
      );
    })}
  </>
);

// "BLACK FRIDAY" pill with the tilted "SALE" tag, redrawn in Gilroy and brand blue.
const BlackFridayBadge: React.FC<{ start: number; scale?: number }> = ({ start, scale = 1 }) => {
  const pill = usePop(start, 13);
  const tag = usePop(start + s(BEAT), 9);
  return (
    <div style={{ position: "relative", transform: `scale(${scale})` }}>
      <div
        style={{
          transform: `translateX(${(1 - pill) * -220}px) scale(${0.7 + pill * 0.3})`,
          opacity: Math.min(1, pill * 1.5),
          padding: "24px 50px",
          borderRadius: 120,
          border: `5px solid ${BRAND_BLUE}`,
          backgroundColor: "#fff",
          fontFamily: gilroy,
          fontWeight: 800,
          fontSize: 84,
          lineHeight: 1,
          color: BRAND_BLUE,
          whiteSpace: "nowrap",
          boxShadow: "0 20px 50px rgba(5,29,94,0.18)",
        }}
      >
        BLACK FRIDAY
      </div>
      <div
        style={{
          position: "absolute",
          right: -84,
          top: -58,
          transform: `rotate(${interpolate(tag, [0, 1], [-30, 14])}deg) scale(${tag})`,
          padding: "14px 36px",
          borderRadius: 90,
          backgroundColor: BRAND_BLUE,
          border: "4px solid #fff",
          fontFamily: gilroy,
          fontWeight: 900,
          fontSize: 70,
          lineHeight: 1,
          color: "#fff",
          boxShadow: "0 14px 34px rgba(5,29,94,0.35)",
        }}
      >
        SALE
      </div>
    </div>
  );
};

// Scene 1 — aesthetic face shot, Black Friday badge, "-50%" slam on the bass hit.
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const slamAt = s(k(3)) - 1;
  const slam = interpolate(frame, [slamAt, slamAt + 6], [2.6, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const flash = interpolate(frame, [slamAt, slamAt + 2, slamAt + 9], [0, 0.8, 0], clamp);
  const shake = frame >= slamAt && frame < slamAt + 9 ? Math.sin(frame * 2.7) * (slamAt + 9 - frame) * 1.5 : 0;
  const exit = interpolate(frame, [durationInFrames - 6, durationInFrames], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Clip src="face-closeup" sourceStart={0.3} length={durationInFrames} fadeIn={false} zoom={[1.15, 1.05]} />
      <AbsoluteFill style={{ backgroundColor: "rgba(238,241,248,0.35)" }} />
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(5,29,94,0.0) 30%, rgba(5,29,94,0.55) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 1 - exit,
          transform: `translate(${shake}px, ${-shake * 0.5}px) scale(${1 + exit * 0.08})`,
        }}
      >
        <div style={{ position: "absolute", top: 520, width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ marginLeft: -60 }}>
            <BlackFridayBadge start={s(k(0))} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 760,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            opacity: frame < slamAt ? 0 : 1,
          }}
        >
          <div
            style={{
              transform: `scale(${slam})`,
              padding: "10px 54px 22px",
              borderRadius: 50,
              backgroundColor: BRAND_BLUE,
              boxShadow: "0 30px 70px rgba(5,29,94,0.45)",
              fontFamily: gilroy,
              fontWeight: 900,
              fontSize: 300,
              lineHeight: 1,
              color: "#fff",
            }}
          >
            -50%
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 1150,
            width: "100%",
            textAlign: "center",
            fontFamily: gilroy,
            fontWeight: 800,
            fontSize: 84,
            color: "#fff",
            textShadow: shadow,
            ...fadeUp(frame, s(k(4))),
          }}
        >
          НА IPL-ТЕРАПІЮ
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

// Scene 2 — device and procedure with the IPL explanation.
const AboutScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Shots
        shots={[
          { src: "device", from: 0, to: b(3), sourceStart: 0.3 },
          { src: "ipl-closeup", from: b(3), to: b(6), sourceStart: 1.0 },
          { src: "ipl-closeup", from: b(6), to: b(9), sourceStart: 3.0 },
        ]}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 42%, rgba(0,0,0,0) 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 290,
          width: "100%",
          textAlign: "center",
          fontFamily: gilroy,
          color: "#fff",
          textShadow: shadow,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 132, lineHeight: 1, ...fadeUp(frame, 4) }}>IPL-ТЕРАПІЯ</div>
        <div
          style={{
            display: "inline-block",
            marginTop: 26,
            padding: "14px 36px",
            borderRadius: 60,
            backgroundColor: BRAND_BLUE,
            fontWeight: 800,
            fontSize: 48,
            textShadow: "none",
            ...fadeUp(frame, s(b(1))),
          }}
        >
          ФОТООМОЛОДЖЕННЯ ОБЛИЧЧЯ
        </div>
        <div
          style={{
            margin: "34px auto 0",
            width: 860,
            fontWeight: 500,
            fontSize: 42,
            lineHeight: 1.3,
            ...fadeUp(frame, s(b(3))),
          }}
        >
          Технологія інтенсивного імпульсного світла для комплексного покращення стану шкіри.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BENEFITS = [
  "Допомагає зменшити почервоніння.",
  "Корекція пігментації.",
  "Зменшення слідів постакне.",
  "Покращення тону та текстури шкіри.",
  "Стимуляція природного вироблення колагену.",
];

const Check: React.FC = () => (
  <svg width="46" height="46" viewBox="0 0 46 46" style={{ flexShrink: 0 }}>
    <circle cx="23" cy="23" r="23" fill={BRAND_BLUE} />
    <path d="M13 24 L20 31 L33 16" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Scene 3 — benefits appear one per two beats and stack into a list.
const BenefitsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const step = b(2);
  return (
    <AbsoluteFill>
      <Shots
        shots={[
          { src: "cheek-handpiece", from: 0, to: step, sourceStart: 0.15 },
          { src: "face-closeup", from: step, to: step * 2, sourceStart: 2.6 },
          { src: "specialist-a", from: step * 2, to: step * 3, sourceStart: 2.0 },
          { src: "specialist-b", from: step * 3, to: step * 4, sourceStart: 0.5 },
          { src: "gel-goggles", from: step * 4, to: b(11), sourceStart: 1.3 },
        ]}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(5,29,94,0) 38%, rgba(5,29,94,0.55) 75%, rgba(5,29,94,0.7) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 960,
          left: 70,
          right: 70,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {BENEFITS.map((text, i) => {
          const at = s(step * i) + 2;
          return (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "16px 26px",
                borderRadius: 26,
                backgroundColor: "rgba(255,255,255,0.93)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                fontFamily: gilroy,
                fontWeight: 500,
                fontSize: 38,
                lineHeight: 1.2,
                color: BRAND_BLUE,
                opacity: interpolate(frame, [at, at + 7], [0, 1], clamp),
                transform: `translateX(${interpolate(frame, [at, at + 9], [-80, 0], {
                  ...clamp,
                  easing: Easing.out(Easing.cubic),
                })}px)`,
              }}
            >
              <Check />
              {text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const PAIRS = [
  { name: "pair1", w: 941, h: 1672 },
  { name: "pair2", w: 367, h: 736 },
  { name: "pair3", w: 400, h: 800 },
  // the smallest original (186×375): shown in a smaller frame to stay sharp
  { name: "pair4", w: 186, h: 375, cardH: 1000 },
];

const Label: React.FC<{ text: string; side: "left" | "right"; opacity: number }> = ({ text, side, opacity }) => (
  <div
    style={{
      position: "absolute",
      top: 32,
      [side]: 28,
      opacity,
      padding: "10px 26px",
      borderRadius: 40,
      backgroundColor: side === "left" ? "rgba(255,255,255,0.94)" : BRAND_BLUE,
      color: side === "left" ? BRAND_BLUE : "#fff",
      fontFamily: gilroy,
      fontWeight: 800,
      fontSize: 38,
      letterSpacing: "0.06em",
    }}
  >
    {text}
  </div>
);

// One pair: "ДО" alone, then a vertical edge with a soft glow wipes in "ПІСЛЯ".
const ResultPair: React.FC<{ name: string; w: number; h: number; cardH?: number; length: number }> = ({
  name,
  w,
  h,
  cardH = 1240,
  length,
}) => {
  const frame = useCurrentFrame();
  const cardW = Math.round((cardH * w) / h);
  const wipeStart = s(b(1));
  const edge = interpolate(frame, [wipeStart, wipeStart + 18], [100, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const zoom = interpolate(frame, [0, length], [1, 1.05]);
  const enter = interpolate(frame, [0, 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const before = staticFile(`ipl/img/${name}-before.png`);
  const after = staticFile(`ipl/img/${name}-after.png`);
  const photo: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${zoom})`,
    transformOrigin: "50% 45%",
  };
  return (
    <AbsoluteFill style={{ opacity: enter }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={after}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(44px) brightness(0.9)", transform: "scale(1.2)" }}
        />
        <AbsoluteFill style={{ backgroundColor: "rgba(238,241,248,0.55)" }} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: (1080 - cardW) / 2,
          top: 300 + (1240 - cardH) / 2,
          width: cardW,
          height: cardH,
          borderRadius: 36,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(5,29,94,0.35)",
          transform: `translateY(${(1 - enter) * 40}px)`,
        }}
      >
        <Img src={before} style={photo} />
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${edge}%)` }}>
          <Img src={after} style={photo} />
        </div>
        {edge > 0 && edge < 100 ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${edge}%`,
              width: 5,
              marginLeft: -2.5,
              backgroundColor: "#fff",
              boxShadow: "0 0 30px 8px rgba(255,255,255,0.7)",
            }}
          />
        ) : null}
        <Label
          text="ДО"
          side="left"
          opacity={interpolate(frame, [3, 9], [0, 1], clamp) * interpolate(edge, [8, 22], [0, 1], clamp)}
        />
        <Label text="ПІСЛЯ" side="right" opacity={interpolate(edge, [40, 60], [1, 0], clamp)} />
      </div>
    </AbsoluteFill>
  );
};

const ResultsScene: React.FC = () => {
  const each = b(3.5);
  return (
    <AbsoluteFill style={{ backgroundColor: LIGHT_BG }}>
      {PAIRS.map((p, i) => (
        <Sequence key={p.name} from={s(each * i)} durationInFrames={s(each * (i + 1)) - s(each * i)}>
          <ResultPair {...p} length={s(each)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Scene 5 — the offer: four session cards gather into one subscription, then the price.
const OfferScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cardsAt = local("offer", k(44));
  const mergeAt = local("offer", k(47.5));
  const priceAt = local("offer", k(48));
  const price = usePop(priceAt, 9);
  const merge = interpolate(frame, [mergeAt, mergeAt + 10], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const glow = interpolate(frame, [priceAt, priceAt + 4, priceAt + 24], [0, 1, 0.3], clamp);
  return (
    <AbsoluteFill>
      <Clip src="specialist-b" sourceStart={2.6} length={s(SCENES.offer.to - SCENES.offer.from)} fadeIn={false} />
      <AbsoluteFill style={{ backgroundColor: "rgba(238,241,248,0.82)" }} />
      <div style={{ position: "absolute", top: 300, width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ marginLeft: -50 }}>
          <BlackFridayBadge start={2} scale={0.78} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 470,
          width: "100%",
          textAlign: "center",
          fontFamily: gilroy,
          color: BRAND_BLUE,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 190, lineHeight: 1, ...fadeUp(frame, 8) }}>-50%</div>
        <div style={{ fontWeight: 800, fontSize: 58, marginTop: 18, ...fadeUp(frame, 13) }}>АБОНЕМЕНТ НА 4 ПРОЦЕДУРИ</div>
        <div style={{ fontWeight: 800, fontSize: 58, ...fadeUp(frame, 16) }}>IPL-ТЕРАПІЇ</div>
      </div>
      {[0, 1, 2, 3].map((i) => {
        const at = cardsAt + s(b(i));
        const appear = interpolate(frame, [at, at + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
        const pulse = interpolate(frame, [at, at + 3, at + 12], [0, 1, 0], clamp);
        const spreadX = (i - 1.5) * 200;
        const stackX = (i - 1.5) * 14;
        const x = interpolate(merge, [0, 1], [spreadX, stackX]);
        const y = interpolate(merge, [0, 1], [0, (i - 1.5) * -10]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - 85 + x,
              top: 900 + y,
              width: 170,
              height: 200,
              borderRadius: 24,
              backgroundColor: BRAND_BLUE,
              border: "3px solid rgba(255,255,255,0.9)",
              boxShadow: `0 14px 34px rgba(5,29,94,0.35), 0 0 ${40 * pulse}px ${12 * pulse}px rgba(120,170,255,${0.8 * pulse})`,
              transform: `scale(${appear}) rotate(${(i - 1.5) * 4 * merge}deg)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: gilroy,
              color: "#fff",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 96, lineHeight: 1, opacity: 1 - merge }}>{i + 1}</div>
            <div style={{ fontWeight: 500, fontSize: 22, marginTop: 6, opacity: 1 - merge }}>ПРОЦЕДУРА</div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 540 - 85 + 21,
          top: 900 - 15,
          width: 170,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: gilroy,
          fontWeight: 900,
          fontSize: 84,
          color: "#fff",
          opacity: interpolate(frame, [mergeAt + 6, mergeAt + 12], [0, 1], clamp),
          transform: "rotate(6deg)",
        }}
      >
        ×4
      </div>
      <div
        style={{
          position: "absolute",
          top: 1150,
          width: "100%",
          textAlign: "center",
          fontFamily: gilroy,
          color: BRAND_BLUE,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 170,
            lineHeight: 1,
            transform: `scale(${frame < priceAt ? 0 : 0.4 + price * 0.6})`,
            textShadow: `0 0 ${60 * glow}px rgba(80,130,255,${0.7 * glow})`,
          }}
        >
          6 000 ГРН
        </div>
        <div style={{ fontWeight: 500, fontSize: 50, letterSpacing: "0.1em", marginTop: 16, ...fadeUp(frame, priceAt + 8) }}>
          ЗА ВЕСЬ КУРС
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PinIcon: React.FC = () => (
  <svg width="38" height="46" viewBox="0 0 24 30" style={{ flexShrink: 0 }}>
    <path d="M12 0C5.4 0 0 5.2 0 11.6 0 20.3 12 30 12 30s12-9.7 12-18.4C24 5.2 18.6 0 12 0z" fill={BRAND_BLUE} />
    <circle cx="12" cy="11.5" r="4.6" fill="#fff" />
  </svg>
);

// Scene 6 — final card: discount, subscription and price, address, call to action.
const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const buttonAt = local("final", k(53));
  const button = usePop(buttonAt, 10);
  const pulse = frame > buttonAt + 15 ? 1 + Math.sin((frame - buttonAt) / 7) * 0.025 : 1;
  const arrow = frame > buttonAt ? Math.sin((frame - buttonAt) / 6) * 8 : 0;
  const text: React.CSSProperties = { width: "100%", textAlign: "center", fontFamily: gilroy, color: BRAND_BLUE };
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #ffffff 0%, ${LIGHT_BG} 100%)` }}>
      <div style={{ position: "absolute", top: 290, ...text, fontWeight: 800, fontSize: 78, lineHeight: 1.1 }}>
        <div style={fadeUp(frame, 2)}>BLACK FRIDAY</div>
        <div style={fadeUp(frame, 5)}>У LAZERHALL</div>
      </div>
      <div style={{ position: "absolute", top: 500, width: "100%", display: "flex", justifyContent: "center", ...fadeUp(frame, 9) }}>
        <div
          style={{
            padding: "14px 44px",
            borderRadius: 70,
            backgroundColor: BRAND_BLUE,
            fontFamily: gilroy,
            fontWeight: 800,
            fontSize: 64,
            color: "#fff",
            whiteSpace: "nowrap",
          }}
        >
          -50% НА IPL-ТЕРАПІЮ
        </div>
      </div>
      <div style={{ position: "absolute", top: 660, ...text, fontWeight: 500, fontSize: 52, ...fadeUp(frame, 13) }}>
        АБОНЕМЕНТ НА 4 ПРОЦЕДУРИ
      </div>
      <div style={{ position: "absolute", top: 740, ...text, fontWeight: 900, fontSize: 150, lineHeight: 1, ...fadeUp(frame, 16) }}>
        6 000 ГРН
      </div>
      <div style={{ position: "absolute", top: 955, left: 440, width: 200, height: 3, backgroundColor: BRAND_BLUE, opacity: 0.25 }} />
      <div
        style={{
          position: "absolute",
          top: 1010,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          fontFamily: gilroy,
          fontWeight: 500,
          fontSize: 44,
          color: BRAND_BLUE,
          ...fadeUp(frame, 21),
        }}
      >
        <PinIcon />
        Львів, вул. Мирослава Скорика, 16
      </div>
      <div
        style={{
          position: "absolute",
          top: 1230,
          left: "50%",
          transform: `translateX(-50%) scale(${(frame < buttonAt ? 0 : button) * pulse})`,
          padding: "30px 96px 20px",
          borderRadius: 44,
          backgroundColor: BRAND_BLUE,
          boxShadow: "0 24px 60px rgba(5,29,94,0.35)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          fontFamily: gilroy,
          fontWeight: 800,
          fontSize: 62,
          letterSpacing: "0.05em",
          color: "#fff",
        }}
      >
        ЗАПИСАТИСЯ
        <svg width="44" height="40" viewBox="0 0 34 30" style={{ transform: `translateY(${arrow}px)` }}>
          <path d="M17 2 V26 M5 15 L17 27 L29 15" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export const IplAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    <Sequence {...sceneSeq("intro")}>
      <IntroScene />
    </Sequence>
    <Sequence {...sceneSeq("about")}>
      <AboutScene />
    </Sequence>
    <Sequence {...sceneSeq("benefits")}>
      <BenefitsScene />
    </Sequence>
    <Sequence {...sceneSeq("results")}>
      <ResultsScene />
    </Sequence>
    <Sequence {...sceneSeq("offer")}>
      <OfferScene />
    </Sequence>
    <Sequence {...sceneSeq("final")}>
      <FinalScene />
    </Sequence>
    {/* Music and SFX pre-mixed by scripts/ipl_audio.py */}
    <Audio src={staticFile("ipl/audio/soundtrack.m4a")} />
  </AbsoluteFill>
);
