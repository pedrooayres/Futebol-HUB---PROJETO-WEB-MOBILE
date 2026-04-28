"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { favoriteCollections } from "@/lib/football-data";
import { buildFavoriteCollectionsFromScouting } from "@/lib/report-utils";

export default function FavoritesWorkspace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/scouting")
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setItems(data.items || []);
        }
      })
      .catch(() => {
        if (active) {
          setItems([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const liveCollections = useMemo(() => buildFavoriteCollectionsFromScouting(items), [items]);
  const collections = liveCollections.length > 0 ? [...liveCollections, ...favoriteCollections] : favoriteCollections;

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Curadoria operacional</span>
          <h1>Favoritos conectados ao scouting</h1>
          <p>
            O modulo agora usa a base real do CRUD para montar shortlist, fila de observacao e radar
            de clubes sem perder os perfis detalhados do portal.
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{loading ? "..." : items.length}</strong>
            <span>Relatorios reais</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{collections.length}</strong>
            <span>Colecoes ativas</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{items.filter((item) => item.isFavorite).length}</strong>
            <span>Favoritos marcados</span>
          </article>
        </div>
      </section>

      <section className="card-grid">
        {collections.map((item) => (
          <article key={`${item.slug}-${item.title}`} className="glass-panel favorite-card favorite-full-card">
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
              <div>
                <span className="detail-label">Responsavel</span>
                <strong>{item.owner}</strong>
              </div>
              <div>
                <span className="detail-label">Proxima acao</span>
                <strong>{item.nextAction}</strong>
              </div>
            </div>

            <ul className="feature-list">
              {item.items.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>

            <div className="report-link-list">
              {item.relatedProfiles?.map((profile) => (
                <Link key={profile} href={profile} className="inline-link">
                  Abrir perfil relacionado
                </Link>
              ))}
            </div>

            <Link href="/scouting" className="inline-link">
              Ir para a mesa de scouting
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
