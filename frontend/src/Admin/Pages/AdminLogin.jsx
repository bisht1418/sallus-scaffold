import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  AdminSignInService,
  onlyAdminSignInService,
} from "../../Services/AdminService/adminAuthService";
import { useNavigate } from "react-router-dom";
import { setAdmin } from "../../Redux/Slice/adminSlice";
import { useDispatch } from "react-redux";
import { setAuth } from "../../Redux/Slice/authSlice";

const adminLoginBackground = require("../../Assets/admin_login_background.jpg");

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [toggleAdmin, setToggleAdmin] = useState(true);
  const dispatch = useDispatch();

  const {
    register: loginRegister,
    handleSubmit: loginHandleSubmit,
    reset: loginReset,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const loginOnSubmit = async (data) => {
    setIsLoading(true); // Start loading indicator

    try {
      let signInResponse;

      if (toggleAdmin) {
        signInResponse = await onlyAdminSignInService(data);
      } else {
        signInResponse = await AdminSignInService(data);
      }

      const isSuccessfullyCreated = signInResponse?.status;
      if (isSuccessfullyCreated) {
        toast.success("Sign In Successful");
        dispatch(setAdmin(signInResponse.data.user));
        dispatch(setAuth(signInResponse.data));
        navigate("/admin-dashboard/home-page");
      } else {
        const errorMessage =
          signInResponse?.response?.data?.message || "Sign In Failed";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // Stop loading indicator
      loginReset(); // Reset the form
    }
  };

  return (
    <div
      className="border border-red-400 h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${adminLoginBackground})` }}
    >
      <div className="border w-full h-full flex justify-center items-center">
        <div className="border w-full h-full flex justify-center items-center">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0  m-5 ">
            <div className="flex border">
              <p
                onClick={() => setToggleAdmin(true)}
                className={` w-full flex border-r justify-center items-center  ${
                  toggleAdmin
                    ? "bg-[#0072bb] text-white  text-sm"
                    : "bg-white text-black  text-sm"
                } cursor-pointer rounded-l-md text-black font-semibold p-3`}
              >
                Admin Login
              </p>
              <p
                onClick={() => setToggleAdmin(false)}
                className={` w-full flex justify-center items-center ${
                  toggleAdmin
                    ? "bg-white text-black  text-sm"
                    : "bg-[#0072bb] text-white  text-sm"
                }  cursor-pointer rounded-r-md text-black font-semibold p-3`}
              >
                Super Admin Login
              </p>
            </div>

            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight ">
                Sign in to your account
              </h1>
              <form
                onSubmit={loginHandleSubmit(loginOnSubmit)}
                className="space-y-4 md:space-y-6"
                action="#"
              >
                <div>
                  <label for="email" className="block mb-2 text-sm font-medium">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    {...loginRegister("email")}
                    className="bg-gray-50 border !pl-4 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="name@company.com"
                    required=""
                  />
                  {loginErrors.email && (
                    <p className="text-red-600 font-bold text-xs">
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    for="password"
                    className="block mb-2 text-sm font-medium"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    {...loginRegister("password")}
                    placeholder="••••••••"
                    className="bg-gray-50 !pl-4 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required=""
                  />
                  {loginErrors.password && (
                    <p className="text-red-600 font-bold text-xs">
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 "
                        required=""
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        for="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="/"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center gap-2">
                      Loading
                      <span className="loading loading-bars loading-xs"></span>
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Do you have an account yet?{" "}
                  <Link
                    to="/admin-signup"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </Link>
                </p>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Go back to User Home Page{" "}
                  <Link
                    to="/"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    <span className="text-[#0081c8]">Click Here</span>
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
