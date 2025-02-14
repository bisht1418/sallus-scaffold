import React from "react";

const AddNewUserFrom = (props) => {
  return (
    <form>
      <div className="mt-5 bg-white  mx-4 p-2 border rounded-md">
        <div className=" text-xl font-bold uppercase">Create A new user</div>
        <div className=" p-4 ">
          <div className="sm:w-1/2 mx-auto">
            <div className="relative z-0 w-full mb-5 group">
              <label
                for="floating_first_name"
                className="text-xs font-semibold"
              >
                Full Name
              </label>
              <input
                type="text"
                name="floating_first_name"
                id="floating_first_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 !pl-2"
                placeholder=" "
                onChange={(e) =>
                  props?.setAddUserDetail({
                    ...props?.addUserDetails,
                    name: e.target.value,
                  })
                }
                value={props?.addUserDetails?.name}
              />
              {!props?.addUserDetails?.name && (
                <p className="text-xs text-red-600 font-semibold">
                  Please fill this detail
                </p>
              )}
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <label for="floating_email" className="text-xs font-semibold">
                Email address
              </label>
              <input
                type="email"
                name="floating_email"
                id="floating_email"
                className="block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 !px-2"
                placeholder=" "
                onChange={(e) =>
                  props?.setAddUserDetail({
                    ...props?.addUserDetails,
                    email: e.target.value,
                  })
                }
                value={props?.addUserDetails?.email}
              />
              {!props?.addUserDetails?.email && (
                <p className="text-xs text-red-600 font-semibold">
                  Please fill this detail
                </p>
              )}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <label for="floating_email" className="text-xs font-semibold">
                Password
              </label>
              <input
                type="email"
                name="floating_email"
                id="floating_email"
                className="block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 !px-2"
                placeholder=" "
                onChange={(e) =>
                  props?.setAddUserDetail({
                    ...props?.addUserDetails,
                    password: e.target.value,
                  })
                }
                value={props?.addUserDetails?.password}
              />
              {!props?.addUserDetails?.password && (
                <p className="text-xs text-red-600 font-semibold">
                  Please fill this detail
                </p>
              )}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <label for="floating_email" className="text-xs font-semibold">
                Confirm Password
              </label>
              <input
                type="email"
                name="floating_email"
                id="floating_email"
                className="block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 !px-2"
                placeholder=""
                onChange={(e) =>
                  props?.setAddUserDetail({
                    ...props?.addUserDetails,
                    confirmPassword: e.target.value,
                  })
                }
                value={props?.addUserDetails?.confirmPassword}
              />
              {!props?.addUserDetails?.confirmPassword && (
                <p className="text-xs text-red-600 font-semibold">
                  Please fill this detail
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <label
                  for="floating_company"
                  className="text-xs font-semibold "
                >
                  Phone number (123-456-7890)
                </label>
                <div className="flex w-full">
                  <input
                    type="number"
                    className="block py-2.5 px-0 !pl-2 !w-[40px] font-bold text-sm text-gray-900 bg-transparent border-0  border-b-2 border-gray-300"
                    value={props?.countryCallingCode}
                  />
                  <div>
                    <input
                      type="number"
                      name="floating_company"
                      id="floating_company"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 !pl-2 border-b-2 border-gray-300"
                      placeholder=" "
                      onChange={(e) =>
                        props?.setAddUserDetail({
                          ...props?.addUserDetails,
                          phoneNumber: e.target.value,
                        })
                      }
                      value={props?.addUserDetails?.phoneNumber}
                    />
                    {!props?.addUserDetails?.phoneNumber && (
                      <p className="text-xs text-red-600 font-semibold">
                        Please fill this detail
                      </p>
                    )}
                  </div>
                </div>
              </div>{" "}
              <div className="relative z-0 w-full mb-5 group">
                <label
                  for="floating_company"
                  className="text-xs font-semibold "
                >
                  Company
                </label>
                <input
                  type="text"
                  name="floating_company"
                  id="floating_company"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 !pl-2 border-b-2 border-gray-300"
                  placeholder=" "
                  onChange={(e) =>
                    props?.setAddUserDetail({
                      ...props?.addUserDetails,
                      company: e.target.value,
                    })
                  }
                  value={props?.addUserDetails?.company}
                />
                {!props?.addUserDetails?.company && (
                  <p className="text-xs text-red-600 font-semibold">
                    Please fill this detail
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!props?.isAdminId && (
        <div className="mt-5 mb-10 bg-white  mx-4 p-2 border rounded-md">
          <div className=" text-xl font-bold uppercase">Permissions</div>
          <div className=" p-4 ">
            <div className="sm:w-1/2 mx-auto">
              <div className="relative z-0 w-full mb-5 group">
                <label for="floating_email" className="text-md font-bold">
                  Type Of Users
                </label>
                <div
                  onClick={(e) =>
                    props?.setAddUserDetail({
                      ...props?.addUserDetails,
                      type: e.target.value,
                    })
                  }
                  className="flex gap-10 mt-3  ml-10"
                >
                  <div className="flex justify-center items-center gap-2 border rounded-lg px-3 py-2">
                    <label
                      for="floating_email"
                      className="text-xs font-semibold"
                    >
                      Admin
                    </label>
                    <input
                      type="radio"
                      name="radio-7"
                      className="radio radio-info"
                      value={"admin"}
                    />
                  </div>

                  <div className="flex justify-center items-center gap-2 border rounded-lg px-3 py-2">
                    <label
                      for="floating_email"
                      className="text-xs font-semibold"
                    >
                      User
                    </label>
                    <input
                      type="radio"
                      name="radio-7"
                      className="radio radio-info"
                      value={"user"}
                    />
                  </div>
                </div>
                {!props?.addUserDetails?.type && (
                  <p className="text-xs text-red-600 font-semibold ml-10">
                    Please fill this detail
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 mb-10 flex justify-center items-center">
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800"
          onClick={(e) => {
            props?.handleAddNewUser(e);
          }}
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default AddNewUserFrom;
