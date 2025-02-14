import React, { useRef, useEffect, useState } from "react";
import Flatpickr from "flatpickr";
import { t } from "../utils/translate";

const DateRangePicker = ({ onDateRangeChange, dateRange }) => {
  const startRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    const startPicker = Flatpickr(startRef.current, {
      onChange: function (selectedDates) {
        endPicker.set("minDate", selectedDates[0]);
      },
    });

    const endPicker = Flatpickr(endRef.current, {
      onChange: function (selectedDates) {
        startPicker.set("maxDate", selectedDates[0]);
        onDateRangeChange(
          startPicker.selectedDates[0],
          endPicker.selectedDates[0]
        );
      },
    });
    return () => {
      startPicker.destroy();
      endPicker.destroy();
    };
  }, [dateRange?.start, dateRange?.end]);

  return (
    <div date-rangepicker className="flex ml-4">
      <div className="relative flex justify-center items-center">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </div>
        <input
          name="start"
          type="text"
          ref={startRef}
          className="bg-white !border !border-black  !outline-unset text-gray-900 text-sm rounded-lg block w-full ps-10 p-2 "
          placeholder={t("start_date")}
        />
      </div>
      <span className="mx-4 text-black  m-auto">to</span>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </div>
        <input
          name="end"
          type="text"
          ref={endRef}
          className="bg-white !border !border-black !outline-unset text-gray-900 text-sm rounded-lg block w-full ps-10 p-2 "
          placeholder={t("end_date")}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
