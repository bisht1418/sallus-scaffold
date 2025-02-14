import React, { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import { useSelector } from "react-redux";
import { projectInviteService } from "../../Services/projectService";
import { toast } from "react-toastify";
import { t } from "../../utils/translate";
import {
  getAllProjectService,
  getProjectByUserIdService,
} from "../../Services/AdminService/projectService";

const InviteUserForProject = () => {
  return (
    <div>
      <AdminDashboard data={InviteUserForProjectProps} />
    </div>
  );
};

const InviteUserForProjectProps = () => {
  const [projects, setProjects] = useState([]);
  const isAdminId = useSelector((state) => state?.admin?.loggedInAdmin?._id);
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    type: 1,
    projectNumber: "",
    projectId: "",
    userId: isAdminId,
  });

  useEffect(() => {
    getAllProject();
  }, []);

  const handleInviteEmail = async (e) => {
    try {
      e.preventDefault();
      if (isValidEmail(inviteData?.email)) {
        if (inviteData?.projectId) {
          setIsInviteLoading(true);
          const response = await projectInviteService(inviteData);
          if (response.status === "success") {
            toast.success(t("projectInvitedSuccessfully"));
            setInviteData({
              email: "",
              type: 1,
              projectNumber: "",
              projectId: "",
              userId: isAdminId,
            });
          } else {
            toast.error(`${response?.message}`);
            setInviteData({
              email: "",
              type: 1,
              projectNumber: "",
              projectId: "",
              userId: isAdminId,
            });
          }
        } else {
          toast.error("Please select project");
        }
      } else {
        toast.error("Invalid Email");
      }
    } catch (Error) {
      return Error;
    } finally {
      setIsInviteLoading(false);
    }
  };

  const getAllProject = async () => {
    try {
      let getAllProjectResponse;

      if (isAdminId) {
        getAllProjectResponse = await getProjectByUserIdService(isAdminId);
        const allProject = getAllProjectResponse.data?.filter(
          (ele) => !ele.isDeleted
        );
        setProjects(allProject);
      } else {
        const getAllProjectResponse = await getAllProjectService();
        const allProject = getAllProjectResponse.data?.filter(
          (ele) => !ele.isDeleted
        );
        setProjects(allProject);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
    }
  };

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  return (
    <div className="">
      <div className="border p-4 m-4 rounded-xl bg-white">
        <p className="text-xl font-bold uppercase">Invite Users</p>
        <div>
          <form>
            <div className="mt-5 bg-white  mx-4 p-2  rounded-md">
              <div className=" p-4 ">
                <div className="sm:w-1/2 mx-auto">
                  <div className="relative z-0 w-full mb-5 group">
                    <label
                      for="floating_email"
                      className="text-xs font-semibold"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      name="floating_email"
                      id="floating_email"
                      className="block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 !px-2"
                      placeholder=" "
                      onChange={(e) =>
                        setInviteData({
                          ...inviteData,
                          email: e.target.value,
                        })
                      }
                      value={inviteData?.email}
                    />
                    {!inviteData?.email && (
                      <p className="text-xs text-red-600 font-semibold">
                        Please fill this detail
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:w-1/2 mx-auto">
                  <div className="relative z-0 w-full mb-5 group">
                    <label
                      for="floating_email"
                      className="text-xs font-semibold"
                    >
                      Assign Project
                    </label>
                    <div className="relative z-0 w-full mb-5 group">
                      <select
                        onChange={(e) => {
                          const selectProject = JSON.parse(e.target.value);
                          setInviteData({
                            ...inviteData,
                            projectId: selectProject?._id,
                            projectNumber: selectProject?.projectNumber,
                          });
                        }}
                        value={inviteData?.projectId}
                        className="select select-bordered w-full max-w-full"
                      >
                        <option disabled selected>
                          Please Select Project Assign
                        </option>
                        {projects?.map((ele) => (
                          <option value={JSON.stringify(ele)}>
                            {ele?.projectName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="sm:w-1/2 mx-auto">
                  <div className="relative z-0 w-full mb-5 group">
                    <label
                      for="floating_email"
                      className="text-xs font-semibold"
                    >
                      Project Number
                    </label>
                    <input
                      type="projectNumber"
                      name="floating_email"
                      id="floating_email"
                      className="block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 !px-2"
                      placeholder=" "
                      value={inviteData?.projectNumber}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 mb-10 flex justify-center items-center">
              <button
                type="submit"
                className="text-white bg-[#0072ca] hover:bg-[#0e598a]"
                onClick={(e) => {
                  handleInviteEmail(e);
                }}
              >
                {isInviteLoading ? (
                  <div className="flex justify-center items-center gap-2">
                    Loading
                    <span className="loading loading-bars loading-sm"></span>
                  </div>
                ) : (
                  "Invite"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteUserForProject;
