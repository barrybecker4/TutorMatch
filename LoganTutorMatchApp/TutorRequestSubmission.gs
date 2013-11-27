
/**
 * Submit the request to match a tutor with a student needing tutoring.
 * This will send an email to the tutor, the student, and at least one administrator.
 * @param selections an object with properties for the subject, course, and tutorInfo.
 *    The tutorInfo object with information about the selected tutor like email and phone.
 */
function createTutoringRequest(selections) {
  Logger.log("Requester name:" + selections.name);
  Logger.log("Subject:" + selections.subject);
  Logger.log("Course:" + selections.course);
  Logger.log("Tutor name:" + selections.tutorInfo.name);
  Logger.log("Tutor email:" + selections.tutorInfo.email);
  Logger.log("Tutor phone:" + selections.tutorInfo.phone);
  
  sendEmailToRequester(selections);
  sendEmailToTutor(selections);
  sendEmailToAdmins(selections, config.adminEmails);
  
  // Send email to the teacher who's course it is if one has been configured
  if (config["course: " + selections.course]) {
    sendEmailToTeacher(selections, config["course: " + selections.course]);
  }
  Logger.log("done sending emails");
}

function sendEmailToRequester(selections) {
  var requesterEmail = Session.getEffectiveUser().getEmail();
  Logger.log("sending mail to "+ requesterEmail);

  var subject = "Tutoring Request Confirmation";

  //var name = Session.getEffectiveUser().getName();
  var body = "Thank you, " + selections.name + ", for using the tutor matching application.";

  // Send yourself an email with a link to the document.
  GmailApp.sendEmail(requesterEmail, subject, body);
}

function sendEmailToTutor(selections) {
}

function sendEmailToAdmins(selections) {
}

function sendEmailToTeacher(selections) {
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
