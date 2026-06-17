"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const TYPE_FILTERS = ["Todos", "Time", "Jogador", "Competicao"];
const TYPE_ORDER = ["Time", "Jogador", "Competicao"];

function buildCounts(results = []) {
  return TYPE_FILTERS.reduce((counts, type) => {
    counts[type] = type === "Todos" ? results.length : results.filter((item) => item.type === type).length;
    return counts;
  }, {});
}

function buildGroups(results = []) {
  return TYPE_ORDER.map((type) => ({
    type,
    results: results.filter((item) => item.type === type)
  })).filter((group) => group.results.length > 0);
}

export default function SearchWorkspace() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [counts, setCounts] = useState(buildCounts());
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("Todos");

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setCounts(buildCounts());
      setGroups([]);
      return;
    }

    let active = true;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(query)}&limit=24`)
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          const nextResults = data.results || [];
          setResults(nextResults);
          setCounts(data.counts || buildCounts(nextResults));
          setGroups(data.groups || buildGroups(nextResults));
        }
      })
      .catch(() => {
        if (active) {
          setResults([]);
          setCounts(buildCounts());
          setGroups([]);
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

  const groupedResults = useMemo(
    () => (activeType === "Todos" ? groups : buildGroups(results.filter((item) => item.type === activeType))),
    [activeType, groups, results]
  );

  const visibleResultsCount = useMemo(
    () => groupedResults.reduce((total, group) => total + group.results.length, 0),
    [groupedResults]
  );

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Busca global</span>
          <h1>Resultados integrados</h1>
          <p>
            Times, jogadores e competicoes na mesma camada de consulta para acelerar a navegacao do monitoramento.
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
            <span>Busca ativa</span>
          </article>
        </div>
      </section>

      {query ? (
        <section className="glass-panel filter-panel">
          <div className="global-search-type-row">
            {TYPE_FILTERS.map((type) => (
              <button
                key={type}
                type="button"
                className={`search-type-chip ${activeType === type ? "active" : ""}`}
                onClick={() => setActiveType(type)}
              >
                {type} <span>{counts[type] || 0}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="search-results-stack">
        {loading ? <p>Buscando dados...</p> : null}
        {!loading && !query ? <p>Use a busca do topo para consultar times, jogadores e competicoes.</p> : null}
        {!loading && query && visibleResultsCount === 0 ? <p>Nenhum resultado encontrado para essa pesquisa.</p> : null}
        {!loading
          ? groupedResults.map((group) => (
              <section key={group.type} className="search-result-section">
                <div className="section-heading">
                  <div>
                    <p className="panel-tag">Resultados</p>
                    <h2>{group.type}</h2>
                  </div>
                  <span className="badge">{group.results.length}</span>
                </div>

                <div className="report-index-grid">
                  {group.results.map((item) => (
                    <article key={item.id} className="glass-panel report-index-card">
                      <div className="section-heading">
                        <div>
                          <p className="panel-tag">{item.type}</p>
                          <h2>{item.title}</h2>
                        </div>
                        <div className="result-badge-row">
                          <span className="badge accent">{item.type}</span>
                          <span className="badge">{item.source || "Base local"}</span>
                        </div>
                      </div>

                      <p>{item.description}</p>
                      <div className="report-link-list">
                        <span className="badge">{item.subtitle}</span>
                        <Link href={item.href} className="inline-link">
                          Abrir resultado
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          : null}
      </section>
    </main>
  );
}
