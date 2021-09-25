# Get Student Scores
 * GET /students/:id
 * @description lists the test results for the specified student, and provides
 * the student's average score across all exams
 * @returns JSON string. example: given :id "Orion49" is recieved, a result could be:
 * {"studentId":"Orion49","average":0.7,"scores":[{"exam":16485,"score":0.8},{"exam":16486,"score":0.6}]}
 */