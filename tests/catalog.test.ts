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

  assert.deepEqual(result.map((car) => car.id), ["bmw-x5", "opel-insignia-grand-sport", "mazda-6-sedan"]);
});

test("filters cars by minimum year and maximum mileage", () => {
  const result = filterCars(cars, { minYear: 2023, maxMileage: 20_000 });

  assert.deepEqual(result.map((car) => car.id), ["porsche-911", "mazda-6-sedan"]);
});

test("filters cars by complete price, year, and mileage ranges", () => {
  assert.deepEqual(filterCars(cars, { minPrice: 3_000_000 }).map((car) => car.id), ["porsche-911"]);
  assert.deepEqual(filterCars(cars, { maxYear: 2022 }).map((car) => car.id), ["bmw-x5", "opel-insignia-grand-sport"]);
  assert.deepEqual(filterCars(cars, { minMileage: 30_000 }).map((car) => car.id), ["bmw-x5", "opel-insignia-grand-sport"]);
});

test("ignores empty filters", () => {
  assert.equal(filterCars(cars, {}).length, cars.length);
});

test("filters only special offers", () => {
  assert.deepEqual(filterCars(cars, { specialOffer: true }).map((car) => car.id), ["opel-insignia-grand-sport", "mazda-6-sedan"]);
});

test("keeps BMW and Porsche out of the sale when they have no actual discount", () => {
  for (const id of ["bmw-x5", "porsche-911"]) {
    const car = getCarById(id);
    assert.equal(car?.isSpecialOffer, false);
    assert.equal(car?.discount, undefined);
  }
});

test("adds discounted Opel Insignia and new Mazda 6 offers with local galleries", () => {
  const opel = getCarById("opel-insignia-grand-sport");
  const mazda = getCarById("mazda-6-sedan");

  assert.equal(opel?.brand, "Opel");
  assert.equal(opel?.isSpecialOffer, true);
  assert.ok((opel?.discount ?? 0) > 0);
  assert.deepEqual(opel?.gallery, ["/cars/opel-insignia-front.jpg", "/cars/opel-insignia-rear.jpg"]);
  assert.equal(mazda?.brand, "Mazda");
  assert.equal(mazda?.mileage, 0);
  assert.equal(mazda?.isSpecialOffer, true);
  assert.ok((mazda?.discount ?? 0) > 0);
  assert.deepEqual(mazda?.gallery, ["/cars/mazda-6-front.jpg", "/cars/mazda-6-rear.jpg"]);
});

test("ships performance facts for every catalogue car", () => {
  for (const car of cars) {
    assert.ok(car.topSpeed > 0);
    assert.ok(car.zeroToHundred > 0);
  }
});

test("returns a car with local card and gallery images", () => {
  const car = getCarById("porsche-911");

  assert.equal(car?.coverImage, "/cars/porsche-911-front.jpg");
  assert.deepEqual(car?.gallery, [
    "/cars/porsche-911-front.jpg",
    "/cars/porsche-911-rear.jpg",
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
