import express, { json } from 'express';
import { createConnection } from 'mysql2';
import files from './routes/files.js'
import jobs from './routes/jobs.js';
import users from './routes/users.js';
import ocr from './routes/ocr.js';

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

app.use('/files', files);
app.use('/jobs', jobs(db));
app.use('/users', users(db));
app.use('/ocr', ocr(db));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
