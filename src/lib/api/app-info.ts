import { cache } from "react";
import { serverFetch } from "@/lib/fetcher";
import type { AppInfo } from "@/types/app-info";

export const getAppInfo = cache(async (): Promise<AppInfo> => {
  return serverFetch<AppInfo>("/app-info", {
    revalidate: 3600,
    tags: ["app-info"],
  });
});
