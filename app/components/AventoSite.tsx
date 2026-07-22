"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { brands, cars, cycleIndex, filterCars, selectPhotoIndex, type Car, type CarFilters } from "@/lib/catalog";

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
  Chevrolet: "https://cdn.simpleicons.org/chevrolet",
  Citroën: "https://cdn.simpleicons.org/citroen",
  Ford: "https://cdn.simpleicons.org/ford",
  Genesis: "https://cdn.simpleicons.org/genesis",
  Honda: "https://cdn.simpleicons.org/honda",
  Hyundai: "/brands/hyundai.svg",
  Infiniti: "https://cdn.simpleicons.org/infiniti",
  Kia: "/brands/kia.svg",
  "Land Rover": "/brands/land-rover.svg",
  Lexus: "/brands/lexus.png",
  Mazda: "https://cdn.simpleicons.org/mazda",
  "Mercedes-Benz": "/brands/mercedes-benz.svg",
  Mitsubishi: "https://cdn.simpleicons.org/mitsubishi",
  Nissan: "https://cdn.simpleicons.org/nissan",
  Opel: "https://cdn.simpleicons.org/opel",
  Peugeot: "https://cdn.simpleicons.org/peugeot",
  Porsche: "/brands/porsche.svg",
  Renault: "https://cdn.simpleicons.org/renault",
  Subaru: "https://cdn.simpleicons.org/subaru",
  Suzuki: "https://cdn.simpleicons.org/suzuki",
  "Škoda": "/brands/skoda.svg",
  Tesla: "https://cdn.simpleicons.org/tesla",
  Toyota: "/brands/toyota.svg",
  Volkswagen: "/brands/volkswagen.svg",
  Volvo: "/brands/volvo.svg",
};

function BrandMark({ brand }: { brand: string }) {
  return (
    <span className="brand-mark" aria-hidden="true">
      {brandImages[brand] ? <img src={brandImages[brand]} alt="" /> : <span className="brand-monogram">{brand.slice(0, 2)}</span>}
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

function BrandReel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = track.animate(
      [{ transform: "translateX(calc(-50% - 6px))" }, { transform: "translateX(0)" }],
      { duration: 34_000, iterations: Infinity, easing: "linear" },
    );
    animationRef.current = animation;
    return () => animation.cancel();
  }, []);

  const setSpeed = (rate: number) => {
    if (animationRef.current) animationRef.current.playbackRate = rate;
  };

  return (
    <div className="brand-reel" aria-label="Марки автомобілів" onPointerEnter={() => setSpeed(0.425)} onPointerLeave={() => setSpeed(1)} onFocus={() => setSpeed(0.425)} onBlur={() => setSpeed(1)}>
      <div className="brand-track" ref={trackRef}>{[...brands, ...brands].map((item, index) => <BrandLink brand={item} compact key={`${item}-${index}`} />)}</div>
    </div>
  );
}

function CarCard({ car, onAction }: { car: Car; onAction: (action: Action, car: Car) => void }) {
  const router = useRouter();
  const [activePhoto, setActivePhoto] = useState(0);
  const selectPhoto = (index: number) => setActivePhoto(selectPhotoIndex(index, car.gallery.length));

  return (
    <article className="car-card">
      <div className="card-photo-area">
        <Link className="photo-frame" href={`/cars/${car.id}`} aria-label={`Докладніше про ${car.brand} ${car.model}`}>
          <img src={car.gallery[activePhoto] ?? car.coverImage} alt={`${car.brand} ${car.model}`} loading="lazy" />
        </Link>
        <div className="card-photo-zones" aria-label={`Фотографії ${car.brand} ${car.model}`}>
          {car.gallery.map((image, index) => (
            <button
              aria-label={`Показати фото ${index + 1}`}
              className={index === activePhoto ? "card-photo-segment is-active" : "card-photo-segment"}
              key={image}
              onClick={() => router.push(`/cars/${car.id}`)}
              onFocus={() => selectPhoto(index)}
              onMouseEnter={() => selectPhoto(index)}
            />
          ))}
        </div>
        <div className="card-photo-segments" aria-hidden="true">
          {car.gallery.map((image, index) => <span className={index === activePhoto ? "is-active" : ""} key={image} />)}
        </div>
      </div>

      <div className="car-details">
        <div className="car-title-row">
          <h3><Link href={`/cars/${car.id}`}>{car.brand} {car.model}</Link></h3>
          <RatingBadge rating={car.rating} />
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
        <span>Безкоштовний резерв до 24 годин</span>
      </div>
    </article>
  );
}

export function RatingBadge({ rating, detail = false }: { rating: number; detail?: boolean }) {
  return (
    <span className={detail ? "rating-wrap detail-rating-wrap" : "rating-wrap"} tabIndex={0}>
      <span className={detail ? "detail-rating" : "rating"} aria-label={`Рейтинг ${rating} з 5`}>★ {rating}</span>
      <span className="rating-tooltip" role="tooltip">Оцінено за 38 пунктами від 0 до 5</span>
    </span>
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
            <h2 id="request-title">{actionLabels[action]}</h2>
            <div className="request-car-identity">
              <img src={car.coverImage} alt="" />
              <span>{car.brand} {car.model}</span>
            </div>
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
  const scrollToAbout = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname !== "/") return;
    event.preventDefault();
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="site-header">
      <Link className="site-logo" href="/" aria-label="Avento Motors — головна">
        <span className="site-logo-mark" aria-hidden="true"><img src="/avento-logo.png" alt="" /></span>
        <span className="site-logo-wordmark"><span className="site-logo-avento"><span className="site-logo-letter-a">A</span>VENTO</span><span>MOTORS</span></span>
      </Link>
      <nav aria-label="Головна навігація">
        <Link href="/cars">Обрати авто</Link>
        <Link href="/#about" onClick={scrollToAbout}>Про нас</Link>
      </nav>
    </header>
  );
}

function RangeFilter({
  title,
  unit,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: {
  title: string;
  unit: "₴" | "км";
  minValue?: number;
  maxValue?: number;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(Boolean(minValue || maxValue));
  const summary = minValue && maxValue
    ? `${formatNumber.format(minValue)} ${unit} — ${formatNumber.format(maxValue)} ${unit}`
    : minValue
      ? `від ${formatNumber.format(minValue)} ${unit}`
      : maxValue
        ? `до ${formatNumber.format(maxValue)} ${unit}`
        : "Будь-яка";

  return (
    <div className={open ? "range-filter is-open" : "range-filter"}>
      <button type="button" className="range-filter-toggle" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span>{title}</span><span className="range-summary">{summary}</span><span className="range-chevron" aria-hidden="true" />
      </button>
      <div className="range-dropdown">
        <label><span>Мін.</span><span className={minValue ? "range-input-shell has-value" : "range-input-shell"}><span className="range-unit">{unit}</span><input aria-label={`${title}, мінімум`} type="number" min="0" value={minValue ?? ""} onChange={(event) => onMinChange(event.target.value)} /></span></label>
        <label><span>Макс.</span><span className={maxValue ? "range-input-shell has-value" : "range-input-shell"}><span className="range-unit">{unit}</span><input aria-label={`${title}, максимум`} type="number" min="0" value={maxValue ?? ""} onChange={(event) => onMaxChange(event.target.value)} /></span></label>
      </div>
    </div>
  );
}

function YearFilter({ minValue, maxValue, onMinChange, onMaxChange }: { minValue?: number; maxValue?: number; onMinChange: (value: string) => void; onMaxChange: (value: string) => void }) {
  const [open, setOpen] = useState(Boolean(minValue || maxValue));
  const years = Array.from({ length: 17 }, (_, index) => 2010 + index);
  const summary = minValue && maxValue ? `${minValue} — ${maxValue}` : minValue ? `від ${minValue}` : maxValue ? `до ${maxValue}` : "Будь-який";

  return (
    <div className={open ? "range-filter year-filter is-open" : "range-filter year-filter"}>
      <button type="button" className="range-filter-toggle" onClick={() => setOpen((current) => !current)} aria-expanded={open}><span>Рік</span><span className="range-summary">{summary}</span><span className="range-chevron" aria-hidden="true" /></button>
      <div className="range-dropdown">
        <label><span>Мін.</span><select aria-label="Рік, мінімум" value={minValue ?? ""} onChange={(event) => onMinChange(event.target.value)}><option value="">Будь-який</option>{years.map((year) => <option value={year} key={year}>{year}</option>)}</select></label>
        <label><span>Макс.</span><select aria-label="Рік, максимум" value={maxValue ?? ""} onChange={(event) => onMaxChange(event.target.value)}><option value="">Будь-який</option>{years.map((year) => <option value={year} key={year}>{year}</option>)}</select></label>
      </div>
    </div>
  );
}

function HomePage({ onAction }: { onAction: (action: Action, car: Car) => void }) {
  const heroSlides = ["/hero/avento-bmw-night.png", "/hero/avento-audi-night.png", "/hero/avento-range-rover-sunset.png"];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || heroSlides.length < 2) return;
    const timer = window.setTimeout(() => setActiveSlide((current) => cycleIndex(current, heroSlides.length, 1)), 4000);
    return () => window.clearTimeout(timer);
  }, [activeSlide, heroSlides.length]);

  return (
    <>
      <section className="hero-carousel section-shell" aria-label="Avento Motors">
        {heroSlides.map((image, index) => (
          <div className={index === activeSlide ? "hero-slide is-active" : "hero-slide"} key={image} aria-hidden={index !== activeSlide}>
            <img src={image} alt="" />
          </div>
        ))}
        <button className="hero-arrow hero-arrow-prev" onClick={() => setActiveSlide((current) => cycleIndex(current, heroSlides.length, -1))} aria-label="Попередній слайд"><span aria-hidden="true">‹</span></button>
        <button className="hero-arrow hero-arrow-next" onClick={() => setActiveSlide((current) => cycleIndex(current, heroSlides.length, 1))} aria-label="Наступний слайд"><span aria-hidden="true">›</span></button>
        <Link className="hero-more-link" href="/cars">Дивитися більше</Link>
        <div className="hero-dots" aria-label="Банери">{heroSlides.map((_, index) => <button className={index === activeSlide ? "is-active" : ""} key={index} onClick={() => setActiveSlide(index)} aria-label={`Перейти до банера ${index + 1}`} aria-current={index === activeSlide ? "true" : undefined} />)}</div>
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
          <p>Щодня ми оновлюємо добірку, щоб у ній залишалися автомобілі з прозорою історією, зрозумілими документами та реальною комплектацією. До перегляду можна порівняти варіанти, умови фінансування й орієнтовну оцінку вашого авто.</p>
        </div>
      </section>

      <section className="brands-section">
        <div className="section-shell brand-heading"><h2>Марки</h2></div>
        <BrandReel />
        <div className="section-shell all-brands-row"><Link className="all-brands-button" href="/cars">Переглянути всі марки</Link></div>
      </section>
    </>
  );
}

function CarsPage({ initialBrand, initialMaxPrice, onAction }: Omit<AventoSiteProps, "mode"> & { onAction: (action: Action, car: Car) => void }) {
  const [filters, setFilters] = useState<CarFilters>({ brands: initialBrand ? [initialBrand] : undefined, maxPrice: initialMaxPrice });
  const filteredCars = useMemo(() => filterCars(cars, filters), [filters]);

  const setFilter = (name: keyof CarFilters, value: string) => {
    setFilters((current) => ({ ...current, [name]: value ? Number.isNaN(Number(value)) ? value : Number(value) : undefined }));
  };

  const clearFilter = (name: keyof CarFilters) => setFilters((current) => ({ ...current, [name]: undefined }));
  const selectedFilters = [
    ...(filters.brands ?? []).map((brand) => ({ key: `brand-${brand}`, label: `Марка «${brand}»`, remove: () => setFilters((current) => ({ ...current, brands: current.brands?.filter((item) => item !== brand) || undefined })) })),
    ...(filters.minPrice ? [{ key: "minPrice", label: `Ціна від ${formatNumber.format(filters.minPrice)} грн`, remove: () => clearFilter("minPrice") }] : []),
    ...(filters.maxPrice ? [{ key: "maxPrice", label: `Ціна до ${formatNumber.format(filters.maxPrice)} грн`, remove: () => clearFilter("maxPrice") }] : []),
    ...(filters.minYear ? [{ key: "minYear", label: `Рік від ${filters.minYear}`, remove: () => clearFilter("minYear") }] : []),
    ...(filters.maxYear ? [{ key: "maxYear", label: `Рік до ${filters.maxYear}`, remove: () => clearFilter("maxYear") }] : []),
    ...(filters.minMileage ? [{ key: "minMileage", label: `Пробіг від ${formatNumber.format(filters.minMileage)} км`, remove: () => clearFilter("minMileage") }] : []),
    ...(filters.maxMileage ? [{ key: "maxMileage", label: `Пробіг до ${formatNumber.format(filters.maxMileage)} км`, remove: () => clearFilter("maxMileage") }] : []),
  ];

  return (
    <div className="choose-page section-shell">
      <Link className="back-button" href="/">← На головну</Link>
      <div className="choose-title"><h1>Обрати авто</h1></div>

      <section className="brand-grid" aria-label="Усі марки">
        {brands.map((brand) => (
          <button
            key={brand}
            className={filters.brands?.includes(brand) ? "brand-chip selected" : "brand-chip"}
            onClick={() => setFilters((current) => {
              const selected = current.brands ?? [];
              const brands = selected.includes(brand) ? selected.filter((item) => item !== brand) : [...selected, brand];
              return { ...current, brands: brands.length ? brands : undefined };
            })}
          >
            <BrandMark brand={brand} /><span>{brand}</span>
          </button>
        ))}
      </section>

      <section className="filters" aria-label="Фільтри автомобілів">
        <label className="brand-filter">Марки<select value={filters.brands?.[0] ?? ""} onChange={(event) => setFilters((current) => ({ ...current, brands: event.target.value ? [event.target.value] : undefined }))}><option value="">Усі марки</option>{brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}</select></label>
        <RangeFilter title="Ціна" unit="₴" minValue={filters.minPrice} maxValue={filters.maxPrice} onMinChange={(value) => setFilter("minPrice", value)} onMaxChange={(value) => setFilter("maxPrice", value)} />
        <YearFilter minValue={filters.minYear} maxValue={filters.maxYear} onMinChange={(value) => setFilter("minYear", value)} onMaxChange={(value) => setFilter("maxYear", value)} />
        <RangeFilter title="Пробіг" unit="км" minValue={filters.minMileage} maxValue={filters.maxMileage} onMinChange={(value) => setFilter("minMileage", value)} onMaxChange={(value) => setFilter("maxMileage", value)} />
      </section>

      {selectedFilters.length > 0 && <div className="selected-filters" aria-label="Обрані фільтри">{selectedFilters.map((filter) => <button type="button" className="selected-filter-chip" key={filter.key} onClick={filter.remove}><span>{filter.label}</span><span aria-hidden="true">×</span></button>)}</div>}

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
