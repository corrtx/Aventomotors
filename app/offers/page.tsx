import type { Metadata } from "next";
import { AventoSite } from "@/app/components/AventoSite";

export const metadata: Metadata = {
  title: "Спецпропозиції — Avento Motors",
  description: "Спеціальні пропозиції Avento Motors.",
};

export default function OffersPage() {
  return <AventoSite mode="cars" initialSpecialOffer specialOffersPage />;
}
