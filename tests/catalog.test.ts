import assert from "node:assert/strict";
import test from "node:test";

import { cars, filterCars } from "../lib/catalog.ts";

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
