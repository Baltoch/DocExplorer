import express, { json } from 'express';
import { createConnection } from 'mysql2';

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Connection
const db = createConnection({
  host: 'db',
  port: process.env.MYSQL_PORT || 3306,
  user: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD || 'password',
  database: 'docexplorer',
});

// Connect to MySQL
db.connect(err => {
    if (err) {
      throw err;
    }
    console.log('Connected to database as ID ' + db.threadId);
  });

// Middleware
app.use(json());

// Routes for jobs
// Get all jobs
app.get('/jobs', (req, res) => {
  const sql = 'SELECT * FROM jobs';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

// Get all jobs submited by a specific user
app.get('/jobs/:id', (req, res) => {
    const { userid } = req.params;
    const sql = `SELECT * FROM jobs WHERE userid = ?`;
    db.query(sql, userid, (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result);
    });
  });

// Get a specific job by ID
app.get('/jobs/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM jobs WHERE id = ?`;
  db.query(sql, id, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

// Create a new job
app.post('/jobs', (req, res) => {
  const { status, userid, result, images } = req.body;
  const sql = `INSERT INTO jobs (status, userid, result, images) VALUES (?, ?, ?, ?)`;
  db.query(sql, [status, userid, result, images], (err, result) => {
    if (err) {
      throw err;
    }
    res.send('Job created successfully');
  });
});

// Update a job
app.put('/jobs/:id', (req, res) => {
  const { id } = req.params;
  const { status, userid, result, images } = req.body;
  const sql = `UPDATE jobs SET status = ?, userid = ?, result = ?, images = ? WHERE id = ?`;
  db.query(sql, [status, userid, result, images, id], (err, result) => {
    if (err) {
      throw err;
    }
    res.send('Job updated successfully');
  });
});

// Delete a job
app.delete('/jobs/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM jobs WHERE id = ?`;
  db.query(sql, id, (err, result) => {
    if (err) {
      throw err;
    }
    res.send('Job deleted successfully');
  });
});

// Routes for users
// Get all users
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

// Get a specific user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM users WHERE id = ?`;
  db.query(sql, id, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

// Create a new user
app.post('/users', (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const sql = `INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`;
  db.query(sql, [first_name, last_name, email, password], (err, result) => {
    if (err) {
      throw err;
    }
    res.send('User created successfully');
  });
});

// Update a user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, password } = req.body;
  const sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? WHERE id = ?`;
  db.query(sql, [first_name, last_name, email, password, id], (err, result) => {
    if (err) {
      throw err;
    }
    res.send('User updated successfully');
  });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM users WHERE id = ?`;
  db.query(sql, id, (err, result) => {
    if (err) {
      throw err;
    }
    res.send('User deleted successfully');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
