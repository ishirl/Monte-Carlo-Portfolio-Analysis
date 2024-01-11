const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Create a database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'ishirlakhani@gmail.com',
  password: '',
  database: 'portfolio_backend'
});

// Connect to the database
db.connect(err => {
  if (err) throw err;
  console.log('Connected to database');
});

// API endpoint to add a stock
app.post('/add-stock', (req, res) => {
  const { name, amount, color } = req.body;
  const query = 'INSERT INTO stocks (name, amount, color) VALUES (?, ?, ?)';
  
  db.query(query, [name, amount, color], (err, result) => {
    if (err) {
      res.status(500).send('Error saving stock');
    } else {
      res.status(200).send('Stock saved successfully');
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
