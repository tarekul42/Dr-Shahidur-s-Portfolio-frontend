import { expect, test } from "@playwright/test";

test.describe("Appointment Form Wizard E2E", () => {
  test("shows Step 0 (Chamber Selection) initially on raw navigation", async ({
    page,
  }) => {
    await page.goto("/appointment");
    await expect(
      page.getByText(/Which chamber would you like to visit\?/i),
    ).toBeVisible();
    await expect(
      page.getByText(/Ibn Sina Medical College Hospital/i),
    ).toBeVisible();
  });

  test("validation errors trigger if no chamber is chosen", async ({
    page,
  }) => {
    await page.goto("/appointment");
    await page.getByText(/Continue/i).click();
    await expect(page.getByText(/Chamber is required/i)).toBeVisible();
  });

  test("skips Step 0 and goes to Step 1 directly if query parameter is in URL", async ({
    page,
  }) => {
    await page.goto("/appointment?chamber=dhaka");
    await expect(page.getByText(/Who is the patient\?/i)).toBeVisible();
    await expect(page.getByLabel(/Patient Name/i)).toBeVisible();
  });

  test("can navigate to Step 1 by clicking a chamber card", async ({
    page,
  }) => {
    await page.goto("/appointment");
    await page.getByText("Ibn Sina Medical College Hospital").click();
    await page.getByText(/Continue/i).click();

    await expect(page.getByText(/Who is the patient\?/i)).toBeVisible();
  });

  test("validates required patient fields on Step 1", async ({ page }) => {
    await page.goto("/appointment?chamber=dhaka"); // skip Step 0
    await page.getByText(/Continue/i).click();
    await expect(page.getByText(/Name is required/i)).toBeVisible();
    await expect(
      page.getByText(/Invalid Bangladesh phone format/i),
    ).toBeVisible();
  });

  test("validates phone number patterns on Step 1", async ({ page }) => {
    await page.goto("/appointment?chamber=dhaka");
    await page.getByLabel(/Patient Name/i).fill("John Doe");
    await page.getByLabel(/Phone Number/i).fill("017123"); // too short, no +88
    await page.getByText(/Continue/i).click();
    await expect(
      page.getByText(/Invalid Bangladesh phone format/i),
    ).toBeVisible();
  });

  test("can navigate backward and forward in the wizard", async ({ page }) => {
    await page.goto("/appointment");
    await page.getByText("Ibn Sina Medical College Hospital").click();
    await page.getByText(/Continue/i).click();

    await expect(page.getByText(/Who is the patient\?/i)).toBeVisible();

    // Click Back
    await page.getByRole("button", { name: /back/i }).click();
    await expect(
      page.getByText(/Which chamber would you like to visit\?/i),
    ).toBeVisible();
  });
});
