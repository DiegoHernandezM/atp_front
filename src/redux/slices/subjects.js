import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { db } from "../../database";

const initialState = {
  allSubjects: [],
  subject: {},
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    setSubjects(state, payload) {
      state.allSubjects = payload.payload;
      state.isLoading = false;
    },
    setSubject(state, payload) {
      state.subject = payload.payload.data;
      state.isLoading = false;
    },
    hasError(state, payload) {
      console.log(payload);
    },
  },
});

export default slice.reducer;

export function getSubjects(trashed) {
  return async (dispatch, getState) => {
    try {
      if (getState().onlinestatus.isOnline) {
        const response = await axios.get(`/api/subject/list`, {
          params: { trashed },
        });
        dispatch(slice.actions.setSubjects(response.data));
        return Promise.resolve(response.data);
      } else {
        db.subjects
          .toArray()
          .then((data) => {
            dispatch(slice.actions.setSubjects(data));
            return Promise.resolve(data);
          })
          .catch((error) => {
            console.error("Error al obtener el primer registro:", error);
          });
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getSubject(id) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/subject/find/${id}`);
      dispatch(slice.actions.setSubject(response));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function create(values, image) {
  return async (dispatch) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", values.name);
    formData.append("questions_to_test", values.questions_to_test);
    // formData.append("description", values.description);
    try {
      const response = await axios.post("/api/subject/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function update(id, values, image) {
  return async (dispatch) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", values.name);
    formData.append("questions_to_test", values.questions_to_test);
    try {
      const response = await axios.post(`/api/subject/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function getDeleteSubject(id) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/subject/delete/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function getRestoreSubject(id) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/subject/restore/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}
