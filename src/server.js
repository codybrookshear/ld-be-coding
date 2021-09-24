const config = require("config");
const EventSource = require("eventsource");
const express = require("express");
const NestedMap = require("./NestedMap");

const eventSource = new EventSource(config.eventSource);
const app = express();

const studentData = new NestedMap(
  "students",
  "studentId",
  "scores",
  "exam",
  "score"
);
const examData = new NestedMap("exams", "exam", "scores", "studentId", "score");

exports.getStudentData = function () {
  return studentData;
};

exports.getExamData = function () {
  return examData;
};

// receive data from the event source and store it
// add to json array
eventSource.addEventListener("score", function (e) {
  let data = JSON.parse(e.data);
  let { studentId, exam, score } = data;

  studentData.set(studentId, exam, score);
  examData.set(exam, studentId, score);
});

// Define REST API routes we serve

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

app.listen(config.port, function () {
  console.log("App listening on port " + config.port);
});
