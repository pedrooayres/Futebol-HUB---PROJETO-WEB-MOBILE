"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAccess } from "@/components/AccessProvider";
import GlobalSearch from "@/components/GlobalSearch";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/times", label: "Times" },
  { href: "/jogadores", label: "Jogadores" },
  { href: "/ranking", label: "Ranking" },
  { href: "/relatorios", label: "Relatorios" },
  { href: "/scouting", label: "Scouting" }
];

export default function SiteNav() {
  const pathname = usePathname();
  const { role, ready, logoutRole, reopenSelector } = useAccess();
  const modeLabel =
    role === "common" ? "Usuario padrao" : role === "professional" ? "Profissional" : "Admin";

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand-mark">
          <span className="brand-ball">F</span>
          <div>
            <strong>Futebol HUB Pro</strong>
            <span>Inteligencia esportiva e scouting</span>
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

        {ready && role ? (
          <div className="nav-session-actions">
            <button type="button" className="ghost-button access-switcher" onClick={reopenSelector}>
              {modeLabel}
            </button>
            <button type="button" className="ghost-button access-switcher" onClick={logoutRole}>
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
