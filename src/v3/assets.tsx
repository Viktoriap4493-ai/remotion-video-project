import { createContext, useContext } from "react";
import type { Point } from "./components/Outline";
import { PHOTOS, STANDARD_TRAILER, STANDARD_TRUCK } from "./shapes";

type Photo = { src: string; width: number; height: number };

// The swappable media of SetupStory plus the geometry tied to each image
// (outline, camera focus point, screen height of the trailer for the
// "shed weight" slivers). Everything else in the edit is shared.
export type SetupAssets = {
  standardTrailer: { photo: Photo; points: Point[]; focus: { x: number; y: number }; shedY: number };
  standardTruck: { photo: Photo; points: Point[]; focus: { x: number; y: number } };
  balanceVideo: string;
};

export const ORIGINAL_ASSETS: SetupAssets = {
  standardTrailer: { photo: PHOTOS.standardTrailer, points: STANDARD_TRAILER, focus: { x: 800, y: 900 }, shedY: 1120 },
  standardTruck: { photo: PHOTOS.standardTruck, points: STANDARD_TRUCK, focus: { x: 340, y: 810 } },
  balanceVideo: "v3/video/balance.mp4",
};

// Re-edit: 7.png → 2.png (black F-350 + gooseneck, side), 9.png → 1.JPG
// (black F-350, front ¾), веси.mov → нове.mov.
export const V2_ASSETS: SetupAssets = {
  standardTrailer: {
    photo: { src: "v3/img/standard-trailer-2png.jpg", width: 1122, height: 1402 },
    points: [
      [418, 712], [470, 705], [650, 712], [760, 745], [900, 790], [1030, 825], [1112, 848], [1112, 862],
      [1025, 868], [1010, 888], [905, 888], [895, 872], [660, 872], [575, 868], [570, 840], [470, 790],
      [418, 792],
    ],
    focus: { x: 765, y: 800 },
    shedY: 1025,
  },
  standardTruck: {
    photo: { src: "v3/img/standard-truck-1jpg.jpg", width: 1024, height: 1280 },
    points: [
      [10, 740], [30, 705], [150, 690], [195, 640], [240, 612], [275, 606], [520, 612], [545, 640],
      [560, 700], [600, 705], [688, 708], [692, 780], [688, 830], [680, 872], [590, 875], [570, 830],
      [420, 860], [400, 935], [360, 948], [305, 940], [290, 880], [60, 885], [30, 860], [8, 800],
    ],
    focus: { x: 350, y: 780 },
  },
  balanceVideo: "v3/video/balance-new.mp4",
};

const AssetsContext = createContext<SetupAssets>(ORIGINAL_ASSETS);
export const AssetsProvider = AssetsContext.Provider;
export const useSetupAssets = () => useContext(AssetsContext);
