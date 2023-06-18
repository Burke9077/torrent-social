require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

// Create a new express application instance
const app = express();

// The port the express app will listen on
const port = process.env.SERVER_PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Connect to MySQL
connection.connect((err) => {
  // Log any errors to the console
  if (err) {
    console.error('Error connecting to the database', err);
    return;
  }
  console.log('Connected to the MySQL server');

  // If the error is fatal, exit the process
  if (err && typeof err === 'object' && err.hasOwnProperty('fatal') && err.fatal === true) {
    console.error('Fatal error occurred, exiting process');
    process.exit(1);
  }
});

// Sample endpoint
app.get('/', (req, res) => {
  res.send('Hello, Welcome to our social media site!');
});

// Serve the application at the given port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
