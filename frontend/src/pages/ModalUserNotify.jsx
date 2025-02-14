import React from "react";
import { updateMaterialListWithProjectService } from "../Services/materialListWithProjectService";

export default function ModalUserNotify({ setShowModal1, userApprovalData }) {
  const handelUpadte = async (el) => {
    const response = await updateMaterialListWithProjectService(el?._id, {
      permisssionAdminToUser: false,
    });
  };
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative p-6 flex-auto">
              <div className="w-full h-full">
                {userApprovalData?.length > 0 &&
                  userApprovalData?.map((el) => {
                    return (
                      <>
                        <p className="font-medium text-lg">
                          {"materialListName"}{" "}
                          <span className="italic text-xl font-semibold">
                            {el?.materialListName}
                          </span>
                        </p>
                        <p
                          className={
                            el?.permisssionAdminUserMessage === "approved"
                              ? "text-green-700 text-lg font-medium"
                              : "text-red-600 text-lg font-medium"
                          }
                        >
                          {"status:"}{" "}
                          <span className="font-semibold">
                            {el?.permisssionAdminUserMessage}
                          </span>
                        </p>
                      </>
                    );
                  })}
              </div>
            </div>
            <div className="flex items-center justify-end px-6 py-2 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  setShowModal1(false);
                  userApprovalData?.forEach((el) => handelUpadte(el));
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
