/**
 * Serves HTML of the application for HTTP GET requests.
 *
 * @param {Object} e event parameter that can contain information
 *                 about any URL parameters provided.
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('LandingPage');

  // Build and return HTML in IFRAME sandbox mode.
  return template.evaluate()
      .setTitle('TutorMatch App')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}


/**
 * @return all data from first spreadsheet as an array. Can be used
 * via google.script.run to get data without requiring publication
 * of spreadsheet. Returns null if spreadsheet does not contain more than one row.
 */
function getSpreadsheetData() {
  var sheetId = '1TVzDS3ab-VZNNCNxkhO5yBmK7CC5AhLWgL48tRfWJmk';  // spreadsheet ID.
  var data = SpreadsheetApp.openById(sheetId).getSheets()[0].getDataRange().getValues();
  return (data.length > 1) ? data : null;
}
