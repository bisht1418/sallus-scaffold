import React from "react";
import { t } from "../../utils/translate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Help = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const naviagte = useNavigate();
  return (
    <div className="bg-[#FAFAFA]">
      <div className="relative">
        <div className="custom-container">
          <div className="text-center py-[100px]">
            <p className="title-text">{t("weHelpYou")}</p>
            <button
              onClick={() => naviagte("/contact-us")}
              className="button-text bg-[#0072BB] text-[white] px-[20px] py-[14px] mt-[30px] rounded-[5px] mx-auto"
            >
              {t("Let’sWorkTogether")}
            </button>
          </div>
        </div>
        <div className="absolute bottom-[0%] left-[0%] lg:px-[150px] h-[68px] w-full">
          <img
            alt="background"
            className="h-full object-cover"
            src="/help.svg"
          />
        </div>
      </div>
    </div>
  );
};

export default Help;
