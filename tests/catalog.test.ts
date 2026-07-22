import assert from "node:assert/strict";
import test from "node:test";

import { cars, cycleIndex, filterCars, getCarById, getGalleryLayout, selectPhotoIndex } from "../lib/catalog.ts";

test("filters cars by brand", () => {
  const result = filterCars(cars, { brand: "BMW" });

  assert.deepEqual(result.map((car) => car.brand), ["BMW"]);
});

test("filters cars by any of several selected brands", () => {
  const result = filterCars([
    { ...cars[0], brand: "Kia" },
    { ...cars[1], brand: "Lexus" },
    { ...cars[0], id: "audi-a3", brand: "Audi" },
  ], { brands: ["Kia", "Lexus"] });

  assert.deepEqual(result.map((car) => car.brand), ["Kia", "Lexus"]);
});

test("filters cars by maximum price", () => {
  const result = filterCars(cars, { maxPrice: 3_000_000 });

  assert.deepEqual(result.map((car) => car.id), ["bmw-x5"]);
});

test("filters cars by minimum year and maximum mileage", () => {
  const result = filterCars(cars, { minYear: 2023, maxMileage: 20_000 });

  assert.deepEqual(result.map((car) => car.id), ["porsche-911"]);
});

test("ignores empty filters", () => {
  assert.equal(filterCars(cars, {}).length, cars.length);
});

test("returns a car with local card and gallery images", () => {
  const car = getCarById("porsche-911");

  assert.equal(car?.coverImage, "/cars/porsche-911-front.png");
  assert.deepEqual(car?.gallery, [
    "/cars/porsche-911-front.png",
    "/cars/porsche-911-rear.png",
  ]);
});

test("returns undefined for an unknown car", () => {
  assert.equal(getCarById("missing-car"), undefined);
});

test("selects the approved gallery layout from the photo count", () => {
  assert.equal(getGalleryLayout(cars[0].gallery), "two");
  assert.equal(getGalleryLayout([...cars[0].gallery, "/cars/third.png"]), "three");
  assert.equal(getGalleryLayout([...cars[0].gallery, "/cars/third.png", "/cars/fourth.png"]), "four");
  assert.equal(getGalleryLayout([...cars[0].gallery, "/cars/third.png", "/cars/fourth.png", "/cars/fifth.png"]), "many");
});

test("wraps carousel navigation around both ends", () => {
  assert.equal(cycleIndex(0, 2, -1), 1);
  assert.equal(cycleIndex(1, 2, 1), 0);
});

test("keeps photo selection within gallery bounds", () => {
  assert.equal(selectPhotoIndex(3, 2), 1);
  assert.equal(selectPhotoIndex(-1, 2), 0);
});
