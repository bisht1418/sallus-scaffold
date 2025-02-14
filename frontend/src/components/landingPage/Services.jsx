import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";
import { motion, useInView } from "framer-motion";

const Services = () => {
  const [activeService, setActiveService] = useState(1);
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const handleMouseOver = (index) => {
    setActiveService(index);
  };
  const handleMouseDown = () => {
    setActiveService(0);
  };

  const handleBorders = (index) => {
    return {
      1: "lg:border-r border-b lg:border-r-[#CCCCCC] border-b-[#CCCCCC]",
      2: "border-b border-b-[#CCCCCC]",
      3: "lg:border-r lg:border-r-[#CCCCCC] lg:border-b-0 border-b lg:border-b-[#00000000] border-b-[#CCCCCC]",
      4: "",
    }[index];
  };

  const serviceData = [
    {
      icon: "/checklists.svg",
      activeIcon: "/checklists-active.svg",
      title: "our-service-1",
      description:
        "our-service-1-description",
      url: "#",
    },
    {
      icon: "/forms.svg",
      activeIcon: "/forms-active.svg",
      title: "our-service-2",
      title_02: "our-service-2-1",
      description:
        "our-service-2-description",
      url: "/forms",
    },
    {
      icon: "/deviations.svg",
      activeIcon: "/deviations-active.svg",
      title: "our-service-3",
      description:
        "our-service-3-description",
      url: "#",
    },
    {
      icon: "/inspections.svg",
      activeIcon: "/inspections-active.svg",
      title: "our-service-4",
      description:
        "our-service-4-description",
      url: "#",
    },
  ];
  const navigate = useNavigate();

  const ref = useRef(null);
  const isInView = useInView(ref);


  return (


    <div className="bg-[#FAFAFA] py-[100px]">
      <div className="custom-container" ref={ref}>
        <motion.div className="pb-[50px] text-center">
          <motion.h1
            style={{
              transform: isInView ? "none" : "translateX(-600px)",
              opacity: isInView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
            className="title-text"
          >
            {t("our-service-title")}
          </motion.h1>

        </motion.div>
        <div className="flex w-full flex-col lg:flex-row gap-[0px] flex-wrap">
          {serviceData.map((service, index) => (
            <motion.div
              style={{
                transform: isInView
                  ? "none"
                  : index % 2 === 0
                    ? "translateX(-600px)"
                    : "translateX(600px)",
                opacity: isInView ? 1 : 0,
                transition: `all ${index % 2 === 0 ? 1.2 : 1.2
                  }s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s`,
              }}
              key={index}
              onMouseOver={() => {
                handleMouseOver(index + 1);
              }}
              onMouseOut={() => {
                handleMouseDown();
              }}
              className={`w-full lg:w-1/2 min-h-[300px]  ${handleBorders(
                index + 1
              )}`}
            >
              <div
                onClick={() => {
                  navigate(service.url);
                }}
                className={`flex items-center justify-center m-[10px] h-[calc(100%-20px)] cursor-pointer ${activeService === index + 1 ? "bg-[#0072BB]" : ""
                  }`}
              >
                <div className=" flex flex-col justify-between items-center h-full">
                  <div className={`p-[20px]  text-center h-full`}>
                    <motion.img
                      style={{
                        transform: isInView
                          ? "none"
                          : index % 2 === 0
                            ? "translateX(-600px)"
                            : "translateX(600px)",
                        opacity: isInView ? 1 : 0,
                        transition: `all ${index % 2 === 0 ? 1.2 : 1.2
                          }s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s`,
                      }}
                      className="w-[60px] m-auto mb-[10px]"
                      src={
                        activeService === index + 1
                          ? service.activeIcon
                          : service.icon
                      }
                      alt=""
                    />
                    <motion.p
                      style={{
                        transform: isInView
                          ? "none"
                          : index % 2 === 0
                            ? "translateX(-600px)"
                            : "translateX(600px)",
                        opacity: isInView ? 1 : 0,
                        transition: `all ${index % 2 === 0 ? 1.2 : 1.2
                          }s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s`,
                      }}
                      className={`medium-title ${activeService === index + 1
                        ? "text-white"
                        : "text-black"
                        }  mb-[15px]`}
                    >
                      {t(service.title)}
                    </motion.p>
                    <motion.p
                      style={{
                        transform: isInView
                          ? "none"
                          : index % 2 === 0
                            ? "translateX(-600px)"
                            : "translateX(600px)",
                        opacity: isInView ? 1 : 0,
                        transition: `all ${index % 2 === 0 ? 1.2 : 1.2
                          }s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s`,
                      }}
                      className={`service-description ${activeService === index + 1
                        ? "text-white"
                        : "text-black"
                        } mb-[15px]`}
                    >
                      {t(service.description)}
                    </motion.p>
                    {
                      service?.title_02 && (
                        <>
                          <motion.p
                            style={{
                              transform: isInView
                                ? "none"
                                : index % 2 === 0
                                  ? "translateX(-600px)"
                                  : "translateX(600px)",
                              opacity: isInView ? 1 : 0,
                              transition: `all ${index % 2 === 0 ? 1.2 : 1.2
                                }s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s`,
                            }}
                            className={`service-description ${activeService === index + 1
                              ? "text-white"
                              : "text-black"
                              } mb-[15px]`}
                          >
                            {t(service.title_02)}

                          </motion.p>
                        </>
                      )
                    }
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;




