// LAZERHALL design tokens, collected from the approved ads in src/
// (lazerhall, blackfriday, rflifting, ipl, smas, rf3). See ../style.md.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const COLORS = {
  blue: "#051D5E", // brand blue: plates, prices, buttons, end card
  blueDeep: "#020F36", // darkest stop of the blue radial background
  blueMid: "#1A3D9E", // lightest stop of the blue radial background
  lightBlue: "#93AEF0", // brand blue at text lightness, for accents on dark footage
  captionAccent: "#0044C9", // highlighted words in word-by-word captions
  lightBg: "#EEF1F8", // light screens: white → this
  white: "#FFFFFF",
  lilac: "#E6B3F2", // small accent on the offer-dates badge only
  pinRed: "#E5322D", // map pin next to the address
  oldPrice: "rgba(5,29,94,0.55)", // struck-through price inside a white pill
} as const;

export const SHADOWS = {
  text: "0 2px 10px rgba(0,0,0,0.45)",
  plate: "0 12px 34px rgba(0,0,0,0.35)",
  card: "0 20px 50px rgba(0,0,0,0.4)",
} as const;

// Text must stay inside this band: Instagram's header above, the ad CTA below.
export const SAFE = { top: 220, bottom: 1600, side: 60 } as const;

export const ADDRESS = "Львів, вул. Мирослава Скорика, 16";
export const BRAND_NAME = "LAZERHALL";
