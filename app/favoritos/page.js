import Link from "next/link";

import { favoriteCollections } from "@/lib/football-data";

export default function FavoritesPage() {
  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Curadoria</span>
          <h1>Modo full dos favoritos</h1>
          <p>
            Collections com prioridade, objetivo e listas acionaveis para transformar favoritos em
            um modulo util de curadoria e tomada de decisao.
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{favoriteCollections.length}</strong>
            <span>Colecoes</span>
          </article>
          <article className="mini-kpi-card">
            <strong>3</strong>
            <span>Itens por colecao</span>
          </article>
          <article className="mini-kpi-card">
            <strong>Scout</strong>
            <span>Destino principal</span>
          </article>
        </div>
      </section>

      <section className="card-grid">
        {favoriteCollections.map((item) => (
          <article key={item.title} className="glass-panel favorite-card favorite-full-card">
            <div className="section-heading">
              <div>
                <p className="panel-tag">Colecao</p>
                <h2>{item.title}</h2>
              </div>
              <span className="badge accent">{item.priority}</span>
            </div>

            <p>{item.text}</p>
            <div className="divider-line" />

            <div className="team-info-grid">
              <div>
                <span className="detail-label">Objetivo</span>
                <strong>{item.objective}</strong>
              </div>
            </div>

            <ul className="feature-list">
              {item.items.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>

            <Link href="/scouting" className="inline-link">
              Ir para a central de scouting
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
