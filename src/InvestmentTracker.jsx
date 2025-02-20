// src/InvestmentTracker.jsx
import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import TransactionForm from "./components/TransactionForm";
import Summary from "./components/Summary";
import TransactionHistory from "./components/TransactionHistory";
import AuthTabs from "./components/AuthTabs";
import UserProfile from "./components/UserProfile";
import ChangePassword from "./components/ChangePassword";
import "./styles/style.css";

const InvestmentTracker = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchTransactions = async () => {
        try {
          const querySnapshot = await getDocs(
            collection(db, `users/${user.uid}/transactions`)
          );
          const fetchedTransactions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTransactions(fetchedTransactions);
          const uniqueAssets = [
            ...new Set(fetchedTransactions.map((t) => t.investment)),
          ];
          setAssets(uniqueAssets);
        } catch (err) {
          console.error("Error fetching transactions:", err);
        }
      };
      fetchTransactions();
    }
  }, [user]);

  if (!user) {
    return <AuthTabs setUser={setUser} />;
  }

  if (editingProfile) {
    return (
      <UserProfile
        user={user}
        setUser={setUser}
        setEditingProfile={setEditingProfile}
        setChangingPassword={setChangingPassword}
      />
    );
  }

  if (changingPassword) {
    return (
      <ChangePassword user={user} onClose={() => setChangingPassword(false)} />
    );
  }

  return (
    <div className="container">
      <div
        className="user-info"
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <div
          className="avatar"
          onClick={() => setEditingProfile(true)}
          title="Edit Profile"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundImage: user.photoURL ? `url(${user.photoURL})` : "none",
            backgroundColor: !user.photoURL ? "#60616f" : "transparent",
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
          }}
        />
        <span className="user-name">{user.displayName || user.email}</span>
      </div>
      <h1 className="title">InvTrack</h1>
      <TransactionForm
        transactions={transactions}
        setTransactions={setTransactions}
        assets={assets}
        setAssets={setAssets}
        user={user}
      />
      <Summary
        transactions={transactions}
        assets={assets}
        selectedAsset={selectedAsset}
        setSelectedAsset={setSelectedAsset}
        currentPrice={currentPrice}
        setCurrentPrice={setCurrentPrice}
      />
      <TransactionHistory
        transactions={transactions}
        setTransactions={setTransactions}
        selectedAsset={selectedAsset}
      />
      <button
        onClick={async () => {
          await Promise.all(
            transactions.map((t) =>
              deleteDoc(doc(db, `users/${user.uid}/transactions`, t.id))
            )
          );
          setTransactions([]);
        }}
        className="btn danger"
      >
        Clear History
      </button>
    </div>
  );
};

export default InvestmentTracker;
