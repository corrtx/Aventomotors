"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import type { Car } from "@/lib/catalog";
import { getGalleryLayout } from "@/lib/catalog";

type GalleryTileProps = {
  car: Car;
  image: string;
  index: number;
  onOpen: (index: number) => void;
  remaining?: number;
};

function GalleryTile({ car, image, index, onOpen, remaining }: GalleryTileProps) {
  return (
    <button className={`gallery-tile gallery-tile-${index + 1}`} onClick={() => onOpen(index)}>
      <img src={image} alt={`${car.brand} ${car.model}, фото ${index + 1}`} />
      {remaining ? <span className="gallery-more">+{remaining}</span> : null}
    </button>
  );
}

export function CarGallery({ car, compact = false }: { car: Car; compact?: boolean }) {
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [displayedImage, setDisplayedImage] = useState(0);
  const layout = getGalleryLayout(car.gallery);
  const shownImages = car.gallery.slice(0, 4);
  const remaining = car.gallery.length - 4;

  useEffect(() => {
    if (activeImage === null) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveImage(null);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [activeImage]);

  const goTo = (offset: number) => {
    setActiveImage((current) => {
      if (current === null) return current;
      return (current + offset + car.gallery.length) % car.gallery.length;
    });
  };

  const show = (offset: number) => setDisplayedImage((current) => (current + offset + car.gallery.length) % car.gallery.length);

  if (compact) {
    return (
      <>
        <section className="detail-gallery detail-gallery-single" aria-label={`Фотографії ${car.brand} ${car.model}`}>
          <button className="gallery-tile" onClick={() => setActiveImage(displayedImage)}><img src={car.gallery[displayedImage]} alt={`${car.brand} ${car.model}, фото ${displayedImage + 1}`} /></button>
          {car.gallery.length > 1 && <><button className="gallery-switch gallery-switch-prev" onClick={() => show(-1)} aria-label="Попереднє фото"><span aria-hidden="true">‹</span></button><button className="gallery-switch gallery-switch-next" onClick={() => show(1)} aria-label="Наступне фото"><span aria-hidden="true">›</span></button></>}
        </section>
        {activeImage !== null && <GalleryViewer car={car} activeImage={activeImage} onClose={() => setActiveImage(null)} onMove={goTo} />}
      </>
    );
  }

  if (layout === "two") {
    return (
      <>
        <section className="detail-gallery detail-gallery-two" aria-label={`Фотографії ${car.brand} ${car.model}`}>
          {shownImages.map((image, index) => <GalleryTile key={image} car={car} image={image} index={index} onOpen={setActiveImage} />)}
        </section>
        {activeImage !== null && <GalleryViewer car={car} activeImage={activeImage} onClose={() => setActiveImage(null)} onMove={goTo} />}
      </>
    );
  }

  return (
    <>
      <section className={`detail-gallery detail-gallery-${layout}`} aria-label={`Фотографії ${car.brand} ${car.model}`}>
        <GalleryTile car={car} image={shownImages[0]} index={0} onOpen={setActiveImage} />
        <div className="gallery-side">
          <GalleryTile car={car} image={shownImages[1]} index={1} onOpen={setActiveImage} />
          <div className="gallery-lower-row">
            {shownImages.slice(2).map((image, index) => (
              <GalleryTile
                key={image}
                car={car}
                image={image}
                index={index + 2}
                onOpen={setActiveImage}
                remaining={index === 1 && remaining > 0 ? remaining : undefined}
              />
            ))}
          </div>
        </div>
      </section>
      {activeImage !== null && <GalleryViewer car={car} activeImage={activeImage} onClose={() => setActiveImage(null)} onMove={goTo} />}
    </>
  );
}

function GalleryViewer({ car, activeImage, onClose, onMove }: { car: Car; activeImage: number; onClose: () => void; onMove: (offset: number) => void }) {
  return (
    <div className="gallery-viewer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="gallery-viewer" role="dialog" aria-modal="true" aria-label={`Фотографії ${car.brand} ${car.model}`}>
        <button className="gallery-viewer-close" onClick={onClose} aria-label="Закрити фотографії">×</button>
        <img src={car.gallery[activeImage]} alt={`${car.brand} ${car.model}, фото ${activeImage + 1}`} />
        <div className="gallery-viewer-controls">
          <button onClick={() => onMove(-1)}>← Попереднє</button>
          <span>{activeImage + 1} / {car.gallery.length}</span>
          <button onClick={() => onMove(1)}>Наступне →</button>
        </div>
      </div>
    </div>
  );
}
