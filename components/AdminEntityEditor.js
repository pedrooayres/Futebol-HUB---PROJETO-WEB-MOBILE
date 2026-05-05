"use client";

import { useEffect, useState } from "react";

import { useEntityOverrides } from "@/components/EntityOverridesProvider";

const FIELD_CONFIG = {
  teams: [
    { key: "name", label: "Nome do time" },
    { key: "league", label: "Liga" },
    { key: "coach", label: "Comissao tecnica" },
    { key: "system", label: "Sistema base" },
    { key: "phase", label: "Momento competitivo" },
    { key: "marketFocus", label: "Foco de mercado" },
    { key: "profile", label: "Perfil competitivo", multiline: true },
    { key: "style", label: "Estilo de jogo", multiline: true },
    { key: "moment", label: "Leitura de momento", multiline: true },
    { key: "reportSummary", label: "Resumo executivo", multiline: true }
  ],
  players: [
    { key: "name", label: "Nome do atleta" },
    { key: "club", label: "Clube" },
    { key: "role", label: "Funcao" },
    { key: "age", label: "Idade" },
    { key: "foot", label: "Pe dominante" },
    { key: "nationality", label: "Nacionalidade" },
    { key: "height", label: "Altura" },
    { key: "status", label: "Status interno" },
    { key: "contractStatus", label: "Leitura contratual" },
    { key: "marketMoment", label: "Momento de mercado" },
    { key: "profile", label: "Perfil competitivo", multiline: true },
    { key: "summary", label: "Sintese tecnica", multiline: true },
    { key: "reportSummary", label: "Resumo executivo", multiline: true }
  ],
  reports: [
    { key: "subject", label: "Assunto" },
    { key: "club", label: "Clube" },
    { key: "status", label: "Status" },
    { key: "profileType", label: "Tipo de perfil" },
    { key: "horizon", label: "Horizonte" },
    { key: "marketWindow", label: "Janela de mercado" },
    { key: "executiveSummary", label: "Resumo executivo", multiline: true }
  ]
};

function buildInitialForm(type, entity) {
  const safeEntity = entity ?? {};
  const fields = FIELD_CONFIG[type] || FIELD_CONFIG.reports;

  return fields.reduce((accumulator, field) => {
    accumulator[field.key] = safeEntity[field.key] || "";
    return accumulator;
  }, {});
}

export default function AdminEntityEditor({ open, onClose, type, entity }) {
  const { saveOverride, clearOverride } = useEntityOverrides();
  const [form, setForm] = useState(buildInitialForm(type, entity));
  const fields = FIELD_CONFIG[type] || FIELD_CONFIG.reports;

  useEffect(() => {
    setForm(buildInitialForm(type, entity));
  }, [entity, type]);

  if (!open || !entity?.slug) {
    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSave() {
    saveOverride(type, entity.slug, form);
    onClose();
  }

  function handleReset() {
    clearOverride(type, entity.slug);
    onClose();
  }

  return (
    <div className="access-overlay">
      <div className="glass-panel access-modal">
        <div className="section-heading">
          <div>
            <p className="panel-tag">Edicao manual</p>
            <h2>{entity.name || entity.subject}</h2>
          </div>
          <button type="button" className="primary-button" onClick={handleSave}>
            Salvar
          </button>
        </div>
        <p>Essas alteracoes ficam disponiveis para o admin no navegador atual e sobrepoem os dados-base do perfil.</p>

        <div className="admin-editor-grid">
          {fields.map(({ key, label, multiline }) => (
            <label key={key} className="scout-form">
              <span className="detail-label">{label}</span>
              {multiline ? (
                <textarea name={key} value={form[key] || ""} onChange={handleChange} rows="4" />
              ) : (
                <input name={key} value={form[key] || ""} onChange={handleChange} />
              )}
            </label>
          ))}
        </div>

        <div className="form-actions admin-editor-actions">
          <button type="button" className="primary-button" onClick={handleSave}>
            Salvar ajuste
          </button>
          <button type="button" className="ghost-button" onClick={handleReset}>
            Remover override
          </button>
          <button type="button" className="ghost-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
