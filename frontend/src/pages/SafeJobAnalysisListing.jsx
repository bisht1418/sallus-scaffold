import React, { useState, useEffect } from "react";
import TopSection from "../components/forms/TopSection";
import { BsTrash3 } from "react-icons/bs";
import { MdOutlineMoreHoriz, MdOutlineEditNote } from "react-icons/md";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams, Link } from "react-router-dom";
import { getProjectByIdService, getProjectName } from "../Services/projectService";
import { toast } from "react-toastify";
import { clearCreateMaterialList } from "../Redux/Slice/materialListSlice";
import { store } from "../Redux/store";
import no_data from "../Assets/noData.svg";
import {
  deleteSafeJobAnalysis,
  getSafeJobAnalysisByProjectId,
} from "../Services/safeJobAnalysisService";
import { updateSafeJobAnalysis } from "../Services/observationService";
import { useSelector } from "react-redux";
import { t } from "../utils/translate";

const SafeJobAnalysisListing = () => {
  const { accessLevel: roleOfUser } = useSelector((state) => state?.project);
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const { projectId } = useParams();
  const [materialListingData, setMaterialListingData] = useState([]);
  const [projectNumber, setProjectNumber] = useState("");
  const [loading, setLoading] = useState();
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [visibleActiveItems, setVisibleActiveItems] = useState(3);
  const [visibleClosedItems, setVisibleClosedItems] = useState(3);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [isEditComment, setIsEditComment] = useState([]);
  const [activeSja, setActiveSja] = useState([]);
  const [closedSja, setClosedSja] = useState([]);
  store.dispatch(clearCreateMaterialList());
  const projectName = useSelector((store) => store?.project?.projectName);
  useEffect(() => {
    window.scrollTo(0, 0);
    getSafeJobAnalysisWithProjectId();
    getProjectDetailById(projectId);
  }, []);
  const getSafeJobAnalysisWithProjectId = async () => {
    try {
      setLoading(true);
      const response = await getSafeJobAnalysisByProjectId(projectId);
      setMaterialListingData(response?.data.filter((ele) => !ele?.isDeleted));
      const filterData = response?.data?.filter(
        (element, index) => !element?.isDeleted
      );
      const activeSJA = filterData?.filter(
        (ele, ind) => ele?.status === "active"
      );
      const closedSJA = filterData?.filter(
        (ele, ind) => ele?.status === "closed"
      );
      setActiveSja(activeSJA);
      setClosedSja(closedSJA);

      setIsEditComment(filterData?.map((ele, ind) => false));
    } catch (Error) {
      return Error;
    } finally {
      setLoading(false);
    }
  };

  async function getProjectDetailById(id) {
    try {
      const response = await getProjectByIdService(id);
      const projectNumber = response?.data?.project?.projectNumber;
      setProjectNumber(projectNumber);
    } catch (error) {
      return error;
    }
  }

  const handleAddCommentClick = (id) => {
    const updatedData = materialListingData?.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          isInputOpen: true,
        };
      } else {
        return item;
      }
    });
    setMaterialListingData(updatedData);
  };

  const handleSaveCommentClick = async (id, index) => {
    try {
      setIsSaveLoading(true);
      const data = materialListingData?.filter((item) => item._id === id);
      await updateSafeJobAnalysis(id, data[0]);
      getSafeJobAnalysisWithProjectId();
    } catch (error) {
      return error;
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleSelect = (id, value) => {
    const updatedData = materialListingData?.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          isSelected: value,
        };
      } else {
        return item;
      }
    });
    setMaterialListingData(updatedData);
  };

  function formatDateTime(dateTimeStr) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString("en-US", options);
  }

  const handleActiveViewMore = () => {
    setVisibleActiveItems((prevVisibleItems) => prevVisibleItems + 5);
  };

  const handleClosedViewMore = () => {
    setVisibleClosedItems((prevVisibleItems) => prevVisibleItems + 5);
  };

  const handleDelete = async (id) => {
    const response = await deleteSafeJobAnalysis(id);
    if (response.status === "success") {
      await getSafeJobAnalysisWithProjectId();
      toast.success(t("deletedSuccessfully"));
    } else {
      toast.error(t("thereIsSomeError"));
    }
  };

  const handleToggleDropdown = (index, event) => {
    const targetId = event.currentTarget.id;
    if (targetId == index) {
      setCurrentId(index);
      setDropdownVisible(!dropdownVisible);
    }
  };

  return (
    <div>
      <Header />
      <TopSection
        keys={projectId}
        title={t("safeJobAnalysis")}
        breadcrumData={[
          t("home"),
          projectName.toUpperCase(),
          t("safeJobAnalysis"),
        ]}
      />
      <div className="pb-[50px] border-b border-b-[#CCCCCC]">
        <div className="custom-container">
          <div className="flex flex-col lg:flex-row gap-[30px] items-center justify-between text-center">
            <p className="title-text">{t("projectSafeJOb")}</p>
            {(roleOfUser === 0 || roleOfUser === 1 || roleOfUser === 2) ? (
              <div className="relative">
                <Link
                  to={`/safe-job-analysis/${projectId}`}
                  className="bg-[#0072BB] botton-text rounded-[5px] px-[20px] py-[10px] text-white"
                >
                  {t("createSafeJobAnalysis")}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mb-[20px]">
        <div className="custom-container">
          {activeSja?.length > 0 && (
            <>
              <div className="flex justify-between items-center py-[50px] ">
                <p className="medium-title text-[#212121]">
                  {"Recent Active List"}
                </p>
                <div className="relative">
                  <div
                    className="flex justify-between rounded-[5px] items-center gap-[10px] lg:gap-[30px] px-[10px] py-[14px] bg-[white]"
                    style={{ border: "1px solid #ccc" }}
                  >
                    <p className="project-number leading-0">
                      {t("projectNumber")}
                    </p>
                    <input
                      className="medium-title leading-0 outline-none w-[125px]"
                      value={projectNumber}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="">
            <div className="w-[700px] lg:w-[1150px]">
              {activeSja?.length > 0 && (
                <>
                  <div className="flex items-center gap-[20px] w-full h-[40px]">
                    <div className=" h-[40px] flex justify-center items-center min-w-[50px] lg:min-w-[80px]"></div>
                    <div className=" h-[40px] flex justify-start items-center min-w-[250px] lg:min-w-[450px] px-[10px]">
                      <p className="service-description">
                        {t("analysisListName")}
                      </p>
                    </div>
                    <div className=" h-[40px] flex justify-center items-center min-w-[100px] lg:min-w-[180px]">
                      <p className="service-description">{t("lastEdit")}</p>
                    </div>
                    {/* <div className=" h-[40px] flex justify-center items-center min-w-[100px] lg:min-w-[180px]">
                      <p className="service-description">{t("members")}</p>
                    </div> */}
                    {
                      roleOfUser !== 2 && (
                        <div className=" h-[40px] flex justify-center items-center min-w-[50px] lg:min-w-[80px]">Actions</div>
                      )
                    }

                  </div>
                </>
              )}

              {loading ? (
                <div className="text-center flex justify-center gap-2">
                  <div className="mt-10 flex flex-col justify-center items-center">
                    <svg
                      aria-hidden="true"
                      class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                    <span className="text-xl font-bold text-[#0081c8]">
                      Loading...
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className=" border-t border-t-[#CCCCCC] w-full"></div>
                  {activeSja?.length > 0 ? (
                    <>
                      {materialListingData
                        ?.slice(0, visibleActiveItems)
                        ?.map((item, index) => (
                          <div className="flex items-start gap-[20px] w-full my-[30px]">
                            <div className="h-[40px] flex justify-center items-center min-w-[50px] lg:min-w-[80px]">
                              <input
                                onChange={(e) => {
                                  handleSelect(item._id, e.target.checked);
                                }}
                                type="checkbox"
                              />
                            </div>
                            <div className="flex flex-col justify-start min-w-[250px] lg:min-w-[450px] px-[10px]">
                              <div className="h-[40px] flex items-center">
                                <Link
                                  to={`/edit-safe-job-analysis/${projectId}/${item?._id}`}
                                >
                                  <p className="service-description">
                                    {item?.projectDetail?.safeJobAnalysisName}
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
                                  {isEditComment[index] || item?.comments ? (
                                    <>
                                      <MdOutlineEditNote
                                        color="#0072BB"
                                        size={25}
                                      />
                                      {item.isInputOpen
                                        ? t("commenting")
                                        : isEditComment[index] || item?.comments
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
                                        : isEditComment[index] || item?.comments
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
                                          materialListingData?.map(
                                            (ele, ind) => {
                                              if (ele._id === item._id) {
                                                return {
                                                  ...ele,
                                                  comments: e.target.value,
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
                                      {isSaveLoading && currentId === item?._id
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
                            {/* <div className="h-[40px] flex justify-center items-center min-w-[100px] lg:min-w-[180px]">
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
                            </div> */}
                            {
                              roleOfUser !== 2 && (
                                <div className="h-[40px] flex justify-center items-center min-w-[50px] lg:min-w-[80px] relative z-[1]">
                                  <button>
                                    {item.isSelected ? (
                                      <BsTrash3
                                        id={index}
                                        onClick={() => handleDelete(item?._id)}
                                        color="#FF4954"
                                        size={20}
                                      />
                                    ) : (
                                      <>
                                        <MdOutlineMoreHoriz
                                          id={index}
                                          onClick={(event) =>
                                            handleToggleDropdown(index, event)
                                          }
                                          size={20}
                                        />
                                        {dropdownVisible && currentId === index && (
                                          <div className="absolute top-[0px] right-[50px] z-99999 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                            {roleOfUser === 0 && (
                                              <button
                                                onClick={() =>
                                                  handleDelete(item._id)
                                                }
                                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
                                              >
                                                {t("delete")}
                                              </button>
                                            )}

                                            {roleOfUser === 0 ||
                                              roleOfUser === 1 ? (
                                              <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none">
                                                <Link
                                                  to={`/edit-safe-job-analysis/${projectId}/${item?._id}`}
                                                >
                                                  {t("edit")}
                                                </Link>
                                              </button>
                                            ) : null}
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </button>
                                </div>
                              )
                            }

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
          <div className="pt-[30px] flex justify-center mb-5">
            {visibleActiveItems < activeSja?.length && (
              <button
                onClick={handleActiveViewMore}
                className="border border-[black] rounded-[5px] px-[20px] py-[10px] button-text"
              >
                {t("ViewMore")}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto">
        <div className="custom-container h-50 ">
          {closedSja?.length > 0 && (
            <>
              <div className="flex justify-between items-center py-[50px]">
                <p className="medium-title text-[red]">
                  {"Recent Closed List"}
                </p>
                <div className="relative">
                  <div
                    className="flex justify-between rounded-[5px] items-center gap-[10px] lg:gap-[30px] px-[10px] py-[14px] bg-[white]"
                    style={{ border: "1px solid #ccc" }}
                  >
                    <p className="project-number leading-0">
                      {t("projectNumber")}
                    </p>
                    <input
                      className="medium-title leading-0 outline-none w-[125px]"
                      value={projectNumber}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="">
            <div className="w-[700px] lg:w-[1150px]">
              {closedSja?.length > 0 && (
                <>
                  <div className="flex items-center gap-[20px] w-full h-[40px]">
                    <div className=" h-[40px] flex justify-center items-center min-w-[50px] lg:min-w-[80px]"></div>
                    <div className=" h-[40px] flex justify-start items-center min-w-[250px] lg:min-w-[450px] px-[10px]">
                      <p className="service-description">
                        {t("analysisListName")}
                      </p>
                    </div>
                    <div className=" h-[40px] flex justify-center items-center min-w-[100px] lg:min-w-[180px]">
                      <p className="service-description">{t("lastEdit")}</p>
                    </div>
                    <div className=" h-[40px] flex justify-center items-center min-w-[100px] lg:min-w-[180px]">
                      <p className="service-description">{t("members")}</p>
                    </div>
                    <div className=" h-[40px] flex justify-center items-center min-w-[50px] lg:min-w-[80px]"></div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="pt-[30px] flex justify-center">
            {visibleClosedItems < closedSja?.length && (
              <button
                onClick={handleClosedViewMore}
                className="border border-[black] rounded-[5px] px-[20px] py-[10px] button-text"
              >
                {t("ViewMore")}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SafeJobAnalysisListing;
