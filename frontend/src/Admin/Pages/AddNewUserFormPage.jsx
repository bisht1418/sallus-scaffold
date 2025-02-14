import React, { useEffect, useState } from "react";
import AddNewUserFrom from "../Components/AddNewUserFrom";
import AdminDashboard from "./AdminDashboard";
import { toast } from "react-toastify";
import { signUpService } from "../../Services/authService";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getGeoLocationData } from "../../Services/geoLocationService";

const AddNewUserFormPage = () => {
  return (
    <div>
      <AdminDashboard data={AddNewUserFormPageProps} />
    </div>
  );
};

const AddNewUserFormPageProps = () => {
  const isAdminId = useSelector((state) => state?.admin?.loggedInAdmin?._id);
  const [addUserDetails, setAddUserDetail] = useState({});
  const [countryCallingCode, setCountryCallingCode] = useState("");
  const navigate = useNavigate();

  function isValidName(name) {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(name);
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  useEffect(() => {
    getTheCountryCode();
  }, []);

  const getTheCountryCode = async () => {
    const responseData = await getGeoLocationData();
    const countryMobileCode = responseData?.country_calling_code;
    const formateCountryCode = countryMobileCode?.slice(1);
    setCountryCallingCode(formateCountryCode);
  };

  function updatePhoneNumber(value, phoneNumber) {
    return `${value} ${phoneNumber}`;
  }

  const handleAddNewUser = async (e) => {
    e.preventDefault();
    const { company, name, email, phoneNumber, password, confirmPassword } =
      addUserDetails;

    if (company && name && email && phoneNumber && password) {
      if (password === confirmPassword) {
        let filteredData;

        if (isAdminId) {
          filteredData = {
            company,
            name,
            email,
            phoneNumber: updatePhoneNumber(countryCallingCode, phoneNumber),
            password,
            type: isAdminId ? 1 : 0,
            isCreatedByAdmin: true,
            createdBy: isAdminId ? isAdminId : null,
          };
        }

        if (!isValidName(name)) {
          toast.error(
            "Invalid name format. Name should contain only alphabets and spaces."
          );
          return;
        }

        if (!isValidEmail(email)) {
          toast.error(
            "Invalid email format. Please enter a valid email address."
          );
          return;
        }

        try {
          const registerResponse = await signUpService(filteredData);
          if (registerResponse?.status === "success") {
            toast.success("User added successfully");

            if (isAdminId) {
              navigate("/admin-dashboard/user/all-users");
            } else {
              navigate("/admin-dashboard/user/users");
            }

            setAddUserDetail({
              name: "",
              email: "",
              phoneNumber: "",
              company: "",
              password: "",
              confirmPassword: "",
              type: "",
            });
          } else {
            toast.error("Something went wrong");
          }
        } catch (error) {
          toast.error("Failed to add user. Please try again.");
        }
      } else {
        toast.error("Password and Confirm Password should be the same");
      }
    } else {
      toast.error("Please fill all the details");
    }
  };

  return (
    <div>
      <AddNewUserFrom
        addUserDetails={addUserDetails}
        setAddUserDetail={setAddUserDetail}
        handleAddNewUser={handleAddNewUser}
        isAdminId={isAdminId}
        countryCallingCode={countryCallingCode}
      />
    </div>
  );
};

export default AddNewUserFormPage;
