import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";
import { toast } from "react-toastify";
import { createContactUsFormService } from "../../Services/contactUsService";
import { CiMobile3 } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { MdOutlineEmail } from "react-icons/md";
import { LuBuilding } from "react-icons/lu";
import { getGeoLocationData } from "../../Services/geoLocationService";
import { useEffect } from "react";

const styles = {
  color: "red",
};

const schema = yup.object({
  companyName: yup.string().required(t("PleaseEnterCompanyName")),
  name: yup.string().required(t("pleaseEnterYourFullName")),
  phoneNumber: yup.string().required(t("pleaseEnterMobileNumber")),
  email: yup
    .string()
    .email(t("pleaseEnterAvalidEmail"))
    .required(t("pleaseEnterYourEmail")),
});

const Demo = (props) => {
  const [write, setWrite] = useState("");
  const [write1, setWrite1] = useState("");
  const [write2, setWrite2] = useState("");
  const [write3, setWrite3] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      companyName: "",
    },
    resolver: yupResolver(schema),
  });

  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const [countryCallingCode, setCountryCallingCode] = useState("");

  useEffect(() => {
    getTheCountryCode();
  }, []);

  const userId = useSelector((state) => state?.auth?.loggedInUser?._id);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await createContactUsFormService({ ...data, userId });
      const responseData = response?.data?.sendEmailResponse;
      setLoading(false);

      if (responseData?.status) {
        toast.success(
          "An email is sent to your registered email. Please check it for demo Email and Password."
        );
        reset();
        setWrite("");
        setWrite1("");
        setWrite2("");
        setWrite3("");

        if (props && typeof props?.isDemoModal !== "undefined") {
          if (!props.isDemoModal) {
            props.setIsDemoModal(true);
          }
        } else {
          console.error(
            "Props or props.isDemoModal is undefined or null. Cannot proceed."
          );
        }
      } else {
        toast.error(responseData?.error || "There is some error");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoading(false);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const getTheCountryCode = async () => {
    const responseData = await getGeoLocationData();
    const countryMobileCode = responseData?.country_calling_code;
    const formateCountryCode = countryMobileCode?.slice(1);
    setCountryCallingCode(formateCountryCode);
    setWrite2(formateCountryCode);
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^0-9]/g, "");
    const formattedPhoneNumber = `+${phoneNumber?.slice(
      0,
      countryCallingCode.length
    )} ${phoneNumber?.slice(
      countryCallingCode?.length,
      countryCallingCode?.length + 4
    )} ${phoneNumber?.slice(
      countryCallingCode?.length + 4,
      countryCallingCode?.length + 7
    )} ${phoneNumber?.slice(countryCallingCode?.length + 7)}`;
    return formattedPhoneNumber.trim();
  };

  const handleChange = (e) => {
    const inputVal = e?.target?.value;
    const onlyNums = inputVal?.replace(/[^\d]/g, "");

    if (
      onlyNums?.startsWith(countryCallingCode) &&
      onlyNums?.length <= countryCallingCode?.length + 10
    ) {
      setWrite2(formatPhoneNumber(`+${onlyNums}`));
    } else if (onlyNums?.length <= countryCallingCode?.length) {
      setWrite2(`+${onlyNums}`);
    }
  };

  return (
    <div className="bg-[#FAFAFA] py-[20px] rounded-md">
      <div className="custom-container">
        <div className="flex justify-center items-center lg:flex-row gap-[93px]">
          <div>
            <div className="text-center lg:mb-[30px]">
              <p className="title-text">{t("getAFreeDemo")}</p>
              <p className="normal-text lg:w-[358px] mx-auto">
                {t("pleaseFillTheBelowForm")}
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">
                <input
                  {...register("companyName", { required: true })}
                  type="text"
                  className="w-[580px] h-[50px] rounded-lg border border-gray-300 bg-white p-4 mt-[30px] new-required"
                  placeholder={t("companyName")}
                  onChange={(event) => {
                    register("companyName").onChange(event);
                    setWrite(event.target.value);
                  }}
                />

                <div className="input-form">
                  <LuBuilding className="font-semibold text-[20px]" />
                  {/* <img src="/brief-case.svg" alt="brief-case" /> */}
                  {!write && (
                    <span className="absolute top-0 left-[166px] text-red-500">
                      *
                    </span>
                  )}
                </div>
              </div>
              {errors?.companyName && (
                <span style={styles}>{errors?.companyName?.message}</span>
              )}
              <div className="relative">
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="w-[580px] h-[50px] rounded-lg border border-gray-300 bg-white p-4 mt-[30px]"
                  placeholder={t("yourFullName")}
                  onChange={(event) => {
                    register("name").onChange(event);
                    setWrite1(event.target.value);
                  }}
                />
                <div className="input-form">
                  <GoPeople className="font-bold text-[20px]" />
                  {/* <img src="/person.svg" alt="person" /> */}
                  {!write1 && (
                    <span className="absolute top-0 left-[160px] text-red-500">
                      *
                    </span>
                  )}
                </div>
              </div>
              {errors?.name && (
                <span style={styles}>{errors?.name?.message}</span>
              )}
              <div className="relative">
                <input
                  {...register("phoneNumber", { required: true })}
                  type="text"
                  className="w-[580px] h-[50px] rounded-lg border border-gray-300 bg-white p-4 mt-[30px]"
                  placeholder={t("mobileNumber")}
                  onChange={(e) => {
                    handleChange(e);
                    register("email").onChange(e);
                  }}
                  value={write2}
                />
                <div className="input-form">
                  <CiMobile3 className="font-semibold text-[20px]" />
                  {/* <img src="/call.svg" alt="call" /> */}
                  {!write2 && (
                    <span className="absolute top-0 left-[160px] text-red-500">
                      *
                    </span>
                  )}
                </div>
              </div>
              {errors?.phoneNumber && (
                <span style={styles}>{errors?.phoneNumber?.message}</span>
              )}
              <div className="relative">
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className="w-[580px] h-[50px] rounded-lg border border-gray-300 bg-white p-4 mt-[30px]"
                  placeholder={t("mailId")}
                  onChange={(event) => {
                    register("email").onChange(event);
                    setWrite3(event.target.value);
                  }}
                />
                <div className="input-form">
                  <MdOutlineEmail className="font-semibold text-[20px]" />
                  {/* <img src="/email.svg" alt="email-logo" /> */}
                  {!write3 && (
                    <span className="absolute top-[-8px] left-[90px] text-red-500">
                      *
                    </span>
                  )}
                </div>
              </div>
              {errors?.email && (
                <span style={styles}>{errors?.email?.message}</span>
              )}
              <div className="lg:w-[580px]">
                <p className="text-[13px] mt-[30px]">
                  {t("privacyPolicy")}
                  <b> {t("privacyPolicy1")} </b> {t("and")}{" "}
                  <b> {t("terms&Conditions")} </b> {t("here")}
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  className="button-text bg-[#0072BB] text-[white] px-[20px] py-[14px] mt-[30px] rounded-[5px] mx-auto"
                  type="submit"
                >
                  {loading ? "Loading..." : t("getDemo")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Demo;
