import { expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class VideoBlock extends BaseBlock {
  private readonly videoSelector: string = 'xpath=.//div[contains(@class, "blockVideo")]';

  public async verifyBlock(_expectedStructure: any): Promise<void> {
    const blockVideo = this.parentElement.locator(this.videoSelector).first();
    await expect(blockVideo).toBeVisible();

    const video = blockVideo.locator("xpath=.//video[contains(@class, 'blockVideo__video')]").first();
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute("src", /.+/);
    await expect(video).toHaveAttribute("autoplay", "");
    await expect(video).toHaveAttribute("muted", "");
    await expect(video).toHaveAttribute("loop", "");
  }
}
