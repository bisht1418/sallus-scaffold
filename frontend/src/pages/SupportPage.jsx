import React from "react";
import Header from "../components/Header";
import TopSection from "../components/forms/TopSection";
import Footer from "../components/Footer";
import SupportComponent from "../components/supportPage/SupportComponent";
import { useSelector } from "react-redux";
import { t } from "../utils/translate";
import ContactUs from "../components/ContactUs/ContactUs";
import ContactForm from "../components/ContactUs/ContactForm";
import FAQs from "../components/landingPage/FAQs";

const SupportPage = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  return (
    <>
      <Header />
      <div>
        <TopSection
          keys={"unique"}
          title={t("bestSolutionFor")}
          breadcrumData={[t("home"), t("support")]}
        />
        {/* <SupportComponent /> */}
        <FAQs />
        <ContactUs />
      </div>
      <Footer />
    </>
  );
};

export default SupportPage;
