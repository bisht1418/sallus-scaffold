import React, { useEffect, useRef, useState } from "react";
import axios from "axios"; // Add axios to make API requests
import { Link } from "react-router-dom";
import { t } from "../../utils/translate";
import { useSelector } from "react-redux";
import { motion, useInView } from "framer-motion";
import { FaDownload } from "react-icons/fa6";
import building1 from "../../Assets/building (1).png";
import building2 from "../../Assets/building (2).png";
import building3 from "../../Assets/building (3).png";
import building4 from "../../Assets/building (4).png";
import building5 from "../../Assets/building (5).png";
import building6 from "../../Assets/building (6).png";
import building7 from "../../Assets/building (7).png";
import { getSubscriptionDetails } from "../../Services/subscriptionService";
import Demo from "../../components/Services/Demo";
import { IoClose } from "react-icons/io5";
import CountdownTimer from "../CountdownTimer";
import { createVisitorService } from "../../Services/visitorService";
import { toast } from "react-toastify";
import WelcomeModal from "../WelcomeModal";

const pdfLinkPath = require("../../Assets/salus_scaffold.pdf");
const pdfLinkPathNo = require("../../Assets/salus_scaffold_no.pdf");
const logo = require("../../Assets/Logo_White.svg");

// option1---one time animaton only on reload
const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible,
};

const Hero = (props) => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const [openVisitorModal, setOpenVisitorModal] = useState(false);
  const isAuth = useSelector((state) => state?.auth?.token);
  const [userData, setUserData] = useState(null);
  const [visitorLoading, setVisitorLoading] = useState(false);
  const [visitorDetails, setVisitorDetail] = useState({
    visitorName: "",
    visitorEmail: "",
  });

  const expireTime = useSelector(
    (state) => state?.auth?.loggedInUser?.demoExpireTime
  );

  const isDemoAccount = useSelector(
    (state) => state?.auth?.loggedInUser?.isDemoAccount
  );

  const userDetails = useSelector((state) => state?.auth?.loggedInUser);


  useEffect(() => {
    getAllSubscriptionPlan();
  }, []);

  async function getAllSubscriptionPlan() {
    try {
      await getSubscriptionDetails();
    } catch (error) {}
  }

  const handleDownload = async () => {
    let userSetData;
    if (!isAuth) {
      if (!visitorDetails?.visitorName) {
        toast.error("Please enter User Name");
        return;
      } else if (!visitorDetails?.visitorEmail) {
        toast.error("Please enter User Email");
        return;
      } else if (!validateEmail(visitorDetails?.visitorEmail)) {
        toast.error("Please enter correct email");
        return;
      }
    } else {
      userSetData = {
        visitorEmail: userDetails?.name,
        visitorName: userDetails?.email,
        userId: userDetails?._id,
      };
      setVisitorDetail(userSetData);
    }

    setVisitorLoading(true);
    try {
      let visitorResponse;
      if (!isAuth) {
        visitorResponse = await createVisitorService(visitorDetails);
      } else {
        visitorResponse = await createVisitorService(userSetData);
      }

      if (visitorResponse?.status) {
        const link = document.createElement("a");
        if (currentLanguage === "no") {
          link.href = pdfLinkPathNo;
        } else {
          link.href = pdfLinkPath;
        }
        link.download = "salus_scaffold_guide";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error);
      setVisitorLoading(false);
    } finally {
      setVisitorLoading(false);
      setOpenVisitorModal(false);
      setVisitorDetail({ visitorEmail: "", visitorName: "" });
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const hasSeenModal = localStorage.getItem("hasSeenModal");

  // #check if subscription not showing

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       try {
  //         const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/get-user-data`, {
  //           headers: {
  //             'x-auth-token': token,
  //           },
  //         });
  //         setUserData(response.data.data.user); // Set user data
  //       } catch (error) {
  //         console.error("Error fetching user data", error);
  //       }
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  return (
    <div>
      {isAuth && isDemoAccount && <CountdownTimer endTime={expireTime} />}
      {!hasSeenModal && isAuth && <WelcomeModal userData={userDetails} updateUserData={setUserData}/>}

      <div className="flex relative flex-col-reverse gap-y-12 lg:flex-row items-center border border-solid box-border border-b-[#CCCCCC] pt-[80px] lg:py-[80px] min-h-[500px] xl:min-h-[650px]  overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
        >
          <motion.div className="w-full px-10 lg:w-6/12 flex items-end static lg:absolute left-10 top-[100px] bottom-[-2px]">
            <motion.img
              variants={itemVariants}
              src={building1}
              className="w-28 object-contain"
              alt=""
            />
            <motion.img
              variants={itemVariants}
              src={building2}
              className="w-28 object-contain"
              alt=""
            />
            <motion.img
              variants={itemVariants}
              src={building3}
              className="w-10 object-contain"
              alt=""
            />
            <motion.img
              variants={itemVariants}
              src={building4}
              className="w-20 object-contain"
              alt=""
            />
            <motion.img
              variants={itemVariants}
              src={building5}
              className="w-44 object-contain"
              alt=""
            />
            <motion.img
              variants={itemVariants}
              src={building6}
              className="w-48 object-contain"
              alt=""
            />
            <motion.img
              variants={itemVariants}
              src={building7}
              className="w-36 object-contain"
              alt=""
            />
          </motion.div>
        </motion.div>

        <div className="custom-container flex w-full justify-end">
          <div className="w-full lg:max-w-[480px]">
            <motion.article
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 1 } }}
              variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
            >
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible,
                }}
              >
                <p className="title-text">{t("hero-title")}</p>
              </motion.h1>
              <ul>
                <motion.li variants={itemVariants}>
                  <p
                    className="normal-text delay-[300ms] duration-[600ms] taos:translate-y-[100%] taos:invisible"
                    data-taos-offset="300"
                  >
                    {t("hero-description")}
                  </p>
                </motion.li>
                {isAuth && (
                  <div className="mt-[60px] flex sm:flex-row flex-col  items-center gap-2">
                    <motion.li className=" w-full" variants={itemVariants}>
                      <Link to={"/project"}>
                        <button className="button-text w-full text-nowrap text-[#212121] border border-[#212121] px-[20px] py-[10px] rounded-[5px] ">
                          {t("hero-button_01")}
                        </button>
                      </Link>
                    </motion.li>
                    <motion.li className=" w-full" variants={itemVariants}>
                      <Link to={"/create-project"}>
                        <button className="button-text w-full text-nowrap bg-[#0072BB] text-[white] px-[20px] py-[11.5px] rounded-[5px]">
                          {t("hero-button_02")}
                        </button>
                      </Link>
                    </motion.li>{" "}
                    {/* <motion.li className=" w-full" variants={itemVariants}>
                     
                    </motion.li> */}
                  </div>
                )}
              </ul>
              {!isAuth && (
                <>
                  <div className="mt-4 flex sm:flex-row flex-col justify-start items-start gap-2">
                    <button className="w-full">
                      <Link
                        to={"/signin"}
                        className="text-[13px] font-[600] bg-[#0072BB]  text-white px-[18px] py-[12px] rounded-[5px] flex justify-center items-center  m-auto  w-full"
                      >
                        {t("login")}
                      </Link>
                    </button>

                    <button
                      onClick={() => props.setIsDemoModal(false)}
                      className="button-text bg-[#0072BB] w-full hover:bg-[#398cc0] text-[white] px-[20px] py-[10px] rounded-[5px]"
                    >
                      Get Demo Account
                    </button>
                  </div>
                  <div className="flex justify-start items-start gap-3 mt-3 border text-nowrap">
                    <button
                      onClick={() => setOpenVisitorModal(true)}
                      className="button-text bg-[#ffffff] w-full  flex justify-center items-center  gap-4 hover:bg-[#0072BB] hover:text-white border border-black text-black   px-[20px] py-[10px] rounded-[5px] "
                    >
                      {t("user_guide")}
                      <span>
                        <FaDownload />
                      </span>
                    </button>
                  </div>
                </>
              )}
            </motion.article>
          </div>
        </div>
      </div>
      <div>
        {!isAuth && !props.isDemoModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-90 z-50">
            <div className=" p-6 rounded-lg shadow-xl drop-shadow-2xl ">
              <div className="relative flex justify-end mt-4 drop-shadow-2xl">
                <IoClose
                  onClick={() => props.setIsDemoModal(true)}
                  className="absolute top-3 right-3  text-[26px] cursor-pointer rounded-full border font-bold"
                />
                <Demo {...props} />
              </div>
            </div>
          </div>
        )}
      </div>

      {openVisitorModal && (
        <div className="fixed inset-0 flex justify-center bg-gray-100 items-center bg-opacity-90  z-40 cursor-default">
          <div className="bg-white rounded-lg relative w-[30rem] h-[30rem]">
            <IoClose
              onClick={() => setOpenVisitorModal(false)}
              className="absolute top-[2%] right-[2%] text-[26px] cursor-pointer rounded-full border font-bold hover:bg-gray-300 shadow-xl border-black"
            />
            <div className="flex flex-col gap-4 mt-5 p-10 ">
              <img
                src={"/new_logo.svg"}
                alt="img"
                className="w-[100px]  items-center  m-auto"
              />
              {!isAuth && (
                <>
                  <p className="text-md font-semibold text-[#0072BB]">
                  Please fill in contact information to download our user guide.{" "}
                  </p>
                  <div className="">
                    <label className="text-sm font-bold " for="userName">
                      Name
                    </label>
                    <input
                      type="text"
                      id="userName"
                      placeholder="Name"
                      className="border !border-black  outline-none !pl-4"
                      onChange={(e) =>
                        setVisitorDetail({
                          ...visitorDetails,
                          visitorName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="">
                    <label className="text-sm font-bold " for="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Email"
                      className="border !border-black  outline-none !pl-4"
                      onChange={(e) =>
                        setVisitorDetail({
                          ...visitorDetails,
                          visitorEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              <button
                onClick={() => handleDownload()}
                className=" px-2 py-2 rounded-xl bg-[#0072BB] w-full hover:bg-[#398cc0] text-white font-semibold mt-5"
              >
                {visitorLoading ? (
                  <span className="loading loading-bars loading-sm"></span>
                ) : (
                  "Download"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Hero;
