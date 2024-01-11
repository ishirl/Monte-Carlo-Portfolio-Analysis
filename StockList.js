import React from 'react';

const StockList = ({ stocks, onDelete, onEdit }) => {
  return (
    <ul>
      {stocks.map(stock => (
        <li key={stock.name}>
          {stock.name} - {stock.amount}
          <button onClick={() => onDelete(stock.name)}>Delete</button>
          <button onClick={() => onEdit(stock)}>Edit</button>
        </li>
      ))}
    </ul>
  );
};

export default StockList;
