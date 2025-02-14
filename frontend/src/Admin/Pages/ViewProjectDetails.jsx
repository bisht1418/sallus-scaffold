import React from "react";
import AdminDashboard from "./AdminDashboard";
import { useParams } from "react-router-dom";

const ViewProjectDetails = () => {
  return (
    <div>
      <AdminDashboard data={ViewProjectDetailsProps} />
    </div>
  );
};

const ViewProjectDetailsProps = () => {
  const { projectDetail: currentItem } = useParams();
  const projectDetails = JSON.parse(decodeURIComponent(currentItem));
  console.log("projectDetails", projectDetails);

  function formatDateTimeString(isoString) {
    const date = new Date(isoString);

    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="p-4 mt-5 mb-10">
      <div className="col-span-4 sm:col-span-9">
        <div className="border rounded-xl bg-white  p-3 flex flex-col gap-4 mb-4">
          <div className="flex justify-between">
            <div className="border px-2 py-2 text-sm font-bold rounded-xl w-fit bg-green-300 hover:bg-green-400 transition-all duration-150 cursor-pointer">
              Project details
            </div>{" "}
            <div
              className={`border px-2 py-2 text-sm font-bold rounded-xl w-fit ${
                projectDetails?.status === "active"
                  ? "bg-green-300 hover:bg-green-400"
                  : projectDetails?.status === "inactive"
                  ? "bg-red-300 hover:bg-red-400"
                  : "bg-orange-300 hover:bg-orange-400"
              }   transition-all duration-150 cursor-pointer`}
            >
              {projectDetails?.status}
            </div>
          </div>
          <div className="flex sm:flex-row flex-col justify-between gap-2 cursor-pointer">
            <div className="sm:w-1/2  w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Project Created At
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black uppercase">
                {formatDateTimeString(projectDetails?.createdAt) ||
                  "No Detail Found"}
              </p>
            </div>

            <div className="sm:w-1/2  w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Project last Updated At
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {formatDateTimeString(projectDetails?.updatedAt) ||
                  "No Detail Found"}
              </p>
            </div>
          </div>{" "}
          <div className="flex sm:flex-row flex-col justify-between gap-2 cursor-pointer">
            <div className="sm:w-1/2  w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Project Name
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black uppercase">
                {projectDetails?.projectName || "No Detail Found"}
              </p>
            </div>

            <div className="sm:w-1/2  w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Project Number
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.projectNumber || "No Detail Found"}
              </p>
            </div>
          </div>{" "}
          <div className="flex sm:flex-row flex-col justify-between gap-2 cursor-pointer">
            <div className="sm:w-1/2  w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Project Email
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.projectDetails?.project_email ||
                  "No Detail Found"}
              </p>
            </div>
            <div className="sm:w-1/2  w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Project Mobile
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.projectDetails?.project_phone_number ||
                  "No Detail Found"}
              </p>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col justify-between gap-2 cursor-pointer">
            <div className="sm:w-1/2 w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Project Contact Person
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.projectDetails?.project_contact_person ||
                  "No Detail Found"}
              </p>
            </div>
          </div>
          <div className="flex justify-between gap-2 cursor-pointer">
            <div className="w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Project Address
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.projectDetails?.project_address ||
                  "No Detail Found"}
              </p>
            </div>
          </div>
          <div className="flex justify-between gap-2 cursor-pointer">
            <div className="w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Project Other Details
              </h2>
              <textarea
                className="sm:w-1/2 w-full  pl-3 text-sm font-semibold cursor-pointer"
                readOnly
                value={
                  projectDetails?.projectDetails?.project_address ||
                  "No Detail Found"
                }
              ></textarea>
            </div>
          </div>
        </div>

        <div className="border rounded-xl bg-white  p-3 flex flex-col gap-5 mb-4 ">
          <div className="border px-2 py-2 text-sm font-bold rounded-xl w-fit bg-green-300 hover:bg-green-400 transition-all duration-150 cursor-pointer">
            Company details
          </div>
          <div className="flex sm:flex-row flex-col justify-between gap-2 cursor-pointer">
            <div className="sm:w-1/2 w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Company Name
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.companyDetails?.company_name ||
                  "No Detail Found"}
              </p>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col justify-between gap-2 cursor-pointer">
            <div className="sm:w-1/2 w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Company Email
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.companyDetails?.company_email ||
                  "No Detail Found"}
              </p>
            </div>

            <div className="sm:w-1/2 w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Company Phone
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.companyDetails?.company_phone_number ||
                  "No Detail Found"}
              </p>
            </div>
          </div>{" "}
          <div className="flex sm:flex-row flex-col justify-between gap-2 cursor-pointer">
            <div className="sm:w-1/2 w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Company Contact Person
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.companyDetails?.company_contact_person ||
                  "No Detail Found"}
              </p>
            </div>

            <div className="sm:w-1/2 w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Company Org Number
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.companyDetails?.company_organization_number ||
                  "No Detail Found"}
              </p>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col justify-between gap-2 cursor-pointer">
            <div className="sm:w-1/2 w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Company Address
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.companyDetails?.comapny_invoice_address ||
                  "No Detail Found"}
              </p>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col justify-between gap-2 cursor-pointer">
            <div className="sm:w-full w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Company Other Details
              </h2>
              <textarea
                className="sm:w-1/2 w-full  pl-3  text-sm font-semibold"
                readOnly
                value={
                  projectDetails?.companyDetails?.other_company_details ||
                  "No Detail Found"
                }
              ></textarea>
            </div>
          </div>
        </div>

        <div className="border rounded-xl bg-white  p-3 flex flex-col gap-4 mb-4">
          <div className="mt-4">
            <p className="border px-2 py-2 text-sm font-bold rounded-xl w-fit bg-green-300 hover:bg-green-400 transition-all duration-150 cursor-pointer">
              User Details
            </p>
          </div>

          <div className="cursor-pointer">
            <h2 className="text-sm font-semibold hover:text-gray-600">
              User Email
            </h2>
            <p className="border hover:text-gray-600 transition-all duration-200   sm:w-1/2 w-full font-semibold text-md px-2 py-2  rounded-sm border-black">
              {projectDetails?.userId?.email}
            </p>
          </div>

          <div className="flex sm:flex-row flex-col justify-between gap-2 cursor-pointer">
            <div className="sm:w-1/2 w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Mobile
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.userId?.phoneNumber || "No Detail Found"}
              </p>
            </div>
            <div className="sm:w-1/2 w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Company
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.userId?.company || "No Detail Found"}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-row flex-col justify-between gap-2 cursor-pointer">
            <div className="sm:w-1/2 w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Demo Account
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.userId?.isDemoAccount ? "Yes" : "No"}
              </p>
            </div>
            <div className="sm:w-1/2 w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Special Access
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.userId?.specialAccess ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-row flex-col justify-between gap-2 cursor-pointer">
            <div className="sm:w-1/2 w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Subscription Active
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.userId?.isSubscription ? "Yes" : "No"}
              </p>
            </div>
            <div className="sm:w-1/2 w-full">
              <h2 className="text-sm hover:text-gray-600 transition-all duration-200  font-semibold">
                Subscription Plan
              </h2>
              <p className="border hover:text-gray-600 transition-all duration-200   font-semibold text-md px-2 py-2  rounded-sm border-black">
                {projectDetails?.userId?.subscriptionType === 0
                  ? "1 User"
                  : projectDetails?.userId?.subscriptionType === 1
                  ? "10 Users"
                  : projectDetails?.userId?.subscriptionType === 2
                  ? "25 Users"
                  : projectDetails?.userId?.subscriptionType === 3
                  ? "25+ Users"
                  : projectDetails?.userId?.subscriptionType === 4
                  ? "Lifetime Membership"
                  : "No Plan Purchased"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectDetails;
