import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Import after mocking global fetch to avoid caching
import { serverFetch } from "@/lib/fetcher";

describe("serverFetch", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("returns data from ApiResponse wrapper", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        statusCode: 200,
        success: true,
        message: "OK",
        data: { doctorName: "Dr. Test" },
      }),
    });

    const result = await serverFetch<{ doctorName: string }>("/app-info");
    expect(result).toEqual({ doctorName: "Dr. Test" });
  });

  it("returns paginated data directly from data field", async () => {
    const paginatedData = {
      docs: [{ _id: "1", title: "Article 1" }],
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        statusCode: 200,
        success: true,
        message: "OK",
        data: paginatedData,
      }),
    });

    const result = await serverFetch("/articles");
    expect(result).toEqual(paginatedData);
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(serverFetch("/bad-endpoint")).rejects.toThrow(
      "API error: 500",
    );
  });

  it("passes revalidate and tags options", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        statusCode: 200,
        success: true,
        message: "OK",
        data: [],
      }),
    });

    await serverFetch("/articles", { revalidate: 300, tags: ["articles"] });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        next: { revalidate: 300, tags: ["articles"] },
      }),
    );
  });
});
