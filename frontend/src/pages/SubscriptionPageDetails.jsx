import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
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
import { IoMdClose } from "react-icons/io";
import Header from "../components/Header";
import TopSection from "../components/forms/TopSection";
import Footer from "../components/Footer";
import { t } from "../utils/translate";
import TermAndConditionForSubscription from "./TermAndConditionForSubscription";
import { getGeoLocationData } from "../Services/geoLocationService";
import { toast } from "react-toastify";
import PrizeModal from "../components/PrizeModal";
import SubscriptionList from "../Admin/Pages/SubscriptionList";
import SubscriberList from "../components/subscription/SubscriberList";
const notificationImg = require("../Assets/no-notification.jpg");
const backgroundImageUrl = require("../Assets/background_image.jpg");

const SubscriptionPageDetails = () => {
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

  const [loading, setLoading] = useState(false)

  const [isPrizeOpen, setIsPrizeOpen] = useState(false);

  const [currencySign, setCurrencySign] = useState({
    currencySign: "$",
    currency: "USD",
  });

  const isSubscription = useSelector(
    (state) => state?.auth?.loggedInUser?.isSubscription
  );

  const userDetails = useSelector((state) => state?.auth?.loggedInUser);
  console.log("userDetails", userDetails)

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

    // Handle enterprise subscription
    if (data?.subscriptionType === 3) {
      try {
        setIsSendMailIsLoading(true);
        const mailResponse = await sendSubscriptionMail(sendDataToServer);
        if (mailResponse?.success) {
          setMoreUserSubscription(true);
          setShowTermAndCondition(false);
          toast.success("Admin will reach out to you soon");
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        console.error("Error sending subscription mail:", error);
        toast.error("Failed to send subscription request");
      } finally {
        setIsSendMailIsLoading(false);
      }
      return;
    }

    // Handle regular payment
    try {
      setIsLoading(true); // Add loading state
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const response = await handlePayment({ ...data, customerId });

      if (!response?.data?.sessionId) {
        throw new Error('No session ID received');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
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
            await makePayment(sendDataToPayment)

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

  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const handlePrizeRequest = async () => {
    try {
      setLoading(true)
      const mailresponse = await sendSubscriptionPrizeMail(userDetails)
      if (mailresponse?.emailResponse?.status) {
        toast.success("Request sent successfully. The organization will contact you soon.")
      } else {
        toast.error("There is an error. Please try again later.")
      }
    } catch (error) {
      return error
    } finally {
      setLoading(false)

    }
  }

  return (
    <div>
      <Header />
      <div
        className="bg-gray-200"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <TopSection
          keys={"unique"}
          title={t("service_subscription_title")}
          breadcrumData={[t("home"), t("service_subscription_header")]}
        />
        {
          !!userDetails?.createdBy && <SubscriberList />
        }

        {
          !userDetails?.createdBy && (
            <div className="">
              {
                <div className="rounded-md overflow-auto">
                  <div className="">
                    <div className="mx-5 pb-10">
                      <div className="py-8 lg:py-14 flex flex-col items-center">
                        <span className="font-semibold text-center text-4xl sm:text-5xl mt-3 mb-6 underline text-gray-700">
                          {t("subscription_description_01")}
                        </span>
                        <span className="sm:text-xl text-center text-lg font-light">
                          {t("subscription_description_02")}
                        </span>
                      </div>

                      <div className="lg:max-w-[1200px]  mx-auto  rounded-xl">

                        <table className="w-full text-start border-spacing-5 border-separate grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
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
                                      ? data?.subscriptionType === 3 ? `${data.mainTitleNo} (Early birds priser)` : data.mainTitleNo
                                      : data?.subscriptionType === 3 ? `${data.mainTitle} (Early birds prices)` : data.mainTitle}
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
                    <>
                      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70  z-40 ">
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
                              {t("subscription_loading")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
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
                </div>
              }

              {showTermAndCondition && (
                <>
                  <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-95  z-40">
                    <div className="bg-white rounded-lg w-[90vw] h-[90vh] absolute overflow-auto">
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
                      <button onClick={() => handlePrizeRequest()} className="my-3 relative px-3 py-2 bg-[#375cce] text-white font-semibold rounded-lg shadow-md">
                        {loading ?
                          (
                            <div className="flex justify-center items-center gap-2">
                              <div>
                                Loading
                              </div>
                              <div className="loading loading-bars loading-sm"></div>
                            </div>

                          ) : "Request Meeting"}
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
            </div>
          )
        }

        <Footer />
      </div>
    </div>
  );
};

export default SubscriptionPageDetails;
