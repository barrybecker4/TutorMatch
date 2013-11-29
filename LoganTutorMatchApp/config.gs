/**
 * Some global configuration properties for the TutorMatch application.
 * The parameter is the id to the spreadsheet containing the properties.
 */
var config = createConfig("0ArK43-kBNSp0dGVBZjRlNE9nYkJObkc2N19tVTVMS3c");

/**
 * Create the configuration object.
 * The spreadsheet that is read must contain property keys in the first column and values 
 * for those properties in the second.
 * The following properties must be specified:
 *   - tutorProfileFormUrl
 *   - tutorProfilesSpreadSheet
 *   - localizationSpreadSheet
 *   - adminEmails
 *   - course: <course>    [Optional emails for individual courses]
 * 
 * @param configSpreadSheetId id of the spread sheet to read property values from.
 * @returns configuration property map
 */
function createConfig(configSpreadSheetId) {
  var cfg = {};
  
  var sheet = SpreadsheetApp.openById(configSpreadSheetId).getActiveSheet(); 

  var cellData = sheet.getSheetValues(2, 1, sheet.getLastRow(), 2);  
  
  for (var i=0; i < cellData.length; i++) {
    var row = cellData[i];
    Logger.log("row=" + row);
    cfg[row[0]] = row[1];
  }
  
  return cfg;
}
