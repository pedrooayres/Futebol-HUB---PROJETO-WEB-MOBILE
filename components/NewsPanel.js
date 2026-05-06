"use client";

import { useEffect, useState } from "react";

export default function NewsPanel({ query, title = "Noticias", country = "br", lang = "pt" }) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadNews() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/news?q=${encodeURIComponent(query)}&country=${encodeURIComponent(country)}&lang=${encodeURIComponent(lang)}&max=5`
        );
        const data = await response.json();

        if (!active) {
          return;
        }

        setPayload(data);
        if (data.message) {
          setError(data.message);
        }
      } catch (_error) {
        if (active) {
          setError("Falha ao carregar noticias.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadNews();

    return () => {
      active = false;
    };
  }, [query, country, lang]);

  const articles = payload?.articles || [];

  return (
    <article className="glass-panel">
      <div className="section-heading">
        <div>
          <p className="panel-tag">Noticias</p>
          <h2>{title}</h2>
        </div>
        <span className="badge">{payload?.configured === false ? "Nao configurada" : "GNews"}</span>
      </div>

      {loading ? <p>Carregando noticias...</p> : null}
      {!loading && error ? <p className="warning">{error}</p> : null}

      {!loading && articles.length > 0 ? (
        <div className="note-list">
          {articles.map((item) => (
            <article key={item.id} className="note-card">
              <div className="note-header">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description || item.source}</p>
                </div>
                <span className="status-pill">{item.source || "Fonte"}</span>
              </div>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer" className="inline-link">
                  Abrir noticia
                </a>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </article>
  );
}
