import React from "react";
import Slider from "react-slick";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const ClientSlider = () => {
  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return <IoIosArrowForward color="#0072BB" size={25} className={className} onClick={onClick} />;
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return <IoIosArrowBack color="#0072BB" size={25} className={className} onClick={onClick} />;
  }
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      <div>
        <div className="max-w-[160px] mx-[auto]">
          <img src="/dummy-logo-5.svg" width={160} alt="" srcset="" />
        </div>
      </div>
      <div>
        <div className="max-w-[160px] mx-[auto]">
          <img src="/dummy-logo-4.svg" width={160} alt="" srcset="" />
        </div>
      </div>
      <div>
        <div className="max-w-[160px] mx-[auto]">
          <img src="/dummy-logo-3.svg" width={160} alt="" srcset="" />
        </div>
      </div>
      <div>
        <div className="max-w-[160px] mx-[auto]">
          <img src="/dummy-logo-1.svg" width={160} alt="" srcset="" />
        </div>
      </div>
      <div>
        <div className="max-w-[160px] mx-[auto]">
          <img src="/dummy-logo-2.svg" width={160} alt="" srcset="" />
        </div>
      </div>
      <div>
        <div className="max-w-[160px] mx-[auto]">
          <img src="/dummy-logo-3.svg" width={160} alt="" srcset="" />
        </div>
      </div>
      <div>
        <div className="max-w-[160px] mx-[auto]">
          <img src="/dummy-logo-1.svg" width={160} alt="" srcset="" />
        </div>
      </div>
      <div>
        <div className="max-w-[160px] mx-[auto]">
          <img src="/dummy-logo-2.svg" width={160} alt="" srcset="" />
        </div>
      </div>
    </Slider>
  );
};

export default ClientSlider;
