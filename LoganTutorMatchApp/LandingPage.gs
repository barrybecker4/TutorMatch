/**
 * creates the user interface elements to show in the body of the landing page.
 * @return the root container element of the landing page.
 */
function createLandingPage(app) {
  var body = app.createFlowPanel()
                .setId(LANDING_PAGE)
                .setStyleAttributes(css.body);
  
  // show a droplist for selecting a language
  var languageSelector = createLanguageSelector(app);
  body.add(languageSelector);
  
  var title = app.createLabel(messages.getLabel("APP_TITLE"))
                 .setStyleAttributes(css.title);

  var instructions = app.createLabel(messages.getLabel("DO_YOU_WANT_TO"))
                        .setStyleAttributes(css.text);

  var tutorButtonText = messages.getLabel("BE_AT_TUTOR");
  var tutorProfileLink = app.createAnchor(tutorButtonText, config.tutorProfileFormUrl)
                            .setTarget("_self")
                            .setStyleAttributes(css.hiddenLink);
  
  var tutorButton = app.createButton(tutorButtonText)
                       .setStyleAttributes(css.button);
  var tutorButtonPanel = app.createVerticalPanel().setStyleAttributes(css.buttonPanel)
                            .add(tutorButton)
                            .add(tutorProfileLink);
                  
  var tutoringButton = app.createButton(messages.getLabel("BE_TUTORED"))
                  .setStyleAttributes(css.button);
                                             
  var grid = app.createGrid(7, 1)
                .setStyleAttributes(css.grid)
                .setStyleAttributes(0, 0, css.gridCell)
                .setStyleAttributes(1, 0, css.gridCell)
                .setStyleAttributes(2, 0, css.gridCell)
                .setStyleAttributes(3, 0, css.gridCell);
  
  body.add(title);
  
  grid.setWidget(1, 0, instructions);
  grid.setWidget(2, 0, tutorButtonPanel);
  grid.setWidget(3, 0, tutoringButton);
  body.add(grid);  
  
  var tutoringHandler = app.createServerHandler('tutoringClickHandler');
  tutoringHandler.addCallbackElement(tutorButton);
  tutoringButton.addClickHandler(tutoringHandler);
  return body;
}

/**
 * Handler for tutoring profile button
 */ 
function tutoringClickHandler(e) {
  var app = UiApp.getActiveApplication();
  
  app.getElementById(LANDING_PAGE).setVisible(false);
  app.getElementById(TUTORING_REQUEST_PAGE).setVisible(true);

  app.close();
  return app;
}

/**
 * Allows selecting the default language for a user.
 * The selection will be persisted in UserProperties.
 * @returns a panel that contains the selector.
 */
function createLanguageSelector(app) {
  
  var languageDroplist = app.createListBox().setName("languageDroplist")
                                            .setId("languageDroplist")
                                            .setStyleAttributes(css.languageDroplist);
  
  var currentLocale = UserProperties.getProperty("LOCALE");
  if (!currentLocale || messages.localesList.indexOf(currentLocale) < 0) {
    currentLocale = messages.defaultLocale;
  }
  messages.currentLocale = currentLocale;
  Logger.log("current lang = "+ currentLocale);
  
  var panel = app.createHorizontalPanel();
  var label = app.createLabel("Language :")
                 .setStyleAttributes(css.languageLabel); 
  panel.add(label).add(languageDroplist);
     
  for (var i=0; i<messages.localesList.length; i++) {
    var locale = messages.localesList[i];
    languageDroplist.addItem(messages[locale].LOCALE_LABEL, locale);
  }
  var index = messages.localesList.indexOf(currentLocale);
  languageDroplist.setItemSelected(index, true);
  
  var languageSelectedHandler = app.createServerHandler('languageSelectedHandler');
  languageSelectedHandler.addCallbackElement(languageDroplist);
  languageDroplist.addChangeHandler(languageSelectedHandler);
  return panel;
}

/**
 * Handler for when a default language has been selected by the user.
 */ 
function languageSelectedHandler(e) {
  
  var app = UiApp.getActiveApplication();
  var selectedValue = e.parameter.languageDroplist;  
  Logger.log("selected lang value = " + selectedValue);
  UserProperties.setProperty("LOCALE", selectedValue);
  messages.currentLocale = selectedValue;
  
  // refresh the page by removing the body and recreating it with the new locale.
  app.remove(app.getElementById(LANDING_PAGE));
  app.add(createLandingPage(app));
  
  app.close();
  return app;
}
