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
  
  sendEmailToRequester(selections, tutorInfo);
  sendEmailToTutor(selections, tutorInfo);
  sendEmailToAdmins(selections, tutorInfo);
  
  // Send email to the teacher who's course it is if one has been configured
  if (config["course: " + selections.course]) {
    sendEmailToTeacher(selections, tutorInfo, config["course: " + selections.course]);
  }
  
  // should log an entry to a spreadsheet as well.
  Logger.log("done sending emails.");
}

/** 
 * Let the requester know that their request was processed, and
 * provide a link to a form where they can provide feedback.
 */
function sendEmailToRequester(selections, tutorInfo) {
  var requesterEmail = Session.getEffectiveUser().getEmail();
  Logger.log("sending mail to "+ requesterEmail);

  var subject = messages.getLabel("REQUEST_CONFIRMATION_SUBJECT");

  var substitutions = [selections.name, tutorInfo.name, tutorInfo.email, tutorInfo.phone];
  var msgKey = (tutorInfo.gender == "Male" ? "MALE" : "FEMALE") + "_TUTOR_REQUESTOR_MSG";
  var body = messages.getLabel(msgKey , substitutions);
  
  MailApp.sendEmail(requesterEmail, subject, body);
}

/** Notify the tutor that his/her services have been requested. */
function sendEmailToTutor(selections, tutorInfo) {
  
  Logger.log("Sending mail to "+ tutorInfo.email);

  var subject = "Tutoring Request from " + selections.name;

  var body = tutorInfo.name + ", " 
      + selections.name + " has requested " + selections.course + " tutoring from you. \n" 
      + "If you are willing to tutor them, respond to this email with a propsed meeting time and place. \n"
      + "If you are unable to tutor them, please let them know, so they can find an alternate.";
  
  var requesterEmail = Session.getEffectiveUser().getEmail();
  MailApp.sendEmail(tutorInfo.email, requesterEmail, subject, body);
}
 
/** Notify the administrators that are configured that a request has been made */
function sendEmailToAdmins(selections, tutorInfo) {

  Logger.log("Sending mail to "+ config.adminEmails);
  
  var subject = "Tutor Match between tutor " + tutorInfo.name + " and " + selections.name;
  var body = "TutorMatch Adminstrator, \n" + getAdminBodyText(selections, tutorInfo)
      + "\nRemaining email quota for today is " + MailApp.getRemainingDailyQuota() + ".\n";
  
  var emails = config.adminEmails.split(',');
  for (var i = 0; i < emails.length; i++) {
    MailApp.sendEmail(emails[i], subject, body);
  }
}

/** If a teacher(s) has been configured for this specific course, then send them an email too */
function sendEmailToTeacher(selections, tutorInfo, teacherEmails) {
  
  Logger.log("Sending teacher mail to "+ teacherEmails);
 
  var subject = "There was a Tutor Match made between tutor " + tutorInfo.name + " and " + selections.name;
  var body = "Dear " + selections.course + " teacher,\n  " + getAdminBodyText(selections, tutorInfo);
  
  var emails = teacherEmails.split(',');
  for (var i = 0; i < emails.length; i++) {
    MailApp.sendEmail(emails[i], tutorInfo.email, subject, body);
  }
}

/** get the email body text for administrators and teachers */
function getAdminBodyText(selections, tutorInfo) {
  
  var requesterEmail = Session.getEffectiveUser().getEmail();
  var body = "A tutoring request for " + selections.course 
    + " has been submitted by " + selections.name + " (" + requesterEmail + ")"
    + " for tutoring by " 
    + tutorInfo.name + " ("  + tutorInfo.email + " / "+ tutorInfo.phone +").";
  return body;
}
