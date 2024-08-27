import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  loading: false,
  error: false,
  userOrder: {}
};

const slice = createSlice({
  name: "paypal",
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
    getPaymentSuccess(state, action) {
      state.loading = false;
      state.userOrder = action.payload;
      state.error = false;
    }
  },
});

export default slice.reducer;

export function createPayment(order) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/paypal/create`, {
        order: order.purchase_units[0]
      });
      dispatch(slice.actions.getPaymentSuccess(response.data));
      dispatch(slice.actions.endLoading())
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}
