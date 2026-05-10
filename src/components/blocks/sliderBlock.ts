import { Locator, expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class SliderBlock extends BaseBlock {
  private readonly slider: Locator = this.parentElement.locator("[class*='sliderDefault']").first();
  private readonly prevButton: Locator = this.slider.locator("[class*='slick-prev']");
  private readonly nextButton: Locator = this.slider.locator("[class*='slick-next']");
  private readonly sliderPreview: Locator = this.parentElement.locator("[class*='sliderPrev']").first();
  private readonly slides: Locator = this.sliderPreview.locator("[class*='sliderPrev__item']");

  public async verifyBlock(expectedStructure: any): Promise<void> {
    await expect(this.slider).toBeVisible();
    await expect(this.prevButton).toBeVisible();
    await expect(this.nextButton).toBeVisible();
    await expect(this.sliderPreview).toBeVisible();

    if (expectedStructure.number) {
      const count = await this.slides.count();
      expect(count).toBe(expectedStructure.number);

      for (let i = 0; i < count; i++) {
        const slide = this.slides.nth(i);
        await expect(slide.locator("[class*='loadLazy__media']")).toHaveAttribute("src", /.+/);
      }
    }
  }
}
