/**
 * Submit the request to match a tutor with a student needing tutoring.
 * This will send an email to the tutor, the student, and at least one administrator.
 * It could also automatically schedule Google Calendar events given time and place preferences,
 * but does not do this yet.
 * @param selections - an object with properties for the selected subject, course, and tutor.
 * @param tutorInfo information about the selected tutor like name, gender, email, and phone.
 */
function createTutoringRequest(selections, tutorInfo) {
  
  Logger.log("Requester name:" + selections.name);
  Logger.log("Subject:" + selections.subject);
  Logger.log("Course:" + selections.course);
  Logger.log("Tutor name:" + tutorInfo.name);
  Logger.log("Tutor gender:" + tutorInfo.gender);
  Logger.log("Tutor email:" + tutorInfo.email);
  Logger.log("Tutor phone:" + tutorInfo.phone);
  
  Logger.log("Remaingin email quota : " + MailApp.getRemainingDailyQuota());
  
  sendEmailToRequester(selections, tutorInfo);
  sendEmailToTutor(selections, tutorInfo);
  sendEmailToAdmins(selections, tutorInfo);
  
  // Send email to the teacher who's course it is if one has been configured
  if (config["course: " + selections.course]) {
    sendEmailToTeacher(selections, tutorInfo, config["course: " + selections.course]);
  }
  Logger.log("done sending emails.");
}

/** 
 * Let the requester know that there request was processed and
 * provide a link to a form where they can provide feedback.
 */
function sendEmailToRequester(selections, tutorInfo) {
  var requesterEmail = Session.getEffectiveUser().getEmail();
  Logger.log("sending mail to "+ requesterEmail);

  var subject = "Tutoring Request Confirmation";

  //var name = Session.getEffectiveUser().getName();
  var proNoun1 = tutorInfo.gender == "Male" ? "His" : "Her";
  var proNoun2 = tutorInfo.gender == "Male" ? "He" : "She";
  var body = selections.name + ", your request for tutoring has been recieved and processed.\n" +
      "Your tutor is " + tutorInfo.name + ". "  + proNoun1 + " contact info is the following: \n"
      + " email: " + tutorInfo.email + "\n"
      + " phone: " + tutorInfo.phone + "\n"
      + proNoun2 + " will contact you shortly with a proposed time and place to meet.";
  
  MailApp.sendEmail(requesterEmail, subject, body);
}

function sendEmailToTutor(selections, tutorInfo) {
  
  Logger.log("sending mail to "+ tutorInfo.email);

  var subject = "Tutoring Request from " + selections.name;

  var body = tutorInfo.name + ", " 
      + selections.name + " has requested " + selections.course + " tutoring from you. \n" 
      + "If you are willing to tutor them, respond to this email with a propsed meeting time and place. \n"
      + "If you are unable to tutor them, please let them know, so they can find an alternate.";
  
  var requesterEmail = Session.getEffectiveUser().getEmail();
  MailApp.sendEmail(tutorInfo.email, requesterEmail, subject, body);
}

function sendEmailToAdmins(selections, tutorInfo) {
  // config.adminEmails
}

function sendEmailToTeacher(selections, tutorInfo, teacherEmails) {
}

/*
function emailStatusUpdates() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getActiveRange().getRowIndex();
  var userEmail = sheet.getRange(row, getColIndexByName("Contact email")).getValue();
  var subject = "Helpdesk Ticket #" + row;
  var body = "We've updated the status of your ticket.\n\nStatus: " + sheet.getRange(row, getColIndexByName("Status")).getValue();
  body += "\n\nNotes: " + sheet.getRange(row, getColIndexByName("Notes")).getValue();
  body += "\n\nResolution: " + sheet.getRange(row, getColIndexByName("Resolution")).getValue();

  MailApp.sendEmail(userEmail, subject, body, {name:"Help Desk"});
}*/
