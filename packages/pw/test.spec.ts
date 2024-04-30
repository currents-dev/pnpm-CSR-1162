import { expect, test } from "@playwright/test";

test.afterAll(async () => {});

test("A", async ({ page }, {}) => {
  for (let step = 1; step <= 3; step++) {
    await page.goto("https://example.com");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  expect(1).toBe(1);
});
