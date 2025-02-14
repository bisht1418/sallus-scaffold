import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ endTime }) => {

 const endTimeDate = new Date(endTime);

 const calculateTimeRemaining = () => {
  const totalMilliseconds = endTimeDate - Date.now();

  if (totalMilliseconds <= 0) {
   return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: true,
   };
  }

  let remainingTime = totalMilliseconds;
  const oneSecond = 1000;
  const oneMinute = oneSecond * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;

  const days = Math.floor(remainingTime / oneDay);
  remainingTime -= days * oneDay;

  const hours = Math.floor(remainingTime / oneHour);
  remainingTime -= hours * oneHour;

  const minutes = Math.floor(remainingTime / oneMinute);
  remainingTime -= minutes * oneMinute;

  const seconds = Math.floor(remainingTime / oneSecond);

  return {
   days,
   hours,
   minutes,
   seconds,
   expired: false,
  };
 };

 const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

 useEffect(() => {
  const timerInterval = setInterval(() => {
   setTimeRemaining(calculateTimeRemaining());
  }, 1000);

  return () => clearInterval(timerInterval);
 }, []);

 if (timeRemaining.expired) {
  return <div>Timer expired!</div>;
 }

 return (
  <div className='custom-container flex gap-4 w-full'>
   <div className=' w-full flex justify-end mt-[4px] uppercase font-bold text-nowrap'>
    expire in :
   </div>
   <div className="grid grid-flow-col justify-end py-2 gap-5 text-end auto-cols-max bg-gradient-to-r from-indigo-50 from-10% via-sky-50 via-30% to-emerald-50 to-10%">
    <div className="flex flex-col text-md  font-bold text-[#1f77b4]">
     <span className="countdown font-mono ">
      <span style={{ "--value": timeRemaining?.days }}></span>
     </span>
     days
    </div>
    <div className="flex flex-col text-md  font-bold text-[#ff7f0e]">
     <span className="countdown font-mono">
      <span style={{ "--value": timeRemaining?.hours }}></span>
     </span>
     hours
    </div>
    <div className="flex flex-col text-md  font-bold text-[#2ca02c]">
     <span className="countdown font-mono">
      <span style={{ "--value": timeRemaining?.minutes }}></span>
     </span>
     min
    </div>
    <div className="flex flex-col text-md  font-bold text-[#d62728]">
     <span className="countdown font-mono">
      <span style={{ "--value": timeRemaining?.seconds }}></span>
     </span>
     sec
    </div>
   </div>
  </div>

 );
};

export default CountdownTimer;
