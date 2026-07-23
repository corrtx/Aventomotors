import type { Metadata } from "next";
import { SellCarPage } from "@/app/components/SellCarPage";

export const metadata: Metadata = {
  title: "Викуп авто — Avento Motors",
  description: "Оцінка та викуп автомобіля від Avento Motors.",
};

export default function SellPage() {
  return <SellCarPage />;
}
