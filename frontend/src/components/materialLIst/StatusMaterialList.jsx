import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import { BsTrash3 } from "react-icons/bs";
import { MdOutlineMoreHoriz, MdOutlineEditNote } from "react-icons/md";
import { PiNote } from "react-icons/pi";
import { t } from "../../utils/translate";
import no_data from "../../Assets/noData.svg";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";

import _ from "lodash";
const StatusMaterialList = ({
  materialListingData,
  projectNumber,
  loading,
  visibleItems,
  handleSelect,
  isEditComment,
  handleAddCommentClick,
  roleOfUser,
  projectId,
  handleViewMore,
  handleDelete,
  currentId,
  dropdownVisible,
  formatDateTime,
  handleToggleDropdown,
  isSaveLoading,
  setMaterialListingData,
  setCurrentId,
  handleSaveCommentClick,
  isStatus,
  status,
  handleStatus,
  handleTransfer,
  setDropdownVisible,
}) => {
  const navigate = useNavigate();
  const handelClick = (id, pId) => {
    navigate(`/edit-material-list/${pId}/${id}`);
  };

  console.log("materialListingData", materialListingData)

  return (
    <>
      <div className="custom-container relative">
        {materialListingData?.length > 0 && (
          <>
            <div className="flex justify-between items-center py-[50px] ">
              {status === "Latest Material Lists" ? (
                <div className="flex sm:flex-row flex-col  sm:items-center items-start sm:justify-between justify-start gap-2 w-full">
                  <p
                    className="!text-2xl font-semibold !text-[#0081c8]"
                    style={{
                      color: "#212121",
                    }}
                  >
                    {" "}
                    {t("LatestMaterialLists")}
                  </p>
                  <div className="">
                    <div
                      className="flex justify-between rounded-[5px] items-center gap-[10px] lg:gap-[30px] px-[10px] py-[8px] bg-[white]"
                      style={{ border: "1px solid #ccc" }}
                    >
                      <p className="project-number leading-0">
                        {t("projectNumber")}
                      </p>
                      {!projectNumber ? (
                        <>
                          <div
                            class="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                            role="status"
                            aria-label="loading"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </>
                      ) : (
                        <input
                          className="medium-title leading-0 outline-none w-[125px]"
                          disabled
                          value={projectNumber || "No Number"}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : status === "Under Progess Material Lists" ? (
                <>
                  <p
                    className="medium-title"
                    style={{
                      color: "#212121",
                    }}
                  >
                    {t("UnderProgessMaterialLists")}
                  </p>
                </>
              ) : status === "closed Material Lists" ? (
                <>
                  <p
                    className="medium-title"
                    style={{
                      color: "#212121",
                    }}
                  >
                    {t("closedMaterialLists")}
                  </p>
                </>
              ) : null}
            </div>
          </>
        )}

        <div className="">
          <div className="w-full">
            {loading ? (
              <div className="text-center flex justify-center  h-[50vh]">
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
                {materialListingData?.length > 0 ? (
                  <>
                    <div className="flex flex-col">
                      <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                          <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                              <thead>
                                <tr>
                                  <th>{t("materialListName")}</th>
                                  <th> {t("lastEdit")}</th>
                                  {
                                    roleOfUser !== 2 &&
                                    <th>{t("actions")}</th>

                                  }

                                </tr>
                              </thead>
                              <tbody>
                                {materialListingData
                                  .slice(0, visibleItems)
                                  .map((item, index) => (
                                    <tr className="odd:bg-white even:bg-gray-100 dark:odd:bg-white odd:hover:bg-blue-200 even:hover:bg-blue-200 transition-colors duration-200 ease-in-out">

                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                                        <div className="">
                                          <p
                                            className="service-description"
                                            onClick={() =>
                                              handelClick(item?._id, projectId)
                                            }
                                            style={{ cursor: "pointer" }}
                                          >
                                            {_.startCase(
                                              _.toLower(item?.materialListName)
                                            )}
                                          </p>
                                        </div>
                                        <div className="">
                                          <button
                                            className={`${isEditComment[index] ||
                                              item?.comments
                                              ? "text-[#0072BB] bg-[#e5f1f8] border-[#e5f1f8]"
                                              : "#000000"
                                              }  flex flex-row gap-[10px] items-center border-[1px] border-[#CCCCCC] px-[10px] rounded-[5px] copyright-text max-w-[157px]`}
                                            onClick={() => {
                                              handleAddCommentClick(item?._id);
                                            }}
                                          >
                                            {isEditComment[index] ||
                                              item?.comments ? (
                                              <>
                                                <MdOutlineEditNote
                                                  color="#0072BB"
                                                  size={25}
                                                />
                                                {item.isInputOpen
                                                  ? t("commenting")
                                                  : isEditComment[index] ||
                                                    item?.comments
                                                    ? t("editComment")
                                                    : t("addComment")}
                                              </>
                                            ) : (
                                              <>
                                                <MdOutlineEditNote
                                                  color="#3f3f3f"
                                                  size={25}
                                                />
                                                {item.isInputOpen
                                                  ? t("addComment")
                                                  : isEditComment[index] ||
                                                    item?.comments
                                                    ? t("editComment")
                                                    : t("addComment")}
                                              </>
                                            )}
                                          </button>
                                          {item.isInputOpen && (
                                            <div
                                              className={`flex flex-col mt-[10px] gap-[1rem] leading-[28px] text-[12px] font-[400] `}
                                            >
                                              <textarea
                                                onChange={(e) => {
                                                  const updatedMaterialListingData =
                                                    materialListingData.map(
                                                      (ele, ind) => {
                                                        if (
                                                          ele._id === item._id
                                                        ) {
                                                          return {
                                                            ...ele,
                                                            comments:
                                                              e.target.value,
                                                          };
                                                        } else {
                                                          return ele;
                                                        }
                                                      }
                                                    );
                                                  setMaterialListingData(
                                                    updatedMaterialListingData
                                                  );
                                                }}
                                                id="message"
                                                type="text"
                                                rows="2"
                                                className="p-[10px] border border-[#CCCCCC] copyright-text rounded-[5px] outline-none"
                                                placeholder="Write your comments here"
                                              >
                                                {item?.comments}
                                              </textarea>
                                              <button
                                                onClick={() => {
                                                  setCurrentId(item?._id);
                                                  handleSaveCommentClick(
                                                    item?._id,
                                                    index
                                                  );
                                                }}
                                                className="button-text  bg-[#0072BB] flex justify-center items-center align-middle w-[100px] text-[white] px-[10px] py-[5px] rounded-[5px]"
                                              >
                                                {isSaveLoading &&
                                                  currentId == item?._id
                                                  ? t("loading")
                                                  : t("save")}
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </td>

                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                                        <div className="h-[40px] flex justify-center items-center min-w-[100px] lg:min-w-[180px]">
                                          <p className="service-description">
                                            {formatDateTime(item?.updatedAt)}
                                          </p>
                                        </div>
                                      </td>

                                      {
                                        roleOfUser !== 2 && (
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                                            <div className="h-[40px] flex justify-center items-center min-w-[50px] lg:min-w-[80px]  z-[1]">
                                              <button>
                                                {item.isSelected ? (
                                                  <BsTrash3
                                                    id={index}
                                                    onClick={() =>
                                                      handleDelete(item?._id)
                                                    }
                                                    color="#FF4954"
                                                    size={20}
                                                  />
                                                ) : (
                                                  <>
                                                    {currentId == index ? (
                                                      <>
                                                        {!dropdownVisible ? (
                                                          <MdOutlineMoreHoriz
                                                            id={index}
                                                            onClick={(event) =>
                                                              handleToggleDropdown(
                                                                index,
                                                                event,
                                                                item?.status
                                                              )
                                                            }
                                                            size={20}
                                                          />
                                                        ) : (
                                                          <MdOutlineCancel
                                                            id={index}
                                                            onClick={(event) =>
                                                              handleToggleDropdown(
                                                                index,
                                                                event,
                                                                item?.status
                                                              )
                                                            }
                                                            size={20}
                                                          />
                                                        )}
                                                      </>
                                                    ) : (
                                                      <MdOutlineMoreHoriz
                                                        id={index}
                                                        onClick={(event) =>
                                                          handleToggleDropdown(
                                                            index,
                                                            event,
                                                            item?.status
                                                          )
                                                        }
                                                        size={20}
                                                      />
                                                    )}

                                                    {dropdownVisible &&
                                                      currentId == index &&
                                                      item?.status === isStatus && (
                                                        <div
                                                          className={`absolute top-[${70 + currentId
                                                            }%] lg:right-[9%] md:right-[12%] right-[17%] z-99999 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50`}
                                                        >
                                                          <>
                                                            {roleOfUser === 0 && (
                                                              <button
                                                                onClick={() =>
                                                                  handleDelete(
                                                                    item._id
                                                                  )
                                                                }
                                                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none "
                                                              >
                                                                {t("delete")}
                                                              </button>
                                                            )}

                                                            {roleOfUser === 0 ||
                                                              roleOfUser === 1 ? (
                                                              <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none">
                                                                <Link
                                                                  to={`/edit-material-list/${projectId}/${item?._id}`}
                                                                >
                                                                  {t("edit")}
                                                                </Link>
                                                              </button>
                                                            ) : null}
                                                            {roleOfUser === 0 &&
                                                              status !==
                                                              "Latest Material Lists" && (
                                                                <>
                                                                  <button
                                                                    onClick={() =>
                                                                      handleStatus(
                                                                        item._id,
                                                                        "latest"
                                                                      )
                                                                    }
                                                                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
                                                                  >
                                                                    {t(
                                                                      "LatestMaterialLists"
                                                                    )}
                                                                  </button>
                                                                </>
                                                              )}

                                                            {roleOfUser === 0 &&
                                                              status !==
                                                              "Under Progess Material Lists" && (
                                                                <>
                                                                  <button
                                                                    onClick={() =>
                                                                      handleStatus(
                                                                        item._id,
                                                                        "under"
                                                                      )
                                                                    }
                                                                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
                                                                  >
                                                                    {t(
                                                                      "UnderProgessMaterialLists"
                                                                    )}
                                                                  </button>
                                                                </>
                                                              )}
                                                            {roleOfUser === 0 &&
                                                              status !==
                                                              "closed Material Lists" && (
                                                                <>
                                                                  <button
                                                                    onClick={() =>
                                                                      handleStatus(
                                                                        item._id,
                                                                        "closed"
                                                                      )
                                                                    }
                                                                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
                                                                  >
                                                                    {t(
                                                                      "closedMaterialLists"
                                                                    )}
                                                                  </button>
                                                                </>
                                                              )}
                                                            {roleOfUser === 0 ||
                                                              roleOfUser === 1 ? (
                                                              <button
                                                                onClick={() => {
                                                                  handleTransfer(
                                                                    item
                                                                  );
                                                                  setDropdownVisible(
                                                                    false
                                                                  );
                                                                }}
                                                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
                                                              >
                                                                {"Transfer"}
                                                              </button>
                                                            ) : null}
                                                          </>
                                                        </div>
                                                      )}
                                                  </>
                                                )}
                                              </button>
                                            </div>
                                          </td>
                                        )
                                      }


                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center items-center mt-[10px]">
                      <img
                        src={no_data}
                        alt="no data found"
                        className="w-[70%]"
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="pt-[30px] flex justify-center">
        {visibleItems < materialListingData?.length && (
          <button
            onClick={() => handleViewMore(materialListingData[0]?.status)}
            className="border border-[black] rounded-[5px] px-[20px] py-[10px] button-text"
          >
            {t("ViewMore")}
          </button>
        )}
      </div>
    </>
  );
};

export default StatusMaterialList;
