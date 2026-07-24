"use client";

import { useState } from "react";
import Link from "next/link";
import { cars, type Car } from "@/lib/catalog";
import { CarCard, Footer, Header, RatingBadge, RequestModal, type Action } from "./AventoSite";
import { CarGallery } from "./CarGallery";

const formatNumber = new Intl.NumberFormat("uk-UA");

export function CarDetailPage({ car }: { car: Car }) {
  const [request, setRequest] = useState<Action | null>(null);
  const saleCars = cars.filter((item) => item.isSpecialOffer && item.id !== car.id);

  return (
    <div className="site-frame">
      <Header />
      <main className="car-detail section-shell">
        <Link className="detail-back" href="/cars">← До списку автомобілів</Link>

        <div className="detail-heading">
          <div>
            <h1>{car.brand} {car.model}</h1>
          </div>
          <RatingBadge rating={car.rating} detail />
        </div>

        <section className="detail-top-layout">
          <CarGallery car={car} compact />
          <div className="detail-offer">
            <span>Ціна від</span>
            <strong>{formatNumber.format(car.price)} ₴</strong>
            <p>У кредит від {formatNumber.format(car.monthlyPayment)} ₴/міс.</p>
            <div className="detail-actions">
              <button className="action-primary" onClick={() => setRequest("credit")}>У кредит</button>
              <button onClick={() => setRequest("exchange")}>Обмін</button>
              <button onClick={() => setRequest("reserve")}>Резерв</button>
            </div>
            <small>Безкоштовний резерв до 24 годин</small>
          </div>
        </section>

        <section className="detail-specs">
          <h2>Характеристики</h2>
          <dl>
            <div><dt>Рік</dt><dd>{car.year}</dd></div>
            <div><dt>Пробіг</dt><dd>{formatNumber.format(car.mileage)} км</dd></div>
            <div><dt>КПП</dt><dd>{car.transmission}</dd></div>
            <div><dt>Двигун</dt><dd>{car.engine.toFixed(1)} л</dd></div>
            <div><dt>Паливо</dt><dd>{car.fuel}</dd></div>
            <div><dt>Привід</dt><dd>{car.drive}</dd></div>
            <div><dt>Макс. швидкість</dt><dd>{car.topSpeed} км/год</dd></div>
            <div><dt>0–100 км/год</dt><dd>{car.zeroToHundred.toFixed(1)} с</dd></div>
          </dl>
        </section>

        {saleCars.length > 0 && <section className="sale-rail">
          <div className="sale-rail-heading"><h2>Розпродаж</h2>{cars.filter((item) => item.isSpecialOffer).length > 4 && <Link href="/offers">Усі спецпропозиції</Link>}</div>
          <div className="sale-grid">
            {saleCars.slice(0, 4).map((item) => <CarCard car={item} key={item.id} onAction={(action) => setRequest(action)} />)}
          </div>
        </section>}
      </main>

      <Footer />
      {request && <RequestModal action={request} car={car} onClose={() => setRequest(null)} />}
    </div>
  );
}
