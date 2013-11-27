
/**
 * Submit the request to match a tutor with a student needing tutoring.
 * This will send an email to the tutor, the student, and at least one administrator.
 * @param selections an object with properties for the subject, course, and tutorInfo.
 *    The tutorInfo object with information about the selected tutor like email and phone.
 */
function createTutoringRequest(selections) {
  Logger.log("Subject:" + selections.subject);
  Logger.log("Course:" + selections.course);
  Logger.log("Tutor name:" + selections.tutorInfo.name);
  Logger.log("Tutor email:" + selections.tutorInfo.email);
  Logger.log("Tutor phone:" + selections.tutorInfo.phone);
  
  // Send an email to the requester
  
  // Send an email to the tutor requested
  // Send emails to the administrators
  // Send email to the teacher who's course it is
  
  
}
