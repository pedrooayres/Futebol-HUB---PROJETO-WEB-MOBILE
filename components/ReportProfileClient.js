"use client";

import Link from "next/link";
import { useState } from "react";

import AdminEntityEditor from "@/components/AdminEntityEditor";
import { useAccess } from "@/components/AccessProvider";
import { AdvancedOnly, CommonOnly } from "@/components/AccessVisibility";
import { useEntityOverrides } from "@/components/EntityOverridesProvider";

export default function ReportProfileClient({ report }) {
  const { isAdmin } = useAccess();
  const { applyOverride } = useEntityOverrides();
  const [editing, setEditing] = useState(false);
  const resolvedReport = applyOverride("reports", report);

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">External Report</span>
          <h1>{resolvedReport.subject}</h1>
          <p>{resolvedReport.executiveSummary}</p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{resolvedReport.rating}</strong>
            <span>Rating de oportunidade</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{resolvedReport.marketWindow}</strong>
            <span>Janela</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{resolvedReport.status}</strong>
            <span>Status do relatorio</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{resolvedReport.source}</strong>
            <span>Origem do relatorio</span>
          </article>
        </div>
      </section>

      {isAdmin ? (
        <section className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Controle admin</p>
              <h2>Editar relatorio</h2>
            </div>
            <button type="button" className="icon-mini-button" onClick={() => setEditing(true)}>
              Editar perfil
            </button>
          </div>
          <p>Atualize a leitura executiva do relatorio diretamente dentro da pagina aberta.</p>
        </section>
      ) : null}

      <section className="professional-grid">
        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Leitura executiva</p>
              <h2>Contexto de mercado</h2>
            </div>
          </div>

          <div className="report-meta-grid">
            <div>
              <span className="detail-label">Clube</span>
              <strong>{resolvedReport.club}</strong>
            </div>
            <div>
              <span className="detail-label">Perfil</span>
              <strong>{resolvedReport.profileType}</strong>
            </div>
            <div>
              <span className="detail-label">Horizonte</span>
              <strong>{resolvedReport.horizon}</strong>
            </div>
          </div>

          <div className="divider-line" />
          <div className="list-stack">
            {resolvedReport.reportBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <article className="glass-panel">
          <div className="section-heading">
            <div>
              <p className="panel-tag">Sintese tecnica</p>
              <h2>Pontos de decisao</h2>
            </div>
          </div>

          <div className="report-columns">
            <div className="report-block">
              <span className="detail-label">Forcas</span>
              <ul className="feature-list compact-list">
                {resolvedReport.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="report-block">
              <span className="detail-label">Riscos</span>
              <ul className="feature-list compact-list">
                {resolvedReport.risks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>

      <CommonOnly>
        <section className="professional-grid">
          <article className="glass-panel">
            <p className="panel-tag">Resumo rapido</p>
            <h2>Leitura direta</h2>
            <p>{resolvedReport.executiveSummary}</p>
            <p>
              {resolvedReport.club} | {resolvedReport.profileType} | {resolvedReport.status}
            </p>
          </article>
        </section>
      </CommonOnly>

      <AdvancedOnly>
        <article className="glass-panel">
          <p className="panel-tag">Recomendacoes</p>
          <h2>Encaminhamento de monitoramento</h2>
          <ul className="feature-list">
            {resolvedReport.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="report-link-list">
            {resolvedReport.relatedProfiles.map((profile) => (
              <Link key={profile} href={profile} className="inline-link">
                Abrir perfil relacionado
              </Link>
            ))}
          </div>
        </article>
      </AdvancedOnly>

      <AdminEntityEditor open={editing} entity={resolvedReport} type="reports" onClose={() => setEditing(false)} />
    </main>
  );
}
