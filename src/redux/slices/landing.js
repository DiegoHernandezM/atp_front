import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { HOST_API } from "../../config";

const initialState = {
  loading: false,
  error: false,
  content: {},
};

const slice = createSlice({
  name: "landing",
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
    getContentSuccess(state, action) {
      state.loading = false;
      state.content = action.payload;
      state.error = false;
    },
  },
});

export default slice.reducer;

export function getContent() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${HOST_API}/api/landing-content`);
      dispatch(slice.actions.getContentSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateContent(values) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/landing-content/update`, {
        title: values.title,
        subtitle: values.subtitle,
        principal_text: values.principal_text,
        footer_title: values.footer_title,
        link_video: values.link_video,
        subscribe_button: values.subscribe_button,
        compatible_text: values.compatible_text,
        login_link_text: values.login_link_text,
        footer_text_1: values.footer_text_1,
        footer_text_2: values.footer_text_2,
        footer_text_3: values.footer_text_3,
        footer_text_4: values.footer_text_4,
        ws_number: values.ws_number,
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.resolve(error);
    }
  };
}
