import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Services = () => {
  const [activeService, setActiveService] = useState(1);

  const handleMouseOver = (index) => {
    setActiveService(index);
  };
  const handleMouseDown = () => {
    setActiveService(0);
  };

  const handleBorders = (index) => {
    return {
      1: "lg:border-r border-b lg:border-r-[#CCCCCC] border-b-[#CCCCCC]",
      2: "lg:border-r border-b lg:border-r-[#CCCCCC] border-b-[#CCCCCC]",
      3: "border-b border-b-[#CCCCCC]",
      4: "lg:border-r lg:border-r-[#CCCCCC] border-b lg:border-b-[0px] border-b-[#CCCCCC] ",
      5: "lg:border-r  lg:border-r-[#CCCCCC] border-b-[#CCCCCC]",
      6: "",
    }[index];
  };

  const serviceData = [
    {
      icon: `/approv-form.svg`,
      activeIcon: "/approv-form.svg",
      title: "Approval From",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in ornare risus. Morbi lectus massa, dignissim vitae augue nec, rhoncus tempor elit.",
      url: "#",
      activeArrow: "/arrow-right.svg",
    },
    {
      icon: "/checklist.svg",
      activeIcon: "/checklists-active.svg",
      title: "After Control Form",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in ornare risus. Morbi lectus massa, dignissim vitae",
      url: "#",
      activeArrow: "/arrow-right.svg",
    },
    {
      icon: "/material-lists.svg",
      activeIcon: "/forms-active.svg",
      title: "Material List",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in ornare risus. ",
      url: "",
      activeArrow: "/arrow-right.svg",
    },
    {
      icon: "/file.svg",
      activeIcon: "/file-active.svg",
      title: "Files",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in ornare risus. Morbi lectus massa, dignissim vitae ",
      url: "#",
      activeArrow: "/arrow-right.svg",
    },
    {
      icon: "/form-pictures.svg",
      activeIcon: "/pictures-active.svg",
      title: "Picture",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in ornare risus. Morbi lectus massa, dignissim vitae augue nec, rhoncus tempor elit.",
      url: "#",
      activeArrow: "/arrow-right.svg",
    },
  ];
  const navigate = useNavigate();
  return (
    <div className="bg-[white] pb-[100px] ">
      <div className="custom-container">
        <div className="pb-[50px] text-center">
          <p className="title-text">FORMS</p>
          <p className="text-[16px]">Save the time with digital forms</p>
        </div>
        <div className="flex w-full flex-col lg:flex-row gap-[0px] flex-wrap">
          {serviceData.map((service, index) => (
            <div
              onMouseOver={() => {
                handleMouseOver(index + 1);
              }}
              onMouseOut={() => {
                handleMouseDown();
              }}
              className={`w-full lg:w-1/3 lg:min-h-[350px]  ${handleBorders(
                index + 1
              )}`}
            >
              <div
                onClick={() => {
                  navigate(service.url);
                }}
                className={`flex items-center justify-center m-[10px] h-[calc(100%-20px)] cursor-pointer ${
                  activeService === index + 1 ? "bg-[#0072BB]" : ""
                }`}
              >
                <div className=" flex flex-col justify-between items-center h-full">
                  <div className={`p-[20px]  text-center h-full`}>
                    <img
                      className="w-[60px] m-auto mb-[10px]"
                      src={
                        activeService === index + 1
                          ? service.activeIcon
                          : service.icon
                      }
                      alt=""
                    />
                    <p
                      className={`medium-title ${
                        activeService === index + 1
                          ? "text-white"
                          : "text-black"
                      }  mb-[15px]`}
                    >
                      {service.title}
                    </p>
                    <p
                      className={`service-description ${
                        activeService === index + 1
                          ? "text-white"
                          : "text-black"
                      } mb-[15px]`}
                    >
                      {service.description}
                    </p>
                    <img
                      alt={"img"}
                      className="w-[26px] m-auto mb-[10px]"
                      src={activeService === index + 1 && service.activeArrow}
                    />
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

export default Services;
