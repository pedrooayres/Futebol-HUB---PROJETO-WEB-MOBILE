"use client";

import { useEffect, useMemo, useState } from "react";
import { API_FOOTBALL_LEAGUES, buildCompetitionSourceMeta } from "@/lib/api-football";

const SEASON_OPTIONS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

const MODERN_LEAGUE_PHASE_COMPETITIONS = new Set(["ucl", "uel", "uecl"]);

function shouldDefaultToKnockoutView(league, providerHint, season) {
  if (!league || league.type !== "Cup" || providerHint !== "livescore-api") {
    return false;
  }

  if (MODERN_LEAGUE_PHASE_COMPETITIONS.has(league.appId) && Number(season) >= 2024) {
    return false;
  }

  return true;
}

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

function getSourceLabel(source) {
  if (source === "livescore-knockout") {
    return "LiveScore KO";
  }

  if (source === "livescore-table") {
    return "LiveScore";
  }

  if (source === "api-football") {
    return "API-Football";
  }

  if (source === "api") {
    return "Standings API";
  }

  return "Fallback";
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

function KnockoutMatchCard({ match }) {
  return (
    <article className="knockout-match-card">
      <div className="knockout-match-top">
        <span className="badge">{match.round}</span>
        <span className="status-pill">{match.status || "--"}</span>
      </div>
      <div className="knockout-teams">
        <strong>{match.homeTeam.name}</strong>
        <span>{match.score}</span>
        <strong>{match.awayTeam.name}</strong>
      </div>
      <p className="note-meta">
        {[match.date, match.time, match.location].filter(Boolean).join(" | ") || "Agenda em atualizacao"}
      </p>
    </article>
  );
}

export default function StandingsFullDashboard() {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leagueId, setLeagueId] = useState("eng.1");
  const [season, setSeason] = useState("2025");
  const [teamAId, setTeamAId] = useState("");
  const [teamBId, setTeamBId] = useState("");
  const [trendTeamId, setTrendTeamId] = useState("");
  const [view, setView] = useState("auto");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/standings?league=${leagueId}&season=${season}&view=${view}`);
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
  }, [leagueId, season, view]);

  const rows = payload?.rows || [];
  const league = payload?.league;
  const summary = payload?.summary;
  const leaders = payload?.leaders;
  const charts = payload?.charts;
  const source = payload?.source || "fallback";
  const mode = payload?.mode || "table";
  const overview = payload?.overview;
  const liveMatches = payload?.liveMatches || [];
  const upcomingMatches = payload?.upcomingMatches || [];
  const recentMatches = payload?.recentMatches || [];
  const rounds = payload?.rounds || [];
  const activeView = payload?.activeView || "standings";
  const availableViews = payload?.availableViews || ["standings"];
  const phaseLabel = payload?.phaseLabel || "";
  const selectedLeague = API_FOOTBALL_LEAGUES.find((item) => item.appId === leagueId);
  const selectedSourceMeta = buildCompetitionSourceMeta(selectedLeague);

  useEffect(() => {
    if (selectedLeague?.season) {
      setSeason(selectedLeague.season);
    }
  }, [selectedLeague?.season]);

  useEffect(() => {
    if (selectedLeague?.type === "Cup" && selectedSourceMeta?.providerHint === "livescore-api") {
      setView(
        shouldDefaultToKnockoutView(selectedLeague, selectedSourceMeta.providerHint, season)
          ? "knockout"
          : "standings"
      );
      return;
    }

    setView("auto");
  }, [leagueId, season, selectedLeague, selectedSourceMeta?.providerHint]);

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
            indicadores derivados da camada de dados do produto, com suporte a API-Football.
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{mode === "knockout" ? overview?.liveMatches ?? 0 : summary?.teams ?? 0}</strong>
            <span>{mode === "knockout" ? "Ao vivo" : "Clubes"}</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{mode === "knockout" ? overview?.upcomingMatches ?? 0 : summary?.maximumPoints ?? 0}</strong>
            <span>{mode === "knockout" ? "Proximos jogos" : "Maior pontuacao"}</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{mode === "knockout" ? overview?.rounds ?? 0 : summary?.averageGoalsFor ?? 0}</strong>
            <span>{mode === "knockout" ? "Fases mapeadas" : "Media de gols marcados"}</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{getSourceLabel(source)}</strong>
            <span>Fonte ativa</span>
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
              {API_FOOTBALL_LEAGUES.map((item) => (
                <option key={item.appId} value={item.appId}>
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

          {selectedLeague?.type === "Cup" && selectedSourceMeta?.providerHint === "livescore-api" ? (
            <label>
              Visao
              <select value={view} onChange={(event) => setView(event.target.value)}>
                {availableViews.includes("standings") ? (
                  <option value="standings">Fase de liga / grupos</option>
                ) : null}
                {availableViews.includes("knockout") ? <option value="knockout">Mata-mata</option> : null}
              </select>
            </label>
          ) : null}
        </div>

        {selectedSourceMeta ? (
          <div className="note-list">
            <article className="note-card">
              <div className="note-header">
                <div>
                  <h3>Fonte mapeada</h3>
                  <p>
                    {selectedSourceMeta.providerHint === "api-futebol-widget"
                      ? "Widget/API-Futebol"
                      : selectedSourceMeta.providerHint === "thesportsdb"
                        ? "TheSportsDB"
                        : selectedSourceMeta.providerHint === "livescore-api"
                          ? "LiveScore API"
                          : selectedSourceMeta.providerHint === "livescore-api-commentary"
                            ? "LiveScore API Commentary"
                            : "API-Football"}
                  </p>
                </div>
                <span className="status-pill">{selectedLeague?.season}</span>
              </div>
              {selectedSourceMeta.externalUrl ? (
                <p className="note-meta">Referencia externa mapeada para esta competicao.</p>
              ) : null}
              {selectedSourceMeta.supportsHistoricalStandings ? (
                <p className="note-meta">
                  Para competicoes com LiveScore, o sistema tenta traduzir o ano escolhido para o
                  `season_id` real da API.
                </p>
              ) : null}
              {phaseLabel ? <p className="note-meta">Formato detectado: {phaseLabel}.</p> : null}
              {selectedLeague?.type === "Cup" && selectedSourceMeta?.providerHint === "livescore-api" ? (
                <p className="note-meta">
                  Edicoes recentes com fase classificatoria abrem em tabela. Copas e edicoes antigas priorizam o mata-mata.
                </p>
              ) : null}
            </article>
          </div>
        ) : null}
      </section>

      {loading ? <p>Carregando leitura completa da liga...</p> : null}
      {error ? <p className="warning">{error}</p> : null}
      {!loading && payload?.message ? <p className="warning">{payload.message}</p> : null}

      {!loading && !error ? (
        <>
          {mode === "unavailable" ? (
            <article className="glass-panel phase-highlight">
              <div className="section-heading">
                <div>
                  <p className="panel-tag">Cobertura historica</p>
                  <h2>Sem tabela confiavel para esta temporada</h2>
                </div>
                <span className="badge">{league?.seasonDisplay || season}</span>
              </div>
              <p className="note-meta">
                Esta competicao nao tem uma classificacao historica consistente nas fontes conectadas para o recorte
                selecionado. Tente outra temporada ou escolha uma copa/torneio com leitura de mata-mata.
              </p>
            </article>
          ) : null}

          {mode !== "unavailable" && (activeView === "knockout" || mode === "knockout") ? (
            <>
              <section className="professional-grid">
                <article className="glass-panel">
                  <div className="section-heading">
                    <div>
                      <p className="panel-tag">Mata-mata</p>
                      <h2>Jogos ao vivo</h2>
                    </div>
                    <span className="badge">{liveMatches.length} partidas</span>
                  </div>

                  <div className="knockout-grid">
                    {(liveMatches.length ? liveMatches : [{ id: "no-live", round: "Sem jogos ao vivo", status: "--", homeTeam: { name: "Nenhum jogo" }, awayTeam: { name: "neste momento" }, score: "--", date: "", time: "", location: "" }]).map((match) => (
                      <KnockoutMatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </article>

                <article className="glass-panel">
                  <div className="section-heading">
                    <div>
                      <p className="panel-tag">Agenda</p>
                      <h2>Proximos confrontos</h2>
                    </div>
                    <span className="badge">{upcomingMatches.length}</span>
                  </div>

                  <div className="knockout-grid">
                    {upcomingMatches.slice(0, 8).map((match) => (
                      <KnockoutMatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </article>
              </section>

              <section className="professional-grid">
                <article className="glass-panel">
                  <div className="section-heading">
                    <div>
                      <p className="panel-tag">Historico</p>
                      <h2>Ultimos jogos</h2>
                    </div>
                    <span className="badge">{recentMatches.length}</span>
                  </div>

                  <div className="knockout-grid">
                    {recentMatches.slice(0, 8).map((match) => (
                      <KnockoutMatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </article>

                <article className="glass-panel">
                  <div className="section-heading">
                    <div>
                      <p className="panel-tag">Chaveamento</p>
                      <h2>Fases da competicao</h2>
                    </div>
                    <span className="badge">{rounds.length}</span>
                  </div>

                  <div className="note-list">
                    {rounds.map((round) => (
                      <article key={round.round} className="note-card">
                        <div className="note-header">
                          <div>
                            <h3>{round.round}</h3>
                            <p>{round.matches.length} confrontos mapeados</p>
                          </div>
                          <span className="status-pill">{round.matches[0]?.mode === "fixtures" ? "Agenda" : "Historico"}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </article>
              </section>
            </>
          ) : null}

          {mode !== "unavailable" && activeView !== "knockout" && mode !== "knockout" ? (
            <>
          {phaseLabel ? (
            <article className="glass-panel phase-highlight">
              <div className="section-heading">
                <div>
                  <p className="panel-tag">Formato da edicao</p>
                  <h2>{phaseLabel}</h2>
                </div>
                <span className="badge">{league?.seasonDisplay || season}</span>
              </div>
              <p className="note-meta">
                {phaseLabel === "Fase de liga"
                  ? "Edicoes recentes usam a fase unica classificatoria antes do mata-mata."
                  : phaseLabel === "Fase de grupos"
                    ? "Edicoes antigas ou torneios de selecoes seguem a distribuicao por grupos antes do mata-mata."
                    : "Leitura classificatoria ativa para esta competicao."}
              </p>
            </article>
          ) : null}
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
        </>
      ) : null}
    </section>
  );
}
