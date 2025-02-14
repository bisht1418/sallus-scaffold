import React, { useEffect, useState } from "react";
import axios from "axios";

const WelcomeModal = ({ userData, updateUserData }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    phoneNumber: userData.phoneNumber || "",
    company: userData.company || "",
  });

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenModal");

    if (!hasSeenModal) {
      setIsOpen(true);
      localStorage.setItem("hasSeenModal", "true");
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Retrieve token
      console.log("Token:", token);
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-profile`, // Ensure this URL is correct
        {
          phoneNumber: formData.phoneNumber,
          company: formData.company,
        },
        {
          headers: {
            'x-auth-token': token, // Send token in header
          },
        }
      );

      if (response.status === 200) {
        updateUserData(response.data.data);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("An error occurred while updating your profile.");
    }
  };

  console.log(userData,'userData');
  console.log(updateUserData,'updateUserData');
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full sm:p-10 p-3 relative mx-3">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src="/logo-welcome-popup.jpg"
              alt="Welcome"
              className="mx-auto h-48 object-cover"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">
              Hey {userData?.name} <spam>👋</spam>
            </h2>{" "}
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">
              Welcome to Salus Scaffold!
            </h2>
            <p className="text-gray-600 mt-2">
              We're excited to have you here. Explore our site and let us know
              if you have any questions.
            </p>
            {userData?.isProfileIncomplete === true ? <>
            <p className="text-gray-600 mt-2">
              Please complete your profile to get started.
            </p>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="form-control-lg w-full mb-2"
                  required
                />
              </div>
              <div>
                <input
                  name="company"
                  placeholder="Company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="form-control-lg w-full mb-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
              >
                Complete Profile
              </button>
            </form>
            </> : <button
              type="button"
              onClick={closeModal}
              className="mt-6 w-full bg-[#0072bb] text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            >
              Get Started
            </button>}
            
          </div>
        </div>
      )}
    </>
  );
};

export default WelcomeModal;
