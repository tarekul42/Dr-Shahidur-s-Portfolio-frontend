import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock axios globally
vi.mock("@/lib/axios", () => ({
  api: {
    get: vi.fn(),
  },
}));

// Mock serverFetch
vi.mock("@/lib/fetcher", () => ({
  serverFetch: vi.fn(),
}));

import { api } from "@/lib/axios";
import { serverFetch } from "@/lib/fetcher";
import {
  getArticles,
  getArticleBySlug,
  getCategories,
  fetchArticlesClient,
} from "./articles";

const mockedApi = vi.mocked(api);
const mockedServerFetch = vi.mocked(serverFetch);

describe("Articles API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getArticles (Server-Side)", () => {
    it("calls serverFetch with proper query string and config", async () => {
      const mockResult = { docs: [], totalDocs: 0, limit: 10, totalPages: 0, page: 1 };
      mockedServerFetch.mockResolvedValueOnce(mockResult);

      const result = await getArticles({ page: 2, limit: 5, category: "orthopedics" });
      
      expect(mockedServerFetch).toHaveBeenCalledWith(
        "/articles?page=2&limit=5&category=orthopedics",
        expect.objectContaining({ revalidate: 300, tags: ["articles"] })
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe("getArticleBySlug (Server-Side)", () => {
    it("calls serverFetch with slug path", async () => {
      const mockArticle = { _id: "1", title: "Knee Surgery", slug: "knee-surgery" };
      mockedServerFetch.mockResolvedValueOnce(mockArticle);

      const result = await getArticleBySlug("knee-surgery");

      expect(mockedServerFetch).toHaveBeenCalledWith(
        "/articles/knee-surgery",
        expect.objectContaining({ revalidate: 600, tags: ["article", "knee-surgery"] })
      );
      expect(result).toEqual(mockArticle);
    });
  });

  describe("getCategories (Server-Side)", () => {
    it("calls serverFetch for categories path", async () => {
      mockedServerFetch.mockResolvedValueOnce(["Knee", "Hip"]);

      const result = await getCategories();

      expect(mockedServerFetch).toHaveBeenCalledWith(
        "/articles/categories",
        expect.objectContaining({ revalidate: 300, tags: ["categories"] })
      );
      expect(result).toEqual(["Knee", "Hip"]);
    });
  });

  describe("fetchArticlesClient (Client-Side Axios)", () => {
    it("returns PaginatedData directly when response data contains docs", async () => {
      const paginatedData = {
        docs: [{ _id: "1", title: "Knee Surgery" }],
        totalDocs: 1,
        limit: 10,
        totalPages: 1,
        page: 1,
      };

      mockedApi.get.mockResolvedValueOnce({
        data: {
          statusCode: 200,
          success: true,
          message: "Fetched successfully",
          data: paginatedData,
        },
      });

      const result = await fetchArticlesClient({ page: 1 });
      expect(result).toEqual(paginatedData);
      expect(mockedApi.get).toHaveBeenCalledWith("/articles", { params: { page: 1 } });
    });

    it("falls back to plain array formatting if docs does not exist", async () => {
      const plainArray = [{ _id: "1", title: "Hip Replacement" }];

      mockedApi.get.mockResolvedValueOnce({
        data: {
          statusCode: 200,
          success: true,
          message: "Fetched successfully",
          data: plainArray,
        },
      });

      const result = await fetchArticlesClient({ page: 2 });
      expect(result.docs).toEqual(plainArray);
      expect(result.totalDocs).toBe(1);
      expect(result.page).toBe(1);
    });
  });
});
