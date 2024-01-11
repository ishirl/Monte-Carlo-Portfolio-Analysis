import React, { useState } from 'react';
import PieChart from './PieChart';
import InputForm from './InputForm';
import StockList from './StockList';
import './App.css';


function App() {
  const [stocks, setStocks] = useState([]);

  const addStock = (stock) => {
    setStocks([...stocks, stock]);
  };

  const handleAddStockState = (newStock) => {
    setStocks((prevStocks) => [...prevStocks, newStock]);
  };
  
  const deleteStock = (stockName) => {
    setStocks(stocks.filter(stock => stock.name !== stockName));
  };

  const editStock = (updatedStock) => {
    setStocks(stocks.map(stock => stock.name === updatedStock.name ? updatedStock : stock));
  };

  return (
    <div className="appContainer">
      <PieChart key={stocks.length} stocks={stocks} />
      <InputForm onAddStock={addStock} onAddStockState={handleAddStockState} />
      <StockList stocks={stocks} onDelete={deleteStock} onEdit={editStock} />
    </div>
  );
}

export default App;
