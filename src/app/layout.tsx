import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Historias de Éxito | T1",
  description:
    "Descubre cómo empresas de todos los tamaños transforman sus operaciones de comercio con T1.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
