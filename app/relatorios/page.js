"use client";

import Link from "next/link";

import { useAccess } from "@/components/AccessProvider";
import { dataSourceSummary, marketReports } from "@/lib/football-data";

export default function ReportsPage() {
  const { isCommon } = useAccess();
  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Market Reports</span>
          <h1>Relatorios externos</h1>
          <p>
            {isCommon
              ? "Biblioteca de leituras prontas para abrir um nome e entender rapidamente o contexto geral."
              : "Biblioteca de leituras de mercado para ampliar a plataforma alem do CRUD interno, com foco em contexto competitivo, encaixe e oportunidade."}
          </p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{marketReports.length}</strong>
            <span>Relatorios publicados</span>
          </article>
          <article className="mini-kpi-card">
            <strong>Mercado</strong>
            <span>Fonte principal</span>
          </article>
          <article className="mini-kpi-card">
            <strong>Expandido</strong>
            <span>Indice de busca</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{dataSourceSummary.lastSyncLabel}</strong>
            <span>Ultimo sync logico</span>
          </article>
        </div>
      </section>

      <section className="report-index-grid">
        {marketReports.map((report) => (
          <article key={report.slug} className="glass-panel report-index-card">
            <div className="section-heading">
              <div>
                <p className="panel-tag">{report.club}</p>
                <h2>{report.subject}</h2>
              </div>
              <span className="badge accent">{report.rating}</span>
            </div>

            <p>{report.executiveSummary}</p>

            <div className="report-meta-grid">
              <div>
                <span className="detail-label">Perfil</span>
                <strong>{report.profileType}</strong>
              </div>
              {!isCommon ? (
                <>
                  <div>
                    <span className="detail-label">Janela</span>
                    <strong>{report.marketWindow}</strong>
                  </div>
                  <div>
                    <span className="detail-label">Horizonte</span>
                    <strong>{report.horizon}</strong>
                  </div>
                </>
              ) : null}
            </div>

            <div className="report-tag-row">
              {report.strengths.slice(0, 3).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <Link href={`/relatorios/${report.slug}`} className="inline-link">
              Abrir relatorio completo
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
