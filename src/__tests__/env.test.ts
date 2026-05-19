import { describe, expect, it } from "vitest";

describe("Environment Variables", () => {
  it("verifies public client-side variables are defined in the workspace context", () => {
    // In actual testing/local environments, these should match the keys in .env
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    // Check we have mock variables or fallback defaults in place during testing
    expect(apiBaseUrl).toBeDefined();
    expect(recaptchaKey).toBeDefined();
  });
});
