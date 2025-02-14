import { useState } from 'react';
const notAccessImage = require("../Assets/not-access.jpg")

const PurchaseModal = ({ handlePurchase, handleCancel }) => {
 return (
  <>
   <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50  z-40 ">
    <div className="bg-white rounded-lg p-5 w-[90%] sm:w-auto">
     <div>
      <img alt="img" src={notAccessImage} className='w-[400px] flex justify-center items-center m-auto' />
     </div>
     <p className='text-lg font-semibold text-red-500'>No Subscription Purchased</p>
     <p className='text-md font-semibold text-black'>Are you sure you wants to purchase the subscription? <br></br> Please go to the Service Section!!</p>
     <div className="mt-4 flex justify-end">
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2" onClick={() => { handlePurchase(); }}>Confirm</button>
      <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded" onClick={() => handleCancel()}>Cancel</button>
     </div>
    </div>
   </div>
  </>
 );
};

export default PurchaseModal;
