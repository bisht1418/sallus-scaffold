import React, { useEffect } from "react";
import Header from "../components/Header";
import TopSection from "../components/forms/TopSection";
import Footer from "../components/Footer";
import { t } from "../utils/translate";
import { useSelector } from "react-redux";
import cancelImage from "../Assets/payment-failed.jpg"
import { Link } from "react-router-dom";

const PaymentCancel = () => {

 const currentLanguage = useSelector(
  (state) => state?.global?.current_language
 );
 useEffect(() => {
  window.scrollTo(0, 0)
 }, [])


 return (
  <div>
   <Header />
   <div>
    <TopSection
     keys={"unique"}
     title={("Welcome to Salus Scaffold!")}
     breadcrumData={[t("home"), ("CANCEL")]}
    />
    <div className="custom-container w-[40vw] border rounded-xl pb-5">
     <div className="flex flex-col justify-center items-center">
      <img src={cancelImage} className="w-[300px]" alt="img" />
      <button className="text-sm font-bold bg-blue-500 text-white py-2 px-2 rounded-md m-auto border justify-center items-center w-auto ">
       <Link to={"/"}>
        Go Back
       </Link>
      </button>
     </div>

    </div>

   </div>
   <Footer />
  </div>
 )
}

export default PaymentCancel