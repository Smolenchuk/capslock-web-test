import { expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class SliderBlock extends BaseBlock {
  private readonly sliderDefaultSelector: string = "xpath=.//div[@class='sliderDefault']";
  private readonly sliderPreviewSelector: string = "xpath=.//div[@class='sliderPrev']";
  private readonly slideSelector: string = "xpath=.//div[contains(@class,'sliderPrev__item')]";
  private readonly prevButtonSelector: string = "xpath=.//button[contains(@class,'slick-prev')]";
  private readonly nextButtonSelector: string = "xpath=.//button[contains(@class,'slick-next')]";

  public async verifyBlock(expectedStructure: any): Promise<void> {
    const slider = this.parentElement.locator(this.sliderDefaultSelector).first();
    await expect(slider).toBeVisible();
    await expect(slider.locator(this.prevButtonSelector)).toBeVisible();
    await expect(slider.locator(this.nextButtonSelector)).toBeVisible();

    const sliderPreview = this.parentElement.locator(this.sliderPreviewSelector).first();
    await expect(sliderPreview).toBeVisible();

    if (expectedStructure.number) {
      const slides = sliderPreview.locator(this.slideSelector);
      const count = await slides.count();
      expect(count).toBe(expectedStructure.number);

      for (let i = 0; i < count; i++) {
        const slide = slides.nth(i);
        await expect(slide.locator("xpath=.//img[contains(@class, 'loadLazy__media')]")).toHaveAttribute("src", /.+/);
      }
    }
  }
}
