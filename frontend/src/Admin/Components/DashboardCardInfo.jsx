import React from 'react'
import { FaShoppingBag } from 'react-icons/fa'

const DashboardCardInfo = (props) => {

 return (
  <div className='border flex gap-3 p-2 bg-white rounded-lg h-[100px] justify-center items-center'>
   <div className='relative flex items-center'><svg xmlns="http://www.w3.org/2000/svg" className='' width="48" height="52" viewBox="0 0 48 52" fill="red"><path d="M19.1094 2.12943C22.2034 0.343099 26.0154 0.343099 29.1094 2.12943L42.4921 9.85592C45.5861 11.6423 47.4921 14.9435 47.4921 18.5162V33.9692C47.4921 37.5418 45.5861 40.8431 42.4921 42.6294L29.1094 50.3559C26.0154 52.1423 22.2034 52.1423 19.1094 50.3559L5.72669 42.6294C2.63268 40.8431 0.726688 37.5418 0.726688 33.9692V18.5162C0.726688 14.9435 2.63268 11.6423 5.72669 9.85592L19.1094 2.12943Z" fill={props?.element?.filledColor}></path></svg>
    <FaShoppingBag className='absolute justify-center items-center text-center left-3.5 text-xl text-white' />
   </div>
   <div className='flex flex-col items-center'>
    <div className='text-gray-600  text-nowrap text-sm font-semibold'>{props?.element?.title}</div>
    <div className='text-xl font-bold'>{props?.element?.amount}</div>
   </div>
   <div className='flex  items-center '>{props?.element?.spike}</div>
   <div className='flex  items-center text-lg font-semibold'>{props?.element?.percentage}</div>
  </div >
 )
}

export default DashboardCardInfo