import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TopSection from "../components/forms/TopSection";
import ContactForm from "../components/ContactUs/ContactForm";
import ContactUs from "../components/ContactUs/ContactUs";
import { useSelector } from "react-redux";
import { t } from "../utils/translate";
import TermsAndConditions from "./TermsAndConditions";

const ContactUsPage = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />
      <div>
        <TopSection
          keys={"unique"}
          title={t("getInTouchWithUs")}
          breadcrumData={[t("home"), t("contactUs")]}
        />
        <ContactUs />
        <ContactForm />
      </div>
      {/* <TermsAndConditions/> */}
      <Footer />
    </>
  );
};

export default ContactUsPage;
