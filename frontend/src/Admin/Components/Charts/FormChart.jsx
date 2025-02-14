import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import {
  getAllFormByUserIdService,
  getAllFormService,
} from "../../../Services/AdminService/allFormsService";

const noDataFound = require("../../../Assets/no-data-found (2).png");

const FormChart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isAdminId = useSelector((state) => state?.admin?.loggedInAdmin?._id);
  const [allFormsCountDetail, setAllFormsCountDetail] = useState({
    approvalFormsCount: 0,
    observationsCount: 0,
    materialListWithProjectsCount: 0,
    afterControlFormsCount: 0,
    safeJobAnalysesCount: 0,
    allUsers: 0,
  });

  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "basic-pie",
      },
      labels: [
        "Approval Form",
        "Observation Form",
        "Material List",
        "After Control",
        "SJA",
      ],
    },
    series: [],
  });

  useEffect(() => {
    getAllForms();
  }, []);

  useEffect(() => {
    updateChartData();
  }, [allFormsCountDetail]);

  const updateChartData = () => {
    const {
      approvalFormsCount,
      observationsCount,
      materialListWithProjectsCount,
      afterControlFormsCount,
      safeJobAnalysesCount,
    } = allFormsCountDetail;

    setChartData({
      options: {
        chart: {
          id: "basic-pie",
        },
        labels: [
          "Approval Form",
          "Observation Form",
          "Material List",
          "After Control",
          "SJA",
        ],
      },
      series: [
        approvalFormsCount,
        observationsCount,
        materialListWithProjectsCount,
        afterControlFormsCount,
        safeJobAnalysesCount,
      ],
    });
  };

  const getAllForms = async () => {
    try {
      setIsLoading(true);
      let responseData;
      if (isAdminId) {
        responseData = await getAllFormByUserIdService(isAdminId);
      } else {
        responseData = await getAllFormService();
      }

      const getAllUsersResponse = responseData?.data;

      const approvalForms = getAllUsersResponse?.approvalForms?.filter(
        (ele) => !ele?.isDeleted
      );
      const observations = getAllUsersResponse?.observations?.filter(
        (ele) => !ele?.isDeleted
      );
      const materialListWithProjects =
        getAllUsersResponse?.materialListWithProjects?.filter(
          (ele) => !ele?.isDeleted
        );
      const afterControlForms = getAllUsersResponse?.afterControlForms?.filter(
        (ele) => !ele?.isDeleted
      );
      const safeJobAnalyses = getAllUsersResponse?.safeJobAnalyses?.filter(
        (ele) => !ele?.isDeleted
      );

      const setDataInState = {
        approvalFormsCount: approvalForms?.length,
        observationsCount: observations?.length,
        materialListWithProjectsCount: materialListWithProjects?.length,
        afterControlFormsCount: afterControlForms?.length,
        safeJobAnalysesCount: safeJobAnalyses?.length,
      };

      setAllFormsCountDetail(setDataInState);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app overflow-auto">
      <div className="row ">
        <div className="mixed-chart">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <span className="loading loading-bars loading-md"></span>
            </div>
          ) : allFormsCountDetail &&
            Object.values(allFormsCountDetail).every((count) => count > 0) ? (
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="pie"
              className="w-[500px]"
            />
          ) : (
            <div>
              <img
                src={noDataFound}
                alt="img"
                className="w-9/12 flex justify-center items-center"
              />
              <p className="flex justify-center items-center font-bold text-xl text-[#458ad4]">
                No data Found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormChart;
