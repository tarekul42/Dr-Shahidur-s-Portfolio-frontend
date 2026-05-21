import { isAxiosError } from "axios";
import { api } from "@/lib/axios";

export interface TrackPayload {
  page: string;
  sessionId: string;
  visitorId?: string;
  referrer?: string;
}

export function isAnalyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DISABLE_ANALYTICS !== "true";
}

export async function trackPageView(payload: TrackPayload): Promise<void> {
  if (!isAnalyticsEnabled()) return;

  try {
    await api.post("/analytics/track", payload);
  } catch (error) {
    // Do not surface rate limits or backend outages to users or test logs
    if (isAxiosError(error) && error.response?.status === 429) return;
  }
}
