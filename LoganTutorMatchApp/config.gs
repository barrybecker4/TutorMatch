/**
 * Some global configuration properties for the TutorMatch application.
 * The parameter is the id to the spreadsheet containing the properties.
 * To protect the information in the configuration file, set the CONFIG_SHEET_ID once, remove it, 
 * ant then only access it as a script property. ScriptProperties are scoped per script 
 * regardless of the user running it. 
 * Do not access this variable directly. Instead use getConfig().
 */
//ScriptProperties.setProperty("CONFIG_SHEET_ID", "<put your own configuration sheet id here>");
var config;

/**
 * @return the config object. Created on first call using lazy initialization.
 */
function getConfig() {
  if (!config) {
    config = createConfig(ScriptProperties.getProperty("CONFIG_SHEET_ID"));
  }
  return config;
}

/**
 * Create the configuration object.
 * The spreadsheet that is read must contain property keys in the first column and values 
 * for those properties in the second.
 * The following properties must be specified:
 *   - tutorProfileFormUrl
 *   - tutorProfilesSpreadSheet
 *   - localizationSpreadSheet
 *     loggingSpreadSheet
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
    //Logger.log("row=" + row);
    
    // row[0] is the KEY and row[1] is the value
    cfg[row[0]] = row[1];
  }
  
  return cfg;
}
