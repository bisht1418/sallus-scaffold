import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useParallaxController } from "react-scroll-parallax";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios"; // Import Axios
import {
  projectCalendarService,
  projectPostCalendarService,
} from "../../Services/projectService";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);
export default function Bigcalendar() {
  const [eventsData, setEventsData] = useState([]);
  useEffect(() => {
    fetchEventsData();
  }, []);

  const id = useParams();
  const projectId = id?.id;
  const userId = useSelector((state) => state?.auth?.loggedInUser?._id);

  const fetchEventsData = async () => {
    const response = await projectCalendarService(projectId, userId);
    setEventsData(response);
  };

  const handleSelect = async ({ start, end }) => {
    const title = window.prompt("Add notes");
    if (title) {
      const newEventData = {
        start,
        end,
        title,
        projectId,
        userId,
      };

      try {
        const response = await projectPostCalendarService(newEventData);
        if (response) {
          setEventsData([...eventsData, response?.data]);
          fetchEventsData();
        } else {
          return "Failed to add event";
        }
      } catch (error) {
        return error;
      }
    }
  };
  const navigate = useNavigate();
  const handelBack = () => {
    navigate("/project");
  };

  return (
    <div className="App">
      <Calendar
        views={["agenda", "month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        style={{ height: "70vh" }}
        onSelectEvent={(event) => alert(event?.title)}
        onSelectSlot={handleSelect}
        startAccessor="start"
        endAccessor="end"
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handelBack}
      >
        Go Back
      </button>
    </div>
  );
}
