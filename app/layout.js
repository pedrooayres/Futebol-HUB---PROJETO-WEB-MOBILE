import "./globals.css";
import { AccessProvider } from "@/components/AccessProvider";
import AccessSelector from "@/components/AccessSelector";
import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Futebol HUB Pro",
  description: "Plataforma de inteligencia esportiva, scouting, dados externos e CRUD integrado ao Back4App."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AccessProvider>
          <SiteNav />
          <AccessSelector />
          {children}
        </AccessProvider>
      </body>
    </html>
  );
}
