/**
 * This application receives sever-sent-events and redistributes the data
 * over a REST API
 */

const config = require("config");
const EventSource = require("eventsource");
const express = require("express");
const NestedMap = require("./NestedMap");
const sqlite3 = require("sqlite3").verbose();

// initialize database with needed tables
// TODO export for mocha? or create an exported insert() function?
const db = new sqlite3.Database(":memory:");

// students table
db.run("CREATE TABLE students (studentId TEXT PRIMARY KEY)");

// exams table
db.run("CREATE TABLE exams (exam INTEGER PRIMARY KEY)");

// scores table
db.run(
  "CREATE TABLE scores (" +
    "studentId TEXT NOT NULL," +
    "exam INTEGER NOT NULL REFERENCES exams(exam)," +
    "score FLOAT NOT NULL," +
    "FOREIGN KEY (studentId) REFERENCES students(studentId)," +
    "FOREIGN KEY (exam) REFERENCES exams(exam)," +
    "PRIMARY KEY (studentId, exam)" +
    ")"
);

// the URL for the server-sent-events server is stored in
// in config/default.json (or config/test.json in the case of unit tests)
const eventSource = new EventSource(config.eventSource);

// serve our application using express http server
const app = express();

// listen for the "score" event and update our data store
eventSource.addEventListener("score", function (e) {
  let data = JSON.parse(e.data);
  let { studentId, exam, score } = data;

  // insert into tables
  db.run("INSERT OR IGNORE INTO students VALUES ('" + studentId + "')");
  db.run("INSERT OR IGNORE INTO exams VALUES (" + exam + ")");
  db.run("INSERT OR REPLACE INTO scores (studentId, exam, score) VALUES('" + 
    studentId + "', " + exam + ", " + score + ")"
  );
});

// Define REST API routes we serve, see README.md for detailed definitions

app.get("/students", function (req, res) {
  db.all("SELECT studentId FROM students", [], (err, rows) => {
    if (err) {
      res.send({ students: [] });
    }
    res.send({ students: rows });
  });
});

app.get("/students/:id", function (req, res) {
  // let scores = studentData.getInnerValues(req.params.id);
  // res.send(scores);
});

app.get("/exams", function (req, res) {
  db.all("SELECT exam FROM exams", [], (err, rows) => {
    if (err) {
      res.send({ exams: [] });
    }
    res.send({ exams: rows });
  });
});

app.get("/exams/:number", function (req, res) {
  // let scores = examData.getInnerValues(req.params.number);
  // res.send(scores);
});

// listen for HTTP connections on the specified port, as defined
// in config/default.json (or config/test.json in the case of unit tests)
app.listen(config.port, function () {
  console.log("App listening on port " + config.port);
});
