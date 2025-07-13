/**
 * @file Test Runner for QUnit.
 * This file serves the TestRunner.html which executes the tests.
 */

/**
 * Web App entry point. Serves the test runner HTML page.
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('tests/TestRunnerPage.html')
    .evaluate()
    .setTitle('AI Naming Assistant Test Suite');
}

/**
 * Includes the content of a server-side file into the HTML template.
 */
function include(filename) {
  return HtmlService.createTemplateFromFile(filename).getRawContent();
}