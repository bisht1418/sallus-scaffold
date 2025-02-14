import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getAllUsersService } from "../../../Services/AdminService/userService";

const DashboardChart = () => {
  const [selectedInterval, setSelectedInterval] = useState("week");
  const [isLoading, setIsLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      const getAllUsersResponse = await getAllUsersService();
      const allUsers = getAllUsersResponse.data;
      const adminsData = allUsers.filter((user) => user.type === 0);
      const usersData = allUsers.filter((user) => user.type === 1);
      setUsers(usersData);
      setAdmins(adminsData);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = (interval) => {
    const now = new Date();
    switch (interval) {
      case "week":
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          return date.toISOString().split("T")[0];
        }).reverse();
      case "month":
        return Array.from({ length: 12 }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          return date.toISOString().split("T")[0].substring(0, 7);
        }).reverse();
      case "year":
        return Array.from({ length: 5 }, (_, i) => {
          const date = new Date(now.getFullYear() - i, 0, 1);
          return date.toISOString().split("T")[0].substring(0, 4);
        }).reverse();
      default:
        return [];
    }
  };

  const getData = (interval, data) => {
    const now = new Date();
    let result = [];
    switch (interval) {
      case "week":
        result = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          return data.filter(
            (user) =>
              new Date(user.createdAt).toDateString() === date.toDateString()
          ).length;
        }).reverse();
        break;
      case "month":
        result = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          return data.filter((user) => {
            const userDate = new Date(user.createdAt);
            return (
              userDate.getFullYear() === date.getFullYear() &&
              userDate.getMonth() === date.getMonth()
            );
          }).length;
        }).reverse();
        break;
      case "year":
        result = Array.from({ length: 5 }, (_, i) => {
          const date = new Date(now.getFullYear() - i, 0, 1);
          return data.filter(
            (user) =>
              new Date(user.createdAt).getFullYear() === date.getFullYear()
          ).length;
        }).reverse();
        break;
      default:
        result = [];
    }
    return result;
  };

  const options = {
    chart: {
      id: "basic-line-chart",
    },
    xaxis: {
      categories: getCategories(selectedInterval),
    },
  };

  const series = [
    {
      name: "Admin",
      data: getData(selectedInterval, admins),
    },
    {
      name: "Users",
      data: getData(selectedInterval, users),
    },
  ];

  const handleIntervalChange = (event) => {
    setSelectedInterval(event.target.value);
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold">Users</h2>

      <div>
        <label htmlFor="interval">Select Interval:</label>
        <select
          id="interval"
          value={selectedInterval}
          onChange={handleIntervalChange}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      <Chart
        options={options}
        series={series}
        type="line"
        width="500"
        className="w-auto"
      />
    </div>
  );
};

export default DashboardChart;
