const DEFAULT_TIMEOUT_MS = 10000;

export async function fetchJson(url, init = {}, options = {}) {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: init.signal || controller.signal
    });
    const data = await response.json().catch(() => ({}));

    return { response, data };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Tempo limite excedido ao consultar o serviço externo.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
