"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useAccess } from "@/components/AccessProvider";
import { useEntityOverrides } from "@/components/EntityOverridesProvider";
import { dataSourceSummary, spotlightPlayers } from "@/lib/football-data";
import { buildScoutingReport, toSlug } from "@/lib/report-utils";

const ALL_FILTER = "Todos";

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function buildStaticPlayerCard(player) {
  return {
    id: `static-${player.slug}`,
    slug: player.slug,
    name: player.name,
    club: player.club,
    role: player.role,
    rating: Number(player.rating || 0),
    status: player.status || "Monitorado",
    priority: Number(player.rating || 0) >= 90 ? "Alta" : "Media",
    marketMoment: player.marketMoment || "--",
    contractStatus: player.contractStatus || "--",
    age: player.age || "--",
    foot: player.foot || "--",
    nationality: player.nationality || "--",
    summary: player.reportSummary || player.summary || "",
    strengths: player.strengths || [],
    risks: player.concerns || [],
    sourceLabel: player.source || "Perfil curado",
    sourceType: "Perfil",
    href: `/jogadores/${player.slug}`,
    scoutingHref: "",
    updatedAt: "",
    isFavorite: false
  };
}

function buildScoutingPlayerCard(report) {
  const playerProfile = report.playerProfile;
  const slug = playerProfile?.slug || toSlug(report.playerName);

  return {
    id: `scouting-${report.id || slug}`,
    slug,
    name: report.playerName,
    club: report.club,
    role: report.position,
    rating: Number(report.rating || 0),
    status: report.status || "Em observacao",
    priority: report.priority || "Media",
    marketMoment: report.recommendation || "Scouting ativo",
    contractStatus: report.nextAction || "Revisar contexto",
    age: playerProfile?.age || "--",
    foot: playerProfile?.foot || "--",
    nationality: playerProfile?.nationality || "--",
    summary: report.summary,
    strengths: report.strengths || [],
    risks: report.risks || [],
    sourceLabel: "Scouting interno",
    sourceType: "Scouting",
    href: playerProfile?.slug ? `/jogadores/${playerProfile.slug}` : `/scouting?report=${report.id}`,
    scoutingHref: report.id ? `/scouting?report=${report.id}` : "",
    updatedAt: report.updatedAt || "",
    isFavorite: Boolean(report.isFavorite)
  };
}

export default function PlayersPage() {
  const { isCommon } = useAccess();
  const { applyOverride } = useEntityOverrides();
  const [scoutingItems, setScoutingItems] = useState([]);
  const [loadingScouting, setLoadingScouting] = useState(true);
  const [scoutingMessage, setScoutingMessage] = useState("");
  const [query, setQuery] = useState("");
  const [clubFilter, setClubFilter] = useState(ALL_FILTER);
  const [roleFilter, setRoleFilter] = useState(ALL_FILTER);
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER);
  const [sourceFilter, setSourceFilter] = useState(ALL_FILTER);
  const [sortMode, setSortMode] = useState("rating");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let active = true;

    async function loadScoutingPlayers() {
      setLoadingScouting(true);
      setScoutingMessage("");

      try {
        const response = await fetch("/api/scouting");
        const data = await response.json();

        if (!active) {
          return;
        }

        setScoutingItems(data.items || []);
        setScoutingMessage(data.message || "");
      } catch (_error) {
        if (active) {
          setScoutingMessage("Nao foi possivel carregar a base de scouting agora.");
        }
      } finally {
        if (active) {
          setLoadingScouting(false);
        }
      }
    }

    loadScoutingPlayers();

    return () => {
      active = false;
    };
  }, []);

  const curatedPlayers = useMemo(
    () => spotlightPlayers.map((player) => applyOverride("players", player)).map(buildStaticPlayerCard),
    [applyOverride]
  );

  const scoutingPlayers = useMemo(
    () => scoutingItems.map(buildScoutingReport).map(buildScoutingPlayerCard),
    [scoutingItems]
  );

  const players = useMemo(() => {
    const staticNames = new Set(curatedPlayers.map((player) => toSlug(player.name)));
    const uniqueScoutingPlayers = scoutingPlayers.filter((player) => !staticNames.has(toSlug(player.name)));

    return [...curatedPlayers, ...uniqueScoutingPlayers];
  }, [curatedPlayers, scoutingPlayers]);

  const filterOptions = useMemo(() => {
    const unique = (items) => [ALL_FILTER, ...[...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b))];

    return {
      clubs: unique(players.map((player) => player.club)),
      roles: unique(players.map((player) => player.role)),
      statuses: unique(players.map((player) => player.status)),
      sources: unique(players.map((player) => player.sourceType))
    };
  }, [players]);

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = normalizeText(deferredQuery.trim());

    return [...players]
      .filter((player) => {
        const searchable = normalizeText(
          `${player.name} ${player.club} ${player.role} ${player.status} ${player.summary} ${player.strengths.join(" ")}`
        );
        const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
        const matchesClub = clubFilter === ALL_FILTER || player.club === clubFilter;
        const matchesRole = roleFilter === ALL_FILTER || player.role === roleFilter;
        const matchesStatus = statusFilter === ALL_FILTER || player.status === statusFilter;
        const matchesSource = sourceFilter === ALL_FILTER || player.sourceType === sourceFilter;

        return matchesQuery && matchesClub && matchesRole && matchesStatus && matchesSource;
      })
      .sort((a, b) => {
        if (sortMode === "name") {
          return a.name.localeCompare(b.name);
        }

        if (sortMode === "club") {
          return a.club.localeCompare(b.club) || b.rating - a.rating;
        }

        if (sortMode === "source") {
          return a.sourceType.localeCompare(b.sourceType) || b.rating - a.rating;
        }

        if (sortMode === "updated") {
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
        }

        return b.rating - a.rating;
      });
  }, [clubFilter, deferredQuery, players, roleFilter, sortMode, sourceFilter, statusFilter]);

  const topRating = [...players].sort((a, b) => b.rating - a.rating)[0];
  const approvedCount = players.filter((player) => /aprovado|prioridade|premium/i.test(player.status)).length;
  const scoutingCount = scoutingPlayers.length;

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Player Reports</span>
          <h1>Relatorios de atletas</h1>
          <p>
            {isCommon
              ? "Veja rapidamente o momento do atleta, os sinais principais e uma ficha-base pronta para consulta."
              : "Perfis individuais com leitura tecnica, contexto de mercado, recomendacoes de monitoramento e analise voltada para decisao profissional."}
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
            <strong>{approvedCount}</strong>
            <span>Prioridade tecnica</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{scoutingCount}</strong>
            <span>Scouting interno</span>
          </article>
        </div>
      </section>

      <section className="glass-panel filter-panel">
        <div className="section-heading">
          <div>
            <p className="panel-tag">Base de atletas</p>
            <h2>Filtros e ordenacao</h2>
          </div>
          <span className="badge">{loadingScouting ? "Sincronizando" : dataSourceSummary.status}</span>
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
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              {filterOptions.statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="scout-toolbar four-columns">
          <label>
            Origem
            <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
              {filterOptions.sources.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Ordenar
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
              <option value="rating">Maior rating</option>
              <option value="updated">Mais recentes</option>
              <option value="name">Nome</option>
              <option value="club">Clube</option>
              <option value="source">Origem</option>
            </select>
          </label>

          <label>
            Destaque
            <input value={topRating ? `${topRating.name} | ${topRating.rating}` : "--"} readOnly />
          </label>

          <label>
            Pipeline
            <input value={loadingScouting ? "Carregando scouting" : `${scoutingCount} registros`} readOnly />
          </label>
        </div>

        {scoutingMessage ? <p className="warning">{scoutingMessage}</p> : null}
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
                <span className="badge accent">{player.rating}</span>
                <span className="badge">{player.sourceType}</span>
              </div>
            </div>

            <p>{player.summary}</p>

            <div className="report-meta-grid">
              <div>
                <span className="detail-label">Funcao</span>
                <strong>{player.role}</strong>
              </div>
              {!isCommon ? (
                <>
                  <div>
                    <span className="detail-label">Mercado</span>
                    <strong>{player.marketMoment}</strong>
                  </div>
                  <div>
                    <span className="detail-label">Status</span>
                    <strong>{player.status}</strong>
                  </div>
                  <div>
                    <span className="detail-label">Idade</span>
                    <strong>{player.age}</strong>
                  </div>
                </>
              ) : null}
            </div>

            <div className="report-tag-row">
              {player.strengths.slice(0, 3).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="report-link-list">
              <Link href={player.href} className="inline-link">
                {player.sourceType === "Scouting" && !player.href.startsWith("/jogadores")
                  ? "Abrir relatorio de scouting"
                  : "Abrir perfil completo"}
              </Link>
              {player.scoutingHref ? (
                <Link href={player.scoutingHref} className="inline-link">
                  Abrir registro interno
                </Link>
              ) : null}
            </div>
          </article>
        ))}

        {!loadingScouting && filteredPlayers.length === 0 ? (
          <article className="glass-panel report-index-card">
            <p className="panel-tag">Sem resultado</p>
            <h2>Nenhum atleta combina com os filtros</h2>
            <p>Ajuste busca, clube, funcao, status ou origem para ampliar a leitura da base.</p>
          </article>
        ) : null}
      </section>
    </main>
  );
}
