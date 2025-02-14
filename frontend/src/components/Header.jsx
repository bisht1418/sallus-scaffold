import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutService } from "../Services/authService";
import { toast } from "react-toastify";
import LanguageSelector from "./LanguageSelector";
import { t } from "../utils/translate";
import { store } from "../Redux/store";
import { clearCreateMaterialList } from "../Redux/Slice/materialListSlice";
import { clearProject } from "../Redux/Slice/projectSlice";
import { ClearMaterialListWithProject } from "../Redux/Slice/materialListWithProjectSlice";
import { IoIosNotificationsOutline } from "react-icons/io";
import { ModalNotification } from "./landingPage/ModalNotification";
import { clearSubscription } from "../Redux/Slice/subscriptionSlice";
import { getSubscriptionDetailByUserId } from "../Services/subscriptionService";
import { useDispatch } from "react-redux";
import { setAuth, setUser } from "../Redux/Slice/authSlice";

const Header = () => {
  const [showMobile, setShowMobile] = useState(false);
  const [isSubscriptionPurchase, setIsSubscriptionPurchase] = useState(true);
  const [isNotificationModelOpen, setIsNotificationModelOpen] = useState(false);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const isSubscription = useSelector(
    (state) => state?.auth?.loggedInUser?.isSubscription
  );
  const isUserLoggedIn = useSelector((state) => state?.auth?.loggedInUser?._id);
  useEffect(() => {
    getUserSubscriptionDetail(getUserSubscriptionDetail);
  }, []);

  const isDemoAccount = useSelector(
    (state) => state?.auth?.loggedInUser?.isDemoAccount
  );
  const handleLogout = async () => {
    localStorage.removeItem("hasSeenModal");
    toast.success(t("logoutSuccessfully"));
    await logoutService();
    store.dispatch(clearCreateMaterialList());
    store.dispatch(clearProject());
    store.dispatch(ClearMaterialListWithProject());
    store.dispatch(clearSubscription());
    navigate("/signin");
  };

  async function getUserSubscriptionDetail(customerId) {
    try {
      const response = await getSubscriptionDetailByUserId(customerId);
      if (response.date === null || !response?.data?.isActive) {
        setIsSubscriptionPurchase(false);
      } else {
        setIsSubscriptionPurchase(true);
      }
    } catch (error) {
    } finally {
    }
  }
  const userType = useSelector((state) => state?.auth?.loggedInUser)?.type;
  return (
    <div className="relative shadow-[0px_2px_4px_0px_#0000001A]">
      <div className="h-[60px] flex justify-between items-center custom-container ">
        <div>
          <Link to={"/"}>
            <img src="/new_logo.svg" width={112} alt="" />
          </Link>
        </div>
        <div className="gap-[20px] justify-end items-center hidden md:flex">
          <div>
            <Link to={"/"} className="header-links text-nowrap">
              {t("home")}
            </Link>
          </div>
          <div>
            <Link to={"/about-us"} className="header-links text-nowrap">
              {t("aboutUs")}
            </Link>
          </div>
          {token && (
            <div>
              <Link to={"/project"} className="header-links text-nowrap">
                {t("project")}
              </Link>
            </div>
          )}

          <div>
            <Link to={"/services"} className="header-links text-nowrap">
              {t("services")}
            </Link>
          </div>
          <div>
            <Link to={"/contact-us"} className="header-links text-nowrap">
              {t("contactUs")}
            </Link>
          </div>

          <div>
            <Link to={"/support"} className="header-links text-nowrap">
              {t("support")}
            </Link>
          </div>

          {isUserLoggedIn &&
            !isDemoAccount &&
            (!isSubscription ? (
              <div>
                <Link to={"/subscription"} className="header-links text-nowrap">
                  {t("subscription")}
                </Link>
              </div>
            ) : (
              <div>
                <Link
                  to={"/my-subscription"}
                  className="header-links text-nowrap"
                >
                  {t("my_subscription")}
                </Link>
              </div>
            ))}

          <div>
            <div className="flex items-center gap-[5px] text-nowrap">
              <LanguageSelector />
            </div>
          </div>

          {!isDemoAccount && token && (
            <div className="relative">
              <div>
                <p
                  onClick={() => setIsNotificationModelOpen(true)}
                  className=" text-[22px] cursor-pointer text-nowrap"
                >
                  {" "}
                  <IoIosNotificationsOutline size={30} />
                </p>
              </div>
              {isNotificationModelOpen && (
                <div>
                  <ModalNotification
                    setIsNotificationModelOpen={setIsNotificationModelOpen}
                  />
                </div>
              )}
            </div>
          )}

          {isDemoAccount && (
            <div>
              <button className="text-nowrap border bg-orange-400 hover:bg-orange-500 transition-all duration-100 ease-in-out text-white font-bold px-2 py-3 uppercase text-xs rounded-lg">
                Demo Account
              </button>
            </div>
          )}
          {!token ? (
            <div>
              <Link
                to={"/signin"}
                className="text-[10px] lg:text-[13px] font-[600] bg-[#36454F] text-white px-[4px] py-[8px] lg:px-[18px] lg:py-[12px] rounded-[5px]  cursor-pointer"
              >
                {t("login")}
              </Link>
            </div>
          ) : (
            <>
              <div
                onClick={handleLogout}
                className="text-[10px] lg:text-[13px] font-[600] bg-[#36454F] text-white px-[4px] py-[8px] lg:px-[18px] lg:py-[12px] rounded-[5px] cursor-pointer"
              >
                {t("logout")}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-row gap-3 items-center md:hidden ">
          {isDemoAccount && (
            <div>
              <button className="text-nowrap border bg-orange-400 hover:bg-orange-500 transition-all duration-100 ease-in-out text-white font-bold px-2 py-3 uppercase text-xs rounded-lg">
                Demo Account
              </button>
            </div>
          )}
          {!isDemoAccount && (
            <div className="relative">
              <div>
                <p
                  onClick={() => setIsNotificationModelOpen(true)}
                  className=" text-[22px] cursor-pointer"
                >
                  {" "}
                  <IoIosNotificationsOutline size={30} className="  " />
                </p>
              </div>
              {isNotificationModelOpen && (
                <ModalNotification
                  setIsNotificationModelOpen={setIsNotificationModelOpen}
                />
              )}
            </div>
          )}
          <button
            onClick={() => {
              setShowMobile(!showMobile);
            }}
          >
            {showMobile ? (
              <img src="/close-icon.svg" width={30} alt="" />
            ) : (
              <img src="/menu-icon.svg" width={30} alt="" />
            )}
          </button>
        </div>
      </div>

      {showMobile && (
        <div className="h-[100vh] w-full absolute bg-white z-[100] block md:hidden">
          <div className="flex flex-col">
            <div className="border-b p-[15px]">
              <Link to={"/"} className="header-links">
                {t("home")}
              </Link>
            </div>
            <div className="border-b p-[15px]">
              <Link to={"/about-us"} className="header-links">
                {t("aboutUs")}
              </Link>
            </div>
            {token && (
              <div className="border-b p-[15px]">
                <Link to={"/project"} className="header-links">
                  {t("project")}
                </Link>
              </div>
            )}

            <div className="border-b p-[15px]">
              <Link to={"/services"} className="header-links">
                {t("services")}
              </Link>
            </div>
            <div className="border-b p-[15px]">
              <Link to={"/contact-us"} className="header-links">
                {t("contactUs")}
              </Link>
            </div>
            <div className="border-b p-[15px]">
              <Link to={"/support"} className="header-links">
                {t("support")}
              </Link>
            </div>
            {isUserLoggedIn &&
              !isDemoAccount &&
              (!isSubscription ? (
                <div className="border-b p-[15px]">
                  <Link
                    to={"/subscription"}
                    className="header-links text-nowrap"
                  >
                    {t("subscription")}
                  </Link>
                </div>
              ) : (
                <div className="border-b p-[15px]">
                  <Link
                    to={"/my-subscription"}
                    className="header-links text-nowrap"
                  >
                    {t("my_subscription")}
                  </Link>
                </div>
              ))}

            <div className="p-[15px]">
              <div className="flex items-center gap-[5px]">
                <LanguageSelector />
              </div>
            </div>

            {!token ? (
              <div>
                <Link
                  to={"/signin"}
                  className="text-[13px] font-[600] bg-[#36454F] text-white px-[18px] py-[12px] rounded-[5px] flex justify-center items-center  m-auto w-[100px]"
                >
                  {t("login")}
                </Link>
              </div>
            ) : (
              <>
                <div
                  className="text-[13px] font-[600] bg-[#36454F] text-white px-[18px] py-[12px] rounded-[5px] flex justify-center items-center  m-auto w-[100px]"
                  onClick={handleLogout}
                >
                  {t("logout")}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
