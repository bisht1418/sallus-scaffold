import React, { useEffect, useState } from "react";
import { t } from "../../utils/translate";
import {
  getAfterControlVisualInspectionService,
  updateAfterControlVisualInspectionService,
} from "../../Services/afterControlVisualInspectionService";
import { toast } from "react-toastify";
import ImageUpload from "../FileUpload";

export default function ModalVisual({
  setShowModalVisual,
  approvalFormId,
  fetchData,
}) {
  useEffect(() => {
    getAfterControlVisualInspection(approvalFormId);
  }, []);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [addedData, setAddedData] = useState({
    documentComment: "",
    documentFile: "",
    documentList: "",
    inspection: "",
  });
  const [checkDocumentFile, setCheckDocumentFile] = useState([]);

  async function getAfterControlVisualInspection(approvalFormId) {
    try {
      setLoading(true);

      const response = await getAfterControlVisualInspectionService(
        approvalFormId
      );
      const visualData = response?.data;

      setCheckDocumentFile((prev) =>
        visualData?.map((ele, index) =>
          ele?.inspection === "yes" ? true : false
        )
      );
      setItems(visualData);
    } catch (error) {
      console.error(
        "Error fetching after control visual inspection data:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  const handleOptionChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].inspection = value;
    setItems(updatedItems);

    const updatedCheckDocumentFile = [...checkDocumentFile];
    updatedCheckDocumentFile[index] = value === "yes";
    setCheckDocumentFile(updatedCheckDocumentFile);
  };

  const handleSaveData = async () => {
    try {
      setIsSaveLoading(true);
      const response = await updateAfterControlVisualInspectionService(
        approvalFormId,
        { visualData: items }
      );

      if (response?.data?.status === "success") {
        toast.success("Successfully Saved");
        fetchData();
      } else {
        toast.error("Failed to Save the Data");
      }
    } catch (error) {
      setIsSaveLoading(false);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleAddMore = () => {
    if (addedData?.documentList === "") {
      toast.error("Please select any option");
      return;
    } else {
      setItems((prevItems) => [...prevItems, addedData]);
    }
  };

  const handleImageUpload = async (image, index) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].documentFile = image;
      return updatedItems;
    });
  };

  const handleDeleteDocument = (id) => {
    setItems((prevVisual) => {
      return prevVisual.map((item, index) => {
        if (index === id) {
          return { ...item, documentFile: null, inspection: null };
        }
        return item;
      });
    });

    setCheckDocumentFile((prev) => {
      return prev.map((item, index) => {
        if (index === id) {
          return false;
        }
        return item;
      });
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
        <div className="relative w-[95%] lg:w-auto my-6 mx-auto max-w-8xl rounded-lg bg-white max-h-[91vh] overflow-auto">
          <div className="rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
            <div className="sm:pb-12 pb-6 border-b-[#cccccc] border-b">
              <div className="custom-container">
                <div className="flex flex-col sm:gap-[30px] gap-4 sm:mt-[60px] mt-6">
                  <div className="flex justify-between items-center">
                    <p className="medium-title underline">
                      {t("visualInspection")}
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-x-[100px] flex-wrap w-full md:h-auto h-[60vh] overflow-auto ">
                    {loading ? (
                      <div className="flex flex-col gap-2 justify-center items-center align-middle sm:w-[60vw] sm:h-[40vh] m-auto">
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
                        <span className="font-bold">Loading...</span>
                      </div>
                    ) : (
                      <>
                        {items?.length &&
                          Array.isArray(items) &&
                          [...items, "addMore"].map((item, index) =>
                            item === "addMore" ? (
                              <div className="sm:w-1/2 w-full flex justify- gap-3">
                                <input
                                  onChange={(e) =>
                                    setAddedData({
                                      ...addedData,
                                      documentList: e.target.value,
                                    })
                                  }
                                  placeholder="Enter Document Name"
                                  type="text"
                                  className="!px-3 !text-semibold"
                                />
                                <button
                                  onClick={() => handleAddMore()}
                                  className="border text-nowrap bg-[#0072bb] transition-all duration-200 ease-in-out hover:bg-[#0e598a] text-white rounded-md px-2 py-1 font-semibold"
                                >
                                  Add More
                                </button>
                              </div>
                            ) : (
                              <div className="block w-full lg:w-[calc(50%-50px)] sm:px-[20px] px-0 sm:py-[12px] py-2  justify-between items-start">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full">
                                  <div className="flex justify-between lg:justify-end lg:flex-row-reverse flex-row items-center w-full gap-[10px]">
                                    <p className="project-number">
                                      {item?.documentList}
                                    </p>
                                  </div>

                                  <div className="flex gap-2 flex-col w-[307px]">
                                    <div className="flex justify-center items-center gap-[20px] lg:gap-[64px] ">
                                      <div className="flex sm:gap-5 gap-2 ">
                                        <input
                                          type="radio"
                                          name={`option-${index}`}
                                          value="yes"
                                          checked={
                                            item.inspection === "yes" || ""
                                          }
                                          onChange={() =>
                                            handleOptionChange(index, "yes")
                                          }
                                        />{" "}
                                        Yes
                                      </div>

                                      <div className="flex sm:gap-5 gap-2">
                                        <input
                                          type="radio"
                                          name={`option-${index}`}
                                          value="no"
                                          checked={item.inspection === "no"}
                                          onChange={() =>
                                            handleOptionChange(index, "no")
                                          }
                                        />{" "}
                                        No
                                      </div>

                                      <div className="flex sm:gap-5 gap-2">
                                        <input
                                          type="radio"
                                          name={`option-${index}`}
                                          value="NA"
                                          checked={item.inspection === "NA"}
                                          onChange={() =>
                                            handleOptionChange(index, "NA")
                                          }
                                        />{" "}
                                        N/A
                                      </div>
                                    </div>
                                    <div className="">
                                      {item?.documentFile ? (
                                        <div className="flex !font-bold w-[150px] rounded">
                                          <ImageUpload
                                            isAfterControlForm={true}
                                            index={index}
                                            status={true}
                                            uploadedViewImage={
                                              item.documentFile
                                            }
                                            handleDeleteDocument={(index) =>
                                              handleDeleteDocument(index)
                                            }
                                            handleImageUpload={(image, index) =>
                                              handleImageUpload(image, index)
                                            }
                                          />
                                        </div>
                                      ) : (
                                        checkDocumentFile[index] && (
                                          <div>
                                            <ImageUpload
                                              isAfterControlForm={true}
                                              index={index}
                                              handleImageUpload={async (
                                                image,
                                                index
                                              ) =>
                                                await handleImageUpload(
                                                  image,
                                                  index
                                                )
                                              }
                                            />
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end sm:p-6 p-3 border-t border-solid border-blueGray-200 rounded-b gap-4">
              <button
                className="bg-[green] text-[white] sm:text-base font-semibold text-sm px-5 py-[10px] rounded-[5px]"
                type="button"
                onClick={() => {
                  handleSaveData();
                  setShowModalVisual(false);
                }}
              >
                {isSaveLoading ? "Loading" : "Save"}
              </button>
              <button
                className="bg-[red] text-[white] sm:text-base font-semibold text-sm px-5 py-[10px] rounded-[5px]"
                type="button"
                onClick={() => {
                  setShowModalVisual(false);
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
