import Link from "next/link";

import { featuredTeams } from "@/lib/football-data";

export default function TeamsPage() {
  const averageRating = (
    featuredTeams.reduce((sum, team) => sum + team.rating, 0) / featuredTeams.length
  ).toFixed(1);

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Club Reports</span>
          <h1>Relatorios de times</h1>
          <p>
            Visao executiva para profissionais de scouting, coordenacao e mercado com leitura de
            identidade, risco, necessidade de elenco e oportunidade de monitoramento.
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{featuredTeams.length}</strong>
            <span>Relatorios ativos</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{averageRating}</strong>
            <span>Rating medio</span>
          </article>
          <article className="mini-kpi-card">
            <strong>Profissional</strong>
            <span>Uso orientado a decisao</span>
          </article>
        </div>
      </section>

      <section className="report-index-grid">
        {featuredTeams.map((team) => (
          <article key={team.slug} className="glass-panel report-index-card">
            <div className="section-heading">
              <div>
                <p className="panel-tag">{team.league}</p>
                <h2>{team.name}</h2>
              </div>
              <span className="badge accent">{team.rating}</span>
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
                <span className="detail-label">Foco de mercado</span>
                <strong>{team.marketFocus}</strong>
              </div>
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
    </main>
  );
}
