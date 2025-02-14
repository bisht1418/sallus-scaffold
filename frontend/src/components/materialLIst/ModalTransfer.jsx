import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import _ from "lodash";
import { GoSearch } from "react-icons/go";
import { IoFilter } from "react-icons/io5";
export default function ModalTransfer({
  setShowModal,
  loadingModel,
  handleRowClick,
  handleSearchModel,
  handleTransferModel,
  selectedRow,
  handleTransferMaterialLists,
  projectTransfer,
}) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6  mx-3  max-w-[800px]">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative p-6 flex-auto">
              <div className="w-full h-full">
                <div className="flex flex-col items-center justify-between text-center">
                  <p className="title-text">Transfer Material</p>
                  <div className="relative flex items-center justify-center ">
                    <GoSearch
                      className="absolute top-[50%] left-[2%] translate-y-[-50%]"
                      size={24}
                      color="#000000"
                    />

                    <input
                      id="search"
                      onChange={handleSearchModel}
                      className="border border-[#CCCCCC] px-[100px] py-1 w-full pr-[50px]"
                      placeholder="Search for project number or name"
                      type="text"
                    />
                    <IoFilter
                      size={24}
                      color="#000000"
                      className="absolute top-3 right-3"
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-auto">
                <table>
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-nowrap">Project Number</th>
                      <th className="px-4 py-2 text-nowrap">
                        Project Name
                      </th>{" "}
                      <th className="px-4 py-2 text-nowrap">User Email</th>
                    </tr>
                  </thead>
                  {loadingModel ? (
                    <tbody>
                      <tr>
                        <td colSpan="2" className="text-center py-4">
                          {" "}
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
                        </td>
                      </tr>
                    </tbody>
                  ) : projectTransfer?.length > 0 ? (
                    projectTransfer?.map((el, index) => (
                      <tbody key={index}>
                        <tr
                          className={
                            selectedRow === index
                              ? "bg-[#0072bb] cursor-pointer"
                              : "cursor-pointer"
                          }
                          onClick={() => {
                            handleRowClick(index);
                            handleTransferModel(el?._id, el?.projectName);
                          }}
                        >
                          <td
                            className="border px-4 py-2"
                            style={{ width: "30%" }}
                          >
                            {el?.projectNumber}
                          </td>
                          <td
                            className="border px-4 py-2"
                            style={{ width: "70%" }}
                          >
                            {el?.projectName}
                          </td>{" "}
                          <td
                            className="border px-4 py-2"
                            style={{ width: "70%" }}
                          >
                            {el?.userId?.email}
                          </td>
                          {console.log("ele", el)}
                        </tr>
                      </tbody>
                    ))
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan="2" className="text-center py-4">
                          No data found.
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                onClick={handleTransferMaterialLists}
                className="bg-green-500 text-white font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              >
                Transfer
              </button>
              <button
                className="bg-red-500 text-white font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
