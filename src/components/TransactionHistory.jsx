import React from "react";

const TransactionHistory = ({
  transactions,
  setTransactions,
  selectedAsset,
}) => {
  const deleteTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  const filteredTransactions = selectedAsset
    ? transactions.filter((t) => t.investment === selectedAsset)
    : transactions;

  return (
    <div className="history-card">
      <h2>Transaction History</h2>
      <ul>
        {filteredTransactions.map((t, index) => (
          <li key={index} className="history-item">
            <span className="date">{t.date}</span>
            <span className="investment-name">
              {t.investment.toUpperCase()}
            </span>
            <span className="amount">{t.amount}</span>
            <span className="price">${t.price.toFixed(2)}</span>
            <button
              className="delete-btn"
              onClick={() => deleteTransaction(index)}
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
