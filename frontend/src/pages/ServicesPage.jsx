import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TopSection from "../components/forms/TopSection";
import Services from "../components/Services/Services";
import Demo from "../components/Services/Demo";
import AdavanceConstructorIndustry from "../components/Services/AdavanceConstructorIndustry";
import Help from "../components/Services/Help";
import { useSelector } from "react-redux";
import { t } from "../utils/translate";

const ServicesPage = () => {
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
          title={t("our-service-title")}
          breadcrumData={[t("home"), t("our-service-title")]}
        />
        <Services />
        <Help />
        <AdavanceConstructorIndustry />
        <Demo />
      </div>
      <Footer />
    </>
  );
};

export default ServicesPage;
