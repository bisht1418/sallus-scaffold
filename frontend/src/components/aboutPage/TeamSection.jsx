import React from "react";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";

const TeamSection = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  // Sample data array for the items
  const cardData = [
    { normal: t("about_3_list_1"), hover: t("about_3_list_1_1") },
    { normal: t("about_3_list_2"), hover: t("about_3_list_2_1") },
    { normal: t("about_3_list_3"), hover: t("about_3_list_3_1") },
    { normal: t("about_3_list_4"), hover: t("about_3_list_4_1") },
    { normal: t("about_3_list_5"), hover: t("about_3_list_5_1") },
  ];

  return (
    <div className="custom-container py-[45px]">
      <div className="text-center mb-[50px]">
        <p className="title-text">{t("about_3_title")}</p>
        <div className="custom-container mb-8">{t("about_3_desc")}</div>

        <div className="grid sm:grid-cols-1 md:grid-cols-5 gap-8">
          {cardData.map((item, index) => (
            <div
              key={index}
              className="mt-[10px] bg-white shadow-md p-6 rounded-lg transition-transform transform border hover:-translate-y-2 hover:shadow-xl cursor-pointer hover:bg-[#0072BB] hover:text-white"
            >
              <p className="text-lg font-bold text-center transition-opacity duration-300 opacity-100">
                {item.normal}
              </p>
              <p className="text-lg text-center transition-opacity duration-300 opacity-0 hover:opacity-100">
                {item.hover}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;