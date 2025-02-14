import React, { useEffect } from "react";
import Header from "../components/Header";
import TopSection from "../components/forms/TopSection";
import Footer from "../components/Footer";
import { t } from "../utils/translate";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserProfileService } from "../Services/authService";
import { setUser } from "../Redux/Slice/authSlice";

const PaymentSuccess = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getLoggedInUserUpdatedSubscriptionDetails = async () => {
      try {
        const responseData = await getUserProfileService();
        dispatch(setUser(responseData?.data));
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      }
    };

    getLoggedInUserUpdatedSubscriptionDetails();
  }, []);

  return (
    <div>
      <Header />
      <div>
        <TopSection
          keys={"unique"}
          title={"Welcome to Salus Scaffold!"}
          breadcrumData={[t("home"), "SUCCESS"]}
        />
        {/* Main container */}
        <div className="custom-container w-full max-w-[800px] mx-auto border rounded-xl p-6 sm:p-8 bg-white shadow-md">
          <div className="flex flex-col justify-center items-center text-center">
            <img
              src="/logo-welcome-popup.jpg"
              className="w-[250px] sm:w-[350px] mb-5"
              alt="Success Image"
            />
            <p className="text-xl font-bold text-green-500 py-2 px-3 rounded-md m-auto mb-5 border border-green-400 w-full sm:w-auto">
              Thank you for subscribing and joining our growing community of
              scaffolding professionals.
            </p>
            <p className="text-lg mb-4">
              We’re excited to help streamline your project management and
              scaffolding processes.
            </p>
            <p className="text-lg mb-4">
              Here’s what you can do next:
            </p>
            <ul className="list-disc list-inside text-left text-lg mb-4">
              <li><b>Get Started:</b> Log in to your dashboard to explore your projects, create new ones, and manage your team efficiently.</li>
              <li><b>Invite Your Team:</b> You can now invite colleagues to join your projects and collaborate seamlessly.</li>
              <li><b>Explore Our Features:</b> Check out the scaffold log, approval forms, material lists, and other tools to make your work easier.</li>
            </ul>
            <p className="text-lg mb-4">
              If you have any questions or need support, don’t hesitate to reach
              out to us at{" "}
              <a
                href="mailto:support@salusscaffold.com"
                className="text-blue-500 underline"
              >
                support@salusscaffold.com
              </a>
              .
            </p>
            <p className="text-lg mb-4">
              We’re thrilled to have you on board and look forward to helping
              you optimize your scaffolding workflow!
            </p>
            <p className="text-lg font-semibold mb-5">Your Salus Scaffold Team</p>
            <button className="text-sm font-bold bg-blue-500 text-white py-2 px-6 rounded-md m-auto">
              <Link to={"/"}>Let's start</Link>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;