/**
 * Serves HTML of the application for HTTP GET requests.
 * Get "LandingPage", or a requested page using 'page' parameter in query string.
 *
 * @param {Object} e event parameter that can contain information about any URL parameters provided.
 * @returns {String/html} Html to be served
 */
function doGet(e) {
  var pageName = e.parameter.page ? e.parameter['page'] : 'landing/LandingPage';

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
 * @return array of locale objects, where each object contains locale value,  label, and if it is selected.
 *         For example {value: en, label: English, selected: false}.
 */
function getSupportedLocales() {
  var locales = [];
  var localesList = messages.localesList;
  for (var i = 0; i < localesList.length; i++) {
     var locale = messages.localesList[i];
     locales.push({
       value: locale,
       label: messages[locale].LOCALE_LABEL,
       selected: locale == messages.currentLocale
     });
  }
  return locales;
}

/**
 * @param key message label key
 * @return the label for the specified key using the current local bundle.
 */
function getLabel(key) {
  return messages.getLabel(key);
}

/**
 * @param locale (optional) the users locale to get bundle for. Use default if not specified.
 * @return messages for the specified locale. Returns a map from key to label.
 */
function getMessagesForLocale(locale) {
  if (locale) {
    messages.setLocale(locale);
  } else {
    locale = getSelectedLocale();
  }
  return messages[locale];
}

/**
 * @return the email of the current user using the app
 */
function getUserEmail() {
  return Session.getEffectiveUser().getEmail();
}

/**
 * @return the user's id. Its the first part of the email.
 */
function getUserId() {
  var email = getUserEmail();
  return email.substring(0, email.indexOf("@"));
}

/**
 * The user is valid if there is a specified domain configured,
 * and the user's domain matches it. If no domain configured,
 * then anyone matches and valid is always true.
 * @return true if the user is in the configured domain.
 */
function isValidUser() {
  var email = getUserEmail();
  var indexAt = email.indexOf("@") + 1;
  var domain = email.substring(indexAt);
  var valid = !config.domain || (domain == config.domain);
  Logger.log("domain=" + domain + " config.domain=" + config.domain + " valid=" + valid);
  return valid;
}
