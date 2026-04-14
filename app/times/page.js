import { featuredTeams } from "@/lib/football-data";

export default function TeamsPage() {
  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Club Radar</span>
          <h1>Times</h1>
          <p>
            Uma area no estilo portal para destacar clubes observados, leitura de jogo e contexto
            de mercado.
          </p>
        </div>
      </section>

      <section className="card-grid">
        {featuredTeams.map((team) => (
          <article key={team.name} className="glass-panel team-card">
            <p className="panel-tag">Perfil competitivo</p>
            <h2>{team.name}</h2>
            <p>{team.profile}</p>
            <div className="divider-line" />
            <span className="detail-label">Leitura tatica</span>
            <strong>{team.style}</strong>
          </article>
        ))}
      </section>
    </main>
  );
}
