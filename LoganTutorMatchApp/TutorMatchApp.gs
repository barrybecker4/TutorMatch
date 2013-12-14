
// Names of the two pages in the application.
var LANDING_PAGE = "landingPage";
var TUTORING_REQUEST_PAGE = "tutoringRequestPage"; 

/**
 * The entry point for TutorMatching web application.
 * A link to this application should be placed on the JLHS homepage.
 * It has 3 primary components
 *
 * 1) landing page - which directs you to fill out a tutor profile form, or a tutoring request.
 * 2) the tutor profile form - which writes to a TutorProfiles spreadsheet.
 * 3) tutoring request page - page with a dynamically generated form for creating a request.
 */
function doGet() {
  var app = UiApp.createApplication();
  
  var landingPage = createLandingPage(app);
  app.add(landingPage);
  
  // this page is just a stub and hidden initially
  var tutoringRequestPage = app.createFlowPanel().setId(TUTORING_REQUEST_PAGE);
  tutoringRequestPage.setVisible(false);
  app.add(tutoringRequestPage);
  
  return app;
}
