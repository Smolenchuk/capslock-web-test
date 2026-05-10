import { expect } from "@playwright/test";
import { test } from "../components/base/BaseTest";
import pageStructure from "../../resources/test-data/capslock/pageStructure.json";
import { BaseSection } from "../components/base/BaseSection";
import { validEmails } from "../constants/validEmails";
import { invalidEmails } from "../constants/invalidEmails";
import { invalidZips } from "../constants/invalidZips";
import { phoneNumbers } from "../constants/phoneNumbers";
import { USER, ZIP_CODES } from "../constants/constants";

test.describe("Example test suite", () => {
  // eslint-disable-next-line playwright/expect-expect -- assertions inside verifySection
  test("Verify page structure @priority=p0 @testcase=TC-001", async ({ basePage }) => {
    await basePage.openBasePage();
    const sectionCount = pageStructure.sections.length;

    for (let sectionIndex = 1; sectionIndex < sectionCount; sectionIndex++) {
      const sectionLocator = basePage.getSectionByIndex(sectionIndex);
      const section: BaseSection = new BaseSection(sectionLocator);
      await section.verifySection(pageStructure.sections[sectionIndex - 1].blocks);
    }
  });

  [1, 2].forEach((i) => {
    test(`verify contact form structure ${i} @priority=p0 @testcase=TC-002`, async ({ basePage }) => {
      await basePage.openBasePage();
      const contactForm = await basePage.getContactForm(i);
      expect(await contactForm.getTitle()).toBe(`What is your ZIP Code?`);
      expect(await contactForm.getInputPlaceholder()).toBe(`Enter ZIP Code`);
      expect(await contactForm.getSubmitButtonName()).toBe(`Next`);
    });
  });

  [1, 2].forEach((i) => {
    test(`verify ZIP code is required ${i} @priority=p0 @testcase=TC-003`, async ({ basePage }) => {
      await basePage.openBasePage();
      const contactForm = await basePage.getContactForm(i);
      await contactForm.submitForm();
      expect(await contactForm.getTitle()).toBe(`What is your ZIP Code?`);
      expect(await contactForm.isErrorMessageVisible()).toBe(true);
      expect(await contactForm.getErrorMessageText()).toBe(`Enter your ZIP code.`);
    });
  });

  [1, 2].forEach((i) => {
    test(`verify ZIP incorrect ${i} @priority=p0 @testcase=TC-004`, async ({ basePage }) => {
      await basePage.openBasePage();
      const contactForm = await basePage.getContactForm(i);
      for (const zip of invalidZips) {
        await test.step(`Verify ZIP code: ${zip}`, async () => {
          await contactForm.fillInputField(zip);
          await contactForm.submitForm();
          expect.soft(await contactForm.getTitle()).toBe(`What is your ZIP Code?`);
          expect.soft(await contactForm.isErrorMessageVisible()).toBe(true);
          expect.soft(await contactForm.getErrorMessageText()).toBe(`Wrong ZIP code.`);
        });
      }
    });
  });

  [1, 2].forEach((i) => {
    test(`verify out of area flow ${i} - invalid emails @priority=p0 @testcase=TC-005`, async ({ basePage }) => {
      await basePage.openBasePage();
      const contactForm = await basePage.getContactForm(i);
      await contactForm.fillInputField(ZIP_CODES.OUT_OF_AREA);
      await contactForm.submitForm();
      expect(await contactForm.getTitle()).toBe(
        `Sorry, unfortunately we don’t yet install in your area but if you’d like us to notify you when we do please enter your email address below`,
      );
      expect(await contactForm.getInputPlaceholder()).toBe(`Email Address`);
      expect(await contactForm.getSubmitButtonName()).toBe(`Submit`);
      await contactForm.submitForm();
      expect(await contactForm.isErrorMessageVisible()).toBe(true);
      expect(await contactForm.getErrorMessageText()).toBe(`Enter your email address.`);

      for (const email of invalidEmails) {
        await test.step(`Verify invalid email: ${email}`, async () => {
          await contactForm.fillInputField(email);
          await contactForm.submitForm();
          expect.soft(await contactForm.isErrorMessageVisible()).toBe(true);
          expect.soft(await contactForm.getErrorMessageText()).toBe(`Wrong email.`);
        });
      }
    });
  });

  [1, 2].forEach((i) => {
    validEmails.forEach((email) => {
      test(`verify out of area flow ${i} - valid email: ${email} @priority=p0 @testcase=TC-006`, async ({
        basePage,
      }) => {
        await basePage.openBasePage();
        const contactForm = await basePage.getContactForm(i);
        await contactForm.fillInputField(ZIP_CODES.OUT_OF_AREA);
        await contactForm.submitForm();
        expect(await contactForm.getTitle()).toBe(
          `Sorry, unfortunately we don’t yet install in your area but if you’d like us to notify you when we do please enter your email address below`,
        );

        await contactForm.fillInputField(email);
        await contactForm.submitForm();
        expect(await contactForm.getTitle()).toBe(
          `Thank you for your interest, we will contact you when our service becomes available in your area!`,
        );
      });
    });
  });

  [1, 2].forEach((i) => {
    test(`verify out of area flow ${i} - progress update @priority=p0 @testcase=TC-007`, async ({ basePage }) => {
      await basePage.openBasePage();
      const contactForm = await basePage.getContactForm(i);
      expect(await contactForm.isStepProgressVisible()).toBe(false);
      await contactForm.fillInputField(ZIP_CODES.OUT_OF_AREA);
      await contactForm.submitForm();

      expect.soft(await contactForm.isStepProgressVisible()).toBe(true);
      expect.soft(await contactForm.getProgressStepText()).toBe(`1 of 2`);
      expect.soft(await contactForm.getProgressBarState()).toBe(`50%`);

      expect(await contactForm.getTitle()).toBe(
        `Sorry, unfortunately we don’t yet install in your area but if you’d like us to notify you when we do please enter your email address below`,
      );
      await contactForm.fillInputField(USER.EMAIL);
      await contactForm.submitForm();

      expect.soft(await contactForm.isStepProgressVisible()).toBe(true);
      expect.soft(await contactForm.getProgressStepText()).toBe(`2 of 2`);
      expect.soft(await contactForm.getProgressBarState()).toBe(`100%`);
      expect(await contactForm.getTitle()).toBe(
        `Thank you for your interest, we will contact you when our service becomes available in your area!`,
      );
    });
  });

  [1, 2].forEach((i) => {
    test(`verify service available flow - step 2 - all fields required ${i} @priority=p0 @testcase=TC-008`, async ({
      basePage,
    }) => {
      await basePage.openBasePage();
      const contactForm = await basePage.getContactForm(i);
      await contactForm.fillInputField(ZIP_CODES.SERVICE_AVAILABLE);
      await contactForm.submitForm();

      expect(await contactForm.getTitle()).toBe(`Why are you interested in a walk-in tub?`);
      expect(await contactForm.getSubmitButtonName()).toBe(`Next`);
      await contactForm.submitForm();

      expect(await contactForm.isErrorMessageVisible()).toBe(true);
      expect(await contactForm.getErrorMessageText()).toBe(`Choose one of the variants.`);
    });
  });

  [1, 2].forEach((i) => {
    test(`verify service available flow - step 3 - all fields required ${i} @priority=p0 @testcase=TC-009`, async ({
      basePage,
    }) => {
      await basePage.openBasePage();
      const contactForm = await basePage.getContactForm(i);
      await contactForm.fillInputField(ZIP_CODES.SERVICE_AVAILABLE);
      await contactForm.submitForm();

      expect(await contactForm.getTitle()).toBe(`Why are you interested in a walk-in tub?`);
      await contactForm.chooseQuizCardByIndex(0);
      await contactForm.submitForm();

      expect(await contactForm.getTitle()).toBe(`What type of property is this for?`);
      expect(await contactForm.getSubmitButtonName()).toBe(`Next`);
      await contactForm.submitForm();

      expect(await contactForm.isErrorMessageVisible()).toBe(true);
      expect(await contactForm.getErrorMessageText()).toBe(`Choose one of the variants.`);
    });
  });

  [1, 2].forEach((i) => {
    test(`verify service available flow - step 4 - all fields required ${i} @priority=p0 @testcase=TC-010`, async ({
      basePage,
    }) => {
      await basePage.openBasePage();
      const contactForm = await basePage.getContactForm(i);
      await contactForm.fillInputField(ZIP_CODES.SERVICE_AVAILABLE);
      await contactForm.submitForm();

      await contactForm.chooseQuizCardByIndex(0);
      await contactForm.submitForm();

      expect(await contactForm.getTitle()).toBe(`What type of property is this for?`);
      await contactForm.chooseQuizCardByIndex(0);
      await contactForm.submitForm();

      expect(await contactForm.getTitle()).toBe(`Who should we prepare this FREE estimate for?`);
      await expect(await contactForm.getInputByName("name")).toBeVisible();
      await expect(await contactForm.getInputByName("email")).toBeVisible();
      expect(await contactForm.getSubmitButtonName()).toBe(`Go To Estimate`);
      await contactForm.submitForm();

      expect(await contactForm.getInputValidationMessage("email")).toBe(`Please fill out this field.`);
      await contactForm.fillInputFieldByName("email", USER.EMAIL);
      await contactForm.submitForm();
      expect(await contactForm.getInputValidationMessage("email")).toBe(``);
      expect(await contactForm.isErrorMessageVisible("name")).toBe(true);
      expect(await contactForm.getErrorMessageText("name")).toBe(`Please enter your name.`);
    });
  });

  [1, 2].forEach((i) => {
    test(`verify service available flow - step 5 - all fields required ${i} @priority=p0 @testcase=TC-011`, async ({
      basePage,
    }) => {
      await basePage.openBasePage();
      const contactForm = await basePage.getContactForm(i);
      await contactForm.fillInputField(ZIP_CODES.SERVICE_AVAILABLE);
      await contactForm.submitForm();

      await contactForm.chooseQuizCardByIndex(0);
      await contactForm.submitForm();

      await contactForm.chooseQuizCardByIndex(0);
      await contactForm.submitForm();

      await contactForm.fillInputFieldByName("name", USER.NAME);
      await contactForm.fillInputFieldByName("email", USER.EMAIL);
      await contactForm.submitForm();

      expect(await contactForm.getTitle()).toBe(
        `LAST STEP! A quick call is required to confirm your information and provide a free estimate.`,
      );
      await expect(await contactForm.getInputByName("phone")).toBeVisible();
      expect(await contactForm.getSubmitButtonName()).toBe(`Submit Your Request`);
      await contactForm.submitForm();
      expect(await contactForm.getErrorMessageText()).toBe(`Enter your phone number.`);
    });
  });

  [1, 2].forEach((i) => {
    test(`verify service available flow - progress update ${i} @priority=p0 @testcase=TC-012`, async ({ basePage }) => {
      await basePage.openBasePage();
      const contactForm = await basePage.getContactForm(i);
      await contactForm.fillInputField(ZIP_CODES.SERVICE_AVAILABLE);
      await contactForm.submitForm();

      expect.soft(await contactForm.isStepProgressVisible()).toBe(true);
      expect.soft(await contactForm.getProgressStepText()).toBe(`2 of 5`);
      expect.soft(await contactForm.getProgressBarState()).toBe(`40%`);

      await contactForm.chooseQuizCardByIndex(0);
      await contactForm.submitForm();

      expect.soft(await contactForm.isStepProgressVisible()).toBe(true);
      expect.soft(await contactForm.getProgressStepText()).toBe(`3 of 5`);
      expect.soft(await contactForm.getProgressBarState()).toBe(`60%`);

      await contactForm.chooseQuizCardByIndex(0);
      await contactForm.submitForm();

      expect.soft(await contactForm.isStepProgressVisible()).toBe(true);
      expect.soft(await contactForm.getProgressStepText()).toBe(`4 of 5`);
      expect.soft(await contactForm.getProgressBarState()).toBe(`80%`);

      await contactForm.fillInputFieldByName("name", USER.NAME);
      await contactForm.fillInputFieldByName("email", USER.EMAIL);
      await contactForm.submitForm();

      expect.soft(await contactForm.isStepProgressVisible()).toBe(true);
      expect.soft(await contactForm.getProgressStepText()).toBe(`5 of 5`);
      expect.soft(await contactForm.getProgressBarState()).toBe(`100%`);

      await contactForm.fillInputField("2345678900");
      await contactForm.submitForm();

      expect(await basePage.getPageHeader()).toBe(`Thank you!`);
    });
  });

  test(`validate phone field @priority=p0 @testcase=TC-013`, async ({ basePage }) => {
    await basePage.openBasePage();
    const contactForm = await basePage.getContactForm(1);
    await contactForm.fillInputField(ZIP_CODES.SERVICE_AVAILABLE);
    await contactForm.submitForm();

    await contactForm.chooseQuizCardByIndex(0);
    await contactForm.submitForm();

    await contactForm.chooseQuizCardByIndex(0);
    await contactForm.submitForm();

    await contactForm.fillInputFieldByName("name", USER.NAME);
    await contactForm.fillInputFieldByName("email", USER.EMAIL);
    await contactForm.submitForm();

    for (const phone of phoneNumbers) {
      await test.step(`Verify phone number: ${phone[0]}`, async () => {
        await contactForm.fillInputField(phone[0]);
        const inputValue = await contactForm.getInputFieldValue();
        expect.soft(inputValue).toBe(phone[1]);
      });
    }
  });
});
