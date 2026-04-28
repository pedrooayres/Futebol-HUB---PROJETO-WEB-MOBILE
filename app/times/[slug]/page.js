import { notFound } from "next/navigation";

import { featuredTeams, getTeamBySlug } from "@/lib/football-data";

export function generateStaticParams() {
  return featuredTeams.map((team) => ({ slug: team.slug }));
}

export default async function TeamProfilePage({ params }) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);

  if (!team) {
    notFound();
  }

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Team Report</span>
          <h1>{team.name}</h1>
          <p>{team.reportSummary}</p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{team.rating}</strong>
            <span>Rating geral</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{team.system}</strong>
            <span>Sistema base</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{team.phase}</strong>
            <span>Momento competitivo</span>
          </article>
        </div>
      </section>

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
              <strong>{team.league}</strong>
            </div>
            <div>
              <span className="detail-label">Comissao</span>
              <strong>{team.coach}</strong>
            </div>
            <div>
              <span className="detail-label">Foco de mercado</span>
              <strong>{team.marketFocus}</strong>
            </div>
          </div>

          <div className="divider-line" />
          <p>{team.profile}</p>
          <p>{team.style}</p>
          <p>{team.moment}</p>
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
              <span>Base</span>
              <div className="chart-track">
                <div
                  className="chart-fill chart-fill-danger"
                  style={{ width: `${team.metrics.developmentIndex}%` }}
                />
              </div>
              <strong>{team.metrics.developmentIndex}</strong>
            </div>
            <div className="mini-bar-row">
              <span>Consistencia</span>
              <div className="chart-track">
                <div className="chart-fill" style={{ width: `${team.metrics.consistencyIndex}%` }} />
              </div>
              <strong>{team.metrics.consistencyIndex}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="professional-grid">
        <article className="glass-panel">
          <p className="panel-tag">Oportunidades</p>
          <h2>Onde monitorar</h2>
          <ul className="feature-list">
            {team.opportunities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="glass-panel">
          <p className="panel-tag">Necessidades</p>
          <h2>Leitura de elenco</h2>
          <ul className="feature-list">
            {team.squadNeeds.map((item) => (
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
            {team.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="glass-panel">
          <p className="panel-tag">Riscos</p>
          <h2>Pontos de atencao</h2>
          <ul className="feature-list">
            {team.risks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
