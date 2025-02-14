import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import {
  Bell,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Check,
  X,
} from "lucide-react";
import {
  getMaterialListAdmin,
  getMaterialListUser,
  getNotification,
  updateMaterialListWithProjectService,
} from "../../Services/materialListWithProjectService";
import {
  deleteNotification,
  getActionLogsList,
} from "../../Services/actionLogsService";
import {
  acceptInvitation,
  updateInviteStatus,
} from "../../Services/invitationServices";
// Components
const NotificationHeader = ({
  roleOfUser,
  tranferOpen,
  handelTransfer,
  showNotification,
  setShowNotification,
}) => (
  <div className="flex justify-between items-center border-b pb-4">
    <h2 className="text-xl font-semibold">Notifications</h2>
    {/* {roleOfUser === 0 && (
      <div role="tablist" className="flex gap-4">
        <button
          role="tab"
          className={`px-4 py-2 rounded-md transition-all ${
            !tranferOpen ? "bg-blue-500 text-white" : "hover:bg-gray-100"
          }`}
          onClick={() => {
            handelTransfer();
            setShowNotification(!showNotification);
          }}
        >
          Notifications
        </button>
      </div>  
    )} */}
  </div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-40">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  </div>
);

const NotificationCard = ({
  notification,
  onDelete,
  isDeleting,
  onAccept,
  onReject,
  setIsNotificationModelOpen
}) => {
  const userDetils = useSelector((state) => state?.auth?.loggedInUser);
  console.log("notification", notification);
  if (notification?.isInviteDetails) {
    if (userDetils.email === notification?.invitedUserEmail) {
      return (
        <div
          className={`relative p-4 bg-white rounded-lg shadow border ${
            isDeleting ? "opacity-50" : ""
          }`}
        >
          <button
            onClick={() => onDelete(notification._id)}
            className="absolute top-2 right-2 hover:bg-gray-100 rounded-full"
          >
            <IoClose className="h-4 w-4" />
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              <span className="font-medium">{notification?.userId?.name}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {timeSince(notification?.createdAt)}
              </span>
            </div>
          </div>

          <div className="mt-2">
            <p className="font-medium">
              {getNotificationActionText(notification)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Project: {notification?.projectId?.projectName}
            </p>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                onAccept(notification.invitedUserId);
                onDelete(notification._id);
                setIsNotificationModelOpen(false);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              disabled={isDeleting}
            >
              <Check className="h-4 w-4" />
              Accept
            </button>
            <button
              onClick={() => {
                onReject(notification.invitedUserId);
                onDelete(notification._id);
                setIsNotificationModelOpen(false);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              disabled={isDeleting}
            >
              <X className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      );
    } else {
      <EmptyState />
      return null;
    }
  }

  return (
    <div
      className={`relative p-4 bg-white rounded-lg shadow border ${
        isDeleting ? "opacity-50" : ""
      }`}
    >
      <button
        onClick={() => onDelete(notification._id)}
        className="absolute top-2 right-2 hover:bg-gray-100 rounded-full"
      >
        <IoClose className="h-4 w-4" />
      </button>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          <span className="font-medium">{notification?.userId?.name}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{timeSince(notification?.createdAt)}</span>
        </div>
      </div>

      <div className="mt-2">
        <p className="font-medium">{getNotificationActionText(notification)}</p>
        <p className="text-sm text-gray-600 mt-1">
          Project: {notification?.projectId?.projectName}
        </p>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-10">
    <Bell className="h-12 w-12 text-gray-400 mb-4" />
    <p className="text-lg font-medium text-gray-600">No notifications</p>
    <p className="text-sm text-gray-500">You're all caught up!</p>
  </div>
);

// Helper Functions
const getNotificationActionText = (notification) => {
  console.log("notification", notification);
  const action = notification.isApprovalDetail
    ? "Approval Form"
    : notification.isMaterialListDetail
    ? "Material List"
    : notification.isEditMaterialListDetail
    ? "Edit Material List"
    : notification.isEditApprovalDetail
    ? "Edit Approval Form"
    : notification.isObservation
    ? "Observation Form"
    : notification.isInviteDetails
    ? "User Invite"
    : "Edit Observation";

  const id =
    notification.isApprovalDetail || notification.isEditApprovalDetail
      ? notification?.approvalFormDetail?.scaffoldIdentificationNumber
      : notification?.materialListDetail?.scaffoldIdentificationNumber;

  return `Created ${action}${id ? ` (ID: ${id})` : ""}`;
};

const timeSince = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const units = [
    { name: "year", seconds: 60 * 60 * 24 * 365 },
    { name: "month", seconds: 60 * 60 * 24 * 30 },
    { name: "week", seconds: 60 * 60 * 24 * 7 },
    { name: "day", seconds: 60 * 60 * 24 },
    { name: "hour", seconds: 60 * 60 },
    { name: "minute", seconds: 60 },
  ];

  for (const unit of units) {
    const quotient = Math.floor(diffInSeconds / unit.seconds);
    if (quotient >= 1) {
      return `${quotient} ${unit.name}${quotient > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

// Main Component
export const ModalNotification = ({ setIsNotificationModelOpen }) => {
  const [tranferOpen, setTransferOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLogs, setActionLogs] = useState([]);
  const [currentDeletedId, setCurrentDeletedId] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [loadingStates, setLoadingStates] = useState({});

  const roleOfUser = useSelector((state) => state?.auth?.loggedInUser?.type);
  const notification = useSelector(
    (state) => state?.materialListWithProject?.notification
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    fetchNotification();
    getActionLogs();
  }, []);

  useEffect(() => {
    if (actionLogs) {
      setNotificationCount(actionLogs.length);
    }
  }, [actionLogs]);

  const fetchNotification = async () => {
    setLoading(true);
    try {
      await getNotification();
    } catch (error) {
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const getActionLogs = async () => {
    try {
      const response = await getActionLogsList();
      console.log("response", response);
      setActionLogs(response?.data || []);
    } catch (error) {
      toast.error("Failed to fetch action logs");
    }
  };

  const handleNotificationDelete = async (id) => {
    setCurrentDeletedId(id);
    try {
      await deleteNotification(id);
      toast.success("Notification deleted");
      getActionLogs();
    } catch (error) {
      toast.error("Failed to delete notification");
    } finally {
      setCurrentDeletedId("");
    }
  };

  const handelTransfer = () => setTransferOpen(!tranferOpen);

  const handleAccept = async (inviteId) => {
    setLoadingStates((prev) => ({ ...prev, [inviteId]: true }));
    try {
      const response = await updateInviteStatus(inviteId, 1);
      if (response.status === "success") {
        toast.success(response.message);
        return response.updatedInvite;
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [inviteId]: false }));
    }
  };

  const handleReject = async (inviteId) => {
    setLoadingStates((prev) => ({ ...prev, [inviteId]: true }));
    try {
      const response = await updateInviteStatus(inviteId, 0);
      if (response.status === "success") {
        toast.success(response.message);
        return response.updatedInvite;
      } else {
        throw new Error(response.message || "Failed to reject invitation");
      }
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoadingStates((prev) => ({ ...prev, [inviteId]: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
      <div className="w-[35vw] min-w-[400px] bg-white h-full shadow-xl">
        <div className="p-6 h-full flex flex-col">
          <NotificationHeader
            roleOfUser={roleOfUser}
            tranferOpen={tranferOpen}
            handelTransfer={handelTransfer}
            showNotification={showNotification}
            setShowNotification={setShowNotification}
          />

          <button
            onClick={() => setIsNotificationModelOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <IoClose className="h-6 w-6" />
          </button>

          <div className="flex-1 overflow-auto mt-4">
            {loading ? (
              <LoadingSpinner />
            ) : actionLogs?.length > 0 ? (
              <div className="space-y-4">
                {actionLogs.map((notification) => (
                  <NotificationCard
                    key={notification._id}
                    notification={notification}
                    onDelete={handleNotificationDelete}
                    isDeleting={currentDeletedId === notification._id}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    setIsNotificationModelOpen={setIsNotificationModelOpen}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>

          {notificationCount > 0 && (
            <div className="py-3 px-4 border-t">
              <p className="text-sm text-gray-600">
                {notificationCount} notification
                {notificationCount !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalNotification;
