First.js
import React from "react";
import "./First.css";
import { useNavigate } from "react-router-dom";

function First() {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <div className="overlay"></div>

      <div className="content">
        <h1 className="project-title">
          Smart Schedule <span>Management System</span>
        </h1>

        <p className="subtitle">
          Organize • Manage • Simplify Academic Scheduling
        </p>

        <div className="button-container">
          <button
            className="btn admin-btn"
            onClick={() => navigate("/admin")}
          >
            👨‍💼 Admin View
          </button>

          <button
            className="btn timetable-btn"
            onClick={() => navigate("/timetable")}
          >
            📅 View Time Table
          </button>
           <a href="home.html">Teacher Panel</a>

          {/* ✅ NEW BUTTON ADDED */}
          <button
            className="btn academic-btn"
            onClick={() => navigate("/calendar")}
          >
            📘 Academic Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

export default First;