Logan TutorMatch
==========
A [tutor matching web application](https://script.google.com/macros/s/AKfycbytDvUvF-SuK3ApupCRfZyir2OLs7wZSlmYLF0z0MumxZg_MaCg/exec). The purpose is to automate [the process](https://docs.google.com/document/d/14xwcChkZ1Gk4oduqrkuyaEkqJUPF4BayAd5MBjmS9dU/edit?usp=sharing) of matching students who need tutoring with those willing to tutor. The work was done in collaboration with the students of James Logan High School in the Computer Science Club, but the application should be appropriate for use by any learning institution. 

The application has 3 primary components
* Landing page - which directs you to fill out a tutor profile form, or a tutoring request.
* Tutor profile form - a [Google form](https://support.google.com/drive/answer/87809?hl=en) which writes to a TutorProfiles spreadsheet.
* Tutoring request page - a dynamically generated form for creating a request.

When a student sees the page that allows them to request tutoring, they first select a subject. Next they select a course for that subject. Finally they select a tutor that is available to tutor for that course. More options may be added in the future (like language, time, and place). The items listed in each successive selection is determined by the one before it. The submit button is enabled only when valid selections have been made.

When the submit button is clicked, an email is sent to the following people.
* To the requester to let them know that their request has been made, and provide a link to a feedback form.
* To the tutor requested to let them know to make tutoring arrangements with requester, and also provide a link to a progress form that can be filled out to track tutoring progress over time.
* To administrator(s) to notify of the new pairing and to review it.
* Optionally, to the teacher who's course it is. The configuration can specify teachers that should be emails for specific courses.

A [configuration spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0ArK43-kBNSp0dHZhWFFpaHZrSVp5V2lYSzlKWEZiSmc#gid=0) is specified that provides the resources (such as forms, spreadsheets, and emails) to use when deployed.
 
## How to Run and Contribute
This is a Google App Script (GAS) application. 
If you would like to contribute, first install [CLASP](https://github.com/google/clasp).
Next git clone this repository somewhere on your local machine. 
Then, from the root of the cloned project directory, run the following commands:
* clasp login     &nbsp; &nbsp;&nbsp;    (_using your github credentials_)
* clasp create --type webapp  &nbsp; (_this creates a script with this name in your Google Drive_)
* clasp push &nbsp;&nbsp;&nbsp; (_push all the files in the project directory into that script in the cloud_)
  
Now you are good to go. Deploy the web-app from your script on Google Drive.
Make changes, do "clasp push", and refresh the deployed app script page to see the change. 
Do git commit, push, and PR, when you have a feature or fix to contribute.
