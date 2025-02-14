import React from "react";
import AdminDashboard from "./AdminDashboard";
import { useParams } from "react-router-dom";

const profilePicture = require("../../Assets/userIcons.jpg");

const ViewUsersDetails = () => {
  return (
    <div>
      <AdminDashboard data={ViewUserDetailsProps} />
    </div>
  );
};

const ViewUserDetailsProps = () => {
  const { id: currentItem } = useParams();
  const userDetails = JSON.parse(decodeURIComponent(currentItem));
  console.log("userDetails", userDetails);

  return (
    <div className="p-4 mt-5 mb-10">
      <div className="font-bold test-sm">Users details</div>
      <div className="bg-gray-100">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col items-start">
                  <img
                    alt={"img"}
                    src={profilePicture}
                    className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                  ></img>
                  <h1 className="font-semibold text-nowrap !text-sm uppercase">
                    {userDetails?.name ||
                      userDetails?.userId?.name ||
                      "No data Found"}
                  </h1>
                  <p className="text-gray-700 font-semibold text-nowrap !text-sm">
                    {userDetails?.type === 0 ? (
                      <span className="!text-sm">Admin</span>
                    ) : (
                      <span className="!text-sm">User</span>
                    )}
                  </p>
                </div>
                <hr className="my-6 border-t border-gray-300" />
              </div>
            </div>
            <div className="col-span-4 sm:col-span-9">
              <div className="bg-white  p-3 rounded-xl flex flex-col gap-4">
                <div className=" cursor-pointer">
                  <h2 className="text-sm font-semibold hover:text-gray-600">
                    Email
                  </h2>
                  <p className="border hover:text-gray-600 transition-all duration-200   w-1/2 font-semibold text-md px-2 py-2  rounded-sm border-black">
                    {userDetails?.email ||
                      userDetails?.userId?.email ||
                      "No Data Found"}
                  </p>
                </div>

                <div className="flex justify-between gap-2 cursor-pointer">
                  <div className="w-1/2">
                    <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                      Mobile
                    </h2>
                    <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                      {userDetails?.phoneNumber ||
                        userDetails?.userId?.phoneNumber ||
                        "No Detail Found"}
                    </p>
                  </div>
                  <div className="w-1/2">
                    <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                      Company
                    </h2>
                    <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                      {userDetails?.company ||
                        userDetails?.userId?.company ||
                        "No Detail Found"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between gap-2 cursor-pointer">
                  <div className="w-1/2">
                    <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                      Demo Account
                    </h2>
                    <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                      {userDetails?.isDemoAccount ||
                      userDetails?.userId?.isDemoAccount
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>
                  <div className="w-1/2">
                    <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                      Special Access
                    </h2>
                    <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                      {userDetails?.specialAccess ||
                      userDetails?.userId?.specialAccess
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between gap-2 cursor-pointer">
                  <div className="w-1/2">
                    <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                      Subscription Active
                    </h2>
                    <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                      {userDetails?.isSubscription ||
                      userDetails?.userId?.isSubscription
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>
                  <div className="w-1/2">
                    <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                      Subscription Plan
                    </h2>
                    <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                      {userDetails?.subscriptionType ||
                      userDetails?.userId?.subscriptionType === 0
                        ? "1 User"
                        : userDetails?.subscriptionType ||
                          userDetails?.userId?.subscriptionType === 1
                        ? "10 Users"
                        : userDetails?.subscriptionType ||
                          userDetails?.userId?.subscriptionType === 2
                        ? "25 Users"
                        : userDetails?.subscriptionType ||
                          userDetails?.userId?.subscriptionType === 3
                        ? "25+ Users"
                        : userDetails?.subscriptionType ||
                          userDetails?.userId?.subscriptionType === 4
                        ? "Lifetime Membership"
                        : "No Plan Purchased"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUsersDetails;
