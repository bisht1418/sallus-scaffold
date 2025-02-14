import React, { useEffect, useState } from "react";
import { t } from "../../utils/translate";
import { toast } from "react-toastify";
import ImageUpload from "../FileUpload";
import { createFilesService } from "../../Services/filesServices";

export default function ModalVisual({
  setShowModalVisual,
  visualData,
  currentIndex,
  setAfterControl,
  afterControl,
  roleOfUser
}) {
  const [selectAllValue, setSelectAllValue] = useState("");
  const [items, setItems] = useState([]);
  const [addedData, setAddedData] = useState({
    documentComment: "",
    documentFile: "",
    documentList: "",
    inspection: "",
  });
  const [checkDocumentFile, setCheckDocumentFile] = useState([]);

  useEffect(() => {
    setItems(afterControl[currentIndex]?.visual);
  }, []);

  // New function to handle select all
  const handleSelectAll = (value) => {
    setSelectAllValue(value);
    const updatedItems = items?.map(item => ({
      ...item,
      inspection: value
    }));
    setItems(updatedItems);

    // Update checkDocumentFile for all items if "yes" is selected
    const updatedCheckDocumentFile = new Array(items.length).fill(value === "yes");
    setCheckDocumentFile(updatedCheckDocumentFile);
  };


  const handleOptionChange = (index, value) => {
    const updatedItems = items?.map((item, idx) => {
      if (idx === index) {
        return { ...item, inspection: value, id: idx + 1 };
      }
      return item;
    });
    setItems(updatedItems);
    const updatedCheckDocumentFile = [...checkDocumentFile];
    updatedCheckDocumentFile[index] = value === "yes";
    setCheckDocumentFile(updatedCheckDocumentFile);

    // Reset select all value when individual option changes
    setSelectAllValue("");
  };

  const handleSaveData = async () => {
    console.log("items", items);
    const promises = promiseFunction(items);
    const resolvedPromises = await Promise.all(promises);

    setAfterControl(
      afterControl.map((item, index) => {
        if (index === currentIndex) {
          return { ...item, visual: items };
        }
        return item;
      })
    );
  };

  const fileExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "svg",
    "webp",
    "tiff",
  ];

  function promiseFunction(visualData) {
    const promises = visualData
      .map(async (ele) => {
        if (ele?.inspection === "yes") {
          const url = ele?.documentFile;
          const fileType = extractFileType(url);
          const isImage = fileExtensions?.includes(fileType);
          const fileData = {
            fileName: createFileName(formatString(ele?.documentList)),
            file: ele?.documentFile || false,
            fileType: isImage ? "image" : "file",
            userId: afterControl[currentIndex]?.userId?._id,
            projectId: afterControl[currentIndex]?.projectId?._id,
            isFileFrom: "after_approval_form",
          };
          await createFilesService(fileData);
        }
      })
      .filter(Boolean);
    return promises;
  }

  const extractFileType = (url) => {
    const match = url?.match(
      /\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff|pdf)(\?|$)/i
    );
    return match && match[1] ? match[1]?.toLowerCase() : null;
  };

  function formatDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    const year = date.getFullYear();
    return `${day}${month}${year}`;
  }

  function createFileName(name) {
    const createdAt = formatDate();
    return `${name}_${createdAt}`;
  }

  const formatString = (input) => {
    const cleanedInput = input.replace(/[^a-zA-Z0-9 ]/g, "");
    const words = cleanedInput.split(" ");
    const capitalizedWords = words?.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return capitalizedWords.join("");
  };

  const handleAddMore = (index) => {
    if (addedData?.documentList === "") {
      toast.error("Please select any option");
      return;
    } else {
      setItems((prevItems) => [...prevItems, { ...addedData, id: index + 1 }]);
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
      return prevVisual?.map((item, index) => {
        if (index === id) {
          return { ...item, documentFile: null, inspection: null };
        }
        return item;
      });
    });

    setCheckDocumentFile((prev) => {
      return prev?.map((item, index) => {
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
        <div className="relative w-[95vw] my-6 mx-auto max-w-8xl rounded-lg bg-white max-h-[91vh] overflow-auto">
          <div className="rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
            <div className="sm:pb-12 pb-6 border-b-[#cccccc] border-b">
              <div className="custom-container">
                <div className="flex flex-col sm:gap-[30px] gap-4 sm:mt-[60px] mt-6">
                  <div className="flex justify-between items-center">
                    <p className="medium-title underline">
                      {t("visualInspection")}
                    </p>
                  </div>

                  {/* New Select All Section */}
                  {items?.length > 0 && (
                    <div className="flex items-center gap-8 p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Select All:</span>
                      <div className="flex gap-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="selectAll"
                            value="yes"
                            checked={selectAllValue === "yes"}
                            onChange={(e) => handleSelectAll(e.target.value)}
                            className="cursor-pointer"
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="selectAll"
                            value="no"
                            checked={selectAllValue === "no"}
                            onChange={(e) => handleSelectAll(e.target.value)}
                            className="cursor-pointer"
                          />
                          <span>No</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="selectAll"
                            value="NA"
                            checked={selectAllValue === "NA"}
                            onChange={(e) => handleSelectAll(e.target.value)}
                            className="cursor-pointer"
                          />
                          <span>N/A</span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center gap-x-[100px] flex-wrap w-full md:h-auto h-[60vh] overflow-auto">
                    <>
                      {items?.length &&
                        Array.isArray(items) &&
                        [...items, "addMore"]?.map((item, index) =>
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
                                onClick={() => handleAddMore(index)}
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
                                  <div className="flex justify-center items-center gap-[20px] lg:gap-[64px]">
                                    <div className="flex sm:gap-5 gap-2">
                                      <input
                                        type="radio"
                                        name={`option-${index}`}
                                        value="yes"
                                        checked={item.inspection === "yes"}
                                        onChange={() => handleOptionChange(index, "yes")}
                                      />
                                      Yes
                                    </div>

                                    <div className="flex sm:gap-5 gap-2">
                                      <input
                                        type="radio"
                                        name={`option-${index}`}
                                        value="no"
                                        checked={item.inspection === "no"}
                                        onChange={() => handleOptionChange(index, "no")}
                                      />
                                      No
                                    </div>

                                    <div className="flex sm:gap-5 gap-2">
                                      <input
                                        type="radio"
                                        name={`option-${index}`}
                                        value="NA"
                                        checked={item.inspection === "NA"}
                                        onChange={() => handleOptionChange(index, "NA")}
                                      />
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
                                          uploadedViewImage={item.documentFile}
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
                                            handleImageUpload={async (image, index) =>
                                              await handleImageUpload(image, index)
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
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end sm:p-6 p-3 border-t border-solid border-blueGray-200 rounded-b gap-4">
              <button
                className="bg-[green] text-[white] sm:text-base font-semibold text-sm px-5 py-[10px] rounded-[5px]"
                type="button"
                disabled={roleOfUser === 2}
                onClick={() => {
                  handleSaveData();
                  setShowModalVisual(false);
                }}
              >
                Save
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
