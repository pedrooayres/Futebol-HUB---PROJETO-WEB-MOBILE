"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import HomeDashboard from "@/components/HomeDashboard";

const initialForm = {
  playerName: "",
  club: "",
  position: "",
  rating: "80",
  status: "Em observacao",
  notes: ""
};

const productRoadmap = [
  "Login para scouts e clubes",
  "Filtros por posicao, nota e status",
  "Perfil completo do atleta",
  "Favoritos e comparacao",
  "Comparacao entre atletas",
  "Relatorios para apresentar talentos",
  "Upload de videos e highlights",
  "Dashboard mais analitico",
  "Versao mobile mais forte"
];

const positioningCards = [
  {
    title: "Plataforma de scouting esportivo",
    text: "O projeto deixa de ser apenas uma vitrine e passa a organizar observacoes reais sobre atletas."
  },
  {
    title: "Dashboard de inteligencia no futebol",
    text: "Indicadores, ranking externo e notas tecnicas ajudam a transformar dados em decisao."
  },
  {
    title: "Central de analise de atletas",
    text: "Tudo fica concentrado em uma experiencia unica: cadastro, status, avaliacao e acompanhamento."
  }
];

const pitchLayers = [
  {
    label: "Problema",
    title: "Avaliacoes ficam espalhadas",
    text: "Clubes, scouts e projetos de base precisam registrar observacoes sem depender de planilhas soltas ou mensagens perdidas."
  },
  {
    label: "Solucao",
    title: "O Futebol HUB centraliza o processo",
    text: "A plataforma junta observacoes, rankings, status dos atletas e acompanhamento em uma area organizada."
  },
  {
    label: "Diferencial",
    title: "Nao e so pagina visual",
    text: "O projeto tem CRUD, banco Back4App, API externa, rotas Next.js e deploy real na Vercel."
  }
];

const useCases = [
  "Escolinhas de futebol",
  "Scouts independentes",
  "Empresarios",
  "Projetos sociais esportivos",
  "Pequenos clubes",
  "Portal de conteudo esportivo"
];

const strategySteps = [
  {
    phase: "Agora",
    text: "Manter a base estavel e apresentar como prototipo real de produto."
  },
  {
    phase: "Versao 2",
    text: "Criar uma evolucao separada com login, perfis de atleta e recursos premium."
  },
  {
    phase: "Portfolio profissional",
    text: "Usar o projeto como caso completo: problema, solucao, tecnologia, deploy e roadmap."
  }
];

function getStatValue(stats, key) {
  return stats?.find((item) => item.name === key)?.displayValue || "--";
}

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

export default function HomePage() {
  return <HomeDashboard />;
}

function HomePageLegacy() {
  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState([]);
  const [table, setTable] = useState([]);
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

  async function loadStandings() {
    const response = await fetch("/api/standings");
    const data = await response.json();
    setTable(data.rows || []);
  }

  useEffect(() => {
    loadItems();
    loadStandings();
  }, []);

  const kpis = useMemo(() => {
    const approved = items.filter((item) => item.status === "Aprovado").length;
    const average =
      items.length > 0
        ? (items.reduce((sum, item) => sum + Number(item.rating || 0), 0) / items.length).toFixed(1)
        : "0.0";

    return [
      { label: "Jogadores monitorados", value: String(items.length).padStart(2, "0") },
      { label: "Aprovados para contato", value: String(approved).padStart(2, "0") },
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
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Futebol HUB Pro</span>
          <h1>Inteligencia esportiva para descobrir talentos</h1>
          <p>
            Um painel moderno para scouts, clubes e analistas avaliarem atletas, acompanharem
            indicadores e organizarem decisoes com dados.
          </p>

          <div className="hero-actions">
            <Link href="/scouting" className="primary-button">
              Abrir central de scouting
            </Link>
            <Link href="/ranking" className="ghost-button">
              Ver ranking externo
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <p className="card-label">Match Intelligence</p>
          <div className="metric-stack">
            {kpis.map((item) => (
              <div key={item.label} className="metric-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-strip">
        <span>Para escolinhas</span>
        <span>Para clubes</span>
        <span>Para empresarios</span>
        <span>Para scouts independentes</span>
      </section>

      <section className="strategy-section">
        <div className="section-heading">
          <div>
            <p className="panel-tag">Fase 1</p>
            <h2>Posicionamento do produto</h2>
          </div>
          <span className="badge accent">De site academico para MVP</span>
        </div>

        <div className="triple-grid">
          {positioningCards.map((card) => (
            <article key={card.title} className="glass-panel strategy-card">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pitch-grid">
        {pitchLayers.map((item) => (
          <article key={item.label} className="glass-panel pitch-card">
            <p className="panel-tag">Fase 2 | {item.label}</p>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="portal-links-grid">
        <Link href="/times" className="glass-panel portal-link-card">
          <p className="panel-tag">Clubes</p>
          <h2>Times</h2>
          <p>Veja destaques de equipes, leitura tática e contexto competitivo em formato portal.</p>
        </Link>
        <Link href="/jogadores" className="glass-panel portal-link-card">
          <p className="panel-tag">Talentos</p>
          <h2>Jogadores</h2>
          <p>Cards editoriais para reforcar a observacao de atletas com visual mais organizado.</p>
        </Link>
        <Link href="/favoritos" className="glass-panel portal-link-card">
          <p className="panel-tag">Curadoria</p>
          <h2>Favoritos</h2>
          <p>Uma area inspirada em portal para destacar colecoes e atalhos para o scouting.</p>
        </Link>
      </section>

      <section className="insights-grid">
        <article className="glass-panel highlight">
          <p className="panel-tag">Tema do projeto</p>
          <h2>Plataforma de scouting, analise e descoberta de talentos</h2>
          <p>
            O site combina dashboard, conteudo visual, CRUD completo e integracao com uma API
            publica para reforcar o requisito de dados externos.
          </p>
        </article>

        <article className="glass-panel">
          <p className="panel-tag">Back-end</p>
          <h3>Back4App via Parse REST API</h3>
          <p>
            A entidade principal e <strong>ScoutNotes</strong>, com cadastro, edicao, listagem e
            exclusao de observacoes sobre jogadores.
          </p>
        </article>

        <article className="glass-panel">
          <p className="panel-tag">API adicional</p>
          <h3>Tabela publica de futebol</h3>
          <p>
            O ranking abaixo consome dados externos para enriquecer a experiencia do usuario e
            deixar o dashboard mais vivo.
          </p>
        </article>
      </section>

      <section className="product-grid">
        <article className="glass-panel product-vision-card">
          <p className="panel-tag">Visao de produto</p>
          <h2>De trabalho academico para MVP esportivo</h2>
          <p>
            A base atual ja permite demonstrar um produto real: cadastrar jogadores, medir
            potencial, acompanhar status e usar dados externos como apoio para analise.
          </p>
        </article>

        <article className="glass-panel">
          <p className="panel-tag">Proximos passos</p>
          <h2>Roadmap sugerido</h2>
          <ul className="feature-list">
            {productRoadmap.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="market-section">
        <article className="glass-panel">
          <p className="panel-tag">Fase 4</p>
          <h2>Possiveis usos reais</h2>
          <p>
            O Futebol HUB pode ser direcionado para diferentes contextos do futebol, de base a
            mercado, sem perder a mesma estrutura principal de acompanhamento.
          </p>
          <div className="use-case-grid">
            {useCases.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>

        <article className="glass-panel strategy-timeline">
          <p className="panel-tag">Fase 5</p>
          <h2>Estrategia de evolucao</h2>
          {strategySteps.map((item) => (
            <div key={item.phase} className="timeline-step">
              <strong>{item.phase}</strong>
              <p>{item.text}</p>
            </div>
          ))}
        </article>
      </section>

      <section id="ranking">
        <article className="glass-panel table-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">API externa</p>
              <h2>Top 6 da Premier League</h2>
            </div>
            <span className="badge">Atualizacao automatica</span>
          </div>

          <div className="standings-list">
            {table.map((team, index) => (
              <div key={team.id} className="standing-row">
                <div className="standing-team">
                  <span className="standing-index">{index + 1}</span>
                  {team.logo ? <img src={team.logo} alt={team.name} /> : null}
                  <strong>{team.name}</strong>
                </div>
                <div className="standing-stats">
                  <span>{getStatValue(team.stats, "wins")}V</span>
                  <span>{getStatValue(team.stats, "losses")}D</span>
                  <span>{getStatValue(team.stats, "points")} pts</span>
                </div>
              </div>
            ))}
            {table.length === 0 ? <p>Nenhum dado externo foi carregado ainda.</p> : null}
          </div>
        </article>
      </section>

      <section id="crud" className="crud-grid">
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
                placeholder="Descreva pontos fortes, leitura tática e potencial de mercado."
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
              <h2>Central de scouting</h2>
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
    </main>
  );
}
