import React, { useEffect, useState } from "react";
import {
  getAllFormByUserIdService,
  getAllFormService,
} from "../../Services/AdminService/allFormsService";
import { useSelector } from "react-redux";

const AllFormsCard = () => {
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

  useEffect(() => {
    getAllForms();
  }, []);

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
    <div className="card h-[365px] overflow-auto bg-white text-black">
      <div className="card-body">
        <h2 className="card-title">All Forms</h2>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Form</th>
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
                Object.entries(allFormsCountDetail).map(
                  ([key, value], index) => (
                    <tr key={key}>
                      <th className="text-gray-600">{index + 1}</th>
                      <td className="uppercase font-semibold text-gray-500">
                        {key === "approvalFormsCount"
                          ? "Approval Form"
                          : key === "observationsCount"
                          ? "Observation"
                          : key === "materialListWithProjectsCount"
                          ? "Material List"
                          : key === "afterControlFormsCount"
                          ? "After Control"
                          : "Safe Job Analysis"}
                      </td>
                      <td className="!font-semibold text-gray-500">
                        {value} <span>Forms</span>
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

export default AllFormsCard;
