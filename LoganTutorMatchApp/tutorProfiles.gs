
/**
 * This delimiter separates the subject:course values to be parsed out of the spreadsheet.
 * They are stored in the form  <subject1> : <course1>, <subject1> : <course2>, <subject2> : <course3>, etc
 */
var ENTRY_DELIM = ", ";

/** separates subject and course values */ 
var COURSE_DELIM = " : ";

/** Sometimes &nbsp; is in the string so we need to remove it */
var NBSP_REGEXP = new RegExp(String.fromCharCode(160), "g");

/**
 * Reads from the "Tutor Profile Form (Responses)" spreadsheet 
 * and returns a map from subjects to courses to tutors.
 */ 
function getDataMap() {
  
  Logger.log("A");
  var sheet = SpreadsheetApp.openById(getConfig().tutorProfilesSpreadSheet)
                            .getActiveSheet();
  var cellData = sheet.getSheetValues(2, 2, sheet.getLastRow()-1, 17);
  
  var dataMap = {};
  for (var i=0; i < cellData.length; i++) {
    var row = cellData[i];
    var tutorInfo = {
        name: row[0], 
        gender: row[1], 
        email:row[2], 
        phone: row[3],
        foreignLanguages: row[5],
        availability: row[6],
        graduationYear: row[7],
        status: row[16] // the 18th column is always status, but it is not a field in the form
    };
    var courseList = row[4];
    addToMap(dataMap, tutorInfo, courseList);
  }
  
  return dataMap;
}

/** 
 * Parse the subjects and courses out of courseList and put them in the dataMap.
 * The dataMap maps subjects to courses and courses to the tutors who can tutor them.
 */
function addToMap(dataMap, tutorInfo, courseList) { 
  
  courseList = courseList.replace(NBSP_REGEXP, " ");
  var courses = courseList.split(ENTRY_DELIM);
  
  for (var i=0; i<courses.length; i++) {
    var a = courses[i].split(COURSE_DELIM);
    var subject = a[0];
    var course = a[1];
    if (!dataMap[subject]) {
      dataMap[subject] = {};
    }
    var courseMap = dataMap[subject];
    if (!courseMap[course]) {
      courseMap[course] = {};
    }
    Logger.log("name=" + tutorInfo.name+ " status=" + tutorInfo.status);
    if (!courseMap[course][tutorInfo.name] && tutorInfo.status == 'AVAILABLE') {
      var tutorMap = courseMap[course];
      tutorMap[tutorInfo.name] = tutorInfo;
    }
  }
}
