
/**
 * Submit the request to match a tutor with a student needing tutoring.
 * This will send an email to the tutor, the student, and at least one administrator.
 */
function createTutoringRequest(selections) {
  Logger.log("Subject:" + selections.subject);
  Logger.log("Course:" + selections.course);
  Logger.log("Tutor:" + selections.tutor);
}
