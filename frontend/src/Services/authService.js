import baseService from "./baseService";
import { clearAuth, setAuth, setUser } from "../Redux/Slice/authSlice";
import { store } from "../Redux/store";
import axios from 'axios';

export const signUpService = async (data) => {
  try {
    const response = await baseService.post("/signup", data);
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const signInService = async (data) => {
  try {
    const response = await baseService.post("/signin", data);
    store.dispatch(setAuth(response.data.data));
    store.dispatch(setUser(response.data.data.user));
    localStorage.setItem("token", response.data.data.token);
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const sendOtp = async (data) => {
  try {
    const response = await baseService.post("/send-otp", data);
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const sendRegisterOtp = async (data) => {
  try {
    const response = await baseService.post("/send-otp-register", data);
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const reSendOtp = async (data) => {
  try {
    const response = await baseService.post("/resend-otp", { email: data });
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const getUserProfileService = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token is missing!");
    return "Token missing";
  }

  try {
    const response = await baseService.get("/me", {
      headers: {
        "x-auth-token": token,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in getUserProfileService:", error.response || error);
    return error.response?.data ? error.response?.data : error.message;
  }
};
export const searchEmailForgetPassword = async (data) => {
  try {
    const response = await baseService.post("/send-otp-forget-password", data);
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};
export const forgetPassword = async (data) => {
  try {
    const response = await baseService.post("/forget-password", data);
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const logoutService = async () => {
  store.dispatch(clearAuth());
  localStorage.clear();
};

export const googleSignUpService = () => {
  window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
};


export const googleLoginService = async (accessToken) => {
  try {
    // const response = await axios.post('http://localhost:3002/google-login', {
    //   access_token: accessToken,
    // });
    const response = await axios.post(process.env.REACT_APP_API_URL+'/google-login', {
      access_token: accessToken,
    });
    store.dispatch(setAuth(response.data.data));
    store.dispatch(setUser(response.data.data.user));
    localStorage.setItem('token', response.data.data.token);
    return response.data;
  } catch (error) {
    console.error('Google login failed:', error.response?.data || error.message);
    const errors =  error.response?.data || error.message
    return errors;
  }
};