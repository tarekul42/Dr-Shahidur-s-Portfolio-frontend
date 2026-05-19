import { expect, test } from "@playwright/test";

test.describe("Chambers Dedicated Page E2E", () => {
  test("renders all chambers, detailed descriptions, schedules, maps, and CTAs", async ({
    page,
  }) => {
    await page.goto("/chambers");

    // Check headings
    await expect(
      page.getByRole("heading", { name: /Visit at a Chamber Near You/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/4 locations across Dhaka and Manikganj/i),
    ).toBeVisible();

    // Check chambers lists
    await expect(
      page.getByText("Ibn Sina Medical College Hospital").first(),
    ).toBeVisible();
    await expect(
      page.getByText("Payra Hospital Limited").first(),
    ).toBeVisible();
    expect(
      await page.getByText("Islami Bank Community Hospital, Manikganj").count(),
    ).toBeGreaterThan(0);
    expect(
      await page.getByText("Singair City Hospital & Diagnostic Center").count(),
    ).toBeGreaterThan(0);

    // Verify rooms/locations
    await expect(
      page.getByText("Room 205 (2nd Floor, Lift 1), Hospital Building"),
    ).toBeVisible();
    await expect(page.getByText("Room 103")).toBeVisible();

    // Check assistant contact details
    await expect(
      page.getByText("01777079696 (Farzana)", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("01619220033 (Mishu)", { exact: true }),
    ).toBeVisible();

    // Verify online app links are visible
    await expect(page.getByText("Ibn Sina Doctor Appointment")).toBeVisible();

    // Check map links are visible
    const mapLinks = page.getByRole("link", { name: /directions/i });
    expect(await mapLinks.count()).toBeGreaterThan(0);

    // Verify emergency call center hotline numbers
    await expect(page.getByText("+880 1777-079696").first()).toBeVisible();
    await expect(page.getByText("+880 1711-608502").first()).toBeVisible();

    // Click booking button on Jhitka chamber and verify it pre-fills the form
    await page.locator('a[href="/appointment?chamber=jhitka"]').first().click();
    await expect(page).toHaveURL(/\/appointment\?chamber=jhitka/);
    await expect(page.getByText(/Who is the patient\?/i)).toBeVisible();
  });
});
