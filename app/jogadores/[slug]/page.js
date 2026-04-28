import { notFound } from "next/navigation";

import { getPlayerBySlug, getTeamBySlug, spotlightPlayers } from "@/lib/football-data";

export function generateStaticParams() {
  return spotlightPlayers.map((player) => ({ slug: player.slug }));
}

export default async function PlayerProfilePage({ params }) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);

  if (!player) {
    notFound();
  }

  const team = getTeamBySlug(player.teamSlug);

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Player Report</span>
          <h1>{player.name}</h1>
          <p>{player.reportSummary}</p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{player.rating}</strong>
            <span>Rating geral</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{player.status}</strong>
            <span>Status interno</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{player.contractStatus}</strong>
            <span>Leitura de mercado</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{player.source}</strong>
            <span>Origem do perfil</span>
          </article>
        </div>
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
            <span>{player.role}</span>
            <span>{player.age} anos</span>
            <span>{player.foot}</span>
            <span>{player.nationality}</span>
            <span>{player.height}</span>
            <span>{player.club}</span>
            <span>{player.marketMoment}</span>
            <span>{team?.system || "--"}</span>
          </div>

          <div className="divider-line" />
          <p>{player.profile}</p>
          <p>{player.summary}</p>
        </article>

        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Leitura quantitativa</p>
              <h2>Indices de observacao</h2>
            </div>
          </div>

          <div className="mini-bars">
            <div className="mini-bar-row">
              <span>Tecnica</span>
              <div className="chart-track">
                <div className="chart-fill" style={{ width: `${player.metrics.technique}%` }} />
              </div>
              <strong>{player.metrics.technique}</strong>
            </div>
            <div className="mini-bar-row">
              <span>Fisico</span>
              <div className="chart-track">
                <div
                  className="chart-fill chart-fill-secondary"
                  style={{ width: `${player.metrics.physical}%` }}
                />
              </div>
              <strong>{player.metrics.physical}</strong>
            </div>
            <div className="mini-bar-row">
              <span>Tatico</span>
              <div className="chart-track">
                <div
                  className="chart-fill chart-fill-danger"
                  style={{ width: `${player.metrics.tactical}%` }}
                />
              </div>
              <strong>{player.metrics.tactical}</strong>
            </div>
            <div className="mini-bar-row">
              <span>Projecao</span>
              <div className="chart-track">
                <div className="chart-fill" style={{ width: `${player.metrics.projection}%` }} />
              </div>
              <strong>{player.metrics.projection}</strong>
            </div>
            <div className="mini-bar-row">
              <span>Decisao</span>
              <div className="chart-track">
                <div
                  className="chart-fill chart-fill-secondary"
                  style={{ width: `${player.metrics.decisionMaking}%` }}
                />
              </div>
              <strong>{player.metrics.decisionMaking}</strong>
            </div>
          </div>

          <div className="divider-line" />

          <div className="report-meta-grid">
            <div>
              <span className="detail-label">Jogos</span>
              <strong>{player.seasonStats.matches}</strong>
            </div>
            <div>
              <span className="detail-label">Titular</span>
              <strong>{player.seasonStats.starts}</strong>
            </div>
            <div>
              <span className="detail-label">Gols</span>
              <strong>{player.seasonStats.goals}</strong>
            </div>
            <div>
              <span className="detail-label">Assistencias</span>
              <strong>{player.seasonStats.assists}</strong>
            </div>
            <div>
              <span className="detail-label">Minutos</span>
              <strong>{player.seasonStats.minutes}</strong>
            </div>
            <div>
              <span className="detail-label">Passes-chave</span>
              <strong>{player.seasonStats.keyPasses}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="professional-grid">
        <article className="glass-panel">
          <p className="panel-tag">Forma e disponibilidade</p>
          <h2>Snapshot competitivo</h2>
          <div className="report-meta-grid">
            <div>
              <span className="detail-label">Condicao</span>
              <strong>{player.availability.condition}</strong>
            </div>
            <div>
              <span className="detail-label">Carga</span>
              <strong>{player.availability.load}</strong>
            </div>
            <div>
              <span className="detail-label">Toques na area</span>
              <strong>{player.shotProfile.touchesInBox}</strong>
            </div>
          </div>
          <p>{player.availability.note}</p>

          <div className="divider-line" />
          <span className="detail-label">Trend ratings</span>
          <div className="trend-rating-row">
            {player.trendRatings.map((item, index) => (
              <span key={`${player.slug}-${index}`} className="trend-chip">
                {item}
              </span>
            ))}
          </div>
        </article>

        <article className="glass-panel">
          <p className="panel-tag">Jogos recentes</p>
          <h2>Leitura de partida</h2>
          <ul className="feature-list">
            {player.recentMatches.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="professional-grid">
        <article className="glass-panel">
          <p className="panel-tag">Forcas</p>
          <h2>Recursos principais</h2>
          <ul className="feature-list">
            {player.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="glass-panel">
          <p className="panel-tag">Pontos de atencao</p>
          <h2>Riscos de avaliacao</h2>
          <ul className="feature-list">
            {player.concerns.map((item) => (
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
            {player.roleProfile.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="divider-line" />
          <span className="detail-label">Perfis comparaveis</span>
          <p>{player.comparisonProfiles.join(" • ")}</p>
        </article>

        <article className="glass-panel">
          <p className="panel-tag">Finalizacao</p>
          <h2>Shot profile</h2>
          <div className="report-meta-grid">
            <div>
              <span className="detail-label">Chutes</span>
              <strong>{player.shotProfile.shots}</strong>
            </div>
            <div>
              <span className="detail-label">No alvo</span>
              <strong>{player.shotProfile.onTarget}</strong>
            </div>
            <div>
              <span className="detail-label">Duelo ganho</span>
              <strong>{player.seasonStats.duelsWon}</strong>
            </div>
          </div>
        </article>
      </section>

      <article className="glass-panel">
        <p className="panel-tag">Recomendacoes</p>
        <h2>Proximos passos de monitoramento</h2>
        <ul className="feature-list">
          {player.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </main>
  );
}
