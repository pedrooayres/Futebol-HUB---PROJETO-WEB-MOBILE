"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getMonitoredItems } from "@/components/MonitorButton";

const TYPE_LABELS = {
  team: "Time",
  player: "Jogador",
  competition: "Competicao"
};

export default function MonitoradosWorkspace() {
  const [items, setItems] = useState([]);
  const [typeFilter, setTypeFilter] = useState("Todos");

  useEffect(() => {
    function refreshItems() {
      setItems(getMonitoredItems());
    }

    refreshItems();
    window.addEventListener("monitorados-updated", refreshItems);
    window.addEventListener("storage", refreshItems);

    return () => {
      window.removeEventListener("monitorados-updated", refreshItems);
      window.removeEventListener("storage", refreshItems);
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (typeFilter === "Todos") {
      return items;
    }

    return items.filter((item) => TYPE_LABELS[item.type] === typeFilter);
  }, [items, typeFilter]);

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Meu radar</span>
          <h1>Monitorados</h1>
          <p>
            Salve times e jogadores para voltar rapido aos perfis que voce acompanha. Por enquanto, essa lista fica
            guardada no seu navegador.
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{items.length}</strong>
            <span>Itens salvos</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{items.filter((item) => item.type === "team").length}</strong>
            <span>Times</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{items.filter((item) => item.type === "player").length}</strong>
            <span>Jogadores</span>
          </article>
        </div>
      </section>

      <section className="glass-panel filter-panel">
        <div className="scout-toolbar two-columns">
          <label>
            Tipo
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option>Todos</option>
              <option>Time</option>
              <option>Jogador</option>
              <option>Competicao</option>
            </select>
          </label>

          <label>
            Status
            <input value={`${filteredItems.length} item(ns) na lista atual`} readOnly />
          </label>
        </div>
      </section>

      <section className="report-index-grid">
        {filteredItems.map((item) => (
          <article key={`${item.type}-${item.id}`} className="glass-panel report-index-card">
            <div className="section-heading">
              <div>
                <p className="panel-tag">{TYPE_LABELS[item.type] || "Item"}</p>
                <h2>{item.title}</h2>
              </div>
              <span className="badge accent">{item.meta || "Monitorado"}</span>
            </div>

            <p>{item.description}</p>

            <Link href={item.href} className="inline-link">
              Abrir perfil
            </Link>
          </article>
        ))}

        {filteredItems.length === 0 ? (
          <article className="glass-panel report-index-card">
            <p className="panel-tag">Lista vazia</p>
            <h2>Nenhum item monitorado ainda</h2>
            <p>Abra a tela de times ou jogadores e marque os perfis que voce quer acompanhar.</p>
            <div className="report-link-list">
              <Link href="/times" className="inline-link">
                Ver times
              </Link>
              <Link href="/jogadores" className="inline-link">
                Ver jogadores
              </Link>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
