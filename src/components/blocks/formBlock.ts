import { Locator, expect } from "@playwright/test";
import { BaseBlock } from "../base/BaseBlock";
import { ActiveLocator } from "../../types/ActiveLocator";

export class FormBlock extends BaseBlock {
  private readonly currentStepSelector: string = ".steps:visible";
  private readonly titleSelector: string = ".stepTitle__hdr:visible";
  private readonly inputSelector: string = ".inputBlock__input:visible";
  private readonly submitSelector: string = 'button[type="submit"]:visible';
  private readonly form: Locator = this.parentElement.locator("form");

  private readonly dataErrorBlockSelector: string = "[data-error-block]";
  private readonly stepProgressSelector: string = "[class*='stepProgress ']";
  private readonly progressStepSelector: string = "[class='stepProgress__step']";
  private readonly progressbarSelector: string = "[data-form-progress-value]";
  private readonly quizCardsSelector: string = "[class*='quizCard']";
  private activeForm: Locator;
  private currentStep: ActiveLocator;

  constructor(parentElement: Locator) {
    super(parentElement);
    this.activeForm = this.form.first();
    this.currentStep = { locator: this.parentElement.locator(this.currentStepSelector).first(), isStale: true };
  }

  public async verifyBlock(expectedStructure: any): Promise<void> {
    await expect(this.activeForm).toBeVisible();

    if (expectedStructure.elements && Array.isArray(expectedStructure.elements)) {
      for (const element of expectedStructure.elements) {
        switch (element) {
          case "title": {
            await expect(await this.getTitleElement()).toBeVisible();
            break;
          }
          case "input": {
            await expect(await this.getInputElement()).toBeVisible();
            break;
          }
          case "submit": {
            await expect(await this.getSubmitButton()).toBeVisible();
            break;
          }
        }
      }
    }
  }

  private async getCurrentStep(): Promise<Locator> {
    if (this.currentStep.isStale === true) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const steps = await this.parentElement.locator(".steps").all();
      for (const step of steps) {
        if (await step.isVisible()) {
          this.currentStep = { locator: step, isStale: false };
          break;
        }
      }
    }
    return this.currentStep.locator;
  }

  public async getTitleElement(): Promise<Locator> {
    const titleElement = (await this.getCurrentStep()).locator(this.titleSelector);
    return titleElement;
  }

  public async getInputElement(): Promise<Locator> {
    const inputElement = (await this.getCurrentStep()).locator(this.inputSelector).first();
    return inputElement;
  }

  public async getSubmitButton(): Promise<Locator> {
    const submitButton = (await this.getCurrentStep()).locator(this.submitSelector).first();
    return submitButton;
  }

  public async getTitle(): Promise<string> {
    const titleElement = await this.getTitleElement();
    return ((await titleElement.textContent()) || "").trim().replace(/\s+/g, " ");
  }

  public async getInputPlaceholder(): Promise<string> {
    const inputElement = await this.getInputElement();
    return (await inputElement.getAttribute("placeholder")) || "";
  }

  public async getSubmitButtonName(): Promise<string> {
    const submitButton = await this.getSubmitButton();
    return (await submitButton.innerText()).trim();
  }

  public async submitForm(): Promise<void> {
    const submitButton = await this.getSubmitButton();
    await submitButton.click();
    this.currentStep.isStale = true;
  }

  private async getErrorElement(inputName?: string): Promise<Locator> {
    if (inputName) {
      const inputBlock = (await this.getCurrentStep())
        .locator(`input[name="${inputName}"]`)
        .locator('xpath=ancestor::div[contains(@class, "inputBlock")]')
        .first();

      return inputBlock.locator(this.dataErrorBlockSelector);
    } else {
      return (await this.getCurrentStep()).locator(this.dataErrorBlockSelector).first();
    }
  }

  public async isErrorMessageVisible(inputName?: string): Promise<boolean> {
    const errorElement = await this.getErrorElement(inputName);
    return errorElement.isVisible();
  }

  public async getErrorMessageText(inputName?: string): Promise<string> {
    const errorElement = await this.getErrorElement(inputName);
    return (await errorElement.innerText()).trim();
  }

  public async fillInputField(value: string): Promise<void> {
    const inputElement = await this.getInputElement();
    await expect(inputElement).toBeVisible();
    await inputElement.fill(value);
  }

  public async getInputFieldValue(): Promise<string> {
    const inputElement = await this.getInputElement();
    return (await inputElement.inputValue()).trim();
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
    const quizCard = (await this.getCurrentStep()).locator(this.quizCardsSelector).nth(index);
    await expect(quizCard).toBeVisible();
    await quizCard.click();
  }

  public async getInputByName(inputName: string): Promise<Locator> {
    const inputElement = (await this.getCurrentStep()).locator(`input[name="${inputName}"]`).first();
    await expect(inputElement).toBeVisible();
    return inputElement;
  }

  public async fillInputFieldByName(inputName: string, value: string): Promise<void> {
    const inputElement = await this.getInputByName(inputName);
    await inputElement.fill(value);
  }

  public async getInputValidationMessage(inputName: string): Promise<string> {
    const inputElement = await this.getInputByName(inputName);
    const validationMessage = await inputElement.evaluate((el: HTMLInputElement) => el.validationMessage);
    return validationMessage;
  }
}
