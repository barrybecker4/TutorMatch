/**
 * Submit the request to match a tutor with a student needing tutoring.
 * This will do the following:
 *  - send an email to the tutor, the student, and at least one administrator.
 *  - write a row to a configured logging spreadsheet that a request was made.
 *  - Potentially automatically schedule Google Calendar events given time and place preferences,
 *    (not done yet).
 * @param selections - an object with properties for the selected subject, course, and tutor.
 * @param tutorInfo information about the selected tutor like name, gender, email, and phone.
 * @return true if all emails successfully sent. False if quota limit exceeded or some other problem.
 */
function createTutoringRequest(selections, tutorInfo) {

  //Logger.log( Utilities.jsonStringify(selections) ); // this should be the same as below
  Logger.log("Requester name:" + selections.name);
  Logger.log("Subject:" + selections.subject);
  Logger.log("Course:" + selections.course);
  Logger.log("Tutor name:" + tutorInfo.name);
  Logger.log("Tutor gender:" + tutorInfo.gender);
  Logger.log("Tutor email:" + tutorInfo.email);
  Logger.log("Tutor phone:" + tutorInfo.phone);

  var success = sendEmailToRequester(selections, tutorInfo);
  if (success) {
      success = sendEmailToTutor(selections, tutorInfo);
  }
  if (success) {
      success = sendEmailToAdmins(selections, tutorInfo);
  }

  // Send email to the teacher who's course it is if one has been configured
  if (success && getConfig()["course: " + selections.course]) {
    success = sendEmailToTeacher(selections, tutorInfo, getConfig()["course: " + selections.course]);
  }

  if (success) {
      writeLogEntry(selections, tutorInfo);

      // should log an entry to a spreadsheet as well.
      Logger.log("done sending emails.");
  }
  return success;
}

/**
 * Let the requester know that their request was processed, and
 * provide a link to a form where they can provide feedback.
 * @return true if email successfully sent.
 */
function sendEmailToRequester(selections, tutorInfo) {
  var requesterEmail = getUserEmail();
  Logger.log("sending mail to "+ requesterEmail);

  var subject = messages.getLabel("REQUEST_CONFIRMATION_SUBJECT");

  var substitutions = [selections.name, tutorInfo.name, tutorInfo.email, tutorInfo.phone];
  var msgKey = (tutorInfo.gender == "Male" ? "MALE" : "FEMALE") + "_TUTOR_REQUESTOR_MSG";
  var body = messages.getLabel(msgKey , substitutions);

  return sendEmail(requesterEmail, requesterEmail, subject, body);
}

/**
 * Notify the tutor that his/her services have been requested.
 * @return true if email successfully sent.
 */
function sendEmailToTutor(selections, tutorInfo) {

  Logger.log("Sending mail to "+ tutorInfo.email);

  var subject = "Tutoring Request from " + selections.name;

  var body = tutorInfo.name + ",<br> "
      + selections.name + " has requested " + selections.course + " tutoring from you. <br>"
      + "If you are willing to tutor him/her, respond to this email with a proposed meeting time and place. <br>"
      + "If you are unable to tutor them, please let them know, so they can find an alternate.<br><br>"
      + "Some possible reasons for denying a tutoring request:<ul>"
      + "  <li>Too busy to take on new tutors. (If this is the case, please update your tutor profile "
      + "    to show \"unavailable\" or contact a tutoring administrator : " + getConfig().adminEmails + ").</li>"
      + "  <li>You may deny them if their request had missing or inaccurate information.</li>"
      + "  <li>Some other legitimate reason. Please be considerate when sending a response.</li></ul>"
      + "If for any reason you find it necessary to contact their parent, You may do so using "
      + selections.parentEmail + " / " + selections.parentPhone;

  var requesterEmail = getUserEmail();
  return sendEmail(tutorInfo.email, requesterEmail, subject, body);
}

/**
 * Notify the administrators that are configured that a request has been made
 * @return true if email(s) successfully sent.
 */
function sendEmailToAdmins(selections, tutorInfo) {

  Logger.log("Sending mail to "+ getConfig().adminEmails);

  var subject = "Tutor Match between tutor " + tutorInfo.name + " and " + selections.name;
  var body = "TutorMatch Administrator, <br>" + getAdminBodyText(selections, tutorInfo)
      + "<br>Remaining email quota for today is " + MailApp.getRemainingDailyQuota() + ".<br>";

  var emails = getConfig().adminEmails.split(',');

  for (var i = 0; i < emails.length; i++) {
    if (!sendEmail(emails[i], tutorInfo.email, subject, body))
       return false;
  }
  return true;
}

/**
 * If a teacher(s) has been configured for this specific course, then send them an email too
 * @return true if all teacher emails successfully sent.
 */
function sendEmailToTeacher(selections, tutorInfo, teacherEmails) {

  Logger.log("Sending teacher mail to "+ teacherEmails);

  var subject = "There was a Tutor Match made between tutor " + tutorInfo.name + " and " + selections.name;
  var body = "Dear " + selections.course + " teacher,<br>  " + getAdminBodyText(selections, tutorInfo);

  var emails = teacherEmails.split(',');
  for (var i = 0; i < emails.length; i++) {
    if (!sendEmail(emails[i], tutorInfo.email, subject, body))
      return false;
  }
  return true;
}

/** get the email body text for administrators and teachers */
function getAdminBodyText(selections, tutorInfo) {

  var requesterEmail = getUserEmail();
  var body = "A tutoring request for " + selections.course
    + " has been submitted by " + selections.name + " (" + requesterEmail + ")"
    + " for tutoring by "
    + tutorInfo.name + " ("  + tutorInfo.email + " / "+ tutorInfo.phone +").<br>"
    + " The contact info for " + selections.name + "'s parent is "
    + selections.parentEmail + " / " + selections.parentPhone;
  return body;
}

/**
 * Try to send the email to the specified recipient.
 * If an error occurs (probably because a quota was hit) log the error.
 * @return true if email successfully sent. False if quota exceeded or some other error.
 */
function sendEmail(toEmail, fromEmail, subject, htmlBody) {
  try {
    //MailApp.sendEmail(toEmail, fromEmail, subject, String(htmlBody));
    MailApp.sendEmail({
        to: toEmail,
        subject: subject,
        htmlBody: htmlBody
      });
  }
  catch (error) {
    writeErrorToLog(fromEmail, toEmail, subject, "Unable to send email. " + error.message);
    return false;
  }
  return true;
}

/**
 * Write a row entry to the configured logging spreadsheet.
 * If this is the first entry, an initial header row will also be written.
 */
function writeErrorToLog(fromEmail, toEmail, subject, errorMessage) {
  var rowRange = getNextLogEntryToWriteTo();

  var date = new Date();
  rowRange.setValues([[
      date.toLocaleDateString(), date.toLocaleTimeString(),
      "", getUserEmail(), subject, "", "", errorMessage, "", "", ""
  ]]);
}

/**
 * Write a row entry to the configured logging spreadsheet.
 * If this is the first entry, an initial header row will also be written.
 */
function writeLogEntry(selections, tutorInfo) {
  var rowRange = getNextLogEntryToWriteTo();

  var date = new Date();
  rowRange.setValues([[
      date.toLocaleDateString(), date.toLocaleTimeString(),
      selections.name, getUserEmail(),
      tutorInfo.name, tutorInfo.email, selections.course, "-",
      selections.studentId, selections.parentEmail, selections.parentPhone
  ]]);
}

/**
 * Open the spreadsheet and get the newly created next row.
 * If this is the first time the spreadsheet has been written to, add the header row.
 * @return the next row of cells in the logging spread sheet to write to.
 */
function getNextLogEntryToWriteTo() {
  var sheet = SpreadsheetApp.openById(getConfig().loggingSpreadSheet).getSheets()[0];
  var lastRow = sheet.getLastRow();
  Logger.log("logging to "+ getConfig().loggingSpreadSheet + " lastRow = "+ lastRow);

  if (lastRow == 1) {
    var headerRange = sheet.getRange("A1:K1");
    headerRange.setValues([[
        "Date", "Time",
        "Requester", "Requester Email",
        "Tutor Requested", "Tutor Email",
        "Course", "Message", "Requester StudentID", "Requester ParentEmail", "Requester ParentPhone"
    ]]);
  }

  // add the entry at the position right after the last row
  lastRow++;
  return sheet.getRange("A" + lastRow + ":K" + lastRow);
}
