import { Locator } from "@playwright/test";
import { createBlock } from "../blocks/blockFactory";

export class BaseSection {
  private readonly section: Locator;

  constructor(section: Locator) {
    this.section = section;
  }

  public async verifySection(expectedBlocks: any): Promise<void> {
    if (!Array.isArray(expectedBlocks)) {
      throw new TypeError("expectedBlocks must be an array");
    }

    for (const block of expectedBlocks) {
      const blockInstance = createBlock(block.type, this.section);
      await blockInstance.verifyBlock(block);
    }
  }
}
