import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
  getAllProjectService,
  getProjectByUserIdService,
} from "../../../Services/AdminService/projectService";
import { useSelector } from "react-redux";

const noDataFound = require("../../../Assets/no-data-found (2).png");


const ProjectGraph = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const isAdminId = useSelector((state) => state?.admin?.loggedInAdmin?._id);
  const [interval, setInterval] = useState("");
  const [offset, setOffset] = useState(0);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [currentPeriod, setCurrentPeriod] = useState("");

  useEffect(() => {
    updateCategoriesAndData();
  }, [interval, offset, projects]);

  const updateCategoriesAndData = () => {
    const categories = getCategories(interval, offset);
    const data = getData(interval, offset);
    const currentPeriod = getCurrentPeriod(interval, offset);
    setCategories(categories);
    setData(data);
    setCurrentPeriod(currentPeriod);
  };

  const getCategories = (interval, offset) => {
    const today = new Date();
    let startDate;

    switch (interval) {
      case "week":
        startDate = new Date(
          today.setDate(today.getDate() - today.getDay() - offset * 7)
        );
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          return `${date.getDate()} (${date.toLocaleString("en-US", {
            weekday: "short",
          })})`;
        });
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth() - offset, 1);
        const daysInMonth = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          0
        ).getDate();
        return Array.from(
          { length: Math.ceil(daysInMonth / 7) },
          (_, i) => `Week ${i + 1}`
        );
      case "year":
        startDate = new Date(today.getFullYear() - offset, 0, 1);
        return ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];
      default:
        startDate = new Date(today.getFullYear(), today.getMonth() - offset, 1);
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
    }
  };

  const getData = (interval, offset) => {
    const today = new Date();
    let startDate;

    switch (interval) {
      case "week":
        startDate = new Date(
          today.setDate(today.getDate() - today.getDay() - offset * 7)
        );
        return getCountsByDay(startDate, 7);
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth() - offset, 1);
        return getCountsByWeek(startDate);
      case "year":
        startDate = new Date(today.getFullYear() - offset, 0, 1);
        return getCountsByQuarter(startDate);
      default:
        startDate = new Date(today.getFullYear(), today.getMonth() - offset, 1);
        return getCountsByMonth(startDate);
    }
  };

  const getCountsByDay = (startDate, days) => {
    const counts = Array(days).fill(0);
    projects.forEach((project) => {
      const createdAt = new Date(project.createdAt);
      const dayDifference = Math.floor(
        (createdAt - startDate) / (1000 * 60 * 60 * 24)
      );
      if (dayDifference >= 0 && dayDifference < days) {
        counts[dayDifference]++;
      }
    });
    return counts;
  };

  const getCountsByWeek = (startDate) => {
    const weeks = Array(4).fill(0);
    projects.forEach((project) => {
      const createdAt = new Date(project.createdAt);
      const weekIndex = Math.floor(
        (createdAt - startDate) / (1000 * 60 * 60 * 24 * 7)
      );
      if (weekIndex >= 0 && weekIndex < 4) {
        weeks[weekIndex]++;
      }
    });
    return weeks;
  };

  const getCountsByQuarter = (startDate) => {
    const quarters = Array(4).fill(0);
    projects.forEach((project) => {
      const createdAt = new Date(project.createdAt);
      const monthIndex = createdAt.getMonth();
      const quarterIndex = Math.floor(monthIndex / 3);
      if (createdAt.getFullYear() === startDate.getFullYear()) {
        quarters[quarterIndex]++;
      }
    });
    return quarters;
  };

  const getCountsByMonth = (startDate) => {
    const months = Array(12).fill(0);
    projects.forEach((project) => {
      const createdAt = new Date(project.createdAt);
      const monthIndex = createdAt.getMonth();
      if (createdAt.getFullYear() === startDate.getFullYear()) {
        months[monthIndex]++;
      }
    });
    return months;
  };

  const getCurrentPeriod = (interval, offset) => {
    const today = new Date();
    let startDate;

    switch (interval) {
      case "week":
        startDate = new Date(
          today.setDate(today.getDate() - today.getDay() - offset * 7)
        );
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        return `${startDate.toDateString()} - ${endDate.toDateString()}`;
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth() - offset, 1);
        return `${startDate.toLocaleString("default", {
          month: "long",
        })} ${startDate.getFullYear()}`;
      case "year":
        startDate = new Date(today.getFullYear() - offset, 0, 1);
        return `${startDate.getFullYear()}`;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth() - offset, 1);
        return `${startDate.toLocaleString("default", {
          month: "long",
        })} ${startDate.getFullYear()}`;
    }
  };

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
    setOffset(0);
  };

  const handlePrevious = () => {
    setOffset(offset + 1);
  };

  const handleNext = () => {
    setOffset(Math.max(0, offset - 1));
  };

  const options = {
    chart: {
      id: "dynamic-chart",
    },
    xaxis: {
      categories: categories,
    },
  };

  const series = [
    {
      name: "Projects",
      data: data,
    },
  ];

  useEffect(() => {
    getAllProject();
  }, []);

  const getAllProject = async () => {
    try {
      setIsLoading(true);

      let getAllProjectResponse;

      if (isAdminId) {
        getAllProjectResponse = await getProjectByUserIdService(isAdminId);
        const allProject = getAllProjectResponse.data;
        setProjects(allProject);
      } else {
        const getAllProjectResponse = await getAllProjectService();
        const allProject = getAllProjectResponse.data;
        setProjects(allProject);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app overflow-auto">
      <h2 className="text-xl font-bold hover:text-gray-800 cursor-pointer">
        Projects
      </h2>

      <div className="flex justify-between items-center">
        <div>
          <select
            onChange={handleIntervalChange}
            value={interval}
            className="select  w-full max-w-xs"
          >
            <option disabled selected>
              Select the Interval
            </option>
            <option value="week">Days</option>
            <option value="month">Week</option>
            <option value="">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        <div className="flex gap-5">
          <button
            onClick={handlePrevious}
            className="border bg-[#0081c8] hover:bg-[#0072ca] text-white font-semibold px-3 py-1.5 rounded-xl "
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={offset === 0}
            className="border bg-[#0081c8] hover:bg-[#0072ca] text-white font-semibold px-3 py-1.5 rounded-xl "
          >
            Next
          </button>
        </div>
      </div>
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <strong>{currentPeriod}</strong>
      </div>
      <div className="row">
        <div className="mixed-chart">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <span className="loading loading-bars loading-md"></span>
            </div>
          ) : projects?.length > 0 ? (
            <Chart
              options={options}
              series={series}
              type="bar"
              className="w-[700px] h-[500px]"
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

export default ProjectGraph;
