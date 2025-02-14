import React, { useState, useEffect } from "react";
import { LiaFileUploadSolid } from "react-icons/lia";
import { MdOutlineEditNote } from "react-icons/md";
import SignatureModal from "../SignatureModal";
import { approvalFormCreateService } from "../../Services/approvalFormService";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";
import ImageUpload from "../FileUpload";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getProjectByIdService } from "../../Services/projectService";
import CloseIcon from "../../Assets/iconclose.svg";
import { createFilesService } from "../../Services/filesServices";
import { t } from "../../utils/translate";
import { english, norway } from "./data";

import { MdDeleteOutline } from "react-icons/md";
import { getPriceFormByProjectIdService } from "../../Services/priceFormService";

const schema = yup.object().shape({
  workOrderNumber: yup
    .string()
    .required(t("scaffoldIdentification/NumberIsRequired")),
  date: yup.string().required(t("dateIsRequired")),
  dismantledDate: yup.string().optional(),
  location: yup.string().required(t("locationIsRequired")),
  scaffolderowner: yup.string(),
  inspectedBy: yup.string(),
  builtBy: yup.string(),
  userResponsible: yup.string(),
  scaffoldClass: yup.string(),
  AnchorCapacityUnit: yup.string(),
  totalWeightPerM2: yup.string().typeError(t("totalWeightPerM2MustBeNumber")),
  amountWallAnkers: yup.string().typeError(t("amountOfWallAnkersMustBeNumber")),
});

const styles = {
  color: "red",
  // position: 'relative',
  // top: '-22px',
};

const left = {
  left: "132px",
};

const Form = () => {
  const [newInspectionName, setNewInspectionName] = useState("");
  const [approvalForm, setApprovalForm] = useState([]);
  const { id: projectId } = useParams();
  const userId = useSelector((state) => state?.auth?.loggedInUser?._id);
  const [projectNumber, setProjectNumber] = useState("");
  const [isModalOpenCustomer, setModalOpenCustomer] = useState(false);
  const [isModalOpenInspector, setModalOpenInspector] = useState(false);
  const navigate = useNavigate();
  const [scaffoldData, setScaffoldData] = useState([]);
  // const [selectedKey, setSelectedKey] = useState("");
  // const [selectedValue, setSelectedValue] = useState("");
  const [selectedKeyScaffoldName, setSelectedKeyScaffoldName] = useState("");
  const [selectedValueScaffoldName, setSelectedValueScaffoldName] =
    useState("");
  const [classs, setClasss] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [createdApprovalId, setCreatedApprovalId] = useState("");
  const [userGuideCheckbox, setUserGuideCheckBox] = useState(false);
  const [userGuideDetail, setUserGuideDetail] = useState({
    enterCalculation: "",
    file: "",
    comment: "",
    isComment: false,
    isFile: false,
  });
  const [scaffoldStatus, setScaffoldStatus] = useState("inactive");

  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const [scaffoldName, setScaffoldName] = useState([]);
  const [isDatePopup, setIsDatePopup] = useState(false);
  // const [selectedKeyScaffoldName, setSelectedKeyScaffoldName] = useState("");
  const [otherScaffoldType, setOtherScaffoldType] = useState("");
  const inspector = useSelector((state) => state?.auth?.loggedInUser?.name);
  const scffOptions = useSelector((state) => state.scaffolds.scaffoldOptions);
  const result = Object.values(scffOptions).flatMap((item) =>
    Object.keys(item)
      .filter((key) => item[key] !== 0 && key !== "hourlyRate")
      .map((key) => key.replace(/pricePer/i, "").toLowerCase())
  );
  const [PricesTitle, setPricesTile] = useState([])

  const getProjectDetailById = async () => {
    const response = await getProjectByIdService(projectId);
    const getProjectNumber = response?.data?.project?.projectNumber;
    setProjectNumber(getProjectNumber);
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleAddSignatureCustomer = () => {
    setModalOpenCustomer(true);
  };

  const handleAddSignatureInspector = () => {
    setModalOpenInspector(true);
  };

  const closeModalCustomer = () => {
    setModalOpenCustomer(false);
  };

  const closeModalInspector = () => {
    setModalOpenInspector(false);
  };

  const handleSaveSignatureCustomer = (signatureDataUrl, customerName) => {
    setApprovalForm({
      ...approvalForm,
      customerSignature: signatureDataUrl,
      customerSignatureName: customerName,
    });
    uploadFilesAndImages(customerName, signatureDataUrl);
  };

  const handleSaveSignatureInspector = (signatureDataUrl, inspectorName) => {
    setApprovalForm({
      ...approvalForm,
      inspectorSignature: signatureDataUrl,
      inspectorSignatureName: inspectorName,
    });
    uploadFilesAndImages(inspectorName, signatureDataUrl);
  };

  const { accessLevel: roleOfUser } = useSelector((state) => state?.project);
  const handleDatePopup = () => {
    setIsDatePopup(true);
  };
  const onSubmit = async (formData) => {
    if (scaffoldName?.length < 1) {
      toast.error("Please add at Least one scaffold name");
      return;
    }

    try {
      setLoading(true);
      if (approvalForm?.inspectorSignature) {
        const data = {
          ...formData,
          projectId,
          projectNumber,
          notificationToAdminCreate: roleOfUser === 0 ? false : true,
          userId,
          ...approvalForm,
          sizeScaffold: scaffoldData,
          scaffoldName: scaffoldName,
          visual: visual,
          approvalFormImage: backgroundImage,
          userGuideDetail: { ...userGuideDetail } || null,
          status: scaffoldStatus,
        };

        if (userGuideCheckbox && !userGuideDetail?.file) {
          toast.error("Please upload the file in the User Guide");
          return;
        }

        const response = await approvalFormCreateService(data);
        setCreatedApprovalId(response?.data?._id);
        if (response?.data?.success) {
          toast.success(t("approvalFormCreatedSuccessfully"));
          setApprovalForm([]);
          reset();
          // setIsDatePopup(true)
          navigate(`/approval-listing-page/${projectId}`);
        } else {
          toast.error(t("checkAboveInformation"));
        }
      } else {
        toast.error(t("signatureICompulsoryToProcess"));
      }
    } catch (error) {
      toast.error(t("anErrorOccurredWhileProcessingTheApprovalForm"));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploadBack = (imgUrl, fileTagName) => {
    setBackgroundImage(imgUrl);
  };

  const handleDeleteDocumentBack = () => {
    setBackgroundImage("");
  };

  useEffect(() => { }, [approvalForm, inspector]);

  const uploadFilesAndImages = async (fileName, file) => {
    if (
      fileName.endsWith("Image") ||
      fileName.endsWith("approvalFormImage") ||
      fileName.endsWith("Signature") ||
      file?.includes("data:image/png") ||
      file?.includes("png") ||
      file?.includes("jpg")
    ) {
      const data = {
        userId,
        fileType: "image",
        fileName,
        file,
        projectId,
        isFileFrom: "approval_form",
      };
      // const response = await createFilesService(data);
    } else {
      const data = {
        userId,
        fileType: "file",
        fileName,
        file,
        projectId,
        isFileFrom: "approval_form",
      };
      // const response = await createFilesService(data);
    }
  };

  // const handleKeyChange = (e) => {
  //   setSelectedKey(e.target.value);
  // };

  // const handleValueChange = (e) => {
  //   setSelectedValue(e.target.value);
  // };

  // const handleSave = () => {
  //   if (isValidNumber(selectedValue) && selectedKey) {
  //     setScaffoldData([
  //       ...scaffoldData,
  //       { value: selectedValue, key: selectedKey },
  //     ]);
  //     setSelectedKey("");
  //     setSelectedValue("");
  //   } else if (!isValidNumber(selectedValue)) {
  //     toast.error("Please enter correct numeric value");
  //     return;
  //   } else if (!selectedKey) {
  //     toast.error("Please fill the Scaffold Unit");
  //     return;
  //   }
  // };

  // const handleDelete = (id) => {
  //   const updatedFormData = [...scaffoldData];
  //   const filteredData = updatedFormData?.filter((ele, ind) => ind !== id);
  //   setScaffoldData(filteredData);
  // };

  const handleKeyChangeScaffoldName = (e) => {
    setSelectedKeyScaffoldName(e.target.value);
    if (e.target.value !== "Other") setOtherScaffoldType("");
  };

  const handleValueChangeScaffoldName = (e) => {
    setSelectedValueScaffoldName(e.target.value);
  };

  const handleSaveScaffoldName = () => {
    const scaffoldNameToSave =
      selectedKeyScaffoldName === "Other"
        ? otherScaffoldType
        : selectedKeyScaffoldName;

    // Validation
    if (!selectedValueScaffoldName) {
      toast.error("Please fill the Scaffold Name");
      return;
    }
    if (!selectedKeyScaffoldName) {
      toast.error("Please fill the Scaffold Type");
      return;
    }

    // Update the scaffoldName state
    setScaffoldName((prev) => [
      ...prev,
      { value: selectedValueScaffoldName, key: scaffoldNameToSave },
    ]);

    // Reset input fields
    setSelectedValueScaffoldName("");
    setSelectedKeyScaffoldName("");
  };

  const handleDeleteScaffoldName = (id) => {
    const updatedFormData = [...scaffoldName];
    const filteredData = updatedFormData?.filter((ele, ind) => ind !== id);
    setScaffoldName(filteredData);
  };

  const getWeightForClass = (classs) => {
    switch (classs) {
      case "class1":
        setValue("totalWeightPerM2", "75 kg per m2");
        return "75 kg per m2";
      case "class2":
        setValue("totalWeightPerM2", "150 kg per m2");
        return "150 kg per m2";
      case "class3":
        setValue("totalWeightPerM2", "200 kg per m2");
        return "200 kg per m2";
      case "class4":
        setValue("totalWeightPerM2", "300 kg per m2");
        return "300 kg per m2";
      case "class5":
        setValue("totalWeightPerM2", "450 kg per m2");
        return "450 kg per m2";
      case "class6":
        setValue("totalWeightPerM2", "600 kg per m2");
        return "600 kg per m2";
      default:
        return "";
    }
  };

  function handleInput(event) {
    const inputField = event.target;
    const placeholder = inputField.nextElementSibling;

    if (placeholder) {
      // Check if placeholder exists
      if (inputField.value.trim() !== "") {
        placeholder.style.display = "none";
      } else {
        placeholder.style.display = "inline";
      }
    } else {
      console.warn("No placeholder element found next to the input field.");
    }
  }

  function moveCursorToBeginning(event) {
    const inputField = event.target.previousElementSibling;
    inputField.focus();
    inputField.setSelectionRange(0, 0);
  }

  const placeholders = document.querySelectorAll(".placeholder");

  placeholders.forEach((placeholder) => {
    placeholder.addEventListener("click", moveCursorToBeginning);
  });

  const inputFields = document.querySelectorAll(".with-placeholder");
  inputFields.forEach((inputField) => {
    inputField.addEventListener("input", handleInput);
  });

  const [visual, setVisual] = useState(
    currentLanguage === "en" ? english : norway
  );

  useEffect(() => {
    setVisual(currentLanguage === "en" ? english : norway);
  }, [currentLanguage]);

  const [showInput, setShowInput] = useState(Array(visual?.length).fill(false));
  const [editComment, setEditComment] = useState(
    Array(visual?.length).fill(false)
  );

  const [showComment, setShowComment] = useState(
    Array(visual?.length).fill(false)
  );

  useEffect(() => {
    setShowInput((prevShowInput) => [...prevShowInput, false]);
    setEditComment((prevEditComment) => [...prevEditComment, false]);
    setShowComment((prevShowComment) => [...prevShowComment, false]);
  }, [visual?.length]);

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

  const handleImageUpload = async (index, file) => {
    const updatedVisual = [...visual];
    const itemToUpdate = updatedVisual.find((item) => item.id === index);
    if (itemToUpdate) {
      itemToUpdate.documentFile = file;
    }
    setVisual(updatedVisual);
    if (file?.includes("data:image/png")) {
      const data = {
        userId,
        fileType: "file",
        file,
        projectId,
        isFileFrom: "approval_form",
        fileName: "approval_signature",
      };
      // await createFilesService(data);
    }
  };

  const handleUploadBackground = async (file) => {
    const data = {
      userId,
      fileType: "image",
      file,
      projectId,
      isFileFrom: "approval_form",
      fileName: "approval_backgroundImage",
    };
    await createFilesService(data);
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
      return t("AddComment");
    } else {
      return t("EditComment");
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

  const handleAddVisualInspection = (newValue) => {
    const customData = {
      id: visual?.length + 1,
      documentList: newValue,
      documentFile: null,
      documentComment: null,
      inspection: null,
    };

    if (!!newValue) {
      setVisual((prevState) => [...prevState, customData]);
    } else {
      toast.error("Please fill the Scaffold Inspection");
      return;
    }

    setNewInspectionName("");
  };

  function isValidNumber(value) {
    const regex = /^[0-9]+(\.[0-9]+)?$/;
    return regex.test(value);
  }

  function handleSizeChange(e, scaffoldIndex, unitType, sizeIndex, field) {
    const updatedScaffolds = [...scaffoldName];
    const measurement =
      updatedScaffolds[scaffoldIndex].measurements[unitType][sizeIndex];

    // Ensure the field is properly updated
    measurement[field] = e.target.value;

    setScaffoldName(updatedScaffolds);
  }

  function normalizeUnitType(unitType) {
    // Convert to lowercase and handle special characters
    const normalized = unitType.toLowerCase()
      .replace('²', '2')
      .replace('³', '3')
      .replace('m^2', 'm2')
      .replace('m^3', 'm3');

    // Handle case variations
    switch (normalized) {
      case 'm2':
      case 'm²':
        return 'm2';
      case 'm3':
      case 'm³':
        return 'm3';
      case 'lm':
      case 'LM':
        return 'lm';
      case 'hm':
      case 'HM':
        return 'hm';
      default:
        return normalized;
    }
  }

  function renderDynamicInputs(unitType, scaffoldIndex, sizeIndex) {
    const size = scaffoldName[scaffoldIndex].measurements?.[unitType]?.[sizeIndex] || {};

    // Normalize the unit type for comparison
    const normalizedUnitType = normalizeUnitType(unitType);

    switch (normalizedUnitType) {
      case "m3":
        return (
          <div className="flex items-center">
            <input
              type="number"
              className="!pl-2 !w-[70px] border !h-[25px] rounded-md shadow-md"
              placeholder="Length"
              value={size.length || ""}
              onChange={(e) =>
                handleSizeChange(e, scaffoldIndex, unitType, sizeIndex, "length")
              }
            />
            <div className="mx-1 font-bold text-xl">*</div>
            <input
              type="number"
              className="!pl-2 !w-[70px] border !h-[25px] rounded-md shadow-md"
              placeholder="Width"
              value={size.width || ""}
              onChange={(e) =>
                handleSizeChange(e, scaffoldIndex, unitType, sizeIndex, "width")
              }
            />
            <div className="mx-1 font-bold text-xl">*</div>
            <input
              type="number"
              className="!pl-2 !w-[70px] border !h-[25px] rounded-md shadow-md"
              placeholder="Height"
              value={size.height || ""}
              onChange={(e) =>
                handleSizeChange(e, scaffoldIndex, unitType, sizeIndex, "height")
              }
            />
          </div>
        );
      case "m2":
        return (
          <div className="flex items-center">
            <input
              type="number"
              className="!pl-2 !w-[70px] border !h-[25px] rounded-md shadow-md"
              placeholder="Length"
              value={size.length || ""}
              onChange={(e) =>
                handleSizeChange(e, scaffoldIndex, unitType, sizeIndex, "length")
              }
            />
            <div className="mx-1 font-bold text-xl">*</div>
            <input
              type="number"
              className="!pl-2 !w-[70px] border !h-[25px] rounded-md shadow-md"
              placeholder="Width"
              value={size.width || ""}
              onChange={(e) =>
                handleSizeChange(e, scaffoldIndex, unitType, sizeIndex, "width")
              }
            />
          </div>
        );
      case "lm":
        return (
          <input
            type="number"
            className="!pl-2 !w-[90px] border !h-[25px] rounded-md shadow-md"
            placeholder="Length"
            value={size.length || ""}
            onChange={(e) =>
              handleSizeChange(e, scaffoldIndex, unitType, sizeIndex, "length")
            }
          />
        );
      case "hm":
        return (
          <input
            type="number"
            className="!pl-2 !w-[90px] border !h-[25px] rounded-md shadow-md"
            placeholder="Height"
            value={size.height || ""}
            onChange={(e) =>
              handleSizeChange(e, scaffoldIndex, unitType, sizeIndex, "height")
            }
          />
        );
      default:
        return (
          <input
            type="number"
            className="!pl-2 !w-[90px] border !h-[25px] rounded-md shadow-md"
            placeholder={unitType.toUpperCase()}
            value={size.value || ""}
            onChange={(e) =>
              handleSizeChange(e, scaffoldIndex, unitType, sizeIndex, "value")
            }
          />
        );
    }
  }

  function addSizeField(scaffoldIndex, unitType) {
    const updatedScaffolds = [...scaffoldName];

    // Normalize the unit type
    const normalizedUnitType = normalizeUnitType(unitType);

    // Initialize the measurements object if not present
    if (!updatedScaffolds[scaffoldIndex].measurements) {
      updatedScaffolds[scaffoldIndex].measurements = {};
    }

    // Initialize the normalizedUnitType array if not present
    if (!updatedScaffolds[scaffoldIndex].measurements[normalizedUnitType]) {
      updatedScaffolds[scaffoldIndex].measurements[normalizedUnitType] = [];
    }

    // Add fields based on normalized unit type
    updatedScaffolds[scaffoldIndex].measurements[normalizedUnitType].push(
      normalizedUnitType === "m3"
        ? { length: "", width: "", height: "" }
        : normalizedUnitType === "m2"
          ? { length: "", width: "" }
          : normalizedUnitType === "lm"
            ? { length: "" }
            : normalizedUnitType === "hm"
              ? { height: "" }
              : { value: "", unit: unitType } // Keep original unit type for display
    );

    setScaffoldName(updatedScaffolds);
  }


  function calculateMeasurement(unitType, size) {
    if (!size || typeof size !== "object") return `0 ${unitType}`;

    // Normalize unit type to match actual values
    const normalizedUnitType =
      unitType === "m³" ? "m3" :
        unitType === "m²" ? "m2" :
          unitType === "LM" ? "lm" :
            unitType === "HM" ? "hm" :
              unitType;

    const calculations = {
      "m3": () => (Number(size?.length) || 0) * (Number(size?.width) || 0) * (Number(size?.height) || 0),
      "m2": () => (Number(size?.length) || 0) * (Number(size?.width) || 0),
      "lm": () => Number(size?.length) || 0,
      "hm": () => Number(size?.height) || 0,
      "Rent": () => Number(size?.value) || Number(size?.Rent) || 0,
      "Volume": () => Number(size?.value) || Number(size?.Volume) || 0
    };

    // Flexible calculation: prioritize defined unit logic or fallback to size.value or size[unit]
    const result = (
      calculations[normalizedUnitType]?.() ??
      Number(size?.value) ??
      Number(size?.[normalizedUnitType])
    ) || 0;

    // Return with original unit type for display consistency
    return `${result} ${unitType}`;
  }

  function calculateTotal(measurements) {
    const totals = {};

    if (measurements && typeof measurements === "object") {
      Object.keys(measurements).forEach((unitType) => {
        // Normalize unit type to match actual values
        const normalizedUnitType =
          unitType === "m³" ? "m3" :
            unitType === "m²" ? "m2" :
              unitType === "LM" ? "lm" :
                unitType === "HM" ? "hm" :
                  unitType;

        totals[unitType] = measurements[unitType]?.reduce((total, size) => {
          const calculations = {
            "m3": () => (Number(size?.length) || 0) * (Number(size?.width) || 0) * (Number(size?.height) || 0),
            "m2": () => (Number(size?.length) || 0) * (Number(size?.width) || 0),
            "lm": () => Number(size?.length) || 0,
            "hm": () => Number(size?.height) || 0,
            "Rent": () => Number(size?.value) || Number(size?.Rent) || 0,
            "Volume": () => Number(size?.value) || Number(size?.Volume) || 0
          };
          const result = (
            calculations[normalizedUnitType]?.() ??
            Number(size?.value) ??
            Number(size?.[normalizedUnitType])
          ) || 0;

          return total + result;
        }, 0);
      });
    }

    // Return totals with original unit types for display consistency
    return Object.fromEntries(
      Object.entries(totals).map(([unit, total]) => [unit, `${total} ${unit}`])
    );
  }


  function removeSizeField(scaffoldIndex, unitType, sizeIndex) {
    const updatedScaffolds = [...scaffoldName];
    if (updatedScaffolds[scaffoldIndex]?.measurements?.[unitType]) {
      updatedScaffolds[scaffoldIndex].measurements[unitType].splice(
        sizeIndex,
        1
      );
      setScaffoldName(updatedScaffolds);
    }
  }

  useEffect(() => {
    getProjectDetailById();
  }, [getProjectDetailById]);

  const handleOtherScaffoldType = (value) => {
    setOtherScaffoldType(value);
  };

  const [scaffoldOptions, setScaffoldOptions] = useState({});
  useEffect(() => {
    setScaffoldOptions(scffOptions);
  }, [scffOptions, setScaffoldOptions]);
  useEffect(() => {
    const update = (event) => {
      if (event.key === "persist:Salus-Stillas") {
        const updatedState = JSON.parse(event.newValue);
        const updatedScaffoldsOptions = JSON.parse(updatedState?.scaffolds);
        setScaffoldOptions(updatedScaffoldsOptions?.scaffoldOptions || {});
      }
    };

    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("storage", update);
    };
  }, []);

  const [rentData, setRentData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [priceFormLoading, setPriceFormLoading] = useState(false)

  const handleScaffoldForm = async (projectId) => {
    setPriceFormLoading(true);

    try {
      const responseData = await getPriceFormByProjectIdService(projectId);

      if (responseData.success) {
        setRentData(responseData?.data?.volume || []);
        if (responseData?.data?.volume?.length > 0) {
          // Extract all unique keys from the `prices` object across all items
          const allKeys = [
            ...new Set(
              responseData?.data?.volume.flatMap(item =>
                Object.keys(item.prices || {})
              )
            )
          ];
          const priceKeys = allKeys.filter(key => key.toLowerCase() !== 'rent');
          setPricesTile(priceKeys)

          const dynamicHeaders = ['Scaffold Name', ...priceKeys.map(key => `Price (${key})`)];

          // Update the headers state
          setHeaders(dynamicHeaders);
        }

      } else {
        console.error(responseData?.message);
      }
    } catch (error) {
      console.error('Error while fetching scaffold form:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setPriceFormLoading(false);
    }
  };

  useEffect(() => {
    handleScaffoldForm(projectId)
  }, [])

  return (
    <form
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="sm:pb-[50px] pb-6 border-b-[#cccccc] border-b">
        <div className="custom-container flex flex-col md:flex-row gap-[20px] justify-between items-center">
          <p className="title-text">{t("scaffoldForm")}</p>
          <div className="relative">
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center gap-[1rem] flex-wrap">
                <div
                  className="flex justify-between rounded-[5px] items-center gap-[30px] px-[10px] py-[11px] bg-[white]"
                  style={{ border: "1px solid #ccc" }}
                >
                  <p className="project-number leading-0">
                    {t("projectNumber")}
                  </p>
                  <p className="medium-title leading-0">{projectNumber}</p>
                </div>
                {backgroundImage ? (
                  <ImageUpload
                    onImageUpload={handleImageUploadBack}
                    documentFile={"approvalFormImage"}
                    handleDeleteDocument={handleDeleteDocumentBack}
                    status={true}
                  />
                ) : (
                  <ImageUpload
                    onImageUpload={handleImageUploadBack}
                    documentFile={"approvalFormImage"}
                    status={false}
                    onImageUpload1={(file) => handleUploadBackground(file)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:pb-[50px] pb-6 border-b-[#cccccc] border-b">
        <div className="custom-container ">
          <div className="flex flex-col sm:gap-[30px] gap-4 sm:mt-10 mt-5">
            <div className="flex justify-between sm:flex-row flex-col sm:gap-0 gap-6">
              <div className="flex justify-between items-center">
                <p className="medium-title">{t("scaffoldDetail")}</p>
              </div>{" "}
              <div className="flex justify-between items-center gap-4">
                <label className="text-sm font-semibold ">Active</label>
                <input
                  onChange={() => setScaffoldStatus("active")}
                  type="radio"
                  name="radio-1"
                  className="radio  !border border-[#0072bb]  radio-success"
                />

                <label className="text-sm font-semibold  ">In Active</label>
                <input
                  onChange={() => setScaffoldStatus("inactive")}
                  type="radio"
                  name="radio-1"
                  className="radio  !border border-[#0072bb] radio-error"
                  defaultChecked
                />

                <label className="text-sm font-semibold ">Disassembled</label>
                <input
                  onChange={() => setScaffoldStatus("disassembled")}
                  type="radio"
                  name="radio-1"
                  className="radio  !border border-[#0072bb] radio-warning"
                />
              </div>
            </div>

            <div className="flex justify-between sm:gap-[20px] gap-4 flex-wrap w-full items-end">
              <div className="w-full lg:w-[calc(50%-10px)] border rounded-md p-[10px]">
                <div className="flex flex-wrap gap-2 mb-[10px]">
                  {scaffoldName?.length > 0 &&
                    scaffoldName?.map((element, index) => (
                      <>
                        <div className="p-2 font-semibold rounded flex items-center gap-3 text-[12px] bg-[#0072BB1A]">
                          {element?.value} - ({element?.key})
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteScaffoldName(index);
                            }}
                          >
                            <img
                              className="text-[#0072BB]"
                              src={CloseIcon}
                              alt="edit_document"
                            />
                          </button>
                        </div>
                      </>
                    ))}
                </div>

                <div className="flex gap-3 sm:flex-row flex-col">
                  <input
                    type="text"
                    className="w-32 p-2 border rounded-md shadow-md input-without-icon"
                    onChange={(e) => handleValueChangeScaffoldName(e)}
                    placeholder={t("ScaffoldName")}
                    value={selectedValueScaffoldName}
                  />
                  <select
                    className="p-2 border rounded-md shadow-md input-without-icon"
                    onChange={(e) => handleKeyChangeScaffoldName(e)}
                    value={selectedKeyScaffoldName}
                  >
                    <option key={"1234"} disabled value={""}>
                      {"Select Scaffold"}
                    </option>

                    {rentData?.map((scaffold) => (
                      <option key={scaffold} value={scaffold?.scaffoldName}>
                        {scaffold?.scaffoldName}
                      </option>
                    ))}
                  </select>

                  {/* Conditionally render the input when "Other" is selected */}
                  {selectedKeyScaffoldName === "Other" && (
                    <input
                      type="text"
                      className="w-32 p-2 border rounded-md shadow-md"
                      placeholder={t("Enter other type")}
                      onChange={(e) => handleOtherScaffoldType(e.target.value)}
                      value={otherScaffoldType}
                    />
                  )}

                  <button
                    className="bg-[#0072BB] button-text px-[18px] py-[10px] text-white rounded-[5px]"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveScaffoldName();
                    }}
                  >
                    {t("Save")}
                  </button>
                </div>
              </div>
              <div className="w-full lg:w-[calc(50%-10px)]">
                <input
                  className="input-without-icon with-placeholder"
                  type="text"
                  required
                  {...register("workOrderNumber", {
                    required: true,
                  })}
                />
                <span className="placeholder">{t("WorkOrderNumber")}</span>
              </div>
              <div className="w-full lg:w-[calc(50%-10px)]">
                <input
                  className="input-without-icon with-placeholder"
                  type="text"
                  required
                  {...register("location", { required: true })}
                />
                <span className="placeholder">{t("specificLocation")}</span>
              </div>
              <div className="relative w-full lg:w-[calc(50%-10px)] flex gap-[10px]">
                <div className="relative w-full lg:w-[calc(50%-10px)]">
                  <label>{t("buildDay")}</label>
                  <input
                    className="input-without-icon  with-placeholder"
                    type="date"
                    // placeholder={t("dateOfInspection")}
                    required
                    {...register("date", { required: true })}
                  />
                  <span
                    className="placeholder absolute  top-0 left-0"
                    style={left}
                  ></span>
                </div>
                <div className="relative w-full lg:w-[calc(50%-10px)]">
                  <label>{t("dismantleDay")}</label>
                  <input
                    className="input-without-icon  with-placeholder"
                    type="date"
                    // placeholder={t("dateOfInspection")}
                    // required
                    {...register("dismantledDate", { required: true })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:pb-[50px] pb-6 border-b-[#cccccc]">
        <div className="custom-container">
          <div className="flex flex-col sm:gap-[30px] gap-4 sm:mt-[60px] mt-6">
            <div className="flex justify-between items-center">
              <p className="medium-title">{t("generalInformation")}</p>
            </div>
            <div className="flex justify-between items-start sm:gap-[20px] gap-4 flex-wrap w-full">
              <div className="w-full lg:w-[calc(50%-10px)]">
                <input
                  className="input-without-icon"
                  type="text"
                  placeholder={t("scaffolderOwner")}
                  {...register("scaffolderowner", { required: true })}
                />
                {errors?.scaffolderowner && (
                  <span style={styles}>{errors?.scaffolderowner?.message}</span>
                )}
              </div>
              <div className="w-full lg:w-[calc(50%-10px)]">
                <input
                  className="input-without-icon"
                  type="text"
                  placeholder={t("inspectedBy")}
                  {...register("inspectedBy", { required: true })}
                />
                {errors?.inspectedBy && (
                  <span style={styles}>{errors?.inspectedBy?.message}</span>
                )}
              </div>
              <div className="w-full lg:w-[calc(50%-10px)]">
                <input
                  className="input-without-icon"
                  type="text"
                  placeholder={t("builtBy")}
                  {...register("builtBy", { required: true })}
                />
                {errors?.builtBy && (
                  <span style={styles}>{errors?.builtBy?.message}</span>
                )}
              </div>
              <div className="w-full lg:w-[calc(50%-10px)]">
                <input
                  className="input-without-icon"
                  type="text"
                  placeholder={t("userResponsible")}
                  {...register("userResponsible", { required: true })}
                />
                {errors?.userResponsible && (
                  <span style={styles}>{errors?.userResponsible?.message}</span>
                )}
              </div>
              <div className="w-full lg:w-[calc(50%-10px)]">
                <select
                  {...register("scaffoldClass")}
                  onChange={(e) => setClasss(e.target.value)}
                  className="bg-white border border-gray-300  text-sm rounded-lg  block w-full p-[1rem] outline-none"
                >
                  <option selected>{t("selectScaffoldClass")}</option>
                  <option value="class1">{t("Class1")}</option>
                  <option value="class2">{t("Class2")}</option>
                  <option value="class3">{t("Class3")}</option>
                  <option value="class4">{t("Class4")}</option>
                  <option value="class5">{t("Class5")}</option>
                  <option value="class6">{t("Class6")}</option>
                </select>
                {errors?.scaffoldClass && (
                  <span style={styles}>{errors?.scaffoldClass?.message}</span>
                )}
              </div>
              <div className="w-full lg:w-[calc(50%-10px)]">
                <input
                  className="input-without-icon"
                  type="text"
                  value={getWeightForClass(classs)}
                  placeholder={t("maximumWeightPerm2Inkilograms")}
                  {...register("totalWeightPerM2", { required: true })}
                />
                {errors?.totalWeightPerM2 && (
                  <span style={styles}>
                    {errors?.totalWeightPerM2?.message}
                  </span>
                )}
              </div>

              <div className="w-full lg:w-[calc(50%-10px)] sx={{ m: 1 }} ">
                <div className="flex">
                  <input
                    className="input-without-icon "
                    type="text"
                    placeholder={t("WallAnchorsCapacity")}
                    {...register("wallAnchorsCapacity", { required: true })}
                    style={{ borderRadius: "5px 0px 0px 5px" }}
                  />
                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <select
                      {...register("AnchorCapacityUnit")}
                      className="border border-gray-300  text-sm rounded-r-lg  block w-full h-[50px] p-[1rem] outline-none"
                    >
                      <option selected>{t("AnchorCapacityUnit")}</option>
                      <option value="KN">KN</option>
                      <option value="KG">KG</option>
                    </select>
                    {errors?.AnchorCapacityUnit && (
                      <span style={styles}>
                        {errors?.AnchorCapacityUnit?.message}
                      </span>
                    )}
                  </div>
                </div>
                {errors?.wallAnchorsCapacity && (
                  <span style={styles}>
                    {errors?.wallAnchorsCapacity?.message}
                  </span>
                )}
              </div>
              <div className="w-full lg:w-[calc(50%-10px)]">
                <input
                  className="input-without-icon"
                  type="text"
                  placeholder={t("amountOfWallAnkers")}
                  {...register("amountWallAnkers", { required: true })}
                />
                {errors?.amountWallAnkers && (
                  <span style={styles}>
                    {errors?.amountWallAnkers?.message}
                  </span>
                )}
              </div>
              <div className=" w-full lg:w-[calc(50%-10px)]  rounded-md p-[10px]">
                <div className="flex w-full">
                  <div className="flex justify-between lg:justify-end lg:flex-row-reverse flex-row items-center w-full gap-[10px]">
                    <p className="project-number">{t("buildAccording")}</p>
                  </div>
                  <div className="flex justify-center items-center gap-[20px] lg:gap-[64px]">
                    <div className="flex sm:gap-5 gap-2">
                      <input
                        type="radio"
                        name={``}
                        value="yes"
                        checked={!userGuideCheckbox}
                        onClick={() => {
                          setUserGuideCheckBox(false);
                          setUserGuideDetail({
                            enterCalculation: "",
                            file: "",
                            comment: "",
                            isComment: false,
                            isFile: false,
                          });
                        }}
                      />{" "}
                      {t("Yes")}
                    </div>
                    <div className="flex sm:gap-5 gap-2">
                      <input
                        type="radio"
                        name={``}
                        value="no"
                        checked={userGuideCheckbox}
                        onClick={() => {
                          setUserGuideCheckBox(true);
                        }}
                      />{" "}
                      {t("No")}
                    </div>
                  </div>
                </div>
                {userGuideCheckbox && (
                  <div className="flex gap-5 mt-4 text-sm">
                    <div
                      onClick={() =>
                        setUserGuideDetail({
                          ...userGuideDetail,
                          isComment: false,
                        })
                      }
                      className={`flex flex-row gap-[10px] w-auto items-center p-0.5 ${userGuideDetail.file ? "" : `border-[1px]`
                        }   border-[#CCCCCC] px-[10px] rounded-[5px] ${userGuideDetail.file ? `bg-[#0072BB1A]` : ""
                        }`}
                    >
                      <LiaFileUploadSolid
                        backgroundColor="blue"
                        color={userGuideDetail?.file ? "#0072BB" : "black"}
                        size={20}
                      />
                      <ImageUpload
                        userGuideDetail={userGuideDetail}
                        setUserGuideDetail={setUserGuideDetail}
                        isUserGuideDetail={true}
                      />
                    </div>

                    <div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setUserGuideDetail({
                            ...userGuideDetail,
                            isComment: !userGuideDetail.isComment,
                          });
                        }}
                        className={`${userGuideDetail?.comment
                          ? "text-[#0072BB] bg-[#e5f1f8] !border-[#e5f1f8]"
                          : "text-black "
                          } flex gap-3 text-sm p-0.5 border rounded border-gray-300 px-2 cursor-pointer`}
                      >
                        {" "}
                        {userGuideDetail.comment ? (
                          <>
                            <MdOutlineEditNote color="#0072BB" size={20} />
                          </>
                        ) : (
                          <MdOutlineEditNote color="#000000" size={20} />
                        )}{" "}
                        Add Comment
                      </button>
                    </div>
                  </div>
                )}
                {userGuideDetail?.isComment && (
                  <div className=" mt-3">
                    <textarea
                      id="message"
                      rows="4"
                      className="rounded w-full border border-gray-300 p-3"
                      onChange={(e) => {
                        setUserGuideDetail({
                          ...userGuideDetail,
                          comment: e.target.value,
                        });
                      }}
                      placeholder={t("Writeyourthoughtshere...")}
                    >
                      {userGuideDetail?.comment}
                    </textarea>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {scaffoldName?.length > 0 && (
        <div className="custom-container sm:pb-[50px] pb-6 border-b-[#cccccc] border-b">
          <div className="my-5">
            <p className="text-xl font-bold">Size of Scaffold:</p>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  {/* <th>Unit</th> */}
                  <th>Size</th>
                  <th>Calculation</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {scaffoldName?.map((element, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>
                      {element?.value} - ({element?.key})
                    </td>
                    <td>
                      {console.log("PricesTitle", PricesTitle)}
                      {PricesTitle?.map((unitType) => {
                        const normalizedType = normalizeUnitType(unitType);
                        return element?.measurements?.[normalizedType]?.map(
                          (size, sizeIndex) => (
                            <div
                              key={`${normalizedType}-${sizeIndex}`}
                              className="flex items-center"
                            >
                              {renderDynamicInputs(
                                normalizedType,
                                index,
                                sizeIndex
                              )}
                              <button
                                type="button"
                                className="ml-2 text-red-500"
                                onClick={() =>
                                  removeSizeField(index, normalizedType, sizeIndex)
                                }
                              >
                                <MdDeleteOutline className="text-[20px]" />
                              </button>
                            </div>
                          )
                        );
                      })}
                      <select
                        className="mt-2 text-[#0072BB] border px-2 py-2 mr-1 rounded-xl border-[#0072BB]"
                        onChange={(e) => addSizeField(index, e.target.value)}
                      >
                        <option value="" disabled selected>
                          Select Size
                        </option>
                        {rentData?.map((unitType) => {
                          // Only proceed if scaffoldName matches and is not rent (case-insensitive)
                          if (
                            unitType.scaffoldName === element?.key &&
                            unitType.scaffoldName.toLowerCase() !== 'rent'
                          ) {
                            return Object.keys(unitType?.prices)
                              .filter(key => key.toLowerCase() !== 'volume' && key.toLowerCase() !== 'rent') // Filter out volume and rent from prices
                              .map((key) => (
                                <option key={key} value={key}>
                                  Add {key} Size
                                </option>
                              ));
                          }
                          return null;
                        })}
                      </select>
                    </td>
                    <td>
                      {PricesTitle?.map((unitType) => {
                        const normalizedType = normalizeUnitType(unitType);
                        return element?.measurements?.[normalizedType]?.map(
                          (size, sizeIndex) => (
                            <div
                              key={`${normalizedType}-${sizeIndex}`}
                              className="border p-1 rounded-xl flex flex-col mb-2 border-[#0072BB]"
                            >
                              {calculateMeasurement(normalizedType, size)}
                            </div>
                          )
                        );
                      })}
                    </td>
                    <td>
                      {PricesTitle?.filter(
                        (unitType) => {
                          const normalizedType = normalizeUnitType(unitType);
                          return element?.measurements?.[normalizedType];
                        }
                      ).map((unitType) => {
                        const normalizedType = normalizeUnitType(unitType);
                        const totalValue = calculateTotal(
                          element?.measurements
                        )?.[normalizedType];

                        return (
                          <div
                            key={normalizedType}
                            className="border p-1 rounded-xl flex flex-col mb-2 border-[#0072BB]"
                          >
                            {totalValue || `0 ${unitType}`}
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="sm:pb-[50px] pb-6 border-b-[#cccccc] border-b">
        <div className="custom-container">
          <div className="flex flex-col sm:gap-[30px] gap-4 sm:mt-[60px] mt-6">
            <div className="flex justify-between items-center">
              <p className="medium-title">{t("visualInspection")}</p>
            </div>
            <div className="flex justify-between items-center gap-x-[100px] flex-wrap w-full">
              {visual.map((item, index) => (
                <div className="block w-full lg:w-[calc(50%-50px)] sm:px-[20px] sm:py-3 py-2 justify-between items-start">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full">
                    <div className="flex justify-between lg:justify-end lg:flex-row-reverse flex-row items-center w-full gap-[10px]">
                      <p className="project-number">{item?.documentList}</p>
                    </div>
                    <div className="flex justify-center items-center gap-[20px] lg:gap-[64px]">
                      <div className="flex sm:gap-5 gap-2">
                        <input
                          type="radio"
                          name={`option-${index}`}
                          value="yes"
                          checked={item.inspection === "yes" || ""}
                          onChange={() =>
                            handleRadioChange(item.id, "yes", item?.inspection)
                          }
                        />{" "}
                        {t("Yes")}
                      </div>
                      <div className="flex sm:gap-5 gap-2">
                        <input
                          type="radio"
                          name={`option-${index}`}
                          value="no"
                          checked={item.inspection === "no"}
                          onChange={() =>
                            handleRadioChange(item.id, "no", item?.inspection)
                          }
                        />{" "}
                        {t("No")}
                      </div>
                      <div className="flex sm:gap-5 gap-2">
                        <input
                          type="radio"
                          name={`option-${index}`}
                          value="NA"
                          checked={item.inspection === "na"}
                          onChange={() =>
                            handleRadioChange(item.id, "na", item?.inspection)
                          }
                        />{" "}
                        N/A
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex flex-row mt-[10px] gap-2 sm:gap-[1rem] flex-wrap sm:flex-nowrap leading-[28px] text-[12px] font-[400] ${showInput[index] ? "" : "hidden"
                      }`}
                  >
                    <div
                      className={`flex flex-row gap-[10px] items-center  ${item.documentFile ? "" : `border-[1px]`
                        }   border-[#CCCCCC] px-[10px] rounded-[5px] ${item.documentFile ? `bg-[#0072BB1A]` : ""
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
                      className={`flex flex-row gap-[10px] items-center  ${editComment?.[index] ? "" : `border-[1px]`
                        } border-[#CCCCCC] px-[10px] rounded-[5px] ${editComment?.[index] ? `bg-[#0072BB1A]` : ""
                        }`}
                    >
                      {editComment?.[index] ? (
                        <>
                          <MdOutlineEditNote color="#0072BB" size={20} />
                        </>
                      ) : (
                        <MdOutlineEditNote color="#000000" size={20} />
                      )}

                      <button
                        className={`${editComment?.[index]
                          ? `text-[#0072BB]`
                          : "text-[black]"
                          } ${editComment[index] ? `text-[14px]` : ""}`}
                        onClick={(event) => {
                          event.preventDefault();
                          handleAddCommentClick(index);
                        }}
                      >
                        {editComment?.[index]
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
                      className={`flex flex-col mt-[10px] gap-[1rem] leading-[28px] text-[12px] font-[400] ${showComment[index] ? "" : "hidden"
                        }`}
                    >
                      <label
                        for="message"
                        className="block text-sm font-medium  dark:text-black"
                      >
                        {t("Yourmessage")}
                      </label>
                      <textarea
                        id="message"
                        rows="4"
                        className="rounded border border-gray-300 p-3"
                        onChange={handleInputChange}
                        // {...register(`${documentComment[index]}`)}
                        placeholder={t("Writeyourthoughtshere...")}
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
                        {t("Save")}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col lg:flex-row gap-3 lg:space-x-4 justify-end w-[42.5%] mt-3 ml-4">
                <input
                  placeholder={t("Entervisualinspection")}
                  className="border rounded-md input-without-icon w-full px-2.5 py-1 text-sm text-gray-700"
                  onChange={(e) => setNewInspectionName(e.target.value)}
                />

                <button
                  className="bg-[#0072BB] px-[15px] py-[8px] text-white rounded-[5px] m-0"
                  onClick={(event) => {
                    event.preventDefault();
                    handleAddVisualInspection(newInspectionName);
                    setNewInspectionName("");
                  }}
                >
                  {t("Add")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="custom-container">
        <div className="flex flex-col sm:gap-[30px] gap-4 sm:mt-[60px] mt-6">
          <div className="flex justify-between items-end">
            <p className="w-full lg:w-[calc(50%-10px)] medium-title">
              {t("areThereAnySpecific")}
            </p>
            <p className="w-full lg:w-[calc(50%-10px)] medium-title hidden lg:block">
              {t("comments")}
            </p>
          </div>
          <div className="flex justify-between sm:gap-[20px] sm:gap-4 flex-wrap w-full">
            <div className="w-full lg:w-[calc(50%-10px)]">
              <textarea
                className="w-full p-[20px] mb-3 border rounded-[5px]"
                name="demo1"
                id="demo1"
                rows="3"
                placeholder={t("writeHere")}
                {...register("followUp", { required: true })}
              ></textarea>
            </div>
            <p className="w-full lg:w-[calc(50%-10px)] medium-title block lg:hidden mb-2">
              {t("comments")}
            </p>
            <div className="w-full lg:w-[calc(50%-10px)]">
              <textarea
                className="w-full p-[20px] border rounded-[5px]"
                name="demo1"
                id="demo1"
                rows="3"
                placeholder={t("writeHere")}
                {...register("comments", { required: true })}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:gap-[30px] gap-4 sm:mt-[60px] mt-6">
          <div className="flex justify-between items-center">
            <p className="medium-title">{t("signature")}</p>
          </div>
          <div className="flex flex-col lg:flex-row sm:gap-[50px] gap-6 justify-between items-center lg:pl-[100px]">
            <div className="flex flex-col sm:gap-[20px] gap-3 w-full lg:w-[380px] items-center">
              {approvalForm?.customerSignature ? (
                <>
                  <img
                    className="m-auto"
                    width={169}
                    src={approvalForm.customerSignature}
                    alt="Signature"
                  />
                  <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                    {_.startCase(
                      _.toLower(approvalForm?.customerSignatureName)
                    )}
                  </p>
                  <button
                    onClick={() =>
                      setApprovalForm({
                        ...approvalForm,
                        customerSignature: null,
                      })
                    }
                  >
                    {t("clearSignature")}
                  </button>
                </>
              ) : (
                <div
                  className="flex flex-col cursor-pointer justify-center  gap-[20px] items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddSignatureCustomer();
                  }}
                >
                  <img src="/addShape.svg" alt="sign-add" />
                  <button>{t("AddSignature")}</button>
                </div>
              )}
              <div className="w-full border"></div>
              <p>{t("signatureOfTheCustomer")}</p>
            </div>
            <div className="flex flex-col sm:gap-[20px] gap-3 w-full lg:w-[380px] items-center">
              <div className="w-full flex gap-[20px] flex-col items-center">
                {approvalForm?.inspectorSignature ? (
                  <>
                    <img
                      className="m-auto"
                      width={169}
                      src={approvalForm?.inspectorSignature}
                      alt="Signature"
                    />
                    <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                      {_.startCase(
                        _.toLower(approvalForm?.inspectorSignatureName)
                      )}
                    </p>
                    <button
                      onClick={() =>
                        setApprovalForm({
                          ...approvalForm,
                          inspectorSignature: null,
                          inspectorSignatureName: inspector,
                        })
                      }
                    >
                      {t("clearSignature")}
                    </button>
                  </>
                ) : (
                  <div
                    className="flex flex-col cursor-pointer justify-center  gap-[20px] items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddSignatureInspector();
                    }}
                  >
                    <img src="/addShape.svg" alt="sign-add" />
                    <button>{t("AddSignature")}</button>
                  </div>
                )}
              </div>
              <div className="w-full border"></div>
              <div>
                {t("signatureOfTheInspector")}
                <span style={{ color: "red", fontSize: "1.5em" }}>*</span>
              </div>
            </div>
          </div>
          <SignatureModal
            isOpen={isModalOpenCustomer}
            onClose={closeModalCustomer}
            onSave={handleSaveSignatureCustomer}
          />
          <SignatureModal
            isOpen={isModalOpenInspector}
            onClose={closeModalInspector}
            onSave={handleSaveSignatureInspector}
            inspector={inspector}
          />
        </div>
      </div>

      <div className="text-center md:mt-[100px] sm:mt-12 mt-6">
        <button
          type="submit"
          // onClick={handleDatePopup}
          className="button-text bg-[#0072BB] text-[white] px-[20px] py-[10px] rounded-[5px]"
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              Loading
              <span className="loading loading-bars loading-sm"></span>
            </div>
          ) : (
            t("Save")
          )}
        </button>
      </div>
    </form>
  );
};

export default Form;
