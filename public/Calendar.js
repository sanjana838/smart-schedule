Calendar.js
import React, { useState } from "react";
import "./Calendar.css";

const academicEvents = [
  { date: "2026-01-01", title: "Commencement of Semester & Teaching – Learning", type: "academic" },

  { date: "2026-01-12", title: "Registration for Value Added Program (VAP)", type: "academic" },

  { date: "2026-02-03", title: "Display of Month 1 Attendance & Provisional Defaulter List", type: "academic" },

  { date: "2026-02-06", title: "Review – Seminar / CEP / Mini Project / BE Project", type: "review" },

  { date: "2026-02-16", title: "SE: CCE & TE & BE Unit Test-I Exam", type: "exam" },

  { date: "2026-02-23", title: "SPPU In-Sem Examination (Tentative)", type: "exam" },

  { date: "2026-03-02", title: "Display of Month 2 Attendance & Provisional Defaulter List", type: "academic" },

  { date: "2026-03-06", title: "Mid Semester Submission (SE, TE & BE)", type: "submission" },

  { date: "2026-03-13", title: "Review – Seminar / CEP / Internship / Mini Project / BE Project", type: "review" },

  { date: "2026-03-20", title: "Parents & Alumni Meet", type: "event" },

  { date: "2026-03-30", title: "National Conference on Cognitive Computing (NCCC-2026)", type: "event" },

  { date: "2026-04-06", title: "Display of Month 3 Attendance & Provisional Detention List", type: "academic" },

  { date: "2026-04-06", title: "Remedial Lectures / Repeat / Practice Practical Turns", type: "academic" },

  { date: "2026-04-13", title: "Review – Seminar / CEP / Internship / Mini Project / BE Project", type: "review" },

  { date: "2026-04-24", title: "End of Teaching (Theory & Practical)", type: "academic" },

  { date: "2026-04-24", title: "Display of Final Attendance / Provisional Detention List", type: "academic" },

  { date: "2026-04-27", title: "Prelim Theory Examination", type: "exam" },

  { date: "2026-05-08", title: "Display of Prelim Theory Exam Result", type: "exam" },

  { date: "2026-05-08", title: "Mock Practical & Final Submission", type: "submission" },

  { date: "2026-05-08", title: "Issue Term Grant Certificate", type: "academic" },

  { date: "2026-05-19", title: "Conclusion of Semester", type: "academic" },

  { date: "2026-05-20", title: "University Oral / Practical Examination (Tentative)", type: "exam" }
];


const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let calendarDays = [];

    // Day Names
    days.forEach(day => {
      calendarDays.push(
        <div key={day} className="day-name">
          {day}
        </div>
      );
    });

    // Empty Spaces
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={"empty" + i}></div>);
    }

    // Dates
    for (let day = 1; day <= lastDate; day++) {
      const fullDate = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      const event = academicEvents.find(e => e.date === fullDate);

      calendarDays.push(
        <div key={day} className="date">
          {day}
          {event && <div className="event">{event.title}</div>}
        </div>
      );
    }

    return calendarDays;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>Previous</button>
        <h2>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric"
          })}
        </h2>
        <button onClick={nextMonth}>Next</button>
      </div>

      <div className="calendar">{renderCalendar()}</div>
    </div>
  );
};

export default Calendar;