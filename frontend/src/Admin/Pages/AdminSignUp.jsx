import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminSignUpService } from "../../Services/AdminService/adminAuthService";
import { getGeoLocationData } from "../../Services/geoLocationService";

const adminLoginBackground = require("../../Assets/admin_login_background.jpg");

const signUpSchema = yup.object().shape({
  userName: yup.string().required("User Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  phoneNumber: yup.string().required("Phone Number is required"),
});

const AdminSignUp = () => {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const responseData = await getGeoLocationData();
        const countryMobileCode = responseData?.country_calling_code;
        setCountryCode(countryMobileCode);
      } catch (error) {
        console.error("Error fetching country code:", error);
      }
    };

    fetchCountryCode();
  }, []);

  const {
    register: signUpRegister,
    handleSubmit: signUpHandleSubmit,
    reset: signUpReset,
    formState: { errors: signUpErrors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const signUpOnSubmit = async (data) => {
    const formattedPhoneNumber = `${countryCode}${data.phoneNumber}`;
    const updatedData = { ...data, phoneNumber: formattedPhoneNumber };
    const signUpResponse = await adminSignUpService(updatedData);
    const isSuccessfullyCreated = signUpResponse?.status;
    if (isSuccessfullyCreated) {
      toast.success("Sign Up Successful");
      navigate("/admin-login");
    } else {
      toast.error(signUpResponse?.message);
    }
    signUpReset();
  };

  return (
    <div
      className="border border-red-400 h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${adminLoginBackground})` }}
    >
      <div className="border w-full h-full flex justify-center items-center">
        <div className="border w-full h-full flex justify-center items-center">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0  m-5 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight ">
                Create Account
              </h1>
              <form
                onSubmit={signUpHandleSubmit(signUpOnSubmit)}
                className="space-y-4 md:space-y-6"
                action="#"
              >
                <div>
                  <label
                    htmlFor="userName"
                    className="block mb-2 text-sm font-medium"
                  >
                    User Name
                  </label>
                  <input
                    type="text"
                    name="userName"
                    id="userName"
                    {...signUpRegister("userName")}
                    className="bg-gray-50 border !pl-4 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="User Name"
                  />
                  {signUpErrors.userName && (
                    <p className="text-red-600 font-bold text-xs">
                      {signUpErrors.userName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    {...signUpRegister("email")}
                    className="bg-gray-50 border !pl-4 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="name@company.com"
                  />
                  {signUpErrors.email && (
                    <p className="text-red-600 font-bold text-xs">
                      {signUpErrors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    {...signUpRegister("password")}
                    placeholder="••••••••"
                    className="bg-gray-50 !pl-4 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  />
                  {signUpErrors.password && (
                    <p className="text-red-600 font-bold text-xs">
                      {signUpErrors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="number"
                    className="block mb-2 text-sm font-medium"
                  >
                    Phone Number
                  </label>
                  <div className="flex">
                    <input
                      type={"text"}
                      value={countryCode}
                      disabled={true}
                      className="!p-0 font-bold !w-[40px] flex justify-center items-center text-center "
                    />
                    <input
                      type="number"
                      name="number"
                      id="number"
                      {...signUpRegister("phoneNumber")}
                      placeholder="Phone Number"
                      className="bg-gray-50 !pl-4 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    />
                  </div>

                  {signUpErrors.phoneNumber && (
                    <p className="text-red-600 font-bold text-xs">
                      {signUpErrors.phoneNumber.message}
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
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
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
                  Sign up
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Do you have an account?{" "}
                  <Link
                    to="/admin-login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign in{" "}
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

export default AdminSignUp;
