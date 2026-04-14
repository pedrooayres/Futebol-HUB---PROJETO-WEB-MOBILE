"use client";

import { useEffect, useMemo, useState } from "react";

const initialForm = {
  playerName: "",
  club: "",
  position: "",
  rating: "80",
  status: "Em observacao",
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

export default function ScoutingWorkspace({
  title = "Central de scouting",
  subtitle = "CRUD completo integrado ao Back4App para criacao, edicao e exclusao de observacoes."
}) {
  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loadingCrud, setLoadingCrud] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [backStatus, setBackStatus] = useState("");

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

  const kpis = useMemo(() => {
    const approved = items.filter((item) => item.status === "Aprovado").length;
    const average =
      items.length > 0
        ? (items.reduce((sum, item) => sum + Number(item.rating || 0), 0) / items.length).toFixed(1)
        : "0.0";

    return [
      { label: "Registros ativos", value: String(items.length).padStart(2, "0") },
      { label: "Aprovados", value: String(approved).padStart(2, "0") },
      { label: "Media tecnica", value: average }
    ];
  }, [items]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
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
    setMessage(editingId ? "Observacao atualizada com sucesso." : "Observacao criada com sucesso.");
    setSaving(false);
    await loadItems();
  }

  function handleEdit(item) {
    setEditingId(item.objectId);
    setForm({
      playerName: item.playerName || "",
      club: item.club || "",
      position: item.position || "",
      rating: String(item.rating || 80),
      status: item.status || "Em observacao",
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

    setMessage("Observacao removida com sucesso.");
    await loadItems();
  }

  return (
    <section className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Scouting Room</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="mini-kpis">
          {kpis.map((item) => (
            <article key={item.label} className="mini-kpi-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="crud-grid">
        <article className="glass-panel form-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">CRUD principal</p>
              <h2>{editingId ? "Editar observacao" : "Nova observacao"}</h2>
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

            <div className="split-fields">
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
            </div>

            <label>
              Observacoes
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="5"
                placeholder="Descreva pontos fortes, leitura tatica e potencial de mercado."
                required
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="primary-button" disabled={saving}>
                {saving ? "Salvando..." : editingId ? "Atualizar observacao" : "Criar observacao"}
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
              <p className="panel-tag">Lista integrada</p>
              <h2>Observacoes recentes</h2>
            </div>
            <span className="badge">{items.length} registros</span>
          </div>

          {loadingCrud ? <p>Carregando observacoes...</p> : null}

          <div className="scout-list">
            {items.map((item) => (
              <article key={item.objectId} className="scout-card">
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

                <div className="scout-meta">
                  <strong>{item.rating}</strong>
                  <span>nota tecnica</span>
                </div>

                <p className="scout-notes">{item.notes}</p>

                <div className="card-actions">
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
                    onClick={() => handleDelete(item.objectId)}
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
                crie sua primeira observacao.
              </p>
            ) : null}
          </div>
        </article>
      </section>
    </section>
  );
}
