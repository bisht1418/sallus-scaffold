import React, { useState } from "react";
import ImageUpload from "../FileUpload";
import { t } from "../../utils/translate";
import { motion, useTransform, useScroll } from "framer-motion";
import { Link } from "react-router-dom";

const About = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div className="py-[90px] bg-[#FAFAFA]">
      <div className="custom-container flex flex-col-reverse lg:flex-row justify-center items-center gap-[20px]" >
        <div className="w-full lg:w-1/2 flex flex-col gap-[30px]">
          <motion.div>
            <motion.h1
              style={{
                x: useTransform(scrollYProgress, [100, 0.1], [-600, 0]),
                opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]), transition: "all 0.9s cubic-bezier(0.17,  0.55, 0.55, 1) 0s"
              }}
              // transition={{ duration: 1 }}
              className="title-text items-center flex justify-center mb-4"
            >
              {t("home_scaffold_welcome")}
            </motion.h1>

            <div className="flex flex-col items-center justify-center">
              <motion.p
                style={{
                  x: useTransform(scrollYProgress, [0, 0.1], [-1000, 0]),
                  opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
                  transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0s",
                }}
                className="normal-text"
              >
                {t("aboutUs-description")}
              </motion.p>

              <motion.p
                style={{
                  x: useTransform(scrollYProgress, [0, 0.1], [1000, 0]),
                  opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
                  transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0s",
                }}
                className="normal-text mt-3"
              >
                {t("home_description_01")}
              </motion.p>

              <motion.p
                style={{
                  x: useTransform(scrollYProgress, [0, 0.1], [-1000, 0]),
                  opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
                  transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0s",
                }}
                className="normal-text mt-3"
              >
                {t("home_description_02")}
              </motion.p>

              <div className="mt-[60px] flex items-center gap-[36px]">
                <motion.div
                  style={{
                    x: useTransform(scrollYProgress, [0, 0.1], [-600, 0]),
                    opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
                    transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0s",
                  }}
                >
                  <Link to="/about-us">
                    <button className="button-text bg-[#0072BB] text-[white] px-[20px] py-[10px] rounded-[5px]">
                      {t("aboutUs-button_01")}
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* <motion.div >
          <motion.div className="w-full"
            style={{
              x: useTransform(scrollYProgress, [0, 0.1], [1000, 0]),
              opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]), transition: "all 0.9s cubic-bezier(0.17,  0.55, 0.55, 1) 0s"
            }}
          // transition={{ duration: 1 }}
          >
            <img src="/about-image.svg" alt="" className="w-full" />
          </motion.div>
        </motion.div> */}
      </div>
    </div>


  );
};

export default About;