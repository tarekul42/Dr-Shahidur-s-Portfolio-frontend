import { expect, test } from "@playwright/test";

test.describe("Appointment Form Wizard E2E", () => {
  test("shows Step 0 (Chamber Selection) initially on raw navigation", async ({
    page,
  }) => {
    await page.goto("/appointment");
    await page.waitForSelector('form[data-hydrated="true"]');
    await expect(
      page.getByText(/Where would you like to visit\?/i),
    ).toBeVisible();
    await expect(page.locator("#chamber-select")).toBeVisible();
    await expect(
      page.locator("#chamber-select option[value='dhaka']"),
    ).toContainText(/Ibn Sina Medical College Hospital/i);
  });

  test("validation errors trigger if no chamber is chosen", async ({
    page,
  }) => {
    await page.goto("/appointment");
    await page.waitForSelector('form[data-hydrated="true"]');
    await page.getByText(/Continue/i).click();
    await expect(page.getByText(/Chamber is required/i)).toBeVisible();
  });

  test("skips Step 0 and goes to Step 1 directly if query parameter is in URL", async ({
    page,
  }) => {
    await page.goto("/appointment?chamber=dhaka");
    await page.waitForSelector('form[data-hydrated="true"]');
    await expect(page.getByText(/Who is the patient\?/i)).toBeVisible();
    await expect(page.getByLabel(/Full Name/i)).toBeVisible();
  });

  test("can navigate to Step 1 by selecting a chamber", async ({ page }) => {
    await page.goto("/appointment");
    await page.waitForSelector('form[data-hydrated="true"]');
    await page.selectOption("#chamber-select", "dhaka");
    await page.getByText(/Continue/i).click();

    await expect(page.getByText(/Who is the patient\?/i)).toBeVisible();
  });

  test("validates required patient fields on Step 1", async ({ page }) => {
    await page.goto("/appointment?chamber=dhaka"); // skip Step 0
    await page.waitForSelector('form[data-hydrated="true"]');
    await expect(page.getByText(/Who is the patient\?/i)).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText(/Name is required/i)).toBeVisible();
    await expect(
      page.getByText(/Invalid Bangladesh phone format/i),
    ).toBeVisible();
  });

  test("validates phone number patterns on Step 1", async ({ page }) => {
    await page.goto("/appointment?chamber=dhaka");
    await page.waitForSelector('form[data-hydrated="true"]');
    await expect(page.getByText(/Who is the patient\?/i)).toBeVisible();
    await page.getByLabel(/Full Name/i).fill("John Doe");
    await page.getByLabel(/Phone Number/i).fill("017123"); // too short, no +88
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(
      page.getByText(/Invalid Bangladesh phone format/i),
    ).toBeVisible();
  });

  test("can navigate backward and forward in the wizard", async ({ page }) => {
    await page.goto("/appointment");
    await page.waitForSelector('form[data-hydrated="true"]');
    await page.selectOption("#chamber-select", "dhaka");
    await page.getByText(/Continue/i).click();

    await expect(page.getByText(/Who is the patient\?/i)).toBeVisible();

    // Click Back
    await page.getByRole("button", { name: "Back", exact: true }).click();
    await expect(
      page.getByText(/Where would you like to visit\?/i),
    ).toBeVisible();
  });
});
