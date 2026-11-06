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
import { AlarmClock } from "./AlarmClock";
import {
  BRAND_BLUE,
  FINAL_BEATS,
  LIGHT_BG,
  PRICE_BEATS,
  PROCEDURE_CAPTIONS,
  PROCEDURE_CLIPS,
  RESULT_PAIRS,
  SCENES,
  WIPE_DELAY,
  WIPE_LENGTH,
  s,
  sceneFrames,
} from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Scene-local frame for an absolute timeline second.
const at = (scene: keyof typeof SCENES, seconds: number) =>
  s(seconds) - s(SCENES[scene].from);

const usePop = (start: number, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping, stiffness: 170, mass: 0.7 } });
};

const fadeUp = (frame: number, start: number, length = 9, distance = 40) => ({
  opacity: interpolate(frame, [start, start + length], [0, 1], clamp),
  transform: `translateY(${interpolate(frame, [start, start + length], [distance, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  })}px)`,
});

const LightBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 40;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #ffffff 0%, ${LIGHT_BG} 100%)` }}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: 420 + drift,
          top: -260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(61,107,224,0.18) 0%, rgba(61,107,224,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          left: -420 - drift,
          top: 1180,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(5,29,94,0.14) 0%, rgba(5,29,94,0) 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

const BlueBackground: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 42%, #1a3d9e 0%, ${BRAND_BLUE} 62%, #020f36 100%)`,
    }}
  />
);

// Scene 1 — "BLACK FRIDAY" pill with a tilted "SALE" tag.
const SaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pill = usePop(1, 13);
  const tag = usePop(at("sale", 0.72), 9);
  const exit = interpolate(frame, [durationInFrames - 5, durationInFrames], [0, 1], clamp);
  const breathe = interpolate(frame, [0, durationInFrames], [1, 1.05]);
  return (
    <AbsoluteFill>
      <LightBackground />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `translateY(${-exit * 220}px) scale(${breathe})`,
          opacity: 1 - exit,
        }}
      >
        <div style={{ position: "relative", marginLeft: -60 }}>
          <div
            style={{
              transform: `translateX(${(1 - pill) * -260}px) scale(${0.7 + pill * 0.3})`,
              opacity: Math.min(1, pill * 1.5),
              padding: "30px 58px",
              borderRadius: 140,
              border: `5px solid ${BRAND_BLUE}`,
              backgroundColor: "#fff",
              fontFamily: gilroy,
              fontWeight: 800,
              fontSize: 100,
              lineHeight: 1,
              color: BRAND_BLUE,
              whiteSpace: "nowrap",
              boxShadow: "0 24px 60px rgba(5,29,94,0.12)",
            }}
          >
            BLACK FRIDAY
          </div>
          <div
            style={{
              position: "absolute",
              right: -96,
              top: -66,
              transform: `rotate(${interpolate(tag, [0, 1], [-30, 14])}deg) scale(${tag})`,
              padding: "18px 44px",
              borderRadius: 100,
              backgroundColor: BRAND_BLUE,
              border: "4px solid #ffffff",
              fontFamily: gilroy,
              fontWeight: 900,
              fontSize: 84,
              lineHeight: 1,
              color: "#fff",
              boxShadow: "0 18px 40px rgba(5,29,94,0.35)",
            }}
          >
            SALE
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2 — alarm clock + "Black Friday у LAZERHALL вже стартувала!"
const ClockScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const enter = usePop(0, 10);
  const ring = interpolate(frame, [4, 26], [1, 0], clamp);
  const exit = interpolate(frame, [durationInFrames - 4, durationInFrames], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <LightBackground />
      <div
        style={{
          position: "absolute",
          top: 300,
          left: "50%",
          transform: `translateX(-50%) scale(${0.3 + enter * 0.7}) rotate(${(1 - enter) * -25 + Math.sin(frame / 9) * 2}deg)`,
        }}
      >
        <AlarmClock size={640} minuteAngle={frame * 14} hourAngle={300 + frame * 1.2} ring={ring} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1030,
          width: "100%",
          textAlign: "center",
          fontFamily: gilroy,
          fontWeight: 800,
          fontSize: 82,
          lineHeight: 1.12,
          color: BRAND_BLUE,
        }}
      >
        <div style={fadeUp(frame, 5)}>BLACK FRIDAY</div>
        <div style={fadeUp(frame, 9)}>У LAZERHALL</div>
        <div
          style={{
            ...fadeUp(frame, 13),
            display: "inline-block",
            marginTop: 18,
            padding: "14px 40px",
            borderRadius: 70,
            backgroundColor: BRAND_BLUE,
            color: "#fff",
          }}
        >
          ВЖЕ СТАРТУВАЛА!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3 — "-50%" slam on the bass hit, then the procedure name.
const DiscountScene: React.FC = () => {
  const frame = useCurrentFrame();
  const slam = interpolate(frame, [0, 6], [2.4, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const flash = interpolate(frame, [0, 2, 8], [0, 0.85, 0], clamp);
  const shake = frame < 10 ? Math.sin(frame * 2.7) * (10 - frame) * 1.6 : 0;
  const drift = interpolate(frame, [6, 105], [1, 1.06], clamp);
  const nameStart = at("discount", 7.3);
  return (
    <AbsoluteFill>
      <BlueBackground />
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${-shake * 0.6}px)` }}>
        <div
          style={{
            position: "absolute",
            top: 520,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            ...fadeUp(frame, 2, 8, 20),
          }}
        >
          <div
            style={{
              padding: "14px 40px",
              borderRadius: 60,
              border: "3px solid rgba(255,255,255,0.85)",
              fontFamily: gilroy,
              fontWeight: 800,
              fontSize: 46,
              letterSpacing: "0.08em",
              color: "#fff",
            }}
          >
            BLACK FRIDAY SALE
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 640,
            width: "100%",
            textAlign: "center",
            fontFamily: gilroy,
            fontWeight: 900,
            fontSize: 360,
            lineHeight: 1,
            color: "#fff",
            transform: `scale(${slam * drift})`,
            textShadow: "0 20px 80px rgba(61,107,224,0.6)",
          }}
        >
          -50%
        </div>
        <div
          style={{
            position: "absolute",
            top: 1130,
            width: "100%",
            textAlign: "center",
            fontFamily: gilroy,
            fontWeight: 800,
            fontSize: 84,
            lineHeight: 1.1,
            color: "#fff",
          }}
        >
          <div style={fadeUp(frame, nameStart)}>НА МІКРОГОЛКОВИЙ</div>
          <div style={fadeUp(frame, nameStart + 4)}>RF-ЛІФТИНГ</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

const CROSSFADE = 5;

const ClipLayer: React.FC<{ src: string; sourceStart: number; fadeIn: boolean; length: number }> = ({
  src,
  sourceStart,
  fadeIn,
  length,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn ? interpolate(frame, [0, CROSSFADE], [0, 1], clamp) : 1;
  const zoom = interpolate(frame, [0, length], [1.0, 1.07]);
  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Video
          src={staticFile(`blackfriday/video/${src}.mp4`)}
          trimBefore={s(sourceStart)}
          style={{ width: "100%", height: "100%" }}
          objectFit="cover"
          muted
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ text: string; length: number }> = ({ text, length }) => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const close = interpolate(frame, [length - 6, length], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 1400,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        opacity: close,
      }}
    >
      <div
        style={{
          padding: "26px 46px",
          borderRadius: 30,
          backgroundColor: BRAND_BLUE,
          clipPath: `inset(0 ${(1 - open) * 50}% 0 ${(1 - open) * 50}% round 30px)`,
          boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
          maxWidth: 960,
          textAlign: "center",
          fontFamily: gilroy,
          fontWeight: 800,
          fontSize: 52,
          lineHeight: 1.15,
          color: "#fff",
        }}
      >
        <span style={{ opacity: interpolate(frame, [4, 10], [0, 1], clamp), whiteSpace: "pre-line" }}>{text}</span>
      </div>
    </div>
  );
};

const ProcedureScene: React.FC = () => {
  const base = SCENES.procedure.from;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {PROCEDURE_CLIPS.map((clip, i) => {
        const from = s(clip.from - base);
        const length = s(clip.to - clip.from) + (i < PROCEDURE_CLIPS.length - 1 ? CROSSFADE : 0);
        return (
          <Sequence key={`${clip.src}-${clip.from}`} from={from} durationInFrames={length}>
            <ClipLayer src={clip.src} sourceStart={clip.sourceStart} fadeIn={i > 0} length={length} />
          </Sequence>
        );
      })}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,29,94,0) 55%, rgba(5,29,94,0.45) 85%, rgba(5,29,94,0.6) 100%)",
        }}
      />
      {PROCEDURE_CAPTIONS.map((c) => (
        <Sequence key={c.text} from={s(c.from - base)} durationInFrames={s(c.to - c.from)}>
          <Caption text={c.text} length={s(c.to - c.from)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const PAIR_SIZES: Record<string, { w: number; h: number }> = {
  pair1: { w: 600, h: 1200 },
  pair2: { w: 540, h: 1346 },
  pair3: { w: 361, h: 702 },
};

const Label: React.FC<{ text: string; side: "left" | "right"; opacity: number }> = ({ text, side, opacity }) => (
  <div
    style={{
      position: "absolute",
      top: 40,
      [side]: 32,
      opacity,
      padding: "12px 30px",
      borderRadius: 40,
      backgroundColor: side === "left" ? "rgba(255,255,255,0.92)" : BRAND_BLUE,
      color: side === "left" ? BRAND_BLUE : "#fff",
      fontFamily: gilroy,
      fontWeight: 800,
      fontSize: 40,
      letterSpacing: "0.06em",
    }}
  >
    {text}
  </div>
);

// One before/after pair: "before" alone, then a vertical edge wipes in "after".
const ResultPair: React.FC<{ name: string; length: number }> = ({ name, length }) => {
  const frame = useCurrentFrame();
  const { w, h } = PAIR_SIZES[name];
  const cardH = 1440;
  const cardW = Math.round((cardH * w) / h);
  const wipeStart = s(WIPE_DELAY);
  const edge = interpolate(frame, [wipeStart, wipeStart + s(WIPE_LENGTH)], [100, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const zoom = interpolate(frame, [0, length], [1, 1.06]);
  const enter = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const before = staticFile(`blackfriday/img/${name}-before.png`);
  const after = staticFile(`blackfriday/img/${name}-after.png`);
  const photo: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${zoom})`,
    transformOrigin: "50% 40%",
  };
  return (
    <AbsoluteFill style={{ opacity: enter }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={before}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(40px) brightness(0.75)",
            transform: "scale(1.2)",
          }}
        />
        <AbsoluteFill style={{ backgroundColor: "rgba(5,29,94,0.55)" }} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: (1080 - cardW) / 2,
          top: 230,
          width: cardW,
          height: cardH,
          borderRadius: 40,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          transform: `translateX(${(1 - enter) * 80}px)`,
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
              boxShadow: "0 0 18px rgba(255,255,255,0.8)",
            }}
          />
        ) : null}
        <Label
          text="ДО"
          side="left"
          opacity={interpolate(frame, [4, 10], [0, 1], clamp) * interpolate(edge, [8, 22], [0, 1], clamp)}
        />
        <Label text="ПІСЛЯ" side="right" opacity={interpolate(edge, [40, 60], [1, 0], clamp)} />
      </div>
    </AbsoluteFill>
  );
};

const ResultsScene: React.FC = () => {
  const base = SCENES.results.from;
  const captionSwitch = RESULT_PAIRS[2].from;
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND_BLUE }}>
      {RESULT_PAIRS.map((p) => (
        <Sequence key={p.name} from={s(p.from - base)} durationInFrames={s(p.to - p.from)}>
          <ResultPair name={p.name} length={s(p.to - p.from)} />
        </Sequence>
      ))}
      <Sequence from={s(0.15)} durationInFrames={s(captionSwitch - base - 0.15)}>
        <Caption text={RESULT_PAIRS[0].caption} length={s(captionSwitch - base - 0.15)} />
      </Sequence>
      <Sequence from={s(captionSwitch - base)} durationInFrames={s(SCENES.results.to - captionSwitch)}>
        <Caption text={RESULT_PAIRS[2].caption} length={s(SCENES.results.to - captionSwitch) + 10} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Scene 5 — brand-blue price card over the device footage.
const PriceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const card = usePop(0, 14);
  const amountStart = at("price", PRICE_BEATS.amount);
  const amount = usePop(amountStart, 9);
  const glow = interpolate(frame, [amountStart, amountStart + 4, amountStart + 20], [0, 1, 0.35], clamp);
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={s(2.1)}>
        <ClipLayer src="hand-handpiece" sourceStart={2.0} fadeIn={false} length={s(2.1)} />
      </Sequence>
      <Sequence from={s(2.1)}>
        <ClipLayer src="device-wide" sourceStart={4.25} fadeIn length={s(2.8)} />
      </Sequence>
      <AbsoluteFill style={{ backgroundColor: "rgba(5,29,94,0.45)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 900,
            padding: "64px 50px 70px",
            borderRadius: 56,
            backgroundColor: BRAND_BLUE,
            border: "2px solid rgba(255,255,255,0.18)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
            transform: `scale(${0.82 + card * 0.18})`,
            opacity: Math.min(1, card * 1.4),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: gilroy,
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div
            style={{
              ...fadeUp(frame, 4, 8, 20),
              padding: "12px 34px",
              borderRadius: 50,
              border: "3px solid rgba(255,255,255,0.85)",
              fontWeight: 800,
              fontSize: 42,
              letterSpacing: "0.08em",
            }}
          >
            BLACK FRIDAY SALE
          </div>
          <div style={{ ...fadeUp(frame, 7, 8, 30), fontWeight: 900, fontSize: 230, lineHeight: 1, marginTop: 30 }}>
            -50%
          </div>
          <div style={{ ...fadeUp(frame, 10, 8, 20), fontWeight: 800, fontSize: 54, marginTop: 14 }}>
            МІКРОГОЛКОВИЙ RF-ЛІФТИНГ
          </div>
          <div style={{ width: 640, height: 3, backgroundColor: "rgba(255,255,255,0.3)", margin: "44px 0 36px" }} />
          <div
            style={{
              ...fadeUp(frame, at("price", PRICE_BEATS.faceLabel), 8, 20),
              fontWeight: 500,
              fontSize: 50,
              letterSpacing: "0.1em",
            }}
          >
            ВСЕ ОБЛИЧЧЯ
          </div>
          <div
            style={{
              fontWeight: 900,
              fontSize: 168,
              lineHeight: 1,
              marginTop: 18,
              whiteSpace: "nowrap",
              transform: `scale(${frame < amountStart ? 0 : 0.4 + amount * 0.6})`,
              textShadow: `0 0 ${50 * glow}px rgba(140,180,255,${0.9 * glow})`,
            }}
          >
            4 400 ГРН
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PinIcon: React.FC = () => (
  <svg width="40" height="48" viewBox="0 0 24 30" style={{ flexShrink: 0 }}>
    <path
      d="M12 0C5.4 0 0 5.2 0 11.6 0 20.3 12 30 12 30s12-9.7 12-18.4C24 5.2 18.6 0 12 0z"
      fill={BRAND_BLUE}
    />
    <circle cx="12" cy="11.5" r="4.6" fill="#fff" />
  </svg>
);

// Scene 6 — final card with the address and the "ЗАПИСАТИСЯ" button.
const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const buttonStart = at("final", FINAL_BEATS.button);
  const button = usePop(buttonStart, 10);
  const pulse = frame > buttonStart + 15 ? 1 + Math.sin((frame - buttonStart) / 7) * 0.025 : 1;
  const arrow = frame > buttonStart ? Math.sin((frame - buttonStart) / 6) * 8 : 0;
  const text: React.CSSProperties = {
    width: "100%",
    textAlign: "center",
    fontFamily: gilroy,
    color: BRAND_BLUE,
  };
  return (
    <AbsoluteFill>
      <LightBackground />
      <div style={{ position: "absolute", top: 300, ...text, fontWeight: 800, fontSize: 96, lineHeight: 1.08 }}>
        <div style={fadeUp(frame, 2)}>BLACK FRIDAY</div>
        <div style={fadeUp(frame, 5)}>УЖЕ СТАРТУВАЛА!</div>
      </div>
      <div style={{ position: "absolute", top: 560, ...text, fontWeight: 500, fontSize: 46, ...fadeUp(frame, 9) }}>
        -50% НА МІКРОГОЛКОВИЙ RF-ЛІФТИНГ
      </div>
      <div
        style={{
          position: "absolute",
          top: 660,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          ...fadeUp(frame, 13),
        }}
      >
        <div
          style={{
            padding: "18px 44px",
            borderRadius: 70,
            border: `4px solid ${BRAND_BLUE}`,
            fontFamily: gilroy,
            fontWeight: 800,
            fontSize: 62,
            color: BRAND_BLUE,
            whiteSpace: "nowrap",
          }}
        >
          4 400 ГРН / ВСЕ ОБЛИЧЧЯ
        </div>
      </div>
      <div style={{ position: "absolute", top: 905, left: 440, width: 200, height: 3, backgroundColor: BRAND_BLUE, opacity: 0.25 }} />
      <div
        style={{
          position: "absolute",
          top: 970,
          ...text,
          fontWeight: 800,
          fontSize: 76,
          letterSpacing: "0.16em",
          ...fadeUp(frame, 18),
        }}
      >
        LAZERHALL
      </div>
      <div
        style={{
          position: "absolute",
          top: 1080,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          fontFamily: gilroy,
          fontWeight: 500,
          fontSize: 44,
          color: BRAND_BLUE,
          ...fadeUp(frame, 22),
        }}
      >
        <PinIcon />
        Львів, вул. Мирослава Скорика, 16
      </div>
      <div
        style={{
          position: "absolute",
          top: 1290,
          left: "50%",
          transform: `translateX(-50%) scale(${(frame < buttonStart ? 0 : button) * pulse})`,
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
          <path
            d="M17 2 V26 M5 15 L17 27 L29 15"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export const BlackFridayAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    <Sequence {...sceneFrames("sale")}>
      <SaleScene />
    </Sequence>
    <Sequence {...sceneFrames("clock")}>
      <ClockScene />
    </Sequence>
    <Sequence {...sceneFrames("discount")}>
      <DiscountScene />
    </Sequence>
    <Sequence {...sceneFrames("procedure")}>
      <ProcedureScene />
    </Sequence>
    <Sequence {...sceneFrames("results")}>
      <ResultsScene />
    </Sequence>
    <Sequence {...sceneFrames("price")}>
      <PriceScene />
    </Sequence>
    <Sequence {...sceneFrames("final")}>
      <FinalScene />
    </Sequence>
    {/* Voiceover, music and SFX pre-mixed by scripts/blackfriday_audio.py */}
    <Audio src={staticFile("blackfriday/audio/soundtrack.m4a")} />
  </AbsoluteFill>
);
