import React from "react";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";

const AdavanceConstructorIndustry = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  return (
    <div className=" bg-[white]">
      <div className="custom-container">
        <div className="flex flex-col lg:flex-row py-[100px] w-full items-center gap-[20px]">
          <div className="w-full">
            <p className="title-text text-center ">
              {t("advancingConstruction")}
            </p>
            <p className="normal-text mt-10 text-center">
              {t("deliveringHighQuality")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdavanceConstructorIndustry;
