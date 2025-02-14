import React, { createRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import CloseIcon from "../Assets/iconclose.svg";
import CloseIconWhite from "../Assets/close_icon_white.svg";
import { t } from "../utils/translate";

function ImageUpload({
  onImageUpload,
  documentFile,
  index,
  status,
  handleDeleteDocument,
  editedImage,
  uploadedViewImage,
  onImageUpload1,
  isUserGuideDetail,
  userGuideDetail,
  setUserGuideDetail,
  isObservationMedia,
  setMediaAttachment,
  isAfterControlForm,
  setDocumentImage,
  handleImageUpload,
}) {
  const userId = useSelector((state) => state.auth.loggedInUser._id);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ref = createRef();

  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const determineFolderName = (fileExtension) => {
    switch (fileExtension) {
      case "jpg":
      case "jpeg":
      case "png":
        return "image";
      case "pdf":
      case "doc":
      case "txt":
        return "file";
      case "sign":
        return "signature";
      default:
        return "other";
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cyby2hpr");

    const fileExtension = file?.name.split(".").pop();
    const folderName = determineFolderName(fileExtension);
    const publicId = `users/${userId}/${folderName}/${file?.name}`;
    formData.append("public_id", publicId);

    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/ddrvpin2u/image/upload",
        formData
      );

      const uploadedImageUrl = response.data.url;

      setImage(uploadedImageUrl);
      if (onImageUpload) {
        onImageUpload(response.data.url, documentFile[index] || documentFile);
      }
      if (onImageUpload1) {
        onImageUpload1(response.data.url, documentFile);
      }
      if (isUserGuideDetail) {
        setUserGuideDetail({ ...userGuideDetail, file: response?.data?.url });
      }

      if (isObservationMedia) {
        setMediaAttachment(uploadedImageUrl);
      }

      if (isAfterControlForm) {
        handleImageUpload(uploadedImageUrl, index);
      }

      setError("");
    } catch (error) {
      console.log("error", error);
      setError("Error uploading image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    ref.current.click();
  };

  return (
    <>
      {status ? (
        <div
          className={`flex justify-center gap-[10px] items-center cursor-pointer ${
            documentFile === "approvalFormImage" ||
            documentFile === "projectBackgroundImage" ||
            documentFile === "observationFormImage" ||
            isObservationMedia
              ? "button-text  text-[#fff] bg-[#0072BB] px-[20px] py-[10px] rounded-[5px]"
              : "text-[#0072BB]"
          }`}
        >
          <a
            href={image || editedImage || uploadedViewImage}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className=" text-[14px] rounded-[5px]">
              {" "}
              {documentFile === "approvalFormImage" ||
              documentFile === "projectBackgroundImage" ||
              documentFile === "observationFormImage"
                ? documentFile === "observationFormImage"
                  ? t("ViewObservation")
                  : t("viewBackground")
                : t("ViewsDocument")}
            </p>
          </a>
          <div
            className="text-[#fff] cursor-pointer"
            onClick={() => handleDeleteDocument(index)}
          >
            <img
              src={`${
                documentFile !== "approvalFormImage" &&
                documentFile !== "projectBackgroundImage" &&
                documentFile !== "observationFormImage" &&
                !isObservationMedia
                  ? CloseIcon
                  : CloseIconWhite
              }`}
              alt="cancel_document"
            />
          </div>
        </div>
      ) : (
        <div
          className={`cursor-pointer ${
            documentFile === "approvalFormImage" ||
            documentFile === "projectBackgroundImage" ||
            documentFile === "observationFormImage" ||
            isObservationMedia
              ? "button-text bg-[#0072BB] text-[white] px-[20px] py-[10px] rounded-[5px]"
              : "font-semibold text-sm"
          }`}
          onClick={handleButtonClick}
        >
          <div>
            {documentFile === "approvalFormImage" ||
            documentFile === "projectBackgroundImage" ||
            documentFile === "observationFormImage"
              ? documentFile === "observationFormImage"
                ? t("UploadObservation")
                : t("uploadBackground")
              : isUserGuideDetail
              ? t("uploadCalculations")
              : isObservationMedia
              ? t("photos_videos")
              : t("UploadPhoto/File")}
          </div>
          <input
            ref={ref}
            hidden
            type="file"
            accept="image/*,.pdf,.doc,.txt,video/*"
            onChange={handleUpload}
          />
          {loading && <div>{t("Uploading")}</div>}
          {error && <div>{error}</div>}
          {/* {userGuideDetail?.file && <img src={userGuideDetail?.file} alt="img" width={100} />} */}
        </div>
      )}
    </>
  );
}

export default ImageUpload;
