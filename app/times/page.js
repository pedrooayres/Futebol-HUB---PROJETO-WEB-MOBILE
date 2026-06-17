"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useEntityOverrides } from "@/components/EntityOverridesProvider";
import MonitorButton from "@/components/MonitorButton";
import { dataSourceSummary, featuredTeams } from "@/lib/football-data";

export default function TeamsPage() {
  const { applyOverride } = useEntityOverrides();
  const teams = useMemo(() => featuredTeams.map((team) => applyOverride("teams", team)), [applyOverride]);
  const activeTeamsCount = teams.length;
  const sourceLabel = dataSourceSummary.provider || dataSourceSummary.status || "Base local";

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Clubes</span>
          <h1>Monitoramento de times</h1>
          <p>
            Acompanhe clubes em uma visao direta, com competicao, modelo de jogo, momento recente e sinais
            principais para consulta rapida.
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{teams.length}</strong>
            <span>Times monitorados</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{activeTeamsCount}</strong>
            <span>Perfis ativos</span>
          </article>
          <article className="mini-kpi-card">
            <strong>Direto</strong>
            <span>Leitura rapida</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{sourceLabel}</strong>
            <span>Fonte dos perfis</span>
          </article>
        </div>
      </section>

      <section className="report-index-grid">
        {teams.map((team) => (
          <article key={team.slug} className="glass-panel report-index-card">
            <div className="section-heading">
              <div>
                <p className="panel-tag">{team.league}</p>
                <h2>{team.name}</h2>
              </div>
              <div className="result-badge-row">
                <span className="badge accent">{team.phase}</span>
                <span className="badge">{team.source || sourceLabel}</span>
              </div>
            </div>

            <p>{team.reportSummary}</p>

            <div className="report-meta-grid">
              <div>
                <span className="detail-label">Modelo base</span>
                <strong>{team.system}</strong>
              </div>
              <div>
                <span className="detail-label">Momento</span>
                <strong>{team.phase}</strong>
              </div>
              <div>
                <span className="detail-label">Competicao</span>
                <strong>{team.league}</strong>
              </div>
            </div>

            <div className="report-tag-row">
              {team.strengths.slice(0, 3).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="report-link-list">
              <MonitorButton
                item={{
                  id: team.slug,
                  type: "team",
                  title: team.name,
                  meta: team.league,
                  description: `${team.system} | ${team.phase}`,
                  href: `/times/${team.slug}`,
                  source: team.source || sourceLabel
                }}
              />
              <Link href={`/times/${team.slug}`} className="inline-link">
                Abrir time
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
