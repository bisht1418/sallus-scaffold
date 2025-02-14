import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { googleLoginService, signInService } from "../Services/authService";
import { useSelector } from "react-redux";
import { t } from "../utils/translate";
import { useGoogleLogin } from "@react-oauth/google";
import backgroundImage from "../Assets/login_background.jpg";

const schema = yup.object({
  email: yup.string().email().required("Email cannot be blank"),
  password: yup.string().required("Password cannot be blank"),
}).required();

const SignIn = () => {
  const query = new URLSearchParams(window.location.search);
  const projectId = query.get("projectId");
  const currentLanguage = useSelector((state) => state?.global?.current_language);

  const [loading, setLoading] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await signInService(data);

      if (response?.status === "success") {
        if (response?.data?.user?.isDemoExpire) {
          toast.error("Demo account has expired. Please contact the admin.");
          return;
        }

        toast.success("Successfully logged in!");
        navigate("/");

        const userData = {
          name: data.name || googleUserData?.name,
          phoneNumber: data.phoneNumber,
          company: data.company,
          email: googleUserData?.email,
        };
      } else {
        toast.error("Something went wrong. Please check your email/password.");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const signinWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await googleLoginService(tokenResponse.access_token);

      if (response?.status === "success") {
        const userData = response?.data;
        if (!userData.phoneNumber || !userData.company) {
          setGoogleUserData(userData);
          navigate("/");
          toast.info("Please complete your profile.");
        } else {
          toast.success("Logged in successfully!");
          navigate("/");
        }
      } else {
        toast.error("Google login failed.");
      }
    },
    onError: (error) => {
      toast.error("Google login error.");
      console.error(error);
    },
  });

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: "brightness(0.7)"
          }}
        ></div>
        <div className="relative w-full max-w-2xl p-12 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">Welcome to Our Platform</h1>
          <p className="text-xl text-gray-300 text-center mb-8">
            Sign to your account and start your journey with us
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/">  <img src="/new_logo.svg" alt="Logo" className="h-12 mx-auto mb-6" /></Link>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in to your account</h2>
            <p className="text-gray-600">Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-800">Sign up →</Link></p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <img src="/eye-open.svg" alt="hide password" className="w-5 h-5" />
                  ) : (
                    <img src="/eye-off.svg" alt="show password" className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link to="/search-email" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </Link>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>

              {!googleUserData && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    signinWithGoogle();
                  }}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                  Continue with Google
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex justify-between text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-gray-700">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;