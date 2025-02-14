import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { reSendOtp, signInService } from "../Services/authService";
import { useSelector } from "react-redux";
import { t } from "../utils/translate";
import { FaLock } from "react-icons/fa";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
const schema = yup
  .object({
    otp: yup
      .string()
      .required("Enter OTP for Login")
      .matches(/^\d{6}$/, "OTP must be a 6-digit number"),
  })
  .required();

const OtpVerification = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [disableResend, setDisableResend] = useState(false);
  const [remainingTime, setRemainingTime] = useState(180);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  useEffect(() => {
    const isNavigatedFromLogin = localStorage.getItem("otpData");
    if (isNavigatedFromLogin) {
      setDisableResend(true);
      setTimeout(() => {
        setDisableResend(false);
        localStorage.removeItem("navigatedFromLogin");
      }, 180000);
    }
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const onSubmit = async (data) => {
    const email = JSON.parse(localStorage.getItem("otpData"));
    let payload = {
      email: email,
      otp: +data?.otp,
    };

    try {
      setLoading(true);
      const response = await signInService(payload);
      if (response?.status === "success") {
        toast.success(response?.data);
        localStorage.removeItem("otpData");
        navigate("/");
      } else {
        toast.error(response?.data);
      }
    } catch (error) {
      toast.error(t("anErrorOccurredDuringLogin"));
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    const email = JSON.parse(localStorage.getItem("otpData"));
    if (email) {
      try {
        setResendLoading(true);
        await reSendOtp(email);
        toast.success(t("OTPResentSuccessfully"));
        setTimerKey((prevKey) => prevKey + 1);
        setDisableResend(true);
        setRemainingTime(180);
        setTimeout(() => {
          setDisableResend(false);
        }, 180000);
      } catch (error) {
        toast.error("Failed to resend OTP");
      } finally {
        setResendLoading(false);
      }
    }
  };

  return (
    <section className="h-[100vh]">
      <div className="custom-bg">
        <div className=" h-full flex justify-end items-center">
          <div className="bg-white shadow-lg  w-[100%] md:w-[50%] xl:w-[29%] rounded-[0rem]">
            <div className="text-black flex h-[100vh] items-center justify-center relative">
              <form
                className="w-full mx-[50px] lg:mx-[85px]"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex justify-center items-center mb-[30px] md:mb-[40px]">
                  <img src="/logo.svg" alt="" />
                </div>

                <h5 className="text-center faqs-titlemb-[30px]">
                  {t("Enterotptologinwhichissendtoyouremail")}
                </h5>
                <div className="">
                  <div className={`${errors.email ? "" : "mb-[20px]"}`}>
                    <div className="relative">
                      <input
                        placeholder={t("EnterOTP")}
                        type="text"
                        maxLength={6}
                        {...register("otp")}
                        style={{ paddingLeft: "45px !important" }}
                        className="form-control-lg"
                      />
                      <div className="input-logo">
                        <FaLock />
                      </div>
                    </div>

                    {errors.otp && (
                      <span className="text-[red] text-[11px]">
                        {errors.otp.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-end items-center mt-[10px]">
                  <div className="flex justify-between items-center mt-[10px] gap-5">
                    <button
                      className={`underline text-[14px] font-[400]  ${
                        resendLoading || disableResend
                          ? "text-[gray]"
                          : "text-[#0072BB]"
                      }`}
                      type="button"
                      onClick={resendOtp}
                      disabled={resendLoading || disableResend}
                    >
                      {t("ResendOTP")}
                    </button>

                    {remainingTime > 0 && (
                      <div style={{ width: "40px", height: "40px" }}>
                        <CountdownCircleTimer
                          key={timerKey}
                          isPlaying={!resendLoading}
                          duration={180}
                          colors={[["#0072BB"]]}
                          size={40}
                          strokeWidth={6}
                          onComplete={() => [true, 0]}
                          className=""
                        >
                          {({ remainingTime }) => remainingTime}
                        </CountdownCircleTimer>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center border-b border-[#212121] mt-[30px] sm:mt-[40px] pb-[25px] mb-[20px]">
                  {loading ? (
                    <>
                      <button
                        disabled
                        type="button"
                        className="text-white p-[10px] justify-center bg-[#0072BB] hover:bg-blue-[#0072BB] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 inline-flex items-center"
                      >
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline w-[25px] h-[20px] me-3 text-white animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          />
                        </svg>
                        {t("loading")}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-[#0072BB] button-text px-[18px] py-[10px] text-white rounded-[5px]"
                        type="submit"
                      >
                        {t("VerifyOTP")}
                      </button>
                    </>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-[500] mb-[10px]">
                    {t("dontHaveAnAccount")}{" "}
                  </p>
                  <Link
                    className="button-text text-[#0072BB] underline"
                    to={"/signup"}
                  >
                    {t("registerHere")}
                  </Link>
                </div>
                <div className="absolute bottom-[40px] w-[69%]">
                  <div className="flex justify-between ">
                    <a
                      href="#!"
                      className="text-[13px] font-[300] text-[#888888]"
                    >
                      {t("privacyPolicySignin")}
                    </a>
                    <p className="text-[#888888]">|</p>
                    <a
                      href="#!"
                      className="text-[13px] font-[300] text-[#888888]"
                    >
                      {t("termsOfUse")}
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default OtpVerification;
