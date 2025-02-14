import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";
import { createQuestionRequestFormService } from "../../Services/contactUsService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const schema = yup.object({
  companyName: yup.string(),
  name: yup.string().required(t("pleaseEnterYourFullName")),
  email: yup
    .string()
    .email("Invalid Email Format")
    .required(t("pleaseEnterYourEmail")),
  requestDetail: yup
    .string()
    .required(t("Please Enter Description of your request.")),
});

const ContactForm = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const [write1, setWrite1] = useState("");
  const [write2, setWrite2] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await createQuestionRequestFormService(data);
      setLoading(false);

      if (response) {
        toast.success("An email is sent to your registered email.");
      } else {
        toast.error("There is some error. Please try again later.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoading(false);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-[#FAFAFA] py-[30px] lg:py-[90px]">
      <div className="custom-container">
        <div className="flex justify-center gap-[93px]">
          <div>
            <div className="text-center lg:mb-[30px]">
              <p className="title-text">{t("contactForm")}</p>
              <p className="normal-text lg:w-[358px] mx-auto">
                {t("pleaseFillTheBelow")}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative mb-2">
                <input
                  {...register("name")}
                  type="text"
                  className="w-[580px] h-[50px] rounded-lg border border-gray-300 bg-white p-4 mt-[30px]"
                  placeholder={t("yourFullName")}
                  onChange={(e) => {
                    register("companyName").onChange(e);
                    setWrite1(e.target.value);
                  }}
                />
                {errors?.name && (
                  <span className="absolute top-[70px] left-0 mt-2 text-[red] font-medium">
                    {errors?.name?.message}
                  </span>
                )}
                <div className="input-form">
                  <img src="/Person.svg" alt="person" />
                  {!write1 && (
                    <span className="absolute top-0 left-[160px] text-red-500">
                      *
                    </span>
                  )}
                </div>
              </div>

              <div className="relative mb-2">
                <input
                  {...register("companyName")}
                  type="text"
                  className="w-[580px] h-[50px] rounded-lg border border-gray-300 bg-white p-4 mt-[30px] new-required"
                  placeholder={t("companyName")}
                />

                <div className="input-form">
                  <img src="/brief-case.svg" alt="brief-case" />
                </div>
              </div>

              <div className="relative mb-2">
                <input
                  {...register("email")}
                  type="email"
                  className="w-[580px] h-[50px] rounded-lg border border-gray-300 bg-white  placeholder-red::placeholder p-4 mt-[30px]"
                  placeholder={"Email"}
                  onChange={(e) => {
                    register("companyName").onChange(e);
                    setWrite2(e.target.value);
                  }}
                />
                {errors?.email && (
                  <span className="absolute top-[70px] left-0 mt-2 text-[red] font-medium">
                    {errors?.email?.message}
                  </span>
                )}
                <div className="input-form">
                  <img src="/Call.svg" alt="call" />
                  {!write2 && (
                    <span className="absolute top-0 left-[90px] text-red-500">
                      *
                    </span>
                  )}
                </div>
              </div>

              <div className="relative mt-[30px] mb-2">
                <label className="">
                  {t("WhatIsThe")}{" "}
                  <span className="absolute top-0 left-[240px] text-red-500">
                    *
                  </span>
                </label>
                <textarea
                  {...register("requestDetail")}
                  type="number"
                  className="w-full rounded-lg border border-gray-300 bg-white placeholder-red::placeholder p-4 mt-[15px]"
                  placeholder={t("writeYour")}
                />
                {errors?.requestDetail && (
                  <span className="absolute bottom-[-20px] left-0 mt-2 text-[red] font-medium">
                    {errors?.requestDetail?.message}
                  </span>
                )}
              </div>

              <div className="lg:w-[580px] mb-2">
                <p className="text-[13px] mt-[30px]">
                  {t("privacyPolicy")}
                  <Link to={'/term-and-condition'}> <b>{t("privacyPolicy1")}</b> </Link> {t("and")}{" "}
                  <Link to={'/term-and-condition'}><b> {t("terms&Conditions")} </b></Link> {t("here")}
                </p>
              </div>
              

              <div className="flex justify-center">
                <button
                  className="button-text bg-[#0072BB] text-[white] px-[20px] py-[14px] mt-[30px] rounded-[5px] mx-auto flex justify-center items-center gap-3"
                  type="submit"
                >
                  {loading && (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-100 animate-spin dark:text-white-600 fill-blue-400"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span class="sr-only">Loading...</span>
                    </div>
                  )}
                  {loading ? "Loading..." : t("SendMessage")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactForm;
