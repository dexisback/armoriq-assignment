/**
 * Centralized API client.
 *
 * All frontend network calls go through this helper so that the base URL
 * is resolved from `process.env.NEXT_PUBLIC_API_URL` exactly once and
 * every request is routed correctly in both local dev and production.
 *
 * Usage:
 *   await api("/api/chat", { method: "POST", body: { ... } });
 *   await api.get("/api/tools");
 *   await api.post("/api/chat", { ... });
 */

const RAW_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

function joinUrl(path: string): string {
  if (!path) return RAW_BASE;
  // Absolute URLs pass through untouched.
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${RAW_BASE}${normalized}`;
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request(
  path: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { body, headers, ...rest } = options;

  const init: RequestInit = {
    ...rest,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(headers as Record<string, string> | undefined),
    },
  };

  if (body !== undefined) {
    init.body =
      typeof body === "string" ? body : JSON.stringify(body);
  }

  return fetch(joinUrl(path), init);
}

export const api = Object.assign(request, {
  get: (path: string, options?: RequestOptions) =>
    request(path, { ...options, method: "GET" }),
  post: (path: string, body?: unknown, options?: RequestOptions) =>
    request(path, { ...options, method: "POST", body }),
  put: (path: string, body?: unknown, options?: RequestOptions) =>
    request(path, { ...options, method: "PUT", body }),
  patch: (path: string, body?: unknown, options?: RequestOptions) =>
    request(path, { ...options, method: "PATCH", body }),
  delete: (path: string, options?: RequestOptions) =>
    request(path, { ...options, method: "DELETE" }),
});
