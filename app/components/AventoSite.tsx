"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { brands, cars, filterCars, type Car, type CarFilters } from "@/lib/catalog";

type AventoSiteProps = {
  mode: "home" | "cars";
  initialBrand?: string;
  initialMaxPrice?: number;
};

export type Action = "credit" | "exchange" | "reserve";

const actionLabels: Record<Action, string> = {
  credit: "У кредит",
  exchange: "Обмін",
  reserve: "Резерв",
};

const formatNumber = new Intl.NumberFormat("uk-UA");

const brandImages: Record<string, string> = {
  Audi: "/brands/audi.svg",
  BMW: "/brands/bmw.svg",
  Hyundai: "/brands/hyundai.svg",
  Kia: "/brands/kia.svg",
  "Land Rover": "/brands/land-rover.svg",
  Lexus: "/brands/lexus.png",
  "Mercedes-Benz": "/brands/mercedes-benz.svg",
  Porsche: "/brands/porsche.svg",
  "Škoda": "/brands/skoda.svg",
  Toyota: "/brands/toyota.svg",
  Volkswagen: "/brands/volkswagen.svg",
  Volvo: "/brands/volvo.svg",
};

function BrandMark({ brand }: { brand: string }) {
  return (
    <span className="brand-mark" aria-hidden="true">
      <img src={brandImages[brand]} alt="" />
    </span>
  );
}

function BrandLink({ brand, compact = false }: { brand: string; compact?: boolean }) {
  return (
    <Link
      className={compact ? "brand-chip brand-chip-compact" : "brand-chip"}
      href={`/cars?brand=${encodeURIComponent(brand)}`}
      aria-label={`Обрати ${brand}`}
    >
      <BrandMark brand={brand} />
      <span>{brand}</span>
    </Link>
  );
}

function CarCard({ car, onAction }: { car: Car; onAction: (action: Action, car: Car) => void }) {
  return (
    <article className="car-card">
      <Link className="photo-frame" href={`/cars/${car.id}`} aria-label={`Докладніше про ${car.brand} ${car.model}`}>
        <img src={car.coverImage} alt={`${car.brand} ${car.model}`} loading="lazy" />
      </Link>

      <div className="car-details">
        <div className="car-title-row">
          <h3><Link href={`/cars/${car.id}`}>{car.brand} {car.model}</Link></h3>
          <span className="rating" aria-label={`Рейтинг ${car.rating} з 5`}>★ {car.rating}</span>
        </div>
        <dl className="spec-list">
          <div><dt>Рік</dt><dd>{car.year}</dd></div>
          <div><dt>Пробіг</dt><dd>{formatNumber.format(car.mileage)} км</dd></div>
          <div><dt>КПП</dt><dd>{car.transmission}</dd></div>
          <div><dt>Двигун</dt><dd>{car.engine.toFixed(1)} л</dd></div>
          <div><dt>Привід</dt><dd>{car.drive}</dd></div>
        </dl>
      </div>

      <div className="car-price">
        <span>Ціна від</span>
        <strong>{formatNumber.format(car.price)} ₴</strong>
        <p>У кредит від {formatNumber.format(car.monthlyPayment)} ₴/міс.</p>
      </div>

      <div className="car-actions">
        <button className="action-primary" onClick={() => onAction("credit", car)}>У кредит</button>
        <button onClick={() => onAction("exchange", car)}>Обмін</button>
        <button onClick={() => onAction("reserve", car)}>Резерв</button>
        <span>Безкоштовно на 24 години</span>
      </div>
    </article>
  );
}

export function RequestModal({
  action,
  car,
  onClose,
}: {
  action: Action;
  car: Car;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>("input")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [onClose]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="request-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="request-title">
        <button className="modal-close" onClick={onClose} aria-label="Закрити форму">×</button>
        {submitted ? (
          <div className="success-state" role="status">
            <span>✓</span>
            <h2 id="request-title">Заявку прийнято</h2>
            <p>Це демонстраційна форма. Дані не надсилалися.</p>
            <button className="action-primary" onClick={onClose}>Закрити</button>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <p className="modal-label">{car.brand} {car.model}</p>
            <h2 id="request-title">{actionLabels[action]}</h2>
            <label>Ім’я<input name="name" autoComplete="name" required /></label>
            <label>Телефон<input name="phone" type="tel" autoComplete="tel" placeholder="+380" required /></label>
            {action === "credit" && (
              <div className="credit-fields">
                <label>Перший внесок<input name="deposit" type="number" min="0" placeholder="500 000" required /></label>
                <label>Строк<select name="term" defaultValue="60"><option value="6">6 місяців</option><option value="12">12 місяців</option><option value="24">24 місяців</option><option value="36">36 місяців</option><option value="48">48 місяців</option><option value="60">60 місяців</option></select></label>
              </div>
            )}
            {action === "exchange" && <label>Ваш автомобіль<input name="trade-in-car" placeholder="Марка, модель, рік" required /></label>}
            <button className="submit-button" type="submit">Надіслати заявку</button>
          </form>
        )}
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <Link className="site-logo" href="/" aria-label="Avento Motors — головна">
        <img src="/avento-logo.png" alt="Avento Motors" />
        <span>Avento Motors</span>
      </Link>
      <nav aria-label="Головна навігація">
        <Link href="/cars">Обрати авто</Link>
        <Link href="/#about">Про нас</Link>
      </nav>
    </header>
  );
}

function HomePage({ onAction }: { onAction: (action: Action, car: Car) => void }) {
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (maxPrice) params.set("maxPrice", maxPrice);
    window.location.href = `/cars${params.size ? `?${params}` : ""}`;
  };

  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">Avento Motors</p>
          <h1>Обрати авто</h1>
        </div>
        <form className="quick-search" onSubmit={onSearch}>
          <label>Марка<select value={brand} onChange={(event) => setBrand(event.target.value)}><option value="">Усі марки</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Максимальна ціна<select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option value="">Без обмежень</option><option value="2500000">2 500 000 ₴</option><option value="3500000">3 500 000 ₴</option><option value="5000000">5 000 000 ₴</option></select></label>
          <button type="submit">Знайти авто</button>
        </form>
      </section>

      <section className="section-shell cars-section">
        <div className="section-heading"><h2>Автомобілі</h2><Link href="/cars">Обрати авто <span>↗</span></Link></div>
        <div className="car-list">{cars.map((car) => <CarCard key={car.id} car={car} onAction={onAction} />)}</div>
      </section>

      <section className="section-shell about-section" id="about">
        <div><p className="eyebrow">Про нас</p><h2>24 роки на автомобільному ринку</h2></div>
        <div className="about-copy">
          <p>З 2002 року Avento Motors працює з автомобілями різних класів — від міських моделей до преміальних седанів, кросоверів і спортивних авто.</p>
          <p>Перед продажем ми звіряємо документи, історію обслуговування, пробіг і технічний стан. Результати перевірки пояснюємо покупцеві до оформлення угоди.</p>
          <p>Допомагаємо порівняти програми кредитування, розрахувати щомісячний платіж та оцінити автомобіль для обміну.</p>
          <p>Обране авто можна безкоштовно зарезервувати на 24 години. Команда супроводжує оформлення та відповідає на запитання щодо подальшого обслуговування.</p>
        </div>
      </section>

      <section className="brands-section">
        <div className="section-shell brand-heading"><h2>Марки</h2></div>
        <div className="brand-reel" aria-label="Марки автомобілів">
          <div className="brand-track">{[...brands, ...brands].map((item, index) => <BrandLink brand={item} compact key={`${item}-${index}`} />)}</div>
        </div>
        <div className="section-shell all-brands-row"><Link className="all-brands-button" href="/cars">Переглянути всі марки</Link></div>
      </section>
    </>
  );
}

function CarsPage({ initialBrand, initialMaxPrice, onAction }: Omit<AventoSiteProps, "mode"> & { onAction: (action: Action, car: Car) => void }) {
  const [filters, setFilters] = useState<CarFilters>({ brand: initialBrand, maxPrice: initialMaxPrice });
  const filteredCars = useMemo(() => filterCars(cars, filters), [filters]);

  const setFilter = (name: keyof CarFilters, value: string) => {
    setFilters((current) => ({ ...current, [name]: value ? Number.isNaN(Number(value)) ? value : Number(value) : undefined }));
  };

  return (
    <div className="choose-page section-shell">
      <Link className="back-button" href="/">← На головну</Link>
      <div className="choose-title"><p className="eyebrow">Avento Motors</p><h1>Обрати авто</h1></div>

      <section className="brand-grid" aria-label="Усі марки">
        {brands.map((brand) => (
          <button
            key={brand}
            className={filters.brand === brand ? "brand-chip selected" : "brand-chip"}
            onClick={() => setFilters((current) => ({ ...current, brand: current.brand === brand ? undefined : brand }))}
          >
            <BrandMark brand={brand} /><span>{brand}</span>
          </button>
        ))}
      </section>

      <section className="filters" aria-label="Фільтри автомобілів">
        <label>Марка<select value={filters.brand ?? ""} onChange={(event) => setFilter("brand", event.target.value)}><option value="">Усі марки</option>{brands.map((brand) => <option key={brand}>{brand}</option>)}</select></label>
        <label>Максимальна ціна<select value={filters.maxPrice ?? ""} onChange={(event) => setFilter("maxPrice", event.target.value)}><option value="">Без обмежень</option><option value="2500000">2 500 000 ₴</option><option value="3500000">3 500 000 ₴</option><option value="5000000">5 000 000 ₴</option></select></label>
        <label>Рік від<select value={filters.minYear ?? ""} onChange={(event) => setFilter("minYear", event.target.value)}><option value="">Будь-який</option><option value="2021">2021</option><option value="2022">2022</option><option value="2023">2023</option></select></label>
        <label>Пробіг до<select value={filters.maxMileage ?? ""} onChange={(event) => setFilter("maxMileage", event.target.value)}><option value="">Без обмежень</option><option value="20000">20 000 км</option><option value="50000">50 000 км</option><option value="100000">100 000 км</option></select></label>
      </section>

      <div className="results-heading"><h2>Автомобілі</h2></div>
      <div className="car-list">
        {filteredCars.length ? filteredCars.map((car) => <CarCard key={car.id} car={car} onAction={onAction} />) : <div className="empty-result"><p>За цими параметрами автомобілів немає.</p><button onClick={() => setFilters({})}>Скинути фільтри</button></div>}
      </div>
    </div>
  );
}

export function AventoSite({ mode, initialBrand, initialMaxPrice }: AventoSiteProps) {
  const [request, setRequest] = useState<{ action: Action; car: Car } | null>(null);

  return (
    <div className="site-frame">
      <Header />
      <main>{mode === "home" ? <HomePage onAction={(action, car) => setRequest({ action, car })} /> : <CarsPage initialBrand={initialBrand} initialMaxPrice={initialMaxPrice} onAction={(action, car) => setRequest({ action, car })} />}</main>
      <footer><strong>Avento Motors</strong><span>Продаж автомобілів · кредит · обмін · резерв</span><span>© 2026</span></footer>
      {request && <RequestModal action={request.action} car={request.car} onClose={() => setRequest(null)} />}
    </div>
  );
}
