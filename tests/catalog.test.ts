import assert from "node:assert/strict";
import test from "node:test";

import { cars, filterCars, getCarById, getGalleryLayout } from "../lib/catalog.ts";

test("filters cars by brand", () => {
  const result = filterCars(cars, { brand: "BMW" });

  assert.deepEqual(result.map((car) => car.brand), ["BMW"]);
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
