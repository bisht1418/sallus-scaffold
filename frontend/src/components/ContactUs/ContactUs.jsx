import React from "react";
import { useNavigate } from "react-router-dom";
import { t } from "../../utils/translate";
import { useSelector } from "react-redux";
const pdfLinkPath = require("../../Assets/salus_scaffold.pdf");
const pdfLinkPathNo = require("../../Assets/salus_scaffold_no.pdf");

const ContactUs = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const serviceData = [
    {
      icon: `/contact-phone.svg`,
      title: t("makeACall"),
      url: "#",
      data: "+47 902 324 08",
    },
    {
      icon: `/service-filers.svg`,
      title: t("user_manual"),
      url: "#",
      data: t("download"),
      unique: "USER_MANUAL",
    },
    {
      icon: "/contact-email.svg",
      title: t("sendAnEmail"),
      url: "#",
      data: "post@salusscaffold.com",
    },
  ];

  const navigate = useNavigate();

  const handleDownload = async () => {
    const link = document.createElement("a");
    if (currentLanguage === "no") {
      link.href = pdfLinkPathNo;
    } else {
      link.href = pdfLinkPath;
    }
    link.download = "salus_scaffold_guide";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="bg-[white] py-[100px] ">
      <div className="custom-container">
        <div className="pb-[50px] text-center">
          <p className="title-text">{t("contactUs")}</p>
        </div>
        <div className="flex justify-center">
          {serviceData.map((service, index) => (
            <div
              key={index}
              className={`w-full lg:w-1/3 lg:min-h-[203px] cursor-pointer `}
            >
              <div
                onClick={() => {
                  if (service?.unique === "USER_MANUAL") {
                    handleDownload();
                    return;
                  }
                  navigate(service.url);
                }}
                className={`flex items-center justify-center m-[10px] h-[calc(100%-20px)] }`}
              >
                <div className=" flex flex-col justify-between items-center h-full">
                  <div className={`p-[20px]  text-center h-full`}>
                    <img
                      className="w-[60px] m-auto mb-[10px]"
                      src={service.icon}
                      alt=""
                    />
                    <p
                      className={`medium-title text-black mb-[15px] text-[20px]`}
                    >
                      {service.title}
                    </p>
                    <p
                      className={` text-black mb-[15px] text-[16px] font-semibold`}
                    >
                      {service.data}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
