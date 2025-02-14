import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentLanguage } from "../Redux/Slice/globalSlice";

import en_flag from "../Assets/en_flag.png";
import no_flag from "../Assets/no_flag.png";

function LanguageSelector() {
  const dispatch = useDispatch();
  const [isRotated, setIsRotated] = useState(false);

  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const changeLanguage = (lng) => {
    dispatch(setCurrentLanguage(lng));
  };

  const rotateSVG = () => {
    setIsRotated(!isRotated);
  };

  return (
    <div
      onClick={rotateSVG}
      className="relative flex items-center cursor-pointer gap-[4px]"
    >
      <span className={`w-8`}>
        {currentLanguage === "en" ? (
          <img src={en_flag} alt={"flag_img"} />
        ) : (
          <img src={no_flag} alt={"flag_img"} />
        )}
      </span>
      <select
        className="cursor-pointer block appearance-none text-[#777777] w-full  border bg-[#00000000]  hover:text-[#212121] px-2 py-2 rounded leading-tight focus:outline-none  border-none"
        onChange={(e) => changeLanguage(e.target.value)}
        value={currentLanguage}
      >
        <option value="en">English</option>
        <option value="no">Norwegian</option>
      </select>
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-[4px] ms-5 text-gray-700 ${
          isRotated ? "rotate-180" : ""
        }`}
        style={{
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
          <path
            d="M1.78639 0.554688C1.06895 0.554688 0.6855 1.3997 1.15794 1.93963L4.84678 6.15545C5.31256 6.68777 6.14066 6.68777 6.60643 6.15545L10.2953 1.93964C10.7677 1.3997 10.3843 0.554688 9.66683 0.554688H1.78639Z"
            fill="#212121"
          />
        </svg>
      </div>
    </div>
  );
}

export default LanguageSelector;
