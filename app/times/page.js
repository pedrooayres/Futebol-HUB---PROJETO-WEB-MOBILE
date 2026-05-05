"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import AdminEntityEditor from "@/components/AdminEntityEditor";
import { useAccess } from "@/components/AccessProvider";
import { useEntityOverrides } from "@/components/EntityOverridesProvider";
import { dataSourceSummary, featuredTeams } from "@/lib/football-data";

export default function TeamsPage() {
  const { isCommon, isAdmin } = useAccess();
  const { applyOverride } = useEntityOverrides();
  const [editingTeam, setEditingTeam] = useState(null);
  const teams = useMemo(() => featuredTeams.map((team) => applyOverride("teams", team)), [applyOverride]);
  const averageRating = (
    teams.reduce((sum, team) => sum + team.rating, 0) / teams.length
  ).toFixed(1);

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Club Reports</span>
          <h1>Relatorios de times</h1>
          <p>
            {isCommon
              ? "Acompanhe rapidamente o momento dos clubes, os ultimos sinais competitivos e uma ficha-base de cada time."
              : "Visao executiva para profissionais de scouting, coordenacao e mercado com leitura de identidade, risco, necessidade de elenco e oportunidade de monitoramento."}
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{teams.length}</strong>
            <span>Relatorios ativos</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{averageRating}</strong>
            <span>Rating medio</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{isCommon ? "Direto" : "Profissional"}</strong>
            <span>{isCommon ? "Leitura rapida" : "Uso orientado a decisao"}</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{dataSourceSummary.status}</strong>
            <span>Pipeline externo</span>
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
                <span className="badge accent">{team.rating}</span>
                {isAdmin ? (
                  <button type="button" className="icon-mini-button" onClick={() => setEditingTeam(team)}>
                    Editar
                  </button>
                ) : null}
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
              {!isCommon ? (
                <div>
                  <span className="detail-label">Foco de mercado</span>
                  <strong>{team.marketFocus}</strong>
                </div>
              ) : null}
            </div>

            <div className="report-tag-row">
              {team.strengths.slice(0, 3).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <Link href={`/times/${team.slug}`} className="inline-link">
              Abrir relatorio completo
            </Link>
          </article>
        ))}
      </section>

      <AdminEntityEditor
        open={Boolean(editingTeam)}
        entity={editingTeam}
        type="teams"
        onClose={() => setEditingTeam(null)}
      />
    </main>
  );
}
