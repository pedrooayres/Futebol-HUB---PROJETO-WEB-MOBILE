"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { buildFavoriteCollectionsFromScouting, buildScoutingReport, parseListField } from "@/lib/report-utils";

const initialForm = {
  playerName: "",
  club: "",
  position: "",
  rating: "80",
  status: "Em observacao",
  priority: "Media",
  reportSummary: "",
  strengths: "",
  risks: "",
  recommendation: "",
  nextAction: "",
  isFavorite: false,
  notes: ""
};

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 20h4.75L19 9.75 14.25 5 4 15.25V20zm2-1.75v-2.17L14.25 7.83l2.17 2.17L8.17 18.25H6zM20.71 8.04a1.003 1.003 0 000-1.42l-3.33-3.33a1.003 1.003 0 00-1.42 0L14.83 4.42 19.58 9.17l1.13-1.13z"
        fill="currentColor"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v8h-2V9zm4 0h2v8h-2V9zM7 9h2v8H7V9zm-1 11a2 2 0 01-2-2V8h16v10a2 2 0 01-2 2H6z"
        fill="currentColor"
      />
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildTextReport(report) {
  return [
    `RELATORIO DE SCOUTING | ${report.playerName}`,
    `Clube: ${report.club}`,
    `Posicao: ${report.position}`,
    `Nota: ${report.rating}`,
    `Status: ${report.status}`,
    `Prioridade: ${report.priority}`,
    `Favorito: ${report.isFavorite ? "Sim" : "Nao"}`,
    "",
    "Resumo executivo:",
    report.summary,
    "",
    "Pontos fortes:",
    ...report.strengths.map((item) => `- ${item}`),
    "",
    "Riscos e alertas:",
    ...report.risks.map((item) => `- ${item}`),
    "",
    "Recomendacao:",
    report.recommendation,
    "",
    "Proxima acao:",
    report.nextAction,
    "",
    "Observacoes complementares:",
    report.notes
  ].join("\n");
}

export default function ScoutingWorkspace({
  title = "Central de scouting",
  subtitle = "CRUD completo integrado ao Back4App para criacao, edicao e exclusao de observacoes."
}) {
  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loadingCrud, setLoadingCrud] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [backStatus, setBackStatus] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [sortMode, setSortMode] = useState("rating");
  const deferredQuery = useDeferredValue(query);
  const searchParams = useSearchParams();

  async function loadItems() {
    setLoadingCrud(true);
    const response = await fetch("/api/scouting");
    const data = await response.json();

    setItems(data.items || []);
    setBackStatus(data.message || "");
    setLoadingCrud(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const reportId = searchParams.get("report");
    if (reportId) {
      setSelectedId(reportId);
    }
  }, [searchParams]);

  const reports = useMemo(() => items.map(buildScoutingReport), [items]);

  const kpis = useMemo(() => {
    const approved = reports.filter((item) => item.status === "Aprovado").length;
    const favorites = reports.filter((item) => item.isFavorite).length;
    const average =
      reports.length > 0
        ? (reports.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reports.length).toFixed(1)
        : "0.0";

    return [
      { label: "Relatorios ativos", value: String(reports.length).padStart(2, "0") },
      { label: "Favoritos reais", value: String(favorites).padStart(2, "0") },
      { label: "Media tecnica", value: average },
      { label: "Aprovados", value: String(approved).padStart(2, "0") }
    ];
  }, [reports]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return [...reports]
      .filter((item) => {
        const matchesStatus = statusFilter === "Todos" || item.status === statusFilter;
        const searchable =
          `${item.playerName || ""} ${item.club || ""} ${item.position || ""} ${item.summary || ""}`.toLowerCase();
        const matchesQuery = normalizedQuery.length === 0 || searchable.includes(normalizedQuery);

        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => {
        if (sortMode === "name") {
          return (a.playerName || "").localeCompare(b.playerName || "");
        }

        if (sortMode === "updated") {
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
        }

        if (sortMode === "priority") {
          const weight = { Alta: 3, Media: 2, Baixa: 1 };
          return (weight[b.priority] || 0) - (weight[a.priority] || 0);
        }

        return Number(b.rating || 0) - Number(a.rating || 0);
      });
  }, [deferredQuery, reports, sortMode, statusFilter]);

  useEffect(() => {
    if (filteredItems.length === 0) {
      setSelectedId(null);
      return;
    }

    const selectedStillExists = filteredItems.some((item) => item.id === selectedId);
    if (!selectedStillExists) {
      setSelectedId(filteredItems[0].id);
    }
  }, [filteredItems, selectedId]);

  const selectedReport = useMemo(
    () => filteredItems.find((item) => item.id === selectedId) || filteredItems[0] || null,
    [filteredItems, selectedId]
  );

  const comparison = useMemo(() => filteredItems.slice(0, 3), [filteredItems]);
  const shortlist = useMemo(
    () => filteredItems.filter((item) => item.isFavorite || item.status === "Aprovado" || item.rating >= 88).slice(0, 5),
    [filteredItems]
  );
  const favoriteCollections = useMemo(() => buildFavoriteCollectionsFromScouting(items), [items]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const endpoint = editingId ? `/api/scouting/${editingId}` : "/api/scouting";
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Nao foi possivel salvar.");
      setSaving(false);
      return;
    }

    setForm(initialForm);
    setEditingId(null);
    setMessage(editingId ? "Relatorio atualizado com sucesso." : "Relatorio criado com sucesso.");
    setSaving(false);
    await loadItems();
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setSelectedId(item.id);
    setForm({
      playerName: item.playerName || "",
      club: item.club || "",
      position: item.position || "",
      rating: String(item.rating || 80),
      status: item.status || "Em observacao",
      priority: item.priority || "Media",
      reportSummary: item.summary || "",
      strengths: item.strengths.join("\n"),
      risks: item.risks.join("\n"),
      recommendation: item.recommendation || "",
      nextAction: item.nextAction || "",
      isFavorite: Boolean(item.isFavorite),
      notes: item.notes || ""
    });
  }

  async function handleDelete(id) {
    setMessage("");

    const response = await fetch(`/api/scouting/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Nao foi possivel excluir.");
      return;
    }

    if (editingId === id) {
      setForm(initialForm);
      setEditingId(null);
    }

    setMessage("Relatorio removido com sucesso.");
    await loadItems();
  }

  async function handleFavoriteToggle(item) {
    const payload = {
      playerName: item.playerName,
      club: item.club,
      position: item.position,
      rating: item.rating,
      status: item.status,
      priority: item.priority,
      reportSummary: item.summary,
      strengths: item.strengths,
      risks: item.risks,
      recommendation: item.recommendation,
      nextAction: item.nextAction,
      isFavorite: !item.isFavorite,
      notes: item.notes
    };

    const response = await fetch(`/api/scouting/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setMessage("Nao foi possivel atualizar o favorito.");
      return;
    }

    await loadItems();
  }

  function exportSelectedReport(format) {
    if (!selectedReport) {
      return;
    }

    const filename = `${selectedReport.playerName}-${selectedReport.club}`.toLowerCase().replaceAll(" ", "-");

    if (format === "txt") {
      downloadFile(`${filename}.txt`, buildTextReport(selectedReport), "text/plain;charset=utf-8");
      return;
    }

    if (format === "json") {
      downloadFile(
        `${filename}.json`,
        JSON.stringify(
          {
            ...selectedReport,
            strengths: parseListField(selectedReport.strengths),
            risks: parseListField(selectedReport.risks)
          },
          null,
          2
        ),
        "application/json;charset=utf-8"
      );
      return;
    }

    window.print();
  }

  return (
    <section className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Scouting Room</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="mini-kpis four-up">
          {kpis.map((item) => (
            <article key={item.label} className="mini-kpi-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="workbench-grid">
        <article className="glass-panel form-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Cadastro e edicao</p>
              <h2>{editingId ? "Editar relatorio" : "Novo relatorio"}</h2>
            </div>
            <span className="badge accent">{editingId ? "Modo edicao" : "Modo criacao"}</span>
          </div>

          <form onSubmit={handleSubmit} className="scout-form">
            <label>
              Nome do jogador
              <input
                name="playerName"
                value={form.playerName}
                onChange={handleChange}
                placeholder="Ex.: Estevao"
                required
              />
            </label>

            <div className="split-fields">
              <label>
                Clube
                <input
                  name="club"
                  value={form.club}
                  onChange={handleChange}
                  placeholder="Ex.: Palmeiras"
                  required
                />
              </label>

              <label>
                Posicao
                <input
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="Ex.: Ponta direita"
                  required
                />
              </label>
            </div>

            <div className="split-fields split-fields-3">
              <label>
                Nota tecnica
                <input
                  name="rating"
                  type="number"
                  min="0"
                  max="100"
                  value={form.rating}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Status
                <select name="status" value={form.status} onChange={handleChange}>
                  <option>Em observacao</option>
                  <option>Aprovado</option>
                  <option>Descartado</option>
                </select>
              </label>

              <label>
                Prioridade
                <select name="priority" value={form.priority} onChange={handleChange}>
                  <option>Alta</option>
                  <option>Media</option>
                  <option>Baixa</option>
                </select>
              </label>
            </div>

            <label>
              Resumo executivo
              <textarea
                name="reportSummary"
                value={form.reportSummary}
                onChange={handleChange}
                rows="3"
                placeholder="Sintese para decisao tecnica e leitura de mercado."
                required
              />
            </label>

            <div className="split-fields">
              <label>
                Pontos fortes
                <textarea
                  name="strengths"
                  value={form.strengths}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Um item por linha"
                  required
                />
              </label>

              <label>
                Riscos e alertas
                <textarea
                  name="risks"
                  value={form.risks}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Um item por linha"
                  required
                />
              </label>
            </div>

            <div className="split-fields">
              <label>
                Recomendacao
                <textarea
                  name="recommendation"
                  value={form.recommendation}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Ex.: avancar para shortlist e validar em novo jogo."
                  required
                />
              </label>

              <label>
                Proxima acao
                <textarea
                  name="nextAction"
                  value={form.nextAction}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Ex.: revisar jogo fora de casa e recorte sem bola."
                  required
                />
              </label>
            </div>

            <label>
              Observacoes complementares
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Detalhe de comportamento, contexto de jogo, encaixe tatico e leitura de teto."
                required
              />
            </label>

            <label className="checkbox-row">
              <input name="isFavorite" type="checkbox" checked={form.isFavorite} onChange={handleChange} />
              <span>Marcar como favorito operacional</span>
            </label>

            <div className="form-actions">
              <button type="submit" className="primary-button" disabled={saving}>
                {saving ? "Salvando..." : editingId ? "Atualizar relatorio" : "Criar relatorio"}
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => {
                  setForm(initialForm);
                  setEditingId(null);
                }}
              >
                Limpar
              </button>
            </div>
          </form>

          {message ? <p className="feedback">{message}</p> : null}
          {backStatus ? <p className="warning">{backStatus}</p> : null}
        </article>

        <article className="glass-panel list-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Pipeline ativo</p>
              <h2>Relatorios recentes</h2>
            </div>
            <span className="badge">
              {filteredItems.length} de {items.length} registros
            </span>
          </div>

          {loadingCrud ? <p>Carregando relatorios...</p> : null}

          <div className="scout-toolbar four-columns">
            <label>
              Buscar atleta
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nome, clube, posicao ou resumo"
              />
            </label>

            <label>
              Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option>Todos</option>
                <option>Em observacao</option>
                <option>Aprovado</option>
                <option>Descartado</option>
              </select>
            </label>

            <label>
              Ordenar
              <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
                <option value="rating">Maior nota</option>
                <option value="updated">Mais recentes</option>
                <option value="priority">Prioridade</option>
                <option value="name">Nome</option>
              </select>
            </label>

            <label>
              Shortlist
              <input value={shortlist.length ? `${shortlist.length} ativos` : "Sem shortlist"} readOnly />
            </label>
          </div>

          <div className="comparison-panel">
            <div>
              <p className="panel-tag">Comparativo rapido</p>
              <h3>Top atletas filtrados</h3>
            </div>
            <div className="comparison-list">
              {comparison.map((item) => (
                <article key={item.id} className="comparison-card">
                  <span>{item.position}</span>
                  <strong>{item.playerName}</strong>
                  <small>{item.club}</small>
                  <b>{item.rating}</b>
                </article>
              ))}
              {comparison.length === 0 ? <p>Nenhum atleta encontrado nos filtros atuais.</p> : null}
            </div>
          </div>

          <div className="scout-list">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                id={`report-${item.id}`}
                className={`scout-card ${selectedReport?.id === item.id ? "scout-card-active" : ""}`}
              >
                <button type="button" className="scout-card-select" onClick={() => setSelectedId(item.id)}>
                  <div className="scout-card-top">
                    <div>
                      <h3>{item.playerName}</h3>
                      <p>
                        {item.club} • {item.position}
                      </p>
                    </div>
                    <span className={`status-pill ${item.status?.toLowerCase().replaceAll(" ", "-")}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="scout-card-kpis">
                    <div className="scout-meta">
                      <strong>{item.rating}</strong>
                      <span>nota tecnica</span>
                    </div>
                    <div className="scout-meta">
                      <strong>{item.priority}</strong>
                      <span>prioridade</span>
                    </div>
                  </div>

                  <p className="scout-notes">{item.summary}</p>
                </button>

                <div className="report-tag-row">
                  {item.strengths.slice(0, 3).map((entry) => (
                    <span key={entry}>{entry}</span>
                  ))}
                </div>

                <div className="card-actions">
                  <button
                    className={`icon-action favorite-action ${item.isFavorite ? "favorite-active" : ""}`}
                    onClick={() => handleFavoriteToggle(item)}
                    title="Marcar como favorito"
                    aria-label={`Marcar ${item.playerName} como favorito`}
                  >
                    <StarIcon filled={item.isFavorite} />
                    <span>{item.isFavorite ? "Favorito" : "Favoritar"}</span>
                  </button>
                  <button
                    className="icon-action edit-action"
                    onClick={() => handleEdit(item)}
                    title="Editar registro"
                    aria-label={`Editar observacao de ${item.playerName}`}
                  >
                    <EditIcon />
                    <span>Editar</span>
                  </button>
                  <button
                    className="icon-action delete-action"
                    onClick={() => handleDelete(item.id)}
                    title="Excluir registro"
                    aria-label={`Excluir observacao de ${item.playerName}`}
                  >
                    <TrashIcon />
                    <span>Excluir</span>
                  </button>
                </div>
              </article>
            ))}
            {!loadingCrud && items.length === 0 ? (
              <p>
                Nenhum registro ainda. Configure o Back4App no arquivo <code>.env.local</code> e
                crie seu primeiro relatorio.
              </p>
            ) : null}
            {!loadingCrud && items.length > 0 && filteredItems.length === 0 ? (
              <p>Nenhum registro combina com os filtros selecionados.</p>
            ) : null}
          </div>
        </article>
      </section>

      <section className="report-workspace-grid">
        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Shortlist operacional</p>
              <h2>Mesa de decisao</h2>
            </div>
            <span className="badge accent">{shortlist.length} ativos</span>
          </div>

          <div className="list-stack">
            {shortlist.map((item) => (
              <article key={item.id} className="workflow-row">
                <div>
                  <strong>{item.playerName}</strong>
                  <p>
                    {item.club} | {item.rating} pts | {item.recommendation}
                  </p>
                </div>
              </article>
            ))}
            {shortlist.length === 0 ? (
              <p>A shortlist ainda sera formada a partir de aprovados, favoritos e notas mais altas.</p>
            ) : null}
          </div>
        </article>

        <article className="glass-panel report-preview-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Relatorio exportavel</p>
              <h2>{selectedReport ? selectedReport.playerName : "Selecione um relatorio"}</h2>
            </div>
            <div className="form-actions compact-actions">
              <button className="ghost-button" onClick={() => exportSelectedReport("txt")} disabled={!selectedReport}>
                Exportar TXT
              </button>
              <button className="ghost-button" onClick={() => exportSelectedReport("json")} disabled={!selectedReport}>
                Exportar JSON
              </button>
              <button className="primary-button" onClick={() => exportSelectedReport("print")} disabled={!selectedReport}>
                Imprimir
              </button>
            </div>
          </div>

          {selectedReport ? (
            <div className="report-preview-content">
              <div className="report-meta-grid">
                <div>
                  <span className="detail-label">Clube</span>
                  <strong>{selectedReport.club}</strong>
                </div>
                <div>
                  <span className="detail-label">Posicao</span>
                  <strong>{selectedReport.position}</strong>
                </div>
                <div>
                  <span className="detail-label">Nota</span>
                  <strong>{selectedReport.rating}</strong>
                </div>
                <div>
                  <span className="detail-label">Status</span>
                  <strong>{selectedReport.status}</strong>
                </div>
                <div>
                  <span className="detail-label">Prioridade</span>
                  <strong>{selectedReport.priority}</strong>
                </div>
                <div>
                  <span className="detail-label">Favorito</span>
                  <strong>{selectedReport.isFavorite ? "Sim" : "Nao"}</strong>
                </div>
              </div>

              <div className="divider-line" />

              <div className="report-block">
                <span className="detail-label">Resumo executivo</span>
                <p>{selectedReport.summary}</p>
              </div>

              <div className="report-columns">
                <div className="report-block">
                  <span className="detail-label">Pontos fortes</span>
                  <ul className="feature-list compact-list">
                    {selectedReport.strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="report-block">
                  <span className="detail-label">Riscos e alertas</span>
                  <ul className="feature-list compact-list">
                    {selectedReport.risks.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="report-columns">
                <div className="report-block">
                  <span className="detail-label">Recomendacao</span>
                  <p>{selectedReport.recommendation}</p>
                </div>

                <div className="report-block">
                  <span className="detail-label">Proxima acao</span>
                  <p>{selectedReport.nextAction}</p>
                </div>
              </div>

              <div className="report-block">
                <span className="detail-label">Observacoes complementares</span>
                <p>{selectedReport.notes}</p>
              </div>

              {selectedReport.relatedProfiles.length > 0 ? (
                <div className="report-link-list">
                  {selectedReport.relatedProfiles.map((profile) => (
                    <Link key={profile} href={profile} className="inline-link">
                      Abrir perfil relacionado
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p>Selecione um relatorio na lista para visualizar a ficha completa e exportar.</p>
          )}
        </article>
      </section>

      <section className="glass-panel">
        <div className="section-heading">
          <div>
            <p className="panel-tag">Favoritos integrados</p>
            <h2>Colecoes operacionais do scouting</h2>
          </div>
          <span className="badge accent">{favoriteCollections.length} colecoes</span>
        </div>

        <div className="card-grid">
          {favoriteCollections.map((item) => (
            <article key={`${item.slug}-${item.title}`} className="favorite-card favorite-full-card">
              <div className="section-heading">
                <div>
                  <p className="panel-tag">Colecao</p>
                  <h3>{item.title}</h3>
                </div>
                <span className="badge">{item.priority}</span>
              </div>

              <p>{item.text}</p>
              <div className="team-info-grid">
                <div>
                  <span className="detail-label">Objetivo</span>
                  <strong>{item.objective}</strong>
                </div>
                <div>
                  <span className="detail-label">Responsavel</span>
                  <strong>{item.owner}</strong>
                </div>
                <div>
                  <span className="detail-label">Proxima acao</span>
                  <strong>{item.nextAction}</strong>
                </div>
              </div>

              <ul className="feature-list">
                {item.items.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>

              <div className="report-link-list">
                {item.relatedProfiles?.slice(0, 3).map((profile) => (
                  <Link key={profile} href={profile} className="inline-link">
                    Abrir perfil relacionado
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
