import { expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class ReviewsBlock extends BaseBlock {
  private readonly reviewWrapSelector: string = "xpath=.//*[contains(@class,'reviewWrap')]";
  private readonly reviewSelector: string = "xpath=.//div[contains(@class, 'review')]";
  private readonly hiddenReviewsSelector: string = "xpath=.//div[contains(@class, 'reviewFull')]";
  private readonly moreLessSelector: string = "xpath=.//div[contains(@class, 'moreless')]";

  public async verifyBlock(_expectedStructure: any): Promise<void> {
    const reviewWrap = this.parentElement.locator(this.reviewWrapSelector).first();
    await expect(reviewWrap).toBeVisible();

    const visibleReviews = reviewWrap.locator(this.reviewSelector);
    expect(await visibleReviews.count()).toBeGreaterThan(0);

    // Verify "Show more" expands hidden reviews
    const hiddenSection = reviewWrap.locator(this.hiddenReviewsSelector);
    await expect(hiddenSection).toBeHidden();

    const moreLess = reviewWrap.locator(this.moreLessSelector);
    await expect(moreLess).toBeVisible();
    await moreLess.click();

    await expect(hiddenSection).toBeVisible();
  }
}
