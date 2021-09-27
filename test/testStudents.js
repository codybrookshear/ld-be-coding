const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("../src/server");
const config = require("config");

chai.use(chaiHttp);

describe("/GET students/ endpoint", () => {
  beforeEach((done) => {
    server.clearScores();
    done();
  });

  it("/GET students/ is empty", (done) => {
    chai
      .request("http://localhost:" + config.port)
      .get("/students")
      .end((err, res) => {
        expect(res.body.students.length).to.equal(0);
        done();
      });
  });

  it("/GET students/ with 3 records", (done) => {
    server.insertScore("Tom", 1334, 0.77);
    server.insertScore("Rick", 1334, 0.81);
    server.insertScore("Tom", 1335, 0.83);

    chai
      .request("http://localhost:" + config.port)
      .get("/students")
      .end((err, res) => {
        expect(res.body.students.length).to.equal(2);
        expect(res.body.students[0].studentId).to.equal("Tom");
        expect(res.body.students[1].studentId).to.equal("Rick");
        done();
      });
  });

  it("/GET students/Tom - verify exams and average", (done) => {
    server.insertScore("Tom", 1334, 0.77);
    server.insertScore("Rick", 1334, 0.81);
    server.insertScore("Tom", 1335, 0.83);

    chai
      .request("http://localhost:" + config.port)
      .get("/students/Tom")
      .end((err, res) => {
        expect(res.body.studentId).to.equal("Tom");
        expect(res.body.average).to.equal(0.8);
        expect(res.body.scores.length).to.equal(2);
        expect(res.body.scores[0].exam).to.equal(1334);
        expect(res.body.scores[0].score).to.equal(0.77);
        expect(res.body.scores[1].exam).to.equal(1335);
        expect(res.body.scores[1].score).to.equal(0.83);

        done();
      });
  });

  it("/GET students/Tom when dataset is empty", (done) => {
    chai
      .request("http://localhost:" + config.port)
      .get("/students/Tom")
      .end((err, res) => {
        expect(res.body.studentId).to.equal("Tom");
        expect(res.body.average).to.equal(0);
        expect(res.body.scores.length).to.equal(0);
        done();
      });
  });

  it("/GET students/Tom when no matching records", (done) => {
    server.insertScore("Rick", 1334, 0.81);

    chai
      .request("http://localhost:" + config.port)
      .get("/students/Tom")
      .end((err, res) => {
        expect(res.body.studentId).to.equal("Tom");
        expect(res.body.average).to.equal(0);
        expect(res.body.scores.length).to.equal(0);
        done();
      });
  });
});
