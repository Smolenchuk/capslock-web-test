import { Locator, expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class VideoBlock extends BaseBlock {
  private readonly blockVideo: Locator = this.parentElement.locator('[class*="blockVideo"]').first();
  private readonly video: Locator = this.blockVideo.locator('[class*="blockVideo__video"]').first();

  public async verifyBlock(_expectedStructure: any): Promise<void> {
    await expect(this.blockVideo).toBeVisible();

    await expect(this.video).toBeVisible();
    await expect(this.video).toHaveAttribute("src", /.+/);
    await expect(this.video).toHaveAttribute("autoplay", "");
    await expect(this.video).toHaveAttribute("muted", "");
    await expect(this.video).toHaveAttribute("loop", "");
  }
}
