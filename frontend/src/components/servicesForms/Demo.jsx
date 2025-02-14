
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { t } from '../../utils/translate';
import { useSelector } from 'react-redux';

const schema = yup.object({
  companyname: yup.string().required(t("PleaseEnterCompanyName")),
  name: yup.string().required(t("pleaseEnterYourFullName")),
  mobilenumber: yup.number().required(t("pleaseEnterMobileNumber")),
  email: yup.string().email(t("pleaseEnterAvalidEmail")).required(t("pleaseEnterYourEmail")),
});

const Demo = () => {

  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const { register, handleSubmit, formState: { errors }, } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
  };
  const [write, setWrite] = useState("")
  const [write1, setWrite1] = useState("")
  const [write2, setWrite2] = useState("")
  const [write3, setWrite3] = useState("")

  return (
    <div className="bg-[white] pt-[10px] lg:pt-[90px]">
      <div className="custom-container">
        <div className="flex flex-col lg:flex-row gap-[93px]">
          <div>
            <div className="text-center lg:mb-[30px]">
              <p className="title-text">GET A FREE DEMO</p>
              <p className="normal-text lg:w-[358px] mx-auto">
                Please fill the below form to get information about our Products or Services
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">

                <input
                  {...register('companyname')}
                  type="text"
                  className="w-[580px] h-[50px] rounded-lg border border-gray-300 bg-white p-4 mt-[30px] new-required"
                  placeholder={"Company Name"}
                  onChange={(e) => setWrite(e.target.value)}
                />

                <div className="input-form">
                  <img src="/brief-case.svg" alt="brief-case" />
                  {!write && <span className="absolute top-0 left-[166px] text-red-500">*</span>}
                </div>
              </div>
              <div className="relative">
                <input
                  {...register('name')}
                  type="text"
                  className="w-[580px] h-[50px] rounded-lg border border-gray-300 bg-white p-4 mt-[30px]"
                  placeholder="Your Full Name"
                  onChange={(e) => setWrite1(e.target.value)}
                />
                <div className="input-form">
                  <img src="/person.svg" alt="person" />
                  {!write1 && <span className="absolute top-0 left-[160px] text-red-500">*</span>}
                </div>
              </div>
              <div className="relative">
                <input
                  {...register('mobilenumber')}
                  type="number"
                  className="w-[580px] h-[50px] rounded-lg border border-gray-300 bg-white  placeholder-red::placeholder p-4 mt-[30px]"
                  placeholder='Mobile Number'
                  onChange={(e) => setWrite2(e.target.value)}
                />
                <div className="input-form">
                  <img src="/call.svg" alt="call" />
                  {!write2 && <span className="absolute top-0 left-[160px] text-red-500">*</span>}
                </div>
              </div>
              <div className="relative">
                <input
                  {...register('email')}
                  type="email"
                  className="w-[580px] h-[50px] rounded-lg border border-gray-300 bg-white p-4 mt-[30px]"
                  placeholder="Mail Id"
                  onChange={(e) => setWrite3(e.target.value)}
                />
                <div className="input-form">
                  <img src="/email.svg" alt="email-logo" />
                  {!write3 && <span className="absolute top-[-8px] left-[90px] text-red-500">*</span>}
                </div>
              </div>
              <div className="lg:w-[580px]">
                <p className="text-[13px] mt-[30px]">
                  We require this information to reach out to you and provide you with information about our products and services. Please rest assured, we prioritize your privacy, and your information is kept completely secure with us. You can review our <b>Privacy Policy</b> and <b>Terms & Conditions</b> here.
                </p>
              </div>
              <div className="flex justify-center">
                <button className="button-text bg-[#0072BB] text-[white] px-[20px] py-[14px] mt-[30px] rounded-[5px] mx-auto" type="submit">
                  Get Demo
                </button>
              </div>
            </form>
          </div>
          <div className="">
            <img className="h-[100%] rounded-[20px]" src="/demoicon.svg" alt="demo-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;

