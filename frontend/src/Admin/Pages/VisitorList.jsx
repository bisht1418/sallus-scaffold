import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import { FaRegEye } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";
import { MdOutlineDelete } from "react-icons/md";
import Pagination from "../Components/Pagination";
import {
  deleteUser,
  getAllUsersService,
  getVisitorDetailsList,
} from "../../Services/AdminService/userService";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VisitorList = () => {
  return (
    <div>
      <AdminDashboard data={VisitorProps} />
    </div>
  );
};

const processEmailData = (data) => {
  const emailMap = new Map();

  data.forEach((item) => {
    const { visitorEmail, createdAt } = item;
    const existingEntry = emailMap.get(visitorEmail);

    if (existingEntry) {
      existingEntry.count += 1;
      if (new Date(createdAt) > new Date(existingEntry.createdAt)) {
        emailMap.set(visitorEmail, { ...item, count: existingEntry.count });
      }
    } else {
      emailMap.set(visitorEmail, { ...item, count: 1 });
    }
  });

  return Array.from(emailMap.values());
};

const VisitorProps = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [users, setUsers] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [operationType, setOperationType] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllVisitors();
  }, []);

  const getAllVisitors = async () => {
    try {
      setIsLoading(true);
      const getAllUsersResponse = await getVisitorDetailsList();
      const allVisitor = getAllUsersResponse.data;
      const refactorData = processEmailData(allVisitor);
      console.log("refactorData", refactorData);

      setUsers(refactorData);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(users?.length / ITEMS_PER_PAGE);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const paginatedData = users?.slice(
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
        const deleteResponse = await deleteUser(currentItem);

        if (deleteResponse.status) {
          toast("User deleted successfully");
          await getAllVisitors();
        } else {
          toast("Something went wrong");
        }
      } else if (operationType === "view" && currentItem) {
        const serializedItem = encodeURIComponent(JSON.stringify(currentItem));
        navigate(`/admin-dashboard/user/view-user-details/${serializedItem}`);
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
        let responseSearch = users.filter((user) => {
          const searchTerm = term.toLowerCase();

          const nameMatch = user.name.toLowerCase().includes(searchTerm);
          const emailMatch = user.userId.email
            .toLowerCase()
            .includes(searchTerm);
          const phoneMatch = user.userId.phoneNumber
            .toLowerCase()
            .includes(searchTerm);

          return nameMatch || emailMatch || phoneMatch;
        });

        if (!responseSearch) {
          responseSearch = [];
        }
        const searchData = responseSearch || [];
        setUsers(searchData);
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
      getAllVisitors();
    }

    if (!searchTerm) {
      setSearchLoading(false);
    }

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);

    const dateOptions = { day: "2-digit", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", dateOptions);

    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="p-4 mt-5 mb-10">
      <p className="text-xl font-bold text-gray-600 uppercase">All Users</p>
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
            id="table-search-users"
            className="block font-semibold  ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-1/2 bg-gray-50"
            placeholder="Search for users"
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
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Downloads
              </th>{" "}
              <th scope="col" className="px-6 py-3">
                Created At
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
              {paginatedData?.map((item, index) => (
                <tr className="bg-white border-b ">
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap className:text-white"
                  >
                    <div className="ps-3">
                      <div className="text-base font-semibold">
                        {item?.visitorName}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex items-center font-semibold">
                      {item?.visitorEmail}
                    </div>
                  </td>{" "}
                  <td className="px-6 py-4">
                    <div className="flex items-center font-semibold">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>{" "}
                      <span className="font-bold">{item?.count}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center font-semibold">
                      {formatDateTime(item?.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
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

export default VisitorList;
