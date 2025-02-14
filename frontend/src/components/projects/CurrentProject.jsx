import React, { useEffect, useState, useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import _ from "lodash";
import p1 from "../../Assets/noImg.png";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { editProjectService } from "../../Services/projectService";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";
const menuDots = "/menu-dots.svg";

const CurrentProject = (props) => {
  const currentLanguage = useSelector((state) => state?.global?.current_language);
  const roleOfUser = useSelector((state) => state?.auth?.loggedInUser?.type);
  const [visibleItems, setVisibleItems] = useState(4);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [selectedStatus, setSelectedStatus] = useState("");
  const popupRef = useRef(null);
  const [id, setId] = useState("");

  const handleViewMore = () => {
    if (visibleItems === 4) {
      setVisibleItems((prevVisibleItems) => prevVisibleItems + props?.data?.length);
    } else {
      setVisibleItems((prevVisibleItems) => prevVisibleItems - props?.data?.length);
    }
  };

  function formatDateTime(dateTimeStr) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString("en-US", options);
  }

  const handleToggleDropdown = (index, event, id) => {
    if (roleOfUser !== 0) {
      toast.error(t("adminAccessStatus"))
      return
    }
    const targetId = event.currentTarget.id;
    setId(id)
    if (targetId == index) {
      setCurrentId(index);
      setDropdownVisible(!dropdownVisible);
    }
  };

  const handleClickOutside = (event) => {
    const isAnchorInsideButton = event.target.tagName === "A" && event.target.closest("button.popup");
    if (popupRef.current && !popupRef.current.contains(event.target) && !event.target.closest(".popup") && !isAnchorInsideButton) {
      setDropdownVisible(false);
    }
  };

  const handleStatusClick = (projectId, status) => {
    setId(projectId);
    setSelectedStatus(status);
    setShowStatusModal(true);
    setDropdownVisible(false);
  };

  const handleStatus = async () => {
    const response = await editProjectService({ status: selectedStatus }, id);
    if (response?.data?.status === "success") {
      toast.success(t("approvalFormStatusUpdatedSuccessfully"));
      props.refreshtData();
    }
    setShowStatusModal(false);
  };

  const handleConfirmation = (e, showModel) => {
    if (showModel) {
      props.handleDelete(id);
    }
    setShowConfirmationModal(false);
  };

  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <>
      {props?.data?.length ? (
        <>
          <div className="mt-[50px]">
            <div className="flex items-start mb-[50px]">
              <p className={`text-[#212121] text-xl not-italic font-bold leading-[normal] ${
                props?.status === "active"
                  ? "bg-green-400 border px-3 py-3 rounded-lg cursor-pointer"
                  : props?.status === "completed"
                    ? "bg-orange-400 border px-3 py-3 rounded-lg cursor-pointer"
                    : "bg-red-400 border px-3 py-3 rounded-lg cursor-pointer"
              }`}>
                {props?.heading}
              </p>
            </div>
            {props?.loading ? (
              <div className="text-center mt-10">
                <div className="flex flex-col justify-center items-center gap-[10px]" role="status">
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
                  <h1 className="text-[20px] font-[700] text-[#0072BB]">{t("loading")}</h1>
                </div>
              </div>
            ) : (
              <div className="">
                <div className="pt-2 slide-main w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {props?.data?.length > 0 ? (
                    props?.data?.slice(0, visibleItems).map((item, index) => (
                      <React.Fragment key={index}>
                        <div>
                          <div className="w-full rounded-[10px] relative overflow-hidden">
                            <Link to={`/edit-create-project/${item._id}`}>
                              <div className="absolute top-[10px] right-[10px]">
                                {item?.isInvited && (
                                  <div>
                                    <p className="bg-[white] text-sm font-semibold rounded-[5px] p-[5px_10px] text-gray">
                                      {/* {{ 0: "Admin", 1: "User", 2: "Guest" }[item.accessLevel]} */}
                                      Invited Project
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="h-[330px]">
                                <img
                                  src={item?.projectBackgroundImage || p1}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="absolute bottom-0 left-0 medium-title text-[#FFFFFF] bg-[#000000B2] !w-full">
                                <div className="flex justify-between gap-[20px] items-center p-[20px]">
                                  <p>{_.startCase(_.toLower(item?.projectName))}</p>
                                </div>
                              </div>
                            </Link>
                          </div>
                          <div className="relative">
                            <div className="flex flex-col gap-1 mt-[10px] ml-[10px] mb-[10px]">
                              <div className="font-[600]">
                                {t("projectNo")} {item?.projectNumber}
                              </div>
                              <div className="font-[500]">
                                {`Last edit : ${formatDateTime(item?.updatedAt) || "Not updated"}`}
                              </div>
                            </div>
                            {item.accessLevel === 0 && (
                              <div>
                                <button
                                  id={index}
                                  ref={popupRef}
                                  onClick={(event) => handleToggleDropdown(index, event, item?._id)}
                                  className="p-2 rounded-full z-999 hover:bg-gray-200 focus:outline-none absolute top-0 right-2"
                                >
                                  <img src={menuDots} alt="option-menu" />
                                </button>
                                {dropdownVisible && currentId == index && (
                                  <div className="absolute top-[0px] right-11 z-99999 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                    {roleOfUser === 0 && (
                                      <button
                                        onClick={() => {
                                          setShowConfirmationModal(true);
                                          setDropdownVisible(false);
                                        }}
                                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                      >
                                        {t("delete")}
                                      </button>
                                    )}

                                    {roleOfUser === 0 ? (
                                      <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup">
                                        <Link to={`/edit-create-project/${item._id}`}>{t("edit")}</Link>
                                      </button>
                                    ) : null}

                                    {props.status.toLowerCase() === "inactive" && roleOfUser === 0 ? (
                                      <>
                                        <button
                                          onClick={() => handleStatusClick(item?._id, "active")}
                                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                        >
                                          {t("setAsActive")}
                                        </button>
                                        <button
                                          onClick={() => handleStatusClick(item?._id, "completed")}
                                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                        >
                                          {t("setAsCompleted")}
                                        </button>
                                      </>
                                    ) : props.status.toLowerCase() === "active" && roleOfUser === 0 ? (
                                      <>
                                        <button
                                          onClick={() => handleStatusClick(item?._id, "inactive")}
                                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                        >
                                          {t("setAsInactive")}
                                        </button>
                                        <button
                                          onClick={() => handleStatusClick(item?._id, "completed")}
                                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                        >
                                          {t("setAsCompleted")}
                                        </button>
                                      </>
                                    ) : props.status.toLowerCase() === "completed" && roleOfUser === 0 ? (
                                      <>
                                        <button
                                          onClick={() => handleStatusClick(item?._id, "active")}
                                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                        >
                                          {t("setAsActive")}
                                        </button>
                                        <button
                                          onClick={() => handleStatusClick(item?._id, "inactive")}
                                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none popup"
                                        >
                                          {t("setAsInactive")}
                                        </button>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    ))
                  ) : (
                    <>
                      <div className="h-[200px] flex justify-center items-center">
                        <h1>{t("noProjectAvailable")}</h1>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center items-center mt-[2rem]">
            {visibleItems < props?.data?.length && (
              <>
                <fieldset className="bg-[#fff] text-[black] border-2 border-[#212121] flex justify-center items-center rounded-[5px] px-[20px] py-[10px] w-[150px] button-text">
                  {<button onClick={handleViewMore}>{t("viewAll")}</button>}
                </fieldset>
              </>
            )}
          </div>
          <div className="flex justify-center items-center mt-[2rem]">
            {visibleItems > 4 && (
              <>
                <fieldset className="bg-[#fff] text-[black] border-2 border-[#212121] flex justify-center items-center rounded-[5px] px-[20px] py-[10px] w-[150px] button-text">
                  {<button onClick={handleViewMore}>{t("viewLess")}</button>}
                </fieldset>
              </>
            )}
          </div>

          {showStatusModal && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-40">
              <div className="bg-white rounded-lg p-5 w-[90%] sm:w-auto">
                <p className="font-semibold">
                  {`Are you sure you want to move this project to ${_.startCase(selectedStatus)}?`}
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                    onClick={handleStatus}
                  >
                    Confirm
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
                    onClick={() => setShowStatusModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showConfirmationModal && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-40">
              <div className="bg-white rounded-lg p-5 w-[90%] sm:w-auto">
                <p className="font-semibold">Are you sure you want to delete this project?</p>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                    onClick={(event) => handleConfirmation(event, true)}
                  >
                    Confirm
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
                    onClick={(event) => handleConfirmation(event, false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default CurrentProject;