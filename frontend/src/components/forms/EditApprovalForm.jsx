import React, { useEffect, useState } from "react";
import { LiaFileUploadSolid } from "react-icons/lia";
import { MdOutlineDeleteOutline, MdOutlineEditNote } from "react-icons/md";
import SignatureModal from "../SignatureModal";
import {
  approvalFormUpdateService,
  getApprovalFormByIdService,
} from "../../Services/approvalFormService";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import TopSection from "./TopSection";
import { toast } from "react-toastify";
import ImageUpload from "../FileUpload";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import _ from "lodash";
import CloseIcon from "../../Assets/iconclose.svg";
import { t } from "../../utils/translate";
import { createFilesService } from "../../Services/filesServices";
import { VscEdit } from "react-icons/vsc";
import { MdDeleteOutline } from "react-icons/md";
import { getPriceFormByProjectIdService } from "../../Services/priceFormService";

const schema = yup.object().shape({
  workOrderNumber: yup
    .string()
    .required(t("scaffoldIdentification/NumberIsRequired")),
  date: yup.string().required(t("dateIsRequired")),
  dismantledDate: yup.string(),
  location: yup.string().required(t("locationIsRequired")),
  scaffolderowner: yup.string(),
  inspectedBy: yup.string(),
  builtBy: yup.string(),
  userResponsible: yup.string(),
  scaffoldClass: yup.string(),
  totalWeightPerM2: yup.string().typeError(t("totalWeightPerM2MustBeNumber")),
  amountWallAnkers: yup.string().typeError(t("amountOfWallAnkersMustBeNumber")),
});

const styles = {
  color: "red",
};

let english = [
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
];

let norway = [
  {
    id: 1,
    documentList: "Stillas skilting",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 2,
    documentList: "Dimensjonering",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 3,
    documentList: "Bærende konstruksjon",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 4,
    documentList: "Tilgang og sikker bruk",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 5,
    documentList: "Stillasgulv",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 6,
    documentList: "Rekkverk",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 7,
    documentList: "Sprutbeskyttelse / rekkverk",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 8,
    documentList: "Håndrekkverk",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 9,
    documentList: "Tak sikkerhet",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 10,
    documentList: "Midtrekkverk",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 11,
    documentList: "Presenning / nett",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 12,
    documentList: "Tåbrett",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 13,
    documentList: "Fundament",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 14,
    documentList: "Forsterkning",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 15,
    documentList: "Forankring",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 16,
    documentList: "Forankringsbeslag",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
];

const EditApprovalForm = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const inspector = useSelector((state) => state?.auth?.loggedInUser?.name);
  const scffOptions = useSelector((state) => state.scaffolds.scaffoldOptions);

  const result = Object.values(scffOptions).flatMap((item) =>
    Object.keys(item)
      .filter((key) => item[key] !== 0 && key !== "hourlyRate")
      .map((key) => key.replace(/pricePer/i, "").toLowerCase())
  );

  const [PricesTitle, setPricesTile] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [approvalForm, setApprovalForm] = useState([]);
  const [url, setUrl] = useState("");
  const approvalFormId = useParams().id;
  const userId = useSelector((state) => state?.auth?.loggedInUser?._id);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [newInspectionName, setNewInspectionName] = useState("");
  const [isModalOpenCustomer, setModalOpenCustomer] = useState(false);
  const [isModalOpenInspector, setModalOpenInspector] = useState(false);
  const [editData, setEditData] = useState();
  const { id: projectId } = useParams();
  const [newProjectId, setNewProjectId] = useState(null);
  const [scaffoldData, setScaffoldData] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedKeyScaffoldName, setSelectedKeyScaffoldName] = useState("");
  const [selectedValueScaffoldName, setSelectedValueScaffoldName] =
    useState("");
  const [classs, setClasss] = useState("");
  const [editProjectIcon, setEditProjectIcon] = useState(true);
  const [editGeneral, setEditGeneral] = useState(true);
  const [editVisual, setEditVisual] = useState(true);
  const [editSignature, setEditSignature] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState("");

  const [scaffoldStatus, setScaffoldStatus] = useState("");
  const [userGuideCheckbox, setUserGuideCheckBox] = useState(false);
  const [userGuideDetail, setUserGuideDetail] = useState({
    enterCalculation: "",
    file: "",
    comment: "",
    isComment: false,
    isFile: false,
  });

  const [scaffoldName, setScaffoldName] = useState([
  ]);

  const handleImageUploadBack = (imgUrl, fileTagName) => {
    setBackgroundImage(imgUrl);
  };

  const handleDeleteDocumentBack = () => {
    setBackgroundImage("");
  };

  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    getApprovalFormById();
  }, [approvalFormId]);

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

  const handleSaveSignatureCustomer = (signatureDataUrl, name) => {
    setApprovalForm({
      ...approvalForm,
      customerSignature: signatureDataUrl,
      customerSignatureName: name,
    });
    uploadFilesAndImages(name, signatureDataUrl);
  };

  const handleSaveSignatureInspector = (signatureDataUrl, name) => {
    setApprovalForm({
      ...approvalForm,
      inspectorSignature: signatureDataUrl,
      inspectorSignatureName: name,
    });
    uploadFilesAndImages(name, signatureDataUrl);
  };

  // In the getApprovalFormById function, modify the date handling:

  async function getApprovalFormById() {
    try {
      setLoading(true);
      const response = await getApprovalFormByIdService(approvalFormId);
      const data = response?.data?.data[0];
      setNewProjectId(data?.projectId);
      setUserGuideDetail(data?.userGuideDetail);
      setVisual(data?.visual);
      setScaffoldStatus(data?.status);
      setEditData(data);
      setBackgroundImage(data?.approvalFormImage);

      if (data) {
        // Format both date and dismantledDate
        const formattedDate = data.date ? new Date(data.date).toISOString().slice(0, 10) : "";
        const formattedDismantledDate = data.dismantledDate ? new Date(data.dismantledDate).toISOString().slice(0, 10) : "";

        data.date = formattedDate;
        data.dismantledDate = formattedDismantledDate;
      }

      setScaffoldData(data?.sizeScaffold || []);
      setScaffoldName(data?.scaffoldName || []);
      setApprovalForm(data);
      setUrl(data?.approvalForm);
    } catch (Error) {
      return Error;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reset({ ...editData });
  }, [editData]);

  const initialValues = {};
  Object.keys(schema.fields).forEach((key) => {
    initialValues[key] = true;
  });

  const { accessLevel: roleOfUser } = useSelector((state) => state?.project);

  const onSubmit = async (approvalEditData) => {
    try {
      setIsLoading(true);
      if (approvalForm?.inspectorSignature) {
        const data = {
          ...approvalEditData,
          visual: visual,
          sizeScaffold: scaffoldData || [],
          scaffoldName: scaffoldName || [],
          notificationToAdminEdit: roleOfUser === 0 ? false : true,
          approvalFormImage: backgroundImage
            ? backgroundImage
            : approvalEditData?.approvalFormImage,
          userGuideDetail,
          approvalFormId,
          status: scaffoldStatus,
        };

        if (userGuideCheckbox && !userGuideDetail?.file) {
          toast.error("Please upload the file in the User Guide");
          return;
        }

        const response = await approvalFormUpdateService(data, approvalFormId);
        if (response?.data?.success) {
          toast.success(t("updatedsuccessfully"));
          navigate(`/approval-listing-page/${editData?.projectId}`);
        } else {
          toast.error(
            `There is an error: ${response?.response?.data?.message}`
          );
        }
      } else {
        toast.error(t("signatureICompulsoryToProcess"));
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyChange = (e) => {
    setSelectedKey(e.target.value);
  };

  const handleValueChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleSave = () => {
    if (isValidNumber(selectedValue) && selectedKey) {
      setScaffoldData([
        ...scaffoldData,
        { value: selectedValue, key: selectedKey },
      ]);
      setSelectedKey("");
      setSelectedValue("");
    } else if (!isValidNumber(selectedValue)) {
      toast.error("Please enter correct numeric value");
      return;
    } else if (!selectedKey) {
      toast.error("Please fill the Scaffold Unit");
      return;
    }
  };

  const handleDelete = (id) => {
    if (!editGeneral) {
      const updatedFormData = [...scaffoldData];
      const filteredData = updatedFormData?.filter((ele, ind) => ind !== id);
      setScaffoldData(filteredData);
    }
  };
  const handleKeyChangeScaffoldName = (e) => {
    setSelectedKeyScaffoldName(e.target.value);
  };

  const handleValueChangeScaffoldName = (e) => {
    setSelectedValueScaffoldName(e.target.value);
  };

  const handleSaveScaffoldName = () => {
    if (selectedKeyScaffoldName && selectedValueScaffoldName) {
      setScaffoldName([
        ...scaffoldName,
        { value: selectedValueScaffoldName, key: selectedKeyScaffoldName },
      ]);
      setSelectedKeyScaffoldName("");
      setSelectedValueScaffoldName("");
    }
  };

  const handleDeleteScaffoldName = (id) => {
    if (!editProjectIcon) {
      const updatedFormData = [...scaffoldName];
      const filteredData = updatedFormData?.filter((ele, ind) => ind !== id);
      setScaffoldName(filteredData);
    }
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
  const uploadFilesAndImages = async (fileName, file) => {
    if (
      fileName.endsWith("Image") ||
      fileName.endsWith("approvalFormImage") ||
      fileName.endsWith("Signature") ||
      file?.includes("data:image/png") ||
      file?.includes("png") ||
      file?.includes("jpg")
    ) {
      const data = { userId, fileType: "image", fileName, file, projectId: newProjectId };
      await createFilesService(data);
    } else {
      const data = { userId, fileType: "file", fileName, file, projectId: newProjectId };
      await createFilesService(data);
    }
  };
  function handleInput(event) {
    const inputField = event.target;
    const placeholder = inputField.nextElementSibling;

    if (inputField.value.trim() !== "") {
      placeholder.style.display = "none";
    } else {
      placeholder.style.display = "inline";
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
  const [showInput, setShowInput] = useState(Array(visual.length).fill(false));
  const [editComment, setEditComment] = useState(
    Array(visual.length).fill(false)
  );
  const [showComment, setShowComment] = useState(
    Array(visual.length).fill(false)
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
    if (
      file?.includes("data:image/png") ||
      file?.includes("png") ||
      file?.includes("jpg")
    ) {
      const data = { userId, fileType: "image", file, projectId: newProjectId };
      // await createFilesService(data);
    } else {
      const data = { userId, fileType: "file", file, projectId: newProjectId };
      // await createFilesService(data);
    }
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
      return t("Edit Comment");
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
      id: visual.length + 1,
      documentList: newValue,
      documentFile: null,
      documentComment: null,
      inspection: null,
    };
    setVisual((prevState) => [...prevState, customData]);
    setNewInspectionName("");
  };

  useEffect(() => {
    const updatedShowInput = visual.map(
      (item) => item.inspection === "yes" || item.inspection === "no"
    );
    const updatedShowComment = visual.map(
      (item) => item.documentComment !== null
    );
    setEditComment(updatedShowComment);
    setShowInput(updatedShowInput);
  }, [visual]);

  function isValidNumber(value) {
    const regex = /^[0-9]+(\.[0-9]+)?$/;
    return regex.test(value);
  }

  function handleUnitChange(e, scaffoldIndex, unitType) {
    const updatedScaffolds = [...scaffoldName];

    if (!updatedScaffolds[scaffoldIndex].measurements) {
      updatedScaffolds[scaffoldIndex].measurements = {
        m2: [],
        m3: [],
        lm: [],
        hm: [],
      };
    }

    if (!updatedScaffolds[scaffoldIndex].measurements[unitType]) {
      updatedScaffolds[scaffoldIndex].measurements[unitType] = [];
    }
    updatedScaffolds[scaffoldIndex].measurements[unitType].push(
      unitType === "m3"
        ? { length: "", width: "", height: "" }
        : unitType === "m2"
          ? { length: "", width: "" }
          : { length: "" }
    );
    setScaffoldName(updatedScaffolds);
  }

  function handleSizeChange(e, scaffoldIndex, unitType, sizeIndex, field) {
    const updatedScaffolds = [...scaffoldName];
    const measurement =
      updatedScaffolds[scaffoldIndex].measurements[unitType][sizeIndex];

    measurement[field] = e.target.value;

    setScaffoldName(updatedScaffolds);
  }

  function normalizeUnitType(unitType) {
    const normalized = unitType.toLowerCase()
      .replace('²', '2')
      .replace('³', '3')
      .replace('m^2', 'm2')
      .replace('m^3', 'm3');

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

    const normalizedUnitType = normalizeUnitType(unitType);

    if (!updatedScaffolds[scaffoldIndex].measurements) {
      updatedScaffolds[scaffoldIndex].measurements = {};
    }

    if (!updatedScaffolds[scaffoldIndex].measurements[normalizedUnitType]) {
      updatedScaffolds[scaffoldIndex].measurements[normalizedUnitType] = [];
    }
    updatedScaffolds[scaffoldIndex].measurements[normalizedUnitType].push(
      normalizedUnitType === "m3"
        ? { length: "", width: "", height: "" }
        : normalizedUnitType === "m2"
          ? { length: "", width: "" }
          : normalizedUnitType === "lm"
            ? { length: "" }
            : normalizedUnitType === "hm"
              ? { height: "" }
              : { value: "", unit: unitType }
    );

    setScaffoldName(updatedScaffolds);
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

  function calculateMeasurement(unitType, size) {
    if (!size || typeof size !== "object") return `0 ${unitType}`;
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

    const result = (
      calculations[normalizedUnitType]?.() ??
      Number(size?.value) ??
      Number(size?.[normalizedUnitType])
    ) || 0;

    return `${result} ${unitType}`;
  }

  function calculateTotal(measurements) {
    const totals = {};

    if (measurements && typeof measurements === "object") {
      Object.keys(measurements).forEach((unitType) => {

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


    return Object.fromEntries(
      Object.entries(totals).map(([unit, total]) => [unit, `${total} ${unit}`])
    );
  }

  const [rentData, setRentData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [priceFormLoading, setPriceFormLoading] = useState(false)

  const handleScaffoldForm = async (projectId) => {
    setPriceFormLoading(true);

    try {
      const responseData = await getPriceFormByProjectIdService(projectId);

      if (responseData.success) {
        setRentData(responseData?.data?.rent || []);
        if (responseData?.data?.rent?.length > 0) {

          const allKeys = [
            ...new Set(
              responseData?.data?.rent.flatMap(item =>
                Object.keys(item.prices || {})
              )
            )
          ];
          const priceKeys = allKeys.filter(key => key.toLowerCase() !== 'volume');
          setPricesTile(priceKeys)

          const dynamicHeaders = ['Scaffold Name', ...priceKeys.map(key => `Price (${key})`)];

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
    handleScaffoldForm(newProjectId)
  }, [newProjectId])

  return (
    <>
      <Header />
      <TopSection
        keys={projectId}
        title={t("controlForm")}
        breadcrumData={[t("controlForm"), t("approvalForm")]}
      />
      {loading ? (
        <div className="text-center ">
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
            <h1 className="text-[20px] font-[700] text-[#0072BB]">
              {t("loading")}
            </h1>
          </div>
        </div>
      ) : (
        <>
          <div className=" pb-[50px] border-b-[#cccccc] border-b">
            <div className="custom-container flex flex-col md:flex-row gap-[20px] justify-between items-center">
              <p className="title-text">{t("editYourScaffoldHere")}</p>
              <div className="relative">
                <div className="flex justify-between items-center">
                  <div className="flex justify-center items-center gap-[1rem]">
                    <p className="project-number leading-0">
                      {t("projectNumber")}
                    </p>
                    <p className="medium-title leading-0">
                      {editData?.projectNumber}
                    </p>

                    <div className="flex justify-center items-center gap-[1px] bg-[#0072BB] rounded-[5px] ">
                      <img
                        src="/pdf_logo.svg"
                        className="img-fluid rounded-top w-[20px] md:w-[24px]"
                        alt=""
                        style={{ marginLeft: "10px" }}
                      />
                      <a

                        href={`/approval-form-pdf/${approvalFormId}`}
                        target="blank"
                        className="md:px-[12px] md:py-[6px] font-medium text-[#fff] md:text-[20px]  text-nowrap px-1 py-1 !text-[18px]"
                      >
                        {"View PDF"}
                      </a>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <form
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <div className=" pb-[50px] border-b-[#cccccc] border-b">
                <div className="custom-container">
                  <div className="flex flex-col gap-[30px] mt-10">
                    <div className="flex flex-col sm:flex-row justify-between  items-center sm:mt-0 gap-3 !sm:text-md !text-xs">
                      <div className="flex gap-4">
                        <div>
                          <div
                            className="flex justify-between rounded-[5px] items-center md:gap-[30px] md:px-[10px] md:py-[11px] bg-[white] px-2 py-2 gap-2 text-nowrap text-sm"
                            style={{ border: "1px solid #ccc" }}
                          >
                            <div className="flex justify-between ">
                              <div className="flex justify-between items-center">
                                <p className="medium-title">
                                  {t("scaffoldDetail")}
                                </p>
                              </div>{" "}
                            </div>
                          </div>
                        </div>

                        {roleOfUser === 0 && <button
                          onClick={(event) => {
                            event?.preventDefault();
                            setEditProjectIcon(!editProjectIcon);
                          }}
                        >
                          <VscEdit
                            size={24}
                            className={`${editProjectIcon
                              ? "text-red-500"
                              : "text-green-600"
                              }`}
                          />
                        </button>}
                      </div>

                      <div className="flex justify-center items-center gap-[1rem] text-nowrap">
                        <div>
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="px-3 py-3 rounded-md bg-[#0072BB] text-white font-bold cursor-text"
                          >
                            Scff. Id No.{" "}
                            {editData?.scaffoldIdentificationNumber}
                          </button>
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
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center gap-4 max-w-[200px]">
                      <label className="text-sm font-semibold text-nowrap">
                        Active
                      </label>
                      <input
                        disabled={roleOfUser !== 0}
                        onChange={() => setScaffoldStatus("active")}
                        type="radio"
                        name="radio-1"
                        className="radio  !border border-[#0072bb]  radio-success"
                        checked={scaffoldStatus === "active"}
                      />

                      <label className="text-sm font-semibold text-nowrap ">
                        In Active
                      </label>
                      <input
                        disabled={roleOfUser !== 0}
                        onChange={() => setScaffoldStatus("inactive")}
                        type="radio"
                        name="radio-1"
                        className="radio  !border border-[#0072bb] radio-error"
                        checked={scaffoldStatus === "inactive"}
                      />

                      <label className="text-sm font-semibold text-nowrap">
                        Disassembled
                      </label>
                      <input
                        disabled={roleOfUser !== 0}
                        onChange={() => setScaffoldStatus("disassembled")}
                        type="radio"
                        name="radio-1"
                        className="radio  !border border-[#0072bb] radio-warning"
                        checked={scaffoldStatus === "disassembled"}
                      />
                    </div>
                    <div className="flex justify-between items-end gap-[20px] flex-wrap w-full">
                      <div className="w-full lg:w-[calc(50%-10px)] border rounded-md  p-[10px]">
                        <div className="flex flex-wrap gap-2 mb-[10px]">
                          {scaffoldName?.length > 0 &&
                            scaffoldName?.map((element, index) => (
                              <>
                                <div className="p-2 rounded flex items-center gap-3 text-[12px] bg-[#0072BB1A]">
                                  <div className="input-without-icon">
                                    {element?.value} - ({element?.key})
                                  </div>

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
                            value={selectedValueScaffoldName}
                            onChange={handleValueChangeScaffoldName}
                            placeholder={t("ScaffoldName")}
                            disabled={editProjectIcon}
                          />
                          <select
                            className="p-2 border rounded-md shadow-md input-without-icon"
                            value={selectedKeyScaffoldName}
                            onChange={handleKeyChangeScaffoldName}
                            disabled={editProjectIcon}
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
                          <button
                            className={`${!editProjectIcon ? "bg-[#0072BB]" : "bg-[gray]"
                              } button-text px-[18px] py-[10px] text-white rounded-[5px]`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSaveScaffoldName();
                            }}
                            disabled={editProjectIcon}
                          >
                            {t("Save")}
                          </button>
                        </div>
                      </div>
                      <div className="w-full lg:w-[calc(50%-10px)]">
                        <input
                          className="input-without-icon with-placeholder"
                          type="text"
                          {...register("workOrderNumber", {
                            required: true,
                          })}
                          disabled={editProjectIcon}
                        />
                        <span
                          className="placeholder"
                          style={
                            editData?.scaffoldIdentificationNumber
                              ? { display: "none" }
                              : {}
                          }
                        >
                          {t("WorkOrderNumber")}
                        </span>
                      </div>
                      <div className="w-full lg:w-[calc(50%-10px)]">
                        <input
                          className="input-without-icon with-placeholder"
                          type="text"
                          {...register("location", { required: true })}
                          disabled={editProjectIcon}
                        />
                        <span
                          className="placeholder"
                          style={editData?.location ? { display: "none" } : {}}
                        >
                          {t("specificLocation")}
                        </span>
                      </div>
                      <div className="relative w-full lg:w-[calc(50%-10px)] flex gap-[10px]">
                        <div className="relative w-full lg:w-[calc(50%-5px)]">
                          <label>{t("buildDay")}</label>
                          <input
                            className="input-without-icon with-placeholder"
                            type="date"
                            {...register("date", { required: true })}
                            disabled={editProjectIcon}
                          />
                          <span
                            className="placeholder"
                            style={editData?.date ? { display: "none" } : {}}
                          ></span>
                        </div>
                        <div className="relative w-full lg:w-[calc(50%-5px)]">
                          <label>{t("dismantleDay")}</label>
                          <input
                            className="input-without-icon with-placeholder"
                            type="date"
                            {...register("dismantledDate")}
                            disabled={editProjectIcon}
                          />
                          <span
                            className="placeholder"
                            style={editData?.dismantledDate ? { display: "none" } : {}}
                          ></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className=" pb-[50px] border-b-[#cccccc] border-b">
                <div className="custom-container">
                  <div className="flex flex-col gap-[30px] mt-[60px]">
                    <div className="flex gap-4">
                      <p className="medium-title">{t("generalInformation")}</p>
                      {roleOfUser === 0 && <button
                        onClick={(event) => {
                          event?.preventDefault();
                          setEditGeneral(!editGeneral);
                        }}
                      >
                        <VscEdit
                          size={24}
                          className={`${editGeneral ? "text-red-500" : "text-green-600"
                            }`}
                        />
                      </button>}
                    </div>
                    <div className="flex justify-between items-center gap-[20px] flex-wrap w-full">
                      <div className="w-full lg:w-[calc(50%-10px)]">
                        <input
                          className="input-without-icon"
                          type="text"
                          placeholder={t("scaffolderOwner")}
                          {...register("scaffolderowner", { required: true })}
                          disabled={editGeneral}
                        />
                        {errors?.scaffolderowner && (
                          <span style={styles}>
                            {errors?.scaffolderowner?.message}
                          </span>
                        )}
                      </div>

                      <div className="w-full lg:w-[calc(50%-10px)]">
                        <input
                          className="input-without-icon"
                          type="text"
                          placeholder={t("inspectedBy")}
                          {...register("inspectedBy", { required: true })}
                          disabled={editGeneral}
                        />
                        {errors?.inspectedBy && (
                          <span style={styles}>
                            {errors?.inspectedBy?.message}
                          </span>
                        )}
                      </div>

                      <div className="w-full lg:w-[calc(50%-10px)]">
                        <input
                          className="input-without-icon"
                          type="text"
                          placeholder={t("builtBy")}
                          {...register("builtBy", { required: true })}
                          disabled={editGeneral}
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
                          disabled={editGeneral}
                        />
                        {errors?.userResponsible && (
                          <span style={styles}>
                            {errors?.userResponsible?.message}
                          </span>
                        )}
                      </div>

                      <div className="w-full lg:w-[calc(50%-10px)]">
                        <select
                          {...register("scaffoldClass")}
                          onChange={(e) => setClasss(e.target.value)}
                          className="bg-white border border-gray-300  text-sm rounded-lg  block w-full p-[1rem] outline-none"
                          disabled={editGeneral}
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
                          <span style={styles}>
                            {errors?.scaffoldClass?.message}
                          </span>
                        )}
                      </div>
                      <div className="w-full lg:w-[calc(50%-10px)]">
                        <input
                          className="input-without-icon"
                          type="text"
                          value={getWeightForClass(classs)}
                          placeholder={t("maximumWeightPerm2Inkilograms")}
                          {...register("totalWeightPerM2", { required: true })}
                          disabled={editGeneral}
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
                            {...register("wallAnchorsCapacity", {
                              required: true,
                            })}
                            style={{ borderRadius: "5px 0px 0px 5px" }}
                          />
                          <div className="w-full lg:w-[calc(50%-10px)]">
                            <select
                              {...register("AnchorCapacityUnit")}
                              disabled={editGeneral}
                              className="border border-gray-300  text-sm rounded-r-lg  block w-full h-[50px] p-[1rem] outline-none"
                            >
                              <option selected>
                                {t("AnchorCapacityUnit")}
                              </option>
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
                          disabled={editGeneral}
                        />
                        {errors?.amountWallAnkers && (
                          <span style={styles}>
                            {errors?.amountWallAnkers?.message}
                          </span>
                        )}
                      </div>
                      {/* <div className="w-full lg:w-[calc(50%-10px)] border rounded-md  p-[10px]">
                        <div className="flex flex-wrap gap-2 mb-[10px]">
                          {scaffoldData?.length > 0 &&
                            scaffoldData?.map((element, index) => (
                              <>
                                <div className="p-2 rounded flex items-center gap-3 text-[12px] bg-[#0072BB1A]">
                                  <div className="input-without-icon">
                                    {element?.value} - ({element?.key})
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDelete(index);
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

                        <div className="flex gap-3">
                          <div>
                            <input
                              type="text"
                              className="w-32 p-2 border rounded-md shadow-md input-without-icon"
                              value={selectedValue}
                              onChange={handleValueChange}
                              placeholder="Enter Scaffold Value"
                              disabled={editGeneral}
                            />
                            {!isValidNumber(selectedValue) && (
                              <p className="text-nowrap text-xs text-red-600 font-semibold">
                                Please enter correct number
                              </p>
                            )}
                          </div>
                          <select
                            className="p-2 border rounded-md shadow-md input-without-icon"
                            value={selectedKey}
                            onChange={handleKeyChange}
                            disabled={editGeneral}
                          >
                            <option value="">{t("SelectaUnit")}</option>
                            <option value="m2">m2</option>
                            <option value="m3">m3</option>
                            <option value="lm">lm</option>
                            <option value="hm">hm</option>
                          </select>
                          <button
                            className={`${
                              editGeneral ? "bg-[gray]" : "bg-[#0072BB]"
                            } button-text px-[18px] py-[10px] text-white rounded-[5px]`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSave();
                            }}
                          >
                            {t("Save")}
                          </button>
                        </div>
                      </div> */}
                      <div className=" w-full lg:w-[calc(50%-10px)]  rounded-md p-[10px]">
                        <div className="flex w-full">
                          <div className="flex justify-between lg:justify-end lg:flex-row-reverse flex-row items-center w-full gap-[10px]">
                            <p className="project-number">
                              {t("buildAccording")}
                            </p>
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
                              className={`flex flex-row gap-[10px] w-auto items-center p-0.5 ${userGuideDetail?.file ? "" : `border-[1px]`
                                }   border-[#CCCCCC] px-[10px] rounded-[5px] ${userGuideDetail?.file ? `bg-[#0072BB1A]` : ""
                                }`}
                            >
                              <LiaFileUploadSolid
                                backgroundColor="blue"
                                color={
                                  userGuideDetail?.file ? "#0072BB" : "black"
                                }
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
                                {userGuideDetail?.comment ? (
                                  <>
                                    <MdOutlineEditNote
                                      color="#0072BB"
                                      size={20}
                                    />
                                  </>
                                ) : (
                                  <MdOutlineEditNote
                                    color="#000000"
                                    size={20}
                                  />
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
                                    unitType.scaffoldName.toLowerCase() !== ("volume")
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

              <div className=" pb-[50px] border-b-[#cccccc] border-b">
                <div className="custom-container">
                  <div className="flex flex-col gap-[30px] mt-[60px]">
                    <div className="flex gap-4">
                      <p className="medium-title">{t("visualInspection")}</p>
                      {roleOfUser === 0 && <button
                        onClick={(event) => {
                          event?.preventDefault();
                          setEditVisual(!editVisual);
                        }}
                      >
                        <VscEdit
                          size={24}
                          className={`${editVisual ? "text-red-500" : "text-green-600"
                            }`}
                        />
                      </button>}
                    </div>
                    <div className="flex justify-between items-center gap-x-[100px] flex-wrap w-full">
                      {visual.map((item, index) => (
                        <div className="block w-full lg:w-[calc(50%-50px)] sm:px-[20px] sm:py-3 py-2 justify-between items-start">
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full">
                            <div className="flex justify-between lg:justify-end lg:flex-row-reverse flex-row items-center w-full gap-[10px]">
                              <p className="project-number">
                                {item?.documentList}
                              </p>
                            </div>
                            <div className="flex justify-center items-center gap-[20px] lg:gap-[64px]">
                              <div className="flex sm:gap-5 gap-2">
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
                                  disabled={editVisual}
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
                                    handleRadioChange(
                                      item.id,
                                      "no",
                                      item?.inspection
                                    )
                                  }
                                  disabled={editVisual}
                                />
                                {t("No")}
                              </div>
                              <div className="flex sm:gap-5 gap-2">
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
                                  disabled={editVisual}
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
                                    handleDeleteDocument={() => {
                                      if (!editVisual) {
                                        handleDeleteDocument(item?.id);
                                      }
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  <ImageUpload
                                    onImageUpload1={(file) => {
                                      if (!editVisual)
                                        handleImageUpload(item?.id, file);
                                    }}
                                    documentFile={item?.documentFile}
                                    index={item?.id}
                                  />
                                </>
                              )}
                            </div>
                            <div
                              className={`flex flex-row gap-[10px] items-center  ${editComment[index] ? "" : `border-[1px]`
                                } border-[#CCCCCC] px-[10px] rounded-[5px] ${editComment[index] ? `bg-[#0072BB1A]` : ""
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
                                className={`${editComment[index]
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
                                    if (!editVisual) handeldeletedit(index);
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

                                placeholder={t("Writeyourthoughtshere...")}
                                disabled={editVisual}
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
                                disabled={editVisual}

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
                          className={`${editVisual ? "bg-[gray]" : "bg-[#0072BB]"
                            }  px-[18px] py-[10px] text-white rounded-[5px] m-0`}
                          disabled={editVisual}
                          onClick={(event) => {
                            event.preventDefault();
                            handleAddVisualInspection(newInspectionName);
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
                <div className="flex flex-col gap-[30px] mt-[60px]">
                  <div className="flex justify-between items-end">
                    <p className="w-full lg:w-[calc(50%-10px)] medium-title">
                      {t("areThereAnySpecific")}
                    </p>
                    <p className="w-full lg:w-[calc(50%-10px)] medium-title hidden lg:block">
                      {t("comments")}
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-[20px] flex-wrap w-full">
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <textarea
                        className="w-full p-[20px] border rounded-[5px]"
                        name="demo1"
                        id="demo1"
                        rows="3"
                        placeholder={t("writeHere")}
                        {...register("followUp", { required: true })}
                      ></textarea>
                    </div>
                    <p className="w-full lg:w-[calc(50%-10px)] medium-title block lg:hidden">
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

                <div className="flex flex-col gap-[30px] mt-[60px]">
                  <div className="flex gap-4">
                    <p className="medium-title">{t("signature")}</p>
                    {roleOfUser === 0 && <button
                      onClick={(event) => {
                        event?.preventDefault();
                        setEditSignature(!editSignature);
                      }}
                    >
                      <VscEdit
                        size={24}
                        className={`${editSignature ? "text-red-500" : "text-green-600"
                          }`}
                      />
                    </button>}
                  </div>
                  <div className="flex flex-col lg:flex-row gap-[50px] justify-between items-center lg:pl-[100px]">
                    <div className="flex flex-col gap-[20px] w-full lg:w-[380px] items-center">
                      {approvalForm?.customerSignature ? (
                        <>
                          <img
                            className="m-auto"
                            width={169}
                            src={approvalForm?.customerSignature}
                            alt="Signature"
                          />
                          <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                            {_.startCase(
                              _.toLower(
                                approvalForm?.customerSignatureName ||
                                editData?.customerSignatureName
                              )
                            )}
                          </p>
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              if (!editSignature) {
                                setApprovalForm({
                                  ...approvalForm,
                                  customerSignature: null,
                                });
                              }
                            }}
                          >
                            {t("clearSignature")}
                          </button>
                        </>
                      ) : (
                        <div
                          className="flex flex-col cursor-pointer justify-center  gap-[20px] items-center"
                          onClick={(e) => {
                            e.preventDefault();
                            if (!editSignature) {
                              handleAddSignatureCustomer();
                            }
                          }}
                        >
                          <img src="/addShape.svg" alt="sign-add" />
                          <button>{t("AddSignature")}</button>
                        </div>
                      )}
                      <div className="w-full border"></div>
                      <p>{t("signatureOfTheCustomer")}</p>
                    </div>
                    <div className="flex flex-col gap-[20px] w-full lg:w-[380px] items-center">
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
                                _.toLower(
                                  approvalForm?.inspectorSignatureName ||
                                  editData?.inspectorSignatureName
                                )
                              )}
                            </p>
                            <button
                              onClick={(event) => {
                                event.preventDefault();
                                if (!editSignature) {
                                  setApprovalForm({
                                    ...approvalForm,
                                    inspectorSignature: null,
                                  });
                                }
                              }}
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
                      <p>
                        {t("signatureOfTheInspector")}
                        <span style={{ color: "red", fontSize: "1.5em" }}>
                          *
                        </span>
                      </p>
                    </div>
                  </div>
                  <SignatureModal
                    isOpen={editSignature ? undefined : isModalOpenCustomer}
                    onClose={closeModalCustomer}
                    onSave={
                      editSignature ? undefined : handleSaveSignatureCustomer
                    }
                  />
                  <SignatureModal
                    isOpen={editSignature ? undefined : isModalOpenInspector}
                    onClose={closeModalInspector}
                    onSave={
                      editSignature ? undefined : handleSaveSignatureInspector
                    }
                    inspector={inspector}
                  />
                </div>

                {
                  roleOfUser === 0 && (
                    <div className="flex justify-center gap-10 mt-[60px] mb-[5px]">
                      <button
                        className="button-text bg-[#0072BB] text-[white] px-[20px] py-[10px] rounded-[5px]"

                      >
                        {isLoading ? t("loading") : t("editForm")}
                      </button>
                      {/* <button
                                          onClick={(e) => e.preventDefault()}
                                          className="button-text bg-[#0072BB] text-[white] px-[20px] py-[10px] rounded-[5px]"
                                      >
                                          <Link to={`/after-control-form/${projectId}`}>
                                              {t("convertToAfterControlForm")}
                                          </Link>
                                      </button> */}
                    </div>
                  )
                }


              </div>
            </div>
          </form>
        </>
      )}

      <Footer />
    </>
  );
};

export default EditApprovalForm;
