"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useAccess } from "@/components/AccessProvider";
import { useEntityOverrides } from "@/components/EntityOverridesProvider";
import { dataSourceSummary, spotlightPlayers } from "@/lib/football-data";

export default function PlayersPage() {
  const { isCommon } = useAccess();
  const { applyOverride } = useEntityOverrides();
  const players = useMemo(
    () => spotlightPlayers.map((player) => applyOverride("players", player)),
    [applyOverride]
  );
  const topRating = [...players].sort((a, b) => b.rating - a.rating)[0];

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Player Reports</span>
          <h1>Relatorios de atletas</h1>
          <p>
            {isCommon
              ? "Veja rapidamente o momento do atleta, os sinais principais e uma ficha-base pronta para consulta."
              : "Perfis individuais com leitura tecnica, contexto de mercado, recomendacoes de monitoramento e analise voltada para decisao profissional."}
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{players.length}</strong>
            <span>Atletas priorizados</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{topRating?.name || "--"}</strong>
            <span>Maior rating</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{topRating?.rating || 0}</strong>
            <span>Nota de referencia</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{dataSourceSummary.status}</strong>
            <span>Pipeline externo</span>
          </article>
        </div>
      </section>

      <section className="report-index-grid">
        {players.map((player) => (
          <article key={player.slug} className="glass-panel report-index-card">
            <div className="section-heading">
              <div>
                <p className="panel-tag">{player.club}</p>
                <h2>{player.name}</h2>
              </div>
              <div className="result-badge-row">
                <span className="badge accent">{player.rating}</span>
              </div>
            </div>

            <p>{player.reportSummary}</p>

            <div className="report-meta-grid">
              <div>
                <span className="detail-label">Funcao</span>
                <strong>{player.role}</strong>
              </div>
              {!isCommon ? (
                <>
                  <div>
                    <span className="detail-label">Mercado</span>
                    <strong>{player.marketMoment}</strong>
                  </div>
                  <div>
                    <span className="detail-label">Contrato</span>
                    <strong>{player.contractStatus}</strong>
                  </div>
                </>
              ) : null}
            </div>

            <div className="report-tag-row">
              {player.strengths.slice(0, 3).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <Link href={`/jogadores/${player.slug}`} className="inline-link">
              Abrir perfil completo
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
