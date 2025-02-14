import React, { useEffect, useState, useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { approvalFormUpdateStatusService } from "../../Services/approvalFormService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";
import p1 from "../../Assets/noImg.png";
const menuDots = "/menu-dots.svg";

const ApprovalFormSlider = (props) => {
  //#region variable region
  const { accessLevel: roleOfUser } = useSelector((state) => state?.project);

  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [visibleItems, setVisibleItems] = useState(4);
  const popupRef = useRef(null);

  //#endregion

  //#region methods region

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleViewMore = () => {
    if (visibleItems === 4) {
      setVisibleItems(
        (prevVisibleItems) => prevVisibleItems + props?.data?.length
      );
    } else {
      setVisibleItems(
        (prevVisibleItems) => prevVisibleItems - props?.data?.length
      );
    }
  };

  function formatDateTime(dateTimeStr) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString("en-US", options);
  }

  const handleToggleDropdown = (index, event) => {
    const targetId = event.currentTarget.id;
    if (targetId == index) {
      setCurrentId(index);
      setDropdownVisible(!dropdownVisible);
    }
  };

  // Function to handle clicks outside of the popup
  const handleClickOutside = (event) => {
    const isAnchorInsideButton =
      event.target.tagName === "A" && event.target.closest("button.popup");

    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      !event.target.closest(".popup") &&
      !isAnchorInsideButton
    ) {
      // Clicked outside the popup, so close it
      setDropdownVisible(!dropdownVisible);
    }
  };

  const [id, setId] = useState("");

  const handleStatus = async (id, status) => {
    setId(id);
    if (status === "active") {
      const activeResponse = await approvalFormUpdateStatusService(
        { status: "active" },
        id
      );
      const response = activeResponse?.data?.status;
      if (response === "success") {
        toast.success(t("approvalFormStatusUpdatedSuccessfully"));
        props.refreshtData();
      }
    } else if (status === "disassembled") {
      const disassembledResponse = await approvalFormUpdateStatusService(
        { status: "disassembled" },
        id
      );
      const response = disassembledResponse?.data?.status;
      if (response === "success") {
        toast.success(t("approvalFormStatusUpdatedSuccessfully"));
        props.refreshtData();
      }
    } else if (status === "inactive") {
      const inactiveResponse = await approvalFormUpdateStatusService(
        { status: "inactive" },
        id
      );
      const response = inactiveResponse?.data?.status;
      if (response === "success") {
        toast.success(t("approvalFormStatusUpdatedSuccessfully"));
        props.refreshtData();
      }
    }
  };

  //#endregion

  //#region useEffect region
  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove event listener when component unmounts or when popup is closed
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  //#endregion

  // console.log("props", props);

  return (
    <>
      {props?.data?.length ? (
        <div className=" border-b-2 pb-[60px] text-left">
          <div className="custom-container">
            <div className="flex items-start justify-start ">
              <p
                className={`text-[#212121] text-xl not-italic font-bold leading-[normal] mt-10 ${props?.status === "Active"
                    ? "bg-green-400 border px-3 py-3 rounded-lg cursor-pointer"
                    : props?.status === "Inactive"
                      ? "bg-orange-400 border px-3 py-3 rounded-lg cursor-pointer"
                      : "bg-red-400 border px-3 py-3 rounded-lg cursor-pointer"
                  }`}
              >
                {props.status}
              </p>
            </div>
            {props?.loading ? (
              <div className="text-center mt-10 ">
                <div
                  className="flex flex-col justify-center items-center  gap-[10px]"
                  role="status"
                >
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <h1 className="text-[20px] font-[700] text-[#0072BB]">
                    {t("loading")}
                  </h1>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="pt-2 slide-main w-full flex grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-start flex-cols flex-wrap ">
                    {props?.data?.length ? (
                      props?.data?.slice(0, visibleItems).map((item, index) => (
                        <div key={index}>
                          <div className="w-full rounded-[10px] relative overflow-hidden max-w-[282px]">
                            <div className="h-[300px]">
                              {roleOfUser === 0 || roleOfUser === 1 ? (
                                <Link to={`/edit-approval-form/${item._id}`}>
                                  <img
                                    src={item?.approvalFormImage || p1}
                                    alt="No_image"
                                    className="h-full w-full object-cover"
                                  />
                                </Link>
                              ) : null}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 medium-title text-[#FFFFFF] bg-[#000000B2] min-h-[100px] max-h-[100px] flex justify-start items-start  ">
                              <div className="flex justify-between gap-[20px] items-center p-[10px]">
                                <div className="flex flex-col">
                                  <p className="text-[18px] text-nowrap">
                                    {" "}
                                    {item?.scaffoldName[0]?.value?.toUpperCase() ||
                                      "Not Available"}
                                  </p>

                                  <p className="text-[12px] text-nowrap font-semibold">
                                    {" "}
                                    Scaffold type &nbsp;&nbsp;
                                    {item?.scaffoldName[0]?.key?.toUpperCase() ||
                                      "Not Available"}
                                  </p>
                                  <p className="text-[12px] text-nowrap font-semibold">
                                    {" "}
                                    Scaffold No.&nbsp;&nbsp;
                                    {item?.scaffoldIdentificationNumber?.toUpperCase() ||
                                      "Not Available"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex relative">
                            <div className="flex flex-col gap-1 mt-[10px] ml-[10px] mb-[10px]">
                              <div className="font-[600]">
                                {t("projectNo")} {item?.projectNumber}
                              </div>
                              <div className="font-[500]">
                                {`Last edit : ${formatDateTime(item?.createdAt) ||
                                  "Not updated"
                                  }`}
                              </div>
                              <div>
                                {
                                  roleOfUser === 0 && (
                                    <button
                                      id={index}
                                      ref={popupRef}
                                      onClick={(event) =>
                                        handleToggleDropdown(index, event)
                                      }
                                      className="p-2 rounded-full z-999 hover:bg-gray-200 focus:outline-none absolute top-0 right-2"
                                    >
                                      <img src={menuDots} alt="option-menu" />
                                    </button>
                                  )
                                }


                                {dropdownVisible && currentId === index && (
                                  <div className="absolute top-[0px] right-11 z-99999 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[1]">
                                    {roleOfUser === 0 && (
                                      <button
                                        onClick={() =>
                                          props.handleDelete(item._id)
                                        }
                                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                      >
                                        {t("delete")}
                                      </button>
                                    )}

                                    {roleOfUser === 0 || roleOfUser === 1 ? (
                                      <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup">
                                        <Link
                                          to={`/edit-approval-form/${item._id}`}
                                        >
                                          {t("edit")}
                                        </Link>
                                      </button>
                                    ) : null}
                                    {props.status.toLowerCase() ===
                                      "inactive" ? (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleStatus(item?._id, "active")
                                          }
                                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                        >
                                          <Link to={``}>
                                            {t("setAsActive")}
                                          </Link>
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleStatus(
                                              item?._id,
                                              "disassembled"
                                            )
                                          }
                                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                        >
                                          <Link to={``}>
                                            {t("setAsDisassembled")}
                                          </Link>
                                        </button>
                                      </>
                                    ) : props.status.toLowerCase() ===
                                      "active" ? (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleStatus(item?._id, "inactive")
                                          }
                                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                        >
                                          <Link to={``}>
                                            {t("setAsInactive")}
                                          </Link>
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleStatus(
                                              item?._id,
                                              "disassembled"
                                            )
                                          }
                                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                        >
                                          <Link to={``}>
                                            {t("setAsDisassembled")}
                                          </Link>
                                        </button>
                                      </>
                                    ) : props.status.toLowerCase() ===
                                      "disassembled" ? (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleStatus(item?._id, "active")
                                          }
                                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                        >
                                          <Link to={``}>
                                            {t("setAsActive")}
                                          </Link>
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleStatus(item?._id, "inactive")
                                          }
                                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                        >
                                          <Link to={``}>
                                            {t("setAsInactive")}
                                          </Link>
                                        </button>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>{t("nofileAvailable")}</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-center items-center mt-[1rem]">
            {visibleItems < props?.data?.length && (
              <>
                <button className="bg-[#fff] text-[black] border-2 border-[black] flex justify-center items-center rounded-[5px] px-[20px] py-[10px] w-[150px] button-text">
                  {<button onClick={handleViewMore}>{t("viewAll")}</button>}
                </button>
              </>
            )}
          </div>
          <div className="flex justify-center items-center mt-[1rem]">
            {visibleItems > 4 && (
              <>
                <button className="bg-[#fff] text-[black] border-2 border-[black] flex justify-center items-center rounded-[5px] px-[20px] py-[10px] w-[150px] button-text">
                  {<button onClick={handleViewMore}>{t("viewLess")}</button>}
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ApprovalFormSlider;
