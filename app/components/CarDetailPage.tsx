"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import type { Car } from "@/lib/catalog";
import { Header, RequestModal, type Action } from "./AventoSite";
import { CarGallery } from "./CarGallery";

const formatNumber = new Intl.NumberFormat("uk-UA");

export function CarDetailPage({ car }: { car: Car }) {
  const [request, setRequest] = useState<Action | null>(null);

  return (
    <div className="site-frame">
      <Header />
      <main className="car-detail section-shell">
        <Link className="detail-back" href="/cars">← До списку автомобілів</Link>

        <div className="detail-heading">
          <div>
            <p className="eyebrow">{car.brand}</p>
            <h1>{car.brand} {car.model}</h1>
          </div>
          <span className="detail-rating" aria-label={`Рейтинг ${car.rating} з 5`}>★ {car.rating}</span>
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
          </dl>
        </section>
      </main>

      <footer><strong>Avento Motors</strong><span>Продаж автомобілів · кредит · обмін · резерв</span><span>© 2026</span></footer>
      {request && <RequestModal action={request} car={car} onClose={() => setRequest(null)} />}
    </div>
  );
}
