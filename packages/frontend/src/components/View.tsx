import { useState } from "react";
import { Link } from "react-router-dom";

const View = () => {
  const [currentDate] = useState(new Date());

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Example data - replace with actual data from your backend
  const hasEntry = (day: number) => day === 11; // Example: day 11 has an entry

  return (
    <div className="content-container">
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="header-left">
            <h2>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="arrow-buttons">
              <button className="arrow-btn">←</button>
              <button className="arrow-btn">→</button>
            </div>
          </div>
          <div className="calendar-legend">
            <span className="legend-item">
              <span className="legend-color less"></span>
              <span>No Entry</span>
            </span>
            <span className="legend-item">
              <span className="legend-color more"></span>
              <span>Entry</span>
            </span>
          </div>
        </div>
        <div className="calendar">
          <div className="weekdays">
            {weekdays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i + 1;
              return hasEntry(day) ? (
                <Link to={`/entry/${day}`} key={day}>
                  <div className="calendar-day has-entry">{day}</div>
                </Link>
              ) : (
                <div key={day} className="calendar-day">
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
