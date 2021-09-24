const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("../src/server");
const config = require("config");

chai.use(chaiHttp);

describe("/GET exams/ endpoint", () => {
  let data = server.getExamData();

  beforeEach((done) => {
    data.clear();
    done();
  });

  it("/GET exams/ is empty", (done) => {
    chai
      .request("http://localhost:" + config.port)
      .get("/exams")
      .end((err, res) => {
        expect(res.body.exams.length).to.equal(0);
        done();
      });
  });

  it("/GET exams/ with 3 records", (done) => {
    data.set(1334, "Tom", 0.77);
    data.set(1334, "Rick", 0.81);
    data.set(1335, "Tom", 0.83);

    chai
      .request("http://localhost:" + config.port)
      .get("/exams")
      .end((err, res) => {
        expect(res.body.exams.length).to.equal(2);
        expect(res.body.exams[0].exam).to.equal(1334);
        expect(res.body.exams[1].exam).to.equal(1335);
        done();
      });
  });

  it("/GET exams/1334 - verify studentIds and average", (done) => {
    data.set(1334, "Tom", 0.77);
    data.set(1334, "Rick", 0.81);
    data.set(1335, "Tom", 0.83);

    chai
      .request("http://localhost:" + config.port)
      .get("/exams/1334")
      .end((err, res) => {
        //console.log(JSON.stringify(res.body));
        expect(res.body.exam).to.equal(1334);
        expect(res.body.average).to.equal(0.79);
        expect(res.body.scores.length).to.equal(2);
        expect(res.body.scores[0].studentId).to.equal("Tom");
        expect(res.body.scores[0].score).to.equal(0.77);
        expect(res.body.scores[1].studentId).to.equal("Rick");
        expect(res.body.scores[1].score).to.equal(0.81);

        done();
      });
  });

  it("/GET exams/1334 when dataset is empty", (done) => {
    chai
      .request("http://localhost:" + config.port)
      .get("/exams/1334")
      .end((err, res) => {
        expect(res.body.exam).to.equal(1334);
        expect(res.body.average).to.equal(0);
        expect(res.body.scores.length).to.equal(0);
        done();
      });
  });

  it("/GET exams/1334 when no matching records", (done) => {
    data.set(1335, "Tom", 0.83);

    chai
      .request("http://localhost:" + config.port)
      .get("/exams/1334")
      .end((err, res) => {
        expect(res.body.exam).to.equal(1334);
        expect(res.body.average).to.equal(0);
        expect(res.body.scores.length).to.equal(0);
        done();
      });
  });
});
