import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { RiCloseCircleFill } from "react-icons/ri";
import { IoArrowBackCircle } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { loadStripe } from "@stripe/stripe-js";
import { handlePayment } from "../Services/paymentService";
import { useSelector } from "react-redux";
import {
  getSubscriptionDetails,
  getSubscriptionDetailByUserId,
  sendSubscriptionMail,
  sendSubscriptionPrizeMail,
} from "../Services/subscriptionService";
import TermAndConditionForSubscription from "../pages/TermAndConditionForSubscription";
import { getGeoLocationData } from "../Services/geoLocationService";
import { toast } from "react-toastify";
import { t } from "../utils/translate";
import Loader from "./loader";
const notificationImg = require("../Assets/no-notification.jpg");
const backgroundImageUrl = require("../Assets/background_image.jpg");
const alreadySubscribed = require("../Assets/success_img.jpg");

const SubscriptionPage = (props) => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const customerId = useSelector((state) => state?.auth?.loggedInUser?._id);
  const [monthprice, setMonthprice] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [pricingData, setPricingData] = useState([]);
  const [customerSubscriptionDetails, setCustomerSubscriptionDetails] =
    useState({});
  const [isSubscriptionPurchase, setIsSubscriptionPurchase] = useState(true);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCheckBox, setCurrentCheckBox] = useState([]);
  const [showTermAndCondition, setShowTermAndCondition] = useState(false);
  const [moreUserSubscription, setMoreUserSubscription] = useState(false);
  const [isSendMailLoading, setIsSendMailIsLoading] = useState(false);
  const userDetails = useSelector((state) => state?.auth?.loggedInUser);
  const [isPrizeOpen, setIsPrizeOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const buttonClasses =
    "absolute text-[26px] cursor-pointer rounded-full";

  const [currencySign, setCurrencySign] = useState({
    currencySign: "$",
    currency: "USD",
  });

  const isSubscription = useSelector(
    (state) => state?.auth?.loggedInUser?.isSubscription
  );

  useEffect(() => {
    getGeoLocationResponse();
    getAllSubscriptionPlan();
    getUserSubscriptionDetail(customerId);
  }, []);

  async function getAllSubscriptionPlan() {
    try {
      setIsLoading(true);
      const response = await getSubscriptionDetails();
      const fillFalseToCurrentCheckBoxArray = response?.data?.map(
        (item, ind) => true
      );
      setCurrentCheckBox(fillFalseToCurrentCheckBoxArray);
      setPricingData(response?.data);
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  const RightIcon = ({ bgcolor }) => {
    return (
      <svg
        className="w-5 h-5 mt-1"
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.8267 26.817L24.3485 36.3763L42.6482 18.1795"
          stroke={bgcolor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="28" cy="28" r="26" stroke={bgcolor} strokeWidth="4" />
      </svg>
    );
  };

  const makePayment = async (data) => {
    const sendDataToServer = { ...data, ...userDetails };
    if (data?.subscriptionType === 3) {
      try {
        setIsSendMailIsLoading(true);
        const mailResponse = await sendSubscriptionMail(sendDataToServer);
        if (mailResponse?.success) {
          setMoreUserSubscription(true);
          setShowTermAndCondition(false);
          setIsSendMailIsLoading(false);
          toast("Admin Will reach to you soon");
        } else {
          toast("Something went wrong");
        }
      } catch (error) {
        console.error("Error sending subscription mail:", error);
      } finally {
        setIsSendMailIsLoading(false);
      }
      return;
    }

    const key = process.env.REACT_APP_STRIPE_SECRET_KEY;
    try {
      const stripe = await loadStripe(key);
      const response = await handlePayment({ ...data, customerId });
      const { sessionId } = response?.data;
      if (sessionId) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const handleConfirmation = async (isConfirmation) => {
    try {
      setIsLoading(true);
      if (isConfirmation) {
        if (isSubscription) {
          setIsSubModalOpen(true);
        } else {
          if (currentData?.subscriptionType === 3) {
            const sendDataToPayment = {
              ...currentData,
              priceType: currentCheckBox[currentIndex] ? "month" : "year",
            };
            await makePayment(sendDataToPayment);
          } else {
            setShowTermAndCondition(true);
          }
        }
      }
    } catch (error) {
      console.error("Error handling confirmation:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setShowConfirmationModal(false);
    }
  };

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

  const handlePriceChange = (index, value) => {
    const updateCurrentCheckBox = [...currentCheckBox]?.map((item, idx) => {
      if (idx === index) {
        return value === "monthly";
      } else {
        return item;
      }
    });

    setCurrentCheckBox(updateCurrentCheckBox);
    setMonthprice(value === "monthly");
  };

  const convertAmount = (baseAmount, currency) => {
    let convertedAmount;
    switch (currency) {
      case "INR":
        convertedAmount = baseAmount * 83.4;
        break;
      case "NOK":
        convertedAmount = baseAmount * 10.69;
        break;
      case "USD":
      default:
        convertedAmount = baseAmount;
        break;
    }
    return parseFloat(convertedAmount.toFixed(2));
  };

  const getGeoLocationResponse = async () => {
    const geoData = await getGeoLocationData();
    if (geoData) {
      const currency = geoData.currency ? geoData.currency : "USD";
      switch (currency) {
        case "INR":
          setCurrencySign({ currencySign: "₹", currency: "INR" });
          break;
        case "USD":
          setCurrencySign({ currencySign: "$", currency: "USD" });
          break;
        case "EUR":
          setCurrencySign({ currencySign: "€", currency: "EUR" });
          break;
        case "GBP":
          setCurrencySign({ currencySign: "£", currency: "GBP" });
          break;
        case "NOK":
          setCurrencySign({ currencySign: "kr", currency: "NOK" });
          break;
        default:
          setCurrencySign({ currencySign: "$", currency: "USD" });
          break;
      }
    }
  };

  const handlePrizeRequest = async () => {
    try {
      setLoading(true);
      const mailresponse = await sendSubscriptionPrizeMail(userDetails);
      if (mailresponse?.emailResponse?.status) {
        toast.success(
          "Request sent successfully. The organization will contact you soon."
        );
      } else {
        toast.error("There is an error. Please try again later.");
      }
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props?.isSubscriptionModalOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }

    // Cleanup when the component unmounts or popup closes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [props?.isSubscriptionModalOpen]);

  console.log(pricingData, 'pricingData');

  return (
    <div>
      {props?.isSubscriptionModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-400 bg-opacity-50  z-40  ">
          <div
            style={{
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className="w-[100vw] h-[100vh] bg-slate-200 overflow-auto"
          >
            <RiCloseCircleFill
              onClick={() => props.setIsSubscriptionModalOpen(false)}
              className={`${buttonClasses} sm:top-[3%] top-[2%] right-[5%]`}
            />
            <IoArrowBackCircle
              onClick={() => props.setIsSubscriptionModalOpen(false)}
              className={`${buttonClasses} sm:top-[3%] top-[2%] left-[5%]`}
            />
            <>
              <div className="">
                <div className="mx-5 pb-10">
                  <div className="py-8 lg:py-14 flex flex-col items-center">
                    <span className="font-semibold text-center text-4xl sm:text-5xl mt-3 mb-6 text-gray-700">
                      {t("subscription_description_01")}
                    </span>
                    <span className="sm:text-xl text-center text-lg font-light">
                      {t("subscription_description_02")}
                    </span>
                  </div>

                  <div className="lg:max-w-[1200px]  mx-auto  rounded-xl">
                    <table className="w-full text-start  border-spacing-5 border-separate grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                      {pricingData?.map((data, index) => (
                        <tbody
                          onClick={() => setCurrentIndex((prev) => index)}
                          key={index}
                          className={`border-2 lg:border  border-t-2 ${data?.subscriptionType === 4 ||
                            data?.subscriptionType === 3
                            ? "bg-gradient-to-r from-blue-50 to-blue-100"
                            : ""
                            } border-b-2 border-t-blue-500 border-[#0081c8] bg-slate-100 mb-10 shadow-inner cursor-pointer lg:mb-0 rounded-lg hover:-translate-y-1 animate-once animate-ease-linear transition ease-in-out delay-150  hover:scale-30 hover:bg-slate-50 duration-300`}
                        >
                          <tr>
                            <td>
                              <div className="font-bold text-xl text-[#101828] h-7 ">
                                {currentLanguage === "no"
                                  ? data.mainTitleNo
                                  : data.mainTitle}
                                {data.popular && (
                                  <span className="text-sm font-medium text-[#365CCE] px-2.5 py-0.5 bg-[#F9F5FF] rounded-2xl ml-2">
                                    {t("subscription_popular")}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                          {!(
                            data?.subscriptionType === 4 ||
                            data?.subscriptionType === 3
                          ) && (
                              <tr>
                                <td>
                                  <div className="flex items-center mb-4">
                                    <label className="mr-4">
                                      <input
                                        type="radio"
                                        value="monthly"
                                        checked={currentCheckBox[index]}
                                        onChange={(e) =>
                                          handlePriceChange(index, e.target.value)
                                        }
                                        className="mr-2"
                                      />
                                      {t("subscription_monthly")}
                                    </label>
                                    <label>
                                      <input
                                        type="radio"
                                        value="yearly"
                                        checked={!currentCheckBox[index]}
                                        onChange={(e) =>
                                          handlePriceChange(index, e.target.value)
                                        }
                                        className="mr-2"
                                      />
                                      {t("subscription_yearly")}
                                    </label>
                                  </div>
                                </td>
                              </tr>
                            )}

                          {data?.subscriptionType !== 3 && (
                            <tr>
                              <td className="h-[50px]">
                                <div>
                                  <span className="font-semibold text-2xl">
                                    {currentCheckBox[index] ? (
                                      <span>
                                        {currencySign?.currencySign}
                                        {convertAmount(
                                          +data.price?.month?.slice(1),
                                          currencySign?.currency
                                        )}
                                      </span>
                                    ) : (
                                      <span>
                                        {currencySign?.currencySign}
                                        {convertAmount(
                                          +data.price?.year?.slice(1),
                                          currencySign?.currency
                                        )}
                                      </span>
                                    )}
                                  </span>
                                  {data.price &&
                                    !(data?.subscriptionType === 4) && (
                                      <span className="text-[#475467] font-normal ml-1 text-sm truncate">
                                        {currentCheckBox[index]
                                          ? t("per_month_per_user")
                                          : t("per_year_per_user")}
                                      </span>
                                    )}
                                </div>
                              </td>
                            </tr>
                          )}

                          <tr>
                            <td className="h-[50px] lg:h-[70px] xl:h-[50px]">
                              <span className="text-[#475467] text-sm font-normal ">
                                {currentLanguage === "no"
                                  ? data.infoNoteNo
                                  : data.infoNote}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <button
                                onClick={() => {
                                  setCurrentData(data);
                                  setShowConfirmationModal(true);
                                }}
                                className="w-full bg-[#365CCE] text-white rounded-lg py-3 font-semibold"
                              >
                                {t("subscription_get_started")}
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td
                              className="h-5 text-sm font-semibold text-[#365CCE]"
                              colSpan={2}
                            >
                              {data.titleRow1}
                            </td>
                          </tr>
                          {data?.features?.length > 0 &&
                            data.features.map((feature, index) => (
                              <tr key={index}>
                                <td className="flex justify-start ">
                                  <span className="font-medium text-sm text-[#101828] flex justify-center items-center gap-2">
                                    {currentLanguage === "no"
                                      ? feature?.featureNameNo
                                      : feature?.featureName}
                                    {feature?.isApplicable ? (
                                      <RightIcon bgcolor={"green"} />
                                    ) : (
                                      <RxCross1 className="border rounded-full text-red-600 border-red-600 p-0.5 text-[20px] font-bold " />
                                    )}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
              </div>

              {showConfirmationModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/75 backdrop-blur-sm z-40">
                  <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[400px] shadow-lg">
                    <p className="text-lg font-semibold mb-4">{t("subscription_confirmation")}</p>
                    <div className="flex justify-end gap-3">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                        onClick={() => handleConfirmation(true)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            {t("subscription_loading")}
                          </span>
                        ) : (
                          t("subscription_confirm")
                        )}
                      </button>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition-colors"
                        onClick={() => handleConfirmation(false)}
                      >
                        {t("subscription_cancel")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isLoading && (
                <Loader />
              )}
              {isSubModalOpen && (
                <>
                  <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-80  z-40">
                    <div className="bg-white rounded-lg p-5 w-[80vw] py-10 absolute">
                      <IoMdClose
                        onClick={() => setIsSubModalOpen(false)}
                        className="absolute top-[6%] right-[5%] text-[20px] font-[800] cursor-pointer"
                      />
                      <div className="mt-4 flex justify-center items-center flex-col gap-5">
                        <img
                          alt="scaffold"
                          className="w-[40vw]"
                          src={notificationImg}
                        />
                        <p className="font-bold text-[20px] text-black">
                          {t("subscription_info_01")}
                        </p>
                        <button
                          onClick={() => setIsSubModalOpen(false)}
                          className="border bg-blue-500 px-2 py-3 rounded-lg font-semibold text-white"
                        >
                          {t("subscription_go_back")}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {showTermAndCondition && (
                <>
                  <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-95  z-40">
                    <div className="bg-white rounded-lg p-5 w-[90vw] h-[90vh] absolute overflow-auto">
                      <div className="mt-4 flex justify-between items-center gap-5 mb-3 px-5">
                        <button
                          onClick={() => setShowTermAndCondition(false)}
                          className="border bg-blue-500 px-2 py-2 rounded-lg font-semibold text-white text-xs"
                        >
                          {t("subscription_go_back")}
                        </button>
                        <div>
                          {" "}
                          <IoMdClose
                            onClick={() => setShowTermAndCondition(false)}
                            className="cursor-pointer border-2 border-black rounded-full text-2xl font-bold "
                          />
                        </div>
                      </div>
                      <TermAndConditionForSubscription
                        header={true}
                        footer={true}
                        topSection={true}
                        checkBox={true}
                        showTermAndCondition={showTermAndCondition}
                        makePayment={makePayment}
                        currentData={currentData}
                        setIsLoading={setIsLoading}
                        isLoading={isLoading}
                        currentCheckBox={currentCheckBox}
                        currentIndex={currentIndex}
                        isSendMailLoading={isSendMailLoading}
                      />
                    </div>
                  </div>
                </>
              )}

              {moreUserSubscription && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
                  <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full font-semibold !text-sm">
                    <h2 className="text-xl font-bold mb-4">
                      {t("subscription_confirmation_01")}
                    </h2>
                    <p className="text-lg mb-4">
                      **{t("subscription_confirmation_detail")}**
                    </p>

                    <p className="text-lg mb-4">
                      **{t("subscription_confirmation_description")}:**
                    </p>

                    <div className="my-4">
                      <p className="text-md mb-2">
                        {t("subscription_confirmation_note")}
                      </p>
                      <p className="text-md mb-2">
                        {t("subscription_confirmation_body_01")}
                      </p>
                      <p className="text-md mb-2">
                        {t("subscription_confirmation_body_02")}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <button
                        onClick={() => handlePrizeRequest()}
                        className="my-3 relative px-3 py-2 bg-[#375cce] text-white font-semibold rounded-lg shadow-md"
                      >
                        {loading ? (
                          <div className="flex justify-center items-center gap-2">
                            <div>Loading</div>
                            <div className="loading loading-bars loading-sm"></div>
                          </div>
                        ) : (
                          "Request Meeting"
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setMoreUserSubscription(false);
                        }}
                        className="my-3 relative px-3 py-2 bg-[#375cce] text-white font-semibold rounded-lg shadow-md"
                      >
                        {t("subscription_go_back")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
