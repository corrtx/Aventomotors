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
  topSpeed: number;
  zeroToHundred: number;
  isSpecialOffer: boolean;
  discount?: number;
  coverImage: string;
  gallery: readonly string[];
};

export type CarFilters = {
  brand?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  specialOffer?: boolean;
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
    topSpeed: 230,
    zeroToHundred: 6.5,
    isSpecialOffer: true,
    discount: 120_000,
    coverImage: "/cars/bmw-x5-front.png",
    gallery: [
      "/cars/bmw-x5-front.png",
      "/cars/bmw-x5-rear.png",
    ],
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
    topSpeed: 293,
    zeroToHundred: 4.2,
    isSpecialOffer: true,
    discount: 180_000,
    coverImage: "/cars/porsche-911-front.png",
    gallery: [
      "/cars/porsche-911-front.png",
      "/cars/porsche-911-rear.png",
    ],
  },
];

export const brands = [
  "Audi",
  "BMW",
  "Chevrolet",
  "Citroën",
  "Ford",
  "Genesis",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Kia",
  "Land Rover",
  "Lexus",
  "Mazda",
  "Mercedes-Benz",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "Subaru",
  "Suzuki",
  "Škoda",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
] as const;

export function filterCars(items: Car[], filters: CarFilters) {
  return items.filter((car) => {
    if (filters.brands?.length && !filters.brands.includes(car.brand)) return false;
    if (filters.brand && car.brand !== filters.brand) return false;
    if (filters.minPrice && car.price < filters.minPrice) return false;
    if (filters.maxPrice && car.price > filters.maxPrice) return false;
    if (filters.minYear && car.year < filters.minYear) return false;
    if (filters.maxYear && car.year > filters.maxYear) return false;
    if (filters.minMileage && car.mileage < filters.minMileage) return false;
    if (filters.maxMileage && car.mileage > filters.maxMileage) return false;
    if (filters.specialOffer && !car.isSpecialOffer) return false;
    return true;
  });
}

export function getCarById(id: string) {
  return cars.find((car) => car.id === id);
}

export type GalleryLayout = "two" | "three" | "four" | "many";

export function getGalleryLayout(images: readonly string[]): GalleryLayout {
  if (images.length <= 2) return "two";
  if (images.length === 3) return "three";
  if (images.length === 4) return "four";
  return "many";
}

export function cycleIndex(current: number, length: number, offset: number) {
  return length ? (current + offset + length) % length : 0;
}

export function selectPhotoIndex(index: number, length: number) {
  return length ? Math.min(Math.max(index, 0), length - 1) : 0;
}
