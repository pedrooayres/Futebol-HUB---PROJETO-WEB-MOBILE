import { spotlightPlayers } from "@/lib/football-data";

export default function PlayersPage() {
  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Player Watch</span>
          <h1>Jogadores</h1>
          <p>
            Cards pensados para reforcar a ideia de observacao de talentos, com leitura rapida e
            visual mais editorial.
          </p>
        </div>
      </section>

      <section className="card-grid">
        {spotlightPlayers.map((player) => (
          <article key={player.name} className="glass-panel player-spotlight-card">
            <div className="section-heading">
              <div>
                <p className="panel-tag">{player.club}</p>
                <h2>{player.name}</h2>
              </div>
              <span className="badge accent">{player.rating}</span>
            </div>
            <p className="detail-label">{player.role}</p>
            <p>{player.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
