import { test as baseTest } from "@playwright/test";
import config from "../../../playwright.config";
import { BasePage } from "./BasePage";
import { AlmService, TestResult } from "./AlmService";

export const test = baseTest.extend<{
  basePage: BasePage;
}>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },
});

// Hook to capture test result and post to ALM after all retries complete
test.afterEach(async ({}, testInfo) => {
  // Only post if this is the final attempt
  // If status is 'failed', only post on the last retry
  // If status is 'passed' or 'skipped', post immediately
  const maxRetries = config.retries || 0;
  const isLastAttempt = testInfo.status !== "failed" || testInfo.retry >= maxRetries;

  if (isLastAttempt) {
    const result: TestResult = {
      testName: testInfo.title,
      status: testInfo.status as "passed" | "failed" | "skipped",
      duration: testInfo.duration,
      error: testInfo.error?.message,
    };

    await AlmService.postTestResult(result);
  }
});
