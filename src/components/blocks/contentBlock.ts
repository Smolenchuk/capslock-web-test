import { Locator, expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class ContentBlock extends BaseBlock {
  private readonly contentDiv: Locator = this.parentElement.locator('[class*="__content"]').first();

  public async verifyBlock(expectedStructure: any): Promise<void> {
    const content = this.contentDiv;
    await expect(content).toBeVisible();
    if (expectedStructure.text) {
      const contentText: string = await content.innerText();
      expect(contentText).toContain(expectedStructure.text);
    }
  }
}
