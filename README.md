# LD test scores app

Server-based app designed to the specifications defined in [PROBLEM.md](PROBLEM.md).

## Building

- Run `npm install`
- You will need **node** and **npm** [installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). Tested using **node** version **v10.19.0** and **npm** version **6.14.4**.

## Running

- Run `node src/server.js` in the root of the project. Then see **testing** below.

## Manual Testing

- By default, app is served on port 3000, but you can change this in **config/default.json** (or **conifg/test.json** in the case of running unit tests)

- Access the endpoints using either your web browser (Chrome/Firefox/etc) or use `curl`:

   ```bash
   $ curl http://localhost:3000/students
   $ curl http://localhost:3000/students/Nicola92
   $ curl http://localhost:3000/exams
   curl http://localhost:3000/exams/3713
   ```

## Unit tests

- Run `npm run test` in the root of the project to run **_mocha/chai_** unit tests

## REST API definitions

* [Get Students List](docs/students-list.md) : `GET /students`
* [Get Student Scores](docs/student-scores.md) : `GET /students/:id`
* [Get Exams List](docs/exams-list.md) : `GET /exams`
* [Get Exam Scores](docs/exam-scores.md) : `GET /exams/:number`
