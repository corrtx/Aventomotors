import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CarDetailPage } from "@/app/components/CarDetailPage";
import { cars, getCarById } from "@/lib/catalog";

type CarPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return cars.map((car) => ({ id: car.id }));
}

export async function generateMetadata({ params }: CarPageProps): Promise<Metadata> {
  const car = getCarById((await params).id);

  if (!car) return {};

  return {
    title: `${car.brand} ${car.model} — Avento Motors`,
    description: `${car.year} рік, ${car.engine.toFixed(1)} л, ${car.drive.toLowerCase()} привід. Ціна від ${car.price.toLocaleString("uk-UA")} ₴.`,
  };
}

export default async function CarPage({ params }: CarPageProps) {
  const car = getCarById((await params).id);

  if (!car) notFound();

  return <CarDetailPage car={car} />;
}
