import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/landingPage/Hero";
import About from "../components/landingPage/About";
import Demo from "../components/landingPage/Demo";
import Services from "../components/landingPage/Services";
import FAQs from "../components/landingPage/FAQs";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { getSubscriptionDetailByUserId } from "../Services/subscriptionService";

const LandingPage = () => {
  const [isDemoModal, setIsDemoModal] = useState(false);
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const userId = useSelector((state) => state?.auth?.loggedInUser?._id);
  useEffect(() => {
    getSubscriptionDetailByUserId(userId);
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <div className="overflow-hidden">
        <Hero setIsDemoModal={setIsDemoModal} isDemoModal={isDemoModal} />
        <About />
        <Demo />
        <Services />
        <FAQs />
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
