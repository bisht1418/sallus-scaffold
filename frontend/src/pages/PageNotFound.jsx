import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Link } from "react-router-dom";

import pageNotFound from "../Assets/page-not-found.png";

const PageNotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex flex-col justify-center items-center">
        <img
          src={pageNotFound}
          alt="404"
          className="max-w-[80%] md:max-w-[500px] h-auto mx-auto"
        />
        <div className="mt-[15px]">
          <Link to={"/"}>
            <button className="bg-[#0072BB] text-[#FFFFFF] font-[600] py-[10px] px-[20px] rounded">
              Go Home
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PageNotFound;
