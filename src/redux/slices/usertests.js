import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { db } from "../../database";

const initialState = {
  userTest: {},
  userTests: [],
  subject: {},
  testQuestions: [],
  onlyShow: false,
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: "usertests",
  initialState,
  reducers: {
    setUserTest(state, payload) {
      state.userTest = payload.payload.userTest;
      state.userTest.questions = payload.payload.userTest.parsed;
      state.subject = payload.payload.subject;
      state.testQuestions = payload.payload.questions;
      state.isLoading = false;
    },
    setUserTestOffline(state, payload) {
      state.userTest.questions = payload.payload.questions;
      state.userTest = payload.payload;
      state.isLoading = false;
    },
    showUserTest(state, payload) {
      state.userTest = payload.payload.userTest;
      state.userTest.questions = payload.payload.userTest.parsed;
      state.subject = payload.payload.subject;
      state.testQuestions = payload.payload.questions;
      state.onlyShow = true;
      state.isLoading = false;
    },
    hasError(state, payload) {
      console.log(payload);
    },

    setUserTests(state, payload) {
      state.userTests = payload.payload;
      state.isLoading = false;
      state.userTests.forEach((u, k) => {
        state.userTests[k].questions = u.parsed;
      });
    },

    setUserAnswer(state, payload) {
      state.userTest = payload.payload;
      state.userTest.questions = payload.payload.parsed;
      state.isLoading = false;
    },
  },
});

export default slice.reducer;

async function getTest(test_id) {
  const test = await db.infotest.where("id").equals(parseInt(test_id)).first();
  const questionIds = test.parsed.map((item) => parseInt(Object.keys(item)[0]));
  const questions = await getQuestions(questionIds);
  const subject =
    test.subject_id > 0
      ? await db.subjects
          .where("id")
          .equals(parseInt(test.subject_id))
          .toArray()
      : [{ name: "Simulacro" }];
  const payload = { userTest: test, questions, subject: subject[0] };

  return Promise.resolve(payload);
}

async function reformUserTest(subject_id = null, test_id = null, getState) {
  const test = await db.infotest
    .where({
      subject_id: subject_id ? parseInt(subject_id) : 0,
      completed: 0,
    })
    .toArray();

  const subject = subject_id
    ? await db.subjects.where("id").equals(parseInt(subject_id)).toArray()
    : [{ name: "Simulacro" }];
  if (test.length > 0) {
    const questionIds = test[0].parsed.map((item) =>
      parseInt(Object.keys(item)[0])
    );
    const questions = await getQuestions(questionIds);
    const payload = { userTest: test[0], questions, subject: subject[0] };

    return Promise.resolve(payload);
  } else {
    const newTest = {
      id: (subject_id ? parseInt(subject_id) : 0) + 100000,
      user_id: 0,
      subject_id: subject_id ? parseInt(subject_id) : 0,
      last_key: 1,
      completed: 0,
      created_at: null,
      updated_at: null,
      percentage: 0,
      grade: 0,
    };
    if (subject_id > 0) {
      const questionsDb = await db.questions
        .where({
          subject_id: parseInt(subject_id),
        })
        .toArray();
      const parsedQuestions = questionsDb.map(({ id }) => ({ [id]: "" }));
      newTest.questions = parsedQuestions;
      newTest.parsed = parsedQuestions;
      newTest.points = parsedQuestions.length;
      const questionIds = parsedQuestions.map((item) =>
        parseInt(Object.keys(item)[0])
      );
      const questions = await getQuestions(questionIds);

      const payload = { userTest: newTest, questions, subject: subject[0] };
      db.infotest.add(newTest);
      return Promise.resolve(payload);
    } else {
      const subjects = getState().subjects.allSubjects;
      const promises = await subjects.map((sub) =>
        getRandomRecords("questions", sub.id, sub.questions_to_test)
      );
      const questions = [];
      const questionsBySubject = await Promise.all(promises);
      const parsedQuestions = [];
      questionsBySubject.forEach((q) => {
        q.forEach(({ id }) => {
          parsedQuestions.push({ [id]: "" });
        });
        q.forEach((i) => {
          questions.push(i);
        });
      });
      newTest.questions = parsedQuestions;
      newTest.parsed = parsedQuestions;
      newTest.points = parsedQuestions.length;
      const payload = {
        userTest: newTest,
        questions,
        subject: { name: "Simulacro" },
      };
      db.infotest.add(newTest);
      return Promise.resolve(payload);
    }
  }
}

async function getRandomRecords(table, subject, limit) {
  const ids = [];
  const q = await db.questions
    .where({
      subject_id: parseInt(subject),
    })
    .toArray();

  q.forEach((question) => {
    ids.push(question.id);
  });
  const shuffledIds = ids.sort(() => 0.5 - Math.random());

  const promises = Array.from(shuffledIds.slice(0, limit)).map((id) =>
    db[table]
      .where({
        subject_id: subject,
        id,
      })
      .first()
  );
  return Promise.all(promises);
}

async function getQuestions(ids) {
  const q = await db.questions.toArray();
  const filteredQuestions = q.filter((item) => ids.includes(item.id));
  return filteredQuestions.sort(
    (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)
  );
}

export function getUserTest(subject_id = null) {
  return async (dispatch, getState) => {
    try {
      if (getState().onlinestatus.isOnline) {
        if (!subject_id) {
          const response = await axios.get(`/api/usertest/simulation/create`);
          dispatch(slice.actions.setUserTest(response.data));
          await db.infotest.update(
            response.data.userTest.id,
            response.data.userTest
          );
        } else {
          const response = await axios.get(
            `/api/usertest/singlesubject/create`,
            {
              params: {
                subject_id,
              },
            }
          );
          dispatch(slice.actions.setUserTest(response.data));
        }
      } else {
        reformUserTest(subject_id, getState).then((payload) => {
          dispatch(slice.actions.setUserTest(payload));
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function resetTest(subject_id = null) {
  return async (dispatch) => {
    try {
      if (!subject_id) {
        const response = await axios.get(`/api/usertest/simulation/reset`);
        dispatch(slice.actions.setUserTest(response.data));
      } else {
        const response = await axios.get(`/api/usertest/singlesubject/reset`, {
          params: {
            subject_id,
          },
        });
        dispatch(slice.actions.setUserTest(response.data));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUserTests() {
  return async (dispatch, getState) => {
    try {
      if (getState().onlinestatus.isOnline) {
        const response = await axios.get(`/api/usertest/getfromuser`);
        dispatch(slice.actions.setUserTests(response.data));
        return Promise.resolve(response.data);
      } else {
        db.infotest
          .toArray()
          .then((data) => {
            dispatch(slice.actions.setUserTests(data));
            return Promise.resolve(data);
          })
          .catch((error) => {
            console.error("Error: ", error);
            return Promise.reject(error);
          });
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function setTestFromId(id) {
  return async (dispatch, getState) => {
    try {
      if (getState().onlinestatus.isOnline) {
        const response = await axios.get(`/api/usertest/find/${id}`);
        dispatch(slice.actions.showUserTest(response.data));
      } else {
        const payload = await getTest(id);
        dispatch(slice.actions.showUserTest(payload));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function saveAnswer(data) {
  return async (dispatch, getState) => {
    try {
      const test = await db.infotest
        .where({
          id: data.user_test_id ? parseInt(data.user_test_id) : 0,
          completed: 0,
        })
        .toArray();
      const question = await db.questions
        .where("id")
        .equals(parseInt(data.question_id))
        .first();
      if (test.length > 0) {
        let dataFind = test[0].parsed;
        let answered = 0;
        test[0].parsed.forEach((a) => {
          answered = answered + (Object.values(a)[0] !== "" ? 1 : 0);
        });
        test[0].last_key = data.question_id;
        test[0].grade =
          test[0].grade +
          (question.answer === data.answer ? question.points : 0);
        test[0].percentage = parseFloat(
          ((answered * 100) / test[0].parsed.length).toFixed(2)
        );
        let key = dataFind.findIndex((k) => k.hasOwnProperty(data.question_id));
        dataFind[key] = { [data.question_id]: data.answer };
        test[0].parsed = dataFind;
        await db.infotest.update(data.user_test_id, test[0]);
      }

      if (getState().onlinestatus.isOnline) {
        const response = await axios.post(`/api/usertest/saveanswer`, data);
        dispatch(slice.actions.setUserAnswer(response.data));
      } else {
        dispatch(slice.actions.setUserTestOffline(test[0]));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function saveAnswerOffline(data) {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `/api/usertest/saveansweroffline`,
        data
      );
      dispatch(slice.actions.setUserAnswer(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function saveFullTestOffline(data) {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `/api/usertest/savefulltestoffline`,
        data
      );
      db.infotest.add(response.data.userTest);
      const findOld = await db.saveanswers
        .where("user_test_id")
        .equals(response.data.userTest.subject_id + 100000)
        .toArray();
      if (findOld.length > 0) {
        findOld.forEach(function (item) {
          delete item.id;
          item.params.user_test_id = response.data.userTest.id;
        });
      }
      await db.saveanswers
        .where("user_test_id")
        .equals(response.data.userTest.subject_id + 100000)
        .delete();
      await db.saveanswers.bulkPut(findOld);
      dispatch(slice.actions.setUserTest(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function endTest(subject_id = null) {
  return async (dispatch, getState) => {
    try {
      if (getState().onlinestatus.isOnline) {
        if (!subject_id) {
          const response = await axios.get(`/api/usertest/simulation/end`);
          dispatch(slice.actions.setUserTest(response.data));
        } else {
          const response = await axios.get(`/api/usertest/singlesubject/end`, {
            params: {
              subject_id,
            },
          });
          dispatch(slice.actions.setUserTest(response.data));
        }
      } else {
        if (!subject_id) {
          const test = await db.infotest
            .where({
              subject_id: 0,
              completed: 0,
            })
            .first();
          if (test) {
            await db.infotest.update(test.id, { completed: 1 });
            test.completed = 1;
            dispatch(slice.actions.setUserTest(test));
          }
        } else {
          const testToUpdate = await db.infotest
            .where({ subject_id: subject_id })
            .first();
          if (testToUpdate) {
            await db.infotest.update(testToUpdate.id, { completed: 1 });
            testToUpdate.completed = 1;
            dispatch(slice.actions.setUserTest(testToUpdate));
          }
        }
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function endTestOffline(data) {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/api/usertest/endtests/offline`, data);
      dispatch(slice.actions.setUserTest(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
