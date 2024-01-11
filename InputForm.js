import React, { useState } from 'react';

const InputForm = ({ onAddStock, onAddStockState }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStock = { name, amount: Number(amount), color: getRandomColor() };
  
    fetch('http://localhost:3001/add-stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStock),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      onAddStockState(newStock);
      console.log('Success:', data);
      // Reset the input form fields only after a successful POST request
      setName('');
      setAmount(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      // Inform the user of the failure
      alert('Failed to add stock. Please try again.');
    });
  };
  
  


  const getRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Stock Name" />
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
      <button type="submit">Add Stock</button>
    </form>
  );
};

export default InputForm;
