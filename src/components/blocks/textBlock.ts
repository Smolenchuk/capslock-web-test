import { Locator, expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class TextBlock extends BaseBlock {
  private readonly text: Locator = this.parentElement.locator('[class*="__txt"]');

  public async isPresentOnPage(): Promise<boolean> {
    return this.text.isVisible();
  }

  public async verifyBlock(expectedStructure: any): Promise<void> {
    expect(await this.isPresentOnPage()).toBeTruthy();
    if (expectedStructure.content) {
      const textContent = await this.text.innerText();
      expect(textContent).toContain(expectedStructure.content);
    }
  }
}
