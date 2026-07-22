export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string;
  engine: number;
  drive: string;
  fuel: string;
  rating: number;
  price: number;
  monthlyPayment: number;
};

export type CarFilters = {
  brand?: string;
  maxPrice?: number;
  minYear?: number;
  maxMileage?: number;
};

export const cars: Car[] = [
  {
    id: "bmw-x5",
    brand: "BMW",
    model: "X5 xDrive30d",
    year: 2022,
    mileage: 42_000,
    transmission: "Автомат",
    engine: 3,
    drive: "Повний",
    fuel: "Дизель",
    rating: 4.9,
    price: 2_390_000,
    monthlyPayment: 32_423,
  },
  {
    id: "porsche-911",
    brand: "Porsche",
    model: "911 Carrera",
    year: 2023,
    mileage: 18_500,
    transmission: "Автомат",
    engine: 3,
    drive: "Задній",
    fuel: "Бензин",
    rating: 4.8,
    price: 4_750_000,
    monthlyPayment: 64_850,
  },
];

export const brands = [
  "Audi",
  "BMW",
  "Hyundai",
  "Kia",
  "Land Rover",
  "Lexus",
  "Mercedes-Benz",
  "Porsche",
  "Škoda",
  "Toyota",
  "Volkswagen",
  "Volvo",
] as const;

export function filterCars(items: Car[], filters: CarFilters) {
  return items.filter((car) => {
    if (filters.brand && car.brand !== filters.brand) return false;
    if (filters.maxPrice && car.price > filters.maxPrice) return false;
    if (filters.minYear && car.year < filters.minYear) return false;
    if (filters.maxMileage && car.mileage > filters.maxMileage) return false;
    return true;
  });
}
