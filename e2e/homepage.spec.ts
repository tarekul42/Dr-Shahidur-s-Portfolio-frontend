import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows hero section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Advanced Surgery/i, level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Book Consultation/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Explore Articles/i }).first(),
    ).toBeVisible();
  });

  test("navigates to appointment page from hero CTA", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: /Book Consultation/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/appointment/);
  });

  test("navigates to articles page from hero CTA", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: /Explore Articles/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/articles/);
  });
});
