import { expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class ListBlock extends BaseBlock {
  private readonly listSelector: string = 'xpath=.//*[contains(@class,"blockList ")]';
  private readonly listItemSelector: string = 'xpath=.//li[contains(@class, "blockList__item")]';

  public async verifyBlock(expectedStructure: any): Promise<void> {
    const list = this.parentElement.locator(this.listSelector).first();
    await expect(list).toBeVisible();

    if (expectedStructure.items && Array.isArray(expectedStructure.items)) {
      const items = list.locator(this.listItemSelector);
      const count = await items.count();
      expect(count).toBe(expectedStructure.items.length);
      for (let i = 0; i < expectedStructure.items.length; i++) {
        await expect(items.nth(i)).toContainText(expectedStructure.items[i]);
      }
    }
  }
}
