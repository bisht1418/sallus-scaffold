import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  googleLoginService,
  googleSignUpService,
  sendRegisterOtp,
  signUpService,
} from "../Services/authService";
import { useSelector } from "react-redux";
import { t } from "../utils/translate";
import { AiOutlinePhone } from "react-icons/ai";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import { FaLock } from "react-icons/fa";
import TermAndConditionForSubscription from "./TermAndConditionForSubscription";
import { IoClose } from "react-icons/io5";
import { useGoogleLogin } from "@react-oauth/google";
import backgroundImage from "../Assets/login_background.jpg";

const schema = yup.object({
  name: yup
    .string()
    .required(t("pleaseEnterUserName"))
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),

  email: yup
    .string()
    .required("Please enter your email")
    .email("Please enter a valid email address"),

  phoneNumber: yup
    .string()
    .matches(/^\+?[1-9]\d{9,11}$/, "Please enter a valid phone number")
    .nullable(),

  company: yup
    .string()
    .min(2, "Company name must be at least 2 characters")
    .nullable(),

  password: yup
    .string()
    .required(t("pleaseEnterPassword"))
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),

  tANDc: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions")
}).required();

function SignUp() {
  const [otpSend, setOtpSend] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setverifyOtpLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isTermAnsConditionChecked, setIsTermAndConditionChecked] = useState(false);
  const [openTermAndCondition, setOpenTermAndCondition] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const currentLanguage = useSelector((state) => state?.global?.current_language);
  const query = new URLSearchParams(window.location.search);
  const projectId = query.get("projectId");
  const id = query.get("invite_id");
  const type = query.get("type");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (loading && !otpSend) {
      setButtonDisabled(true);
    }
  }, [loading]);

  const onSubmit = async (data) => {
    if (!isOTPVerified) {
      toast.error("Please Enter Correct OTP!");
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name: data?.name,
        email: email,
        password: data?.password,
        type: type || 1,
        invite_id: id,
        phoneNumber: data?.phoneNumber,
        company: data?.company,
      };

      const response = await signUpService(userData);
      if (response.status === "success") {
        toast.success(t("registeredSuccessFully"));
        navigate(`/signin?projectId=${projectId}`);
      } else {
        toast.error(response.data);
      }
      reset();
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const sendOtpHandle = async () => {
    if (buttonDisabled) return;
    try {
      setSendOtpLoading(true);
      const response = await sendRegisterOtp({ email: email });
      if (response?.status === "success") {
        toast.success(t("OTP has been sent to your email. Use it to complete the login."));
        setOtpSend(response?.returnOtpValue?.otp);
      } else {
        toast.error(response?.data);
      }
    } catch (error) {
      toast.error(t("anErrorOccurredDuringLogin"));
    } finally {
      setSendOtpLoading(false);
    }
  };

  const debouncedSendOtpHandle = (email) => {
    setSendOtpLoading(true);
    setTimeout(() => {
      if (isTermAnsConditionChecked) {
        sendOtpHandle(email);
        setSendOtpLoading(false);
        setOtpSend(true);
      } else {
        toast.error("Please accept the terms and conditions");
        setSendOtpLoading(false);
      }
    }, 2000);
  };

  const verifyOTP = () => {
    setverifyOtpLoading(true);
    if (Number(enteredOtp) === Number(otpSend)) {
      setIsOTPVerified(true);
      setTimeout(() => {
        setverifyOtpLoading(false);
        toast.success("OTP Verified, Please Register");
      }, 2000);
    } else {
      setIsOTPVerified(false);
      setverifyOtpLoading(false);
      toast.error("Wrong OTP, Correct OTP or Resend OTP");
    }
  };

  const signupWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await googleLoginService(tokenResponse?.access_token);
        if (response?.token) {
          toast.success("Successfully logged in");
          navigate("/");
        } else {
          toast.error(response?.error);
        }
      } catch (error) {
        toast.error("Google login error");
      }
    },
    onError: () => {
      toast.error("Google login error");
    },
  });

  return (
    <div className="flex max-h-screen">
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
            Create your account and start your journey with us
          </p>
        </div>
      </div>

      <div className="max-h-screen flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto p-8">
          <div className="flex justify-center mb-8">
            <Link to="/">  <img src="/new_logo.svg" alt="Logo" className="h-12 mx-auto mb-6" /></Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              {t("pleaseFillTheDetailsBelowToRegister")}
            </h2>

            <div>
              <div className="relative">
                <input
                  {...register("name")}
                  type="text"
                  placeholder={t("fullName")}
                  className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <img src="/Person.svg" alt="person" className="w-5 h-5" />
                </div>
              </div>
              {errors.name && (
                <span className="text-red-500 text-sm mt-1 block">{errors.name.message}</span>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type="email"
                  placeholder={t("email")}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValue('email', e.target.value, { shouldValidate: true });
                  }}
                  className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <img src="/email.svg" alt="email" className="w-5 h-5" />
                </div>
              </div>
              {errors.email && (
                <span className="text-red-500 text-sm mt-1 block">{errors.email.message}</span>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  {...register("phoneNumber")}
                  type="tel"
                  placeholder={t("phoneNumber")}
                  className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <AiOutlinePhone className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              {errors.phoneNumber && (
                <span className="text-red-500 text-sm mt-1 block">{errors.phoneNumber.message}</span>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  {...register("company")}
                  type="text"
                  placeholder={t("company")}
                  className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.company ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <HiOutlineBuildingLibrary className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              {errors.company && (
                <span className="text-red-500 text-sm mt-1 block">{errors.company.message}</span>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder={t("password")}
                  className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <img src="/password.svg" alt="password" className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <img
                    src={showPassword ? "/eye-open.svg" : "/eye-off.svg"}
                    alt="toggle password"
                    className="w-5 h-5"
                  />
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm mt-1 block">{errors.password.message}</span>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                className={`mt-1 ${errors.tANDc ? 'border-red-500' : ''}`}
                checked={isTermAnsConditionChecked}
                onChange={(e) => {
                  setIsTermAndConditionChecked(e.target.checked);
                  setValue("tANDc", e.target.checked, { shouldValidate: true });
                }}
              />
              <p className="text-sm text-gray-600">
                {t("iUnderstandAndAgreeTo")}{" "}
                <button
                  type="button"
                  onClick={() => setOpenTermAndCondition(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t("privacyPolicy1")} {t("and")} {t("termsOfUse")}
                </button>
              </p>
            </div>
            {errors.tANDc && (
              <span className="text-red-500 text-sm block">{errors.tANDc.message}</span>
            )}

            {/* Rest of the form remains the same */}

            {/* OTP Section */}
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <FaLock className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (enteredOtp.length === 6) {
                    verifyOTP();
                  } else {
                    debouncedSendOtpHandle(email);
                  }
                }}
                disabled={sendOtpLoading || (!otpSend && enteredOtp.length === 6)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
              >
                {sendOtpLoading
                  ? "Loading..."
                  : enteredOtp.length === 6
                    ? verifyOtpLoading
                      ? "Verifying..."
                      : "Verify OTP"
                    : "Send OTP"}
              </button>
            </div>

            <div className="space-y-4 pt-4">
              <button
                type="submit"
                disabled={!isOTPVerified || loading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  t("createAccount")
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  signupWithGoogle();
                }}
                className="w-full px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center space-x-2"
              >
                <img src="./google.svg" alt="Google" className="w-5 h-5" />
                <span>Register with Google</span>
              </button>
            </div>

            <div className="text-center pt-6">
              <p className="text-gray-600">
                {t("haveAnAccount")}{" "}
                <Link to="/signin" className="text-blue-600 hover:text-blue-800 font-medium">
                  {t("loginHere")}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {openTermAndCondition && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setOpenTermAndCondition(false)}></div>

            <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Terms and Conditions</h3>
                  <button
                    onClick={() => setOpenTermAndCondition(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <IoClose className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4">
                <TermAndConditionForSubscription
                  footer={true}
                  header={true}
                  topSection={true}
                  setOpenTermAndCondition={setOpenTermAndCondition}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;