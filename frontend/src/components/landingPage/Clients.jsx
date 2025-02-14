import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useSelector } from "react-redux";
import { t } from "../../utils/translate";

const Clients = ({ bg }) => {
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
      <div className="text-center pb-[60px]">
        <p className="title-text mb-[30px]">{t("about_2_title")}</p>
        <div className="custom-container ">
          {t("about_2_desc")}
        </div>
      </div>
    </div>
  );
};

export default Clients;
