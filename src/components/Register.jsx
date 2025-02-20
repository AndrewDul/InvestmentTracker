// src/components/Register.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { validateEmail } from "../utils/validation"; // Import z nowego pliku utils
import "../styles/style.css";

const Register = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Enter a valid email (e.g., user@gmail.com)");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use. Please log in.");
      } else {
        setError("Registration failed. Try again.");
      }
    }
  };

  return (
    <div className="form-card">
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={emailError ? "error" : ""}
      />
      {emailError && <p className="error-message">{emailError}</p>}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleRegister} className="btn">
        Register
      </button>
    </div>
  );
};

export default Register;
