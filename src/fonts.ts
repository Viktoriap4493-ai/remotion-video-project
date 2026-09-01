import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const headlineFont = "Ad Headline";
export const bodyFont = "Ad Body";

export const fontsLoaded = Promise.all([
  loadFont({
    family: headlineFont,
    url: staticFile("fonts/archivo-black.woff2"),
    weight: "400",
  }),
  loadFont({
    family: bodyFont,
    url: staticFile("fonts/nunito-800.woff2"),
    weight: "700",
  }),
  loadFont({
    family: bodyFont,
    url: staticFile("fonts/nunito-800.woff2"),
    weight: "800",
  }),
  loadFont({
    family: bodyFont,
    url: staticFile("fonts/nunito-800.woff2"),
    weight: "900",
  }),
  loadFont({
    family: bodyFont,
    url: staticFile("fonts/nunito-cyrillic.woff2"),
    weight: "900",
    unicodeRange:
      "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
  }),
]);
