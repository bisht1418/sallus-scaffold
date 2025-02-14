import React, { useEffect, useState } from "react";
import TopSection from "../../components/forms/TopSection";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { t } from "../../utils/translate";
import { GoSearch } from "react-icons/go";
import { IoFilter } from "react-icons/io5";
import {
  deleteAfterControlFormService,
  getAfterControlFormByProjectService,
} from "../../Services/afterControlFormService";
import { MdDeleteOutline } from "react-icons/md";
import { CgEye } from "react-icons/cg";
import { toast } from "react-toastify";
import Pagination from "../../Admin/Components/Pagination";

const AfterControlFormListingPage = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const userId = useSelector((state) => state?.auth?.loggedInUser?._id);
  const type = useSelector((state) => state?.auth?.loggedInUser?.type);
  const { id: projectId } = useParams();
  const [afterControlFormList, setAfterControlList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [operationType, setOperationType] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAfterControlByProjectIdApi(projectId);
  }, []);

  const getAfterControlByProjectIdApi = async (projectId) => {
    try {
      setIsLoading(true);
      const afterControlResponse = await getAfterControlFormByProjectService(
        projectId
      );
      const checkDeleteData = afterControlResponse?.data
        ?.filter((ele) => !ele?.isDeleted)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setAfterControlList(checkDeleteData);
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  function formatDateString(isoString) {
    const date = new Date(isoString);

    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const formattedDate = date.toLocaleDateString("en-GB", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-GB", timeOptions);

    return `${formattedDate}, ${formattedTime}`;
  }

  const handleOperation = (item, type) => {
    setCurrentItem(item);
    setOperationType(type);
    setIsConfirmationModalOpen(true);
  };

  const handleCancelOperation = () => {
    setIsConfirmationModalOpen(false);
    setCurrentItem(null);
    setOperationType(null);
  };
  const handleConfirmationOperation = async () => {
    setDeleteLoading(true);
    try {
      if (operationType === "delete" && currentItem) {
        const deleteResponse = await deleteAfterControlFormService(
          currentItem?._id
        );

        if (deleteResponse?.status) {
          toast.success(deleteResponse?.message);
          getAfterControlByProjectIdApi(projectId);
        } else {
          toast.error(deleteResponse?.message);
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast("Something went wrong");
    } finally {
      setIsLoading(false);
      setIsConfirmationModalOpen(false);
      setCurrentItem(null);
      setOperationType(null);
    }
  };

  function countInspectionValues(data) {
    const inspectionCounts = {
      NA: 0,
      no: 0,
      yes: 0,
      null: 0,
      totalCount: 0,
    };
    data.afterControl.forEach((afterControlItem) => {
      afterControlItem.visual.forEach((document) => {
        switch (document.inspection) {
          case "NA":
            inspectionCounts.NA++;
            break;
          case "no":
            inspectionCounts.no++;
            break;
          case "yes":
            inspectionCounts.yes++;
            break;
          case null:
            inspectionCounts.null++;
            break;
          default:
            break;
        }
        inspectionCounts.totalCount++;
      });
    });

    return inspectionCounts;
  }
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(afterControlFormList?.length / ITEMS_PER_PAGE);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const paginatedData = afterControlFormList?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  let debounceTimer;

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      delayedAPICall(searchTerm);
    } else {
      getAfterControlByProjectIdApi(projectId);
    }

    if (!searchTerm) {
      setSearchLoading(false);
    }

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const delayedAPICall = (term) => {
    setSearchLoading(true);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        let responseSearch = afterControlFormList.filter((control) => {
          const searchTerm = term.toLowerCase();

          const controlName = control?.controlName
            ?.toLowerCase()
            .includes(searchTerm);

          return controlName;
        });

        if (!responseSearch) {
          responseSearch = [];
        }
        const searchData = responseSearch || [];
        setAfterControlList(searchData);
        setCurrentPage(1);
      } catch (error) {
        setSearchLoading(false);
      } finally {
        setSearchLoading(false);
      }
    }, 1000);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  return (
    <div>
      <Header />
      <TopSection
        keys={projectId}
        title={t("afterControlForm")}
        breadcrumData={[t("home"), t("hero-button_02"), t("afterControlForm")]}
      />
      <div className="pb-[50px] border-b border-b-[#CCCCCC]">
        <div className="custom-container">
          <div className="flex flex-col lg:flex-row gap-[30px] lg:items-center justify-between text-center">
            <p className="title-text">{t("afterControlForm")}</p>
            <div className="flex items-center gap-5 justify-between w-full lg:w-auto flex-col sm:flex-row">
              {
                type !== 2 && (
                  <div className="relative w-full sm:w-auto text-right sm:text-left">
                  <Link to={`/control-form-after/${projectId}`}>
                    <button className="bg-[#0072BB] botton-text rounded-[5px] px-[20px] py-[10px] text-white">
                      {t("createAfterControlForm")}
                    </button>
                  </Link>
                </div>
                )
              }
          
            </div>
          </div>
        </div>
        <div className="custom-container !mt-3">
          <div className=" relative w-full">
            <GoSearch
              className="absolute top-[50%] left-[10px] translate-y-[-50%]"
              size={24}
              color="#000000"
            />
            <input
              onChange={(e) => handleSearch(e)}
              className="border border-[#CCCCCC] "
              placeholder={"search after control list"}
              type="text"
            />
            <button>
              <IoFilter
                className="absolute top-[50%] right-[50px] translate-y-[-50%]"
                size={24}
                color="#000000"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="custom-container">
        <div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <p className="text-sm font-bold my-3">
              {t("after_control_form_list")}
            </p>
            <table className="w-full text-sm text-left rtl:text-right ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    {t("control_name")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t("status")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t("created_at")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t("updated_at")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">{t("edit")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchLoading || isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10">
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
                      <h1 className="font-bold mt-3">Loading...</h1>
                    </td>
                  </tr>
                ) : paginatedData?.length > 0 ? (
                  paginatedData?.map((item, index) => (
                    <tr
                      className={`h-2.5 w-2.5 rounded-full border-b cursor-pointer ${
                        countInspectionValues(item).no
                          ? "bg-red-200 hover:bg-red-300"
                          : countInspectionValues(item).null
                          ? "bg-orange-200 hover:bg-orange-300"
                          : "bg-green-200 hover:bg-green-300"
                      }`}
                    >
                      {console.log(
                        "countInspectionValues(item)",
                        countInspectionValues(item)
                      )}
                      {console.log("item(item)", item)}
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap uppercase"
                      >
                        <Link
                          to={`/edit-control-form-after/${projectId}/${item?._id}`}
                        >
                          <div className="flex flex-col !text-sm">
                            <div className="">
                              {item?.controlName || "control name"}
                            </div>
                            <div>{item?.signature?.approver?.name}</div>
                          </div>
                        </Link>
                      </th>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`h-2.5 w-2.5 rounded-full bg-${
                              countInspectionValues(item).no
                                ? "red"
                                : countInspectionValues(item).null
                                ? "orange"
                                : "green"
                            }-500 me-2`}
                          ></div>{" "}
                          {countInspectionValues(item).no
                            ? "Action Needed"
                            : countInspectionValues(item).null
                            ? "Review"
                            : "Completed"}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono">
                        {formatDateString(item?.createdAt)}
                      </td>
                      <td className="px-6 py-4  font-mono">
                        {formatDateString(item?.updatedAt)}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-center items-center gap-4">
                        <Link
                          to={`/edit-control-form-after/${projectId}/${item?._id}`}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          <CgEye className="text-2xl " />
                        </Link>
                        {
                          type !== 2 &&  (
                            <div>
                            <MdDeleteOutline
                              className="text-2xl text-red-600 cursor-pointer"
                              onClick={() => handleOperation(item, "delete")}
                            />
                          </div>
                          )
                        }
                    
                      </td>
                    </tr>
                  ))
                ) : (
                  <div className="flex font-semibold text-md  p-4">
                    No Data Found...
                  </div>
                )}
              </tbody>
            </table>
            <div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageInfo={"afterControlListing"}
              />
            </div>
          </div>
        </div>
      </div>
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg font-bold">
            <p>Are you sure you want to {operationType} this item?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-400 text-white px-4 py-2 mr-2 rounded hover:bg-red-600 font-bold"
                onClick={handleConfirmationOperation}
              >
                {deleteLoading ? "Loading" : "Confirm"}
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleCancelOperation}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AfterControlFormListingPage;
