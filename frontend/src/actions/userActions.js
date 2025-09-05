import {
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
  forgotPasswordFail,
  forgotPasswordSuccess,
  forgotPasswordRequest,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
  verifyRequest,
  verifySuccess,
  verifyFail,
  resendOtpRequest,
  resendOtpSuccess,
  resendOtpFail,
} from "../slices/authSlice";
import axios from "axios";
import {
  deleteUserFail,
  deleteUserRequest,
  deleteUserSuccess,
  updateUserFail,
  updateUserRequest,
  updateUserSuccess,
  userFail,
  userRequest,
  usersFail,
  usersRequest,
  usersSuccess,
  userSuccess,
} from "../slices/usersSlice";


const API_URL = import.meta.env.VITE_API_URL;

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(
      `${API_URL}/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFail(error.response.data.message));
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${API_URL}/register`,
      userData,
      config
    );
    dispatch(registerSuccess(data));
  } catch (error) {
    dispatch(registerFail(error.response.data.message));
  }
};

export const verifyEmail = (email, otp) => async (dispatch) => {
  try {
    dispatch(verifyRequest());
    const { data } = await axios.post(
      `${API_URL}/verify-otp`,
      {
        email,
        otp,
      },
      { withCredentials: true }
    );
    dispatch(verifySuccess(data));
  } catch (error) {
    dispatch(verifyFail(error.response.data.message));
  }
};

export const resendOTP = (email) => async (dispatch) => {
  try {
    dispatch(resendOtpRequest());
    await axios.post(
      `${API_URL}/resend-otp`,
      {
        email,
      },
      { withCredentials: true }
    );
    dispatch(resendOtpSuccess());
  } catch (error) {
    dispatch(resendOtpFail(error.response.data.message));
  }
};

export const loadUser = async (dispatch) => {
  try {
    dispatch(loadUserRequest());

    const { data } = await axios.get(`${API_URL}/myprofile`, {
      withCredentials: true,
    });
    dispatch(loadUserSuccess(data));
  } catch (error) {
    dispatch(loadUserFail(error.response.data.message));
  }
};

export const logout = async (dispatch) => {
  try {
    await axios.get(`${API_URL}/logout`, {
      withCredentials: true,
    });
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFail());
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateProfileRequest());

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
      withCredentials: true,
    };
    console.log([...userData]);
    const { data } = await axios.put(
      `${API_URL}/update`,
      userData,
      config
    );
    dispatch(updateProfileSuccess(data));
  } catch (error) {
    dispatch(updateProfileFail(error.response?.data?.message || error.message));
  }
};

export const updatePassword = (userData) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());

    const config = {
      headers: {
        "Content-type": "application/json",
      },
      withCredentials: true,
    };

    await axios.put(
      `${API_URL}/password/change`,
      userData,
      config
    );
    dispatch(updatePasswordSuccess());
  } catch (error) {
    dispatch(
      updatePasswordFail(error.response?.data?.message || error.message)
    );
  }
};

export const forgotPassword = (userData) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());

    const config = {
      headers: {
        "Content-type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${API_URL}/password/forgot`,
      userData,
      config
    );
    dispatch(forgotPasswordSuccess(data));
  } catch (error) {
    dispatch(
      forgotPasswordFail(error.response?.data?.message || error.message)
    );
  }
};

export const resetPassword = (userData, token) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());

    const config = {
      headers: {
        "Content-type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${API_URL}/password/reset/${token}`,
      userData,
      config
    );
    dispatch(resetPasswordSuccess(data));
  } catch (error) {
    dispatch(resetPasswordFail(error.response?.data?.message || error.message));
  }
};

export const clearSuccessMsg = () => (dispatch) => {
  dispatch(clearUpdateProfileSuccess());
};

export const clearAuthError = () => (dispatch) => {
  dispatch(clearError());
};

export const getUsers = () => async (dispatch) => {
  try {
    dispatch(usersRequest());

    const { data } = await axios.get(
      `${API_URL}/admin/users`,
      {
        withCredentials: true,
      }
    );
    dispatch(usersSuccess(data));
  } catch (error) {
    dispatch(usersFail(error?.response?.data?.message));
  }
};

export const getUser = (id) => async (dispatch) => {
  try {
    dispatch(userRequest());

    const { data } = await axios.get(
      `${API_URL}/admin/user/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch(userSuccess(data));
  } catch (error) {
    dispatch(userFail(error?.response?.data?.message));
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch(deleteUserRequest());

    await axios.delete(`${API_URL}/admin/user/${id}`, {
      withCredentials: true,
    });
    dispatch(deleteUserSuccess());
  } catch (error) {
    dispatch(deleteUserFail(error?.response?.data?.message));
  }
};

export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch(updateUserRequest());

    const config = {
      headers: {
        "Content-type": "application/json",
      },
      withCredentials: true,
    };

    await axios.put(
      `${API_URL}/admin/user/${id}`,
      userData,
      config
    );
    dispatch(updateUserSuccess());
  } catch (error) {
    dispatch(updateUserFail(error.response?.data?.message || error.message));
  }
};
