// something to separate the values set in the tag of a droplist.
var DELIMITER = "::";

/**
 * Creates the user interface elements to show in the tutoring request form.
 * @return the page body element.
 */
function createTutoringRequestPage(app) {
  
  var body = app.createFlowPanel()
                .setId(TUTORING_REQUEST_PAGE)
                .setStyleAttributes(css.body);
  
  var title = app.createLabel(messages.getLabel("TUTORING_REQUEST_FORM"))
                 .setStyleAttributes(css.title);
  body.add(title);
   
  var dataMap = getDataMap(app);
  
  // these store data that can be access by server side callbacks
  body.add(createHiddenDataMap(app, dataMap));
  body.add(createHiddenResult(app));
  
  var navigationButtonPanel = createNavigationPanel(app);
  
  // this will become visible when a tutor is selected.
  var tutorDetails = createTutorDetailsPanel(app);
  
  var grid = createGrid(app, 10);
  // Place the UI elements in the cells of the grid
  grid.setWidget(0, 0, createAgreement(app));
  grid.setWidget(1, 0, createNameField(app));
  grid.setWidget(2, 0, createStudentIdField(app));
  grid.setWidget(3, 0, createParentEmailField(app));
  grid.setWidget(4, 0, createParentPhoneField(app));
  grid.setWidget(5, 0, createSubjectSelection(app, dataMap));
  grid.setWidget(6, 0, createCourseSelection(app, dataMap));
  grid.setWidget(7, 0, createTutorSelection(app, dataMap)); 
  grid.setWidget(8, 0, tutorDetails); 
  grid.setWidget(9, 0, navigationButtonPanel);  
  body.add(grid);  
  
  return body;
}

/**
 * This little trick allows us to access the dataMap from the server side event handlers.
 * a hidden UI element (hiddenDataMap) stores the dataMap as a JSON string
 */
function createHiddenDataMap(app, dataMap) {
  return app.createHidden("hiddenDataMap", Utilities.jsonStringify(dataMap))
            .setId("hiddenDataMap");
}

/** stores the final result of all the selections in a hidden UI element. */
function createHiddenResult(app) {
  return  app.createHidden("hiddenResult", "{}")
             .setId("hiddenResult");
}

/** create a placeholder to show details for selected tutor. Invisible initially */
function createTutorDetailsPanel(app) {
  var detailsPanel = app.createFlowPanel()
                        .setId("tutorDetails")
                        .setVisible(false);
  var placeholder = app.createSimplePanel();
  detailsPanel.add(placeholder);
  return detailsPanel;
}

/** The tutee agreement detail. */
function createAgreement(app) {
  var instrText = messages.getLabel("TUTEE_AGREEMENT");
  return app.createHTML(instrText)
            .setStyleAttributes(css.smallText);
}

/**
 * Collect the user's name. We could just address them with their id, but that
 * would not be very user-friendly.
 * @returns a label and text field where the user can supply their name.
 */
function createNameField(app) {
  var panel = app.createHorizontalPanel();
  var label = app.createLabel(messages.getLabel("WHAT_NAME"))
                 .setStyleAttributes(css.text); 
  var textField = app.createTextBox()
                     .setName("nameField")
                     .setStyleAttributes(css.textbox);
  
  var fieldHandler = app.createServerHandler("nameFieldUpdateHandler");
  fieldHandler.addCallbackElement(textField)
              .addCallbackElement(app.getElementById("hiddenResult"));
  textField.addValueChangeHandler(fieldHandler);
  
  panel.add(label).add(textField);
  return panel;
}

/**
 * Handler that is call when the requester's name has been entered.
 */ 
function nameFieldUpdateHandler(e) {
  var app = UiApp.getActiveApplication(); 
  
  var currentResult = JSON.parse(e.parameter.hiddenResult);
  currentResult.name = e.parameter.nameField;
  
  setHiddenResultValue(app, currentResult);
  app.close();
  return app;
}

/**
 * Collect the user's student id for identification and security purposes.
 * @returns a label and text field where the user can supply their student id.
 */
function createStudentIdField(app) {
  var panel = app.createHorizontalPanel();
  var label = app.createLabel(messages.getLabel("WHAT_STUDENT_ID"))
                 .setStyleAttributes(css.text); 
  var textField = app.createTextBox()
                     .setName("studentIdField")
                     .setStyleAttributes(css.textbox);
  
  var fieldHandler = app.createServerHandler("studentIdFieldUpdateHandler");
  fieldHandler.addCallbackElement(textField)
              .addCallbackElement(app.getElementById("hiddenResult"));
  textField.addValueChangeHandler(fieldHandler);
  
  panel.add(label).add(textField);
  return panel;
}

/**
 * Handler that is call when the requester's student id has been entered.
 */ 
function studentIdFieldUpdateHandler(e) {
  var app = UiApp.getActiveApplication(); 
  
  var currentResult = JSON.parse(e.parameter.hiddenResult);
  currentResult.studentId = e.parameter.studentIdField;
  
  setHiddenResultValue(app, currentResult);
  app.close();
  return app;
}

/**
 * Collect the user's parent email.
 */
function createParentEmailField(app) {
  var panel = app.createHorizontalPanel();
  var label = app.createLabel(messages.getLabel("WHAT_PARENT_EMAIL"))
                 .setStyleAttributes(css.text); 
  var textField = app.createTextBox()
                     .setName("parentEmailField")
                     .setStyleAttributes(css.textbox);
  
  var fieldHandler = app.createServerHandler("parentEmailFieldUpdateHandler");
  fieldHandler.addCallbackElement(textField)
              .addCallbackElement(app.getElementById("hiddenResult"));
  textField.addValueChangeHandler(fieldHandler);
  
  panel.add(label).add(textField);
  return panel;
}

/**
 * Handler that is call when the requester's parent email has been entered.
 */ 
function parentEmailFieldUpdateHandler(e) {
  var app = UiApp.getActiveApplication(); 
  
  var currentResult = JSON.parse(e.parameter.hiddenResult);
  currentResult.studentId = e.parameter.parentEmailField;
  
  setHiddenResultValue(app, currentResult);
  app.close();
  return app;
}

/**
 * Collect the user's parent pnone number.
 */
function createParentPhoneField(app) {
  var panel = app.createHorizontalPanel();
  var label = app.createLabel(messages.getLabel("WHAT_PARENT_PHONE"))
                 .setStyleAttributes(css.text); 
  var textField = app.createTextBox()
                     .setName("parentPhoneField")
                     .setStyleAttributes(css.textbox);
  
  var fieldHandler = app.createServerHandler("parentPhoneFieldUpdateHandler");
  fieldHandler.addCallbackElement(textField)
              .addCallbackElement(app.getElementById("hiddenResult"));
  textField.addValueChangeHandler(fieldHandler);
  
  panel.add(label).add(textField);
  return panel;
}

/**
 * Handler that is call when the requester's parent phone nubmer has been entered.
 */ 
function parentPhoneFieldUpdateHandler(e) {
  var app = UiApp.getActiveApplication(); 
  
  var currentResult = JSON.parse(e.parameter.hiddenResult);
  currentResult.studentId = e.parameter.parentPhoneField;
  
  setHiddenResultValue(app, currentResult);
  app.close();
  return app;
}

/** @returns a panel with the subject droplist and its label */
function createSubjectSelection(app, dataMap) {
  
  var text = messages.getLabel("SUBJECT_SELECT_INSTR"); 
  var subjectDroplist = createDroplist(app, 'subjectDroplist');  
  populateDroplist(subjectDroplist, dataMap, true);
     
  var panel = createSelectEntry(app, text, subjectDroplist);
  
  var subjectSelectedHandler = app.createServerHandler('subjectSelectedHandler');
  subjectSelectedHandler.addCallbackElement(subjectDroplist)
                        .addCallbackElement(app.getElementById("hiddenDataMap"));
  subjectDroplist.addChangeHandler(subjectSelectedHandler);
  return panel;
}

/**
 * Handler that is call when a subject is selected.
 * The selected value will be used to limit successive selectors.
 */ 
function subjectSelectedHandler(e) {
  var app = UiApp.getActiveApplication();
  clearDownStreamSelections(app, ["courseDroplist", "tutorDroplist"]);
  
  var selectedSubject = e.parameter.subjectDroplist;
  
  if (selectedSubject != messages.getLabel("NOT_SELECTED")) {
    var courseDroplist = app.getElementById("courseDroplist");
    courseDroplist.setTag(selectedSubject);
  
    var dataMap = JSON.parse(e.parameter.hiddenDataMap);
    populateDroplist(courseDroplist, dataMap[selectedSubject], true);
  }
 
  app.close();
  return app;
}

/** @returns a panel with the course droplist and its label */
function createCourseSelection(app, dataMap) {
  
  var text = messages.getLabel("COURSE_SELECT_INSTR");
  var courseDroplist = createDroplist(app, 'courseDroplist');  
  var panel = createSelectEntry(app, text, courseDroplist);
  
  var courseSelectedHandler = app.createServerHandler('courseSelectedHandler');
  courseSelectedHandler.addCallbackElement(courseDroplist)
                       .addCallbackElement(app.getElementById("hiddenDataMap"));
  courseDroplist.addChangeHandler(courseSelectedHandler);
  
  return panel;
}

/**
 * Handler for when the course droplist is selected.
 */ 
function courseSelectedHandler(e) {
  var app = UiApp.getActiveApplication();
   
  var selectedSubject = e.parameter.courseDroplist_tag;
  var selectedCourse = e.parameter.courseDroplist;
  
  clearDownStreamSelections(app, ["tutorDroplist"]);
  
  if (selectedCourse != messages.getLabel("NOT_SELECTED")) {  
    var tutorDroplist = app.getElementById("tutorDroplist");
    tutorDroplist.setTag(selectedSubject + DELIMITER + selectedCourse);
  
    // populate tutors based on subject and course.
    var dataMap = JSON.parse(e.parameter.hiddenDataMap);
    var courseMap = dataMap[selectedSubject];    
    populateDroplist(tutorDroplist, courseMap[selectedCourse]);
  }

  app.close();
  return app;
}

/** @returns a panel with the course droplist and its label */
function createTutorSelection(app, dataMap) {
  
  var text = messages.getLabel("TUTOR_SELECT_INSTR"); 
  var tutorDroplist = createDroplist(app, "tutorDroplist");  
  var panel = createSelectEntry(app, text, tutorDroplist);
  
  var tutorSelectedHandler = app.createServerHandler('tutorSelectedHandler');
  tutorSelectedHandler.addCallbackElement(tutorDroplist)
                      .addCallbackElement(app.getElementById("hiddenResult"))
                      .addCallbackElement(app.getElementById("hiddenDataMap"));
  tutorDroplist.addChangeHandler(tutorSelectedHandler);
               
  return panel;
}

/** 
 * Handler for when the tutor is selected from the droplist. 
 * The hiddentResult widget will get populated with the current selections,
 * and the tutor details will be displayed.
 */ 
function tutorSelectedHandler(e) {
  var app = UiApp.getActiveApplication();
  var selectedTutor = e.parameter.tutorDroplist;
  
  if (selectedTutor != messages.getLabel("NOT_SELECTED")) {
    var selectedValues = e.parameter.tutorDroplist_tag;  
    var dataMap = JSON.parse(e.parameter.hiddenDataMap);
    var selections = JSON.parse(e.parameter.hiddenResult);
    selections = updateCurrentResult(app, selectedTutor, selectedValues, selections);
    var tutorInfo = dataMap[selections.subject][selections.course][selectedTutor];
    
    showTutorDetails(app, tutorInfo);
  }
  else {
    hideTutorDetails(app);
  }
  
  app.close();
  return app; 
}

/** store off the current selections in the hiddenResult widget */
function updateCurrentResult(app, selectedTutor, selectedValues, currentResult) {
  var vals = selectedValues.split(DELIMITER);
  
  currentResult.subject = vals[0];
  currentResult.course = vals[1];
  currentResult.tutor = selectedTutor;
  
  setHiddenResultValue(app, currentResult); 
  setSubmitState(true);
  return currentResult;
}

/** Remove existing details and show the ones for the currently selected tutor */
function showTutorDetails(app, tutorInfo) {
  var details = app.getElementById("tutorDetails");
  details.remove(0);
  
  var container = app.createSimplePanel()
                     .setStyleAttributes(css.text)
                     .setStyleAttribute("paddingLeft", 50);
  var grid = createGrid(app, 5, 2);
  createGridRow(app, grid, 0, messages.getLabel("NAME"), tutorInfo.name);
  createGridRow(app, grid, 1, messages.getLabel("EMAIL"), tutorInfo.email);
  createGridRow(app, grid, 2, messages.getLabel("AVAILABILITY"), tutorInfo.availability);
  createGridRow(app, grid, 3, messages.getLabel("ALT_LANGUAGE"), tutorInfo.foreignLanguages);
  createGridRow(app, grid, 4, messages.getLabel("GRAD_YEAR"), tutorInfo.graduationYear);
  container.add(grid);
  
  details.add(container);
  details.setVisible(true);
}

function createGridRow(app, grid, rowIndex, firstVal, secondVal) {
  grid.setWidget(rowIndex, 0, app.createLabel(firstVal));
  grid.setWidget(rowIndex, 1, app.createLabel(secondVal));
}

/** hide the current tutor details panel */
function hideTutorDetails(app) {
  var details = app.getElementById("tutorDetails");
  details.setVisible(false);
}

/** enable or disable the submit button at the bottom */
function setSubmitState(enable) {
  var app = UiApp.getActiveApplication();
  var style = enable ? css.button : css.buttonDisabled;
  app.getElementById("submitButton")
     .setStyleAttributes(style)
     .setEnabled(enable); 
}

/**
 * Contains the back and submit buttons at the bottom.
 * When the submit button is clicked the hiddenResult (containing the user's selections)
 * are sent to the server callback to be submitted. 
 */
function createNavigationPanel(app) {

  var navigationPanel = app.createHorizontalPanel();
  
  var backButton = app.createButton(messages.getLabel("BACK"))
                      .setStyleAttributes(css.button);
  var fill = app.createHorizontalPanel().setWidth(600);
  
  // disabled until all the selections have been made.
  var submitButton = app.createButton(messages.getLabel("SUBMIT"))
                        .setId("submitButton")
                        .setEnabled(false)
                        .setStyleAttributes(css.buttonDisabled);
                        
  navigationPanel.add(backButton);
  navigationPanel.add(fill);
  navigationPanel.add(submitButton);
  
  var backHandler = app.createClientHandler()
      .forTargets(app.getElementById(LANDING_PAGE)).setVisible(true)
      .forTargets(app.getElementById(TUTORING_REQUEST_PAGE)).setVisible(false);
  backButton.addClickHandler(backHandler);
  
  var submitHandler = app.createServerHandler('submitClickHandler');
  submitHandler.addCallbackElement(submitButton)
               .addCallbackElement(app.getElementById("hiddenResult"))
               .addCallbackElement(app.getElementById("hiddenDataMap"));
  submitButton.addClickHandler(submitHandler);
  
  // also add a quick client handler to disable the submit button to prevent multiple clicks.
  var disableSubmitHandler = app.createClientHandler()
      .forEventSource().setEnabled(false);
  submitButton.addClickHandler(disableSubmitHandler);
  
  return navigationPanel;
}

/**
 * Create a panel to hold a drop list and its label.
 * @param labelText text label for the droplist
 * @param dropList selector
 * @return panel containing the label and the droplist
 */
function createSelectEntry(app, labelText, droplist) {
  var panel = app.createVerticalPanel();
  var label = app.createLabel(labelText)
                 .setStyleAttributes(css.text); 
  panel.add(label).add(droplist);
  return panel;
}

/** @returns a new droplist instance with the specified name */
function createDroplist(app, name) {
  return app.createListBox().setName(name)
            .setId(name)
            .setStyleAttributes(css.droplist);
}

/**
 * The first item is always NOT_SELECTED so the user is forced to select something.
 * @param droplist the droplist to populate selection items for
 * @param items array or map entries represent the items to show in the list
 * @param translate if true, attempt to get localized strings for the items.
 *    We should not try to translate things like tutor names though.
 */
function populateDroplist(droplist, items, translate) {
  droplist.addItem(messages.getLabel("NOT_SELECTED"));
  if (translate) {
    for (var value in items) {
       droplist.addItem(messages.getLabel(value), value);
    }
  }
  else {
    for (var value in items) {
      droplist.addItem(value);
   }
  }
}

/**
 * Set the value of the hiddenResult element.
 * @param value an object to serialize and store as the hidden value.
 */
function setHiddenResultValue(app, value) {
  var hiddenResult = app.getElementById("hiddenResult");
  hiddenResult.setValue(Utilities.jsonStringify(value));
}

/**
 * When a selection is changed, to prevent invalid submissions, all
 * the down stream droplists should have their current selections cleared, 
 * and the submit button is disabled. 
 * @param droplists an array of down stream droplists to clear.
 */
function clearDownStreamSelections(app, droplists) {
  for (var i=0; i<droplists.length; i++) {
    var droplist = app.getElementById(droplists[i]);
    droplist.clear();
  }
  setSubmitState(false);
  app.getElementById("tutorDetails").setVisible(false);
}

/**
 * Handler for when the submit button is clicked.
 * Create the tutoring request, send emails, update calendars, etc.
 */ 
function submitClickHandler(e) {
  var app = UiApp.getActiveApplication();
  
  var selections = JSON.parse(e.parameter.hiddenResult);
  var dataMap = JSON.parse(e.parameter.hiddenDataMap); 

  var tutorInfo = 
    dataMap[selections.subject][selections.course][selections.tutor];
 
  var success = createTutoringRequest(selections, tutorInfo);
 
  showPopup(app, (success) ? "REQUEST_CONFIRMATION" : "REQUEST_FAILURE");
  
  app.close();
  return app;
}

/** 
 * Give some feedback that the request for tutoring was accepted (or failed).
 * A modal dialog with a confirmation message is popped open.
 */
function showPopup(app, messageKey) {
  
  // Create a popup panel and set it to be modal.
  var popupPanel = app.createPopupPanel(false, true)
                      .setId("popupPanel");
  
  var panel = app.createVerticalPanel().setStyleAttributes(css.popup);
  var label = app.createLabel(messages.getLabel(messageKey))
                 .setStyleAttributes(css.text);
  var okButton = app.createButton(messages.getLabel("OK"))
                    .setStyleAttributes(css.button);
  
  var okHandler = app.createServerHandler('okClickHandler');
  okButton.addClickHandler(okHandler);
  
  panel.add(label).add(okButton);
  popupPanel.add(panel).setPopupPosition(250, 250);

  // Show the panel. Note that it does not have to be "added" to the UiInstance.
  popupPanel.show();
}

/** 
 * Dismiss the popup when OK button clicked.
 * Also clear all selections so they do not immediately resubmit a request.
 */
function okClickHandler(e) {
  var app = UiApp.getActiveApplication();
  var popupPanel = app.getElementById("popupPanel");
  Logger.log("now hiding ok dialog");
  popupPanel.hide();
  app.getElementById("subjectDroplist").setItemSelected(0, true);
  clearDownStreamSelections(app, ["courseDroplist", "tutorDroplist"]);
  
  app.close();
  return app;
}
