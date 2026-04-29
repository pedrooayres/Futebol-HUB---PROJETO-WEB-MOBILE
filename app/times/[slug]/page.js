import { AdvancedOnly, CommonOnly } from "@/components/AccessVisibility";
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
          <article className="mini-kpi-card">
            <strong>{team.source}</strong>
            <span>Origem do perfil</span>
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

          <div className="divider-line" />

          <div className="report-meta-grid">
            <div>
              <span className="detail-label">Gols por jogo</span>
              <strong>{team.advancedMetrics.goalsPerMatch}</strong>
            </div>
            <div>
              <span className="detail-label">Chutes no alvo</span>
              <strong>{team.advancedMetrics.shotsOnTarget}</strong>
            </div>
            <div>
              <span className="detail-label">Posse media</span>
              <strong>{team.advancedMetrics.possession}%</strong>
            </div>
            <div>
              <span className="detail-label">Clean sheets</span>
              <strong>{team.advancedMetrics.cleanSheetRate}%</strong>
            </div>
            <div>
              <span className="detail-label">Mandante</span>
              <strong>{team.homeAway.home}</strong>
            </div>
            <div>
              <span className="detail-label">Visitante</span>
              <strong>{team.homeAway.away}</strong>
            </div>
          </div>
        </article>
      </section>

      <CommonOnly>
        <section className="professional-grid">
          <article className="glass-panel">
            <p className="panel-tag">Resumo rapido</p>
            <h2>Leitura direta do time</h2>
            <p>{team.reportSummary}</p>
            <p>
              Sistema {team.system} • Momento {team.phase} • Origem {team.source}
            </p>
          </article>

          <article className="glass-panel">
            <p className="panel-tag">Ultimos sinais</p>
            <h2>Forma recente</h2>
            <ul className="feature-list">
              {team.recentForm.slice(0, 3).map((match) => (
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
            {team.recentForm.map((match) => (
              <article key={`${match.opponent}-${match.score}`} className="workflow-row">
                <div className={`form-pill form-${match.result.toLowerCase()}`}>{match.result}</div>
                <div>
                  <strong>{match.opponent}</strong>
                  <p>
                    {match.score} • {match.venue}
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
            {team.streaks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="divider-line" />
          <span className="detail-label">Foco de confronto</span>
          <strong>{team.h2hFocus.target}</strong>
          <p>{team.h2hFocus.summary}</p>
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
          <p className="panel-tag">Provavel formacao</p>
          <h2>Lineup base</h2>
          <span className="detail-label">{team.probableLineup.formation}</span>
          <ul className="feature-list">
            {team.probableLineup.starters.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="divider-line" />
          <span className="detail-label">Banco util</span>
          <p>{team.probableLineup.bench.join(" • ")}</p>
        </article>

        <article className="glass-panel">
          <p className="panel-tag">Performers</p>
          <h2>Destaques do contexto</h2>
          <ul className="feature-list">
            {team.topPerformers.map((item) => (
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

      <section className="professional-grid">
        <article className="glass-panel">
          <p className="panel-tag">Bola parada</p>
          <h2>Perfil de set pieces</h2>
          <p>{team.setPieceProfile.offensive}</p>
          <p>{team.setPieceProfile.defensive}</p>
        </article>

        <article className="glass-panel">
          <p className="panel-tag">Disciplina</p>
          <h2>Leitura de faltas e cartoes</h2>
          <div className="report-meta-grid">
            <div>
              <span className="detail-label">Faltas/jogo</span>
              <strong>{team.discipline.foulsPerMatch}</strong>
            </div>
            <div>
              <span className="detail-label">Amarelos</span>
              <strong>{team.discipline.yellowCards}</strong>
            </div>
            <div>
              <span className="detail-label">Vermelhos</span>
              <strong>{team.discipline.redCards}</strong>
            </div>
          </div>
        </article>
      </section>
      </AdvancedOnly>
    </main>
  );
}
