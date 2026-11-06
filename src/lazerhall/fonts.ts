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
  loadFont({
    family: gilroy,
    url: staticFile("lazerhall/fonts/Gilroy-Black.ttf"),
    weight: "900",
  }),
  loadFont({
    family: gilroy,
    url: staticFile("lazerhall/fonts/Gilroy-MediumItalic.ttf"),
    weight: "500",
    style: "italic",
  }),
  loadFont({
    family: gilroy,
    url: staticFile("lazerhall/fonts/Gilroy-SemiBoldItalic.ttf"),
    weight: "600",
    style: "italic",
  }),
]);
