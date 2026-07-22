import type { Metadata } from "next";
import { AventoSite } from "../components/AventoSite";

export const metadata: Metadata = {
  title: "Обрати авто — Avento Motors",
  description: "Оберіть марку та параметри автомобіля.",
};

type CarsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams;
  const initialBrand =
    typeof params.brand === "string" ? params.brand : undefined;
  const initialMaxPrice =
    typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined;

  return (
    <AventoSite
      mode="cars"
      initialBrand={initialBrand}
      initialMaxPrice={initialMaxPrice}
    />
  );
}
