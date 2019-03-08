
/** UserProperties key used to persist the locale preference. */
var LOCALE_PROPERTY = "LOCALE";

/** 
 * The droplist selection for default locale.
 * This is either the user's locale, if translations exist for it,
 * or the first locale in the localization spreadsheet. 
 */
var DEFAULT = "default";

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
  for (var j = 1; j < firstRow.length; j++) {
    var locale = firstRow[j];
    localesList.push(locale);
    //Logger.log("adding obj for " + locale);
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
    for (var j = 1; j < row.length; j++) {
       msg[localesList[j-1]][row[0]] = row[j]; 
    }
  }
}

/** 
 * The default locale is either the user's locale if translations exist for it, or
 * the first locale for which translations exist.
 * If the user has explicitly selected a locale other than "default" then use that.
 */
function initCurrentLocale(msg) {
  
  var userLocale = Session.getActiveUserLocale().substring(0, 2);
  msg.firstLocale = msg.localesList[0];
  var selectedLocale = getSelectedLocale();
  
  var defaultLocale = getDefaultLocale(msg);
  Logger.log("Locales: User=" + userLocale + " first=" + msg.firstLocale 
      + " default=" +defaultLocale + " selected=" + selectedLocale);
  
  if (!selectedLocale || selectedLocale == DEFAULT) {
    selectedLocale = defaultLocale;
  }
  msg.currentLocale = selectedLocale;
  Logger.log("currentLocale set to " + msg.currentLocale);
}

/** @return the locale most recently selected from the droplist */
function getSelectedLocale()
{
  var locale = UserProperties.getProperty(LOCALE_PROPERTY);
  return locale ? locale : DEFAULT;
}

/**
 * The default locale is the user's locale if there exist translations for it
 * else its just the first locale.
 */
function getDefaultLocale(msg) {
  var userLocale = Session.getActiveUserLocale().substring(0, 2);
  return msg.localesList.indexOf(userLocale) < 0 ? msg.firstLocale : userLocale; 
}

/** set the locale and persist it in UserProperties */
messages.setLocale = function setLocale(locale) {
  UserProperties.setProperty(LOCALE_PROPERTY, locale);
  messages.currentLocale = (locale == DEFAULT) ? getDefaultLocale(messages) : locale; 
};

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
      for (var i = 0; i < substitutions.length; i++) {
        // replace all occurrences of {i} with substitutions[i] 
        var re = new RegExp('{'+i+'}', 'g');
        result = result.replace(re, substitutions[i]);
      }
    }
  }
  else if (key.indexOf('_') < 0 
           && messages.currentLocale != messages.firstLocale) {
    result = LanguageApp.translate(key, 
        messages.firstLocale, messages.currentLocale);
  }
  else {
    // if all else fails, just show the message key itself
    result = key;
  }
  return result;
};
