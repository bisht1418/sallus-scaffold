import React, { useEffect, useState } from "react";
import {
  getAllUsersService,
  getUserById,
} from "../../Services/AdminService/userService";
import { useSelector } from "react-redux";

const AllUsersCard = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const isAdminId = useSelector((state) => state?.admin?.loggedInAdmin?._id);
  const [allUserCountDetail, setAllUserCountDetail] = useState({
    allUsers: 0,
    admin: 0,
    users: 0,
    guests: 0,
  });

  useEffect(() => {
    getAllUsersDetail();
  }, []);

  const getAllUsersDetail = async () => {
    try {
      setIsLoading(true);
      let userResponse = await getAllUsersService();

      if (isAdminId) {
        userResponse = await getUserById(isAdminId);
      } else {
        userResponse = await getAllUsersService();
      }

      const allUsers = userResponse.data || [];
      const allUserCount = allUsers.length;
      const adminCount = allUsers.filter((user) => user.type === 0).length;
      const usersCount = allUsers.filter((user) => user.type === 1).length;
      const guestCount = allUsers.filter((user) => user.type === 2).length;

      if (props?.isAdmin) {
        setAllUserCountDetail({
          users: usersCount,
        });
      } else {
        setAllUserCountDetail({
          allUsers: allUserCount,
          admin: adminCount,
          users: usersCount,
          guests: guestCount,
        });
      }
    } catch (error) {
      setIsLoading(false);
      return error;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="card h-[365px]  bg-white text-black">
      <div className="card-body">
        <h2 className="card-title">All Users</h2>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Users</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <div className="font-bold text-sm flex justify-center items-center w-full h-32">
                  Loading...
                  <span className="loading loading-bars loading-xs"></span>
                </div>
              ) : (
                Object.entries(allUserCountDetail).map(
                  ([key, value], index) => (
                    <tr key={key}>
                      <th className="text-gray-600">{index + 1}</th>
                      <td className="uppercase font-semibold text-gray-500">
                        {key === "allUsers"
                          ? "all users"
                          : key === "users"
                          ? "users"
                          : key === "admin"
                          ? "admin"
                          : "guest"}
                      </td>
                      <td className="!font-semibold text-gray-500">
                        {value}
                        <span className="ml-1">
                          {key === "allUsers"
                            ? "users"
                            : key === "users"
                            ? "users"
                            : key === "admin"
                            ? "admin"
                            : "guest"}
                        </span>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsersCard;
