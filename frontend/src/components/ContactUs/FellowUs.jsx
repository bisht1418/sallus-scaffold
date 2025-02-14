import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { t } from "../../utils/translate";
const FellowUs = () => {
    const currentLanguage = useSelector(
        (state) => state?.global?.current_language
    );
    const [activeService, setActiveService] = useState(1);
    const handleMouseOver = (index) => {
        setActiveService(index);
    };
    const handleMouseDown = () => {
        setActiveService(0);
    };

    const handleBorders = (index) => {
        return {
            1: " border-b border-b-[#CCCCCC] lg:border-b-[0px] lg:border-r lg:border-r-[#CCCCCC]",
            2: " border-b border-b-[#CCCCCC] lg:border-b-[0px] lg:border-r lg:border-r-[#CCCCCC]",
            3: "",
            // 4: "lg:border-r lg:border-r-[#CCCCCC] border-b lg:border-b-[0px] border-b-[#CCCCCC] ",
            // 5: "lg:border-r  lg:border-r-[#CCCCCC] border-b-[#CCCCCC]",

        }[index];
    };

    const serviceData = [
        {
            icon: `/contact-facebook.svg`,
            title: t("salusStillasSolutions"),
            url: "#",
        },
        {
            icon: "/contact-instagram.svg",
            title: t("salusStillas"),
            url: "#",
        },
        {
            icon: "/contact-linkdine.svg",
            title: t("salusStillasSolutions"),
            url: "",
        },



    ];
    const navigate = useNavigate();
    return (
        <div className="bg-[white] pb-[36.72px] pt-[100px] ">
            <div className="custom-container">
                <div className="pb-[50px] text-center">
                    <p className="title-text">{t("followUpOn")}</p>
                </div>
                <div className="flex w-full flex-col lg:flex-row gap-[0px] flex-wrap">
                    {serviceData.map((service, index) => (
                        <div
                            key={index}
                            onMouseOver={() => {
                                handleMouseOver(index + 1);
                            }}
                            onMouseOut={() => {
                                handleMouseDown();
                            }}
                            className={`w-full lg:w-1/3 lg:min-h-[141px]  ${handleBorders(
                                index + 1
                            )}`}
                        >
                            <div
                                onClick={() => {
                                    navigate(service.url);
                                }}
                                className={`flex items-center justify-center m-[10px] h-[calc(100%-20px)] }`}
                            >
                                <div className=" flex flex-col justify-between items-center h-full">
                                    <div className={`p-[20px]  text-center h-full`}>
                                        <img
                                            className="w-[60px] m-auto mb-[10px]"
                                            src={service.icon} alt=""
                                        />
                                        <p
                                            className={`text-black mb-[15px] text-[20px]`}
                                        >
                                            {service.title}
                                        </p>
                                    </div>
                                    {/* <div  className="cursor-pointer">
                    <img
                      className="w-[32px] m-auto mb-[30px] "
                      src="/service-more-icon.svg"
                      alt=""
                    />
                  </div> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FellowUs;
