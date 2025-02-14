import React, { useState } from "react";
import SafetyItems from "./SafetyItems";
import { t } from "../utils/translate";

const SafetyChecklist = (props) => {
  const [newItem, setNewItem] = useState("");

  const handleChange = (name, field) => {
    props.setItems(
      props.items.map((item) =>
        item.checkListName === name
          ? {
              ...item,
              yes: field === "yes",
              na: field === "na",
              no: field === "no",
            }
          : item
      )
    );
  };

  const handleAddItem = () => {
    if (
      newItem.trim() &&
      !props.items.some((item) => item.checkListName === newItem)
    ) {
      props.setItems([
        ...props.items,
        { checkListName: newItem, yes: false, na: false, no: false },
      ]);
      setNewItem("");
    }
  };

  return (
    <div className="">
      <h1 className="text-xl font-semibold mb-1 text-center">
        {t("protectiveEquipment")}
      </h1>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5  justify-start p-5">
        {props.items.map((item) => (
          <SafetyItems
            key={item.checkListName}
            item={item}
            handleChange={handleChange}
          />
        ))}
      </div>

      <div className="w-1/2">
        <div className="">
          <label className="project-number w-full ">Add More</label>
        </div>

        <div className="flex gap-5 justify-center items-center">
          <input
            className="text-sm font-semibold !h-[40px] !p-3"
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={t("addNewProtectiveEquipment")}
          />
          <button
            className=" px-4 py-2 border bg-[#0081c8] text-white rounded-lg font-semibold text-nowrap"
            onClick={(e) => {
              e.preventDefault();
              handleAddItem();
            }}
          >
            {t("add")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafetyChecklist;
