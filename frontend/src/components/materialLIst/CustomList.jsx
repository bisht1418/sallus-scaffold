import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";
import { createMaterialListWithUserId } from "../../Services/materialListService";
import { editCustomList } from "../../Services/custonListService";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineMinusCircle } from "react-icons/ai";

const schema = yup.object().shape({
  productName: yup.string(),
  description: yup.string(),
  productNumber: yup.string(),
  kg: yup
    .mixed()
    .test(
      "is-less-than-or-equal-to-1",
      "Weight must not be greater than 1",
      (value) => value === undefined || value <= 1
    ),
});

const CustomList = (props) => {
  const [addMoreList, setAddMoreList] = useState([]);
  const [listData, setListData] = useState({
    productName: "",
    description: "",
    productNumber: "",
  });
  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const { createList } = useSelector((state) => state?.materialList);
  const userId = useSelector((state) => state.auth.loggedInUser._id);

  const [weight, setWeight] = useState(0.1);

  const increaseWeight = () => {
    setWeight((prevWeight) => (parseFloat(prevWeight) + 0.1).toFixed(1));
  };

  const decreaseWeight = () => {
    setWeight((prevWeight) => (parseFloat(prevWeight) - 0.1).toFixed(1));
  };

  function generateCustomNumber() {
    const day = Math.floor(Math.random() * 31) + 1;
    const month = Math.floor(Math.random() * 12) + 1;
    const year = Math.floor(Math.random() * (999 - 100 + 1)) + 100;

    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");
    const formattedYear = String(year);

    return `${formattedDay}-${formattedMonth}-${formattedYear}`;
  }

  const onSubmit = async (e, data) => {
    e.preventDefault();
    const formattedData = {
      ...data,
      userId,
      kg: weight,
      quantity: Number(data?.quantity || 0),
      category: "CustomList",
      product_no: generateCustomNumber(),
      date: new Date().toLocaleDateString(),
      index: props?.createList?.length,
      customListName: props.currentCustomListName,
    };

    const customResponse = await createMaterialListWithUserId(formattedData);
    const materialListId = customResponse?.data?._id;
    const newFormattedData = {
      ...formattedData,
      materialId: materialListId,
      id: materialListId,
      _id: materialListId,
    };

    const targetCustomListComponent =
      props.customListData[props.currentCustomListIndex];

    const addCustomListInCustomComponent = {
      ...targetCustomListComponent,
      customList: [
        ...(targetCustomListComponent?.customList || []),
        ...addMoreList,
        ...(addMoreList?.length > 0 ? [] : [newFormattedData]),
      ],
    };

    const response = await editCustomList(
      addCustomListInCustomComponent,
      props.currentCustomDeleteId
    );

    if (response?.status === "success") {
      toast.success("SuccessFully Added List");
      props.getCustomMaterialByProjectId();
    } else {
      toast.error("There is som error");
    }

    props.setCustomListData([
      ...props.customListData.slice(0, props.currentCustomListIndex),
      addCustomListInCustomComponent,
      ...props.customListData.slice(props.currentCustomListIndex + 1),
    ]);

    if (props.createList && typeof props.createList.length === "number") {
      formattedData.index = props.createList.length;
      props.setCreateList([...props.createList, newFormattedData]);
      props.setItems([...props.items, newFormattedData]);
    } else {
      props.setCreateList([formattedData]);
      props.setItems([formattedData]);
    }
    props.setIsCustomComponentOpen(false);
    reset();
  };

  const handleAddMore = async () => {
    const data = { ...listData, kg: weight };
    const formattedData = {
      ...data,
      userId,
      kg: weight,
      quantity: Number(data?.quantity || 0),
      category: "CustomList",
      product_no: generateCustomNumber(),
      date: new Date().toLocaleDateString(),
      index: props?.createList?.length,
      customListName: props.currentCustomListName,
    };

    const customResponse = await createMaterialListWithUserId(formattedData);
    const materialListId = customResponse?.data?._id;
    const newFormattedData = {
      ...formattedData,
      materialId: materialListId,
      id: materialListId,
      _id: materialListId,
    };
    setAddMoreList((prev) => [...prev, newFormattedData]);
    setListData({
      productName: "",
      description: "",
      productNumber: "",
    });
    setWeight(0.0);
  };

  const handleDelete = (index) => {
    const newList = [...addMoreList];
    newList.splice(index, 1);
    setAddMoreList(newList);
  };

  return (
    <div className="pb-[60px] min-h-[10px] max-h-[500px] md:max-h-[100%] w-full h-full">
      <div className="pb-[30px]">
        <p className="medium-title">{t("createYourCustomList")}</p>
      </div>
      <div>
        <div className="flex flex-col lg:flex-row justify-between flex-wrap items-center gap-[20px]">
          <div className="w-full lg:w-[calc(50%-10px)] relative mb-3">
            <input
              className="input-without-icon"
              type="text"
              placeholder={t("productName")}
              onChange={(e) =>
                setListData({ ...listData, productName: e.target.value })
              }
              value={listData?.productName}
              // {...register("productName")}
            />
            {!listData?.productName && (
              <p className="text-[red] text-[14px] font-[400] absolute">
                {"Please Fill the Product Name"}
              </p>
            )}
          </div>
          <div className="w-full lg:w-[calc(50%-10px)] mb-3">
            <input
              className="input-without-icon"
              type="text"
              placeholder={t("productNumber")}
              onChange={(e) =>
                setListData({ ...listData, productNumber: e.target.value })
              }
              value={listData?.productNumber}
              // {...register("productNumber")}
            />
            {/* {!listData?.productNumber && (
              <p className="text-[red] text-[14px] font-[400] absolute">
                {"Please Fill the Product Number"}
              </p>
            )} */}
          </div>

          <div className="w-full lg:w-[calc(50%-10px)] mb-3">
            <input
              className="input-without-icon"
              type="text"
              placeholder={t("productDescription")}
              onChange={(e) =>
                setListData({ ...listData, description: e.target.value })
              }
              value={listData?.description}
              // {...register("description")}
            />
            {/* {!listData?.description && (
              <p className="text-[red] text-[14px] font-[400] absolute">
                {"Please Fill the Product Description"}
              </p>
            )} */}
          </div>
          <div className="w-full lg:w-[calc(50%-10px)] relative mb-3">
            <div className="flex flex-row pr-2">
              <div className="flex gap-5 w-[100%]">
                <input
                  className="input-without-icon"
                  type="number"
                  value={weight}
                  onChange={(e) => {
                    e.preventDefault();
                    setWeight(Number(e.target.value));
                  }}
                  placeholder={t("enterWeightInKG")}
                />
                <div className="flex gap-2 ">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      increaseWeight();
                    }}
                    className="text-black font-bold cursor-pointer mt-1 text-[30px] hover:text-[#0072bb]"
                  >
                    <IoIosAddCircleOutline className="" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      decreaseWeight();
                    }}
                    disabled={weight <= 0.0}
                    className={`${
                      weight <= 0.0 ? "" : ""
                    } text-black font-bold cursor-pointer mt-1 text-[30px] hover:text-[#0072bb]`}
                  >
                    <AiOutlineMinusCircle className="" />
                  </button>
                </div>
              </div>
            </div>

            {/* {!weight && (
              <p className="text-[red] text-[14px] font-[400] absolute">
                {"Please Fill the Product Name"}
              </p>
            )} */}
          </div>
        </div>
        <div className="flex flex-col gap-7 md:flex-row justify-around mt-[60px] border-b pb-3 mb-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddMore();
            }}
            className={`button-text bg-[#0072BB] px-[20px] py-[6px] rounded-[8px] text-white uppercase ${
              !listData?.productName ? "cursor-not-allowed" : ""
            } 
           `}
            disabled={!listData?.productName}
          >
            {"add more"}
          </button>
          <div className="flex justify-around gap-10">
            <button
              onClick={(e) => {
                onSubmit(e, listData);
              }}
              className={`button-text cursor-pointer bg-[#0072BB] px-[20px] py-[6px] rounded-[8px] text-white uppercase  
              ${!listData?.description ? "" : ""}
              ${!listData?.productNumber ? "" : ""} 
              ${!listData?.productName ? "" : ""} 
              ${!weight ? "" : ""} `}
              disabled={listData?.length < 0 && !listData?.productName}
            >
              {"Save"}
            </button>
            <button
              onClick={(e) => {
                props.setIsCustomComponentOpen(false);
              }}
              className="button-text bg-[#0072BB] px-[20px] py-[6px] rounded-[8px] text-white uppercase"
            >
              {"cancel"}
            </button>
          </div>
        </div>
      </div>
      <div className="max-h-[50%] overflow-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 ">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
              >
                {t("productNo")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
              >
                Product Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
              >
                {t("descriptionName")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
              >
                {t("weightInKG")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
              >
                {/* {t("weightInKG")} */}
              </th>
            </tr>
          </thead>

          <tbody className=" border-b border-b-[#CCCCCC]">
            {addMoreList?.length > 0 &&
              addMoreList?.map((item, index) => (
                <tr className="odd:bg-white even:bg-gray-100 odd:hover:bg-blue-200 even:hover:bg-blue-200 transition-colors duration-200 ease-in-out relative">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-black">
                    <p className="normal-text">
                      {item?.productNumber || "N/A"}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                    <p className="normal-text">
                      {item?.["productName"] || "N/A"}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                    <p className="normal-text">
                      {item?.["description"] || "N/A"}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                    <p className="normal-text">{item?.["kg"]}</p>
                  </td>
                  <td
                    onClick={() => handleDelete(index)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black cursor-pointer"
                  >
                    <AiOutlineDelete size={25} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomList;
