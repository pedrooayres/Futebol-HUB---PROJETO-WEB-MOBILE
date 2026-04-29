"use client";

import { useAccess } from "@/components/AccessProvider";

export default function QuickModeSummary({
  commonTitle = "Leitura direta",
  commonText = "Visao resumida para acompanhar rapidamente desempenho, contexto e destaques.",
  professionalTitle = "Leitura aprofundada",
  professionalText = "Contexto tecnico mais completo para profissionais de scouting e analise.",
  adminTitle = "Controle total",
  adminText = "Acesso manual a edicao, atualizacao e operacao dos dados do produto."
}) {
  const { isCommon, isProfessional, isAdmin } = useAccess();

  const payload = isAdmin
    ? { title: adminTitle, text: adminText }
    : isProfessional
      ? { title: professionalTitle, text: professionalText }
      : { title: commonTitle, text: commonText };

  return (
    <article className="glass-panel mode-summary-card">
      <p className="panel-tag">Modo atual</p>
      <h2>{payload.title}</h2>
      <p>{payload.text}</p>
      {isCommon ? <span className="badge">Padrao</span> : null}
      {isProfessional ? <span className="badge accent">Profissional</span> : null}
      {isAdmin ? <span className="badge accent">Admin</span> : null}
    </article>
  );
}
