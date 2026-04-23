# Capslock Web Test

End-to-end test automation framework for validating the [Capslock](https://test-qa.capslock.global/) landing page structure and functionality using Playwright.

## Tech Stack

| Component        | Technology           | Version |
| ---------------- | -------------------- | ------- |
| Test Framework   | Playwright           | 1.59.1  |
| Language         | TypeScript (strict)  | Latest  |
| Runtime          | Node.js              | LTS     |
| Linting          | ESLint + Prettier    | 9.x     |

## Project Structure

```
capslock-web-test/
├── .github/workflows/
│   └── playwright.yml              # CI/CD pipeline
├── src/
│   ├── components/
│   │   ├── base/                   # Base classes & infrastructure
│   │   │   ├── BaseTest.ts         # Custom test fixture with ALM hooks
│   │   │   ├── BasePage.ts         # Page object base
│   │   │   ├── BaseSection.ts      # Section verification orchestrator
│   │   │   ├── BaseBlock.ts        # Abstract block base class
│   │   │   └── AlmService.ts       # ALM integration service (stub)
│   │   └── blocks/                 # Block type implementations
│   │       ├── blockFactory.ts     # Block factory
│   │       ├── titleBlock.ts
│   │       ├── videoBlock.ts
│   │       ├── listBlock.ts
│   │       ├── imageBlock.ts
│   │       ├── iconBlock.ts
│   │       ├── contentBlock.ts
│   │       ├── formBlock.ts
│   │       ├── sliderBlock.ts
│   │       ├── subBlocksBlock.ts
│   │       └── reviewsBlock.ts
│   └── tests/
│       └── example.spec.ts         # Test cases
├── resources/
│   └── test-data/
│       └── capslock/
│           └── pageStructure.json  # Page structure definition
├── playwright.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

## Getting Started

### Prerequisites

- Node.js LTS

### Installation

```bash
npm ci
npx playwright install --with-deps
```

### Environment Configuration

The framework loads environment variables from `.env.*` files. Set the `env` variable to select a profile:

```bash
# Uses .env.stage
env=stage npx playwright test

# Uses .env.default (fallback)
npx playwright test
```

**Required variable:** `APP_URL` — the base URL of the application under test.

### Running Tests

```bash
# Run all tests
npx playwright test

# Run in headed mode
npx playwright test --headed

# Run a specific test file
npx playwright test src/tests/example.spec.ts

# Run with a specific browser
npx playwright test --project=chromium
```

### Linting

```bash
npx eslint .
```

## Architecture

### Component Hierarchy

```
Test (Playwright)
  └── BaseTest (custom fixture)
        └── BasePage (page object)
              └── BaseSection (section orchestrator)
                    └── BlockFactory → BaseBlock implementations
                                         └── SubBlocksBlock (recursive nesting)
```

### How It Works

1. **Tests** use the `BasePage` fixture to open the target URL and locate page sections by index.
2. **BaseSection** receives a section locator and an array of expected block definitions from `pageStructure.json`.
3. **BlockFactory** maps each block `type` string to its concrete class.
4. Each **Block** verifies itself against the expected structure (visibility, content, counts, etc.).
5. **SubBlocksBlock** supports recursive nesting — it uses the factory to verify child blocks within a parent container.

### Block Types

| Type       | Class            | What It Verifies                                              |
| ---------- | ---------------- | ------------------------------------------------------------- |
| `title`    | `TitleBlock`     | Title visibility; optional text content match                 |
| `video`    | `VideoBlock`     | Video element with `src`, `poster`, autoplay attributes       |
| `list`     | `ListBlock`      | List visibility; optional item count and text verification    |
| `image`    | `ImageBlock`     | Image wrapper visibility                                      |
| `icon`     | `IconBlock`      | Icon element visibility                                       |
| `content`  | `ContentBlock`   | Content block visibility; optional text match                 |
| `form`     | `FormBlock`      | Form visibility; optional element checks (title, input, submit) |
| `slider`   | `SliderBlock`    | Slider with navigation buttons; optional slide count          |
| `reviews`  | `ReviewsBlock`   | Reviews visible; "Show more" button expands hidden reviews    |
| `subBlocks`| `SubBlocksBlock` | Container with N child blocks, recursively verified           |

### Test Data

Page structure is defined in `resources/test-data/capslock/pageStructure.json`. Each section contains an array of block definitions:

```json
{
  "sections": [
    {
      "blocks": [
        { "type": "title", "content": "Page Heading Text" },
        { "type": "video" },
        { "type": "list", "items": ["Item 1", "Item 2"] }
      ]
    }
  ]
}
```

Optional properties per block type:

- `content` (string) — expected text for title/content blocks
- `items` (string[]) — expected list items
- `number` (number) — expected count for slider slides or sub-blocks
- `elements` (string[]) — form elements to verify (`"title"`, `"input"`, `"submit"`)
- `class` (string) — CSS class for sub-block containers

### ALM Integration

`AlmService` is called from the `BaseTest` `afterEach` hook to report test results. It currently logs to console and is a placeholder for future ALM system integration. Results are only posted on the final retry attempt.

## CI/CD

GitHub Actions runs on push/PR to `main`/`master` (see `.github/workflows/playwright.yml`):

- **Node.js LTS** on `ubuntu-latest`
- Sequential execution (1 worker) with 2 retries on failure
- HTML report uploaded as artifact (30-day retention)

## Browser Coverage

Tests run against three browser engines:

- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)

## Issues Found

01. Severity: Low.  
Description: The list item “easy‑to‑grip handrails” should start with a capital letter.

02. Severity: Low.  
Description: The Bathroom Slips statistics quote should include a single asterisk to link to the research source.

03. Severity: Medium.  
Description: Progress is displayed incorrectly for the ZIP out‑of‑area flow:
– 20% instead of 50% on the first step
– 20% instead of 100% on the second step

04. Severity: Medium.  
Description: Steps are displayed incorrectly for the ZIP out‑of‑area flow:
– “1 of ” is shown for both the first and second steps instead of “1 of 2” and “2 of 2”.

05. Severity: Medium.  
Description: No item is required to proceed on step 2 of the Service Available flow.

06. Severity: Medium.  
Description: The step indicator is incorrect on step 3 of the Service Available flow:
– Displays “2 of 5” instead of “3 of 5”.

07. Severity: Medium.  
Description: Progress is displayed incorrectly for the Service Available flow:
– 36% instead of 40% on step 2
– 36% instead of 60% on step 3
– 52% instead of 80% on step 4

08. Severity: Medium.  
Description: Inconsistent validation message for the email field on step 4 of the Service Available flow:
– A tooltip is shown instead of an error message below the field.

09. Severity: High.  
Description: It is not possible to enter the digit “1” into the phone field on step 5 of the Service Available flow.

## Covered Test Scenarios

[ List of scenarios covered by autotests](./docs/test-cases.md)

## Tests To Implement

- As page contains 2 Contact Form and interaction with one form affects the second one, test should verify that changes in both forms are synchronized.
- Verify combination of quiz cards selected to allow user to proceed to next step.
- Additional tests to verify label and behavior of forms' components.

## What To Improve

- Improve logging for test failures to have clear understanding what went wrong
- Switch to Allure report instead of Playwright's default
- Improve and extend basic verification of blocks components
- Review current approach against other landing pages to find weak points
- Add connection to ALM system to post test execution results, update stories statuses, skip tests if they are blocked with by issues
- Review and improve linting rules