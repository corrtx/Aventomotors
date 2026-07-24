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
  initialMinMileage?: number;
  initialSpecialOffer?: boolean;
  specialOffersPage?: boolean;
  usedCarsPage?: boolean;
};

export type Action = "credit" | "exchange" | "reserve";

const actionLabels: Record<Action, string> = {
  credit: "У кредит",
  exchange: "Обмін",
  reserve: "Резерв",
};

const formatNumber = new Intl.NumberFormat("uk-UA");

export function PrivacyConsent() {
  return <label className="privacy-consent"><input type="checkbox" required /><span>Погоджуюся з <Link href="/privacy" target="_blank" rel="noreferrer">Політикою конфіденційності</Link></span></label>;
}

export function PhoneField({ label = "Телефон" }: { label?: string }) {
  const countries = [
    ["🇺🇦", "Україна", "+380"], ["🇵🇱", "Польща", "+48"], ["🇩🇪", "Німеччина", "+49"], ["🇨🇿", "Чехія", "+420"],
    ["🇸🇰", "Словаччина", "+421"], ["🇷🇴", "Румунія", "+40"], ["🇲🇩", "Молдова", "+373"], ["🇱🇹", "Литва", "+370"],
    ["🇱🇻", "Латвія", "+371"], ["🇪🇪", "Естонія", "+372"], ["🇮🇹", "Італія", "+39"], ["🇪🇸", "Іспанія", "+34"],
    ["🇫🇷", "Франція", "+33"], ["🇬🇧", "Велика Британія", "+44"], ["🇺🇸", "США", "+1"], ["🇨🇦", "Канада", "+1"],
  ] as const;
  const [country, setCountry] = useState<(typeof countries)[number]>(countries[0]);
  const [number, setNumber] = useState("");
  const [touched, setTouched] = useState(false);
  const hasError = touched && number.length !== 9;

  return <label className="phone-field">{label}
    <span className={hasError ? "phone-input-group has-error" : "phone-input-group"}>
      <select name="country" value={country[1]} onChange={(event) => setCountry(countries.find(([, name]) => name === event.target.value) ?? countries[0])} aria-label="Країна">
        {countries.map(([flag, name, code]) => <option key={`${name}-${code}`} value={name}>{flag} {name}</option>)}
      </select>
      <span className="phone-code">{country[2]}</span>
      <input name="phone" type="tel" autoComplete="tel" inputMode="numeric" placeholder="Номер телефону" value={number} maxLength={9} pattern="[0-9]{9}" aria-invalid={hasError || undefined} aria-describedby="phone-error" onChange={(event) => setNumber(event.target.value.replace(/\D/g, "").slice(0, 9))} onBlur={() => setTouched(true)} onInvalid={() => setTouched(true)} required />
    </span>
    {hasError && <span className="phone-error" id="phone-error" role="alert">Має бути рівно 9 цифр</span>}
  </label>;
}

function animateScrollTo(element: HTMLElement) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const headerHeight = document.querySelector<HTMLElement>(".site-header")?.getBoundingClientRect().height ?? 0;
  const subnavHeight = document.querySelector<HTMLElement>(".catalog-subnav")?.getBoundingClientRect().height ?? 0;
  const rect = element.getBoundingClientRect();
  const visibleHeight = window.innerHeight - headerHeight - subnavHeight;
  const destination = Math.max(0, window.scrollY + rect.top + rect.height / 2 - headerHeight - subnavHeight - visibleHeight / 2);

  if (reducedMotion) {
    window.scrollTo(0, destination);
    return;
  }

  const start = window.scrollY;
  const distance = destination - start;
  const duration = 1100;
  const startedAt = performance.now();
  const frame = (now: number) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    window.scrollTo(0, start + distance * eased);
    if (progress < 1) window.requestAnimationFrame(frame);
  };
  window.requestAnimationFrame(frame);
}

export function Footer() {
  return <footer>
    <strong>Avento Motors</strong>
    <span>Продаж автомобілів · кредит · обмін · резерв</span>
    <div className="footer-contacts"><a className="footer-phone" href="tel:+380111111111">+380111111111</a><span className="footer-contact-divider" aria-hidden="true" /><a className="footer-telegram" href="https://t.me/+LMHLw-S4AzA1Y2Ji" target="_blank" rel="noreferrer">@wopgq</a><a className="footer-telegram-icon" href="https://t.me/+LMHLw-S4AzA1Y2Ji" target="_blank" rel="noreferrer" aria-label="Telegram Avento Motors"><img src="/telegram.png" alt="" /></a></div>
    <div className="footer-legal"><Link href="/privacy" target="_blank" rel="noreferrer">Політика конфіденційності</Link><Link href="/payments" target="_blank" rel="noreferrer">Оплата та безпека платежів</Link></div>
    <span>© 2026</span>
  </footer>;
}

const brandImages: Record<string, string> = {
  Audi: "/brands/audi.svg",
  BMW: "/brands/bmw.svg",
  Chevrolet: "/brands/chevrolet.svg",
  Citroën: "/brands/citroen.svg",
  Ford: "/brands/ford.svg",
  Honda: "/brands/honda.svg",
  Hyundai: "/brands/hyundai.svg",
  Infiniti: "/brands/infiniti.svg",
  Kia: "/brands/kia.svg",
  "Land Rover": "/brands/land-rover.svg",
  Lexus: "/brands/lexus.png",
  Mazda: "/brands/mazda.svg",
  "Mercedes-Benz": "/brands/mercedes-benz.svg",
  Mitsubishi: "/brands/mitsubishi.svg",
  Nissan: "/brands/nissan.svg",
  Opel: "/brands/opel.svg",
  Peugeot: "/brands/peugeot.svg",
  Porsche: "/brands/porsche.svg",
  Renault: "/brands/renault.svg",
  Subaru: "/brands/subaru.svg",
  Suzuki: "/brands/suzuki.svg",
  "Škoda": "/brands/skoda.svg",
  Tesla: "/brands/tesla.svg",
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
    <a
      className={compact ? "brand-chip brand-chip-compact" : "brand-chip"}
      href={`/cars?brand=${encodeURIComponent(brand)}`}
      aria-label={`Обрати ${brand}`}
    >
      <BrandMark brand={brand} />
      <span>{brand}</span>
    </a>
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

export function CarCard({ car, onAction }: { car: Car; onAction: (action: Action, car: Car) => void }) {
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
        {car.discount && <s className="car-old-price">{formatNumber.format(car.price + car.discount)} ₴</s>}
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
            <PhoneField />
            {action === "credit" && (
              <div className="credit-fields">
                <label>Перший внесок<input name="deposit" type="number" min="0" placeholder="500 000" required /></label>
                <label>Строк<select name="term" defaultValue="60"><option value="6">6 місяців</option><option value="12">12 місяців</option><option value="24">24 місяців</option><option value="36">36 місяців</option><option value="48">48 місяців</option><option value="60">60 місяців</option></select></label>
              </div>
            )}
            {action === "exchange" && <label>Ваш автомобіль<input name="trade-in-car" placeholder="Марка, модель, рік" required /></label>}
            <PrivacyConsent />
            <button className="submit-button" type="submit">Надіслати заявку</button>
          </form>
        )}
      </div>
    </div>
  );
}

export function Header() {
  const router = useRouter();
  useEffect(() => {
    const handleLegalBack = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a.legal-back");
      if (!link) return;
      event.preventDefault();
      if (window.history.length > 1) router.back();
      else router.push("/");
    };
    document.querySelector<HTMLAnchorElement>("a.legal-back")?.replaceChildren("← Назад");
    document.addEventListener("click", handleLegalBack);
    return () => document.removeEventListener("click", handleLegalBack);
  }, [router]);

  const scrollToAbout = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const about = document.getElementById("about");
    if (!about) {
      window.location.assign("/?scrollTo=about");
      return;
    }
    animateScrollTo(about);
  };

  return (
    <>
      <header className="site-header">
        <Link className="site-logo" href="/" aria-label="Avento Motors — головна">
          <span className="site-logo-mark" aria-hidden="true"><img src="/avento-logo-mark-white.png" alt="" /></span>
          <span className="site-logo-wordmark"><span className="site-logo-avento">AVENTO</span><span>MOTORS</span></span>
        </Link>
        <nav aria-label="Головна навігація">
          <Link href="/cars">Обрати авто</Link>
          <Link href="#about" onClick={scrollToAbout}>Про нас</Link>
        </nav>
      </header>
      <nav className="catalog-subnav" aria-label="Категорії автомобілів">
        <div className="catalog-subnav-inner">
          <Link href="/cars">Усі авто</Link>
          <Link href="/cars?condition=used">З пробігом</Link>
          <Link href="/offers">Спецпропозиції</Link>
          <Link href="/sell">Викуп авто</Link>
        </div>
      </nav>
    </>
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
        <label><span className={minValue ? "range-input-shell has-value" : "range-input-shell"}><span className="range-unit">{unit}</span><input aria-label={`${title}, мінімум`} type="number" min="0" placeholder="Мін." value={minValue ?? ""} onChange={(event) => onMinChange(event.target.value)} /></span></label>
        <label><span className={maxValue ? "range-input-shell has-value" : "range-input-shell"}><span className="range-unit">{unit}</span><input aria-label={`${title}, максимум`} type="number" min="0" placeholder="Макс." value={maxValue ?? ""} onChange={(event) => onMaxChange(event.target.value)} /></span></label>
      </div>
    </div>
  );
}

function YearFilter({ minValue, maxValue, onMinChange, onMaxChange }: { minValue?: number; maxValue?: number; onMinChange: (value: string) => void; onMaxChange: (value: string) => void }) {
  const [open, setOpen] = useState(Boolean(minValue || maxValue));
  const [target, setTarget] = useState<"min" | "max" | null>(null);
  const years = Array.from({ length: 17 }, (_, index) => 2010 + index);
  const summary = minValue && maxValue ? `${minValue} — ${maxValue}` : minValue ? `від ${minValue}` : maxValue ? `до ${maxValue}` : "Будь-який";
  const chooseYear = (value: string) => {
    if (target === "min") onMinChange(value);
    if (target === "max") onMaxChange(value);
    setTarget(null);
  };

  return (
    <div className={open ? "range-filter year-filter is-open" : "range-filter year-filter"}>
      <button type="button" className="range-filter-toggle" onClick={() => setOpen((current) => !current)} aria-expanded={open}><span>Рік</span><span className="range-summary">{summary}</span><span className="range-chevron" aria-hidden="true" /></button>
      <div className="range-dropdown">
        <label><button type="button" className="range-choice-value" onClick={() => setTarget("min")}><span>Мін.</span><span>{minValue ?? "Будь-який"}</span></button></label>
        <label><button type="button" className="range-choice-value" onClick={() => setTarget("max")}><span>Макс.</span><span>{maxValue ?? "Будь-який"}</span></button></label>
        {target && <div className="year-choice-list" aria-label={target === "min" ? "Оберіть мінімальний рік" : "Оберіть максимальний рік"}><button type="button" onClick={() => chooseYear("")}>Будь-який</button>{years.map((year) => <button className={(target === "min" ? minValue : maxValue) === year ? "is-selected" : ""} type="button" key={year} onClick={() => chooseYear(String(year))}>{year}</button>)}</div>}
      </div>
    </div>
  );
}

function BrandFilter({ values, onChange }: { values?: string[]; onChange: (value: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const summary = values?.length ? values.map((brand) => `"${brand}"`).join(", ") : "Усі марки";

  return (
    <div className={open ? "range-filter brand-filter is-open" : "range-filter brand-filter"}>
      <button type="button" className="range-filter-toggle" onClick={() => setOpen((current) => !current)} aria-expanded={open}><span>Марки</span><span className="range-summary">{summary}</span><span className="range-chevron" aria-hidden="true" /></button>
      <div className="range-dropdown brand-choice-list" aria-label="Оберіть марку"><button type="button" className={!values?.length ? "is-selected" : ""} onClick={() => onChange([])}>Усі марки</button>{brands.map((brand) => <button className={values?.includes(brand) ? "is-selected" : ""} type="button" key={brand} onClick={() => onChange(values?.includes(brand) ? values.filter((item) => item !== brand) : [...(values ?? []), brand])}>{brand}</button>)}</div>
    </div>
  );
}

function HomePage({ onAction }: { onAction: (action: Action, car: Car) => void }) {
  const heroSlides = ["/hero/avento-bmw-night.jpg", "/hero/avento-audi-night.jpg", "/hero/avento-range-rover-sunset.jpg"];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || heroSlides.length < 2) return;
    const timer = window.setTimeout(() => setActiveSlide((current) => cycleIndex(current, heroSlides.length, 1)), 4000);
    return () => window.clearTimeout(timer);
  }, [activeSlide, heroSlides.length]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("scrollTo") !== "about") return;
    const frame = window.requestAnimationFrame(() => {
      const about = document.getElementById("about");
      if (about) animateScrollTo(about);
      window.history.replaceState(null, "", "/");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

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

function CarsPage({ initialBrand, initialMaxPrice, initialMinMileage, initialSpecialOffer, specialOffersPage, usedCarsPage, onAction }: Omit<AventoSiteProps, "mode"> & { onAction: (action: Action, car: Car) => void }) {
  const [filters, setFilters] = useState<CarFilters>({ brands: initialBrand ? [initialBrand] : undefined, maxPrice: initialMaxPrice, minMileage: initialMinMileage, specialOffer: initialSpecialOffer });
  const filteredCars = useMemo(() => filterCars(cars, filters), [filters]);

  const setFilter = (name: keyof CarFilters, value: string) => {
    setFilters((current) => ({ ...current, [name]: value ? Number.isNaN(Number(value)) ? value : Number(value) : undefined }));
  };

  const clearFilter = (name: keyof CarFilters) => setFilters((current) => ({ ...current, [name]: undefined }));
  const rangeLabel = (title: string, min?: number, max?: number, unit = "") => {
    const value = (number: number) => unit === "₴" ? `₴${formatNumber.format(number)}` : `${formatNumber.format(number)}${unit ? ` ${unit}` : ""}`;
    if (min && max) return `${title}: ${value(min)}–${value(max)}`;
    if (min) return `${title}: ${value(min)} + більше`;
    if (max) return `${title}: ${value(max)} + нижче`;
    return null;
  };
  const selectedFilters = [
    ...(filters.brands ?? []).map((brand) => ({ key: `brand-${brand}`, label: `"${brand}"`, remove: () => setFilters((current) => ({ ...current, brands: current.brands?.filter((item) => item !== brand) || undefined })) })),
    ...(rangeLabel("Ціна", filters.minPrice, filters.maxPrice, "₴") ? [{ key: "price", label: rangeLabel("Ціна", filters.minPrice, filters.maxPrice, "₴")!, remove: () => { clearFilter("minPrice"); clearFilter("maxPrice"); } }] : []),
    ...(rangeLabel("Рік", filters.minYear, filters.maxYear) ? [{ key: "year", label: rangeLabel("Рік", filters.minYear, filters.maxYear)!, remove: () => { clearFilter("minYear"); clearFilter("maxYear"); } }] : []),
    ...(rangeLabel("Пробіг", filters.minMileage, filters.maxMileage, "км") ? [{ key: "mileage", label: rangeLabel("Пробіг", filters.minMileage, filters.maxMileage, "км")!, remove: () => { clearFilter("minMileage"); clearFilter("maxMileage"); } }] : []),
  ];

  return (
    <div className="choose-page section-shell">
      <Link className="back-button" href="/">← На головну</Link>
      <div className="choose-title"><h1>{specialOffersPage ? "Спецпропозиції" : usedCarsPage ? "Автомобілі з пробігом" : "Обрати авто"}</h1></div>

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
        <BrandFilter values={filters.brands} onChange={(values) => setFilters((current) => ({ ...current, brands: values.length ? values : undefined }))} />
        <RangeFilter title="Ціна" unit="₴" minValue={filters.minPrice} maxValue={filters.maxPrice} onMinChange={(value) => setFilter("minPrice", value)} onMaxChange={(value) => setFilter("maxPrice", value)} />
        <YearFilter minValue={filters.minYear} maxValue={filters.maxYear} onMinChange={(value) => setFilter("minYear", value)} onMaxChange={(value) => setFilter("maxYear", value)} />
        <RangeFilter title="Пробіг" unit="км" minValue={filters.minMileage} maxValue={filters.maxMileage} onMinChange={(value) => setFilter("minMileage", value)} onMaxChange={(value) => setFilter("maxMileage", value)} />
      </section>

      {selectedFilters.length > 0 && <div className="selected-filters" aria-label="Обрані фільтри">{selectedFilters.map((filter) => <button type="button" className="selected-filter-chip" key={filter.key} onClick={filter.remove}><span>{filter.label}</span><span aria-hidden="true">×</span></button>)}</div>}

      <div className="results-heading"><h2>Автомобілі</h2></div>
      <div className="car-list">
        {filteredCars.length ? filteredCars.map((car) => <CarCard key={car.id} car={car} onAction={onAction} />) : <div className="empty-result"><p>{specialOffersPage ? "Тут поки що нічого немає." : "За цими параметрами автомобілів немає."}</p>{!specialOffersPage && <button onClick={() => setFilters({})}>Скинути фільтри</button>}</div>}
      </div>
    </div>
  );
}

export function AventoSite({ mode, initialBrand, initialMaxPrice, initialMinMileage, initialSpecialOffer, specialOffersPage, usedCarsPage }: AventoSiteProps) {
  const [request, setRequest] = useState<{ action: Action; car: Car } | null>(null);

  return (
    <div className="site-frame">
      <Header />
      <main>{mode === "home" ? <HomePage onAction={(action, car) => setRequest({ action, car })} /> : <CarsPage key={`cars-${specialOffersPage}-${usedCarsPage}`} initialBrand={initialBrand} initialMaxPrice={initialMaxPrice} initialMinMileage={initialMinMileage} initialSpecialOffer={initialSpecialOffer} specialOffersPage={specialOffersPage} usedCarsPage={usedCarsPage} onAction={(action, car) => setRequest({ action, car })} />}</main>
      <Footer />
      {request && <RequestModal action={request.action} car={request.car} onClose={() => setRequest(null)} />}
    </div>
  );
}
