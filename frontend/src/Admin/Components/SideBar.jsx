import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { sidebarData } from "./SidebarMenu";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const adminConnect = require("../../Assets/admin-connect.png");

const SideBar = (props) => {
  const [openSubmenus, setOpenSubmenus] = useState([]);
  const isAdminId = useSelector((state) => state?.admin?.loggedInAdmin?._id);

  const handleToggle = (index) => {
    setOpenSubmenus((prevOpenSubmenus) => {
      if (prevOpenSubmenus.includes(index)) {
        return prevOpenSubmenus.filter((item) => item !== index);
      } else {
        return [...prevOpenSubmenus, index];
      }
    });
  };

  const subMenus = (subitems, index) => {
    return (
      <ul className={`${openSubmenus.includes(index) ? "" : "hidden"} `}>
        {subitems
          .filter((subitem) => {
            if (props?.isAdmin) {
              if (subitem.label === "All Users" || subitem.label === "Admin") {
                return false;
              }

              if (isAdminId) {
                if (subitem.label === "All Forms") {
                  return false;
                }
              }
            } else {
              if (!isAdminId) {
                if (
                  subitem.label === "Invite Users" ||
                  subitem.label === "My Subscription"
                ) {
                  return false;
                }
              }
            }
            return true;
          })
          .map((subitem, subindex) => (
            <li key={subindex}>
              {subitem.submenu ? (
                <div>
                  <button
                    onClick={() => {
                      handleToggle(subindex);
                    }}
                    type="button"
                    className="flex items-center w-full text-base text-white transition duration-75 rounded-lg group"
                  >
                    <subitem.icon />
                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap text-sm">
                      {subitem.label}
                    </span>
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  {subMenus(subitem.submenu, subindex)}
                </div>
              ) : (
                <Link
                  to={subitem.href}
                  className="flex items-center w-full gap-2 p-2 text-white transition duration-75 rounded-lg pl-11 group hover:bg-[#5295f7] text-sm"
                >
                  <subitem.icon />
                  {subitem.label}
                </Link>
              )}
            </li>
          ))}
      </ul>
    );
  };

  return (
    <div className="relative overflow-auto scrollbar">
      <div className="">
        <aside
          id="default-sidebar"
          className=" w-full flex flex-col justify-between  h-[100vh] z-50"
          aria-label="Sidebar"
        >
          <FaTimes
            className="absolute top-2 right-1 cursor-pointer lg:hidden"
            size={24}
            onClick={() => props.setOpenSidebar(false)}
          />
          <div className=" px-3 py-4 o bg-[#1c2434] mt-5">
            <p className="flex items-center justify-center mb-4">
              <img
                src="/new_logo.svg"
                alt={"logo"}
                className="w-30 h-10  text-white bg-white rounded"
              />
            </p>
            <hr className="mb-4" />
            <ul className="space-y-2 font-medium">
              {sidebarData.map((item, index) => (
                <li key={index}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => {
                          handleToggle(index);
                        }}
                        type="button"
                        className="flex items-center w-full p-2 text-base transition duration-75 rounded-lg group hover:bg-[#5295f7] text-white "
                      >
                        <item.icon />
                        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap text-sm">
                          {item.label}
                        </span>
                        <div>
                          <svg
                            className={`w-3 h-3 ${
                              openSubmenus.includes(index)
                                ? "rotate-180 transition-all ease-in-out duration-500"
                                : "transition-all ease-in-out duration-500"
                            }`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 10 6"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 4 4 4-4"
                            />
                          </svg>
                        </div>
                      </button>

                      {subMenus(item.submenu, index)}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="flex items-center p-2  rounded-lg  hover:bg-[#5295f7] "
                    >
                      <item.icon />

                      <span className="ms-3 whitespace-nowrap text-sm">
                        {item.label}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col  z-50 justify-center items-center w-full">
            <img className="h-[100px] w-auto" src={"/logo-welcome-popup.jpg"} alt="img" />
            <p className="">Hi, how can we help?</p>
            <p className="flex text-center text-gray-400 text-sm mb-2 p-2">
              {" "}
              Contact us if you have any assistance, we will contact you as soon
              as possible
            </p>
            <button className="py-2 px-20 mb-5 rounded-xl bg-blue-400 hover:bg-blue-500 text-white font-bold">
              Connect
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SideBar;
