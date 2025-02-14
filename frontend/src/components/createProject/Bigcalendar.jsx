import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useParallaxController } from "react-scroll-parallax";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);
export default function Bigcalendar({
  handleSelect,
  eventsData,
  setSelectedEvent,
  handleEventClick,
}) {
  return (
    <div className="App">
      <Calendar
        views={["agenda", "month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        onSelectEvent={(event) => setSelectedEvent(event)}
        onSelectSlot={handleSelect}
        onSelecting={() => setSelectedEvent(null)}
        eventPropGetter={(event, start, end, isSelected) => {
          const backgroundColor = isSelected ? "#3174ad" : event.hexColor;
          const borderColor = event.hexColor;
          return { style: { backgroundColor, borderColor } };
        }}
        onDoubleClickEvent={handleEventClick}
        className="bg-white lg:w-[70vw] lg:h-[80vh] w-[80vw] h-[50vh] rounded-r-lg md:p-20 p-2 "
      />
    </div>
  );
}
