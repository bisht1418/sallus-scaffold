import React, { useState } from "react";
import RequiredPermits from "./RequiredPermits";
import { t } from "../utils/translate";

const RequiredPermitChecklist = (props) => {
  const [newItem, setNewItem] = useState("");

  const handleChange = (name, field) => {
    props.setRequiredPermit(
      props.requiredPermit.map((item) =>
        item.checkListName === name
          ? { ...item, yes: field === "yes", no: field === "no" }
          : item
      )
    );
  };

  const handleAddItem = () => {
    if (
      newItem.trim() &&
      !props.requiredPermit.some((item) => item.checkListName === newItem)
    ) {
      props.setRequiredPermit([
        ...props.requiredPermit,
        { checkListName: newItem, yes: false, no: false },
      ]);
      setNewItem("");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1 text-center">
        {t("typeOfWork")}
      </h1>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5  justify-start p-5">
        {props.requiredPermit.map((item) => (
          <RequiredPermits
            key={item.checkListName}
            item={item}
            handleChange={handleChange}
          />
        ))}
      </div>

      <div style={{ width: "max-content" }}>
        <label className="project-number w-full ">Add More</label>
        <div className="flex gap-5 justify-center requiredPermit-center">
          <input
            className="text-sm font-semibold !h-[40px] !p-3"
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={t("addNewTypeOfWork")}
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

export default RequiredPermitChecklist;
