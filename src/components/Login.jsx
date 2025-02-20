// src/components/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { validateEmail } from "../utils/validation"; // Import z nowego pliku utils
import "../styles/style.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleLogin = async () => {
    setError("");
    setEmailError("");

    if (!email || !validateEmail(email)) {
      setEmailError("Enter a valid email (e.g., user@gmail.com)");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      console.log("Logged in successfully:", userCredential.user); // Debug
    } catch (err) {
      console.error("Login error:", err); // Debug
      if (err.code === "auth/user-not-found") {
        setError("User not found. Please register.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError(`Login failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="form-card">
      <h2>Login</h2>
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
      <button onClick={handleLogin} className="btn">
        Login
      </button>
    </div>
  );
};

export default Login;
