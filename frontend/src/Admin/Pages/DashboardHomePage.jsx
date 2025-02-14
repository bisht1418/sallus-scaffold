import React from "react";
import DashboardCardInfo from "../Components/DashboardCardInfo";
import { salesData } from "../DummyData/DashboardCardInfoDummyData";
import AdminDashboard from "./AdminDashboard";
import AllUsersCard from "../Components/AllUsersCard";
import AllProjectCard from "../Components/AllProjectCard";
import AllFormsCard from "../Components/AllFormsCard";
import { useSelector } from "react-redux";
import ProjectGraph from "../Components/Charts/ProjectGraph";
import FormChart from "../Components/Charts/FormChart";

const DashboardHomePage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div>
        <AdminDashboard data={DashboardHomePageProps} />
      </div>
    </div>
  );
};

const DashboardHomePageProps = () => {
  const isAdmin = useSelector(
    (state) => state?.admin?.loggedInAdmin?.type === 0
  );
  return (
    <div>
      <div className="p-4 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2  justify-center items-center text-center m-auto mt-5">
        {salesData?.map(
          (element, index) =>
            // <DashboardCardInfo element={element} index={index} />
            ""
        )}
      </div>
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-2 justify-center items-center m-auto p-4 ">
        <div>
          <AllUsersCard isAdmin={isAdmin} />
        </div>
        <div>
          <AllProjectCard isAdmin={isAdmin} />
        </div>
        <div>
          <AllFormsCard isAdmin={isAdmin} />
        </div>
      </div>
      <div className="p-4 mx-4 rounded-xl my-5  bg-white overflow-auto scrollbar">
        <div className="flex justify-around items-start gap-5">
          <div className="relative flex justify-center items-center  !h-[614px]">
            <p className="absolute top-0 left-0 text-xl font-bold hover:text-gray-800 cursor-pointer">
              Forms
            </p>
            <FormChart />
          </div>
          <div className="border h-[614px] "></div>
          <div className="flex justify-center items-center ">
            <ProjectGraph />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
