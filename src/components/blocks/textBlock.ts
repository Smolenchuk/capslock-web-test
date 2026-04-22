import { expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class TextBlock extends BaseBlock {
  private readonly textSelector: string = 'xpath=//*[contains(@class, "__txt")]';

  public async isPresentOnPage(): Promise<boolean> {
    return this.parentElement.locator(this.textSelector).isVisible();
  }

  public async verifyBlock(expectedStructure: any): Promise<void> {
    expect(await this.isPresentOnPage()).toBeTruthy();
    if (expectedStructure.content) {
      const textContent = await this.parentElement.locator(this.textSelector).innerText();
      expect(textContent).toContain(expectedStructure.content);
    }
  }
}
