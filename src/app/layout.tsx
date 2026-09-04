import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InLegado - Plataforma de Qualificação Comercial & Quizzes de Alta Conversão",
  description: "Crie quizzes conversacionais ultra rápidos e qualificados para suas campanhas de tráfego pago.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-[#0b0e14] text-slate-100 antialiased selection:bg-amber-500/20 selection:text-amber-300">
        {children}
      </body>
    </html>
  );
}
