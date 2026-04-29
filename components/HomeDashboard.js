"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useAccess } from "@/components/AccessProvider";
import QuickModeSummary from "@/components/QuickModeSummary";
import StandingsPreview from "@/components/StandingsPreview";

const coreModules = [
  {
    label: "Operacao",
    title: "Central de scouting",
    text: "Registre atletas, acompanhe status e mantenha observacoes organizadas em um fluxo unico."
  },
  {
    label: "Contexto",
    title: "Dados competitivos",
    text: "Use ranking e desempenho externo para contextualizar leitura tecnica e momento dos clubes."
  },
  {
    label: "Decisao",
    title: "Acompanhamento objetivo",
    text: "Transforme notas, filtros e historico em uma base mais clara para avaliacao de talentos."
  }
];

const workflowSteps = [
  "Registrar observacoes de atletas",
  "Classificar por status e nota tecnica",
  "Cruzar analise interna com dados externos",
  "Priorizar acompanhamento e proximas acoes"
];

const useCases = [
  "Clubes e departamentos de base",
  "Scouts independentes",
  "Empresarios e intermediarios",
  "Escolas e projetos esportivos"
];

export default function HomeDashboard() {
  const { isCommon, hasAdvancedAccess, isAdmin } = useAccess();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backStatus, setBackStatus] = useState("");

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

  const kpis = useMemo(() => {
    const approved = items.filter((item) => item.status === "Aprovado").length;
    const average =
      items.length > 0
        ? (items.reduce((sum, item) => sum + Number(item.rating || 0), 0) / items.length).toFixed(1)
        : "0.0";

    return [
      { label: "Jogadores monitorados", value: String(items.length).padStart(2, "0") },
      { label: "Aprovados", value: String(approved).padStart(2, "0") },
      { label: "Media tecnica", value: average }
    ];
  }, [items]);

  const recentItems = useMemo(() => items.slice(0, 4), [items]);

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Futebol HUB Pro</span>
          <h1>Scouting e inteligencia esportiva em um unico painel.</h1>
          <p>
            Uma plataforma para registrar observacoes, acompanhar atletas e apoiar decisoes com
            dados organizados e contexto competitivo.
          </p>

          <div className="hero-actions">
            <Link href="/scouting" className="primary-button">
              Abrir scouting
            </Link>
            <Link href="/ranking" className="ghost-button">
              Consultar ranking
            </Link>
          </div>
        </div>

        <aside className="hero-card">
          <p className="card-label">Visao geral</p>
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
        <QuickModeSummary
          commonTitle="Usuario padrao"
          commonText="Acompanhe resultados, contexto rapido e perfis resumidos sem excesso de camada tecnica."
          professionalTitle="Profissional"
          professionalText="Leia scouting, relatorios externos, forma recente e contexto competitivo com maior profundidade."
          adminTitle="Admin"
          adminText="Gerencie o produto, atualize dados manualmente e opere a base com controle total."
        />

        {isCommon ? (
          <article className="glass-panel">
            <div className="section-heading">
              <div>
                <p className="panel-tag">Atalhos</p>
                <h2>O que acompanhar agora</h2>
              </div>
            </div>

            <div className="workflow-list">
              <div className="workflow-row">
                <span className="standing-index">1</span>
                <p>Veja como um time vem jogando nos ultimos jogos.</p>
              </div>
              <div className="workflow-row">
                <span className="standing-index">2</span>
                <p>Busque um atleta para abrir uma ficha-base imediata.</p>
              </div>
              <div className="workflow-row">
                <span className="standing-index">3</span>
                <p>Consulte o ranking para descobrir o momento competitivo.</p>
              </div>
            </div>
          </article>
        ) : null}
      </section>

      <section className="professional-grid">
        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Fluxo de uso</p>
              <h2>Como a plataforma apoia a analise</h2>
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
              <h2>Perfis de uso</h2>
            </div>
          </div>

          <div className="use-case-grid compact-grid">
            {useCases.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          {hasAdvancedAccess || isAdmin ? (
            <p className="warning">
              Este modo libera leitura aprofundada de perfis, relatorios mais densos e ambiente de scouting mais detalhado.
            </p>
          ) : null}
        </article>
      </section>

      <section className="professional-grid">
        <StandingsPreview title="Panorama competitivo" limit={6} />

        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Base recente</p>
              <h2>Observacoes cadastradas</h2>
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
                <p className="note-meta">Nota tecnica: {item.rating}</p>
              </article>
            ))}

            {!loading && recentItems.length === 0 ? (
              <p>Nenhum registro encontrado. Use a central de scouting para iniciar a base.</p>
            ) : null}
          </div>

          <Link href="/scouting" className="inline-link">
            Abrir modulo completo
          </Link>
        </article>
      </section>
    </main>
  );
}
