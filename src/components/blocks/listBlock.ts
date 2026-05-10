import { Locator, expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class ListBlock extends BaseBlock {
  private readonly list: Locator = this.parentElement.locator('[class*="blockList"][class*=" "]').first();
  private readonly listItems: Locator = this.list.locator('[class*="blockList__item"]');

  public async verifyBlock(expectedStructure: any): Promise<void> {
    await expect(this.list).toBeVisible();

    if (expectedStructure.items && Array.isArray(expectedStructure.items)) {
      const count = await this.listItems.count();
      expect(count).toBe(expectedStructure.items.length);
      for (let i = 0; i < expectedStructure.items.length; i++) {
        await expect(this.listItems.nth(i)).toContainText(expectedStructure.items[i]);
      }
    }
  }
}
