import React, { useState } from "react";
import { ReactComponent as Pdf } from "../../Assets/pdficon.svg";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";
const menuDots = "/menu-dots.svg";

const FileCard = (props) => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const handleToggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionClick = (option, id, event) => {
    event.preventDefault();
    if (option === "view") {
      window.open(`${props.file}`, "_blank");
    } else if (option === "delete") {
      props.handleDelete(id);
    }
    setDropdownVisible(false);
  };

  function formatDateTime(dateTimeStr) {
    if (!dateTimeStr || isNaN(Date.parse(dateTimeStr))) {
      return "Not updated";
    }
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString("en-US", options);
  }

  const downloadFiles = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = props.fileName;
        downloadLink.click();
        window.URL.revokeObjectURL(url);
      } else {
        return response.statusText;
      }
      setDropdownVisible(false);
    } catch (error) {
      return error;
    }
  };

  function truncateString(inputString, wordCount) {
    if (typeof inputString !== "string") {
      inputString = "No Files";
    }

    if (inputString?.length <= wordCount) {
      return inputString;
    }
    const truncatedWords = inputString.slice(0, wordCount);
    if (/\.[a-zA-Z0-9]+$/.test(inputString)) {
      return `${truncatedWords}...`;
    }
    return truncatedWords + "...";
  }

  function extractFileNameAndType(url, fileCategory) {
    const splitUrl = url.split("/");
    const fileNameWithType = splitUrl[splitUrl?.length - 1];

    const parts = fileNameWithType.split(".");
    const fileType = parts[parts?.length - 1];
    const fileName = parts.slice(0, -1).join(".");

    return { fileName, fileType };
  }

  return (
    <div>
      <div className="max-h-[200px] min-h-[200px] max-w-[288px] min-w-[288px] bg-[#0072BB26] border border-gray-200 rounded-[10px] shadow relative p-[10px] flex items-center justify-center ">
        <div className="flex justify-center">
          <Pdf className="object-full" />
        </div>
        <div>
          <button
            onClick={handleToggleDropdown}
            className="p-2 rounded-full z-999 hover:bg-gray-200 focus:outline-none absolute top-0 right-0"
          >
            <img src={menuDots} alt="option-menu" />
          </button>
          {dropdownVisible && (
            <div className="absolute top-0 right-9 z-10 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <button
                onClick={(event) =>
                  handleOptionClick("view", props?._id, event)
                }
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                {t("view")}
              </button>
              <button
                onClick={(event) => downloadFiles(`${props?.file}`, event)}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                {t("download")}
              </button>
              {
                props?.roleOfUser !== 2 && (
<button
                onClick={(event) =>
                  handleOptionClick("delete", props?._id, event)
                }
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                {t("delete")}
              </button>
                )
              }
              
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-[10px] ml-[10px] mb-[10px]">
        <div className="font-[600] overflow-hidden overflow-ellipsis">
          {/* {extractFileNameAndType(props.file, props.fileName)?.fileName} */}
          {props?.fileName}
        </div>
        <div className="font-[500]">{`Last edit : ${
          formatDateTime(props?.createdAt) || formatDateTime(props?.createdAt)
        }`}</div>
      </div>
    </div>
  );
};
export default FileCard;
