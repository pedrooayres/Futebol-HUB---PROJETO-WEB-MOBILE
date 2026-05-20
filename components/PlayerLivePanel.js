"use client";

import { useEffect, useState } from "react";

export default function PlayerLivePanel({ playerName, season = "2025" }) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadLivePlayer() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/football/player?name=${encodeURIComponent(playerName)}&season=${encodeURIComponent(season)}`
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
          setError("Falha ao carregar a cobertura live do jogador.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadLivePlayer();

    return () => {
      active = false;
    };
  }, [playerName, season]);

  const stats = payload?.statistics;
  const transfers = payload?.transfers || [];
  const trophies = payload?.trophies || [];
  const isConfigured = payload?.configured !== false;
  const hasLiveData = Boolean(payload?.player || stats || transfers.length || trophies.length);

  return (
    <section className="professional-grid">
      <article className="glass-panel">
        <div className="section-heading">
          <div>
            <p className="panel-tag">API-Football</p>
            <h2>Snapshot live do atleta</h2>
          </div>
          <span className="badge">{isConfigured ? "Live" : "Nao configurada"}</span>
        </div>

        {loading ? <p>Consultando dados atualizados do jogador...</p> : null}
        {!loading && error ? <p className="warning">{error}</p> : null}
        {!loading && !hasLiveData ? (
          <div className="note-list">
            <article className="note-card">
              <div className="note-header">
                <div>
                  <h3>{isConfigured ? "Sem snapshot encontrado" : "Fonte live pendente"}</h3>
                  <p>
                    {isConfigured
                      ? "A busca live nao retornou estatisticas para este nome e temporada."
                      : "Configure a chave API-Football na Vercel para liberar estatisticas, transferencias e titulos do atleta."}
                  </p>
                </div>
                <span className="status-pill">{season}</span>
              </div>
            </article>
          </div>
        ) : null}

        {!loading && payload?.player ? (
          <div className="player-meta-grid">
            <span>{payload.team?.name || "--"}</span>
            <span>{payload.league?.name || "--"}</span>
            <span>{payload.player.age || "--"} anos</span>
            <span>{payload.player.nationality || "--"}</span>
            <span>{payload.player.height || "--"}</span>
            <span>{payload.player.weight || "--"}</span>
            <span>{payload.player.injured ? "Lesionado" : "Disponivel"}</span>
            <span>Temporada {season}</span>
          </div>
        ) : null}

        {!loading && stats ? (
          <>
            <div className="divider-line" />
            <div className="report-meta-grid">
              <div>
                <span className="detail-label">Jogos</span>
                <strong>{stats.appearances}</strong>
              </div>
              <div>
                <span className="detail-label">Titular</span>
                <strong>{stats.starts}</strong>
              </div>
              <div>
                <span className="detail-label">Minutos</span>
                <strong>{stats.minutes}</strong>
              </div>
              <div>
                <span className="detail-label">Rating</span>
                <strong>{stats.rating}</strong>
              </div>
              <div>
                <span className="detail-label">Gols</span>
                <strong>{stats.goals}</strong>
              </div>
              <div>
                <span className="detail-label">Assistencias</span>
                <strong>{stats.assists}</strong>
              </div>
              <div>
                <span className="detail-label">Finalizacoes</span>
                <strong>{stats.shots}</strong>
              </div>
              <div>
                <span className="detail-label">No alvo</span>
                <strong>{stats.shotsOnTarget}</strong>
              </div>
              <div>
                <span className="detail-label">Passes-chave</span>
                <strong>{stats.keyPasses}</strong>
              </div>
              <div>
                <span className="detail-label">Desarmes</span>
                <strong>{stats.tackles}</strong>
              </div>
              <div>
                <span className="detail-label">Duelo ganho</span>
                <strong>{stats.duelsWon}/{stats.duelsTotal}</strong>
              </div>
              <div>
                <span className="detail-label">Dribles certos</span>
                <strong>{stats.dribbles}</strong>
              </div>
            </div>
          </>
        ) : null}
      </article>

      <article className="glass-panel">
        <div className="section-heading">
          <div>
            <p className="panel-tag">API-Football</p>
            <h2>Mercado e historico</h2>
          </div>
        </div>

        {loading ? <p>Montando leitura de mercado...</p> : null}
        {!loading && transfers.length === 0 && trophies.length === 0 ? (
          <div className="note-list">
            <article className="note-card">
              <div className="note-header">
                <div>
                  <h3>Sem mercado live carregado</h3>
                  <p>Quando a fonte estiver ativa, este bloco passa a mostrar transferencias recentes e titulos.</p>
                </div>
              </div>
            </article>
          </div>
        ) : null}

        {!loading && transfers.length > 0 ? (
          <>
            <p className="panel-tag">Transferencias recentes</p>
            <ul className="feature-list">
              {transfers.map((item) => (
                <li key={`${item.date}-${item.to}`}>
                  {item.date || "--"} | {item.from} {"->"} {item.to} | {item.type || "Transferencia"}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {!loading && trophies.length > 0 ? (
          <>
            <div className="divider-line" />
            <p className="panel-tag">Titulos</p>
            <ul className="feature-list">
              {trophies.map((item, index) => (
                <li key={`${item.league}-${item.season}-${index}`}>
                  {item.league} | {item.season} | {item.place}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </article>
    </section>
  );
}
