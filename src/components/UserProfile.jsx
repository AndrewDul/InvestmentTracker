// src/components/UserProfile.jsx
import React, { useState } from "react";
import { updateProfile, updateEmail } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/style.css";

const UserProfile = ({
  user,
  setUser,
  setEditingProfile,
  setChangingPassword,
}) => {
  const [name, setName] = useState(user.displayName || "");
  const [email, setEmail] = useState(user.email || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError("File size must be less than 2 MB");
        setAvatarFile(null);
        return;
      }
      setError("");
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let photoURL = user.photoURL; // Zachowaj istniejący URL, jeśli nie ma nowego pliku
      if (avatarFile) {
        // Przesyłanie pliku do Firebase Storage
        const storageRef = ref(
          storage,
          `avatars/${user.uid}/${avatarFile.name}`
        );
        await uploadBytes(storageRef, avatarFile);
        photoURL = await getDownloadURL(storageRef); // Poprawny URL
        console.log("New photoURL:", photoURL); // Debug
      }

      // Aktualizacja profilu w Firebase Authentication
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL || "", // Pusty string, jeśli brak zdjęcia
      });

      // Aktualizacja e-maila, jeśli się zmienił
      if (email !== user.email) {
        await updateEmail(auth.currentUser, email);
      }

      // Aktualizacja danych w Firestore
      await updateDoc(doc(db, "users", user.uid), {
        displayName: name,
        email: email,
        photoURL: photoURL || "",
      });

      // Aktualizacja stanu użytkownika w aplikacji
      setUser({
        ...user,
        displayName: name,
        email: email,
        photoURL: photoURL || "",
      });
      console.log("Updated user object:", {
        displayName: name,
        email: email,
        photoURL: photoURL || "",
      }); // Debug
      setSuccess("Profile updated successfully!");
      setTimeout(() => setEditingProfile(false), 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(`Error updating profile: ${err.message}`);
    }
  };

  return (
    <div
      className="form-card"
      style={{ maxWidth: "400px", margin: "0 auto", width: "100%" }}
    >
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
        <label className="upload-label">
          <span className="browse-btn">Browse</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            className={error ? "error" : ""}
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn">
          Update Profile
        </button>
        <button
          onClick={() => setEditingProfile(false)}
          className="btn secondary"
          style={{ marginTop: "10px" }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setEditingProfile(false);
            setChangingPassword(true);
          }}
          className="btn"
          style={{ marginTop: "10px" }}
        >
          Change Password
        </button>
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default UserProfile;
