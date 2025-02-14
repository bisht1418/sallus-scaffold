import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  materialListWithProjectGetService,
  updateMaterialListWithProjectService,
} from "../../Services/materialListWithProjectService";

export default function ModalPermission({
  setShowModalPermission,
  transferId,
}) {
  const [transferData, settransferData] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getData();
  }, [transferId]);
  const getData = async () => {
    setLoading(true);
    try {
      const response = await materialListWithProjectGetService(
        transferId?.projectId
      );
      settransferData(
        ...response?.data.filter((item) => item._id == transferId._id)
      );
      if (response.data.length >= 1) {
        setLoading(false);
      }
    } catch (error) {
      return error;
    } finally {
      // setLoading(false);
    }
  };

  const handlePermissionResponse = async (response) => {
    if (response === "Yes") {
      const response = await updateMaterialListWithProjectService(
        transferId?._id,
        { permisssionUserToAdmin: true }
      );
      if (response?.data?.status === "success") {
        toast.success("Request send to admin");
        setShowModalPermission(false);
      } else {
        toast.error("Something wrong");
      }
    } else {
      setShowModalPermission(false);
    }
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {loading ? (
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
              </div>
            ) : (
              <div className="relative px-6 py-4 flex-auto">
                <div className="w-full h-full">
                  <p className="text-lg">Permission to admin for </p>
                  <p className="font-semibold text-xl">
                    {transferId?.materialListName}
                  </p>
                  {transferData?.permisssionUserToAdmin ? (
                    <>
                      <p className="mt-2 italic text-green-700">
                        Permission already send to admin wait some time for
                        approval
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center justify-between px-6 py-4 rounded-b">
                      <button
                        className="text-green-500 hover:bg-gray-100 border-2 rounded-xl border-solid border-blueGray-200  bg-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => handlePermissionResponse("Yes")}
                      >
                        Yes
                      </button>
                      <button
                        className="text-red-500 hover:bg-gray-100 bg-transparent border-2 rounded-xl border-solid border-blueGray-200 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => handlePermissionResponse("No")}
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end px-6 py-2 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModalPermission(false)}
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
