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
  getResearchList,
  getResearchBySlug,
  fetchResearchClient,
} from "./research";

const mockedApi = vi.mocked(api);
const mockedServerFetch = vi.mocked(serverFetch);

describe("Research API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getResearchList (Server-Side)", () => {
    it("calls serverFetch with proper query string and config", async () => {
      const mockResult = { docs: [], totalDocs: 0, limit: 10, totalPages: 0, page: 1 };
      mockedServerFetch.mockResolvedValueOnce(mockResult);

      const result = await getResearchList({ page: 1, limit: 10, uploadType: "PDF" });
      
      expect(mockedServerFetch).toHaveBeenCalledWith(
        "/research?page=1&limit=10&uploadType=PDF",
        expect.objectContaining({ revalidate: 300, tags: ["research"] })
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe("getResearchBySlug (Server-Side)", () => {
    it("calls serverFetch with slug path", async () => {
      const mockResearch = { _id: "1", title: "Joint Reconstruction", slug: "joint-reconstruction" };
      mockedServerFetch.mockResolvedValueOnce(mockResearch);

      const result = await getResearchBySlug("joint-reconstruction");

      expect(mockedServerFetch).toHaveBeenCalledWith(
        "/research/joint-reconstruction",
        expect.objectContaining({ revalidate: 600, tags: ["research", "joint-reconstruction"] })
      );
      expect(result).toEqual(mockResearch);
    });
  });

  describe("fetchResearchClient (Client-Side Axios)", () => {
    it("returns PaginatedData directly when response data contains docs", async () => {
      const paginatedData = {
        docs: [{ _id: "1", title: "Joint Reconstruction" }],
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

      const result = await fetchResearchClient({ page: 1 });
      expect(result).toEqual(paginatedData);
      expect(mockedApi.get).toHaveBeenCalledWith("/research", { params: { page: 1 } });
    });

    it("falls back to plain array formatting if docs does not exist", async () => {
      const plainArray = [{ _id: "1", title: "Cartilage Repair" }];

      mockedApi.get.mockResolvedValueOnce({
        data: {
          statusCode: 200,
          success: true,
          message: "Fetched successfully",
          data: plainArray,
        },
      });

      const result = await fetchResearchClient({ page: 1 });
      expect(result.docs).toEqual(plainArray);
      expect(result.totalDocs).toBe(1);
      expect(result.page).toBe(1);
    });
  });
});
