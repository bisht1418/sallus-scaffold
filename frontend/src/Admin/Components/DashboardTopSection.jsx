import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiMessageCircle } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoLogOutOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { FaHandsHelping } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardTopSection = () => {
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const adminDetails = useSelector((state) => state?.admin?.loggedInAdmin);

  return (
    <div className="p-2 flex justify-between gap-2 bg-white">
      <div className="font-semibold text-gray-900  w-1/2 flex justify-center items-center relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="w-full p-4 ps-10 text-sm rounded-xl"
          placeholder="Search Mockups, Logos..."
          required
        />
      </div>

      <div className="font-semibold text-gray-900 flex lg:gap-8 gap-3 bg-white lg:px-5 px-3  rounded-xl justify-center items-center">
        <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all ease-in-out duration-300 text-2xl relative">
          <IoNotificationsOutline />
          <span className="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2  rounded-full animate-pulse"></span>
        </div>

        <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all ease-in-out duration-300 text-2xl relative">
          <FiMessageCircle />
          <span className="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2  rounded-full animate-pulse"></span>
        </div>

        <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all ease-in-out duration-300 text-2xl">
          <LuLayoutDashboard />
        </div>

        <div className="relative">
          <div className="relative flex gap-2 justify-center items-center">
            <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all ease-in-out duration-300 text-2xl">
              <div
                onClick={() => setOpenProfileModal(!openProfileModal)}
                className="relative"
              >
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://images.pexels.com/photos/20693559/pexels-photo-20693559/free-photo-of-young-woman-in-red-beret.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt=""
                />
                <span className="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
              </div>
            </div>
            <div className="transition-all ease-in-out duration-300 text-xs">
              <p className="uppercase text-[10px] sm:text-xs">
                {adminDetails?.name}
              </p>
              <p className="uppercase text-[10px] sm:text-xs">
                {adminDetails?.type === 0 ? "Admin" : "Super Admin"}
              </p>
            </div>
          </div>
          {openProfileModal && (
            <div>
              <div className="absolute transition-all duration-150 ease-in-out top-10 right-[100px] w-[170px] bg-white rounded-xl z-50">
                <ul className="rounded-xl">
                  <li className="flex justify-start items-center gap-2 border-b px-2 py-2 bg-slate-50 hover:bg-slate-100 cursor-pointer text-sm font-semibold">
                    {" "}
                    <span>
                      <CgProfile />
                    </span>
                    Profile
                  </li>
                  <li className="flex justify-start items-center gap-2 border-b px-2 py-2 bg-slate-50 hover:bg-slate-100 cursor-pointer text-sm font-semibold">
                    {" "}
                    <span>
                      <CiSettings />
                    </span>
                    Settings
                  </li>
                  <li className="">
                    {" "}
                    <Link
                      to={"/admin-login"}
                      className="flex justify-start items-center gap-2 border-b px-2 py-2 bg-slate-50 hover:bg-slate-100 cursor-pointer text-sm font-semibold"
                    >
                      <span>
                        <IoLogOutOutline />
                      </span>
                      Logout
                    </Link>
                  </li>
                  <li className="flex justify-start items-center gap-2 border-b px-2 py-2 bg-slate-50 hover:bg-slate-100 cursor-pointer text-sm font-semibold">
                    {" "}
                    <span>
                      <FaHandsHelping />
                    </span>
                    Help
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTopSection;
