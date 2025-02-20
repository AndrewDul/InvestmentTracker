// src/components/TransactionForm.jsx
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const TransactionForm = ({
  transactions,
  setTransactions,
  assets,
  setAssets,
  user,
}) => {
  const [investment, setInvestment] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [fee, setFee] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let newErrors = {};

    if (!investment || /\d/.test(investment)) {
      newErrors.investment = "Enter a valid name (no numbers)";
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = "Enter a valid positive number";
    }

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      newErrors.price = "Enter a valid positive number";
    }

    if (!fee || isNaN(fee) || parseFloat(fee) < 0) {
      newErrors.fee = "Enter a valid non-negative number";
    }

    if (!date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addTransaction = async () => {
    if (!validateFields()) return;

    const formattedInvestment = investment.toUpperCase();
    const newTransaction = {
      investment: formattedInvestment,
      amount: parseFloat(amount),
      price: parseFloat(price),
      fee: parseFloat(fee),
      date,
    };

    const docRef = await addDoc(
      collection(db, `users/${user.uid}/transactions`),
      newTransaction
    );
    const updatedTransactions = [
      ...transactions,
      { id: docRef.id, ...newTransaction },
    ];
    setTransactions(updatedTransactions);

    if (!assets.includes(formattedInvestment)) {
      const updatedAssets = [...assets, formattedInvestment];
      setAssets(updatedAssets);
    }

    setInvestment("");
    setAmount("");
    setPrice("");
    setFee("");
    setDate("");
    setErrors({});
  };

  return (
    <div className="form-card">
      <h2>Add Transaction</h2>
      <input
        className={errors.investment ? "error" : ""}
        placeholder="Investment Name"
        value={investment}
        onChange={(e) => setInvestment(e.target.value)}
      />
      {errors.investment && (
        <p className="error-message">{errors.investment}</p>
      )}
      <input
        className={errors.amount ? "error" : ""}
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      {errors.amount && <p className="error-message">{errors.amount}</p>}
      <input
        className={errors.price ? "error" : ""}
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      {errors.price && <p className="error-message">{errors.price}</p>}
      <input
        className={errors.fee ? "error" : ""}
        type="text"
        placeholder="Fee"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
      />
      {errors.fee && <p className="error-message">{errors.fee}</p>}
      <input
        className={errors.date ? "error" : ""}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      {errors.date && <p className="error-message">{errors.date}</p>}
      <button onClick={addTransaction} className="btn">
        Add Transaction
      </button>
    </div>
  );
};

export default TransactionForm;
