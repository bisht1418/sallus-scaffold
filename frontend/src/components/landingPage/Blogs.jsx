import React from "react";

const Blogs = () => {
  return (
    <div className="pt-[100px]">
      <div className="custom-container">
          <div className="text-center pb-[60px]">
            <p className="title-text">BLOGS</p>
          </div>
        <div className="flex flex-col lg:flex-row gap-[20px] items-center ">
          <div className="w-full lg:w-1/3 rounded-[20px] overflow-hidden shadow-[0px_2px_1px_0px_#00000040]">
            <div className="h-[250px] w-full overflow-hidden">
              <img
                src="/blog-3.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="py-[25px] px-[20px] flex flex-col gap-[20px]">
              <p className="medium-title text-[#000000]">
                Here’s an example when the Blog Title is too long
              </p>
              <p className="normal-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus...
              </p>
              <p className="text-[16px] font-[700] text-[#0072BB] underline">
                Read More
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/3 rounded-[20px] overflow-hidden shadow-[0px_2px_1px_0px_#00000040]">
            <div className="h-[250px] w-full overflow-hidden">
              <img
                src="/blog-2.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="py-[25px] px-[20px] flex flex-col gap-[20px]">
              <p className="medium-title text-[#000000]">
                Here’s an example when the Blog Title is too long
              </p>
              <p className="normal-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus...
              </p>
              <p className="text-[16px] font-[700] text-[#0072BB] underline">
                Read More
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/3 rounded-[20px] overflow-hidden shadow-[0px_2px_1px_0px_#00000040]">
            <div className="h-[250px] w-full overflow-hidden">
              <img
                src="/blog-1.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="py-[25px] px-[20px] flex flex-col gap-[20px]">
              <p className="medium-title text-[#000000]">
                Here’s an example when the Blog Title is too long
              </p>
              <p className="normal-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus...
              </p>
              <p className="text-[16px] font-[700] text-[#0072BB] underline">
                Read More
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
