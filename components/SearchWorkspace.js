"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchWorkspace() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    let active = true;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(query)}&limit=24`)
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setResults(data.results || []);
        }
      })
      .catch(() => {
        if (active) {
          setResults([]);
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
  }, [query]);

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Busca global</span>
          <h1>Resultados integrados</h1>
          <p>
            Times, atletas, colecoes e relatorios reais na mesma camada de consulta para acelerar a
            navegacao profissional.
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{query ? `"${query}"` : "--"}</strong>
            <span>Termo buscado</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{loading ? "..." : results.length}</strong>
            <span>Resultados</span>
          </article>
          <article className="mini-kpi-card">
            <strong>Unificado</strong>
            <span>Indice ativo</span>
          </article>
        </div>
      </section>

      <section className="card-grid">
        {loading ? <p>Buscando dados...</p> : null}
        {!loading && !query ? <p>Use a busca do topo para consultar clubes, atletas e relatorios.</p> : null}
        {!loading && query && results.length === 0 ? <p>Nenhum resultado encontrado para essa pesquisa.</p> : null}
        {!loading
          ? results.map((item) => (
              <article key={item.id} className="glass-panel report-index-card">
                <div className="section-heading">
                  <div>
                    <p className="panel-tag">{item.type}</p>
                    <h2>{item.title}</h2>
                  </div>
                  <div className="result-badge-row">
                    <span className="badge">{item.source}</span>
                    <span className="badge">{item.subtitle}</span>
                  </div>
                </div>

                <p>{item.description}</p>
                <Link href={item.href} className="inline-link">
                  Abrir resultado
                </Link>
              </article>
            ))
          : null}
      </section>
    </main>
  );
}
