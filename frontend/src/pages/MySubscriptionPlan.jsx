import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoArrowBackCircle } from "react-icons/io5";
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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import { setUser } from "../Redux/Slice/authSlice";
import { t } from "../utils/translate";

const backgroundImageUrl = require("../Assets/background_image.jpg");
const notSubscribed = require("../Assets/not_subscribed.jpg");
const noDataFound = require("../Assets/no_data_found.webp");
const planImage = require("../Assets/planImage.jpg");

const MySubscriptionPlan = (props) => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const [isLoading, setIsLoading] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [customerSubscriptionDetails, setCustomerSubscriptionDetails] =
    useState({});
  const [pricingData, setPricingData] = useState([]);
  const customerId = useSelector((state) => state?.auth?.loggedInUser?._id);
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
  const loggedInUserDetails = useSelector((state) => state?.auth?.loggedInUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isSubscription = useSelector(
    (state) => state?.auth?.loggedInUser?.isSubscription
  );

  const [userDetails, setUserDetails] = useState({
    userName: "",
    userEmail: "",
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
      (item) => !item?.isDeleted
    );
    setUserSubscriberData(filterUserDataResponse);

    const countResponse = await getSubscriptionActiveDataCount(customerId);
    setUserSubscriberCount(countResponse?.data);
  }

  async function getUserSubscriptionDetail(customerId) {
    try {
      setIsLoading(true);
      const response = await getSubscriptionDetailByUserId(customerId);
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
    if (props?.mySubscriptionPlan) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = 'auto'; // Enable scrolling
    }

    // Cleanup when the component unmounts or popup closes
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [props?.mySubscriptionPlan]);

  console.log(userSubscriberData,'userSubscriberData')

  return (
    <div>
      {props?.mySubscriptionPlan && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-90  z-50 ">
          {/* <div
            style={{
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className="w-[100vw] border h-[100vh] bg-slate-100 rounded-md overflow-auto "
          > */}
            <IoArrowBackCircle
              onClick={() => props.setMySubscriptionPlan(false)}
              className="absolute top-[1%] left-[2%] text-[1.875rem] font-bold bg-blue-500 text-white rounded-full border cursor-pointer mt-5"
            />
            {isSubscription ? (
              <div className=" flex flex-col justify-center items-center h-[90vh] w-full ">
                <section className="text-gray-700 body-font bg-white overflow-auto mx-auto sm:mt-[6rem]  rounded-xl relative">
                  <div className="w-full container px-5 py-10 mx-auto">
                    <div className="lg:w-full mx-auto flex flex-wrap">
                      <div className=" mt-6 lg:mt-0">
                        <h2 className="text-sm title-font text-gray-500 tracking-widest uppercase font-bold">
                          {t("my_subscription_plan_text")}
                        </h2>
                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                          {currentLanguage === "no"
                            ? subscriptionPlan?.mainTitleNo
                            : subscriptionPlan?.mainTitle}
                        </h1>
                        <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                          {subscriptionPlan?.features?.map((list) => (
                            <li className="flex items-center">
                              <svg
                                className={`w-3.5 h-3.5 me-2 ${
                                  list?.isApplicable
                                    ? "text-green-500 dark:text-green-400"
                                    : "text-gray-500 dark:text-gray-400"
                                }  flex-shrink-0`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                              </svg>
                              {currentLanguage === "no"
                                ? list.featureNameNo
                                : list.featureName}
                            </li>
                          ))}
                        </ul>
                        <div className="flex sm:flex-row flex-col gap-5 mt-6 items-start pb-5 border-b-2 border-gray-200 mb-5">
                          <div>
                            <h1 className="text-gray-900 text-md title-font font-medium mb-1">
                              {" "}
                              {t("my_subscription_start")} :{" "}
                              <span className=" font-semibold">
                                {getDateDetails(
                                  customerSubscriptionDetails?.startTime
                                )}
                              </span>{" "}
                            </h1>
                            <h1 className="text-gray-900 text-md title-font font-medium mb-1">
                              {t("my_subscription_end")} :{" "}
                              <span className=" font-semibold">
                                {getDateDetails(
                                  customerSubscriptionDetails?.endTime
                                )}
                              </span>
                            </h1>
                            <h1 className="text-gray-900 text-md title-font font-medium mb-1">
                              {t("my_subscription_remaining")} :{" "}
                              <span className=" font-semibold">
                                {
                                  remainingTime(
                                    customerSubscriptionDetails?.endTime
                                  )?.days
                                }{" "}
                                {t("my_subscription_days_left")}
                              </span>
                            </h1>
                          </div>
                          <div>
                            <h1 className="text-gray-900 text-md title-font font-medium mb-1">
                              {t("my_subscription_active_user")} :{" "}
                              <span className=" font-semibold">
                                {userSubscribedCount}{" "}
                                {t("my_subscription_users")}
                              </span>{" "}
                            </h1>
                            <h1 className="text-gray-900 text-md title-font font-medium mb-1">
                              {t("my_subscription_remaining_users")} :{" "}
                              <span className=" font-semibold">
                                {subscriptionPlan?.users - userSubscribedCount}{" "}
                                {t("my_subscription_users")}
                              </span>
                            </h1>
                          </div>
                        </div>
                        <div className="flex justify-between gap-5">
                          <div className="flex gap-4">
                            <button
                              onClick={() => setViewUsersDetails(true)}
                              className="flex ml-auto font-semibold text-white bg-blue-500 border-0 py-2 px-2 focus:outline-none hover:bg-blue-600 rounded "
                            >
                              {t("my_subscription_view_users")}
                            </button>
                            <button
                              disabled={
                                userSubscribedCount === subscriptionPlan?.users
                              }
                              onClick={() => handleAddUser()}
                              className={`${
                                userSubscribedCount ===
                                  subscriptionPlan?.users &&
                                "cursor-not-allowed"
                              }  flex ml-auto font-semibold text-white bg-blue-500 border-0 py-2 px-2 focus:outline-none hover:bg-blue-600 rounded`}
                            >
                              {t("my_subscription_add_users")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <IoClose
                    onClick={() => props.setMySubscriptionPlan(false)}
                    className="absolute top-[3%] right-[2%] text-[26px] cursor-pointer rounded-full border-2 border-black font-bold"
                  />
                </section>
              </div>
            ) : (
              <>
                <div className="flex flex-col justify-center items-center m-auto h-[90vh] w-[90vw]">
                  <img
                    alt="ecommerce"
                    className="w-[400px] object-cover object-center rounded  px-3"
                    src={notSubscribed}
                  />
                  <h1 className="text-gray-200 text-3xl title-font font-bold mb-1">
                    {t("my_subscription_status")}
                  </h1>
                </div>
              </>
            )}

            {isLoading && (
              <>
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-85  z-40 ">
                  <div className=" rounded-lg p-5 auto">
                    <div className="status flex justify-center items-center flex-col gap-2">
                      <svg
                        aria-hidden="true"
                        className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="font-bold text-2xl text-blue-500">
                        Loading...
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {isAddUserModalOpen && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50  z-40 ">
                <div
                  style={{
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className=" w-[100vw] h-[100vh] bg-slate-100 rounded-md overflow-auto relative justify-center items-center flex"
                >
                  <button
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="absolute top-[1%] left-[2%] text-sm font-bold bg-blue-500 text-white py-2 px-3 rounded-md  border  cursor-pointer mt-5 "
                  >
                    {t("subscription_go_back")}
                  </button>
                  <form
                    onSubmit={(e) => handleSubmit(e)}
                    className=" p-10 shadow-lg bg-slate-100 relative"
                  >
                    <p className="font-bold text-md mb-4">
                      {" "}
                      {t("my_subscription_add_users")}
                    </p>
                    <div className="mb-3">
                      <label for="text" className=" mb-2 text-sm font-medium ">
                        {t("my_subscription_userName")}
                      </label>
                      <input
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            userName: e.target.value,
                          })
                        }
                        type="text"
                        id="text"
                        className="!pl-2"
                        required
                        placeholder="username"
                      />
                    </div>
                    <div className="mb-5">
                      <label for="email" className="mb-2 text-sm font-medium ">
                        {t("my_subscription_userEmail")}
                      </label>
                      <input
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            userEmail: e.target.value,
                          })
                        }
                        type="email"
                        id="email"
                        className="!pl-2"
                        placeholder="mail@email.com"
                        required
                      />
                    </div>
                    <div className="mb-5">
                      <label for="email" className="mb-2 text-sm font-medium ">
                        {t("my_subscription_userPhone")}
                      </label>
                      <input
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            phoneNumber: e.target.value,
                          })
                        }
                        type="number"
                        id="number"
                        className="!pl-2"
                        placeholder="000-000-0000"
                        required
                      />
                    </div>
                    <div className="mb-5">
                      <label for="email" className="mb-2 text-sm font-medium ">
                        {t("my_subscription_userCompany")}
                      </label>
                      <input
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            company: e.target.value,
                          })
                        }
                        type="text"
                        id="text"
                        className="!pl-2"
                        placeholder="company name"
                        required
                      />
                    </div>
                    <div className="mb-5">
                      <label for="email" className="mb-2 text-sm font-medium ">
                        {t("my_subscription_userPassword")}
                      </label>
                      <input
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            password: e.target.value,
                          })
                        }
                        type="password"
                        id="password"
                        className="!pl-2"
                        placeholder="********"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      {addUserLoading ? "Loading" : "Add"}
                    </button>
                    <IoClose
                      onClick={() => setIsAddUserModalOpen(false)}
                      className="absolute top-[3%] right-[4%] text-[26px] cursor-pointer rounded-full border-2 font-bold text-black  border-black"
                    />
                  </form>
                </div>
              </div>
            )}

            {viewUsersDetails && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50  z-40 ">
                <div className="w-[92vw] h-[96vh] bg-slate-100 rounded-md overflow-auto">
                  <IoClose
                    onClick={() => setViewUsersDetails(false)}
                    className="absolute top-[3%] right-[4%] text-[26px] cursor-pointer rounded-full border-2 font-bold border-black"
                  />
                  <div className="relative overflow-x-auto h-[80vh]  mt-20 px-20">
                    <p className="font-semibold text-md mb-3">
                      {t("my_subscription_list")}
                    </p>
                    <table className="w-full text-sm text-left rtl:text-right  ">
                      <thead className="text-xs  uppercase bg-gray-50  ">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            {t("my_subscription_userName")}
                          </th>
                          <th scope="col" className="px-6 py-3">
                            {t("my_subscription_userEmail")}
                          </th>
                          <th scope="col" className="px-6 py-3">
                            {t("my_subscription_access_granted")}
                          </th>
                          <th scope="col" className="px-6 py-3">
                            {t("my_subscription_access_date")}
                          </th>
                          <th scope="col" className="px-6 py-3">
                            {t("my_subscription_access_status")}
                          </th>{" "}
                          <th scope="col" className="px-6 py-3">
                            <span className="sr-only">
                              {" "}
                              {t("my_subscription_access_edit")}
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {userSubscriberData?.length > 0 ? (
                          userSubscriberData.map((item, index) => (
                            <tr className="bg-white border-b  hover:bg-gray-50 ">
                              <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                              >
                                {item.userName}
                              </th>
                              <td className="px-6 py-4">{item.userEmail}</td>
                              <td className="px-6 py-4">
                                {item.isActive ? (
                                  <p className="p-[3px_15px] w-fit font-bold text-xs text-white  border border-white rounded-xl bg-green-500 whitespace-nowrap justify-center items-center flex">
                                    {t("my_subscription_access_active")}
                                  </p>
                                ) : (
                                  <p className="p-[3px_15px] w-fit font-bold text-xs text-white  border border-white rounded-xl bg-red-500 whitespace-nowrap justify-center items-center flex">
                                    {t("my_subscription_access_inactive")}
                                  </p>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {getDateDetails(item?.startTime)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <p
                                  className={`font-bold text-xl ${
                                    item?.isActive
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }  dark:text-black-500 hover:underline`}
                                >
                                  <MdPersonRemoveAlt1
                                    onClick={() => {
                                      setCurrentIndex(index);
                                      handleSetCurrentEvent(
                                        item?.isActive
                                          ? "cancel_subscription"
                                          : "continue_subscription"
                                      );
                                      setCurrentRevokeId(item?._id);
                                      setShowConfirmationModal(true);
                                    }}
                                  />
                                </p>
                              </td>{" "}
                              <td className="px-6 py-4 text-right">
                                <p className="font-bold text-xl text-red-600 dark:text-black-500 hover:underline">
                                  <MdDeleteOutline
                                    onClick={() => {
                                      setCurrentEvent("delete_subscription");
                                      setCurrentRevokeId(item?._id);
                                      setShowConfirmationModal(true);
                                    }}
                                  />
                                </p>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <div className="absolute mx-auto w-[80vw] flex flex-col justify-center items-center  gap-4">
                            <img
                              className="sm:w-[400px] w-[200px]"
                              src={noDataFound}
                              alt="img"
                            />
                            <p className="font-bold text-xl ">
                              {t("my_subscription_data_status")}
                            </p>
                          </div>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {showConfirmationModal && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80  z-40 ">
                <div className="bg-white rounded-lg p-5 w-[90%] sm:w-auto">
                  <p className="font-semibold">{`Are you sure you wants to ${
                    currentEvent === "delete_subscription"
                      ? "Delete"
                      : currentEvent === "cancel_main_user_subscription"
                      ? "Cancel"
                      : userSubscriberData?.[currentIndex]?.isActive
                      ? "Inactivate"
                      : "Activate"
                  }  the subscription?`}</p>
                  <div className="mt-4 flex justify-end">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                      onClick={() => {
                        handleConfirmation(true);
                      }}
                    >
                      {isLoading ? "Loading..." : "Confirm"}
                    </button>
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
                      onClick={() => handleConfirmation(false)}
                    >
                      {t("subscription_cancel")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

export default MySubscriptionPlan;
