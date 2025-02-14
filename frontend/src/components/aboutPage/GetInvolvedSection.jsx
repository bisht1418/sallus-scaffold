import React from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { t } from "../../utils/translate";
import { useSelector } from "react-redux";

const GetInvolvedSection = ({ bg }) => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const sectionBG = () => {
    return {
      white: "bg-[#FFFFFF]",
      gray: "bg-[#FAFAFAFA]",
    }[bg];
  };

  return (
    <div className={`items-center py-[45px] ${sectionBG()}`}>
      <div className="text-center mb-[50px]">
        <p className="title-text">{t("about_6_title")}</p>
      </div>
      <div className="custom-container ">
        {t("about_6_desc")}
      </div>
    </div>
  );
};
// vercel Comment
export default GetInvolvedSection;
