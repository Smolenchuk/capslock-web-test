import { Locator, expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class TitleBlock extends BaseBlock {
  private readonly title: Locator = this.parentElement.locator('[class="blockTitle"], [class*="blockTitle "]');

  public async isPresentOnPage(): Promise<boolean> {
    return this.title.isVisible();
  }

  public async verifyBlock(expectedStructure: any): Promise<void> {
    expect(await this.isPresentOnPage()).toBeTruthy();
    if (expectedStructure.content) {
      const titleContent = await this.title.innerText();
      expect(titleContent).toContain(expectedStructure.content);
    }
  }
}
