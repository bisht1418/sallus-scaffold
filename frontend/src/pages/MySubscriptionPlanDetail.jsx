import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelMainUserSubscription,
  createSubscriptionAccessByOneToOtherUser,
  deleteSubscriptionUser,
  getSubscriptionActiveDataCount,
  getSubscriptionData,
  getSubscriptionDetailByUserId,
  getSubscriptionDetails,
  removeSubscriptionByUserId,
  revokeSubscription,
} from "../Services/subscriptionService";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import Header from "../components/Header";
import TopSection from "../components/forms/TopSection";
import Footer from "../components/Footer";
import { t } from "../utils/translate";
import { setLoading, setUser } from "../Redux/Slice/authSlice";
import { ArrowLeft, Eye, EyeOff, X } from "lucide-react";
const backgroundImageUrl = require("../Assets/background_image.jpg");
const notSubscribed = require("../Assets/not_subscribed.jpg");
const noDataFound = require("../Assets/no_data_found.webp");

const MySubscriptionPlanDetail = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const [isLoading, setIsLoading] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [customerSubscriptionDetails, setCustomerSubscriptionDetails] =
    useState({});
  const [pricingData, setPricingData] = useState([]);
  const customerId = useSelector((state) => state?.auth?.loggedInUser?._id);
  const loggedInUserDetails = useSelector((state) => state?.auth?.loggedInUser);
  const [subscriptionPlan, setSubscriptionPlan] = useState({});
  const [isSubscriptionPurchase, setIsSubscriptionPurchase] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [viewUsersDetails, setViewUsersDetails] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userSubscribedCount, setUserSubscriberCount] = useState(0);
  const [userSubscriberData, setUserSubscriberData] = useState([]);
  const [currentEvent, setCurrentEvent] = useState("cancel_subscription");
  const [currentRevokeId, setCurrentRevokeId] = useState("");
  const [currentIndex, setCurrentIndex] = useState("");
  const userId = useSelector((state) => state?.auth?.loggedInUser?._id);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isAddUserLoading, setIsAddUserLoading] = useState(false);

  const [userDetails, setUserDetails] = useState({
    userName: "",
    userEmail: "",
    phoneNumber: "",
    company: "",
    password: "",
    accessLevel: "1",
  });

  useEffect(() => {
    getAllSubscriptionPlan();
    getUserSubscriptionDetail(customerId);
    getSubscriptionDataAndCount();
  }, [customerId]);

  useEffect(() => {
    if (customerSubscriptionDetails && pricingData?.length > 0) {
      const planDetails = pricingData?.find(
        (plan) =>
          plan?.subscriptionType === Number(customerSubscriptionDetails.plan)
      );
      setSubscriptionPlan(planDetails);
    }
  }, [customerSubscriptionDetails, pricingData]);

  async function getSubscriptionDataAndCount() {
    const dataResponse = await getSubscriptionData(customerId);
    const userDataResponse = dataResponse?.data;
    const filterUserDataResponse = userDataResponse?.filter(
      (item) => !item?.isDeleted && item?.isInvitedUser
    );
    setUserSubscriberData(filterUserDataResponse);

    const countResponse = await getSubscriptionActiveDataCount(customerId);
    setUserSubscriberCount(countResponse?.data);
  }

  async function getUserSubscriptionDetail(customerId) {
    try {
      setIsLoading(true);
      const response = await getSubscriptionDetailByUserId(customerId);
      console.log("response", response);
      if (response.date === null || !response?.data?.isActive) {
        setIsSubscriptionPurchase(false);
      } else {
        setIsSubscriptionPurchase(true);
        setCustomerSubscriptionDetails(response?.data);
      }
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function getAllSubscriptionPlan() {
    try {
      const response = await getSubscriptionDetails();
      setPricingData(response?.data);
    } catch (error) {
    } finally {
    }
  }

  function getDateDetails(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth();
    const year = date.getFullYear();
    const dateOfMonth = date.getDate();
    const monthName = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][month];
    return `${dateOfMonth} ${monthName} ${year}`;
  }

  function remainingTime(endTime) {
    const endDate = new Date(endTime);
    const now = new Date();
    const difference = endDate - now;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }

  const handleCancelSubscription = async () => {
    const sendData = {
      ...customerSubscriptionDetails,
      isActive: false,
      plan: null,
      addedUsersCount: 0,
      paidSubscriptionByItself: false,
    };
    await removeSubscriptionByUserId(currentId, sendData);
    getAllSubscriptionPlan();
    getUserSubscriptionDetail(customerId);
  };

  const dispatch = useDispatch();

  const handleConfirmation = async (isConfirmation) => {
    try {
      if (isConfirmation) {
        if (currentEvent === "cancel_subscription") {
          const revokeResponse = await revokeSubscription(currentRevokeId, {
            subscriptionRevokeStatus: true,
          });
          if (revokeResponse.success) {
            toast.success("Subscription Cancelled Successfully");
            getSubscriptionDataAndCount();
            getUserSubscriptionDetail(customerId);
            setCurrentEvent("continue_subscription");
          } else {
            toast.error("Something Went Wrong");
          }
          setShowConfirmationModal(false);
          return;
        }
        if (currentEvent === "cancel_main_user_subscription") {
          const revokeResponse = await cancelMainUserSubscription(userId);
          if (revokeResponse.success) {
            dispatch(
              setUser({ ...loggedInUserDetails, isSubscription: false })
            );
            toast.success("Subscription Cancelled Successfully");
            getSubscriptionDataAndCount();
            getUserSubscriptionDetail(customerId);
            setCurrentEvent("continue_subscription");
            navigate("/");
          } else {
            toast.error("Something Went Wrong");
          }
          setShowConfirmationModal(false);
          return;
        }

        if (currentEvent === "continue_subscription") {
          const revokeResponse = await revokeSubscription(currentRevokeId, {
            subscriptionRevokeStatus: false,
          });
          if (revokeResponse.success) {
            toast.success("Subscription Continue Successfully");
            getSubscriptionDataAndCount();
            getUserSubscriptionDetail(customerId);
            setCurrentEvent("cancel_subscription");
          } else {
            toast.error("Something Went Wrong");
          }
          setShowConfirmationModal(false);
          return;
        }

        if (currentEvent === "delete_subscription") {
          const deleteResponse = await deleteSubscriptionUser(currentRevokeId);
          if (deleteResponse.success) {
            toast.success("Subscription Deleted Successfully");
            getSubscriptionDataAndCount();
            getUserSubscriptionDetail(customerId);
          } else {
            toast.error("Something Went Wrong");
          }
          setShowConfirmationModal(false);
          return;
        }

        setShowConfirmationModal(false);
        setIsLoading(true);
        await handleCancelSubscription();
        setIsLoading(false);
      }
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error handling confirmation:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    setIsAddUserModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsAddUserLoading(true);
      setAddUserLoading(true);
      const startTime = new Date();
      const delete_id_Data = { ...customerSubscriptionDetails };
      delete delete_id_Data["_id"];
      delete delete_id_Data["userId"];
      const sendData = {
        ...delete_id_Data,
        ...userDetails,
        startTime: startTime.toISOString(),
        paidSubscriptionByItself: false,
        subscribedBy: customerId,
        isInvitedUser: true,
      };
      const responseData = await createSubscriptionAccessByOneToOtherUser(
        sendData
      );

      if (responseData?.isEmailExist) {
        toast.error("Email Already Exist");
        return;
      }

      if (responseData.success) {
        toast.success("User Added SuccessFully");
        getSubscriptionDataAndCount();
        getUserSubscriptionDetail(customerId);
      }
    } catch (error) {
      setAddUserLoading(false);
      toast.error(error.message);
    } finally {
      setAddUserLoading(false);
      setIsAddUserModalOpen(false);
      setIsAddUserLoading(false);
    }
  };

  const handleSetCurrentEvent = async (revokeStatus) => {
    if (revokeStatus === "cancel_subscription") {
      setCurrentEvent("cancel_subscription");
    } else {
      setCurrentEvent("continue_subscription");
    }
  };

  useEffect(() => {
    if (isAddUserModalOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isAddUserModalOpen]);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="min-h-screen bg-gray-200 z-0"
    >
      <Header />

      <TopSection
        keys={"unique"}
        title={t("Welcome to Salus Scaffold!")}
        breadcrumData={[t("home"), t("my_subscription_header")]}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isSubscriptionPurchase ? (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("my_subscription_status")}
            </h2>
            <p className="text-gray-500 mb-8">
              You don't have any active subscription plans.
            </p>
            <button
              onClick={() => navigate("/subscription")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Plans
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Subscription Overview Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    {subscriptionPlan?.mainTitle}
                  </h2>
                  <button
                    onClick={() => {
                      setCurrentEvent("cancel_main_user_subscription");
                      setCurrentRevokeId(customerSubscriptionDetails?._id);
                      setShowConfirmationModal(true);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Time Details */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">
                      Subscription Period
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-900">
                        <span className="font-medium">Start:</span>{" "}
                        {getDateDetails(customerSubscriptionDetails?.startTime)}
                      </p>
                      <p className="text-gray-900">
                        <span className="font-medium">End:</span>{" "}
                        {getDateDetails(customerSubscriptionDetails?.endTime)}
                      </p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-lg font-semibold text-blue-600">
                          {
                            remainingTime(customerSubscriptionDetails?.endTime)
                              ?.days
                          }{" "}
                          days left
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Users Count */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">
                      User Management
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-900">
                        <span className="font-medium">Active Users:</span>{" "}
                        {userSubscribedCount}
                      </p>
                      <p className="text-gray-900">
                        <span className="font-medium">Total Capacity:</span>{" "}
                        {subscriptionPlan?.users}
                      </p>
                      <div className="mt-3">
                        <div className="h-2 bg-gray-200 rounded">
                          <div
                            className="h-2 bg-blue-600 rounded"
                            style={{
                              width: `${
                                (userSubscribedCount /
                                  subscriptionPlan?.users) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">
                      Plan Features
                    </h3>
                    <ul className="space-y-2">
                      {subscriptionPlan?.features
                        ?.slice(0, 4)
                        .map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center text-gray-900"
                          >
                            {feature.isApplicable ? (
                              <svg
                                className="w-5 h-5 text-green-500 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5 text-gray-400 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                              </svg>
                            )}
                            <span className="text-sm">
                              {currentLanguage === "no"
                                ? feature.featureNameNo
                                : feature.featureName}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* User Management Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Manage Users
                  </h2>
                  <button
                    onClick={() => handleAddUser()}
                    disabled={userSubscribedCount === subscriptionPlan?.users}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors
                        ${
                          userSubscribedCount === subscriptionPlan?.users
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                  >
                    Add User
                  </button>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Access Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userSubscriberData?.map((user, index) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.userName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.userEmail}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.company}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  user.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getDateDetails(user.startTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => {
                                  setCurrentIndex(index);
                                  handleSetCurrentEvent(
                                    user.isActive
                                      ? "cancel_subscription"
                                      : "continue_subscription"
                                  );
                                  setCurrentRevokeId(user._id);
                                  setShowConfirmationModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                {user.isActive ? "Deactivate" : "Activate"}
                              </button>
                              <button
                                onClick={() => {
                                  setCurrentEvent("delete_subscription");
                                  setCurrentRevokeId(user._id);
                                  setShowConfirmationModal(true);
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {userSubscriberData?.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No users added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Action
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to{" "}
              {currentEvent === "delete_subscription"
                ? "remove this user"
                : currentEvent === "cancel_main_user_subscription"
                ? "cancel your subscription"
                : userSubscriberData?.[currentIndex]?.isActive
                ? "deactivate this user"
                : "activate this user"}
              ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleConfirmation(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmation(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddUserModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop with blue tint */}
          <div className="absolute inset-0 bg-gray-400 bg-opacity-30 backdrop-blur-sm" />

          <div className="relative w-full max-w-md mx-4">
            {/* Card Container */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-auto max-h-[90vh]">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="flex items-center text-white hover:bg-blue-700 rounded-lg px-3 py-2 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="text-white text-xl font-semibold mt-4">
                  Add New User
                </h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        userName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="mail@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        userEmail: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="000-000-0000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter company name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        company: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Access Level
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        accessLevel: e.target.value,
                      })
                    }
                    value={userDetails.accessLevel}
                  >
                    <option value="0">Admin</option>
                    <option value="1">User</option>
                    <option value="2">Guest</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          password: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAddUserLoading}
                  className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  {isAddUserLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Add User"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MySubscriptionPlanDetail;
