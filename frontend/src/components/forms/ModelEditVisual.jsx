import React, { useEffect, useState } from "react";
import { t } from "../../utils/translate";
import { LiaFileUploadSolid } from "react-icons/lia";
import ImageUpload from "../FileUpload";
import CloseIcon from "../../Assets/iconclose.svg";
import { MdOutlineEditNote } from "react-icons/md";
import { getApprovalFormByIdService } from "../../Services/approvalFormService";
import AfterControl from "./AfterControl";
import { storeVisualinspection } from "../../Services/afterControlFormService";
import { useSelector } from "react-redux";
import {
  EditAfterControlForm,
  SetAfterControlForm,
} from "../../Redux/Slice/afterControlFormSlice";
import { store } from "../../Redux/store";
export default function ModalEditVisual({
  modalVisual,
  setShowModalVisual,
  index,
}) {
  const [visual, setVisual] = useState([
    {
      id: 1,
      documentList: "Scaffold Signage",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 2,
      documentList: "Dimensioning",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 3,
      documentList: "Load Bearing Structure",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 4,
      documentList: "Access and Safe Use",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 5,
      documentList: "Scaffold Decking",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 6,
      documentList: "Guardrails",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 7,
      documentList: "Splash/Guardrail",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 8,
      documentList: "Handrails",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 9,
      documentList: "Roof Safety",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 10,
      documentList: "Midrails",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 11,
      documentList: "Tarpaulin/Netting",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 12,
      documentList: "Toeboards",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 13,
      documentList: "Foundation",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 14,
      documentList: "Bracing",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 15,
      documentList: "Anchoring",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
    {
      id: 16,
      documentList: "Anchoring Hardware",
      documentFile: null,
      documentComment: null,
      inspection: null,
    },
  ]);
  const approval = useSelector(
    (store) => store?.afterControl?.visualInspection
  );
  const data = approval?.filter((el) => el.id === modalVisual)[0]?.visual;
  const [editComment, setEditComment] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const [showInput, setShowInput] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const [showComment, setShowComment] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [loading, setLoading] = useState(false);

  const handleDeleteDocument = (id) => {
    setVisual((prevVisual) => {
      return prevVisual.map((item) => {
        if (item.id === id) {
          return { ...item, documentFile: null };
        }
        return item;
      });
    });
  };

  const handleImageUpload = (index, file) => {
    const updatedVisual = [...visual];
    const itemToUpdate = updatedVisual.find((item) => item.id === index);
    if (itemToUpdate) {
      itemToUpdate.documentFile = file;
    }
    setVisual(updatedVisual);
  };

  const handleAddCommentClick = (index) => {
    const newArr = showComment.map((item, i) => {
      if (index === i) {
        return true;
      } else {
        return item;
      }
    });

    const editArray = editComment.map((item, i) => {
      if (index === i) {
        return false;
      } else {
        return item;
      }
    });
    setShowComment(newArr);
    setEditComment(editArray);
  };
  const handleEditComment = (index, text) => {
    if (text === "add comment") {
      return "Add Comment";
    } else {
      return "Edit Comment";
    }
  };
  const handeldeletedit = (index) => {
    const newArr = editComment.map((item, i) => {
      if (index === i) {
        return false;
      } else {
        return item;
      }
    });
    setEditComment(newArr);
  };
  const handleTextChangeEditComment = (index) => {
    const newArr = editComment.map((item, i) => {
      if (index === i) {
        return true;
      } else {
        return item;
      }
    });
    setEditComment(newArr);
  };

  const handleRadioChange = (id, value) => {
    setVisual(
      visual?.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            inspection: value,
            documentFile: value === "na" ? null : item.documentFile,
            documentComment: value === "na" ? null : item.documentComment,
          };
        }
        return item;
      })
    );
    if (value === "yes" || value === "no") {
      setShowInput((prevInput) =>
        prevInput.map((item, index) => (index === id - 1 ? true : item))
      );
    } else {
      setShowInput((prevInput) =>
        prevInput.map((item, index) => (index === id - 1 ? false : item))
      );
      setEditComment((prevInput) =>
        prevInput.map((item, index) => (index === id - 1 ? false : item))
      );
      setShowComment((prevInput) =>
        prevInput.map((item, index) => (index === id - 1 ? false : item))
      );
    }
  };

  const [comment, setComment] = useState("");
  const handleInputChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentUpdate = (id) => {
    setVisual(
      visual.map((item) => {
        if (item.id === id) {
          return { ...item, documentComment: comment };
        }
        return item;
      })
    );
  };
  useEffect(() => {
    // if (data) {
    //     setVisual(data)
    //     const updatedShowInput = data.map(item => item.inspection === 'yes' || item.inspection === 'no');
    //     const updatedShowComment = data.map(item => item.documentComment !== null);
    //     setEditComment(updatedShowComment);
    //     setShowInput(updatedShowInput);
    // }
    if (modalVisual) {
      setVisual(modalVisual);
      const updatedShowInput = modalVisual.map(
        (item) => item.inspection === "yes" || item.inspection === "no"
      );
      const updatedShowComment = modalVisual.map(
        (item) => item.documentComment !== null
      );
      setEditComment(updatedShowComment);
      setShowInput(updatedShowInput);
    }
    setVisual(modalVisual);
  }, [data, modalVisual]);
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-[calc(100%-20px)] max-h-[91vh] overflow-auto lg:w-auto my-6 mx-auto max-w-8xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="sm:pb-12 pb-6 border-b-[#cccccc] border-b">
              <div className="custom-container">
                <div className="flex flex-col sm:gap-[30px] gap-4 sm:mt-[60px] mt-6">
                  <div className="flex justify-between items-center">
                    <p className="medium-title">{t("visualInspection")}</p>
                  </div>
                  <div className="flex justify-between lg:items-center gap-x-[100px] flex-wrap w-full md:h-auto h-[60vh] overflow-auto">
                    {!loading &&
                      visual?.map((item, index) => (
                        <div className="block w-full lg:w-[calc(50%-50px)] px-0 sm:px-[20px] py-2 sm:py-[12px] justify-between items-start">
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full">
                            <div className="flex justify-between lg:justify-end lg:flex-row-reverse flex-row items-center w-full gap-[10px]">
                              <p className="project-number font-semibold">
                                {item?.documentList}
                              </p>
                            </div>
                            <div className="flex justify-center items-center gap-[20px] lg:gap-[64px]">
                              <div className="flex sm:gap-5 gap-2 text-[#777]">
                                <input
                                  type="radio"
                                  name={`option-${index}`}
                                  value="yes"
                                  checked={item.inspection === "yes" || ""}
                                  onChange={() =>
                                    handleRadioChange(
                                      item.id,
                                      "yes",
                                      item?.inspection
                                    )
                                  }
                                />{" "}
                                Yes
                              </div>
                              <div className="flex sm:gap-5 gap-2 text-[#777]">
                                <input
                                  type="radio"
                                  name={`option-${index}`}
                                  value="no"
                                  checked={item.inspection === "no"}
                                  onChange={() =>
                                    handleRadioChange(
                                      item.id,
                                      "no",
                                      item?.inspection
                                    )
                                  }
                                />{" "}
                                No
                              </div>
                              <div className="flex sm:gap-5 gap-2 text-[#777]">
                                <input
                                  type="radio"
                                  name={`option-${index}`}
                                  value="NA"
                                  checked={item.inspection === "na"}
                                  onChange={() =>
                                    handleRadioChange(
                                      item.id,
                                      "na",
                                      item?.inspection
                                    )
                                  }
                                />{" "}
                                N/A
                              </div>
                            </div>
                          </div>
                          <div
                            className={`flex flex-row mt-[10px] gap-2 sm:gap-[1rem] flex-wrap sm:flex-nowrap leading-[28px] text-[12px] font-[400]  ${
                              showInput[index] ? "" : "hidden"
                            }`}
                          >
                            <div
                              className={`flex flex-row sm:w-auto w-full gap-[10px] items-center  ${
                                item.documentFile ? "" : `border-[1px]`
                              }   border-[#CCCCCC] px-[10px] rounded-[5px] ${
                                item.documentFile ? `bg-[#0072BB1A]` : ""
                              }`}
                            >
                              {item.documentFile ? (
                                <>
                                  <LiaFileUploadSolid
                                    backgroundColor="blue"
                                    color="#0072BB"
                                    size={20}
                                  />
                                </>
                              ) : (
                                <LiaFileUploadSolid
                                  backgroundColor="blue"
                                  color="black"
                                  size={20}
                                />
                              )}
                              {item.documentFile ? (
                                <>
                                  <ImageUpload
                                    editedImage={item.documentFile}
                                    onImageUpload1={(file) =>
                                      handleImageUpload(item?.id, file)
                                    }
                                    status={true}
                                    documentFile={item?.documentFile}
                                    index={item?.id}
                                    handleDeleteDocument={() =>
                                      handleDeleteDocument(item?.id)
                                    }
                                  />
                                </>
                              ) : (
                                <>
                                  <ImageUpload
                                    onImageUpload1={(file) =>
                                      handleImageUpload(item?.id, file)
                                    }
                                    documentFile={item?.documentFile}
                                    index={item?.id}
                                  />
                                </>
                              )}
                            </div>
                            <div
                              className={`flex flex-row sm:w-auto w-full gap-[10px] items-center  ${
                                editComment[index] ? "" : `border-[1px]`
                              } border-[#CCCCCC] px-[10px] rounded-[5px] ${
                                editComment[index] ? `bg-[#0072BB1A]` : ""
                              }`}
                            >
                              {editComment[index] ? (
                                <>
                                  <MdOutlineEditNote
                                    color="#0072BB"
                                    size={20}
                                  />
                                </>
                              ) : (
                                <MdOutlineEditNote color="#000000" size={20} />
                              )}

                              <button
                                className={`${
                                  editComment[index]
                                    ? `text-[#0072BB]`
                                    : "text-[black]"
                                } ${editComment[index] ? `text-[14px]` : ""}`}
                                onClick={(event) => {
                                  event.preventDefault();
                                  handleAddCommentClick(index);
                                }}
                              >
                                {editComment[index]
                                  ? handleEditComment(index, "edit comment")
                                  : handleEditComment(index, "add comment")}
                              </button>
                              {editComment[index] && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handeldeletedit(index);
                                  }}
                                >
                                  <img
                                    className="text-[#0072BB]"
                                    src={CloseIcon}
                                    alt="edit_document"
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                          {showComment[index] && !editComment[index] && (
                            <div
                              className={`flex flex-col mt-[10px] gap-[1rem] leading-[28px] text-[12px] font-[400] ${
                                showComment[index] ? "" : "hidden"
                              }`}
                            >
                              <label
                                for="message"
                                className="block text-sm font-medium  dark:text-black"
                              >
                                Your message
                              </label>
                              <textarea
                                id="message"
                                rows="4"
                                className="rounded border border-gray-300 p-3"
                                onChange={handleInputChange}
                                // {...register(`${documentComment[index]}`)}
                                placeholder="Write your thoughts here..."
                              >
                                {
                                  visual?.filter((el) => el.id === item?.id)[0]
                                    ?.documentComment
                                }
                              </textarea>
                              <button
                                onClick={(event) => {
                                  event.preventDefault();
                                  handleCommentUpdate(item.id);
                                  handleTextChangeEditComment(index);
                                }}
                                // onClick={() => handleCommentUpdate(item.id)}
                                className="flex justify-start button-text w-[60px] bg-[#0072BB] text-[white] px-[10px] py-[5px] rounded-[5px]"
                              >
                                Save
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end sm:p-6 p-3 border-t border-solid border-blueGray-200 rounded-b gap-4">
              <button
                className="bg-[green] text-[white] sm:text-base font-semibold text-sm px-5 py-[10px] rounded-[5px]"
                type="button"
                onClick={() => {
                  const updatedApprovalForm = { visual, id: index };
                  store.dispatch(EditAfterControlForm(updatedApprovalForm));
                  setShowModalVisual(false);
                }}
              >
                save
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
