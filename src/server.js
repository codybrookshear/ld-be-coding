/**
 * This application receives sever-sent-events and redistributes the data
 * over a REST API
 */

const config = require("config");
const EventSource = require("eventsource");
const express = require("express");
const NestedMap = require("./NestedMap");

// the URL for the server-sent-events server is stored in
// in config/default.json (or config/test.json in the case of unit tests)
const eventSource = new EventSource(config.eventSource);

// serve our application using express http server
const app = express();

/** stores the data received in a student-centric way */
const studentData = new NestedMap(
  "students",
  "studentId",
  "scores",
  "exam",
  "score",
  false,
  true
);

/** stores the data received in a exam-centric way */
const examData = new NestedMap(
  "exams",
  "exam",
  "scores",
  "studentId",
  "score",
  true,
  false
);

/**
 * Get access to the studentData map. The only user should be the unit test framework!
 * @returns the studentData map
 */
exports.getStudentData = function () {
  return studentData;
};

/**
 * Get access to the examData map. The only user should be the unit test framework!
 * @returns the examData map
 */
exports.getExamData = function () {
  return examData;
};

// listen for the "score" event and update our data store
eventSource.addEventListener("score", function (e) {
  let data = JSON.parse(e.data);
  let { studentId, exam, score } = data;

  studentData.set(studentId, exam, score);
  examData.set(exam, studentId, score);
});

// Define REST API routes we serve, see README.md for detailed definitions

app.get("/students", function (req, res) {
  let students = studentData.getOuterKeys();
  res.send(students);
});

app.get("/students/:id", function (req, res) {
  let scores = studentData.getInnerValues(req.params.id);
  res.send(scores);
});

app.get("/exams", function (req, res) {
  let exams = examData.getOuterKeys();
  res.send(exams);
});

app.get("/exams/:number", function (req, res) {
  let scores = examData.getInnerValues(req.params.number);
  res.send(scores);
});

// listen for HTTP connections on the specified port, as defined
// in config/default.json (or config/test.json in the case of unit tests)
app.listen(config.port, function () {
  console.log("App listening on port " + config.port);
});
