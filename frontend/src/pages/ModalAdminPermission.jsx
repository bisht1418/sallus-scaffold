import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateMaterialListWithProjectService } from "../Services/materialListWithProjectService";
export default function ModalAdminPermission({
  setShowModal,
  adminApprovalData,
}) {
  useEffect(() => {}, [adminApprovalData]);

  const handlePermissionResponse = async (res, id) => {
    if (res === "Yes") {
      const response = await updateMaterialListWithProjectService(id, {
        permisssionAdminToUser: true,
        transferMaterialListsPermisssion: true,
        permisssionUserToAdmin: false,
        permisssionAdminUserMessage: "approved",
      });
      toast.success("Approved");
      setShowModal(false);
    }
    if (res === "No") {
      const response = await updateMaterialListWithProjectService(id, {
        permisssionAdminToUser: true,
        permisssionUserToAdmin: false,
        transferMaterialListsPermisssion: false,
        permisssionAdminUserMessage: "decline",
      });
      toast.error("decline");
      setShowModal(false);
    }
  };
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative p-6 flex-auto">
              <div className="w-full h-full">
                <p className="text-lg">
                  Permission to user for tansfer material lists
                </p>

                {adminApprovalData.length > 0 &&
                  adminApprovalData.map((el) => {
                    return (
                      <>
                        <p className="font-medium text-lg">
                          {"materialListName"}{" "}
                          <span className="italic text-xl font-semibold">
                            {el.materialListName}
                          </span>
                        </p>
                        <div className="flex items-center justify-between px-6 py-4 rounded-b">
                          <button
                            className="text-green-500 hover:bg-gray-100 border-2 rounded-xl border-solid border-blueGray-200  bg-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() =>
                              handlePermissionResponse("Yes", el._id)
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="text-red-500 hover:bg-gray-100 bg-transparent border-2 rounded-xl border-solid border-blueGray-200 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() =>
                              handlePermissionResponse("No", el._id)
                            }
                          >
                            Decline
                          </button>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
            <div className="flex items-center justify-end px-6 py-2 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(false)}
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
