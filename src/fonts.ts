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
]);
