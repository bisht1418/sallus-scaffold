import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";
import { motion, useInView } from "framer-motion";

const FAQs = () => {
  const [activeAccordian, setActiveAccordian] = useState(0);
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const handleAccordian = (index) => {
    if (index === activeAccordian) {
      setActiveAccordian(0);
    } else {
      setActiveAccordian(index);
    }
  };

  const FAQArray = [
    {
      question: "faq-1",
      answer: "faq-1-ans",
    },
    {
      question: "faq-2",
      answer: "faq-2-ans",
    },
    {
      question: "faq-3",
      answer: "faq-3-ans",
    },
    {
      question: "faq-4",
      answer: "faq-4-ans",
    },
    {
      question: "faq-5",
      answer: "faq-5-ans",
    },
    {
      question: "faq_6",
      answer: "faq_6_ans",
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref);
  return (
    <div className="py-[100px] bg-[#FAFAFA]">
      <div className="custom-container">
        <div className="max-w-[780px] mx-auto" ref={ref}>
          <motion.div className="text-center mb-10 lg:mb-[60px]">
            <motion.h1
              style={{
                transform: isInView ? "none" : "translateX(-600px)",
                opacity: isInView ? 1 : 0,
                transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
              }}
              className="title-text"
            >
              {t("faq-title")}
            </motion.h1>
          </motion.div>
          <div>
            {FAQArray.map((item, index) => (
              <div key={index}>
                <div>
                  <button
                    onClick={() => {
                      handleAccordian(index + 1);
                    }}
                    type="button"
                    className={`${
                      activeAccordian === index + 1
                        ? "bg-[#0072BB] py-[13px]"
                        : "py-[33px] "
                    } flex items-center px-[20px] justify-between w-full text-left border-b border-b-[#CCCCCC]`}
                  >
                    <motion.span
                      style={{
                        transform: isInView ? "none" : "translateX(-600px)",
                        opacity: isInView ? 1 : 0,
                        transition: `all 1.2s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s`,
                      }}
                      className={`${
                        activeAccordian === index + 1
                          ? "text-[white]"
                          : "text-[#212121]"
                      } faqs-title`}
                    >
                      {t(item.question)}
                    </motion.span>
                    <motion.img
                      style={{
                        transform: isInView ? "none" : "translateX(600px)",
                        opacity: isInView ? 1 : 0,
                        transition: `all 1s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s`,
                      }}
                      src={
                        activeAccordian !== index + 1
                          ? "/down-arrow.svg"
                          : "up-arrow.svg"
                      }
                      width={16}
                      alt=""
                    />
                  </button>
                </div>
                <div
                  className={`${
                    activeAccordian === index + 1 ? "block" : "hidden"
                  }`}
                >
                  <div className="py-5 px-[20px] border-b border-gray-200 dark:border-gray-700">
                    <p className="normal-text">
                      {t(item?.answer)?.split(" ")?.slice(0, 7)?.join(" ")}
                      <br />
                      {t(item?.answer)?.split(" ")?.slice(7)?.join(" ")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
