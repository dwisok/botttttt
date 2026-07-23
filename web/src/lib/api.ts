// Thin client for the SENTINEL backend API (apps/api). When VITE_API_URL is unset or the
// backend is unreachable, callers fall back to the built-in live simulation, so the landing
// always works standalone.

const RAW = import.meta.env.VITE_API_URL as string | undefined;
const API_URL = RAW ? RAW.replace(/\/$/, "") : undefined;
const API_KEY = (import.meta.env.VITE_API_KEY as string | undefined) ?? "dev-key-please-change";

/** True when a backend URL is configured (the app will try to use real data). */
export const apiConfigured = Boolean(API_URL);

export interface ApiRobot {
  robotId: string;
  wallet: string;
  operator: string;
  siteId: number;
  status: string; // ACTIVE | PAUSED | SLASHED
  stake: string;
}

/** GET /robots — returns null on any failure (caller falls back to the simulation). */
export async function fetchRobots(): Promise<ApiRobot[] | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/robots`, { headers: { "x-api-key": API_KEY } });
    if (!res.ok) return null;
    const data = (await res.json()) as { robots?: ApiRobot[] };
    return data.robots ?? null;
  } catch {
    return null;
  }
}

export interface LiveEvent {
  robotId: string | number;
  eventType: number;
  timestamp: number;
  geohash: string;
  isCritical?: boolean;
  status?: string;
}

/**
 * Subscribe to the live event stream (WS /ws). Calls onEvent for each accepted event the
 * ingestor publishes. Returns a disposer. No-op when no backend is configured.
 */
export function connectEvents(onEvent: (e: LiveEvent) => void, onOpen?: () => void): () => void {
  if (!API_URL) return () => {};
  let ws: WebSocket | null = null;
  try {
    const wsUrl = API_URL.replace(/^http/, "ws") + `/ws?apiKey=${encodeURIComponent(API_KEY)}`;
    ws = new WebSocket(wsUrl);
    ws.onopen = () => onOpen?.();
    ws.onmessage = (ev) => {
      try {
        onEvent(JSON.parse(ev.data as string) as LiveEvent);
      } catch {
        /* ignore malformed frames */
      }
    };
  } catch {
    /* backend not reachable — caller keeps the simulation */
  }
  return () => {
    try {
      ws?.close();
    } catch {
      /* noop */
    }
  };
}
