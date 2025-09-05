import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: true,
    isAuthenticated: false,
    otpVerify: false,
    resendOTP: false,
    updateLoading:false,
    updateVerifyLoading:false,
  },
  reducers: {
    loginRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    loginSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };
    },
    loginFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    registerRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    registerSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload,
        otpVerify: true,
      };
    },
    registerFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        otpVerify: false,
      };
    },
    verifyRequest(state, action) {
      return {
        ...state,
        loading: true,
        updateVerifyLoading:true
      };
    },
    verifySuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        updateVerifyLoading:false,
      };
    },
    verifyFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        updateVerifyLoading:false,
      };
    },
    resendOtpRequest(state, action) {
      return {
        ...state,
        loading: true,
        updateLoading:true,
      };
    },
    resendOtpSuccess(state, action) {
      return {
        ...state,
        loading: false,
        resendOTP: true,
        updateLoading:false,
      };
    },
    resendOtpFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        updateLoading:false,
      };
    },
    clearResendOtpSuccess(state, action) {
      return {
        ...state,
        resendOTP: false,
      };
    },
    loadUserRequest(state, action) {
      return {
        ...state,
        isAuthenticated: false,
        loading: true,
      };
    },
    loadUserSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };
    },
    loadUserFail(state, action) {
      return {
        ...state,
        loading: false,
      };
    },
    logoutSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: false,
      };
    },
    logoutFail(state, action) {
      return {
        ...state,
        error: action.payload,
      };
    },
    updateProfileRequest(state, action) {
      return {
        ...state,
        loading: true,
        isUpdated: false,
      };
    },
    updateProfileSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        isUpdated: true,
      };
    },
    updateProfileFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearUpdateProfileSuccess(state, action) {
      return {
        ...state,
        isUpdated: false,
      };
    },
    updatePasswordRequest(state, action) {
      return {
        ...state,
        loading: true,
        isUpdated: false,
      };
    },
    updatePasswordSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isUpdated: true,
      };
    },
    updatePasswordFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    forgotPasswordRequest(state, action) {
      return {
        ...state,
        loading: true,
        message: null,
        error: null,
      };
    },
    forgotPasswordSuccess(state, action) {
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };
    },
    forgotPasswordFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    resetPasswordRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    resetPasswordSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    },
    resetPasswordFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
  },
});

const { actions, reducer } = authSlice;

export const {
  loginRequest,
  loginSuccess,
  loginFail,
  clearError,
  registerRequest,
  registerSuccess,
  registerFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  clearUpdateProfileSuccess,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
  verifyRequest,
  verifySuccess,
  verifyFail,
  resendOtpRequest,
  resendOtpSuccess,
  resendOtpFail,
  clearResendOtpSuccess,
} = actions;

export default reducer;
