"use client";

import { useEffect, useState } from "react";

export default function TeamLivePanel({ teamName, leagueId = "eng.1", season = "2025" }) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadLiveTeam() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/football/team?name=${encodeURIComponent(teamName)}&league=${encodeURIComponent(leagueId)}&season=${encodeURIComponent(season)}`
        );
        const data = await response.json();

        if (!active) {
          return;
        }

        setPayload(data);

        if (data.message) {
          setError(data.message);
        }
      } catch (_error) {
        if (active) {
          setError("Falha ao carregar a cobertura live do time.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadLiveTeam();

    return () => {
      active = false;
    };
  }, [teamName, leagueId, season]);

  const stats = payload?.statistics;
  const recentFixtures = payload?.recentFixtures || [];
  const topScorers = payload?.topScorers || [];

  return (
    <section className="professional-grid">
      <article className="glass-panel">
        <div className="section-heading">
          <div>
            <p className="panel-tag">API-Football</p>
            <h2>Cobertura live do clube</h2>
          </div>
          <span className="badge">{payload?.configured === false ? "Nao configurada" : "Live"}</span>
        </div>

        {loading ? <p>Consultando dados atualizados do clube...</p> : null}
        {!loading && error ? <p className="warning">{error}</p> : null}

        {!loading && stats ? (
          <div className="report-meta-grid">
            <div>
              <span className="detail-label">Forma</span>
              <strong>{stats.form}</strong>
            </div>
            <div>
              <span className="detail-label">Jogos</span>
              <strong>{stats.played}</strong>
            </div>
            <div>
              <span className="detail-label">Vitorias</span>
              <strong>{stats.wins}</strong>
            </div>
            <div>
              <span className="detail-label">Empates</span>
              <strong>{stats.draws}</strong>
            </div>
            <div>
              <span className="detail-label">Derrotas</span>
              <strong>{stats.losses}</strong>
            </div>
            <div>
              <span className="detail-label">Clean sheets</span>
              <strong>{stats.cleanSheets}</strong>
            </div>
            <div>
              <span className="detail-label">Gols marcados</span>
              <strong>{stats.goalsFor}</strong>
            </div>
            <div>
              <span className="detail-label">Gols sofridos</span>
              <strong>{stats.goalsAgainst}</strong>
            </div>
            <div>
              <span className="detail-label">Penaltis</span>
              <strong>{stats.penaltyScored}/{stats.penaltyScored + stats.penaltyMissed}</strong>
            </div>
          </div>
        ) : null}

        {!loading && payload?.team ? (
          <>
            <div className="divider-line" />
            <div className="report-meta-grid">
              <div>
                <span className="detail-label">Pais</span>
                <strong>{payload.team.country || "--"}</strong>
              </div>
              <div>
                <span className="detail-label">Fundacao</span>
                <strong>{payload.team.founded || "--"}</strong>
              </div>
              <div>
                <span className="detail-label">Estadio</span>
                <strong>{payload.team.venue || "--"}</strong>
              </div>
            </div>
          </>
        ) : null}
      </article>

      <article className="glass-panel">
        <div className="section-heading">
          <div>
            <p className="panel-tag">API-Football</p>
            <h2>Ultimos jogos e destaques</h2>
          </div>
        </div>

        {loading ? <p>Montando painel live...</p> : null}

        {!loading && recentFixtures.length > 0 ? (
          <div className="list-stack">
            {recentFixtures.map((item) => (
              <article key={item.fixtureId} className="workflow-row">
                <div className={`form-pill form-${item.result.toLowerCase()}`}>{item.result}</div>
                <div>
                  <strong>{item.opponent}</strong>
                  <p>
                    {item.score} | {item.venue} | {item.league}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {!loading && topScorers.length > 0 ? (
          <>
            <div className="divider-line" />
            <p className="panel-tag">Destaques do elenco</p>
            <ul className="feature-list">
              {topScorers.map((item) => (
                <li key={item.name}>
                  {item.name} | {item.goals} G | {item.assists} A
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </article>
    </section>
  );
}
