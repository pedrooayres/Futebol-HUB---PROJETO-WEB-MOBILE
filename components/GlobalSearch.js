"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [counts, setCounts] = useState(buildCounts());
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("Todos");
  const deferredQuery = useDeferredValue(query);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!deferredQuery.trim()) {
      setResults([]);
      setCounts(buildCounts());
      setGroups([]);
      return;
    }

    let active = true;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(deferredQuery)}&limit=12`)
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
  }, [deferredQuery]);

  useEffect(() => {
    setQuery("");
    setResults([]);
    setCounts(buildCounts());
    setGroups([]);
    setActiveType("Todos");
  }, [pathname]);

  const groupedResults = useMemo(
    () => (activeType === "Todos" ? groups : buildGroups(results.filter((item) => item.type === activeType))),
    [activeType, groups, results]
  );

  const visibleResultsCount = useMemo(
    () => groupedResults.reduce((total, group) => total + group.results.length, 0),
    [groupedResults]
  );

  function handleSubmit(event) {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="global-search-shell">
      <form onSubmit={handleSubmit} className="global-search-form">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar time, jogador ou competicao"
          aria-label="Buscar time, jogador ou competicao"
        />
        <button type="submit" className="ghost-button">
          Buscar
        </button>
      </form>

      {query.trim() ? (
        <div className="global-search-results">
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

          {loading ? <p>Buscando...</p> : null}
          {!loading && visibleResultsCount === 0 ? <p>Nenhum resultado encontrado.</p> : null}
          {!loading
            ? groupedResults.map((group) => (
                <div key={group.type} className="global-search-group">
                  <p>
                    {group.type} <span>{group.results.length}</span>
                  </p>
                  {group.results.map((item) => (
                    <Link key={item.id} href={item.href} className="global-search-result">
                      <div className="result-badge-row">
                        <span className="badge accent">{item.type}</span>
                        <span className="badge">{item.source || "Base local"}</span>
                      </div>
                      <strong>{item.title}</strong>
                      <small>{item.subtitle}</small>
                      <p>{item.description}</p>
                    </Link>
                  ))}
                </div>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}
