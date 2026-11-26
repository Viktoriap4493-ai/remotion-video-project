import { loadFont } from "@remotion/fonts";
import black from "../assets/fonts/Gilroy-Black.ttf";
import extraBold from "../assets/fonts/Gilroy-ExtraBold.ttf";
import medium from "../assets/fonts/Gilroy-Medium.ttf";
import mediumItalic from "../assets/fonts/Gilroy-MediumItalic.ttf";
import semiBoldItalic from "../assets/fonts/Gilroy-SemiBoldItalic.ttf";

// Gilroy only. Light is deliberately not shipped: the client ruled it out.
export const GILROY = "Gilroy LAZERHALL";

export const WEIGHT = {
  medium: 500, // body text, plates, subtitles, addresses
  semiBold: 600, // italic labels and accents only
  extraBold: 800, // titles, prices, CTA, LAZERHALL
  black: 900, // the big "-50%" and "SALE"
} as const;

export const fontsLoaded = Promise.all([
  loadFont({ family: GILROY, url: medium, weight: "500" }),
  loadFont({ family: GILROY, url: mediumItalic, weight: "500", style: "italic" }),
  loadFont({ family: GILROY, url: semiBoldItalic, weight: "600", style: "italic" }),
  loadFont({ family: GILROY, url: extraBold, weight: "800" }),
  loadFont({ family: GILROY, url: black, weight: "900" }),
]);
