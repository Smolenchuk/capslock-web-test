import { expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class ImageBlock extends BaseBlock {
  private readonly imageSelector: string = 'xpath=.//*[contains(@class,"__img")]';

  public async verifyBlock(_expectedStructure: any): Promise<void> {
    const imageBlock = this.parentElement.locator(this.imageSelector).first();
    await expect(imageBlock).toBeVisible();
  }
}
