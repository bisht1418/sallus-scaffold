import React, { useEffect, useState } from "react";
import { t } from "../utils/translate";
import { useSelector } from "react-redux";
const menuDots = "/menu-dots.svg";

const PicturesCard = (props) => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleToggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionClick = async (option, id, event) => {
    event.preventDefault(); // Prevent the default behavior
    if (option === "view") {
      window.open(`${props.file}`, "_blank");
    } else if (option === "download") {
      const downloadLink = document.createElement("a");
      downloadLink.href = `${props.file}`;
      downloadLink.download = props.file;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else if (option === "delete") {
      props.handleDelete(id);
    }
    setDropdownVisible(false);
  };

  function formatDateTime(dateTimeStr) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString("en-US", options);
  }

  const downloadImage = async (imageUrl) => {
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
        return response;
      }
      setDropdownVisible(false);
    } catch (error) {
      return error;
    }
  };

  function extractFileNameAndType(url, fileCategory) {
    const splitUrl = url.split("/");
    const fileNameWithType = splitUrl[splitUrl.length - 1];

    const parts = fileNameWithType.split(".");
    const fileType = parts[parts.length - 1];
    const fileName = parts.slice(0, -1).join(".");

    return { fileName, fileType };
  }

  return (
    <>
      <div>
        <div className="h-[200px] w-[288px] bg-white border border-gray-200 rounded-[10px] shadow relative overflow-hidden">
          <div
            className="cursor-pointer contents"
            onClick={(event) => handleOptionClick("view", props._id, event)}
          >
            <img
              className="w-full h-full object-cover flex justify-center items-center"
              src={`${props.file}`}
              alt={props.fileName}
            />
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
                {
                  <>
                    <button
                      onClick={(event) =>
                        handleOptionClick("view", props._id, event)
                      }
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:outline-none"
                    >
                      {t("view")}
                    </button>
                    <button
                      onClick={(event) => downloadImage(`${props.file}`, event)}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:outline-none"
                    >
                      {t("download")}
                    </button>
                  </>
                }
                {
                  props?.roleOfUser !==2 && (
                    <button
                    onClick={(event) =>
                      handleOptionClick("delete", props._id, event)
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
          <div className="font-[600]">
            {/* {extractFileNameAndType(props.file)?.fileName || props.fileName} */}
            {props?.fileName}
          </div>
          <div className="font-semibold text-sm">{`Created At : ${
            formatDateTime(props.createdAt) || "Not updated"
          }`}</div>
        </div>
      </div>
    </>
  );
};

export default PicturesCard;
