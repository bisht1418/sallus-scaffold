import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectInviteUpdateService } from "../../Services/projectService";

const Invite = () => {
  const { id, status, userid, type, projectId } = useParams();
  const navigate = useNavigate();

  const putUpdate = async () => {
    const response = await projectInviteUpdateService(id, { status: status });
    if (response.status === "success") {
      if (status === "0") {
        navigate("/");
      } else if (userid === "null") {
        navigate(`/signup?invite_id=${id}&type=${type}&projectId=${projectId}`);
      } else {
        navigate(`/signin?projectId=${projectId}`);
      }
    } else { 
    }
  };

  useEffect(() => {
    putUpdate();
  }, [id, status, userid, type, navigate]);

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <span className="loading loading-bars loading-sm"></span>
    </div>
  );
};

export default Invite;
