import { Locator } from "@playwright/test";

export abstract class BaseBlock {
  protected readonly parentElement: Locator;

  constructor(parentElement: Locator) {
    this.parentElement = parentElement;
  }

  public abstract verifyBlock(expectedStructure: any): Promise<void>;
}
