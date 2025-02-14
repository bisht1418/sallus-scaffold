import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TopSection from "../components/forms/TopSection";
import Services from "../components/servicesForms/Services";
import FAQs from "../components/servicesForms/FAQs";
import Demo from "../components/servicesForms/Demo";

const ServiceForms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <div>
        <TopSection
          keys={"unique"}
          title={"FORMS"}
          breadcrumData={["Home", "Our Services", "Forms"]}
        />
        <Services />
        <FAQs />
        <Demo />
      </div>
      <Footer />
    </>
  );
};

export default ServiceForms;
