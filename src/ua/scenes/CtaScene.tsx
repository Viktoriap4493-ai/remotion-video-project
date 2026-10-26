import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_BACK, EASE_IN, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS_UA, GILROY } from "../fonts";
import { ChatIcon, PhoneIcon } from "../components/Icons";
import { Whip } from "../components/Whip";

const ASK = [4, 14]; // «Не маєте власного трейлера?»
const ASK_OUT = 41;
const LOGO = 47; // «Орендуйте його в Drive4USA!»
const RENT = 45;
const RENT_OUT = 86;
const CALL = 90; // «Телефонуйте або пишіть нам уже зараз,»
const CALL_OUT = 134;
const CARD = 138; // «…щоб дізнатися умови оренди.» → end card
const PHONE = 150;
const PULSE = 200;

const Fade: React.FC<{ from: number; to?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ from, to, children, style }) => {
  const frame = useCurrentFrame();
  if (frame < from) return null;
  const out = to === undefined ? 0 : interpolate(frame, [to, to + 6], [0, 1], { ...CLAMP, easing: EASE_IN });
  if (out >= 1) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - out, ...style }}>{children}</div>;
};

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = (at: number, d = 7) => interpolate(frame, [at, at + d], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const dark = interpolate(frame, [ASK_OUT, LOGO + 4], [0.25, 0.8], CLAMP);
  const logoIn = interpolate(frame, [LOGO, LOGO + 12], [0, 1], { ...CLAMP, easing: EASE_BACK });
  // Logo travels from its reveal position to the end-card slot.
  const toCard = interpolate(frame, [CARD - 4, CARD + 8], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const toCall = interpolate(frame, [CALL - 4, CALL + 6], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const logoTop = 620 - toCall * 260 + toCard * 40;
  const logoSize = 420 - toCall * 80 - toCard * 20;
  const sweep = interpolate(frame, [LOGO + 10, LOGO + 26], [-60, 160], CLAMP);
  const phoneIn = interpolate(frame, [PHONE, PHONE + 9], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const label: React.CSSProperties = { fontFamily: GILROY, fontWeight: 800, letterSpacing: "0.24em", color: COLORS.white };

  return (
    <Whip inFrames={6}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 243], [1.04, 1.16], CLAMP)) }}>
          <Video src={staticFile("ua/video/cta-trailer.mp4")} muted playbackRate={0.66} objectFit="cover" style={{ width: "100%", height: "100%" }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: `rgba(7,28,51,${dark})` }} />

        {/* «Не маєте власного трейлера?» */}
        <Fade from={ASK[0]} to={ASK_OUT} style={{ top: 300, fontFamily: BEBAS_UA, lineHeight: 1, color: COLORS.white, textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>
          <div style={{ fontSize: 150, opacity: enter(ASK[0]), translate: `0 ${(1 - enter(ASK[0])) * 60}px` }}>НЕ МАЄТЕ</div>
          <div style={{ fontSize: 124, opacity: enter(ASK[1]), translate: `${(1 - enter(ASK[1])) * -200}px 0` }}>
            ВЛАСНОГО <span style={{ color: COLORS.red }}>ТРЕЙЛЕРА?</span>
          </div>
        </Fade>

        {/* «Орендуйте в Drive4USA» */}
        <Fade from={RENT} to={RENT_OUT} style={{ top: 360, fontFamily: BEBAS_UA, lineHeight: 1, color: COLORS.white }}>
          <div style={{ fontSize: 120, clipPath: `inset(-30% ${(1 - enter(RENT, 9)) * 100}% -10% 0)` }}>
            ОРЕНДУЙТЕ В <span style={{ color: COLORS.red }}>DRIVE4USA</span>
          </div>
        </Fade>

        {/* Original logo: scale-in, light sweep, glow; stays to the end card */}
        {frame >= LOGO ? (
          <div
            style={{
              position: "absolute",
              left: (1080 - logoSize) / 2,
              top: logoTop,
              width: logoSize,
              height: logoSize,
              borderRadius: 36,
              background: COLORS.white,
              overflow: "hidden",
              scale: String(interpolate(logoIn, [0, 1], [0.5, 1])),
              opacity: logoIn > 0 ? 1 : 0,
              boxShadow: `0 0 ${interpolate(frame, [LOGO + 8, LOGO + 14, LOGO + 40], [0, 70, 30], CLAMP)}px rgba(227,16,27,0.6), 0 30px 60px rgba(0,0,0,0.5)`,
            }}
          >
            <Img src={staticFile("v3/img/logo.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: "1.12" }} />
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${sweep}%`,
                width: "35%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)",
                transform: "skewX(-18deg)",
              }}
            />
          </div>
        ) : null}

        {/* «Телефонуйте або пишіть нам» */}
        <Fade from={CALL} to={CALL_OUT} style={{ top: 780, fontFamily: BEBAS_UA, lineHeight: 1, color: COLORS.white }}>
          <div style={{ fontSize: 130, opacity: enter(CALL), translate: `0 ${(1 - enter(CALL)) * 50}px` }}>ТЕЛЕФОНУЙТЕ</div>
          <div style={{ fontSize: 130, opacity: enter(CALL + 6), translate: `0 ${(1 - enter(CALL + 6)) * 50}px` }}>
            АБО <span style={{ color: COLORS.red }}>ПИШІТЬ</span> НАМ
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 22, opacity: enter(CALL + 12) }}>
            <PhoneIcon size={44} />
            <ChatIcon size={44} />
            <span style={{ ...label, fontSize: 34 }}>CALL OR TEXT NOW</span>
          </div>
        </Fade>

        {/* End card */}
        {frame >= CARD ? (
          <>
            <div style={{ position: "absolute", top: 140, left: 0, right: 0, display: "flex", justifyContent: "center", overflow: "hidden", height: 180, paddingTop: 30 }}>
              <div style={{ fontFamily: BEBAS_UA, fontSize: 140, lineHeight: 1, color: COLORS.white, translate: `0 ${(1 - enter(CARD, 9)) * 150}px` }}>
                ОРЕНДА <span style={{ color: COLORS.red }}>ТРЕЙЛЕРІВ</span>
              </div>
            </div>
            <div style={{ position: "absolute", top: 1060, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: enter(CARD + 6) }}>
                <PhoneIcon size={40} />
                <ChatIcon size={40} />
                <span style={{ ...label, fontSize: 36 }}>CALL OR TEXT NOW</span>
              </div>
              <div
                style={{
                  marginTop: 20,
                  background: COLORS.red,
                  borderRadius: 999,
                  padding: "22px 54px 6px",
                  fontFamily: BEBAS_UA,
                  fontSize: 120,
                  lineHeight: 1,
                  color: COLORS.white,
                  opacity: phoneIn,
                  translate: `0 ${(1 - phoneIn) * 80}px`,
                  scale: String(punch(frame, PULSE, 0.06, 4, 10)),
                  boxShadow: `0 0 ${interpolate(frame, [PHONE + 8, PHONE + 14, PHONE + 40], [0, 60, 24], CLAMP)}px rgba(227,16,27,0.7)`,
                }}
              >
                +1 (312) 789-5550
              </div>
              <div style={{ fontFamily: GILROY, fontWeight: 700, fontSize: 38, color: COLORS.white, marginTop: 26, opacity: enter(PHONE + 10) }}>
                Дізнайтеся умови оренди вже зараз
              </div>
            </div>
          </>
        ) : null}

        <Sfx at={ASK[0] - 2} name="whoosh-soft" volume={0.24} />
        <Sfx at={ASK[1]} name="whoosh-fast" volume={0.2} />
        <Sfx at={RENT} name="whoosh-fast" volume={0.2} />
        <Sfx at={LOGO + 8} name="impact-strong" volume={0.4} />
        <Sfx at={CALL} name="ui-click" volume={0.24} />
        <Sfx at={CARD} name="whoosh-soft" volume={0.22} />
        <Sfx at={PHONE + 4} name="notify" volume={0.34} />
        <Sfx at={PHONE + 16} name="resolve" volume={0.3} />
      </AbsoluteFill>
    </Whip>
  );
};
