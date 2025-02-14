import React, { useState } from "react";

const FAQs = () => {
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
      question: "Approval Form",
      answer:
        "This form is useful to ensure that the scaffold complies with applicable safety standards and regulations, and it provides documented records of the inspection for reference and follow up.",
    },
    {
      question: "Scaffolding Control",
      answer:
        "This form is useful to ensure that the scaffold complies with applicable safety standards and regulations, and it provides documented records of the inspection for reference and follow up.",
    },
    {
      question: "After Control Form",
      answer:
        "This form is useful to ensure that the scaffold complies with applicable safety standards and regulations, and it provides documented records of the inspection for reference and follow up.",
    },
    {
      question: "Form #4",
      answer:
        "This form is useful to ensure that the scaffold complies with applicable safety standards and regulations, and it provides documented records of the inspection for reference and follow up.",
    },
    {
      question: "Form #5",
      answer:
        "This form is useful to ensure that the scaffold complies with applicable safety standards and regulations, and it provides documented records of the inspection for reference and follow up.",
    },
    {
      question: "Form #6",
      answer:
        "This form is useful to ensure that the scaffold complies with applicable safety standards and regulations, and it provides documented records of the inspection for reference and follow up.",
    },
  ];
  return (
    <div className="py-[20px] lg:py-[100px]  bg-[#FAFAFA] relative w-full">
      <img
        alt={""}
        className="absolute top-[50%] left-[0%] translate-y-[-50%] w-[350px] xl:w-[450px] lg:block hidden"
        src="/leftsidefaq.svg"
      />
      <div className="max-w-[1200px] mx-auto my-0 px-6">
        <div className="lg:w-[780px] w-full mx-auto">
          <div className="text-center mb-10 lg:mb-[60px]">
            <p className="title-text">GET TO KNOW</p>
            <p>Click on the topic to know more about how forms works</p>
          </div>
          <div>
            {FAQArray.map((item, index) => (
              <>
                <h2>
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
                    <span
                      className={`${
                        activeAccordian === index + 1
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
                  className={`${
                    activeAccordian === index + 1 ? "block" : "hidden"
                  }`}
                >
                  <div className="py-5 px-[20px] border-b border-gray-200 dark:border-gray-700">
                    <p className="normal-text">{item.answer}</p>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
      <img
        alt={""}
        className="absolute top-[50%] right-[0%] translate-y-[-50%] w-[350px] xl:w-[450px] lg:block hidden"
        src="/rightsidefaq.svg"
      />
    </div>
  );
};

export default FAQs;
