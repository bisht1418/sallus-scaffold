import React, { useEffect, useState } from "react";
import {
  getAllProjectService,
  getProjectByUserIdService,
} from "../../Services/AdminService/projectService";
import { useSelector } from "react-redux";

const AllProjectCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isAdminId = useSelector((state) => state?.admin?.loggedInAdmin?._id);
  const [allProjectCountDetail, setAllProjectCountDetail] = useState({
    allProject: 0,
    active: 0,
    inactive: 0,
    completed: 0,
  });

  useEffect(() => {
    getAllUsersDetail();
  }, []);

  const getAllUsersDetail = async () => {
    try {
      setIsLoading(true);
      let userResponse;

      if (isAdminId) {
        userResponse = await getProjectByUserIdService(isAdminId);
      } else {
        userResponse = await getAllProjectService();
      }

      const allProject = userResponse.data || [];

      const allProjectCount = allProject.length;
      const completedCount = allProject.filter(
        (project) => project.status === "active" && !project?.isDeleted
      ).length;
      const inActiveCount = allProject.filter(
        (project) => project.status === "inactive" && !project?.isDeleted
      ).length;
      const activeCount = allProject.filter(
        (project) => project.status === "completed" && !project?.isDeleted
      ).length;
      const deletedCount = allProject.filter(
        (project) => project?.isDeleted
      ).length;

      setAllProjectCountDetail({
        allProject: allProjectCount,
        active: completedCount,
        inactive: inActiveCount,
        completed: activeCount,
        deleted: deletedCount,
      });
    } catch (error) {
      setIsLoading(false);
      return error;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="card h-[365px] overflow-auto bg-white text-black">
      <div className="card-body">
        <h2 className="card-title">All Project</h2>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Project</th>
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
                Object.entries(allProjectCountDetail).map(
                  ([key, value], index) => (
                    <tr key={key}>
                      <th className="text-600">{index + 1}</th>
                      <td className="uppercase font-semibold text-gray-500 !text-sm">
                        {key === "allProject"
                          ? "total project"
                          : key === "active"
                          ? "active"
                          : key === "inactive"
                          ? "inactive"
                          : key === "completed"
                          ? "completed"
                          : "deleted"}
                      </td>
                      <td className="!font-semibold text-gray-500">
                        {value} <span>project</span>
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

export default AllProjectCard;
