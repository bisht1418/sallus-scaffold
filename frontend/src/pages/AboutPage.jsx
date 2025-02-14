import React, { useEffect } from "react";
import Header from "../components/Header";
import TopSection from "../components/forms/TopSection";
import Footer from "../components/Footer";
import ServiceSection from "../components/aboutPage/ServiceSection";
import Clients from "../components/landingPage/Clients";
import TeamSection from "../components/aboutPage/TeamSection";
import ClientTestimonial from "../components/aboutPage/ClientTestimonial";
import { t } from "../utils/translate";
import { useSelector } from "react-redux";
import AboutUsNewSec from "../components/aboutPage/AboutUsNewSec";
import GetInvolvedSection from "../components/aboutPage/GetInvolvedSection";

const AboutPage = () => {
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
          title={"Welcome to Salus Scaffold!"}
          breadcrumData={[t("home"), t("aboutUs")]}
        />
        <ServiceSection />
        <Clients bg={"gray"} />
        <TeamSection />
        <ClientTestimonial bg={"gray"} />
        <AboutUsNewSec />
        <GetInvolvedSection bg={"gray"} />
        <div className="text-center">
          <strong>{t("join_us_msg")}</strong>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
