import React from "react";
import { t } from "../../utils/translate";
import { MdOutlineMoreHoriz, MdOutlineEditNote } from "react-icons/md";
import { BsTrash3 } from "react-icons/bs";
import { Link } from "react-router-dom";
import no_data from "../../Assets/noData.svg";
const ObservationStatus = ({
  observationData,
  loading,
  filteredDataLatest,
  currentId,
  handleStatus,
  handleAddCommentClick,
  handleDelete,
  handleSaveCommentClick,
  handleSelect,
  isEditComment,
  setObservationData,
  roleOfUser,
  setCurrentId,
  dropdownVisible,
  isSaveLoading,
  visibleItems,
  formatDateTime,
  handleToggleDropdown,
  status,
  isStatus,
  handleEdit,
  handleViewMore,
  projectId,
  id,
}) => {

  return (
    <>
      <div className="custom-container h-full">
        {roleOfUser === 0 ? (
          <>
            {observationData?.length > 0 && (
              <>
                <div className={`flex justify-between items-center py-[20px] font-bold text-sm sm:text-2xl ${status === "Observation Need Action" ? "text-red-600" : status === "Observation Under Control" ? "text-yellow-600" : "text-green-600"}`}>
                  <p className="underline">
                    {status === "Observation Need Action" ? (
                      <>{t("observationNeedAction")}</>
                    ) : status === "Observation Under Control" ? (
                      <>{t("observationUnderControl")}</>
                    ) : status === "Observation Completed" ? (
                      <>{t("observationCompleted")}</>
                    ) : null}
                  </p>

                  <div className="relative">

                  </div>
                </div>

                <div className="w-full h-full overflow-auto">
                  <div className="w-[700px] lg:w-[1150px]">
                    {observationData?.length > 0 && (
                      <>
                        <div className="flex items-center gap-[20px] w-full">
                          <div className=" h-[40px] flex justify-center items-center min-w-[50px] lg:min-w-[80px]"></div>
                          <div className=" h-[40px] flex justify-start items-center min-w-[250px] lg:min-w-[450px] px-[10px] ">
                            <p className=" !font-bold uppercase !text-xs sm:!text-[16px] ">
                              {t("analysisListName")}
                            </p>
                          </div>
                          <div className=" h-[40px] flex justify-center  items-center min-w-[100px] lg:min-w-[180px]">
                            <p className=" !font-bold uppercase !text-xs sm:!text-[16px] ">
                              {t("lastEdit")}
                            </p>
                          </div>
                          <div className=" h-[40px] flex justify-center items-center min-w-[100px] lg:min-w-[180px]">
                            <p className=" !font-bold uppercase !text-xs sm:!text-[16px] ">
                              {t("members")}
                            </p>
                          </div>
                          <div className=" h-[40px] flex justify-center items-center min-w-[50px] lg:min-w-[80px]"></div>
                        </div>
                      </>
                    )}

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
                        <div className=" border-t border-t-[#CCCCCC] w-full overflow-auto"></div>
                        {filteredDataLatest?.length > 0 ? (
                          <>
                            {filteredDataLatest
                              .slice(0, visibleItems)
                              .map((item, index) => (
                                <div className={`flex items-start gap-[20px] w-full mt-2 ${status === "Observation Need Action" ? "hover:bg-red-50" : status === "Observation Under Control" ? "hover:bg-yellow-50" : "hover:bg-green-50"} rounded-md cursor-pointer shadow py-2 transition-all duration-500 ease-in-out `}>
                                  <div className="h-[40px] flex justify-center items-center min-w-[50px] lg:min-w-[80px]">
                                    <input
                                      onChange={(e) => {
                                        handleSelect(
                                          item?._id,
                                          e.target.checked
                                        );
                                      }}
                                      type="checkbox"
                                    />
                                  </div>
                                  <div className="flex flex-col justify-start min-w-[250px] lg:min-w-[450px] px-[10px]">
                                    <div className="h-[40px] flex items-center">
                                      <Link
                                        to={`/edit-Observation-listing/${projectId}/${item?._id}`}
                                      >
                                        <p className="service-description">
                                          {
                                            item?.observerDetails
                                              ?.observerDetail
                                          }
                                        </p>
                                      </Link>
                                    </div>
                                    <div className="mt-[5px] flex flex-col gap-[10px]">
                                      <button
                                        className={`${isEditComment[index] || item?.comments
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
                                                observationData.map(
                                                  (ele, ind) => {
                                                    if (ele._id === item._id) {
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
                                              setObservationData(
                                                updatedMaterialListingData
                                              );
                                            }}
                                            id="message"
                                            type="text"
                                            rows="2"
                                            className="p-[10px] border border-[#CCCCCC] copyright-text rounded-[5px] outline-none"
                                            placeholder={t("writeYour")}
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
                                  </div>
                                  <div className="h-[40px] flex justify-center items-center min-w-[100px] lg:min-w-[180px]">
                                    <p className="service-description">
                                      {formatDateTime(item?.updatedAt)}
                                    </p>
                                  </div>
                                  <div className="h-[40px] flex justify-center items-center min-w-[100px] lg:min-w-[180px]">
                                    <div className="flex relative w-[55px] m-auto">
                                      <div className="z-[1]">
                                        <img
                                          className="h-[30px]"
                                          src="/person-icon2.svg"
                                          alt=""
                                        />
                                      </div>
                                      <div className="rounded-[100%] absolute z-[0] top-0 right-0">
                                        <div className="relative">
                                          <img
                                            className="!h-[30px] z-0"
                                            src="/person-icon2.svg"
                                            alt=""
                                          />
                                          <div className="bg-[#0073bb6c] absolute z-[1] h-full w-full top-0 left-0 rounded-[100%] flex items-center justify-center">
                                            <p className="text-white text-[11px] font-[700]">
                                              + 1
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="h-[40px] flex justify-center items-center min-w-[50px] lg:min-w-[80px] relative z-[1]">
                                    <button>
                                      {item.isSelected ? (
                                        <BsTrash3
                                          id={index}
                                          color="#FF4954"
                                          size={20}
                                        />
                                      ) : (
                                        <>
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
                                          {dropdownVisible &&
                                            currentId == index &&
                                            item?.status === isStatus && (
                                              <div className="absolute top-[0px] right-[50px] z-99999 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                                {roleOfUser === 0 && (
                                                  <>
                                                    <button
                                                      onClick={() =>
                                                        handleDelete(item._id)
                                                      }
                                                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
                                                    >
                                                      {t("delete")}
                                                    </button>
                                                    <button
                                                      onClick={() =>
                                                        handleEdit(item._id)
                                                      }
                                                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
                                                    >
                                                      {t("edit")}
                                                    </button>

                                                    {status !==
                                                      "Observation Need Action" && (
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
                                                              "NeedAction"
                                                            )}
                                                          </button>
                                                        </>
                                                      )}
                                                    {status !==
                                                      "Observation Under Control" && (
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
                                                            {t("UnderControl")}
                                                          </button>
                                                        </>
                                                      )}
                                                    {status !==
                                                      "Observation Completed" && (
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
                                                              "observationCompleted"
                                                            )}
                                                          </button>
                                                        </>
                                                      )}
                                                  </>
                                                )}
                                              </div>
                                            )}
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              ))}
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
              </>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-center items-center mt-[10px]">
              <p className="text-[20px] font-[600] text-[red] mt-10">
                {"You are not Authorised to view Observation lists".toUpperCase()}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="pt-[30px] flex justify-center">
        {visibleItems < filteredDataLatest?.length && (
          <button
            onClick={() => handleViewMore(filteredDataLatest[0]?.status)}
            className="border border-[black] rounded-[5px] px-[20px] py-[10px] button-text"
          >
            {t("ViewMore")}
          </button>
        )}
      </div>
    </>
  );
};

export default ObservationStatus;
