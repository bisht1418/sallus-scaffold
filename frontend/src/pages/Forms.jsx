import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TopSection from "../components/forms/TopSection";
import Form from "../components/forms/Form";
import { t } from "../utils/translate";
import { useSelector } from "react-redux";

const Forms = () => {
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
          title={t("scaffoldForm")}
          breadcrumData={[t("home"), t("scaffoldForm")]}
        />
        <Form />
      </div>
      <Footer />
    </>
  );
};

export default Forms;
