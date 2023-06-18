require('dotenv').config();
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

// Check if the current process is the master process
if (cluster.isMaster) {
  // Fork worker processes based on the environment variable config or the number of CPUs, whichever is less
  let numWorkers = process.env.WORKER_THREADS > numCPUs ? numCPUs : process.env.WORKER_THREADS;
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  // Log when a worker process is online
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  // Log if a worker process exits
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
    // Restart the worker process
    cluster.fork();
  });
} else {
  // Create a new express application instance
  const app = express();

  // The port the express app will listen on
  const port = process.env.SERVER_PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());

  // Create a shared MySQL connection
  const sharedConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  // Connect to MySQL
  sharedConnection.connect((err) => {
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
    // Use the shared MySQL connection for database operations
    sharedConnection.query('SELECT * FROM your_table', (err, results) => {
      if (err) {
        console.error('Error executing MySQL query', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.send('Hello, Welcome to our social media site!');
    });
  });

  // Serve the application at the given port
  app.listen(port, () => {
    console.log(`Worker ${process.pid} is running and listening on port ${port}`);
  });
}
