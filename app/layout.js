import "./globals.css";
import { AccessProvider } from "@/components/AccessProvider";
import { EntityOverridesProvider } from "@/components/EntityOverridesProvider";
import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Futebol HUB Pro",
  description: "Plataforma de monitoramento esportivo para times, jogadores, competições e notícias."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AccessProvider>
          <EntityOverridesProvider>
            <SiteNav />
            {children}
          </EntityOverridesProvider>
        </AccessProvider>
      </body>
    </html>
  );
}
