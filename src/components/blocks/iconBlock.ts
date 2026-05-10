import { Locator, expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class IconBlock extends BaseBlock {
  private readonly icon: Locator = this.parentElement.locator('[class$="__icon"]');

  public async verifyBlock(_expectedStructure: any): Promise<void> {
    await expect(this.icon).toBeVisible();
  }
}
