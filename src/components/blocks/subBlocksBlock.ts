import { expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";
import { BaseSection } from "../base/BaseSection";

export class SubBlocksBlock extends BaseBlock {
  public async verifyBlock(expectedStructure: any): Promise<void> {
    const subBlocks = this.parentElement.locator(
      `xpath=.//*[contains(@class,"${expectedStructure.class}") and not(contains(@class,"__"))]`,
    );
    if (expectedStructure.number) {
      const count = await subBlocks.count();
      expect(
        count,
        `Expected ${expectedStructure.number} sub-blocks but found ${count}. Expected structure: ${JSON.stringify(expectedStructure)}`,
      ).toBe(expectedStructure.number);

      if (expectedStructure.content && Array.isArray(expectedStructure.content)) {
        for (let i = 0; i < expectedStructure.content.length; i++) {
          const section = new BaseSection(subBlocks.nth(i));
          if (Array.isArray(expectedStructure.content[i])) {
            await section.verifySection(expectedStructure.content[i]);
          } else {
            await section.verifySection(expectedStructure.content);
          }
        }
      }
    }
  }
}
