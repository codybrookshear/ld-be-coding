var EventSource = require("eventsource");
var express = require("express");

const PORT = process.env.PORT || 3000;

const eventSource = new EventSource(
  "https://live-test-scores.herokuapp.com/scores"
);

// TODO put in separate file

class ScoreMap {
  constructor() {
    // exams => students => scores
    // exams is a map of exam numbers to maps of student scores
    this.exams = new Map();

    // students => exams => scores
    // students is a map of student ids to maps of exam numbers scores
    this.students = new Map();
  }

  set(record) {
    let obj = JSON.parse(record);

    // TODO - how to best check? what to do if bad?
    if (obj === null) return;

    // rewrite exam as a string so we can use it as a map key
    obj.exam = String(obj.exam);

    // TODO - write a generic function that can be called here?
    // TODO - and just pass in the base map in question?
    // TODO - would this be better for testability?

    // update this student's map of exams to scores
    let student = this.students.get(obj.studentId);
    if (student === undefined) {
      student = new Map();
    }
    student.set(obj.exam, obj.score);
    this.students.set(obj.studentId, student);

    // update the exam records for this student
    let exam = this.exams.get(obj.exam);
    if (exam === undefined) {
      exam = new Map();
    }
    exam.set(obj.studentId, obj.score);
    this.exams.set(obj.exam, exam);
  }

  getStudents() {
    let res = [];

    for (let student of this.students.keys()) {
      res.push({ studentId: student });
    }

    return { students: res };
  }

  getStudent(studentId) {
    let scores = [];
    let exams = this.students.get(studentId);

    if (exams !== undefined) {
      for (let exam of exams.keys()) {
        scores.push({ exam: exam, score: exams.get(exam) });
        // TODO calc average
      }
    }

    // TODO return average
    return { studentId: studentId, scores: scores };
  }

  getExams() {
    let res = [];

    for (let exam of this.exams.keys()) {
      res.push({ exam: exam });
    }

    return { exams: res };
  }

  getExam(exam) {
    let scores = [];
    let students = this.exams.get(exam);

    if (students !== undefined) {
      for (let student of students.keys()) {
        scores.push({ studentId: student, score: students.get(student) });
        // TODO calc average
      }
    }

    // TODO return average
    return { exam: exam, scores: scores };
  }
}

var app = express();
var scores = new ScoreMap();

// receive data from the event source and store it
// add to json array
eventSource.addEventListener("score", function (e) {
  scores.set(e.data);
});

// Define REST API routes we serve

app.get("/students", function (req, res) {
  res.send(scores.getStudents());
});

app.get("/students/:id", function (req, res) {
  res.send(scores.getStudent(req.params.id));
});

app.get("/exams", function (req, res) {
  res.send(scores.getExams());
});

app.get("/exams/:number", function (req, res) {
  res.send(scores.getExam(req.params.number));
});

app.listen(PORT, function () {
  console.log("App listening on port " + PORT);
});
