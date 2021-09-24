var EventSource = require("eventsource");
var express = require("express");
var NestedMap = require("./NestedMap");

const PORT = process.env.PORT || 3000;

const eventSource = new EventSource(
  "https://live-test-scores.herokuapp.com/scores"
);

// TODO put in separate file

var app = express();
var studentData = new NestedMap("studentId", "scores", "exam", "score");
var examData = new NestedMap("exam", "scores", "studentId", "score");

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
  let students = studentData.getOuterKeys("studentId");
  res.send({ students: students });
});

app.get("/students/:id", function (req, res) {
  let scores = studentData.getInnerValues(req.params.id);
  res.send(scores);
});

app.get("/exams", function (req, res) {
  let exams = examData.getOuterKeys("exam");
  res.send({ exams: exams });
});

app.get("/exams/:number", function (req, res) {
  let scores = examData.getInnerValues(req.params.number);
  res.send(scores);
});

app.listen(PORT, function () {
  console.log("App listening on port " + PORT);
});
