# Inferyx Automation Framework

A robust Playwright automation framework with Page Object Model pattern for testing the Inferyx platform.

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd platform-testing
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Install Playwright browsers:
   \`\`\`bash
   npx playwright install
   \`\`\`

4. Set up environment variables:

# Run all tests

npm test

# Run tests in headed mode

npm run test:headed

# Run specific module tests

npm run test:organization
npm run test:administration
npm run test:platform

# Run tests by pattern/grep

 npm run test:module --grep "TC-SAM-0.11.1.431"
 
### Module-wise Execution

\`\`\`bash

# Run Administration module tests

npx playwright test tests/Administration/

# Run Organization submodule tests

npx playwright test tests/Administration/Organization/

# Run specific test case

\`\`\`

## 📊 Reporting

### View HTML Report

\`\`\`bash
npx playwright show-report
\`\`\`

# To generate allure report  

npx allure generate allure-results --clean -o allure-report
npx serve allure-report


# for team use template :

1. on top -> copy following code in your recorded test 
(
   1. adjust the path
   2. add project name and module name
   3. write test case name 

)

import { test, expect } from "../../../base/BaseTest.js";
import { Comman } from "../../../pages/commans/Common.js";
import { captureAndCompareScreenshot } from "../../../utils/screenshotHelper.js";


test.describe("Administration - Account Module", () => {
  test("TC-SAM-0.1.1.451 : Clone", async ({ authentication }, testInfo) => {
    const page = authentication;
    const common = new Comman(page);





import { test, expect } from "../../../base/BaseTest.js";
import { Comman } from "../../../pages/commans/Common.js";


test.describe("Data-Engineering- data-preparation Module", () => {
  test("TC-AML-2.4.1.1 : Create", async ({ authentication }, testInfo) => {
    const page = authentication;
    const common = new Comman(page);

2. bottom -> paste following code

 const { matchPercentage, testCaseName } = await captureAndCompareScreenshot(testInfo, page);

    expect(
      matchPercentage,
      `Screenshot mismatch for ${testCaseName}: Only ${matchPercentage.toFixed(2)}% matched`
    ).toBeGreaterThanOrEqual(95);

  });
});


# genrate the master file 
node tests/data-engineering/data-preparation/generate-master-spec.js

# run test cases in module
npx playwright test tests/data-engineering/data-preparation/data-preparation.spec.js



npm run test:module --grep "TC-SAM-0.1.1.444"
npx playwright test tests
npx playwright test tests/administration/account/
npx playwright test tests/data-engineering/data-profiling/
npm run test:module --grep "TC-AML-2.4.1.16"

allure generate allure-results --clean -o allure-report --single-file
allure open allure-report


ref : 

delete :

    const isStillPresent = await isValuePresentInColumn(page, "Name", VALUES.ingestionRuleNames.delete);
    expect(isStillPresent).toBeFalsy();


expect(toast).toMatch(/request submitted successfully|request submitted/i);
