import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import ContactUs from "../ContactUs/ContactUs";
import ContactForm from "../ContactUs/ContactForm";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";

const SupportComponent = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const [active, setActive] = useState(0);
  const sideData = [
    {
      title: t("getStarted"),
      icon: "/get-started.svg",
      activeIcon: "/get-started-active.svg",
    },
    {
      title: t("generalQuestions"),
      icon: "/general-question.svg",
      activeIcon: "/general-question-active.svg",
    },
    {
      title: t("projects"),
      icon: "/projects.svg",
      activeIcon: "/projects-active.svg",
    },
    {
      title: t("hours"),
      icon: "/hours.svg",
      activeIcon: "/hours-active.svg",
    },
    {
      title: t("personal"),
      icon: "/personal.svg",
      activeIcon: "/personal-active.svg",
    },
    {
      title: t("company"),
      icon: "/company.svg",
      activeIcon: "/company-active.svg",
    },
    {
      title: t("mobileVersion"),
      icon: "/mobile-version.svg",
      activeIcon: "/mobile-version-active.svg",
    },
    {
      title: t("integrations"),
      icon: "/integration.svg",
      activeIcon: "/integration-active.svg",
    },
    {
      title: t("orders"),
      icon: "/orders.svg",
      activeIcon: "/orders-active.svg",
    },
  ];
  const [activeAccordian, setActiveAccordian] = useState(0);
  const handleAccordian = (index) => {
    if (index === activeAccordian) {
      setActiveAccordian(0);
    } else {
      setActiveAccordian(index);
    }
  };

  const FAQArray = [
    {
      question: t("question"),
      answer: t("answer"),
    },
    {
      question: t("question2"),
      answer: t("answer"),
    },
  ];
  return (
    <>
      <div className="pb-[50px] border-b border-b-[#CCCCCC]">
        <div className="custom-container">
          <div className="flex flex-col lg:flex-row gap-[30px] items-center justify-between text-center">
            <p className="title-text">{t("howCanWeHelpYou")}</p>
            <div className="relative">
              <GoSearch
                className="absolute top-[50%] left-[2%] translate-y-[-50%]"
                size={24}
                color="#000000"
              />
              <input
                className="border border-[#CCCCCC] !w-full lg:!w-[580px]"
                placeholder={t("searchArticles")}
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="py-[100px] border-b border-b-[#CCCCCC]">
        <div className="custom-container">
          <div className="flex flex-col md:flex-row items-start gap-[20px]">
            <div className="flex flex-row flex-nowrap overflow-auto md:flex-col bg-[#FAFAFA] w-full md:w-[150px] lg:w-[280px]">
              {sideData.map((item, i) => (
                <div key={i}>
                  <div
                    onClick={() => {
                      setActive(i);
                    }}
                    className={`w-[150px] md:w-full flex flex-col gap-[10px] py-[10px] text-center ${active === i && "bg-[#0072BB]"
                      }`}
                  >
                    <img
                      className="w-[60px] h-[60px] mx-auto"
                      src={active === i ? item?.activeIcon : item?.icon}
                      alt=""
                    />
                    <p
                      className={`medium-lite-title leading-[28px] ${active === i ? "text-white" : "text-[#212121]"
                        }`}
                    >
                      {item.title}
                    </p>
                  </div>
                  {i !== sideData?.length - 1 && (
                    <div className="hidden md:block my-[10px] w-full border border-[#CCCCCC]"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="w-full md:w-[calc(100%-170px)] lg:w-[calc(100%-300px)]">
              <div className="w-full mx-auto">
                <div>
                  {FAQArray.map((item, index) => (
                    <div key={index}>
                      <h2>
                        <button
                          onClick={() => {
                            handleAccordian(index + 1);
                          }}
                          type="button"
                          className={`${activeAccordian === index + 1
                              ? "bg-[#0072BB] py-[13px]"
                              : "py-[33px] "
                            } flex items-center px-[20px] justify-between w-full text-left border-b border-b-[#CCCCCC]`}
                        >
                          <span
                            className={`${activeAccordian === index + 1
                                ? "text-[white]"
                                : "text-[#212121]"
                              } faqs-title`}
                          >
                            {item.question}
                          </span>
                          <img
                            src={
                              activeAccordian !== index + 1
                                ? "/down-arrow.svg"
                                : "up-arrow.svg"
                            }
                            width={16}
                            alt=""
                          />
                        </button>
                      </h2>
                      <div
                        className={`${activeAccordian === index + 1 ? "block" : "hidden"
                          }`}
                      >
                        <div className="py-5 px-[20px] border-b border-[#CCCCCC]">
                          <p className="normal-text">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default SupportComponent;
