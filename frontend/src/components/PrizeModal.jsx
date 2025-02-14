import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import  {sendSubscriptionPrizeMail} from "../Services/subscriptionService";
import { toast } from "react-toastify";

const PrizeModal = (props) => {
  const [loading, setLoading] = useState(false)
  const closeModal = () => {
    props?.setIsPrizeOpen(false);
  };

  const userDetails = useSelector((state) => state?.auth?.loggedInUser);

  const handlePrizeRequest = async()=>{
    try {
      setLoading(true)
      const mailresponse = await sendSubscriptionPrizeMail(userDetails)
      if(mailresponse?.emailResponse?.status){
        toast.success("Request sent successfully. The organization will contact you soon.")
      }else{
        toast.error("There is an error. Please try again later.")
      }
    } catch (error) {
      return error
    }finally{
      setLoading(false)
      closeModal()
    }
  }

  return (
    <>
      {props?.isPrizeOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-90">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full sm:p-10 p-3 relative mx-3">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src="https://images.pexels.com/photos/1292257/pexels-photo-1292257.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Welcome"
              className="w-full h-48 object-cover rounded-t-lg"
            />

            <p>Thank you for choosing our 25+ Users Subscription Plan!</p>
            <p>
              We understand the unique needs of large teams and are committed to
              providing you with the best service and enterprise-level security.
              Our team will reach out to you shortly to discuss your
              requirements in detail and offer a tailored solution that meets
              your specific needs.
            </p>
            <p>
              Please expect a call from us soon. We are dedicated to ensuring
              you receive the best value and service for your investment.
            </p>
            <button onClick={()=>handlePrizeRequest()} className="my-3 relative px-3 py-2 bg-[#375cce] text-white font-semibold rounded-lg shadow-md">
              {loading ?
              (
                <div className="flex justify-center items-center gap-2">
                  <div>
                  Loading
                    </div>
                    <div className="loading loading-bars loading-sm"></div>
                </div>
              
              ):"Request Meeting"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PrizeModal;
