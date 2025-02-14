import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import TopSection from "./TopSection";
import { t } from "../../utils/translate";
import {
  createAfterControlFormService,
  getAfterControlFormByIdService,
  getAfterControlFormService,
  updateAfterControlFormService,
} from "../../Services/afterControlFormService";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SignatureModal from "../SignatureModal";
import _ from "lodash";
import Modal from "./Modal";
import ModalVisual from "./ModelVisual";
import { GoSearch } from "react-icons/go";
import { IoFilter } from "react-icons/io5";
const EditAfterControl = ({ approvalForm }) => {
  const { afterControlId, projectId } = useParams();
  const [approvalFormId, setApprovalFormId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenone, setModalOpenone] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const [signatureImageone, setSignatureImageone] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [approverName, setApproverName] = useState("");
  const { loggedInUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [showModalVisual, setShowModalVisual] = useState(false);
  const [modalVisual, setModalVisual] = useState("");
  const [recentViewVisual, setRecentViewVisual] = useState([]);
  const approvalName = useSelector((state) => state?.auth?.loggedInUser?.name);
  const { accessLevel: roleOfUser } = useSelector((state) => state?.project);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [afterControl, setAfterControl] = useState([]);
  const [controlName, setControlName] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAfterControlFormByIdService(afterControlId);
      const responseData = res?.data;
      const filteredData = responseData?.afterControl;
      setControlName(responseData?.controlName);
      setSignatureImage(responseData?.signature?.customer?.signature);
      setCustomerName(responseData?.signature?.customer?.name);
      setSignatureImageone(responseData?.signature?.approver?.signature);
      setApproverName(responseData?.signature?.approver?.name);
      setAfterControl(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approval = useSelector(
    (store) => store?.afterControl?.visualInspection
  );
  let status = "isComplete";

  approval?.map((item) => {
    item?.visual?.map((subItem) => {
      if (
        subItem?.documentFile === null ||
        subItem?.documentComment === null ||
        subItem?.inspection === null
      ) {
        status = "isProgess";
      }
      if (subItem.inspection === "no") {
        status = "isProgess";
      }
    });
  });

  let activeCount = 0;
  let inactiveCount = 0;
  let dismissedCount = 0;

  afterControl?.map((entry) => {
    switch (entry.status) {
      case "active":
        activeCount++;
        break;
      case "inactive":
        inactiveCount++;
        break;
      case "disassembled":
        dismissedCount++;
        break;
      default:
        break;
    }
  });

  const handleCommentChange = (index, e) => {
    const currentVisualRowData = afterControl[index];
    const updatedVisualRowData = {
      ...currentVisualRowData,
      afterControlComment: e.target.value,
    };
    const updatedAfterControl = [...afterControl];
    updatedAfterControl[index] = updatedVisualRowData;
    setAfterControl(updatedAfterControl);
  };

  const sendDataToBackend = async () => {
    try {
      setSaveLoading(true);
      const signature = {
        customer: { name: customerName, signature: signatureImage },
        approver: { name: approverName, signature: signatureImageone },
      };
      let payload = {
        projectName: afterControl?.projectName,
        projectId: projectId,
        userId: loggedInUser?._id,
        afterControl,
        signature,
        activeCount,
        inactiveCount,
        dismissedCount,
      };

      if (signature?.approver?.signature) {
        const response = await updateAfterControlFormService(
          afterControlId,
          payload
        );

        if (response?.status) {
          toast.success("Create Successfully");
          navigate(`/after-control-listing-form/${projectId}`);
        }
      } else {
        toast.error("Approval Signature is Required");
      }
    } catch (error) {
      setSaveLoading(false);
    }
  };

  const handleAddSignature = () => {
    setModalOpen(true);
  };

  const handleAddSignatureone = () => {
    setModalOpenone(true);
  };

  const handleSaveSignature = (signatureDataUrl, name) => {
    setSignatureImage(signatureDataUrl, name);
    setCustomerName(name);
  };

  const handleSaveSignatureone = (signatureDataUrl, name) => {
    setSignatureImageone(signatureDataUrl, name);
    setApproverName(name);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const closeModalone = () => {
    setModalOpenone(false);
  };

  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const handelImage = (scaffold) => {
    setModalImageUrl(scaffold);
    setShowModal(true);
  };

  const handelImage1 = (scaffold, visual) => {
    setRecentViewVisual(visual);
    setModalVisual(scaffold);
    setShowModalVisual(true);
  };

  const getTheNumberOfInspectionDetails = (data) => {
    const counts = {
      yes: 0,
      no: 0,
      na: 0,
      null: 0,
      totalInspection: data?.length,
    };

    data?.forEach((item) => {
      if (item.inspection === "yes") {
        counts.yes += 1;
      } else if (item.inspection === "no") {
        counts.no += 1;
      } else if (item.inspection === "NA") {
        counts.na += 1;
      } else {
        counts.null += 1;
      }
    });

    return counts;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  let debounceTimer;

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      delayedAPICall(searchTerm);
    } else {
      fetchData();
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
        let responseSearch = afterControl.filter((control) => {
          const searchTerm = term.toLowerCase();

          const scaffoldNames = control?.scaffoldName
            ?.map((el) => `${el?.value}-${el?.key}`)
            ?.join(", ");

          const specificLocation = control?.location
            ?.toLowerCase()
            ?.includes(searchTerm);
          const scaffoldIdentificationNumber =
            control.scaffoldIdentificationNumber
              ?.toLowerCase()
              ?.includes(searchTerm);
          const searchByScaffoldName = scaffoldNames
            ?.toLowerCase()
            ?.includes(searchTerm);

          return (
            scaffoldIdentificationNumber ||
            specificLocation ||
            searchByScaffoldName
          );
        });

        if (!responseSearch) {
          responseSearch = [];
        }
        const searchData = responseSearch || [];
        setAfterControl(searchData);
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
    <>
      <Header />
      <TopSection
        keys={projectId}
        title={t("afterControlForm")}
        breadcrumData={[t("home"), t("afterControlForm")]}
      />
      {showModal ? (
        <>
          <Modal setShowModal={setShowModal} modalImageUrl={modalImageUrl} />
        </>
      ) : null}
      {showModalVisual ? (
        <>
          <ModalVisual
            roleOfUser={roleOfUser}
            setShowModalVisual={setShowModalVisual}
            visualData={recentViewVisual}
            afterControl={afterControl}
            setAfterControl={setAfterControl}
            currentIndex={currentIndex}
          />
        </>
      ) : null}

      <div className="custom-container flex  flex-col mb-4">
        <label className="text-sm font-semibold ">Control Name/Number :</label>
        <div>
          {loading ? (
            <div className="border px-2 py-2 font-bold text-md w-1/4">
              <span className="loading loading-bars loading-sm"></span>
            </div>
          ) : (
            <div className="border px-2 py-2 font-bold text-md !max-w-[200px]">
              {controlName || "Not Assign"}
            </div>
          )}
        </div>
      </div>
      <div className="relative w-full  custom-container !mt-2 max-w-full">
        <GoSearch
          className="absolute top-[50%] left-[35px] translate-y-[-50%] "
          size={24}
          color="#000000"
        />
        <input
          onChange={(e) => handleSearch(e)}
          className="border"
          placeholder={"search control inspection"}
          type="text"
        />
        <button>
          <IoFilter
            className="absolute top-[50%] right-[50px] translate-y-[-50%] "
            size={24}
            color="#000000"
          />
        </button>
      </div>
      <div className="custom-container">
        <table className="border-collapse w-full cursor-pointer">
          <thead className="border-b-2 border-b-[#CCCCCC]">
            <tr>
              <th className="sm:p-4 py-2 px-3">{afterControl?.projectName}</th>
              <th className="sm:p-4 py-2 px-3">{t("Activescaffolds")}</th>
            </tr>
          </thead>
        </table>
        <div className="overflow-x-auto">
          <table className="border-collapse w-full">
            <thead className="border-b-2 border-b-[#CCCCCC]">
              <tr>
                <th className="sm:p-4 py-2 px-3 sm:text-base text-sm text-left">
                  {t("ScaffoldName/type")}
                </th>
                <th className="sm:p-4 py-2 px-3 sm:text-base text-sm text-left">
                  {t("ScaffoldID/Number")}
                </th>
                <th className="sm:p-4 py-2 px-3 sm:text-base text-sm text-left">
                  {t("Specificlocation")}
                </th>
                <th className="sm:p-4 py-2 px-3 sm:text-base text-sm text-left">
                  {t("Control")}
                </th>
                <th className="sm:p-4 py-2 px-3 sm:text-base text-sm text-left">
                  {t("LastInspection")}
                </th>
                <th className="sm:p-4 py-2 px-3 sm:text-base text-sm text-left">
                  {t("AddComment")}
                </th>
              </tr>
            </thead>

            <tbody className="border-b border-b-[#CCCCCC]">
              {searchLoading || loading ? (
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
              ) : afterControl?.length > 0 ? (
                afterControl?.map((scaffold, index) => {
                  const scaffoldNames = scaffold?.scaffoldName
                    ?.map((el) => `${el?.value}-${el?.key}`)
                    ?.join(", ");
                  return (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? "border-t border-t-[#CCCCCC]"
                          : "border-t border-t-[#CCCCCC]"
                      }
                    >
                      <td className="sm:p-4 py-2 px-3 sm:text-base text-sm font-medium">
                        {scaffoldNames}
                      </td>
                      <td className="sm:p-4 py-2 px-3 sm:text-base text-sm font-medium">
                        {scaffold?.scaffoldIdentificationNumber}
                      </td>
                      <td
                        className="sm:p-4 py-2 px-3 sm:text-base text-sm font-medium cursor-pointer"
                        onClick={() => handelImage(scaffold?.approvalFormImage)}
                      >
                        {scaffold?.location}
                      </td>
                      <td
                        onClick={() => setCurrentIndex(index)}
                        className="sm:p-4 py-2 px-3 sm:text-base text-sm font-medium"
                      >
                        <button
                          className={`button-text ${getTheNumberOfInspectionDetails(
                            afterControl[index]?.visual
                          ).no > 0
                              ? "bg-red-400"
                              : getTheNumberOfInspectionDetails(
                                afterControl[index]?.visual
                              ).totalInspection ===
                                getTheNumberOfInspectionDetails(
                                  afterControl[index]?.visual
                                ).yes +
                                getTheNumberOfInspectionDetails(
                                  afterControl[index]?.visual
                                ).na
                                ? "bg-green-400"
                                : "bg-blue-400"
                            } text-[white] px-[10px] py-[5px] rounded-[5px] text-nowrap`}
                          onClick={() => {
                            setApprovalFormId(scaffold?._id);
                            handelImage1(index, scaffold?.visual);
                          }}
                        >
                          Visual Inspection
                        </button>
                      </td>

                      <td className="sm:p-4 py-2 px-3 sm:text-base text-sm font-medium">
                        {selectedOptions[index]?.time ||
                          new Date(scaffold?.date).toLocaleDateString()}
                      </td>
                      <td className="sm:p-4 py-2 px-3 sm:text-base text-sm font-medium">
                        <textarea
                          className="rounded border border-gray-300 p-3"
                          value={afterControl[index]?.afterControlComment || ""}
                          onChange={(e) => handleCommentChange(index, e)}
                          rows={3}
                          cols={30}
                          placeholder={t("AddComment")}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    {"No data found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pb-[50px] mt-8">
          <div className="pb-[30px]">
            <p className="medium-title">{t("formDatas")}</p>
          </div>
          <div className="my-[30px]">
            <div className="flex flex-col lg:flex-row w-full">
              <div className="w-full lg:w-[20%]">
                <div className="flex justify-center items-center p-[20px]">
                  <div className="text-center">
                    <p className="medium-title pb-[20px] text-[#0072BB] h-[70px]">
                      {t("Active-scaffolds")}
                    </p>
                    <p className="medium-title text-[#626262]">{activeCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[30px] mt-[60px]">
          <div className="flex justify-between items-center">
            <p className="medium-title">{t("signature")}</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-[50px] justify-between items-center lg:pl-[100px]">
            <div className="flex flex-col gap-[20px] w-full lg:w-[380px] items-center">
              {signatureImage ? (
                <>
                  <img
                    className="m-auto"
                    width={169}
                    src={signatureImage}
                    alt="Signature"
                  />
                  <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                    {_.startCase(_.toLower(customerName))}
                  </p>
                </>
              ) : (
                ""
              )}
              {signatureImage ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSignatureImage(null);
                  }}
                >
                  {t("clearSignature")}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddSignature();
                  }}
                  className="sigbtn"
                >
                  <img src="/addShape.svg" alt="sign-add" /> {t("AddSignature")}
                </button>
              )}
              <div className="w-full border"></div>
              <p>{t("customer’sSignature")}</p>
            </div>
            <div className="flex flex-col gap-[20px] w-full lg:w-[380px] items-center">
              <div className="w-full flex gap-[20px] flex-col items-center">
                {signatureImageone ? (
                  <>
                    <img
                      className="m-auto"
                      width={169}
                      src={signatureImageone}
                      alt="Signature"
                    />
                    <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                      {_.startCase(_.toLower(approverName))}
                    </p>
                  </>
                ) : (
                  ""
                )}
                {signatureImageone ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSignatureImageone(null);
                    }}
                  >
                    {t("clearSignature")}
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddSignatureone();
                    }}
                    className="sigbtn"
                  >
                    <img src="/addShape.svg" alt="sign-add" />
                    {t("AddSignature")}
                  </button>
                )}
              </div>
              <div className="w-full border"></div>
              <div>
                {t("signatureOfTheApprover")}
                <span style={{ color: "red", fontSize: "1.5em" }}>*</span>
              </div>
            </div>
          </div>
          <SignatureModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSave={handleSaveSignature}
          />
          <SignatureModal
            isOpen={isModalOpenone}
            onClose={closeModalone}
            onSave={handleSaveSignatureone}
            inspector={approvalName}
          />
        </div>
        {
          roleOfUser !== 2 && (
            <div className="flex justify-center gap-10 md:mt-[60px] sm:mt-8 mt-4 mb-[5px]">
              <button
                onClick={sendDataToBackend}
                className="button-text bg-[#0072BB] text-[white] px-[20px] py-[10px] rounded-[5px]"
              >
                {saveLoading ? (
                  <div className="flex gap-2">
                    <p>Loading</p>
                    <span className="loading loading-bars loading-sm"></span>
                  </div>
                ) : (
                  " Edit Form"
                )}
              </button>
            </div>
          )
        }


      </div>
      <Footer />
    </>
  );
};

export default EditAfterControl;
