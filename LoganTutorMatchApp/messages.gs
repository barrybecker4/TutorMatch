
/** UserProperties key used to persist the locale preference. */
var LOCALE_PROPERTY = "LOCALE";

/**
 * A global instance that holds all the localized messages for the application
 * that are read from a spreadsheet specified by the configuration.
 * The order in which the local columns appear in the spreadsheet determine the
 * order in which they will appear in the language droplist.
 */
var messages = createMessages(getConfig().localizationSpreadSheet);


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
}

/**
 * If the translation is not found in the spreadsheet containing
 * the localized messages, and there are not "_"s in the key,
 * then LanguageApp.translate is used to provide a default translation.
 * LanguageApp provides an API to Google Translate.
 * @param key message key
 * @param substitutions an optional array of substitutions to make in the localized string.
 *   The first element will be substituted for {0}, the second for {1}, and so on.
 * @return the localized text for the current locale
 */
messages.getLabel = function(key, substitutions) {
  var bundle = messages[messages.currentLocale];
  var result = "";
  
  if (bundle[key]) {
    result = bundle[key];
    if (substitutions) {
      for (var i=0; i<substitutions.length; i++) {
        // replace all occurrences of {i} with substitutions[i]
        var re = new RegExp('{'+i+'}', 'g');
        result = result.replace(re, substitutions[i]);
      }
    }
  }
  else if (key.indexOf('_') < 0 
           && messages.currentLocale != messages.defaultLocale) {
    result = LanguageApp.translate(key, 
        messages.defaultLocale, messages.currentLocale);
  }
  else {
    // if all else fails, just show the message key itself
    result = key;
  }
  return result;
}
