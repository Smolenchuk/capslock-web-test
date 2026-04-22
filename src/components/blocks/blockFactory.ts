import { Locator } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";
import { ContentBlock } from "./contentBlock";
import { FormBlock } from "./formBlock";
import { HeaderBlock } from "./headerBlock";
import { ImageBlock } from "./imageBlock";
import { IconBlock } from "./iconBlock";
import { ListBlock } from "./listBlock";
import { ReviewsBlock } from "./reviewsBlock";
import { SliderBlock } from "./sliderBlock";
import { SubBlocksBlock } from "./subBlocksBlock";
import { TextBlock } from "./textBlock";
import { TitleBlock } from "./titleBlock";
import { VideoBlock } from "./videoBlock";

const blockMap: Record<string, new (parent: Locator) => BaseBlock> = {
  title: TitleBlock,
  video: VideoBlock,
  list: ListBlock,
  image: ImageBlock,
  icon: IconBlock,
  content: ContentBlock,
  subBlocks: SubBlocksBlock,
  slider: SliderBlock,
  form: FormBlock,
  reviews: ReviewsBlock,
  header: HeaderBlock,
  text: TextBlock,
};

export function createBlock(type: string, parentElement: Locator): BaseBlock {
  const BlockClass = blockMap[type];
  if (!BlockClass) {
    throw new Error(`Unknown block type: "${type}". Parent element: ${parentElement}.`);
  }
  return new BlockClass(parentElement);
}
