import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Chamber } from "@/types/chamber";

export async function getChambers(): Promise<Chamber[]> {
  const { data } = await api.get<ApiResponse<Chamber[]>>("/chembers");
  return data.data;
}
