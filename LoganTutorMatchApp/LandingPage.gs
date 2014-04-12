/**
 * Creates the user interface elements to show in the body of the landing page.
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

  var instructions = app.createHTML(messages.getLabel("APP_INSTRUCTIONS"))
                        .setStyleAttributes(css.smallText);
  
  var question = app.createLabel(messages.getLabel("DO_YOU_WANT_TO"))
                    .setStyleAttributes(css.text);

  var tutorButtonText = messages.getLabel("BE_AT_TUTOR");
  var tutorProfileLink = app.createAnchor(tutorButtonText, getConfig().tutorProfileFormUrl)
                            .setTarget("_self")
                            .setStyleAttributes(css.hiddenLink);
  
  var tutorButton = app.createButton(tutorButtonText)
                       .setStyleAttributes(css.button);
  var tutorButtonPanel = app.createVerticalPanel().setStyleAttributes(css.buttonPanel)
                            .add(tutorButton)
                            .add(tutorProfileLink);
                  
  var tutoringButton = app.createButton(messages.getLabel("BE_TUTORED"))
                  .setStyleAttributes(css.button);

  var grid = createGrid(app, 4);
  
  body.add(title);
  
  grid.setWidget(0, 0, instructions);
  grid.setWidget(1, 0, question);
  grid.setWidget(2, 0, tutorButtonPanel);
  grid.setWidget(3, 0, tutoringButton);
  body.add(grid);  
  
  var tutoringHandler = app.createServerHandler('tutoringClickHandler');
  tutoringHandler.addCallbackElement(tutorButton);
  tutoringButton.addClickHandler(tutoringHandler);
  return body;
}

/** 
 * @param app UiApp
 * @param numRows number of rows in grid.
 * @param numCols number of columns in grid.
 * @param cellStyle the styling to use for the inner grid cells
 * @returns new grid container with one column and the specified number of rows  
 */
function createGrid(app, numRows, numCols, cellStyle) {
  var numColumns = numCols ? numCols : 1;
  var gridCellStyle = cellStyle ? cellStyle : css.largeGridCell;
  var grid = app.createGrid(numRows, numColumns).setStyleAttributes(css.grid);
  for (var i = 0; i<numRows; i++) {
    for (var j = 0; j<numColumns; j++) {
      grid.setStyleAttributes(i, j, gridCellStyle);
    }
  } 
  return grid; 
}

/** 
 * Handler for tutoring request button. 
 * Remove the old request page, add a newly created one, and navigate to the it.
 */ 
function tutoringClickHandler(e) {
  var app = UiApp.getActiveApplication();
  
  app.remove(app.getElementById(TUTORING_REQUEST_PAGE)); 
  app.add(createTutoringRequestPage(app));
  app.getElementById(LANDING_PAGE).setVisible(false);
  
  app.close();
  return app;
}

/**
 * Allows selecting the default language for a user.
 * The selection will be persisted in UserProperties.
 * In the process of creating this selector the users current locale
 * is set. If it was previously set, then that value will be used.
 * @returns a panel that contains the selector.
 */
function createLanguageSelector(app) {
  
  var languageDroplist = app.createListBox()
                            .setName("languageDroplist")
                            .setId("languageDroplist")
                            .setStyleAttributes(css.languageDroplist);
  var panel = app.createHorizontalPanel();
  var label = app.createLabel("Language :")
                 .setStyleAttributes(css.languageLabel); 
  panel.add(label).add(languageDroplist);
     
  for (var i=0; i<messages.localesList.length; i++) {
    var locale = messages.localesList[i];
    languageDroplist.addItem(messages[locale].LOCALE_LABEL, locale);
  }

  var index = messages.localesList.indexOf(messages.currentLocale);
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
  messages.setLocale(selectedValue);
  
  // refresh the page by removing the body and recreating it with the new locale.
  app.remove(app.getElementById(LANDING_PAGE));
  app.add(createLandingPage(app)); 
  
  app.close();
  return app;
}
