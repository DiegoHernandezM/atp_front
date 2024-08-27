import Dexie from "dexie";

export const db = new Dexie("myDatabase");
db.version(4).stores({
  user:
    "++id, created_by_admin, created_at, deleted_at, email, email_verified_at, expires_at, name, school, stand_by," +
    "type_id, updated_at",
  questions:
    "++id, question, a, b, c, d, e, answer, explanation, subject_id, image, blob",
  subjects:
    "++id, name, description, created_at, deleted_at, image, questions_to_test, questions_count, latest_user_test",
  infotest:
    "++id, completed, created_at, duration, grade, parsed, percentage, points, questions, subject_id," +
    "subject_name, updated_at, user_id",
  saveanswers: "++id, user_test_id, params",
  endtest: "++id, subject_id",
  dashboard: "++id, aReps, aSubjects, subjects, subjectsActives, test",
});
