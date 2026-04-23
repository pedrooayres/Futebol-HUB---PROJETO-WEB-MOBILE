import { featuredTeams } from "@/lib/football-data";

export default function TeamsPage() {
  const averageRating = (
    featuredTeams.reduce((sum, team) => sum + team.rating, 0) / featuredTeams.length
  ).toFixed(1);

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Club Radar</span>
          <h1>Modo full dos times</h1>
          <p>
            Leitura de perfil competitivo, foco de mercado, indices de desempenho e prioridade de
            observacao para os clubes acompanhados.
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{featuredTeams.length}</strong>
            <span>Clubes</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{averageRating}</strong>
            <span>Media geral</span>
          </article>
          <article className="mini-kpi-card">
            <strong>3</strong>
            <span>Indices por clube</span>
          </article>
        </div>
      </section>

      <section className="card-grid">
        {featuredTeams.map((team) => (
          <article key={team.name} className="glass-panel team-card team-full-card">
            <div className="section-heading">
              <div>
                <p className="panel-tag">{team.league}</p>
                <h2>{team.name}</h2>
              </div>
              <span className="badge accent">{team.rating}</span>
            </div>

            <p>{team.profile}</p>
            <div className="divider-line" />

            <div className="team-info-grid">
              <div>
                <span className="detail-label">Leitura tatica</span>
                <strong>{team.style}</strong>
              </div>
              <div>
                <span className="detail-label">Momento</span>
                <strong>{team.moment}</strong>
              </div>
              <div>
                <span className="detail-label">Foco de mercado</span>
                <strong>{team.marketFocus}</strong>
              </div>
            </div>

            <div className="mini-bars">
              <div className="mini-bar-row">
                <span>Ofensivo</span>
                <div className="chart-track">
                  <div className="chart-fill" style={{ width: `${team.metrics.offensiveIndex}%` }} />
                </div>
                <strong>{team.metrics.offensiveIndex}</strong>
              </div>
              <div className="mini-bar-row">
                <span>Defensivo</span>
                <div className="chart-track">
                  <div
                    className="chart-fill chart-fill-secondary"
                    style={{ width: `${team.metrics.defensiveIndex}%` }}
                  />
                </div>
                <strong>{team.metrics.defensiveIndex}</strong>
              </div>
              <div className="mini-bar-row">
                <span>Desenvolvimento</span>
                <div className="chart-track">
                  <div
                    className="chart-fill chart-fill-danger"
                    style={{ width: `${team.metrics.developmentIndex}%` }}
                  />
                </div>
                <strong>{team.metrics.developmentIndex}</strong>
              </div>
            </div>

            <ul className="feature-list">
              {team.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
