import { expect, test } from "@playwright/test";

test.describe("Contact Page Redirection & Form", () => {
  test("redirects from /contact to /chambers and loads page with contact form", async ({
    page,
  }) => {
    await page.goto("/contact");

    // Asserts URL redirection
    await expect(page).toHaveURL(/\/chambers/);

    // Verifies chambers page details are visible
    await expect(
      page.getByRole("heading", { name: /Visit at a Chamber Near You/i }),
    ).toBeVisible();

    // Verifies contact form fields inside ChambersContact are visible
    await expect(page.getByLabel(/Full Name/i)).toBeVisible();
    await expect(page.getByLabel(/Email Address/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /send message/i }),
    ).toBeVisible();
  });

  test("validates required fields on contact form", async ({ page }) => {
    await page.goto("/chambers");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(
      page.getByText(/Name must be at least 2 characters/i),
    ).toBeVisible();
    await expect(page.getByText(/Invalid email address/i)).toBeVisible();
  });
});
