import React from "react";

const Summary = ({
  transactions,
  assets,
  selectedAsset,
  setSelectedAsset,
  currentPrice,
  setCurrentPrice,
}) => {
  const calculateSummary = () => {
    const filteredTransactions = selectedAsset
      ? transactions.filter((t) => t.investment === selectedAsset)
      : transactions;

    const totalInvested = filteredTransactions.reduce(
      (sum, t) => sum + t.amount * t.price,
      0
    );
    const totalFees = filteredTransactions.reduce((sum, t) => sum + t.fee, 0);
    let profitLoss = 0;

    if (currentPrice) {
      profitLoss = filteredTransactions.reduce(
        (sum, t) => sum + t.amount * (parseFloat(currentPrice) - t.price),
        0
      );
    }

    return { totalInvested, totalFees, profitLoss };
  };

  const { totalInvested, totalFees, profitLoss } = calculateSummary();

  return (
    <div className="summary-card">
      <h2>Summary</h2>
      <select
        value={selectedAsset}
        onChange={(e) => setSelectedAsset(e.target.value)}
      >
        <option value="">All Investments</option>
        {assets.map((asset) => (
          <option key={asset} value={asset}>
            {asset}
          </option>
        ))}
      </select>
      <p>
        <strong>Total Invested:</strong> ${totalInvested.toFixed(2)}
      </p>
      <p>
        <strong>Total Fees:</strong> ${totalFees.toFixed(2)}
      </p>
      <p>
        <strong>Profit/Loss:</strong> ${profitLoss.toFixed(2)}
      </p>
      <input
        type="number"
        placeholder="Current Price"
        value={currentPrice}
        onChange={(e) => setCurrentPrice(e.target.value)}
      />
    </div>
  );
};

export default Summary;
