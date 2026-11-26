import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Audio } from "@remotion/media";
import {
  ADDRESS,
  ASSETS,
  AdvantageSwipe,
  BeforeAfterWipe,
  BenefitGrid,
  BenefitsBand,
  BlackFridayBadge,
  BlackFridayIntro,
  CaptionPlate,
  CtaButton,
  EndCard,
  FootageClip,
  LightBackground,
  LightLeak,
  LogoHeader,
  OfferDatesBadge,
  PriceBlock,
  SectionTitle,
  Subtitle,
  WordCaption,
  sec,
  words,
} from "../components";

// A short reel that puts every LAZERHALL component on screen once, to check
// the collected style. Texts are the ones already used in approved ads.
export const DEMO_DURATION = sec(15.5);

const SCENES = {
  intro: [0, 2.6],
  header: [2.6, 7.0],
  title: [7.0, 9.8],
  results: [9.8, 12.4],
  badge: [12.4, 13.6],
  end: [13.6, 15.5],
} as const;

const span = (name: keyof typeof SCENES) => ({
  from: sec(SCENES[name][0]),
  durationInFrames: sec(SCENES[name][1]) - sec(SCENES[name][0]),
});
const len = (name: keyof typeof SCENES) => span(name).durationInFrames;

const advantages = [
  { text: "ВРАЖАЮЧІ РЕЗУЛЬТАТИ З ПЕРШОЇ ПРОЦЕДУРИ", at: sec(0.3) },
  { text: "ІННОВАЦІЙНИЙ АПАРАТ НОВОГО ПОКОЛІННЯ", at: sec(2.3) },
];

export const LaserhallStyleDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence {...span("intro")}>
      <FootageClip src={ASSETS.video.iplCheek} lengthInFrames={len("intro")} shade="none" />
      <BlackFridayIntro exit={sec(2.4)} />
    </Sequence>

    <Sequence {...span("header")}>
      <FootageClip src={ASSETS.video.iplCheek} trimBeforeFrames={sec(0.4)} lengthInFrames={len("header")} shade="top" />
      <LogoHeader procedure="ЛІКУВАННЯ КУПЕРОЗУ ТА ПІГМЕНТАЦІЇ" />
      <AdvantageSwipe items={advantages} />
      <OfferDatesBadge dates="26.11 — 30.11" note="Тільки 5 днів" start={sec(0.8)} />
      <PriceBlock oldPrice="12 000 грн" price="6 000 грн" unit="4 процедури" note="Абонемент на курс з 4 процедур" start={sec(0.5)} />
      <CtaButton start={sec(1.2)} />
      {advantages.map(({ at }) => (
        <Sequence key={at} from={at} durationInFrames={sec(0.2)}>
          <Audio src={ASSETS.audio.click} volume={0.9} />
        </Sequence>
      ))}
    </Sequence>

    <Sequence {...span("title")}>
      <FootageClip src={ASSETS.video.smasMarking} trimBeforeFrames={sec(9.0)} lengthInFrames={len("title")} fadeInFrames={5} />
      <SectionTitle title="RF ЛІФТИНГ" subtitle={"БЕЗОПЕРАЦІЙНА РАДІОХВИЛЬОВА\nПІДТЯЖКА ОБЛИЧЧЯ"} address={ADDRESS} />
      <BenefitGrid
        top={1080}
        items={[
          { icon: "drop", text: "Глибокий ліфтинг\nта ущільнення шкіри" },
          { icon: "loop", text: "Чіткіший овал,\nрівніша текстура" },
          { icon: "waves", text: "Стимуляція колагену\nбез операцій" },
          { icon: "check", text: "Зменшення\nвидимості зморшок" },
        ]}
      />
      <BenefitsBand items={["чіткий овал", "підтягнута шкіра", "менше зморшок"]} start={sec(0.6)} top={1340} />
      <Sequence from={sec(1.2)}>
        <WordCaption lines={[words("Виразні *вилиці й рівний"), words("контур *підборіддя")]} lengthInFrames={sec(1.6)} top={1450} />
      </Sequence>
    </Sequence>
    <Sequence from={sec(SCENES.title[1]) - 9} durationInFrames={18}>
      <LightLeak at={9} />
    </Sequence>

    <Sequence {...span("results")}>
      <LightBackground />
      <BeforeAfterWipe
        before={ASSETS.beforeAfter.smas.before}
        after={ASSETS.beforeAfter.smas.after}
        aspect={941 / 1672}
        lengthInFrames={len("results")}
        cardHeight={1000}
        top={340}
      />
      <Subtitle text="Підтягнута шкіра без філерів і скальпеля" lengthInFrames={len("results")} top={240} />
      <Sequence from={sec(0.9)}>
        <CaptionPlate text={"ПОКРАЩЕННЯ\nЯКОСТІ ШКІРИ"} lengthInFrames={len("results") - sec(0.9)} top={1380} />
      </Sequence>
    </Sequence>

    <Sequence {...span("badge")}>
      <LightBackground />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ marginLeft: -60 }}>
          <BlackFridayBadge start={2} />
        </div>
      </AbsoluteFill>
    </Sequence>

    <Sequence {...span("end")}>
      <EndCard />
    </Sequence>
  </AbsoluteFill>
);
