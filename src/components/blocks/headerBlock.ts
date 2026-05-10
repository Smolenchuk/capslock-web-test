import { Locator, expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class HeaderBlock extends BaseBlock {
  private readonly header: Locator = this.parentElement.locator('[class*="__hdr"]');

  public isPresentOnPage(): Promise<boolean> {
    return this.header.isVisible();
  }

  public async verifyBlock(expectedStructure: any): Promise<void> {
    expect(await this.isPresentOnPage()).toBeTruthy();
    if (expectedStructure.content) {
      const headerContent = await this.header.innerText();
      expect(headerContent).toContain(expectedStructure.content);
    }
  }
}
