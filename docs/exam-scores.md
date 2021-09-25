# Get Exam Scores

Lists all the scores by student ID for the specified exam, and provides the average score across all students

**URL** : `/exams/:number`

**Method** : `GET`

**Success Response Code** : `200 OK`

**Content examples**

For an exam `:number` of 772 received, that has records available:

```json
{"exam":772,"average":0.66,"scores":[{"studentId":"Kane_Dibbert57","score":0.70},{"studentId":"Mitchell_Botsford90","score":0.62}]}
```
