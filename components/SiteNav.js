"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import GlobalSearch from "@/components/GlobalSearch";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/times", label: "Times" },
  { href: "/jogadores", label: "Jogadores" },
  { href: "/monitorados", label: "Monitorados" },
  { href: "/ranking", label: "Ranking" }
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand-mark">
          <span className="brand-ball">F</span>
          <div>
            <strong>Futebol HUB Pro</strong>
            <span>Monitoramento de futebol</span>
          </div>
        </Link>

        <nav className="main-nav" aria-label="Principal">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <GlobalSearch />
      </div>
    </header>
  );
}
