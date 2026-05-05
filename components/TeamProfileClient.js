"use client";

import { useState } from "react";

import AdminEntityEditor from "@/components/AdminEntityEditor";
import { useAccess } from "@/components/AccessProvider";
import { AdvancedOnly, CommonOnly } from "@/components/AccessVisibility";
import { useEntityOverrides } from "@/components/EntityOverridesProvider";

export default function TeamProfileClient({ team }) {
  const { isAdmin } = useAccess();
  const { applyOverride } = useEntityOverrides();
  const [editing, setEditing] = useState(false);
  const resolvedTeam = applyOverride("teams", team);

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Team Report</span>
          <h1>{resolvedTeam.name}</h1>
          <p>{resolvedTeam.reportSummary}</p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{resolvedTeam.rating}</strong>
            <span>Rating geral</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{resolvedTeam.system}</strong>
            <span>Sistema base</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{resolvedTeam.phase}</strong>
            <span>Momento competitivo</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{resolvedTeam.source}</strong>
            <span>Origem do perfil</span>
          </article>
        </div>
      </section>

      {isAdmin ? (
        <section className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Controle admin</p>
              <h2>Editar perfil do time</h2>
            </div>
            <button type="button" className="icon-mini-button" onClick={() => setEditing(true)}>
              Editar perfil
            </button>
          </div>
          <p>Ajuste os dados exibidos neste perfil sem sair da pagina do clube.</p>
        </section>
      ) : null}

      <section className="professional-grid">
        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Perfil competitivo</p>
              <h2>Identidade do clube</h2>
            </div>
          </div>

          <div className="report-meta-grid">
            <div>
              <span className="detail-label">Liga</span>
              <strong>{resolvedTeam.league}</strong>
            </div>
            <div>
              <span className="detail-label">Comissao</span>
              <strong>{resolvedTeam.coach}</strong>
            </div>
            <div>
              <span className="detail-label">Foco de mercado</span>
              <strong>{resolvedTeam.marketFocus}</strong>
            </div>
          </div>

          <div className="divider-line" />
          <p>{resolvedTeam.profile}</p>
          <p>{resolvedTeam.style}</p>
          <p>{resolvedTeam.moment}</p>
        </article>

        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Leitura quantitativa</p>
              <h2>Indices internos</h2>
            </div>
          </div>

          <div className="mini-bars">
            <div className="mini-bar-row">
              <span>Ofensivo</span>
              <div className="chart-track">
                <div className="chart-fill" style={{ width: `${resolvedTeam.metrics.offensiveIndex}%` }} />
              </div>
              <strong>{resolvedTeam.metrics.offensiveIndex}</strong>
            </div>
            <div className="mini-bar-row">
              <span>Defensivo</span>
              <div className="chart-track">
                <div
                  className="chart-fill chart-fill-secondary"
                  style={{ width: `${resolvedTeam.metrics.defensiveIndex}%` }}
                />
              </div>
              <strong>{resolvedTeam.metrics.defensiveIndex}</strong>
            </div>
            <div className="mini-bar-row">
              <span>Base</span>
              <div className="chart-track">
                <div
                  className="chart-fill chart-fill-danger"
                  style={{ width: `${resolvedTeam.metrics.developmentIndex}%` }}
                />
              </div>
              <strong>{resolvedTeam.metrics.developmentIndex}</strong>
            </div>
            <div className="mini-bar-row">
              <span>Consistencia</span>
              <div className="chart-track">
                <div className="chart-fill" style={{ width: `${resolvedTeam.metrics.consistencyIndex}%` }} />
              </div>
              <strong>{resolvedTeam.metrics.consistencyIndex}</strong>
            </div>
          </div>

          <div className="divider-line" />

          <div className="report-meta-grid">
            <div>
              <span className="detail-label">Gols por jogo</span>
              <strong>{resolvedTeam.advancedMetrics.goalsPerMatch}</strong>
            </div>
            <div>
              <span className="detail-label">Chutes no alvo</span>
              <strong>{resolvedTeam.advancedMetrics.shotsOnTarget}</strong>
            </div>
            <div>
              <span className="detail-label">Posse media</span>
              <strong>{resolvedTeam.advancedMetrics.possession}%</strong>
            </div>
            <div>
              <span className="detail-label">Clean sheets</span>
              <strong>{resolvedTeam.advancedMetrics.cleanSheetRate}%</strong>
            </div>
            <div>
              <span className="detail-label">Mandante</span>
              <strong>{resolvedTeam.homeAway.home}</strong>
            </div>
            <div>
              <span className="detail-label">Visitante</span>
              <strong>{resolvedTeam.homeAway.away}</strong>
            </div>
          </div>
        </article>
      </section>

      <CommonOnly>
        <section className="professional-grid">
          <article className="glass-panel">
            <p className="panel-tag">Resumo rapido</p>
            <h2>Leitura direta do time</h2>
            <p>{resolvedTeam.reportSummary}</p>
            <p>
              Sistema {resolvedTeam.system} | Momento {resolvedTeam.phase} | Origem {resolvedTeam.source}
            </p>
          </article>

          <article className="glass-panel">
            <p className="panel-tag">Ultimos sinais</p>
            <h2>Forma recente</h2>
            <ul className="feature-list">
              {resolvedTeam.recentForm.slice(0, 3).map((match) => (
                <li key={`${match.opponent}-${match.score}`}>
                  {match.opponent} | {match.score} | {match.venue}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </CommonOnly>

      <AdvancedOnly>
        <section className="professional-grid">
          <article className="glass-panel">
            <p className="panel-tag">Forma recente</p>
            <h2>Ultimos jogos</h2>
            <div className="list-stack">
              {resolvedTeam.recentForm.map((match) => (
                <article key={`${match.opponent}-${match.score}`} className="workflow-row">
                  <div className={`form-pill form-${match.result.toLowerCase()}`}>{match.result}</div>
                  <div>
                    <strong>{match.opponent}</strong>
                    <p>
                      {match.score} | {match.venue}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="glass-panel">
            <p className="panel-tag">Streaks e H2H</p>
            <h2>Contexto competitivo</h2>
            <ul className="feature-list">
              {resolvedTeam.streaks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="divider-line" />
            <span className="detail-label">Foco de confronto</span>
            <strong>{resolvedTeam.h2hFocus.target}</strong>
            <p>{resolvedTeam.h2hFocus.summary}</p>
          </article>
        </section>

        <section className="professional-grid">
          <article className="glass-panel">
            <p className="panel-tag">Oportunidades</p>
            <h2>Onde monitorar</h2>
            <ul className="feature-list">
              {resolvedTeam.opportunities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="glass-panel">
            <p className="panel-tag">Necessidades</p>
            <h2>Leitura de elenco</h2>
            <ul className="feature-list">
              {resolvedTeam.squadNeeds.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="professional-grid">
          <article className="glass-panel">
            <p className="panel-tag">Provavel formacao</p>
            <h2>Lineup base</h2>
            <span className="detail-label">{resolvedTeam.probableLineup.formation}</span>
            <ul className="feature-list">
              {resolvedTeam.probableLineup.starters.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="divider-line" />
            <span className="detail-label">Banco util</span>
            <p>{resolvedTeam.probableLineup.bench.join(" | ")}</p>
          </article>

          <article className="glass-panel">
            <p className="panel-tag">Performers</p>
            <h2>Destaques do contexto</h2>
            <ul className="feature-list">
              {resolvedTeam.topPerformers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="professional-grid">
          <article className="glass-panel">
            <p className="panel-tag">Forcas</p>
            <h2>Pontos de sustentacao</h2>
            <ul className="feature-list">
              {resolvedTeam.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="glass-panel">
            <p className="panel-tag">Riscos</p>
            <h2>Pontos de atencao</h2>
            <ul className="feature-list">
              {resolvedTeam.risks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="professional-grid">
          <article className="glass-panel">
            <p className="panel-tag">Bola parada</p>
            <h2>Perfil de set pieces</h2>
            <p>{resolvedTeam.setPieceProfile.offensive}</p>
            <p>{resolvedTeam.setPieceProfile.defensive}</p>
          </article>

          <article className="glass-panel">
            <p className="panel-tag">Disciplina</p>
            <h2>Leitura de faltas e cartoes</h2>
            <div className="report-meta-grid">
              <div>
                <span className="detail-label">Faltas/jogo</span>
                <strong>{resolvedTeam.discipline.foulsPerMatch}</strong>
              </div>
              <div>
                <span className="detail-label">Amarelos</span>
                <strong>{resolvedTeam.discipline.yellowCards}</strong>
              </div>
              <div>
                <span className="detail-label">Vermelhos</span>
                <strong>{resolvedTeam.discipline.redCards}</strong>
              </div>
            </div>
          </article>
        </section>
      </AdvancedOnly>

      <AdminEntityEditor open={editing} entity={resolvedTeam} type="teams" onClose={() => setEditing(false)} />
    </main>
  );
}
