import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HomePage = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { loggedInUser } = useSelector((state) => state.auth);

  return (
    <section className="vh-100" style={{ backgroundColor: "#f4f5f7" }}>
      <Header />
      <div className="container m-auto py-5 h-100 text-center ">
        <h1 className="text-[30px] font-[700]">Welcome, {loggedInUser.name}</h1>
        <h3 className="text-[20px] font-[500]">
          Role :{" "}
          {
            { 0: "Constructor", 1: "Project Manager", 2: "Approval Authority" }[
            loggedInUser.type
            ]
          }
        </h3>
      </div>
      <Footer />
    </section>
  );
};

export default HomePage;
