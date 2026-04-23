# List of test scenarios that are covered in current solution

## Contact Form and Page Structure Verification

---

## TC-001
```gherkin
@priority=p0 @testcase=TC-001
Scenario: Verify page structure matches expected layout
  When I check each section on the page
  Then each section should match the expected block structure defined in pageStructure
```

---

## TC-002
```gherkin
@priority=p0 @testcase=TC-002
Scenario Outline: Verify contact form structure
  When I open contact form <formIndex>
  Then the form title should be "What is your ZIP Code?"
  And the input placeholder should be "Enter ZIP Code"
  And the submit button label should be "Next"

  Examples:
    | formIndex |
    | 1         |
    | 2         |
```

---

## TC-003
```gherkin
@priority=p0 @testcase=TC-003
Scenario Outline: Verify ZIP code is required
  When I open contact form <formIndex>
  And I submit the form without entering a ZIP code
  Then the form title should still be "What is your ZIP Code?"
  And an error message "Enter your ZIP code." should be visible

  Examples:
    | formIndex |
    | 1         |
    | 2         |
```

---

## TC-004
```gherkin
@priority=p0 @testcase=TC-004
Scenario Outline: Verify invalid ZIP codes are rejected
  When I open contact form <formIndex>
  And I enter an invalid ZIP code and submit
  Then the form title should still be "What is your ZIP Code?"
  And an error message "Wrong ZIP code." should be visible

  Examples:
    | formIndex |
    | 1         |
    | 2         |
```

---

## TC-005
```gherkin
@priority=p0 @testcase=TC-005
Scenario Outline: Verify out of area flow rejects invalid emails
  When I open contact form <formIndex>
  And I enter the out-of-area ZIP code "11111" and submit
  Then the form title should be "Sorry, unfortunately we don't yet install in your area but if you'd like us to notify you when we do please enter your email address below"
  And the input placeholder should be "Email Address"
  And the submit button label should be "Submit"
  When I submit the form without entering an email
  Then an error message "Enter your email address." should be visible
  When I enter an invalid email and submit
  Then the form should remain visible
  And an error message "Wrong email." should be visible

  Examples:
    | formIndex |
    | 1         |
    | 2         |
```

---

## TC-006
```gherkin
@priority=p0 @testcase=TC-006
Scenario Outline: Verify out of area flow accepts valid emails
  When I open contact form <formIndex>
  And I enter the out-of-area ZIP code "11111" and submit
  Then the form title should be "Sorry, unfortunately we don't yet install in your area but if you'd like us to notify you when we do please enter your email address below"
  When I enter a valid email "<email>" and submit
  Then the form title should be "Thank you for your interest, we will contact you when our service becomes available in your area!"

  Examples:
    | formIndex | email             |
    | 1         | <valid email 1>   |
    | 2         | <valid email 1>   |
```

---

## TC-007
```gherkin
@priority=p0 @testcase=TC-007
Scenario Outline: Verify out of area flow progress updates
  When I open contact form <formIndex>
  Then the step progress should not be visible
  When I enter the out-of-area ZIP code "11111" and submit
  Then the step progress should be visible
  And the progress step text should be "1 of 2"
  And the progress bar should be at "50%"
  And I enter "email@example.com" and submit
  Then the progress step text should be "2 of 2"
  And the progress bar should be at "100%"
  And the form title should be "Thank you for your interest, we will contact you when our service becomes available in your area!"

  Examples:
    | formIndex |
    | 1         |
    | 2         |
```

---

## TC-008
```gherkin
@priority=p0 @testcase=TC-008
Scenario Outline: Verify service available flow - step 2 requires selection
  When I open contact form <formIndex>
  And I enter the service-available ZIP code "68901" and submit
  Then the form title should be "Why are you interested in a walk-in tub? (select all that apply)"
  And the submit button label should be "Next"
  When I submit the form without selecting an option
  Then the form should remain visible
  And an error message "Choose one of the variants." should be visible

  Examples:
    | formIndex |
    | 1         |
    | 2         |
```

---

## TC-009
```gherkin
@priority=p0 @testcase=TC-009
Scenario Outline: Verify service available flow - step 3 requires selection
  When I open contact form <formIndex>
  And I enter the service-available ZIP code "68901" and submit
  And I select the first quiz card and submit
  Then the form title should be "What type of property is this for?"
  And the submit button label should be "Next"
  When I submit the form without selecting an option
  Then the form should remain visible
  And an error message "Choose one of the variants." should be visible

  Examples:
    | formIndex |
    | 1         |
    | 2         |
```

---

## TC-010
```gherkin
@priority=p0 @testcase=TC-010
Scenario Outline: Verify service available flow - step 4 requires name and email
  When I open contact form <formIndex>
  And I enter the service-available ZIP code "68901" and submit
  And I select the first quiz card and submit
  And I select the first quiz card and submit
  Then the form title should be "Who should we prepare this FREE estimate for? (No obligation)"
  And the "name" input field should be visible
  And the "email" input field should be visible
  And the submit button label should be "Go To Estimate"
  When I submit the form without filling any fields
  Then the email validation message should be "Please fill out this field."
  And the form should remain visible
  When I enter email "email@example.com" and submit
  Then the email validation message should be empty
  And an error message "Please enter your name." should be visible for the "name" field

  Examples:
    | formIndex |
    | 1         |
    | 2         |
```

---

## TC-011
```gherkin
@priority=p0 @testcase=TC-011
Scenario Outline: Verify service available flow - step 5 requires phone
  When I open contact form <formIndex>
  And I enter the service-available ZIP code "68901" and submit
  And I select the first quiz card and submit
  And I select the first quiz card and submit
  And I complete the step with name "John Doe" and email "email@example.com"
  Then the form title should be "LAST STEP! A quick call is required to confirm your information and provide a free estimate."
  And the "phone" input field should be visible
  And the submit button label should be "Submit Your Request"
  When I submit the form without entering a phone number
  Then an error message "Enter your phone number." should be visible

  Examples:
    | formIndex |
    | 1         |
    | 2         |
```

---

## TC-012
```gherkin
@priority=p0 @testcase=TC-012
Scenario Outline: Verify service available flow progress updates
  Given I view contact form <formIndex>
  When I enter the service-available ZIP code "68901" and submit
  Then the progress step text should be "2 of 5"
  And the progress bar should be at "40%"
  When I complete the second step
  Then the progress step text should be "3 of 5"
  And the progress bar should be at "60%"
  When I complete the third step
  Then the progress step text should be "4 of 5"
  And the progress bar should be at "80%"
  When I fill in name "John Doe" and email "email@example.com" and submit
  Then the progress step text should be "5 of 5"
  And the progress bar should be at "100%"
  When I enter phone "2345678900" and submit
  Then the page header should be "Thank you!"

  Examples:
    | formIndex |
    | 1         |
    | 2         |
```

---

## TC-013
```gherkin
@priority=p0 @testcase=TC-013
Scenario: Validate phone field formatting
  Given I view contact form 1
  And I enter the service-available ZIP code "68901" and submit
  And I complete the first step
  And I complete the second step
  And I fill in name "John Doe" and email "email@example.com" and submit
  And I choose the "phone" form
  When I enter a phone number
  Then the input value should be formatted correctly
```
