import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import {db} from "../../database";

const initialState = {
  loading: false,
  error: false,
  users: [],
  user: {},
  logged: {}
};

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    endLoading(state) {
      state.loading = false;
    },
    hasError(state) {
      state.loading = false;
      state.error = true;
    },
    getUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
      state.error = false;
    },
    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.error = false;
    },
    getLoggedUserSuccess(state, action) {
      state.loading = false;
      state.logged = action.payload;
      state.error = false;
    },
    clearDataSuccess(state) {
      state.user = initialState.user;
    },
  },
});

export default slice.reducer;

export function getUsers(trashed) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/user/all`,
      { params: { trashed } });
      dispatch(slice.actions.getUsersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading)
    try {
      const response = await axios.get(`/api/user/get/${id}`);
      dispatch(slice.actions.getUserSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createUser(values) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/user/create`, {
        name: values.name,
        school: values.school,
        email: values.email,
        type_id: values.type_id,
        expires_at: values.expires_at,
        password: values.password ?? null
      });
      dispatch(slice.actions.getUserSuccess(response.data));
      dispatch(slice.actions.endLoading())
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function updateUser(id, values) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/user/update/${id}`, {
        name: values.name,
        school: values.school,
        email: values.email,
        type_id: values.type_id,
        expires_at: values.expires_at,
      });
      dispatch(slice.actions.endLoading());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function deleteUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/user/delete/${id}`);
      dispatch(slice.actions.endLoading());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function restoreUser(id, expires) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/user/restore/${id}`, {expires});
      dispatch(slice.actions.endLoading());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function clearDataUser() {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.clearDataSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function findUserByEmail(email) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/user/email`,
      { params: { email } });
      dispatch(slice.actions.endLoading());
      dispatch(slice.actions.getUserSuccess(response.data));
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function getProfile() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/user/profile`);
      dispatch(slice.actions.getUserSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getLoggedUser() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading)
    try {
      if (getState().onlinestatus.isOnline) {
        const response = await axios.get(`/api/user`);
        dispatch(slice.actions.getLoggedUserSuccess(response.data));
        return Promise.resolve(response.data);
      } else {
        db.user
          .toArray()
          .then((data) => {
            dispatch(slice.actions.getLoggedUserSuccess(data));
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

export function changePassword(
  oldPassword,
  newPassword,
  newPasswordConfirmation
) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/user/changepassword`, {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.resolve(error);
    }
  };
}

export function restoreDeviceUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/user/devices/${id}`);
      dispatch(slice.actions.endLoading());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}


