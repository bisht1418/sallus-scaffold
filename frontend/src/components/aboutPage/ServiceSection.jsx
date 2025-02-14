import React from "react";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";

const ServiceSection = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  return (
    <>
      <div className="custom-container">
        <div className="text-center pb-[50px]">
          <p className="title-text mb-[30px]">{t("about_1_title")}</p>
          <p className="normal-text lg:px-[100px]">
            {t("about_1_desc")}
          </p>
        </div>
      </div>
    </>
  );
};
// vercel Comment
export default ServiceSection;
