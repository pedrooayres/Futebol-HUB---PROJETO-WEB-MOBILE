import Link from "next/link";
import { AdvancedOnly, CommonOnly } from "@/components/AccessVisibility";
import { notFound } from "next/navigation";

import { getMarketReportBySlug, marketReports } from "@/lib/football-data";

export function generateStaticParams() {
  return marketReports.map((report) => ({ slug: report.slug }));
}

export default async function MarketReportPage({ params }) {
  const { slug } = await params;
  const report = getMarketReportBySlug(slug);

  if (!report) {
    notFound();
  }

  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">External Report</span>
          <h1>{report.subject}</h1>
          <p>{report.executiveSummary}</p>
        </div>

        <div className="mini-kpis">
          <article className="mini-kpi-card">
            <strong>{report.rating}</strong>
            <span>Rating de oportunidade</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{report.marketWindow}</strong>
            <span>Janela</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{report.status}</strong>
            <span>Status do relatorio</span>
          </article>
          <article className="mini-kpi-card">
            <strong>{report.source}</strong>
            <span>Origem do relatorio</span>
          </article>
        </div>
      </section>

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
              <strong>{report.club}</strong>
            </div>
            <div>
              <span className="detail-label">Perfil</span>
              <strong>{report.profileType}</strong>
            </div>
            <div>
              <span className="detail-label">Horizonte</span>
              <strong>{report.horizon}</strong>
            </div>
          </div>

          <div className="divider-line" />

          <div className="list-stack">
            {report.reportBody.map((paragraph) => (
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
                {report.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="report-block">
              <span className="detail-label">Riscos</span>
              <ul className="feature-list compact-list">
                {report.risks.map((item) => (
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
            <p>{report.executiveSummary}</p>
            <p>
              {report.club} • {report.profileType} • {report.status}
            </p>
          </article>
        </section>
      </CommonOnly>

      <AdvancedOnly>
      <article className="glass-panel">
        <p className="panel-tag">Recomendacoes</p>
        <h2>Encaminhamento de monitoramento</h2>
        <ul className="feature-list">
          {report.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="report-link-list">
          {report.relatedProfiles.map((profile) => (
            <Link key={profile} href={profile} className="inline-link">
              Abrir perfil relacionado
            </Link>
          ))}
        </div>
      </article>
      </AdvancedOnly>
    </main>
  );
}
