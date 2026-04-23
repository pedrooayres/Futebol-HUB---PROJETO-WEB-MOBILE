import { spotlightPlayers } from "@/lib/football-data";

export default function PlayersPage() {
  const bestProjection = [...spotlightPlayers].sort(
    (a, b) => b.metrics.projection - a.metrics.projection
  )[0];

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Player Watch</span>
          <h1>Modo full dos jogadores</h1>
          <p>
            Perfis mais completos de atletas com dados de contexto, strengths, leitura tecnica e
            indices por dimensao de observacao.
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{spotlightPlayers.length}</strong>
            <span>Atletas</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{bestProjection?.name || "--"}</strong>
            <span>Maior projecao</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{bestProjection?.metrics.projection || 0}</strong>
            <span>Indice de projecao</span>
          </article>
        </div>
      </section>

      <section className="card-grid">
        {spotlightPlayers.map((player) => (
          <article key={player.name} className="glass-panel player-spotlight-card player-full-card">
            <div className="section-heading">
              <div>
                <p className="panel-tag">{player.club}</p>
                <h2>{player.name}</h2>
              </div>
              <span className="badge accent">{player.rating}</span>
            </div>

            <div className="player-meta-grid">
              <span>{player.role}</span>
              <span>{player.age} anos</span>
              <span>{player.foot}</span>
              <span>{player.status}</span>
            </div>

            <p>{player.summary}</p>
            <div className="divider-line" />

            <div className="team-info-grid">
              <div>
                <span className="detail-label">Perfil</span>
                <strong>{player.profile}</strong>
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
            </div>

            <ul className="feature-list">
              {player.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
