import { Locator, expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class ImageBlock extends BaseBlock {
  private readonly imageSelector: Locator = this.parentElement.locator('[class*="__img"]');

  public async verifyBlock(_expectedStructure: any): Promise<void> {
    const imageBlock = this.imageSelector.first();
    await expect(imageBlock).toBeVisible();
  }
}
