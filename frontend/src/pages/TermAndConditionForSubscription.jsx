import React, { useState } from "react";
import Header from "../components/Header";
import { t } from "../utils/translate";
import Footer from "../components/Footer";

const TermsAndConditions = (props) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleProceedPayment = async () => {
    props.setIsLoading(true);
    const sendDataToPayment = {
      ...props?.currentData,
      priceType: props?.currentCheckBox[props?.currentIndex] ? "month" : "year",
    };
    await props?.makePayment(sendDataToPayment);
    props?.setIsLoading(false);
  };

  const Section = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold text-blue-600 mb-4 border-b pb-2">
        {title}
      </h2>
      {children}
    </div>
  );

  const ListItem = ({ title, children }) => (
    <li className="mb-4">
      <span className="font-semibold text-gray-700">{title}</span>
      <ul className="mt-2 pl-6 space-y-2">
        {children}
      </ul>
    </li>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {!props.header && <Header />}
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            Terms and Conditions
          </h1>
          {!props?.topSection && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Welcome to Salus Scaffold!
                  </h3>
                  <p className="mt-2 text-sm text-blue-700">
                    Please read these terms and conditions carefully before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Section title="Introduction">
            <p className="text-gray-600 leading-relaxed">
              {t("introductionHeading")}
            </p>
          </Section>

          <Section title="Subscription Plans">
            <ol className="list-decimal pl-6 space-y-4">
              <ListItem title={t("planOptions")}>
                <li className="text-gray-600">{t("planOptionHeading")}</li>
              </ListItem>
              <ListItem title={t("eligibility")}>
                <li className="text-gray-600">{t("eligibilityHeading")}</li>
              </ListItem>
              <ListItem title={t("accountRegistration")}>
                <li className="text-gray-600">{t("accountRegistrationHeading")}</li>
              </ListItem>
            </ol>
          </Section>

          <Section title="Billing and Payment">
            <ol className="list-decimal pl-6 space-y-4">
              <ListItem title={t("paymentMethod")}>
                <li className="text-gray-600">{t("paymentMethodHeading")}</li>
              </ListItem>
              <ListItem title={t("billingCycle")}>
                <li className="text-gray-600">{t("billingCycleHeading")}</li>
              </ListItem>
              <ListItem title={t("automaticRenewal")}>
                <li className="text-gray-600">{t("automaticRenewalHeading")}</li>
              </ListItem>
              <ListItem title={t("priceChanges")}>
                <li className="text-gray-600">{t("priceChangesHeading")}</li>
              </ListItem>
              <ListItem title={t("refund")}>
                <li className="text-gray-600">{t("refundHeading")}</li>
              </ListItem>
            </ol>
          </Section>

          <Section title="User Conduct">
            <ol className="list-decimal pl-6 space-y-4">
              <ListItem title={t("prohibitedActivity")}>
                <li className="text-gray-600">{t("prohibitedActivityHeading")}</li>
              </ListItem>
              <ListItem title={t("accountSecurity")}>
                <li className="text-gray-600">{t("accountSecurityHeading")}</li>
              </ListItem>
              <ListItem title={t("accountSharing")}>
                <li className="text-gray-600">{t("accountSharingHeading")}</li>
              </ListItem>
            </ol>
          </Section>

          <Section title="Limitation of Liability">
            <ul className="pl-6 space-y-2">
              <li className="text-gray-600">{t("limitationOfLiabilityHeading")}</li>
              <ol className="list-decimal pl-6 mt-2 space-y-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <li key={num} className="text-gray-600">
                    {t(`limitationOfLiabilityPoint_0${num}`)}
                  </li>
                ))}
              </ol>
            </ul>
          </Section>

          {props?.checkBox && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {t("acceptTermsAndConditions")}
                  </span>
                </label>
                <button
                  onClick={handleProceedPayment}
                  disabled={!isChecked || props?.isLoading}
                  className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200
                    ${!isChecked 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                    }`}
                >
                  {props?.isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {!props?.footer && <Footer />}
    </div>
  );
};

export default TermsAndConditions;
