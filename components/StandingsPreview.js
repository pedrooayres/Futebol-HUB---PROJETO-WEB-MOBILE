"use client";

import { useEffect, useState } from "react";

function getStatValue(stats, keys) {
  const keyList = Array.isArray(keys) ? keys : [keys];
  return stats?.find((item) => keyList.includes(item.name))?.displayValue || "--";
}

export default function StandingsPreview({ title = "Top 6 da Premier League", limit = 6 }) {
  const [table, setTable] = useState([]);

  useEffect(() => {
    async function loadStandings() {
      const response = await fetch("/api/standings");
      const data = await response.json();
      setTable((data.rows || []).slice(0, limit));
    }

    loadStandings();
  }, [limit]);

  return (
    <article className="glass-panel table-panel">
      <div className="section-heading">
        <div>
          <p className="panel-tag">API externa</p>
          <h2>{title}</h2>
        </div>
        <span className="badge">Atualizacao automatica</span>
      </div>

      <div className="standings-list">
        {table.map((team, index) => (
          <div key={team.id} className="standing-row">
            <div className="standing-team">
              <span className="standing-index">{team.rank || index + 1}</span>
              {team.logo ? <img src={team.logo} alt={team.name} /> : null}
              <strong>{team.name}</strong>
            </div>
            <div className="standing-stats">
              <span>{team.wins ?? getStatValue(team.stats, "wins")}V</span>
              <span>{team.draws ?? getStatValue(team.stats, ["ties", "draws"])}E</span>
              <span>{team.points ?? getStatValue(team.stats, "points")} pts</span>
            </div>
          </div>
        ))}
        {table.length === 0 ? <p>Nenhum dado externo foi carregado ainda.</p> : null}
      </div>
    </article>
  );
}
