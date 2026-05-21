"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const TYPE_FILTERS = ["Todos", "Time", "Jogador", "Competicao"];

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("Todos");
  const deferredQuery = useDeferredValue(query);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!deferredQuery.trim()) {
      setResults([]);
      return;
    }

    let active = true;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(deferredQuery)}&limit=10`)
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
  }, [deferredQuery]);

  useEffect(() => {
    setQuery("");
    setResults([]);
    setActiveType("Todos");
  }, [pathname]);

  const groupedResults = useMemo(() => {
    const visibleResults =
      activeType === "Todos" ? results : results.filter((item) => item.type === activeType);

    return visibleResults.reduce((groups, item) => {
      const group = item.type || "Outros";
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  }, [activeType, results]);

  const visibleResultsCount = useMemo(
    () => Object.values(groupedResults).reduce((total, items) => total + items.length, 0),
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
                {type}
              </button>
            ))}
          </div>

          {loading ? <p>Buscando...</p> : null}
          {!loading && visibleResultsCount === 0 ? <p>Nenhum resultado encontrado.</p> : null}
          {!loading
            ? Object.entries(groupedResults).map(([group, items]) => (
                <div key={group} className="global-search-group">
                  <p>{group}</p>
                  {items.map((item) => (
                    <Link key={item.id} href={item.href} className="global-search-result">
                      <div className="result-badge-row">
                        <span className="badge accent">{item.type}</span>
                        <span className="badge">{item.source}</span>
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
