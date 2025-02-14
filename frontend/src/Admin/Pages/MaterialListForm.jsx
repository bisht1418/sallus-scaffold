import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import { FaRegEye } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";
import { MdOutlineDelete } from "react-icons/md";
import Pagination from "../Components/Pagination";
import {
  deleteUser,
  getAllUsersService,
} from "../../Services/AdminService/userService";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllFormService,
  getMaterialListByUserId,
} from "../../Services/AdminService/allFormsService";
import { useSelector } from "react-redux";
import { deleteMaterialListWithProjectService } from "../../Services/materialListWithProjectService";

const noDataImage = require("../../Assets/no_data_found.webp");

const MaterialListForms = () => {
  return (
    <div>
      <AdminDashboard data={MaterialListFormProps} />
    </div>
  );
};

const MaterialListFormProps = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [forms, setForms] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [operationType, setOperationType] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isAdminId = useSelector((state) => state?.admin?.loggedInAdmin?._id);

  useEffect(() => {
    getAllForms();
  }, []);

  const getAllForms = async () => {
    try {
      setIsLoading(true);

      if (isAdminId) {
        const responseData = await getMaterialListByUserId(isAdminId);
        const getAllUsersResponse = responseData?.data;

        const materialListWithProjects = getAllUsersResponse?.filter(
          (ele) => !ele?.isDeleted
        );

        const allForms = [...materialListWithProjects] || [];
        setForms(allForms);
      } else {
        const responseData = await getAllFormService();
        const getAllUsersResponse = responseData?.data;

        const materialListWithProjects =
          getAllUsersResponse?.materialListWithProjects;

        const allForms = [...materialListWithProjects] || [];
        setForms(allForms);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(forms?.length / ITEMS_PER_PAGE);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const paginatedData = forms?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOperation = (item, type) => {
    setCurrentItem(item);
    setOperationType(type);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmationOperation = async () => {
    setIsLoading(true);
    try {
      if (operationType === "delete" && currentItem) {
        console.log("currentItem", currentItem);

        const deleteResponse = await deleteMaterialListWithProjectService(
          currentItem?._id
        );

        console.log("deleteResponse", deleteResponse);

        if (deleteResponse.status) {
          toast("Form deleted successfully");
          await getAllForms();
        } else {
          toast("Something went wrong");
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

  const handleCancelOperation = () => {
    setIsConfirmationModalOpen(false);
    setCurrentItem(null);
    setOperationType(null);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  let debounceTimer;

  const delayedAPICall = (term) => {
    setSearchLoading(true);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        let responseSearch = forms.filter((form) => {
          const searchTerm = term.toLowerCase();
          let nameMatch;
          let emailMatch;
          let phoneMatch;
          let projectNumber;
          let projectName;

          if (form.isMaterialListForm) {
            nameMatch = form?.materialListName
              .toLowerCase()
              .includes(searchTerm);
            projectNumber = form?.projectId?.projectNumber
              .toLowerCase()
              .includes(searchTerm);
            projectName = form?.projectName
              ?.toLowerCase()
              ?.includes(searchTerm);
          }
          return (
            nameMatch ||
            emailMatch ||
            phoneMatch ||
            projectNumber ||
            projectName
          );
        });

        if (!responseSearch) {
          responseSearch = [];
        }
        const searchData = responseSearch || [];
        setForms(searchData);
        setCurrentPage(1);
      } catch (error) {
        setSearchLoading(false);
      } finally {
        setSearchLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      delayedAPICall(searchTerm);
    } else {
      getAllForms();
    }

    if (!searchTerm) {
      setSearchLoading(false);
    }

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
  }

  return (
    <div className="p-4 mt-5 mb-10">
      <p className="text-xl font-bold text-gray-600 uppercase">Material List</p>
      <div className="flex w-full items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white">
        <div className="relative w-full">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            onChange={(e) => handleSearch(e)}
            type="text"
            id="table-search-forms"
            className="block font-semibold  ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-1/2 bg-gray-50"
            placeholder="Search for forms"
          />
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Form Type
              </th>
              <th scope="col" className="px-6 py-3">
                status
              </th>{" "}
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          {searchLoading || isLoading ? (
            <div className="flex-col gap-3 justify-center items-center fixed inset-0 flex bg-gray-500 bg-opacity-0">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
              <span className="font-bold text-sm">Loading...</span>
            </div>
          ) : (
            <tbody className="overflow-auto">
              {paginatedData?.length > 0 ? (
                paginatedData?.map((item, index) => (
                  <tr className="bg-white border-b ">
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap className:text-white"
                    >
                      {/* <img className="w-10 h-10 rounded-full" src={item?.imgSrc} alt={item?.name} /> */}
                      {/* <img
                      className="w-10 h-10 rounded-full"
                      src={
                        "https://cdn.pixabay.com/photo/2014/03/25/16/32/user-297330_640.png"
                      }
                      alt={item?.name}
                    /> */}
                      <div className="ps-3">
                        <div className="text-base font-semibold">
                          {item?.isApprovalForm
                            ? item?.scaffoldName[0]?.value
                            : item?.isObservationForm
                            ? item?.observerDetails?.observerDetail
                            : item?.isSJAForm
                            ? item?.projectDetail?.safeJobAnalysisName
                            : item?.isMaterialListForm
                            ? item?.materialListName
                            : "After control form"}
                        </div>
                        <div className=" text-gray-500 font-semibold">
                          {item?.isApprovalForm
                            ? `${item?.projectName}  ${item?.projectNumber}`
                            : item?.isObservationForm
                            ? `${item?.projectId?.projectName}  ${item?.projectId?.projectNumber}`
                            : item?.isSJAForm
                            ? `${item?.projectId?.projectName}  ${item?.projectId?.projectNumber}`
                            : item?.isMaterialListForm
                            ? `${item?.projectId?.projectName}  ${item?.projectId?.projectNumber}`
                            : `${item?.projectId?.projectName}  ${item?.projectId?.projectNumber}`}
                        </div>
                      </div>
                    </th>

                    <td className="px-6 py-4 font-semibold">
                      {item?.isApprovalForm
                        ? "Approval Form"
                        : item?.isObservationForm
                        ? "Observation Form"
                        : item?.isSJAForm
                        ? "Safe Job Analysis Form"
                        : item?.isMaterialListForm
                        ? "Material List Form"
                        : "After control form"}
                    </td>

                    <td className="px-6 py-4 ">
                      <div className="flex items-center ">
                        <div
                          className={`h-2.5 w-2.5 font-semibold rounded-full me-2 
                ${item?.isDeleted ? "bg-red-500" : "bg-green-500"}
              `}
                        ></div>
                        <div className="font-semibold">
                          {item?.isDeleted ? "Inactive" : "Active"}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center font-semibold">
                        {formatDate(item?.createdAt)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-3.5 cursor-pointer">
                        <FaRegEye
                          className={`text-blue-500 text-xl`}
                          onClick={() => handleOperation(item, "view")}
                        />
                        <FaPen
                          className={`text-green-600 text-xl`}
                          onClick={() => handleOperation(item, "edit")}
                        />
                        <MdOutlineDelete
                          onClick={() => handleOperation(item, "delete")}
                          className={`text-red-600 text-xl`}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <div className="fixed left-[50%]">
                  <img src={noDataImage} alt="no_data_image" />
                </div>
              )}
            </tbody>
          )}
        </table>
        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {isConfirmationModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p>Are you sure you want to {operationType} this item?</p>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-red-400 text-white px-4 py-2 mr-2 rounded hover:bg-red-600 font-bold"
                  onClick={handleConfirmationOperation}
                >
                  {isLoading ? "Loading" : "Confirm"}
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
      </div>
    </div>
  );
};

export default MaterialListForms;
