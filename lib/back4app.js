import { fetchJson } from "@/lib/http-client";

const serverUrl = process.env.BACK4APP_SERVER_URL || "https://parseapi.back4app.com";
const appId = process.env.BACK4APP_APP_ID;
const restKey = process.env.BACK4APP_REST_KEY;
const className = process.env.BACK4APP_CLASS_NAME || "ScoutNotes";

function getHeaders() {
  return {
    "X-Parse-Application-Id": appId,
    "X-Parse-REST-API-Key": restKey,
    "Content-Type": "application/json"
  };
}

export function hasBack4AppConfig() {
  return Boolean(appId && restKey);
}

export function getClassName() {
  return className;
}

export async function back4appRequest(path = "", init = {}) {
  if (!hasBack4AppConfig()) {
    throw new Error("Base de scouting ainda não configurada.");
  }

  const { response, data } = await fetchJson(`${serverUrl}/classes/${className}${path}`, {
    ...init,
    headers: {
      ...getHeaders(),
      ...(init.headers || {})
    },
    cache: "no-store"
  }, { timeoutMs: 12000 });

  if (!response.ok) {
    const message = data?.error || "Falha ao comunicar com o Back4App.";
    throw new Error(message);
  }

  return data;
}
