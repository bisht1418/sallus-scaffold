import React from "react";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";

const AboutUsNewSec = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  return (
    <div className="custom-container py-[45px]">
      <div className="text-center mb-[50px]">
        <p className="title-text">{t("about_5_title")}</p>
      </div>
      <div className="custom-container ">
        {t("about_5_desc")}
      </div>
    </div>
  );
};
// vercel Comment
export default AboutUsNewSec;
