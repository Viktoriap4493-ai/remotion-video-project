// Everything a non-developer may want to tweak lives here: colours, copy,
// photo pairs, timing (in seconds) and file paths.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_SECONDS = 25;

export const s = (seconds: number) => Math.round(seconds * FPS);
export const DURATION_IN_FRAMES = s(DURATION_SECONDS);

export const COLORS = {
  white: "#FFFFFF",
  light: "#F5F5F4",
  graphite: "#202630",
  gray: "#646A70",
  brand: "#B84A42",
};

// Only Gilroy Medium (500) and ExtraBold (800) exist in the project.
// Bold and Semibold roles use ExtraBold, the closest real Gilroy weight.
export const FONT = {
  family: "Gilroy",
  bold: 800,
  semibold: 800,
  medium: 500,
};

export const PATHS = {
  logo: "obabko/img/logo.webp",
  mascot: "obabko/img/tooth-mascot.png",
  music: "obabko/audio/music.wav",
  sfx: (name: string) => `obabko/audio/sfx/${name}.wav`,
  fonts: {
    medium: "obabko/fonts/Gilroy-Medium.ttf",
    extraBold: "obabko/fonts/Gilroy-ExtraBold.ttf",
  },
};

export const COPY = {
  headline1: "Здорова усмішка",
  headline2: "починається з",
  headline2Accent: "власного рішення",
  before: "ДО",
  after: "ПІСЛЯ",
  montage: "Реальні результати",
  endLine1: "Не відкладайте",
  endLine2Accent: "турботу про усмішку",
  // Must stay exactly as written.
  address: "м. Київ, вул. Богданівська, 7-Г",
  cta: "Запишіться на консультацію",
};

export type Case = {
  id: string;
  before: string;
  after: string;
  // Card frame (px). Photos are cropped with object-fit: cover, never stretched.
  width: number;
  height: number;
  // Focus point for the crop, as CSS object-position.
  focus?: string;
};

// Before/after pairs. Each pair is one clinical case; the order inside a pair
// never changes (before first). See public/obabko/cases/CASES.md.
export const CASES: Record<string, Case> = {
  cleaning: {
    id: "cleaning",
    before: "obabko/cases/cleaning-before.jpg",
    after: "obabko/cases/cleaning-after.jpg",
    width: 1000,
    height: 860,
  },
  filling: {
    id: "filling",
    before: "obabko/cases/filling-before.jpg",
    after: "obabko/cases/filling-after.jpg",
    width: 1000,
    height: 860,
    focus: "55% 50%",
  },
  crowns: {
    id: "crowns",
    before: "obabko/cases/crowns-before.jpg",
    after: "obabko/cases/crowns-after.jpg",
    width: 820,
    height: 1180,
  },
  molars: {
    id: "molars",
    before: "obabko/cases/molars-before.jpg",
    after: "obabko/cases/molars-after.jpg",
    width: 1000,
    height: 860,
    focus: "60% 50%",
  },
  inlay: {
    id: "inlay",
    before: "obabko/cases/inlay-before.jpg",
    after: "obabko/cases/inlay-after.jpg",
    width: 1000,
    height: 860,
    focus: "60% 50%",
  },
  fullArch: {
    id: "fullArch",
    before: "obabko/cases/fullarch-before.jpg",
    after: "obabko/cases/fullarch-after.jpg",
    width: 1000,
    height: 600,
  },
};

// Scene boundaries in seconds. At 120 BPM every boundary is on a beat.
export const SCENES = {
  intro: { from: 0, to: 3.5 },
  cleaning: { from: 3.5, to: 7 },
  filling: { from: 7, to: 11 },
  crowns: { from: 11, to: 15 },
  montage: { from: 15, to: 19 },
  endCard: { from: 19, to: 25 },
};

export const TREATMENT_SCENES: {
  key: keyof typeof SCENES;
  caseId: keyof typeof CASES;
  label: string;
  accent?: string;
}[] = [
  { key: "cleaning", caseId: "cleaning", label: "Чистота, яку", accent: "видно" },
  { key: "filling", caseId: "filling", label: "Відновлення зубів" },
  { key: "crowns", caseId: "crowns", label: "Відновлення коронками" },
];

// Timing inside each before/after scene, in frames from the scene start.
export const WIPE = {
  cardIn: 0,
  cardInEnd: 10,
  beforeBadge: 6,
  wipeStart: 33,
  wipeEnd: 45,
  afterBadge: 46,
  label: 52,
};

// Results montage: each beat is a whole case, before → after.
// Times in seconds from the montage start; the last case is the strongest
// result and holds on screen (slow-down from 18.2 s, still from 18.6 s).
export const MONTAGE: { caseId: keyof typeof CASES; at: number; wipeAt: number; wipeFrames: number }[] = [
  { caseId: "molars", at: 0, wipeAt: 0.3, wipeFrames: 8 },
  { caseId: "inlay", at: 1.0, wipeAt: 1.3, wipeFrames: 8 },
  { caseId: "fullArch", at: 2.0, wipeAt: 2.4, wipeFrames: 12 },
];

// End card beats, seconds from the start of the video.
export const END = {
  lineDraw: 19.0,
  logo: 19.5,
  slogan: 20.4,
  pinDot: 21.7,
  pinDrop: 21.9,
  pinLand: 22.15,
  pill: 22.25,
  address: 22.35,
  cta: 22.8,
};
