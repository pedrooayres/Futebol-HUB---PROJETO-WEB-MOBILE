"use client";

import { useAccess } from "@/components/AccessProvider";

export default function QuickModeSummary({
  commonTitle = "Leitura direta",
  commonText = "Visão resumida para acompanhar rapidamente desempenho, contexto e destaques.",
  professionalTitle = "Leitura aprofundada",
  professionalText = "Contexto técnico mais completo para profissionais de scouting e análise.",
  adminTitle = "Controle total",
  adminText = "Acesso manual a edição, atualização e operação dos dados do produto."
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
      {isCommon ? <span className="badge">Padrão</span> : null}
      {isProfessional ? <span className="badge accent">Profissional</span> : null}
      {isAdmin ? <span className="badge accent">Admin</span> : null}
    </article>
  );
}
