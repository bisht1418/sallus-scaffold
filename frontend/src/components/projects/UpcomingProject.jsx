import React, { useEffect, useState } from "react";
import { BiSolidQuoteLeft, BiSolidQuoteRight } from "react-icons/bi";
import Slider from "react-slick";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import p1 from "../../Assets/p1.png"
import p2 from "../../Assets/p2.png"
import p3 from "../../Assets/p3.png"

const UpcomingProject = () => {


    const [imageIndex, setImageIndex] = useState(0);

    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
            <IoIosArrowForward
                color="#0072BB"
                size={25}
                className={className}
                onClick={onClick}
            />
        );
    }

    function SamplePrevArrow(props) {
        const { className, onClick } = props;
        return (
            <IoIosArrowBack
                color="#0072BB"
                size={25}
                className={className}
                onClick={onClick}
            />
        );
    }
    const customeSlider = React.createRef();

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        dotsClass: "slick-dots slick-custom-dots",
        beforeChange: (current, next) => setImageIndex(next),
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

    const currentProjectData = [
        {
            name: "#project1",
            image: p1
        },
        {
            name: "#project2",
            image: p3
        },
        {
            name: "##Here’s an example when the Blog Title is too long",
            image: p2
        },
        {
            name: "#project4",
            image: p1
        },
    ];

    return (
        <div>
            <div className="flex items-start">
                <p className="text-[#212121] text-xl not-italic font-bold leading-[normal]">Upcoming Projects</p>
            </div>
            <div className="flex justify-center">
                <div className="pt-2 slide-main w-full">
                    <Slider className="project-slider" ref={customeSlider} {...settings}>
                        {currentProjectData.map((item) => (
                            <div className="w-full rounded-[10px] relative overflow-hidden">
                                <div className="h-[380px]">
                                    <img src={item.image} alt="" class="h-full w-full object-cover" />
                                </div>
                                <div className="absolute bottom-0 left-0 medium-title text-[#FFFFFF] bg-[#000000B2] !w-full">
                                    <div className="flex justify-between gap-[20px] items-center p-[20px]">

                                        <p>{item.name}</p>
                                        <div className="flex gap[-10px]">
                                            <img className="h-[50px] w-[50px]" src="/person-icon2.svg" alt="*" />
                                            <img className="h-[50px] w-[50px] left-2" src="/person-icon2.svg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div >
            </div >
        </div >
    )
}

export default UpcomingProject;