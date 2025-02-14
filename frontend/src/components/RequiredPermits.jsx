import React from "react";
import { t } from "../utils/translate";

const RequiredPermits = ({ item, handleChange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:pr-10 gap-2 safety-item p-2 rounded-md transition-all duration-200 ease-in-out">
      <div>
        <label className="project-number">
          {t(item.checkListName) || item.checkListName}
        </label>
      </div>
      <div className="flex justify-center items-center gap-3">
        <input
          type="radio"
          name={item.checkListName}
          value="Yes"
          checked={item.yes}
          onChange={() => handleChange(item.checkListName, "yes")}
        />{" "}
        Yes
        <input
          type="radio"
          name={item.checkListName}
          value="No"
          checked={item.no}
          onChange={() => handleChange(item.checkListName, "no")}
        />{" "}
        No
      </div>
    </div>
  );
};

export default RequiredPermits;
