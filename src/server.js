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
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
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
});

// the URL for the server-sent-events server is stored in
// in config/default.json (or config/test.json in the case of unit tests)
const eventSource = new EventSource(config.eventSource);

// serve our application using express http server
const app = express();

// listen for the "score" event and update our data store
eventSource.addEventListener("score", function (e) {
  let data = JSON.parse(e.data);
  let { studentId, exam, score } = data;

  insertScore(studentId, exam, score);
});

exports.insertScore = function (studentId, exam, score) {
  insertScore(studentId, exam, score);
};

function insertScore(studentId, exam, score) {

  if (typeof studentId !== 'string') {
    return;
  }

  exam = Number(exam);
  if (isNaN(exam)) {
    return;
  }

  score = Number(score);
  if (isNaN(score) || score < 0 || score > 1) {
    return;
  }

  db.serialize(() => {
    db.run("INSERT OR IGNORE INTO students VALUES ('" + studentId + "')");
    db.run("INSERT OR IGNORE INTO exams VALUES (" + exam + ")");
    db.run(
      "INSERT OR REPLACE INTO scores (studentId, exam, score) VALUES('" +
        studentId +
        "', " +
        exam +
        ", " +
        score +
        ")"
    );
  });
}

exports.clearScores = function () {
  clearScores();
};

function clearScores() {
  db.serialize(() => {
    db.run("DELETE from scores");
    db.run("DELETE from students");
    db.run("DELETE from exams");
  });
}
// Define REST API routes we serve, see README.md for detailed definitions

app.get("/students", function (req, res) {
  db.all("SELECT studentId FROM students", [], (err, rows) => {
    if (err) {
      res.send({ students: [] });
    } else {
      res.send({ students: rows });
    }
  });
});

app.get("/students/:id", function (req, res) {
  db.all(
    "SELECT exam, score FROM scores WHERE studentId = '" + req.params.id + "'",
    [],
    (err, rows) => {
      if (err) {
        res.send({ studentId: req.params.id, average: 0, exams: [] });
      } else {
        // got records. now get average
        db.all(
          "SELECT AVG(score) as average FROM scores WHERE studentId = '" +
            req.params.id +
            "'",
          [],
          (err, average) => {
            if (err) {
              res.send({ studentId: req.params.id, average: 0, exams: [] });
            } else {
              if (average[0].average === null) average[0].average = 0;
              res.send({
                studentId: req.params.id,
                average: average[0].average,
                scores: rows,
              });
            }
          }
        );
      }
    }
  );
});

app.get("/exams", function (req, res) {
  db.all("SELECT exam FROM exams", [], (err, rows) => {
    if (err) {
      res.send({ exams: [] });
    } else {
      res.send({ exams: rows });
    }
  });
});

app.get("/exams/:number", function (req, res) {
  let errObj = { exam: req.params.number, average: 0, scores: [] };

  db.all(
    "SELECT studentId, score FROM scores WHERE exam = " + req.params.number,
    [],
    (err, rows) => {
      if (err) {
        res.send(errObj);
      } else {
        // got records. now get average
        db.all(
          "SELECT AVG(score) as average FROM scores WHERE exam = " +
            req.params.number,
          [],
          (err, average) => {
            if (err) {
              res.send(errObj);
            } else {
              if (average[0].average === null) average[0].average = 0;
              res.send({
                exam: parseInt(req.params.number),
                average: average[0].average,
                scores: rows,
              });
            }
          }
        );
      }
    }
  );
});

// listen for HTTP connections on the specified port, as defined
// in config/default.json (or config/test.json in the case of unit tests)
app.listen(config.port, function () {
  console.log("App listening on port " + config.port);
});
