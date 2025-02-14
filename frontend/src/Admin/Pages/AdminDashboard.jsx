import React, { useState } from "react";
import SideBar from "../Components/SideBar";
import { FaBars } from "react-icons/fa";
import DashboardTopSection from "../Components/DashboardTopSection";
import { useSelector } from "react-redux";

const AdminDashboard = (props) => {
  const [openSideBar, setOpenSidebar] = useState(false);

  const isAdmin = useSelector(
    (state) => state?.admin?.loggedInAdmin?.type === 0
  );
  return (
    <div className="flex h-screen overflow-hidden scrollbar">
      <div
        className={`fixed left-0 top-0 z-50 h-screen w-[280px] bg-[#1c2434] text-white overflow-y-hidden duration-300 ease-linear lg:static lg:translate-x-0 ${
          openSideBar ? "translate-x-0 opacity-100" : "-translate-x-full"
        }`}
      >
        <SideBar setOpenSidebar={setOpenSidebar} isAdmin={isAdmin} />
      </div>
      <div className="relative flex flex-1 flex-col overflow-y-hidden overflow-x-hidden scrollbar">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-[#f1f5f9]">
          <div className="lg:hidden p-4 cursor-pointer flex">
            <FaBars size={24} onClick={() => setOpenSidebar(true)} />
          </div>

          <div className="bg-[#f1f5f9]">
            <hr />
            <DashboardTopSection />
            <hr />
          </div>

          <div>{props?.data ? props.data() : ""}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
