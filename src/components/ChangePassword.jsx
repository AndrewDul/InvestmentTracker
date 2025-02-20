// src/components/ChangePassword.jsx
import React, { useState } from "react";
import { updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/style.css";

const ChangePassword = ({ user, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    try {
      // Zaloguj się ponownie z obecnym hasłem (bezpieczeństwo Firebase)
      await signInWithEmailAndPassword(auth, user.email, currentPassword);
      await updatePassword(auth.currentUser, newPassword);
      setSuccess("Password changed successfully!");
      setTimeout(() => onClose(), 2000); // Zamknij po 2 sekundach
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setError("Current password is incorrect.");
      } else {
        setError(`Error changing password: ${err.message}`);
      }
    }
  };

  return (
    <div className="form-card">
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn">
          Change Password
        </button>
        {success && <p className="success-message">{success}</p>}
        <button
          onClick={onClose}
          className="btn secondary"
          style={{ marginTop: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
