import React from "react";
import { t } from "../../utils/translate";
import { useSelector } from "react-redux"
import { motion, useTransform, useScroll } from "framer-motion";
import { Link } from "react-router-dom";

const Demo = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const { scrollYProgress } = useScroll();

  return (
    <div className="pt-[100px]">
      <div className="custom-container flex flex-col  gap-y-8 justify-center items-center gap-[20px] ">

        <motion.div className="w-full lg:w-1/2 flex flex-col gap-[30px]">
          <motion.h1
            style={{ x: useTransform(scrollYProgress, [0, 0.3], [600, 0]), opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]), transition: "all 0.9s cubic-bezier(0.17,  0.55, 0.55, 1) 0s" }}
            className="title-text"
          >
            {t("demo-heading_01")}
          </motion.h1>
          <div>
            <motion.div style={{
              y: useTransform(scrollYProgress, [11, 2], [1000, 0]), // Moves from bottom to top
              x: useTransform(scrollYProgress, [0, 0.3], [-1000, 0]), // Moves from left to right
              opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0s",
            }}>
              <motion.p className="normal-text">
                {t("demo-heading_02")}
              </motion.p>
            </motion.div>
            <div className="mt-[60px] flex justify-center items-center gap-[36px]">
              <motion.div
                style={{
                  x: useTransform(scrollYProgress, [0, 0.1], [-600, 0]),
                  opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
                  transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0s",
                }}
              >
                  <Link to="/contact-us">
                  <button className="button-text bg-[#0072BB] text-[white] px-[20px] py-[10px] rounded-[5px]">
                  {t("aboutUs-button_01")}
                </button>
                  </Link>
               
              </motion.div>
            </div>
          </div>
        </motion.div>
        <motion.div
          style={{ x: useTransform(scrollYProgress, [0, 0.3], [-1000, 0]), opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]), transition: "all 0.9s cubic-bezier(0.17,  0.55, 0.55, 1) 0s" }}
          className="w-full lg:w-1/2 text-center"
        >
          {/* <img src="/demo-section-image.svg" alt="" className="mx-auto" /> */}
        </motion.div>
      </div>
    </div>

  );
};

export default Demo;
