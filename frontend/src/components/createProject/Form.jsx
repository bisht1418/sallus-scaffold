import React, { useEffect, useState } from "react";
import { VscEdit } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { setProjectId, setProjectNumber } from "../../Redux/Slice/authSlice";
import { projectCreateService } from "../../Services/projectService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ImageUpload from "../FileUpload";
import { t } from "../../utils/translate";
import Calendar from "./Bigcalendar";
import { MdOutlineCancel } from "react-icons/md";

const schema = yup.object().shape({
  projectName: yup.string().required(t("projectNameIsRequired")),
  company_name: yup.string().optional(),
  company_organization_number: yup.string().optional(),
  company_email: yup.string().email(t("pleaseEnterValidEmail")).optional(),
  company_phone_number: yup.string().optional(),
  comapny_invoice_address: yup.string().optional(),
  company_contact_person: yup.string().optional(),
  project_contact_person: yup.string().optional(),
  project_phone_number: yup.string().optional(),
  project_email: yup.string().email(t("pleaseEnterValidEmail")).optional(),
  project_address: yup.string().optional(),
  projectNumber: yup.lazy((val) => {
    if (val !== undefined && val !== null && val !== "") {
      return yup.string();
    } else {
      return yup.string().nullable();
    }
  }).optional(),
});
const styles = {
  color: "red",
};

const Form = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const {accessLevel:roleOfUser} = useSelector((state) => state?.project);
  const [isNameEdit, setIsNameEdit] = useState(false);
  const [isNumberEdit, setIsNumberEdit] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [calendar, setCalendar] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [scaffoldStatus, setScaffoldStatus] = useState("inactive");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  function generateRandomString() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    let randomString = "";
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      randomString += alphabet[randomIndex];
    }

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      randomString += numbers[randomIndex];
    }

    return randomString;
  }
  const dispatch = useDispatch();

  const { loggedInUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isNumberEdit) {
      const projectNumber = generateRandomString();
      dispatch(setProjectNumber(projectNumber));
      reset({ projectNumber: projectNumber });
    }
  }, [isNumberEdit]);

  const onSubmit = async (data) => {
    try {
      setButtonLoading(true);
      const payload = {
        projectName: data?.projectName,
        companyDetails: {
          company_name: data?.company_name,
          company_organization_number: data?.company_organization_number,
          company_phone_number: data?.company_phone_number,
          company_email: data?.company_email,
          comapny_invoice_address: data?.comapny_invoice_address,
          company_contact_person: data?.company_contact_person,
          other_company_details: data?.other_company_details,
        },
        projectDetails: {
          project_contact_person: data?.project_contact_person,
          project_phone_number: data?.project_phone_number,
          project_email: data?.project_email,
          project_address: data?.project_address,
          other_project_details: data?.other_project_details,
        },
        Calendar: eventsData,
        projectNumber: data?.projectNumber?.toUpperCase(),
        userId: loggedInUser._id,
        projectBackgroundImage: backgroundImage || "",
        notificationToAdminCreate: roleOfUser === 0 ? false : true,
        status: scaffoldStatus,
      };
      const projectCreation = await projectCreateService(payload);
      const projectId = projectCreation?.project?._id;
      dispatch(setProjectId(projectId));
      if (projectCreation.status === "success") {
        toast.success(t("projectCreatedSuccessfully"));
        navigate(`/edit-create-project/${projectId}`);
        reset();
      }
    } catch (error) {
      setButtonLoading(true);
      return error;
    } finally {
      setButtonLoading(true);
    }
  };

  const handleImageUpload = (imgUrl, fileTagName) => {
    setBackgroundImage(imgUrl);
  };

  const handleDeleteDocument = () => {
    setBackgroundImage("");
  };

  const handleSelect = async ({ start, end }) => {
    const title = window.prompt("Add notes");
    if (title) {
      const newEventData = {
        start,
        end,
        title,
      };

      setEventsData([...eventsData, newEventData]);
    }
  };
  const handleEventClick = (event) => {
    const newTitle = window.prompt("Edit Event name", event.title);
    if (newTitle !== null) {
      const updatedEvents = eventsData.map((ev) => {
        if (ev === event) {
          return { ...ev, title: newTitle };
        }
        return ev;
      });
      setEventsData(updatedEvents);
    }
  };
  const handelCalender = () => {
    setCalendar(!calendar);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-[50px] border-b">
          <div className="custom-container flex flex-col gap-6">
            <div className="flex sm:flex-row flex-col gap-2 sm:justify-between justify-start items-start">
              <div
                className="flex w-auto  rounded-[5px] items-center gap-2 px-[8px] py-[8px] bg-[white] "
                style={{ border: "1px solid #ccc" }}
              >
                <p className="project-number !text-md text-nowrap">
                  {t("projectNumber")}
                </p>

                <input
                  className="medium-title w-[120px]"
                  defaultValue={watch("projectNumber") || ""}
                  {...register("projectNumber", { required: false })}
                />
              </div>
              {errors?.projectNumber && (
                <span style={styles}>{errors?.projectNumber?.message}</span>
              )}

              <div className="flex items-center gap-[20px]">
                <div className="flex justify-center items-center gap-[1rem] bg-[#0072bb] font-[600] text-[#fff] text-[16px] rounded-md">
                  {backgroundImage ? (
                    <ImageUpload
                      onImageUpload={handleImageUpload}
                      documentFile={"projectBackgroundImage"}
                      handleDeleteDocument={handleDeleteDocument}
                      status={true}
                    />
                  ) : (
                    <ImageUpload
                      onImageUpload={handleImageUpload}
                      documentFile={"projectBackgroundImage"}
                      status={false}
                    />
                  )}
                </div>
                {errors?.projectBackgroundImage && (
                  <span style={styles}>
                    {errors?.projectBackgroundImage?.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-[20px]  rounded-lg">
              <div className="w-full">
                <label className="text-black font-small font-semibold">
                  Project Name
                </label>
                <input
                  placeholder={t("enterProjectName")}
                  className="w-[100%] !pl-4 text-[18px] flex justify-start items-start  border border-green-100 font-semibold !text-[#0072BB] "
                  type="text"
                  value={watch("projectName")}
                  {...register("projectName", { required: true })}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="custom-container">
            <div className="py-[50px]">
              <div className="pb-[60px]">
                <div className="pb-[30px]">
                  <div className="flex sm:flex-row flex-col sm:gap-0 gap-5 justify-between">
                    <p className="medium-title">{t("companyDetails")}</p>
                    <div className="flex justify-between items-center gap-4">
                      <label className="text-sm font-semibold ">Active</label>
                      <input
                        onChange={() => setScaffoldStatus("active")}
                        type="radio"
                        name="radio-1"
                        className="radio  !border border-[#0072bb]  radio-warning"
                      />

                      <label className="text-sm font-semibold  ">
                        In Active
                      </label>
                      <input
                        onChange={() => setScaffoldStatus("inactive")}
                        type="radio"
                        name="radio-1"
                        className="radio  !border border-[#0072bb] radio-error"
                        defaultChecked
                      />

                      <label className="text-sm font-semibold ">
                        Completed
                      </label>
                      <input
                        onChange={() => setScaffoldStatus("completed")}
                        type="radio"
                        name="radio-1"
                        className="radio  !border border-[#0072bb] radio-success"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row justify-between flex-wrap items-center gap-[20px]">
                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <input
                      className="input-without-icon"
                      type="text"
                      {...register("company_name", { required: true })}
                      placeholder={t("companyName")}
                    />
                  </div>
                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <input
                      className="input-without-icon"
                      type="text"
                      {...register("company_organization_number", {
                        required: true,
                      })}
                      placeholder={t("organizationNumber")}
                    />
                  </div>
                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <input
                      className="input-without-icon"
                      type="text"
                      {...register("comapny_invoice_address", {
                        required: true,
                      })}
                      placeholder={t("invoiceAddress")}
                    />
                  </div>
                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <input
                      className="input-without-icon"
                      type="text"
                      {...register("company_contact_person", {
                        required: true,
                      })}
                      placeholder={t("contactPerson")}
                    />
                  </div>
                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <input
                      className="input-without-icon"
                      type="text"
                      {...register("company_email", { required: true })}
                      placeholder={t("emailId")}
                    />
                    {errors?.company_email && (
                      <span className="text-red-400 font-sm">
                        {errors.company_email.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <input
                      className="input-without-icon"
                      type="text"
                      {...register("company_phone_number", { required: false })}
                      placeholder={t("phoneNumber")}
                    />
                  </div>

                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <textarea
                      className="input-without-icon w-full p-[20px] border rounded-[5px] color-[blue]"
                      name="demo1"
                      id="demo1"
                      placeholder={t("otherCompanyDetails")}
                      {...register("other_company_details", { required: true })}
                      rows="3"
                      style={{ fontSize: "16px", Color: "" }}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="pb-[60px] relative">
                <div className="pb-[30px]">
                  <p className="medium-title">{t("projectDetails")}</p>
                </div>
                <div className="flex flex-col lg:flex-row justify-between flex-wrap items-center gap-[20px]">
                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <input
                      className="input-without-icon"
                      type="text"
                      {...register("project_contact_person", {
                        required: true,
                      })}
                      placeholder={t("contactPerson")}
                    />
                  </div>
                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <input
                      className="input-without-icon"
                      type="text"
                      {...register("project_phone_number", { required: false })}
                      placeholder={t("phoneNumber")}
                    />
                  </div>
                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <input
                      className="input-without-icon"
                      type="text"
                      {...register("project_email", { required: true })}
                      placeholder={t("emailId")}
                    />
                    {errors?.project_email && (
                      <span className="text-red-400 font-sm">
                        {errors.project_email.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <input
                      className="input-without-icon"
                      type="text"
                      {...register("project_address", { required: true })}
                      placeholder={t("address")}
                    />
                  </div>
                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <textarea
                      className="w-full p-[20px] border rounded-[5px]"
                      name="demo1"
                      id="demo1"
                      placeholder={t("otherProjectDetails")}
                      {...register("other_project_details", { required: true })}
                      rows="3"
                      style={{ fontSize: "16px", Color: "black" }}
                    ></textarea>
                  </div>
                  <div className="right-0 top-[200px] w-full lg:w-[calc(50%-10px)]">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        handelCalender();
                      }}
                      className="button-text bg-[#0072BB] px-[20px] py-[10px] rounded-[5px]  text-white "
                    >
                      {t("Calender")}
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={`${
                  calendar &&
                  "border fixed inset-0 flex justify-center items-center bg-gray-400 bg-opacity-80 z-50  text-black p-10"
                } `}
              >
                <div>
                  <div>
                    {calendar && (
                      <MdOutlineCancel
                        size={30}
                        className="absolute md:top-[27%] md:right-[12%] top-[26%] lg:top-[12%] lg:right-[17%] right-[10%] sm:top-[26%] cursor-pointer hover:color-[red]"
                        onClick={() => setCalendar(false)}
                      />
                    )}
                  </div>
                </div>
                <div>
                  {calendar && (
                    <Calendar
                      handleSelect={handleSelect}
                      eventsData={eventsData}
                      handleEventClick={handleEventClick}
                      setSelectedEvent={setSelectedEvent}
                    />
                  )}
                </div>
              </div>

              <div className="text-start mt-[30px] flex justify-center item-center">
                {!buttonLoading ? (
                  <button
                    type="submit"
                    className="button-text bg-[#0072BB] px-[20px] py-[10px] rounded-[5px] text-white"
                  >
                    {t("createProject")}
                  </button>
                ) : (
                  <button
                    disabled
                    type="button"
                    className="text-white bg-[#0072BB] hover:bg-[#0072BB] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center"
                  >
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 mr-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    {t("loading")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Form;
