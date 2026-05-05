"use client";

import { useEffect, useState } from "react";

import { useEntityOverrides } from "@/components/EntityOverridesProvider";

function buildInitialForm(type, entity) {
  const safeEntity = entity ?? {};

  if (type === "teams") {
    return {
      name: safeEntity.name || "",
      league: safeEntity.league || "",
      system: safeEntity.system || "",
      phase: safeEntity.phase || "",
      marketFocus: safeEntity.marketFocus || "",
      reportSummary: safeEntity.reportSummary || ""
    };
  }

  if (type === "players") {
    return {
      name: safeEntity.name || "",
      club: safeEntity.club || "",
      role: safeEntity.role || "",
      status: safeEntity.status || "",
      marketMoment: safeEntity.marketMoment || "",
      reportSummary: safeEntity.reportSummary || ""
    };
  }

  return {
    subject: safeEntity.subject || "",
    club: safeEntity.club || "",
    status: safeEntity.status || "",
    profileType: safeEntity.profileType || "",
    marketWindow: safeEntity.marketWindow || "",
    executiveSummary: safeEntity.executiveSummary || ""
  };
}

export default function AdminEntityEditor({ open, onClose, type, entity }) {
  const { saveOverride, clearOverride } = useEntityOverrides();
  const [form, setForm] = useState(buildInitialForm(type, entity));

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
        <p className="panel-tag">Edicao manual</p>
        <h2>{entity.name || entity.subject}</h2>
        <p>Essas alteracoes ficam disponiveis para o admin no navegador atual e sobrepoem os dados-base do perfil.</p>

        <div className="admin-editor-grid">
          {Object.entries(form).map(([key, value]) => (
            <label key={key} className="scout-form">
              <span className="detail-label">{key}</span>
              {String(value).length > 80 ? (
                <textarea name={key} value={value} onChange={handleChange} rows="4" />
              ) : (
                <input name={key} value={value} onChange={handleChange} />
              )}
            </label>
          ))}
        </div>

        <div className="form-actions">
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
