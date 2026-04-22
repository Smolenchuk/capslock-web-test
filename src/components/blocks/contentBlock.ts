import { expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class ContentBlock extends BaseBlock {
  private readonly contentSelector: string = 'xpath=.//div[contains(@class, "__content")]';

  public async verifyBlock(expectedStructure: any): Promise<void> {
    const content = this.parentElement.locator(this.contentSelector).first();
    await expect(content).toBeVisible();
    if (expectedStructure.text) {
      const contentText: string = await content.innerText();
      expect(contentText).toContain(expectedStructure.text);
    }
  }
}
