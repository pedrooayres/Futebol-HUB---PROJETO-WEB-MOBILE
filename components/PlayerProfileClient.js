"use client";

import { useState } from "react";

import AdminEntityEditor from "@/components/AdminEntityEditor";
import { useAccess } from "@/components/AccessProvider";
import { AdvancedOnly, CommonOnly } from "@/components/AccessVisibility";
import NewsPanel from "@/components/NewsPanel";
import PlayerLivePanel from "@/components/PlayerLivePanel";
import { useEntityOverrides } from "@/components/EntityOverridesProvider";

export default function PlayerProfileClient({ player, team }) {
  const { isAdmin } = useAccess();
  const { applyOverride } = useEntityOverrides();
  const [editing, setEditing] = useState(false);
  const resolvedPlayer = applyOverride("players", player);

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Jogador monitorado</span>
          <h1>{resolvedPlayer.name}</h1>
          <p>{resolvedPlayer.reportSummary}</p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{resolvedPlayer.role}</strong>
            <span>Funcao</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{resolvedPlayer.status}</strong>
            <span>Status</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{resolvedPlayer.contractStatus}</strong>
            <span>Situacao</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{resolvedPlayer.source}</strong>
            <span>Origem do perfil</span>
          </article>
        </div>
      </section>

      {isAdmin ? (
        <section className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Controle admin</p>
              <h2>Editar perfil do atleta</h2>
            </div>
            <button type="button" className="icon-mini-button" onClick={() => setEditing(true)}>
              Editar perfil
            </button>
          </div>
          <p>Ajuste informacoes exibidas no perfil do atleta sem sair desta pagina.</p>
        </section>
      ) : null}

      <PlayerLivePanel playerName={resolvedPlayer.name} season="2025" />

      <section className="professional-grid">
        <NewsPanel query={resolvedPlayer.name} title={`Noticias de ${resolvedPlayer.name}`} />

        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Contexto publico</p>
              <h2>Atualizacoes complementares</h2>
            </div>
          </div>
          <p>{resolvedPlayer.newsPulse || "Use o modo admin para registrar contexto publico, noticias e atualizacoes do atleta."}</p>
        </article>
      </section>

      <section className="professional-grid">
        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Perfil do atleta</p>
              <h2>Contexto competitivo</h2>
            </div>
          </div>

          <div className="player-meta-grid">
            <span>{resolvedPlayer.role}</span>
            <span>{resolvedPlayer.age} anos</span>
            <span>{resolvedPlayer.foot}</span>
            <span>{resolvedPlayer.nationality}</span>
            <span>{resolvedPlayer.height}</span>
            <span>{resolvedPlayer.club}</span>
            <span>{resolvedPlayer.marketMoment}</span>
            <span>{resolvedPlayer.marketValue || "--"}</span>
            <span>{team?.system || "--"}</span>
          </div>

          <div className="divider-line" />
          <p>{resolvedPlayer.profile}</p>
          <p>{resolvedPlayer.summary}</p>
        </article>

        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Indicadores</p>
              <h2>Perfil de desempenho</h2>
            </div>
          </div>

          <div className="mini-bars">
            <div className="mini-bar-row">
              <span>Tecnica</span>
              <div className="chart-track">
                <div className="chart-fill" style={{ width: `${resolvedPlayer.metrics.technique}%` }} />
              </div>
              <strong>{resolvedPlayer.metrics.technique}</strong>
            </div>
            <div className="mini-bar-row">
              <span>Fisico</span>
              <div className="chart-track">
                <div
                  className="chart-fill chart-fill-secondary"
                  style={{ width: `${resolvedPlayer.metrics.physical}%` }}
                />
              </div>
              <strong>{resolvedPlayer.metrics.physical}</strong>
            </div>
            <div className="mini-bar-row">
              <span>Tatico</span>
              <div className="chart-track">
                <div
                  className="chart-fill chart-fill-danger"
                  style={{ width: `${resolvedPlayer.metrics.tactical}%` }}
                />
              </div>
              <strong>{resolvedPlayer.metrics.tactical}</strong>
            </div>
            <div className="mini-bar-row">
              <span>Participacao</span>
              <div className="chart-track">
                <div className="chart-fill" style={{ width: `${resolvedPlayer.metrics.projection}%` }} />
              </div>
              <strong>{resolvedPlayer.metrics.projection}</strong>
            </div>
            <div className="mini-bar-row">
              <span>Decisao</span>
              <div className="chart-track">
                <div
                  className="chart-fill chart-fill-secondary"
                  style={{ width: `${resolvedPlayer.metrics.decisionMaking}%` }}
                />
              </div>
              <strong>{resolvedPlayer.metrics.decisionMaking}</strong>
            </div>
          </div>

          <div className="divider-line" />

          <div className="report-meta-grid">
            <div>
              <span className="detail-label">Jogos</span>
              <strong>{resolvedPlayer.seasonStats.matches}</strong>
            </div>
            <div>
              <span className="detail-label">Titular</span>
              <strong>{resolvedPlayer.seasonStats.starts}</strong>
            </div>
            <div>
              <span className="detail-label">Gols</span>
              <strong>{resolvedPlayer.seasonStats.goals}</strong>
            </div>
            <div>
              <span className="detail-label">Assistencias</span>
              <strong>{resolvedPlayer.seasonStats.assists}</strong>
            </div>
            <div>
              <span className="detail-label">Minutos</span>
              <strong>{resolvedPlayer.seasonStats.minutes}</strong>
            </div>
            <div>
              <span className="detail-label">Passes-chave</span>
              <strong>{resolvedPlayer.seasonStats.keyPasses}</strong>
            </div>
          </div>
        </article>
      </section>

      <CommonOnly>
        <section className="professional-grid">
          <article className="glass-panel">
            <p className="panel-tag">Resumo rapido</p>
            <h2>Leitura direta do atleta</h2>
            <p>{resolvedPlayer.reportSummary}</p>
            <p>
              {resolvedPlayer.role} | {resolvedPlayer.club} | {resolvedPlayer.status}
            </p>
          </article>

          <article className="glass-panel">
            <p className="panel-tag">Momento</p>
            <h2>Ultimos sinais</h2>
            <ul className="feature-list">
              {resolvedPlayer.recentMatches.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>
      </CommonOnly>

      <AdvancedOnly>
        <section className="professional-grid">
          <article className="glass-panel">
            <p className="panel-tag">Forma e disponibilidade</p>
            <h2>Snapshot competitivo</h2>
            <div className="report-meta-grid">
              <div>
                <span className="detail-label">Condicao</span>
                <strong>{resolvedPlayer.availability.condition}</strong>
              </div>
              <div>
                <span className="detail-label">Carga</span>
                <strong>{resolvedPlayer.availability.load}</strong>
              </div>
              <div>
                <span className="detail-label">Toques na area</span>
                <strong>{resolvedPlayer.shotProfile.touchesInBox}</strong>
              </div>
            </div>
            <p>{resolvedPlayer.availability.note}</p>

            <div className="divider-line" />
            <span className="detail-label">Serie recente</span>
            <div className="trend-rating-row">
              {resolvedPlayer.trendRatings.map((item, index) => (
                <span key={`${resolvedPlayer.slug}-${index}`} className="trend-chip">
                  {item}
                </span>
              ))}
            </div>
          </article>

          <article className="glass-panel">
            <p className="panel-tag">Jogos recentes</p>
            <h2>Leitura de partida</h2>
            <ul className="feature-list">
              {resolvedPlayer.recentMatches.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="professional-grid">
          <article className="glass-panel">
            <p className="panel-tag">Caracteristicas</p>
            <h2>Informacoes principais</h2>
            <ul className="feature-list">
              {resolvedPlayer.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="glass-panel">
            <p className="panel-tag">Observacoes</p>
            <h2>Pontos de acompanhamento</h2>
            <ul className="feature-list">
              {resolvedPlayer.concerns.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="professional-grid">
          <article className="glass-panel">
            <p className="panel-tag">Funcao e comparacao</p>
            <h2>Como o atleta se encaixa</h2>
            <ul className="feature-list">
              {resolvedPlayer.roleProfile.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="divider-line" />
            <span className="detail-label">Perfis comparaveis</span>
            <p>{resolvedPlayer.comparisonProfiles.join(" | ")}</p>
          </article>

          <article className="glass-panel">
            <p className="panel-tag">Finalizacao</p>
            <h2>Perfil de finalizacao</h2>
            <div className="report-meta-grid">
              <div>
                <span className="detail-label">Chutes</span>
                <strong>{resolvedPlayer.shotProfile.shots}</strong>
              </div>
              <div>
                <span className="detail-label">No alvo</span>
                <strong>{resolvedPlayer.shotProfile.onTarget}</strong>
              </div>
              <div>
                <span className="detail-label">Duelo ganho</span>
                <strong>{resolvedPlayer.seasonStats.duelsWon}</strong>
              </div>
            </div>
          </article>
        </section>

        <article className="glass-panel">
          <p className="panel-tag">Acompanhamento</p>
          <h2>Proximas atualizacoes</h2>
          <ul className="feature-list">
            {resolvedPlayer.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </AdvancedOnly>

      <AdminEntityEditor open={editing} entity={resolvedPlayer} type="players" onClose={() => setEditing(false)} />
    </main>
  );
}
