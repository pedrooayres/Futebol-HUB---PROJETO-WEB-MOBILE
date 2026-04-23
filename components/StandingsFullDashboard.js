"use client";

import { useEffect, useMemo, useState } from "react";

const LEAGUE_OPTIONS = [
  { id: "eng.1", label: "Premier League" },
  { id: "esp.1", label: "La Liga" },
  { id: "ita.1", label: "Serie A" },
  { id: "ger.1", label: "Bundesliga" },
  { id: "fra.1", label: "Ligue 1" },
  { id: "bra.1", label: "Brasileirao" }
];

const SEASON_OPTIONS = ["2024", "2023", "2022", "2021"];

function formatValue(value, suffix = "") {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  return `${value}${suffix}`;
}

function LeaderCard({ label, team, value, suffix = "" }) {
  return (
    <article className="glass-panel leader-card">
      <p className="panel-tag">{label}</p>
      <h3>{team?.name || "--"}</h3>
      <strong>{formatValue(value, suffix)}</strong>
    </article>
  );
}

function ChartPanel({ title, subtitle, items, colorClass = "" }) {
  const maxValue = useMemo(
    () => items.reduce((highest, item) => Math.max(highest, Number(item.value) || 0), 0),
    [items]
  );

  return (
    <article className="glass-panel">
      <div className="section-heading">
        <div>
          <p className="panel-tag">{subtitle}</p>
          <h2>{title}</h2>
        </div>
      </div>

      <div className="chart-list">
        {items.map((item) => {
          const width = maxValue > 0 ? `${(Number(item.value) / maxValue) * 100}%` : "0%";

          return (
            <div key={item.id} className="chart-row">
              <div className="chart-meta">
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </div>
              <div className="chart-track">
                <div className={`chart-fill ${colorClass}`} style={{ width }} />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function CompareStat({ label, left, right, suffix = "" }) {
  const leftValue = Number(left) || 0;
  const rightValue = Number(right) || 0;
  const total = leftValue + rightValue;
  const leftWidth = total > 0 ? `${(leftValue / total) * 100}%` : "50%";
  const rightWidth = total > 0 ? `${(rightValue / total) * 100}%` : "50%";

  return (
    <div className="compare-stat">
      <div className="compare-stat-meta">
        <span>{formatValue(left, suffix)}</span>
        <strong>{label}</strong>
        <span>{formatValue(right, suffix)}</span>
      </div>
      <div className="compare-bars">
        <div className="compare-bar compare-bar-left" style={{ width: leftWidth }} />
        <div className="compare-bar compare-bar-right" style={{ width: rightWidth }} />
      </div>
    </div>
  );
}

function getTrend(team) {
  if (!team) {
    return [];
  }

  const trends = [];

  if (team.performance >= 70) {
    trends.push({
      label: "Aproveitamento",
      text: `${team.performance}% de aproveitamento na temporada atual.`
    });
  }

  if (team.goalsFor >= 60) {
    trends.push({
      label: "Ataque",
      text: `${team.goalsFor} gols marcados, com producao ofensiva acima da media.`
    });
  }

  if (team.goalsAgainst <= 35) {
    trends.push({
      label: "Defesa",
      text: `${team.goalsAgainst} gols sofridos, indicando boa solidez defensiva.`
    });
  }

  if (team.goalDifference >= 20) {
    trends.push({
      label: "Saldo",
      text: `Saldo de ${team.goalDifference}, sinal de equilibrio entre ataque e defesa.`
    });
  }

  if (trends.length === 0) {
    trends.push({
      label: "Leitura geral",
      text: "Clube com desempenho intermediario, sem destaque estatistico isolado no recorte atual."
    });
  }

  return trends.slice(0, 3);
}

export default function StandingsFullDashboard() {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leagueId, setLeagueId] = useState("eng.1");
  const [season, setSeason] = useState("2024");
  const [teamAId, setTeamAId] = useState("");
  const [teamBId, setTeamBId] = useState("");
  const [trendTeamId, setTrendTeamId] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/standings?league=${leagueId}&season=${season}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Nao foi possivel carregar a tabela.");
        }

        setPayload(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [leagueId, season]);

  const rows = payload?.rows || [];
  const league = payload?.league;
  const summary = payload?.summary;
  const leaders = payload?.leaders;
  const charts = payload?.charts;

  useEffect(() => {
    if (rows.length === 0) {
      setTeamAId("");
      setTeamBId("");
      setTrendTeamId("");
      return;
    }

    setTeamAId((current) => current || rows[0]?.id || "");
    setTeamBId((current) => current || rows[1]?.id || rows[0]?.id || "");
    setTrendTeamId((current) => current || rows[0]?.id || "");
  }, [rows]);

  const compareTeamA = useMemo(
    () => rows.find((item) => item.id === teamAId) || null,
    [rows, teamAId]
  );
  const compareTeamB = useMemo(
    () => rows.find((item) => item.id === teamBId) || null,
    [rows, teamBId]
  );
  const trendTeam = useMemo(
    () => rows.find((item) => item.id === trendTeamId) || null,
    [rows, trendTeamId]
  );
  const trendCards = useMemo(() => getTrend(trendTeam), [trendTeam]);

  return (
    <section className="page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Ranking Hub</span>
          <h1>Modo full da tabela</h1>
          <p>
            Leitura completa do campeonato com filtros, comparador entre clubes, tendencias e
            indicadores derivados da API Football Standings.
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{summary?.teams ?? 0}</strong>
            <span>Clubes</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{summary?.maximumPoints ?? 0}</strong>
            <span>Maior pontuacao</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{summary?.averageGoalsFor ?? 0}</strong>
            <span>Media de gols marcados</span>
          </article>
        </div>
      </section>

      <section className="glass-panel filter-panel">
        <div className="section-heading">
          <div>
            <p className="panel-tag">Filtros</p>
            <h2>Liga e temporada</h2>
          </div>
          <span className="badge">{league?.seasonDisplay || season}</span>
        </div>

        <div className="ranking-filters">
          <label>
            Liga
            <select value={leagueId} onChange={(event) => setLeagueId(event.target.value)}>
              {LEAGUE_OPTIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Temporada
            <select value={season} onChange={(event) => setSeason(event.target.value)}>
              {SEASON_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {loading ? <p>Carregando leitura completa da liga...</p> : null}
      {error ? <p className="warning">{error}</p> : null}

      {!loading && !error ? (
        <>
          <section className="triple-grid">
            <LeaderCard
              label="Lider da tabela"
              team={leaders?.tableLeader}
              value={leaders?.tableLeader?.points}
              suffix=" pts"
            />
            <LeaderCard
              label="Melhor ataque"
              team={leaders?.bestAttack}
              value={leaders?.bestAttack?.goalsFor}
              suffix=" GF"
            />
            <LeaderCard
              label="Melhor defesa"
              team={leaders?.bestDefense}
              value={leaders?.bestDefense?.goalsAgainst}
              suffix=" GA"
            />
          </section>

          <section className="professional-grid">
            <ChartPanel
              title="Pontuacao"
              subtitle={league?.seasonDisplay || "Temporada"}
              items={charts?.points || []}
            />
            <ChartPanel
              title="Forca ofensiva"
              subtitle="Gols marcados"
              items={charts?.attack || []}
              colorClass="chart-fill-secondary"
            />
          </section>

          <section className="professional-grid">
            <ChartPanel
              title="Solidez defensiva"
              subtitle="Menos gols sofridos"
              items={charts?.defense || []}
              colorClass="chart-fill-danger"
            />

            <article className="glass-panel">
              <div className="section-heading">
                <div>
                  <p className="panel-tag">Resumo do campeonato</p>
                  <h2>{league?.name}</h2>
                </div>
                <span className="badge">{league?.abbreviation || "--"}</span>
              </div>

              <div className="note-list">
                <article className="note-card">
                  <div className="note-header">
                    <div>
                      <h3>Media de pontos</h3>
                      <p>Distribuicao media de pontos entre os clubes.</p>
                    </div>
                    <span className="status-pill">{summary?.averagePoints ?? 0}</span>
                  </div>
                </article>

                <article className="note-card">
                  <div className="note-header">
                    <div>
                      <h3>Clube com mais vitorias</h3>
                      <p>{leaders?.mostWins?.name || "--"}</p>
                    </div>
                    <span className="status-pill aprovado">{leaders?.mostWins?.wins ?? 0} V</span>
                  </div>
                </article>

                <article className="note-card">
                  <div className="note-header">
                    <div>
                      <h3>Media de gols por clube</h3>
                      <p>Resumo ofensivo do campeonato selecionado.</p>
                    </div>
                    <span className="status-pill">{summary?.averageGoalsFor ?? 0}</span>
                  </div>
                </article>
              </div>
            </article>
          </section>

          <section className="professional-grid">
            <article className="glass-panel">
              <div className="section-heading">
                <div>
                  <p className="panel-tag">Comparador</p>
                  <h2>Clube vs clube</h2>
                </div>
              </div>

              <div className="ranking-filters">
                <label>
                  Clube A
                  <select value={teamAId} onChange={(event) => setTeamAId(event.target.value)}>
                    {rows.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Clube B
                  <select value={teamBId} onChange={(event) => setTeamBId(event.target.value)}>
                    {rows.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="compare-header">
                <div className="compare-team-card">
                  <strong>{compareTeamA?.name || "--"}</strong>
                  <span>{formatValue(compareTeamA?.points, " pts")}</span>
                </div>
                <div className="compare-team-card">
                  <strong>{compareTeamB?.name || "--"}</strong>
                  <span>{formatValue(compareTeamB?.points, " pts")}</span>
                </div>
              </div>

              <div className="compare-grid">
                <CompareStat label="Pontos" left={compareTeamA?.points} right={compareTeamB?.points} />
                <CompareStat label="Vitorias" left={compareTeamA?.wins} right={compareTeamB?.wins} />
                <CompareStat label="Gols marcados" left={compareTeamA?.goalsFor} right={compareTeamB?.goalsFor} />
                <CompareStat label="Gols sofridos" left={compareTeamA?.goalsAgainst} right={compareTeamB?.goalsAgainst} />
                <CompareStat label="Saldo" left={compareTeamA?.goalDifference} right={compareTeamB?.goalDifference} />
                <CompareStat
                  label="Aproveitamento"
                  left={compareTeamA?.performance}
                  right={compareTeamB?.performance}
                  suffix="%"
                />
              </div>
            </article>

            <article className="glass-panel">
              <div className="section-heading">
                <div>
                  <p className="panel-tag">Tendencias</p>
                  <h2>Leitura por clube</h2>
                </div>
              </div>

              <label className="trend-select">
                Clube analisado
                <select value={trendTeamId} onChange={(event) => setTrendTeamId(event.target.value)}>
                  {rows.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="trend-club-card">
                <strong>{trendTeam?.name || "--"}</strong>
                <span>
                  {formatValue(trendTeam?.points, " pts")} | {formatValue(trendTeam?.goalDifference, " SG")}
                </span>
              </div>

              <div className="note-list">
                {trendCards.map((item) => (
                  <article key={item.label} className="note-card">
                    <div className="note-header">
                      <div>
                        <h3>{item.label}</h3>
                        <p>{item.text}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </section>

          <article className="glass-panel">
            <div className="section-heading">
              <div>
                <p className="panel-tag">Tabela completa</p>
                <h2>Classificacao e estatisticas</h2>
              </div>
              <span className="badge">{rows.length} clubes</span>
            </div>

            <div className="standings-table-shell">
              <table className="standings-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Clube</th>
                    <th>PTS</th>
                    <th>J</th>
                    <th>V</th>
                    <th>E</th>
                    <th>D</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>SG</th>
                    <th>Aprov.</th>
                    <th>Forma</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((team) => (
                    <tr key={team.id}>
                      <td>{team.rank}</td>
                      <td>
                        <div className="table-team-cell">
                          {team.logo ? <img src={team.logo} alt={team.name} /> : null}
                          <div>
                            <strong>{team.name}</strong>
                            <span>{team.shortName || league?.abbreviation || "Club"}</span>
                          </div>
                        </div>
                      </td>
                      <td>{team.points}</td>
                      <td>{team.gamesPlayed}</td>
                      <td>{team.wins}</td>
                      <td>{team.draws}</td>
                      <td>{team.losses}</td>
                      <td>{team.goalsFor}</td>
                      <td>{team.goalsAgainst}</td>
                      <td>{team.goalDifference}</td>
                      <td>{team.performance}%</td>
                      <td>{team.form}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </>
      ) : null}
    </section>
  );
}
