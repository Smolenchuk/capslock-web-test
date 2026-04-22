import { Locator, Page, expect } from "@playwright/test";
import { FormBlock } from "../blocks/formBlock";

export class BasePage {
  protected readonly page: Page;

  private readonly sectionXPath: string = `xpath=//body/section[sectionIndex]`;
  private readonly pageheader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageheader = this.page.locator("xpath=//h1");
  }

  public async openBasePage(): Promise<void> {
    const appUrl = process.env.APP_URL;
    if (!appUrl) {
      throw new Error("APP_URL is not defined in environment variables");
    }
    await this.page.goto(appUrl);
  }

  public getSectionByIndex(sectionIndex: number): Locator {
    return this.page.locator(this.sectionXPath.replace("sectionIndex", sectionIndex.toString()));
  }

  public async getContactForm(formIndex: number): Promise<FormBlock> {
    if (formIndex < 0 || formIndex > 2) {
      throw new Error("Invalid form index. Please provide a value between 0 and 2.");
    }
    const contactFormSelector = `xpath=//*[@id="form-container-${formIndex}"]`;
    await expect(this.page.locator(contactFormSelector)).toBeVisible();
    return new FormBlock(this.page.locator(contactFormSelector));
  }

  public async getPageHeader(): Promise<string> {
    if ((await this.pageheader.count()) === 0) {
      return "";
    }
    return (await this.pageheader.textContent())?.trim() || "";
  }
}
