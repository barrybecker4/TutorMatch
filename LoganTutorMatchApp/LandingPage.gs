/**
 * creates the user interface elements to show in the body of the landing page.
 * @return the root container element of the landing page.
 */
function createLandingPage(app) {
  var body = app.createFlowPanel()
                .setId(LANDING_PAGE)
                .setStyleAttributes(css.body);
    
  var title = app.createLabel("Logan TutorMatch")
                 .setStyleAttributes(css.title);

  var instructions = app.createLabel("Do you want to...")
                        .setStyleAttributes(css.text);
                        
  var tutorProfileUrl = "https://docs.google.com/forms/d/1QFkDoEEpj6iiO569L8rIgiL_YhZch4VBi4vqbXnYPbE/viewform";
  var tutorButtonText = "be a tutor";
  var tutorProfileLink = app.createAnchor(tutorButtonText, tutorProfileUrl)
                            .setTarget("_self")
                            .setStyleAttributes(css.hiddenLink);       
  
  var tutorButton = app.createButton(tutorButtonText)
                       .setStyleAttributes(css.button);
  var tutorButtonPanel = app.createVerticalPanel().setStyleAttributes(css.buttonPanel)
                            .add(tutorButton)
                            .add(tutorProfileLink);
                  
  var tutoringButton = app.createButton('be tutored')
                  .setStyleAttributes(css.button);
                                             
  var grid = app.createGrid(7, 1)
                .setStyleAttributes(css.grid)
                .setStyleAttributes(0, 0, css.gridCell)
                .setStyleAttributes(1, 0, css.gridCell)
                .setStyleAttributes(2, 0, css.gridCell)
                .setStyleAttributes(3, 0, css.gridCell)
  
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

  //var label = app.getElementById('buttonStatusLabel');
  //label.setText('The tutoring button was clicked.');
  //label.setVisible(true);
  
  app.getElementById(LANDING_PAGE).setVisible(false);
  app.getElementById(TUTORING_REQUEST_PAGE).setVisible(true);

  app.close();
  return app;
}
