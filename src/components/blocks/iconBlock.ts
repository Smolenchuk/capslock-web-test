import { expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class IconBlock extends BaseBlock {
  private readonly iconSelector: string = 'xpath=.//*[contains(@class,"__icon")]';

  public async verifyBlock(_expectedStructure: any): Promise<void> {
    const iconBlock = this.parentElement.locator(this.iconSelector).first();
    await expect(iconBlock).toBeVisible();
  }
}
