import "./globals.css";
import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Futebol HUB",
  description: "Plataforma de scouting com dashboard, dados externos e CRUD integrado ao Back4App."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
