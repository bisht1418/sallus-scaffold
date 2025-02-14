import React from "react";
import { Link } from "react-router-dom";
import { t } from "../utils/translate";
const backgroundImage = require("../Assets/background_image.jpg");

const LogCard = ({ data }) => {
  const formateDate = (dateString) => {
    const formattedDate = new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
  };

  return (
    <Link to={`/edit-approval-form/${data?._id}`}>
      <div
        className={`max-w-[273px] h-[274px]  px-5 flex flex-col justify-center items-center mx-auto bg-white rounded-xl shadow-md space-y-2 relative border sm:min-h-[100px] md:min-h-[271px] cursor-pointer transition-transform duration-300 transform hover:scale-95 ease-out hover:ease-in ${
          data?.status === "inactive"
            ? "border-red-400"
            : data?.status === "active"
            ? "border-green-400"
            : "border-orange-400"
        }`}
      >
        <img
          className="h-[184px] w-[253px] rounded-md cover"
          src={data?.approvalFormImage || backgroundImage}
          alt="Construction work"
        />
        <div className=" md:text-left w-full flex flex-col">
          <p className="text-sm text-black font-semibold  flex justify-start items-start">
            <span className="capitalize ">
              {data?.scaffoldName[0]?.value || "No Name"}
            </span>
          </p>
          <p className="text-gray-500 font-medium flex justify-start ">
            <span className="normal-case text-xs items-start	">
              {data?.scaffoldIdentificationNumber}
            </span>
          </p>
          <p className="text-gray-500 font-medium flex justify-start">
            <span className="normal-case text-xs">
              {formateDate(data?.date)}
            </span>
          </p>
        </div>
        <span
          className={`${
            data?.status === "inactive"
              ? "!text-white bg-red-400 !border-white"
              : data?.status === "active"
              ? "!text-white bg-green-400 !border-white"
              : "!text-white bg-orange-400 !border-white"
          } text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded  dark:text-red-400 border border-red-400 absolute top-0 right-0`}
        >
          {data?.status === "inactive"
            ? `${t("inactive")}`
            : data?.status === "active"
            ? `${t("active")}`
            : `${t("dismantle")}`}
        </span>
      </div>
    </Link>
  );
};

export default LogCard;
