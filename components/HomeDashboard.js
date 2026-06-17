"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import NewsPanel from "@/components/NewsPanel";
import StandingsPreview from "@/components/StandingsPreview";

const coreModules = [
  {
    label: "Times",
    title: "Monitoramento de clubes",
    text: "Acompanhe contexto competitivo, rankings, noticias e leitura recente dos principais times."
  },
  {
    label: "Jogadores",
    title: "Monitoramento de atletas",
    text: "Consulte perfis, noticias, clube atual, funcao e sinais publicos de desempenho."
  },
  {
    label: "Competicoes",
    title: "Ranking e tabelas",
    text: "Veja ligas, copas, fases e tabelas em uma experiencia direta para acompanhamento diario."
  }
];

const workflowSteps = [
  "Escolha um time, jogador ou competicao",
  "Veja a situacao atual com dados e noticias",
  "Compare contexto competitivo no ranking",
  "Salve nos monitorados para acompanhar depois"
];

const useCases = [
  "Torcedores que acompanham muitos campeonatos",
  "Criadores de conteudo esportivo",
  "Apostadores que querem contexto publico",
  "Usuarios que querem centralizar noticias e tabelas"
];

export default function HomeDashboard() {
  const [footballStatus, setFootballStatus] = useState(null);

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
      { label: "Area de acompanhamento", value: "ON" },
      { label: "Competicoes mapeadas", value: footballStatus?.liveScoreStandingsCompetitions?.length || "--" },
      { label: "Fonte live", value: footballStatus?.liveScoreConfigured ? "ON" : "OFF" }
    ];
  }, [footballStatus]);

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Futebol HUB Pro</span>
          <h1>Monitoramento de futebol em um unico painel.</h1>
          <p>
            Acompanhe times, jogadores, competicoes, noticias e rankings sem transformar a experiencia
            em cadastro manual pesado de atletas.
          </p>

          <div className="hero-actions">
            <Link href="/ranking" className="primary-button">
              Ver rankings
            </Link>
            <Link href="/monitorados" className="ghost-button">
              Abrir monitorados
            </Link>
          </div>

          <div className="hero-focus-row" aria-label="Resumo operacional">
            <span>Times</span>
            <span>Jogadores</span>
            <span>Ranking</span>
            <span>Noticias</span>
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
          <p className="card-label">Visao geral</p>
          <div className="metric-stack">
            {kpis.map((item) => (
              <div key={item.label} className="metric-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
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
              <p className="panel-tag">Aplicacao</p>
              <h2>Feito para o usuario final</h2>
            </div>
          </div>

          <div className="use-case-grid compact-grid">
            {useCases.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <p className="warning">
            {footballStatus?.configured
              ? "Fontes externas conectadas para enriquecer rankings, perfis e noticias."
              : "Dados ao vivo temporariamente indisponiveis. O painel segue funcionando com a base local."}
          </p>
        </article>
      </section>

      <section className="professional-grid">
        <StandingsPreview title="Panorama competitivo" limit={6} />

        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Acompanhamento</p>
              <h2>Central do usuario</h2>
            </div>
            <span className="badge">Monitorados</span>
          </div>

          <p>Salve times, jogadores e competicoes para voltar rapido ao que voce acompanha no dia a dia.</p>
          <div className="report-link-list">
            <Link href="/monitorados" className="inline-link">
              Abrir monitorados
            </Link>
            <Link href="/times" className="inline-link">
              Ver times
            </Link>
            <Link href="/jogadores" className="inline-link">
              Ver jogadores
            </Link>
          </div>
        </article>
      </section>

      <section className="professional-grid">
        <NewsPanel query="futebol OR football transfers OR champions league OR brasileirao" title="Noticias do futebol" />

        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Cobertura</p>
              <h2>Camada multi-API</h2>
            </div>
          </div>
          <ul className="feature-list">
            <li>API-Football para competicoes, tabelas, jogos, times e jogadores.</li>
            <li>GNews para noticias de clubes, ligas, atletas e mercado.</li>
            <li>Base local entra como fallback quando uma fonte externa nao estiver disponivel.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
