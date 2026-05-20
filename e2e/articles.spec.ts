import { expect, test } from "@playwright/test";

test.describe("Articles", () => {
  test("loads articles page", async ({ page }) => {
    await page.goto("/articles");
    await expect(page).toHaveURL(/\/articles/);
    await expect(
      page.getByRole("heading", {
        name: "Articles & Medical Insights",
        level: 2,
      }),
    ).toBeVisible();
  });

  test("article detail page shows reading progress bar", async ({ page }) => {
    await page.goto("/articles");
    // Find first article link and click
    const articleLink = page
      .getByRole("link", { name: "Read Article" })
      .first();
    await expect(articleLink).toBeVisible();
    await articleLink.click();
    // Wait until we've navigated to a detail page
    await page.waitForURL(/\/articles\/.+/);
    // Reading progress bar should exist in DOM via stable testid
    await expect(page.getByTestId("reading-progress")).toBeAttached();
  });
});
