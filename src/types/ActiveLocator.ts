import { Locator } from "@playwright/test";

export interface ActiveLocator {
  locator: Locator;
  isStale: boolean;
}
