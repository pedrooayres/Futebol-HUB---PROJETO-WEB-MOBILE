import { NextResponse } from "next/server";

const TECHNICAL_TOKEN_PATTERN = /\b(API|KEY|SECRET|TOKEN|REST|BACK4APP|GNEWS|LIVESCORE|API_FOOTBALL)[A-Z0-9_/-]*\b/i;

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

export function publicErrorMessage(error, fallback = "Não foi possível concluir a operação agora.") {
  const message = error?.message || fallback;

  if (TECHNICAL_TOKEN_PATTERN.test(message)) {
    return fallback;
  }

  return message;
}

export function jsonError(error, fallback, status = 500) {
  return NextResponse.json(
    {
      message: publicErrorMessage(error, fallback)
    },
    { status: error?.status || status }
  );
}
