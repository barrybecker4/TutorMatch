
/** UserProperties key used to persist the locale preference. */
var LOCALE_PROPERTY = "LOCALE";

/**
 * A global instance that holds all the localized messages for the application
 * that are read from a spreadsheet specified by the configuration.
 * The order in which the local columns appear in the spreadsheet determine the
 * order in which they will appear in the language droplist.
 */
var messages = createMessages(config.localizationSpreadSheet);

/**
 * Create the messages object that will be used to get localized strings.
 * @returns configuration property map
 */
function createMessages(spreadSheetId) {
  var msg = {};
  
  var sheet = SpreadsheetApp.openById(spreadSheetId).getActiveSheet(); 

  var cellData = sheet.getSheetValues(1, 1, sheet.getLastRow(), sheet.getLastColumn());  
  
  initLocalesList(msg, cellData[0]);
  initMessages(msg, cellData);
  initCurrentLocale(msg);

  return msg;
}

/**
 * Find supported locales by looking at the columns in the spreadsheet.
 * @param firstRow the first row of the spreadsheet contains the columns.
 *     the column header (other than the first) is a locale name (e.g. "en" or "es")
 * @returns an array of locales for which there are localized translations.
 */
function initLocalesList(msg, firstRow) {
  var localesList = [];
  for (var j=1; j < firstRow.length; j++) {
    var locale = firstRow[j];
    localesList.push(locale);
    Logger.log("adding obj for "+ locale);
    msg[locale] = {};
  }
  msg["localesList"] = localesList;
}

/**
 * For each locale there will be a map from message key to localized string.
 */
function initMessages(msg, cellData) { 
  
  var localesList = msg["localesList"];
  for (var i=1; i < cellData.length; i++) {
    var row = cellData[i];
    for (var j=1; j < row.length; j++) {
       msg[localesList[j-1]][row[0]] = row[j];
    }
  }
}

/** use the locale from UserProperties if its there, else use the first available. */
function initCurrentLocale(msg) {
  msg.defaultLocale = msg.localesList[0];

  var currentLocale = UserProperties.getProperty(LOCALE_PROPERTY);
  if (!currentLocale || msg.localesList.indexOf(currentLocale) < 0) {
    currentLocale = msg.defaultLocale;
  }
  msg.currentLocale = currentLocale;
}

/** set the locale and persist it in UserProperties */
messages.setLocale = function setLocale(locale) {
  
  UserProperties.setProperty(LOCALE_PROPERTY, locale);
  messages.currentLocale = locale;
};

/**
 * @param key message key
 * @return the localized text for the current locale
 */
messages.getLabel = function(key) {
  var bundle = messages[messages.currentLocale];
  if (bundle[key]) {
    return bundle[key];
  }
  return key;
};
