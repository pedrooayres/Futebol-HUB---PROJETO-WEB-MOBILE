"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useAccess } from "@/components/AccessProvider";
import NewsPanel from "@/components/NewsPanel";
import StandingsPreview from "@/components/StandingsPreview";

const coreModules = [
  {
    label: "Times",
    title: "Monitoramento de clubes",
    text: "Acompanhe contexto competitivo, rankings, notícias e leitura recente dos principais times."
  },
  {
    label: "Jogadores",
    title: "Radar de atletas",
    text: "Consulte perfis, notícias e sinais de desempenho sem depender de notas manuais."
  },
  {
    label: "Competições",
    title: "Ranking e tabelas",
    text: "Veja ligas, copas, fases e tabelas em uma experiência direta para acompanhamento diário."
  }
];

const workflowSteps = [
  "Escolha um time, jogador ou competição",
  "Veja a situação atual com dados e notícias",
  "Compare contexto competitivo no ranking",
  "Volte aos favoritos para acompanhar a evolução"
];

const useCases = [
  "Torcedores que acompanham muitos campeonatos",
  "Criadores de conteúdo esportivo",
  "Apostadores que querem contexto público",
  "Usuários que querem centralizar notícias e tabelas"
];

export default function HomeDashboard() {
  const { isAdmin } = useAccess();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backStatus, setBackStatus] = useState("");
  const [footballStatus, setFootballStatus] = useState(null);

  useEffect(() => {
    async function loadItems() {
      setLoading(true);

      try {
        const response = await fetch("/api/scouting");
        const data = await response.json();

        setItems(data.items || []);
        setBackStatus(data.message || "");
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  useEffect(() => {
    async function loadFootballStatus() {
      try {
        const response = await fetch("/api/football/status");
        const data = await response.json();
        setFootballStatus(data);
      } catch (_error) {
        setFootballStatus(null);
      }
    }

    loadFootballStatus();
  }, []);

  const kpis = useMemo(() => {
    return [
      { label: "Jogadores monitorados", value: String(items.length).padStart(2, "0") },
      { label: "Competições mapeadas", value: footballStatus?.liveScoreStandingsCompetitions?.length || "--" },
      { label: "Fonte live", value: footballStatus?.liveScoreConfigured ? "ON" : "OFF" }
    ];
  }, [footballStatus, items]);

  const recentItems = useMemo(() => items.slice(0, 4), [items]);

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Futebol HUB Pro</span>
          <h1>Monitoramento de futebol em um único painel.</h1>
          <p>
            Acompanhe times, jogadores, competições, notícias e rankings sem transformar a experiência
            em uma base manual de scouting.
          </p>

          <div className="hero-actions">
            <Link href="/ranking" className="primary-button">
              Ver rankings
            </Link>
            <Link href="/jogadores" className="ghost-button">
              Monitorar jogadores
            </Link>
          </div>

          <div className="hero-focus-row" aria-label="Resumo operacional">
            <span>Times</span>
            <span>Jogadores</span>
            <span>Ranking</span>
            <span>Notícias</span>
          </div>
        </div>

        <aside className="hero-card">
          <div className="pitch-visual" aria-hidden="true">
            <span className="pitch-line pitch-line-mid" />
            <span className="pitch-circle" />
            <span className="pitch-dot pitch-dot-one" />
            <span className="pitch-dot pitch-dot-two" />
            <span className="pitch-dot pitch-dot-three" />
          </div>
          <p className="card-label">Visão geral</p>
          <div className="metric-stack">
            {kpis.map((item) => (
              <div key={item.label} className="metric-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          {backStatus ? <p className="warning">{backStatus}</p> : null}
        </aside>
      </section>

      <section className="triple-grid">
        {coreModules.map((item) => (
          <article key={item.title} className="glass-panel summary-card">
            <p className="panel-tag">{item.label}</p>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="professional-grid">
        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Fluxo de uso</p>
              <h2>Como acompanhar no dia a dia</h2>
            </div>
          </div>

          <div className="workflow-list">
            {workflowSteps.map((item, index) => (
              <div key={item} className="workflow-row">
                <span className="standing-index">{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Aplicação</p>
              <h2>Feito para o usuário final</h2>
            </div>
          </div>

          <div className="use-case-grid compact-grid">
            {useCases.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <p className="warning">
            {footballStatus?.configured
              ? "Fontes externas conectadas para enriquecer rankings, perfis e notícias."
              : "Dados ao vivo temporariamente indisponíveis. O painel segue funcionando com a base local."}
          </p>
        </article>
      </section>

      <section className="professional-grid">
        <StandingsPreview title="Panorama competitivo" limit={6} />

        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Base recente</p>
              <h2>Jogadores acompanhados</h2>
            </div>
            <span className="badge">{recentItems.length} itens</span>
          </div>

          <div className="note-list">
            {loading ? <p>Carregando registros...</p> : null}

            {recentItems.map((item) => (
              <article key={item.objectId} className="note-card">
                <div className="note-header">
                  <div>
                    <h3>{item.playerName}</h3>
                    <p>
                      {item.club} | {item.position}
                    </p>
                  </div>
                  <span className={`status-pill ${item.status?.toLowerCase().replaceAll(" ", "-")}`}>
                    {item.status}
                  </span>
                </div>
                <p className="note-meta">Registro interno de acompanhamento.</p>
              </article>
            ))}

            {!loading && recentItems.length === 0 ? (
              <p>Nenhum jogador interno cadastrado. A área pública segue funcionando com perfis e dados externos.</p>
            ) : null}
          </div>

          {isAdmin ? (
            <Link href="/scouting" className="inline-link">
              Abrir área interna
            </Link>
          ) : null}
        </article>
      </section>

      <section className="professional-grid">
        <NewsPanel query="futebol OR football transfers OR champions league OR brasileirao" title="Radar de notícias do futebol" />

        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Cobertura</p>
              <h2>Camada multi-API</h2>
            </div>
          </div>
          <ul className="feature-list">
            <li>API-Football para competições, tabelas, jogos, times e jogadores.</li>
            <li>GNews para notícias de clubes, ligas, atletas e mercado.</li>
            <li>Base interna fica reservada para manutenção, sem aparecer como fluxo principal.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
