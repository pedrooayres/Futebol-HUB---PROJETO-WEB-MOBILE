import { buildPipelineSummary } from "@/lib/external-football-pipeline";
import { getImportTemplate } from "@/lib/pipeline-import";

const worldModePhases = [
  {
    title: "Fase 1 | Semi-automatica",
    text: "Receber dumps JSON padronizados e transformar esses dados em perfis ricos de times, jogadores e relatorios."
  },
  {
    title: "Fase 2 | Por ligas",
    text: "Atualizar ligas inteiras por lote com cron de ingestao, persistencia central e reprocessamento de perfis."
  },
  {
    title: "Fase 3 | Escala global",
    text: "Rodar coleta recorrente, consolidar fontes, gerar relatorios automaticamente e servir perfis para quase todo o mapa do futebol."
  }
];

export default function PipelinePage() {
  const summary = buildPipelineSummary();
  const template = getImportTemplate();

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Pipeline</span>
          <h1>Modo mundial</h1>
          <p>
            Base tecnica para sair de seeds manuais e entrar em ingestao estruturada, atualizacao por lote
            e geracao automatica de perfis e relatorios.
          </p>
        </div>

        <div className="mini-kpis four-up">
          <article className="mini-kpi-card">
            <strong>{summary.provider}</strong>
            <span>Motor atual</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{summary.status}</strong>
            <span>Status</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{summary.totals.teams + summary.totals.players + summary.totals.reports}</strong>
            <span>Seeds externas</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{summary.lastSyncLabel}</strong>
            <span>Ultima referencia</span>
          </article>
        </div>
      </section>

      <section className="card-grid">
        {worldModePhases.map((item) => (
          <article key={item.title} className="glass-panel report-index-card">
            <p className="panel-tag">Arquitetura</p>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="professional-grid">
        <article className="glass-panel">
          <p className="panel-tag">Contrato</p>
          <h2>Importacao padrao</h2>
          <ul className="feature-list">
            <li>`GET /api/pipeline` retorna resumo do pipeline e template oficial.</li>
            <li>`GET /api/pipeline/import` mostra instrucoes de uso.</li>
            <li>`POST /api/pipeline/import` normaliza um dump JSON em `teams`, `players` e `reports`.</li>
          </ul>
        </article>

        <article className="glass-panel">
          <p className="panel-tag">Slices</p>
          <h2>Blocos de dados</h2>
          <ul className="feature-list">
            {summary.slices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <article className="glass-panel">
        <p className="panel-tag">Template JSON</p>
        <h2>Modelo oficial de entrada</h2>
        <pre className="code-block">{JSON.stringify(template, null, 2)}</pre>
      </article>
    </main>
  );
}
