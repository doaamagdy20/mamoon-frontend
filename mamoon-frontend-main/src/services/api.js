// Central place for all HTTP config.
// Once the backend exists, set VITE_MOCK_MODE=false in .env and every
// function below will hit the real API instead of returning mock data —
// nothing outside this `services/` folder needs to change.

const BASE_URL = import.meta.env.VITE_API_URL || "";
const MOCK_MODE = import.meta.env.VITE_MOCK_MODE !== "false";
const TOKEN_KEY = "mamoun_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// Simulates real network latency in mock mode so loading states are
// actually visible/testable during development.
export function mockDelay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isMockMode() {
  return MOCK_MODE;
}

/**
 * Shared fetch wrapper. Attaches the auth token, throws a normalized
 * Error on non-2xx responses so callers can rely on try/catch alone.
 */
export async function request(path, { method = "GET", body, headers = {} } = {}) {
  const token = getToken();

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Network error — could not reach the server.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // empty body is fine (e.g. 204 No Content)
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data;
}
