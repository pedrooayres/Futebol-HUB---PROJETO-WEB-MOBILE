import Link from "next/link";

import { favoriteCollections } from "@/lib/football-data";

export default function FavoritesPage() {
  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Curadoria</span>
          <h1>Favoritos</h1>
          <p>
            Uma pagina inspirada no modelo de portal, usada para apresentar colecoes especiais e
            caminhos de navegacao para o restante do sistema.
          </p>
        </div>
      </section>

      <section className="card-grid">
        {favoriteCollections.map((item) => (
          <article key={item.title} className="glass-panel favorite-card">
            <p className="panel-tag">Colecao</p>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
            <Link href="/scouting" className="inline-link">
              Ir para a central de scouting
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
