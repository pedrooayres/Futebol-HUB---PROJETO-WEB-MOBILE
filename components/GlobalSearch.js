"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
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

    fetch(`/api/search?q=${encodeURIComponent(deferredQuery)}&limit=6`)
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
  }, [pathname]);

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
          placeholder="Buscar clube, atleta ou relatorio"
          aria-label="Buscar clube, atleta ou relatorio"
        />
        <button type="submit" className="ghost-button">
          Buscar
        </button>
      </form>

      {query.trim() ? (
        <div className="global-search-results">
          {loading ? <p>Buscando...</p> : null}
          {!loading && results.length === 0 ? <p>Nenhum resultado encontrado.</p> : null}
          {!loading
            ? results.map((item) => (
                <Link key={item.id} href={item.href} className="global-search-result">
                  <div className="result-badge-row">
                    <span className="badge">{item.type}</span>
                    <span className="badge">{item.source}</span>
                  </div>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                  <p>{item.description}</p>
                </Link>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}
