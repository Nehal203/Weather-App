// backend/server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();  // Load environment variables

const app = express();
const port = 5000;

// Enable CORS for React app
app.use(cors());
app.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Sample API endpoint to get daily summaries
app.get('/api/daily_summaries', (req, res) => {
    const query = 'SELECT * FROM daily_summaries';  // Use your actual table name
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query failed:', err);
            return res.status(500).json({ error: 'Database query failed.' });
        }
        res.json(results);
    });
});

// Sample API endpoint for fetching data from another table
app.get('/api/data', (req, res) => {
    db.query('SELECT * FROM your_table_name', (error, results) => { // Replace 'your_table_name' with actual table name
        if (error) return res.status(500).send(error);
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
