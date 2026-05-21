"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

import { useEntityOverrides } from "@/components/EntityOverridesProvider";
import MonitorButton from "@/components/MonitorButton";
import { spotlightPlayers } from "@/lib/football-data";

const ALL_FILTER = "Todos";

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function buildStaticPlayerCard(player) {
  return {
    id: player.slug,
    slug: player.slug,
    name: player.name,
    club: player.club,
    role: player.role,
    monitoringIndex: Number(player.rating || 0),
    status: player.status || "Monitorado",
    age: player.age || "--",
    foot: player.foot || "--",
    nationality: player.nationality || "--",
    summary: player.reportSummary || player.summary || "",
    strengths: player.strengths || [],
    href: `/jogadores/${player.slug}`
  };
}

export default function PlayersPage() {
  const { applyOverride } = useEntityOverrides();
  const [query, setQuery] = useState("");
  const [clubFilter, setClubFilter] = useState(ALL_FILTER);
  const [roleFilter, setRoleFilter] = useState(ALL_FILTER);
  const [nationalityFilter, setNationalityFilter] = useState(ALL_FILTER);
  const [sortMode, setSortMode] = useState("index");
  const deferredQuery = useDeferredValue(query);

  const players = useMemo(
    () => spotlightPlayers.map((player) => applyOverride("players", player)).map(buildStaticPlayerCard),
    [applyOverride]
  );

  const filterOptions = useMemo(() => {
    const unique = (items) => [ALL_FILTER, ...[...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b))];

    return {
      clubs: unique(players.map((player) => player.club)),
      roles: unique(players.map((player) => player.role)),
      nationalities: unique(players.map((player) => player.nationality))
    };
  }, [players]);

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = normalizeText(deferredQuery.trim());

    return [...players]
      .filter((player) => {
        const searchable = normalizeText(
          `${player.name} ${player.club} ${player.role} ${player.nationality} ${player.summary} ${player.strengths.join(" ")}`
        );
        const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
        const matchesClub = clubFilter === ALL_FILTER || player.club === clubFilter;
        const matchesRole = roleFilter === ALL_FILTER || player.role === roleFilter;
        const matchesNationality = nationalityFilter === ALL_FILTER || player.nationality === nationalityFilter;

        return matchesQuery && matchesClub && matchesRole && matchesNationality;
      })
      .sort((a, b) => {
        if (sortMode === "name") {
          return a.name.localeCompare(b.name);
        }

        if (sortMode === "club") {
          return a.club.localeCompare(b.club) || b.monitoringIndex - a.monitoringIndex;
        }

        return b.monitoringIndex - a.monitoringIndex;
      });
  }, [clubFilter, deferredQuery, nationalityFilter, players, roleFilter, sortMode]);

  const topPlayer = [...players].sort((a, b) => b.monitoringIndex - a.monitoringIndex)[0];
  const clubCount = new Set(players.map((player) => player.club)).size;
  const nationalityCount = new Set(players.map((player) => player.nationality)).size;

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Monitoramento</span>
          <h1>Monitoramento de jogadores</h1>
          <p>
            Acompanhe jogadores em uma ficha simples, com clube atual, funcao, idade, nacionalidade e sinais
            principais para consulta rapida.
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{players.length}</strong>
            <span>Atletas no radar</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{filteredPlayers.length}</strong>
            <span>Resultado filtrado</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{clubCount}</strong>
            <span>Clubes mapeados</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{nationalityCount}</strong>
            <span>Nacionalidades</span>
          </article>
        </div>
      </section>

      <section className="glass-panel filter-panel">
        <div className="section-heading">
          <div>
            <p className="panel-tag">Base inicial</p>
            <h2>Filtros e ordenacao</h2>
          </div>
          <span className="badge">Consulta local</span>
        </div>

        <div className="scout-toolbar four-columns">
          <label>
            Buscar atleta
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nome, clube, funcao ou ponto forte"
            />
          </label>

          <label>
            Clube
            <select value={clubFilter} onChange={(event) => setClubFilter(event.target.value)}>
              {filterOptions.clubs.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Funcao
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              {filterOptions.roles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Nacionalidade
            <select value={nationalityFilter} onChange={(event) => setNationalityFilter(event.target.value)}>
              {filterOptions.nationalities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Ordenar
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
              <option value="index">Maior indice</option>
              <option value="name">Nome</option>
              <option value="club">Clube</option>
            </select>
          </label>
        </div>

        <div className="scout-toolbar two-columns">
          <label>
            Destaque
            <input value={topPlayer ? `${topPlayer.name} | indice ${topPlayer.monitoringIndex}` : "--"} readOnly />
          </label>

          <label>
            Cobertura
            <input value={`${players.length} jogadores na base inicial`} readOnly />
          </label>
        </div>
      </section>

      <section className="report-index-grid">
        {filteredPlayers.map((player) => (
          <article key={player.id} className="glass-panel report-index-card">
            <div className="section-heading">
              <div>
                <p className="panel-tag">{player.club}</p>
                <h2>{player.name}</h2>
              </div>
              <div className="result-badge-row">
                <span className="badge accent">Indice {player.monitoringIndex}</span>
              </div>
            </div>

            <p>{player.summary}</p>

            <div className="report-meta-grid">
              <div>
                <span className="detail-label">Funcao</span>
                <strong>{player.role}</strong>
              </div>
              <div>
                <span className="detail-label">Idade</span>
                <strong>{player.age}</strong>
              </div>
              <div>
                <span className="detail-label">Nacionalidade</span>
                <strong>{player.nationality}</strong>
              </div>
              <div>
                <span className="detail-label">Pe</span>
                <strong>{player.foot}</strong>
              </div>
            </div>

            <div className="report-tag-row">
              {player.strengths.slice(0, 3).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="report-link-list">
              <MonitorButton
                item={{
                  id: player.slug,
                  type: "player",
                  title: player.name,
                  meta: player.club,
                  description: `${player.role} | ${player.nationality}`,
                  href: player.href
                }}
              />
              <Link href={player.href} className="inline-link">
                Abrir jogador
              </Link>
            </div>
          </article>
        ))}

        {filteredPlayers.length === 0 ? (
          <article className="glass-panel report-index-card">
            <p className="panel-tag">Sem resultado</p>
            <h2>Nenhum atleta combina com os filtros</h2>
            <p>Ajuste busca, clube, funcao ou nacionalidade para ampliar a leitura da base.</p>
          </article>
        ) : null}
      </section>
    </main>
  );
}
