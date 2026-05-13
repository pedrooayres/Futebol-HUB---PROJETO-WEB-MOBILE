import { ValidationError } from "@/lib/api-errors";
import { parseListField } from "@/lib/report-utils";

const STATUS_VALUES = ["Em observacao", "Aprovado", "Descartado"];
const PRIORITY_VALUES = ["Alta", "Media", "Baixa"];

function cleanText(value, fieldName, options = {}) {
  const text = String(value || "").trim();

  if (options.required && !text) {
    throw new ValidationError(`${fieldName} é obrigatório.`);
  }

  if (options.maxLength && text.length > options.maxLength) {
    throw new ValidationError(`${fieldName} deve ter no máximo ${options.maxLength} caracteres.`);
  }

  return text;
}

function cleanEnum(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function cleanRating(value) {
  const rating = Number(value);

  if (!Number.isFinite(rating)) {
    throw new ValidationError("Nota técnica deve ser um número.");
  }

  if (rating < 0 || rating > 100) {
    throw new ValidationError("Nota técnica deve ficar entre 0 e 100.");
  }

  return Number(rating.toFixed(1));
}

export function buildScoutingBody(payload = {}) {
  return {
    playerName: cleanText(payload.playerName, "Nome do atleta", { required: true, maxLength: 120 }),
    club: cleanText(payload.club, "Clube", { required: true, maxLength: 120 }),
    position: cleanText(payload.position, "Posição", { required: true, maxLength: 80 }),
    rating: cleanRating(payload.rating),
    status: cleanEnum(payload.status, STATUS_VALUES, "Em observacao"),
    priority: cleanEnum(payload.priority, PRIORITY_VALUES, "Media"),
    reportSummary: cleanText(payload.reportSummary, "Síntese", { maxLength: 600 }),
    strengths: parseListField(payload.strengths).slice(0, 8),
    risks: parseListField(payload.risks).slice(0, 8),
    recommendation: cleanText(payload.recommendation, "Recomendação", { maxLength: 400 }),
    nextAction: cleanText(payload.nextAction, "Próxima ação", { maxLength: 240 }),
    isFavorite: Boolean(payload.isFavorite),
    notes: cleanText(payload.notes, "Observações", { maxLength: 2000 })
  };
}
