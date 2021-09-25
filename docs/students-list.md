# Get Students List

Lists all students that have received at least one test score

**URL** : `/students`

**Method** : `GET`

**Success Response Code** : `200 OK`

## Examples

If student records are available:

```json
{
  "students": [
    { "studentId": "Kane_Dibbert57" },
    { "studentId": "Mitchell_Botsford90" },
    { "studentId": "Chloe_Kassulke2" },
    { "studentId": "Americo.Jast" }
  ]
}
```

If no student records are available:

```json
{ "students": [] }
```
