/**
 * Serves HTML of the application for HTTP GET requests.
 * Get "LandingPage", or a requested page using 'page' parameter in query string.
 *
 * @param {Object} e event parameter that can contain information
 *                 about any URL parameters provided.
 * @returns {String/html} Html to be served
 */
function doGet(e) {
  Logger.log( Utilities.jsonStringify(e) );
  var pageName = e.parameter.page ? e.parameter['page'] : 'LandingPage';

  // Build and return HTML in IFRAME sandbox mode.
  return HtmlService.createTemplateFromFile(pageName).evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

/**
 * Use a templated HTML printing scriptlet to import javascript or css stylesheets.
 * @return the html to show from the specified file
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Get the URL for this Google Apps Script running as a WebApp.
 */
function getAppUrl() {
  return ScriptApp.getService().getUrl();
}

/**
REMOVE
 * @return all data from first spreadsheet as an array. Can be used
 * via google.script.run to get data without requiring publication
 * of spreadsheet. Returns null if spreadsheet does not contain more than one row.
 */
function getSpreadsheetData() {
  var sheetId = '1TVzDS3ab-VZNNCNxkhO5yBmK7CC5AhLWgL48tRfWJmk';  // spreadsheet ID.
  var data = SpreadsheetApp.openById(sheetId).getSheets()[0].getDataRange().getValues();
  return (data.length > 1) ? data : null;
}

/**
 * @return the email of the current user using the app
 */
function getUserEmail() {
  return Session.getEffectiveUser().getEmail();
}
