// src/components/AuthTabs.jsx
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../styles/style.css";

const AuthTabs = ({ setUser }) => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="container">
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
          onClick={() => setActiveTab("register")}
        >
          Registration
        </button>
      </div>
      {activeTab === "login" ? (
        <Login setUser={setUser} />
      ) : (
        <Register setUser={setUser} />
      )}
    </div>
  );
};

export default AuthTabs;
