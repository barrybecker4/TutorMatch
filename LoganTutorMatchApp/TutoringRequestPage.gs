// something to separate the values set in the tag of a droplist.
var DELIMITER = "::";
// shown as first item in droplist so user knows they must make a selection.
var NO_SELECTION = " --- Select --- ";

/**
 * Creates the user interface elements to show in the tutoring request form.
 * @return the page body element.
 */
function createTutoringRequestPage(app) {
  var body = app.createFlowPanel()
                .setId(TUTORING_REQUEST_PAGE)
                .setStyleAttributes(css.body);
    
  var title = app.createLabel("Tutoring Request Form")
                 .setStyleAttributes(css.title);
  body.add(title);

  var instrText = "The following selections will determine your tutor. " +
    "Each selection determines the values shown in successive drop lists.";
  var instructions = app.createLabel(instrText).setStyleAttributes(css.text);  
                               
  var grid = createGrid(app, 7);
  
  // This little trick allows us to access the dataMap from the server side event handlers.
  // a hidden UI element (hiddenDataMap) stores the dataMap as a JSON string
  var dataMap = getDataMap(app);
  var hiddenDataMap = app.createHidden("hiddenDataMap", Utilities.jsonStringify(dataMap));
  body.add(hiddenDataMap);
  // stores the final result of all the selections
  var hiddenResult = app.createHidden("hiddenResult").setId("hiddenResult");;
  body.add(hiddenResult);
  
  var navigationButtonPanel = createNavigationPanel(app, hiddenResult);
  
  // Place the UI elements in the cells of the grid
  grid.setWidget(0, 0, instructions);
  grid.setWidget(1, 0, createSubjectSelection(app, dataMap, hiddenDataMap));  
  grid.setWidget(2, 0, createCourseSelection(app, dataMap, hiddenDataMap));   
  grid.setWidget(3, 0, createTutorSelection(app, dataMap));    
  grid.setWidget(5, 0, navigationButtonPanel);  
  body.add(grid);  
  
  return body;
}

/** @returns new grid container with one column and the specified number of rows  */
function createGrid(app, numRows) {
	var grid = app.createGrid(numRows, 1).setStyleAttributes(css.grid);
	for (var i = 0; i<numRows; i++) {
	    grid.setStyleAttributes(i, 0, css.gridCell);
	} 
	return grid;
}

/** @returns a panel with the subject droplist and its label */
function createSubjectSelection(app, dataMap, hiddenDataMap) {
  var panel = app.createHorizontalPanel();
  
  var label = app.createLabel("1) Select the subject you would like tutoring in.")
                 .setStyleAttributes(css.text);                        
  var subjectDroplist = createDroplist(app, 'subjectDroplist');  
  populateDroplist(subjectDroplist, dataMap);
  panel.add(label).add(subjectDroplist);
  
  var subjectSelectedHandler = app.createServerHandler('subjectSelectedHandler');
  subjectSelectedHandler.addCallbackElement(subjectDroplist)
                        .addCallbackElement(hiddenDataMap);
  subjectDroplist.addChangeHandler(subjectSelectedHandler);
                             
  return panel;
}

/**
 * Handler that is call when a subject is selected.
 * The selected value will be used to limit successive selectors
 */ 
function subjectSelectedHandler(e) {
  var app = UiApp.getActiveApplication();
  clearDownStreamSelections(app, ["courseDroplist", "tutorDroplist"]);
  
  var selectedSubject = e.parameter.subjectDroplist;
  
  if (selectedSubject != NO_SELECTION) {
    var courseDroplist = app.getElementById("courseDroplist");
    courseDroplist.setTag(selectedSubject);
  
    var dataMap = JSON.parse(e.parameter.hiddenDataMap);
    populateDroplist(courseDroplist, dataMap[selectedSubject]);
  }
 
  app.close();
  return app;
}

/** @returns a panel with the course droplist and its label */
function createCourseSelection(app, dataMap, hiddenDataMap) {
  var panel = app.createHorizontalPanel();
  
  var label = app.createLabel("2) Select the specific course you would like tutoring in.")
                 .setStyleAttributes(css.text);                        
  var courseDroplist = createDroplist(app, 'courseDroplist');  
  panel.add(label).add(courseDroplist);
  
  var courseSelectedHandler = app.createServerHandler('courseSelectedHandler');
  courseSelectedHandler.addCallbackElement(courseDroplist)
                       .addCallbackElement(hiddenDataMap);
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
  
  if (selectedCourse != NO_SELECTION) {  
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
  var panel = app.createHorizontalPanel();
  
  var label = app.createLabel("3) Select from the following list of available tutors for that course.")
                 .setStyleAttributes(css.text);
                        
  var tutorDroplist = createDroplist(app, "tutorDroplist");                           
  panel.add(label).add(tutorDroplist);
  
  var tutorSelectedHandler = app.createServerHandler('tutorSelectedHandler');
  tutorSelectedHandler.addCallbackElement(tutorDroplist);
   //                   .addCallbackElement(hiddenResult);
  tutorDroplist.addChangeHandler(tutorSelectedHandler);
  
  return panel;
}

/**
 * Handler for when the tutor is selected from the droplist.
 */ 
function tutorSelectedHandler(e) {
  var app = UiApp.getActiveApplication();
  
  var selectedTutor = e.parameter.tutorDroplist;
  
  if (selectedTutor != NO_SELECTION) {
    var selectedValues = e.parameter.tutorDroplist_tag;  
    Logger.log("selected tutor = " + selectedTutor);
    Logger.log("prior selected = " + selectedValues);
  
    var hiddenResult = app.getElementById("hiddenResult");
    hiddenResult.setValue(selectedValues + DELIMITER + selectedTutor);
    
    setSubmitState(true);
  }
  app.close();
  return app;
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
 * When the submit button is clicked the hiddenResult (containing the uses selections)
 * are sent to the server callback to be submitted. 
 */
function createNavigationPanel(app, hiddenResult) {

  var navigationPanel = app.createHorizontalPanel();
  
  var backButton = app.createButton('Back')
                      .setStyleAttributes(css.button);
  var fill = app.createHorizontalPanel().setWidth(600);
  
  // disabled until all the selections have been made.
  var submitButton = app.createButton('Submit')
                        .setId("submitButton")
                        .setEnabled(false)
                        .setStyleAttributes(css.buttonDisabled);
                        
  navigationPanel.add(backButton);
  navigationPanel.add(fill);
  navigationPanel.add(submitButton);
  
  var backHandler = app.createServerHandler('backClickHandler');
  backHandler.addCallbackElement(backButton);
  backButton.addClickHandler(backHandler);
  
  var submitHandler = app.createServerHandler('submitClickHandler');
  submitHandler.addCallbackElement(submitButton)
               .addCallbackElement(hiddenResult);
  submitButton.addClickHandler(submitHandler);
  
  return navigationPanel;
}

/**
 * Handler for when the back button is clicked.
 * Return to the main landing page
 */ 
function backClickHandler(e) {
  var app = UiApp.getActiveApplication();

  app.getElementById(LANDING_PAGE).setVisible(true);
  app.getElementById(TUTORING_REQUEST_PAGE).setVisible(false);

  app.close();
  return app;
}

/** @returns a new droplist instance with the specified name */
function createDroplist(app, name) {
  return app.createListBox().setName(name)
            .setId(name)
            .setStyleAttributes(css.droplist);
}

/**
 * The first item is always NO_SELECTION so the user is forced to select something.
 * @param droplist the droplist to populate selection items for
 * @param items array or map entries represent the items to show in the list
 */
function populateDroplist(droplist, items) {
  droplist.addItem(NO_SELECTION);
  
  if (items instanceof Array) {
    for (var i in items) {
      droplist.addItem(items[i]);
    }
  }
  else {
    for (var value in items) {
      droplist.addItem(value);
    }
  }
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
}

/**
 * Handler for when the submit button is clicked.
 * Create the tutoring request, send emails, update calendars, etc.
 */ 
function submitClickHandler(e) {
  var app = UiApp.getActiveApplication();
  
  var selectionStr = e.parameter.hiddenResult;
  var values = selectionStr.split(DELIMITER);
  var selections = {subject:values[0], course: values[1], tutor:values[2]};
 
  createTutoringRequest(selections);
  app.close();
  return app;
}
