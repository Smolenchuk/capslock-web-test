import { Locator, expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class ReviewsBlock extends BaseBlock {
  private readonly reviewWrap: Locator = this.parentElement.locator("[class*='reviewWrap']").first();
  private readonly reviews: Locator = this.reviewWrap.locator(".review");
  private readonly hiddenReviews: Locator = this.reviewWrap.locator(".reviewFull");
  private readonly moreLess: Locator = this.reviewWrap.locator(".moreless").first();

  public async verifyBlock(_expectedStructure: any): Promise<void> {
    await expect(this.reviewWrap).toBeVisible();

    expect(await this.reviews.count()).toBeGreaterThan(0);

    // Verify "Show more" expands hidden reviews
    await expect(this.hiddenReviews).toBeHidden();

    await expect(this.moreLess).toBeVisible();
    await this.moreLess.click();

    await expect(this.hiddenReviews).toBeVisible();
  }
}
