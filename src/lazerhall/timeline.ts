export const FPS = 30;

export const s = (seconds: number) => Math.round(seconds * FPS);

// Same running time as the reference story (20.9s).
export const DURATION_IN_FRAMES = s(20.9);

export const BRAND_BLUE = "#051D5E";

// Cuts land on the reference track's beats (~0.55s apart) and on the
// reference's own cut points (2.67s photo → footage, end card at ~20s).
export const BEFORE_AFTER_END = s(2.667);

// Each clip: where it sits on the timeline and where it starts in the source.
export const CLIPS: { src: string; from: number; to: number; sourceStart: number }[] = [
  { src: "ipl-closeup", from: 2.667, to: 4.55, sourceStart: 1.0 },
  { src: "cheek-handpiece", from: 4.55, to: 6.1, sourceStart: 0.15 },
  { src: "ipl-closeup", from: 6.1, to: 7.15, sourceStart: 3.0 },
  { src: "specialist-a", from: 7.15, to: 11.3, sourceStart: 2.0 },
  { src: "device", from: 11.3, to: 15.5, sourceStart: 0.25 },
  { src: "gel-goggles", from: 15.5, to: 17.6, sourceStart: 1.3 },
  { src: "face-closeup", from: 17.6, to: 20.9, sourceStart: 0.5 },
];

// Advantage lines replace each other on these beats; a click plays on each.
export const ADVANTAGES = [
  { text: "ВРАЖАЮЧІ РЕЗУЛЬТАТИ З ПЕРШОЇ ПРОЦЕДУРИ", at: s(2.9) },
  { text: "ПРАЦЮЄМО З БІЛЬШ СКЛАДНИМИ ВИПАДКАМИ", at: s(7.15) },
  { text: "ІННОВАЦІЙНИЙ АПАРАТ НОВОГО ПОКОЛІННЯ", at: s(11.3) },
  { text: "ПРЕМІАЛЬНИЙ СЕРВІС І КОМФОРТ", at: s(15.5) },
];

export const PRICE = {
  oldIn: s(2.7),
  pillIn: s(2.9),
  textIn: s(3.1),
  noteIn: s(3.3),
};

export const OUTRO = {
  fadeOut: s(19.65),
  cardIn: s(19.9),
};
