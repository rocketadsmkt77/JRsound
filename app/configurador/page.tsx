import type { Metadata } from "next";
import Configurator from "@/components/configurator/Configurator";

export const metadata: Metadata = {
  title: "Configurador 3D | JR Sound — Som e Acessórios",
  description:
    "Monte sua caixa de som personalizada em 3D: formato, medidas, falantes, acabamento e orçamento em tempo real.",
};

export default function ConfiguradorPage() {
  return <Configurator />;
}
