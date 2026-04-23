import { Locator, expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";

export class FormBlock extends BaseBlock {
  private readonly formSelector: string = "xpath=.//form";
  private readonly titleSelector: string =
    'xpath=/ancestor::div[contains(@class, "steps ")]//div[contains(@class, "stepTitle ")]';
  private readonly inputSelector: string = 'xpath=.//input[contains(@class, "inputBlock__input")]';
  private readonly submitSelector: string = 'xpath=.//button[@type="submit"]';
  private readonly dataErrorBlockSelector: string = "xpath=.//div[@data-error-block]";
  private readonly stepProgressSelector: string = "xpath=.//div[contains(@class, 'stepProgress ')]";
  private readonly progressStepSelector: string = "xpath=.//div[@class='stepProgress__step']";
  private readonly progressbarSelector: string = "xpath=.//div[@data-form-progress-value]";
  private readonly quizCardsSelector: string = "xpath=.//div[contains(@class, 'quizCard ')]";
  private activeForm: Locator;

  constructor(parentElement: Locator) {
    super(parentElement);
    this.activeForm = this.parentElement.locator(this.formSelector).first();
  }

  public async verifyBlock(expectedStructure: any): Promise<void> {
    await expect(this.activeForm).toBeVisible();

    if (expectedStructure.elements && Array.isArray(expectedStructure.elements)) {
      for (const element of expectedStructure.elements) {
        switch (element) {
          case "title": {
            await expect(this.activeForm.locator(this.titleSelector).first()).toBeVisible();
            break;
          }
          case "input": {
            await expect(this.activeForm.locator(this.inputSelector).first()).toBeVisible();
            break;
          }
          case "submit": {
            await expect(this.activeForm.locator(this.submitSelector).first()).toBeVisible();
            break;
          }
        }
      }
    }
  }

  public async chooseFormByName(formName: string): Promise<void> {
    this.activeForm = this.parentElement.locator(`xpath=.//form[@name="${formName}"]`).first();
    await expect(this.activeForm).toBeVisible();
  }

  public async isActiveFormVisible(): Promise<boolean> {
    return this.activeForm.isVisible();
  }

  public async getTitle(): Promise<string> {
    const titleElement = this.activeForm.locator(this.titleSelector).first();
    await expect(titleElement).toBeVisible();
    return (await titleElement.innerText()).trim().replace(/\s+/g, " "); // Replace multiple spaces/newlines with single space
  }

  public async getInputPlaceholder(): Promise<string> {
    const inputElement = this.activeForm.locator(this.inputSelector).first();
    await expect(inputElement).toBeVisible();
    return (await inputElement.getAttribute("placeholder")) || "";
  }

  public async getSubmitButtonName(): Promise<string> {
    const submitElement = this.activeForm.locator(this.submitSelector).first();
    await expect(submitElement).toBeVisible();
    return (await submitElement.innerText()).trim();
  }

  public async submitForm(): Promise<void> {
    const submitElement = this.activeForm.locator(this.submitSelector).first();
    await submitElement.click();
  }

  public async isErrorMessageVisible(inputName?: string): Promise<boolean> {
    let errorElement: Locator;
    if (inputName) {
      const inputElement = this.activeForm.locator(`xpath=.//input[@name="${inputName}"]`).first();
      const inputBlock = inputElement.locator("xpath=/ancestor::div[contains(@class, 'inputBlock ')]");
      errorElement = inputBlock.locator(this.dataErrorBlockSelector).first();
      await expect(inputElement).toBeVisible();
    } else {
      errorElement = this.activeForm.locator(this.dataErrorBlockSelector).first();
    }
    return errorElement.isVisible();
  }

  public async getErrorMessageText(inputName?: string): Promise<string> {
    let errorElement: Locator;
    if (inputName) {
      const inputElement = this.activeForm.locator(`xpath=.//input[@name="${inputName}"]`).first();
      const inputBlock = inputElement.locator("xpath=/ancestor::div[contains(@class, 'inputBlock ')]");
      errorElement = inputBlock.locator(this.dataErrorBlockSelector).first();
      await expect(inputElement).toBeVisible();
    } else {
      errorElement = this.activeForm.locator(this.dataErrorBlockSelector).first();
    }
    await expect(errorElement).toBeVisible();
    return (await errorElement.innerText()).trim();
  }

  public async fillInputField(value: string): Promise<void> {
    const inputElement = this.activeForm.locator(this.inputSelector).first();
    await expect(inputElement).toBeVisible();
    await inputElement.fill(value);
  }

  public async getInputFieldValue(): Promise<string> {
    const inputElement = this.activeForm.locator(this.inputSelector).first();
    await expect(inputElement).toBeVisible();
    return inputElement.inputValue();
  }

  public async isStepProgressVisible(): Promise<boolean> {
    const stepProgressElement = this.parentElement.locator(this.stepProgressSelector).first();
    await stepProgressElement.waitFor({ timeout: 500 }).catch(() => {});
    return stepProgressElement.isVisible();
  }

  public async getProgressStepText(): Promise<string> {
    const progressStepText = await this.parentElement.locator(this.progressStepSelector).innerText();
    return progressStepText.trim() || "";
  }

  public async getProgressBarState(): Promise<string> {
    const progressBarState = await this.parentElement
      .locator(this.progressbarSelector)
      .evaluate((el) => el.style.width);
    return progressBarState ? progressBarState : "";
  }

  public async chooseQuizCardByIndex(index: number): Promise<void> {
    const quizCard = this.activeForm.locator(this.quizCardsSelector).nth(index);
    await expect(quizCard).toBeVisible();
    await quizCard.click();
  }

  public async getInputByName(inputName: string): Promise<Locator> {
    const inputElement = this.activeForm.locator(`xpath=.//input[@name="${inputName}"]`).first();
    await expect(inputElement).toBeVisible();
    return inputElement;
  }

  public async fillInputFieldByname(inputName: string, value: string): Promise<void> {
    const inputElement = await this.getInputByName(inputName);
    await inputElement.fill(value);
  }

  public async getInputValidationMessage(inputName: string): Promise<string> {
    const inputElement = await this.getInputByName(inputName);
    const validationMessage = await inputElement.evaluate((el: HTMLInputElement) => el.validationMessage);
    return validationMessage;
  }
}
