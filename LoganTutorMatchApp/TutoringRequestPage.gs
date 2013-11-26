// something to separate the values set in the tag of a droplist.
var DELIMITER = "::";
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

  var instructions = app.createLabel("The following selections will determine your tutor. Each selection determines the values shown in successive drop lists.")
                        .setStyleAttributes(css.text);  
                               
  var navigationButtonPanel = createNavigationPanel(app);
  
  var grid = app.createGrid(7, 1)
                .setStyleAttributes(css.grid)
                .setStyleAttributes(0, 0, css.gridCell)
                .setStyleAttributes(1, 0, css.gridCell)
                .setStyleAttributes(2, 0, css.gridCell)
                .setStyleAttributes(3, 0, css.gridCell)
                .setStyleAttributes(4, 0, css.gridCell)
                .setStyleAttributes(6, 0, css.gridCell)
  
  body.add(title); 
  
  // This little trick allows us to access the dataMap from the server side event handlers.
  // a hidden UI element (hiddenDataMap) stores the dataMap as a JSON string
  var dataMap = getDataMap(app);
  var hiddenDataMap = app.createHidden("hiddenDataMap", Utilities.jsonStringify(dataMap));
  body.add(hiddenDataMap);
  
  // Place the UI elements in the cells of the grid
  grid.setWidget(0, 0, instructions);
  grid.setWidget(1, 0, createSubjectSelection(app, dataMap, hiddenDataMap));  
  grid.setWidget(2, 0, createCourseSelection(app, dataMap, hiddenDataMap));   
  grid.setWidget(3, 0, createTutorSelection(app, dataMap));    
  grid.setWidget(5, 0, navigationButtonPanel);  
  body.add(grid);  
  
  return body;
}

/** create subject droplist */
function createSubjectSelection(app, dataMap, hiddenDataMap) {
  var panel = app.createHorizontalPanel();
  
  var label = app.createLabel("1) Select the subject you would like tutoring in.")
                 .setStyleAttributes(css.text);
                        
  var subjectDroplist = app.createListBox()
                           .setName("subjectDroplist")
                           .setId('subjectDroplist')
                           .setStyleAttributes(css.droplist);
  
  subjectDroplist.addItem(NO_SELECTION);
  for (var subject in dataMap) {
    subjectDroplist.addItem(subject);
  }
  var subjectSelectedHandler = app.createServerHandler('subjectSelectedHandler');
  subjectSelectedHandler.addCallbackElement(subjectDroplist)
                        .addCallbackElement(hiddenDataMap);
  subjectDroplist.addChangeHandler(subjectSelectedHandler);
                           
  panel.add(label).add(subjectDroplist);
  return panel;
}

/**
 * Handler that is call when a subject is selected.
 * The selected value will be used to limit successive selectors
 */ 
function subjectSelectedHandler(e) {
  var app = UiApp.getActiveApplication();

  var courseDroplist = app.getElementById("courseDroplist");
  
  var selectedSubject = e.parameter.subjectDroplist;
  Logger.log("sub="+selectedSubject);
  courseDroplist.setTag(selectedSubject);
  
  var dataMap = JSON.parse(e.parameter.hiddenDataMap);
  var courseMap = dataMap[selectedSubject];
  courseDroplist.clear();
  courseDroplist.addItem(NO_SELECTION);
  for (var course in courseMap) {
    courseDroplist.addItem(course);
  }
 
  app.close();
  return app;
}

function createCourseSelection(app, dataMap, hiddenDataMap) {
  var panel = app.createHorizontalPanel();
  
  var label = app.createLabel("2) Select the specific course you would like tutoring in.")
                 .setStyleAttributes(css.text);
                        
  var courseDroplist = app.createListBox()
                          .setName('courseDroplist')
                          .setId('courseDroplist')
                          .setStyleAttributes(css.droplist);
  
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
  Logger.log("subject="+ selectedSubject);  
  Logger.log("course="+ selectedCourse);
  
  var tutorDroplist = app.getElementById("tutorDroplist");
  tutorDroplist.setTag(selectedSubject + DELIMITER + selectedCourse);
  
  // populate tutors based on subject and course.
  var dataMap = JSON.parse(e.parameter.hiddenDataMap);
  var courseMap = dataMap[selectedSubject];
  var tutorList = courseMap[selectedCourse];
  tutorDroplist.clear();
  tutorDroplist.addItem(NO_SELECTION);
  for (var i = 0; i < tutorList.length; i++) {
    tutorDroplist.addItem(tutorList[i]);
  }
  
  app.close();
  return app;
}

function createTutorSelection(app, dataMap) {
  var panel = app.createHorizontalPanel();
  
  var label = app.createLabel("3) Select from the following list of available tutors for that course.")
                 .setStyleAttributes(css.text);
                        
  var tutorDroplist = app.createListBox()
                         .setName('tutorDroplist')
                         .setId('tutorDroplist')
                         .setStyleAttributes(css.droplist);
                           
  panel.add(label).add(tutorDroplist);
  
  var tutorSelectedHandler = app.createServerHandler('tutorSelectedHandler');
  tutorSelectedHandler.addCallbackElement(tutorDroplist);
  tutorDroplist.addChangeHandler(tutorSelectedHandler);
  
  return panel;
}

/**
 * Handler for when the tutor is selected from the droplist.
 */ 
function tutorSelectedHandler(e) {
  var app = UiApp.getActiveApplication();

  var selectedTutor = e.parameter.tutorDroplist;
  var selectedValues = e.parameter.tutorDroplist_tag;  
  Logger.log("selected tutor = " + selectedTutor);
  Logger.log("prior selected = " + selectedValues);
  var values = selectedValues.split(DELIMITER);
  Logger.log("seelctedArray = "+ values);  
  
  app.getElementById("submitButton").setStyleAttributes(css.button)
                                    .setEnabled(true); 
  app.close();
  return app;
}

/**
 * contains the back and submit buttons at the bottom 
 */
function createNavigationPanel(app, dataMap) {

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
  submitHandler.addCallbackElement(submitButton);
  //             .addCallbackElement(app.getElementById("subjectDroplist"));
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

/**
 * Handler for when the submit button is clicked.
 * Create the tutoring request, send emails, update calendars, etc.
 */ 
function submitClickHandler(e) {
  var app = UiApp.getActiveApplication();
  
  Logger.log("Selections were made.");
  //Logger.log("Subject:" + e.parameter.subjectDroplist_tag);
  //Logger.log("Course:" + course);
  //Logger.log("Tutor:" + tutor);

  app.close();
  return app;
}
