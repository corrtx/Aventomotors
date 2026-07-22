import type { Metadata } from "next";
import { AventoSite } from "./components/AventoSite";

export const metadata: Metadata = {
  title: "Avento Motors",
  description: "Автомобілі, кредит, обмін і резерв від Avento Motors.",
};

export default function Home() {
  return <AventoSite mode="home" />;
}
