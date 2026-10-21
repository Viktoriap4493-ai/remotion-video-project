import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const gilroy = "Gilroy";

export const gilroyLoaded = Promise.all([
  loadFont({
    family: gilroy,
    url: staticFile("lazerhall/fonts/Gilroy-Light.ttf"),
    weight: "300",
  }),
  loadFont({
    family: gilroy,
    url: staticFile("lazerhall/fonts/Gilroy-Medium.ttf"),
    weight: "500",
  }),
  loadFont({
    family: gilroy,
    url: staticFile("lazerhall/fonts/Gilroy-ExtraBold.ttf"),
    weight: "800",
  }),
]);
