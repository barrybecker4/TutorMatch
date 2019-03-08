/**
 * This delimiter separates the subject:course values to be parsed out of the spreadsheet.
 * They are stored in the form  <subject1> : <course1>, <subject1> : <course2>, <subject2> : <course3>, etc
 */
var ENTRY_DELIM = ", ";

/** separates subject and course values */ 
var COURSE_DELIM = " : ";

/** Sometimes &nbsp; is in the string so we need to remove it */
var NBSP_REGEXP = new RegExp(String.fromCharCode(160), "g");

/** If there are ever more questions/columns than this in the form, then increase this */
var MAX_COLUMNS = 18;

/**
 * Reads from the "Tutor Profile Form (Responses)" spreadsheet 
 * and returns a map from subjects to courses to tutors.
 * Originally this code assumed the profile questions never changed, but
 * that was not robust. Now the code assumes that there will be certain
 * questions present, and looks for them specifically.
 */ 
function getDataMap() {
  
  var sheet = SpreadsheetApp.openById(getConfig().tutorProfilesSpreadSheet)
                            .getActiveSheet();
  var header = sheet.getSheetValues(1, 2, 1, MAX_COLUMNS);
  var cellData = sheet.getSheetValues(2, 2, sheet.getLastRow() - 1, MAX_COLUMNS);
  
  var dataMap = {};
  for (var i = 0; i < cellData.length; i++) {
    var row = cellData[i];
    createMapEntry(header[0], row, dataMap);
  }
  
  return dataMap;
}

/**
 * @param header the header row will all the column (i.e. question) strings.
 *   These questions are identified by key substrings. That way they can be re-ordered
 *   and still identified.
 * @param row row of form data. Certain columns are assumed to be present.
 * @param dataMap the map to add the data to once it has been extracted.
 */
function createMapEntry(header, row, dataMap) {
  
  var tutorInfo = {};
  var courseList = "";
  
  for (var i = 0; i < row.length; i++) {
    
    var question = header[i];
    // Logger.log("header " + i + " = " + question);
    if (question.indexOf("What is your name") >= 0) {
      tutorInfo.name = row[i]; 
    }
    else if (question.indexOf("gender") >= 0) {
      tutorInfo.gender = row[i]; 
    }
    else if (question.indexOf("What is your email") >= 0 
          || question.indexOf("Username") >= 0) {
      tutorInfo.email = row[i]; 
    }
    else if (question.indexOf("your phone number") >= 0) {
      tutorInfo.phone = row[i]; 
    }
    else if (question.indexOf("graduate") >= 0) {
      tutorInfo.graduationYear = row[i]; 
    }   
    else if (question.indexOf("languages") >= 0) {
      tutorInfo.foreignLanguages = row[i]; 
    } 
    else if (question.indexOf("When are you available") >= 0) {
      tutorInfo.whenAvailable = row[i]; 
    } 
    else if (question.indexOf("currently looking") >= 0) {
      tutorInfo.available = row[i]; 
    }   
    else if (question.indexOf("STATUS") >= 0) {
      // this field is not actually shown in the form
      tutorInfo.status = row[i]; 
    }
    else if (question.indexOf("Which classes") >= 0) {
      courseList = row[i]; 
    }
  }
 
  addToMap(dataMap, tutorInfo, courseList);
}

/** 
 * Parse the subjects and courses out of courseList and put them in the dataMap.
 * The dataMap maps subjects to courses and courses to the tutors who can tutor them.
 */
function addToMap(dataMap, tutorInfo, courseList) { 
  
  //Logger.log("adding name=" + tutorInfo.name + " course=" + course
  //      + " status=" + tutorInfo.status + " available=" + tutorInfo.available+ " with courses = "+ courseList);
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
    // Logger.log("name=" + tutorInfo.name + " course=" + course
    //    + " status=" + tutorInfo.status + " available=" + tutorInfo.available);
    if (!courseMap[course][tutorInfo.name] && tutorInfo.status == 'AVAILABLE') {
      var tutorMap = courseMap[course];
      tutorMap[tutorInfo.name] = tutorInfo;
    }
  }
}
