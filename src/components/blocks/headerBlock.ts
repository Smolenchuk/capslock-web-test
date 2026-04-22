import { expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class HeaderBlock extends BaseBlock {
  private readonly headerSelector: string = 'xpath=//div[contains(@class, "__hdr")]';

  public async isPresentOnPage(): Promise<boolean> {
    return this.parentElement.locator(this.headerSelector).isVisible();
  }

  public async verifyBlock(expectedStructure: any): Promise<void> {
    expect(await this.isPresentOnPage()).toBeTruthy();
    if (expectedStructure.content) {
      const headerContent = await this.parentElement.locator(this.headerSelector).innerText();
      expect(headerContent).toContain(expectedStructure.content);
    }
  }
}
