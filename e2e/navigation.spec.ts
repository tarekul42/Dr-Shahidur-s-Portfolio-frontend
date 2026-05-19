import { expect, test } from "@playwright/test";

test.describe("Navigation & Localization E2E", () => {
  test("main navigation links redirect to correct pages", async ({ page }) => {
    await page.goto("/");

    // Nav list includes Chambers page
    const navLinks = [
      { name: /About/i, url: /\/about/ },
      { name: /Chambers/i, url: /\/chambers/ },
      { name: /Articles/i, url: /\/articles/ },
    ];

    for (const link of navLinks) {
      const el = page.locator(`nav >> text=${link.name.source}`).first();
      if (await el.isVisible()) {
        await el.click();
        await expect(page).toHaveURL(link.url);
        await page.goto("/"); // back home
      }
    }
  });

  test("language toggle switches interface languages", async ({ page }) => {
    await page.goto("/");

    // Check initial English state
    await expect(
      page.getByRole("link", { name: /Book Appointment/i }).first(),
    ).toBeVisible();

    // Toggle language (EN | বা button)
    const toggle = page.getByRole("button", { name: /Switch to Bengali/i });
    if (await toggle.isVisible()) {
      await toggle.click();

      // Expect Bengali text
      await expect(
        page.getByRole("link", { name: /অ্যাপয়েন্টমেন্ট বুক করুন/i }).first(),
      ).toBeVisible();

      // Toggle back to English
      await page.getByRole("button", { name: /Switch to English/i }).click();
      await expect(
        page.getByRole("link", { name: /Book Appointment/i }).first(),
      ).toBeVisible();
    }
  });
});
