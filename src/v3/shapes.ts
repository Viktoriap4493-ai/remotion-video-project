import type { Point } from "./components/Outline";

// Hand-traced contours in source-image pixels. Each photo's outline covers
// only the vehicle part the scene is about (trailer OR truck, never both).
export const PHOTOS = {
  standardTrailer: { src: "v3/img/standard-trailer.jpg", width: 1122, height: 1402 }, // 7.png
  standardTruck: { src: "v3/img/standard-truck.jpg", width: 1122, height: 1402 }, // 9.png
  d4uTruck: { src: "v3/img/d4u-truck.jpg", width: 1320, height: 1650 }, // 8.png
  d4uTrailer: { src: "v3/img/d4u-trailer.jpg", width: 1320, height: 1745 }, // 10.png
} as const;

export const STANDARD_TRAILER: Point[] = [
  [505, 880], [515, 862], [560, 860], [600, 876], [990, 868], [1005, 858], [1040, 860], [1046, 880],
  [1098, 890], [1098, 912], [1030, 915], [1025, 942], [830, 942], [825, 916], [700, 914], [600, 918],
  [505, 915],
];

export const D4U_TRAILER: Point[] = [
  [300, 456], [390, 430], [520, 600], [660, 780], [820, 960], [940, 1160], [1000, 1320], [990, 1350],
  [780, 1490], [750, 1460], [660, 1200], [580, 1000], [500, 820], [370, 810], [364, 700], [430, 684],
  [410, 660], [330, 520],
];

export const STANDARD_TRUCK: Point[] = [
  [12, 760], [30, 742], [150, 722], [205, 668], [245, 652], [530, 650], [562, 665], [566, 738],
  [678, 742], [686, 800], [676, 868], [655, 930], [580, 932], [565, 880], [400, 890], [378, 968],
  [290, 975], [270, 935], [40, 925], [15, 895],
];

export const D4U_TRUCK: Point[] = [
  [65, 912], [81, 837], [131, 806], [250, 797], [325, 756], [400, 740], [675, 750], [787, 781],
  [800, 900], [800, 977], [875, 1000], [987, 1012], [1050, 1062], [1250, 1081], [1285, 1087],
  [1281, 1156], [1237, 1175], [1100, 1181], [962, 1225], [825, 1219], [787, 1162], [650, 1087],
  [562, 1081], [225, 1025], [206, 1062], [106, 1062], [87, 1006], [65, 987],
];
