import { useState } from "react";
import Header from "./Header";
import type { Entry } from "../types/Entry";
import { dummyEntries } from "../types/Entry";
import EntryModal from "./EntryModal";

const View = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

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

  // Get the first day of the current month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  // Get the last day of the current month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const startingDayIndex = firstDayOfMonth.getDay();
  // Get the total number of days in the month
  const totalDays = lastDayOfMonth.getDate();

  // Calculate the number of days from the next month to show
  const remainingDays = 42 - (startingDayIndex + totalDays); // 42 = 6 rows × 7 days

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  // Get entry for a specific day
  const getEntry = (day: number): Entry | undefined => {
    const dateString = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];

    return dummyEntries.find((entry) => entry.date === dateString);
  };

  const handleDayClick = (day: number) => {
    const entry = getEntry(day);
    if (entry) {
      setSelectedEntry(entry);
    }
  };

  return (
    <>
      <Header />
      <div className="content-container">
        <div className="calendar-container">
          <div className="calendar-header">
            <div className="header-left">
              <h2>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="arrow-buttons">
                <button className="arrow-btn" onClick={handlePrevMonth}>
                  ←
                </button>
                <button className="arrow-btn" onClick={handleNextMonth}>
                  →
                </button>
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
              {Array.from({ length: startingDayIndex }, (_, i) => (
                <div key={`prev-${i}`} className="calendar-day empty"></div>
              ))}

              {Array.from({ length: totalDays }, (_, i) => {
                const day = i + 1;
                const entry = getEntry(day);
                const dayOfWeek = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                ).getDay();

                return (
                  <div
                    key={day}
                    className={`calendar-day ${
                      entry ? "has-entry clickable" : ""
                    }`}
                    onClick={() => entry && handleDayClick(day)}
                    style={{ gridColumn: dayOfWeek + 1 }}
                  >
                    {day}
                  </div>
                );
              })}

              {Array.from({ length: remainingDays }, (_, i) => (
                <div key={`next-${i}`} className="calendar-day empty"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {selectedEntry && (
        <EntryModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </>
  );
};

export default View;
