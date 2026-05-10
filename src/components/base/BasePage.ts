import { Locator, Page, expect } from "@playwright/test";
import { FormBlock } from "../blocks/formBlock";

export class BasePage {
  protected readonly page: Page;

  private readonly pageHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = this.page.getByRole("heading", { level: 1 }).first();
  }

  public async openBasePage(): Promise<void> {
    const appUrl = process.env.APP_URL;
    if (!appUrl) {
      throw new Error("APP_URL is not defined in environment variables");
    }
    await this.page.goto(appUrl);
  }

  public getSectionByIndex(sectionIndex: number): Locator {
    return this.page.locator("section").nth(sectionIndex - 1);
  }

  public async getContactForm(formIndex: number): Promise<FormBlock> {
    if (formIndex < 1 || formIndex > 2) {
      throw new Error("Invalid form index. Please provide a value between 1 and 2.");
    }
    const contactFormSelector = `[id="form-container-${formIndex}"]`;
    await expect(this.page.locator(contactFormSelector)).toBeVisible();
    return new FormBlock(this.page.locator(contactFormSelector));
  }

  public async getPageHeader(): Promise<string> {
    if ((await this.pageHeader.count()) === 0) {
      return "";
    }
    return (await this.pageHeader.textContent())?.trim() || "";
  }
}
