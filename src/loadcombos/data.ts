// Values are copied verbatim from the supplied LOAD #1–#3 banners.
export type Vehicle = { img: string; name: string; weight: string };

export type Load = {
  label: string;
  vehicles: Vehicle[];
  cargo: string;
  under: string;
  total: string;
};

const FORD: Vehicle = { img: "ford", name: "Ford F-150", weight: "4,785 LB" };
const RIVIAN: Vehicle = {
  img: "rivian",
  name: "Rivian Amazon Van",
  weight: "6,616 LB",
};

export const LOADS: Load[] = [
  {
    label: "LOAD #1",
    vehicles: [
      FORD,
      FORD,
      { img: "toyota", name: "Toyota Corolla", weight: "3,267 LB" },
    ],
    cargo: "12,837 LB",
    under: "663 LB",
    total: "25,337 LB",
  },
  {
    label: "LOAD #2",
    vehicles: [RIVIAN, RIVIAN],
    cargo: "13,232 LB",
    under: "268 LB",
    total: "25,732 LB",
  },
  {
    label: "LOAD #3",
    vehicles: [
      RIVIAN,
      { img: "tesla", name: "Tesla Model 3", weight: "4,065 LB" },
      { img: "chevrolet", name: "Chevy Equinox", weight: "4,167 LB" },
    ],
    cargo: "14,848 LB",
    under: "1,652 LB",
    total: "24,348 LB",
  },
];
