import React from "react";

const TopSection = ({ title, breadcrumData, keys }) => {
  const isAboutPage = title === "ABOUT US";
  return (
    <div>
      <div
        className={`flex md:h-[500px] h-[300px] justify-center items-center text-white ${
          isAboutPage ? "formNew-bg" : "form-bg"
        } relative md:mb-[100px] sm:mb-12 mb-6`}
      >
        <div className="text-center z-10">
          <p className="page-text text-white">{title}</p>
          <div className="flex items-center sm:gap-[20px] gap-2 justify-center px-4 mt-4">
            {breadcrumData?.length === 1 ? (
              <div key={keys} className="page-subtitle text-white">
                {breadcrumData[0]}
              </div>
            ) : (
              <>
                {breadcrumData.map((item, index) => (
                  <React.Fragment key={index}>
                    <p className="font-medium sm:text-base text-xs text-white">
                      {item}
                    </p>
                    {index !== breadcrumData?.length - 1 && (
                      <img
                        className=" w-[16px]"
                        src="/service-more-icon.svg"
                        alt=""
                      />
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="absolute left-0 top-0 h-full w-full bg-[#00000065]"></div>
      </div>
    </div>
  );
};

export default TopSection;
