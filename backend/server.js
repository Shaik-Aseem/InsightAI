import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: "https://insightai-wft0.onrender.com"
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Session setup
app.use(session({
  name: 'insightai_session',
  secret: 'aiml-placement-secret-key-12345',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Connect database
const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite Database at:', dbPath);
    initializeTables();
  }
});

// Init database
function initializeTables() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        college TEXT,
        branch TEXT,
        photo TEXT
      )
    `);

    // Datasets table
    db.run(`
      CREATE TABLE IF NOT EXISTS datasets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        file_name TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        rows_count INTEGER NOT NULL,
        cols_count INTEGER NOT NULL,
        data_json TEXT NOT NULL,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Activities table
    db.run(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Seed default user
    db.get('SELECT * FROM users WHERE email = ?', ['student@insightai.com'], (err, user) => {
      if (err) {
        console.error('Database selection error:', err);
        return;
      }
      if (!user) {
        const defaultPassword = '123456';
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(defaultPassword, salt);

        db.run(
          `INSERT INTO users (email, password, name, college, branch, photo) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            'student@insightai.com',
            hashedPassword,
            'John Doe',
            'XYZ Institute of Technology',
            'Computer Science (AIML)',
            null
          ],
          function (insertErr) {
            if (insertErr) {
              console.error('Failed to seed default user:', insertErr);
            } else {
              console.log('Seeded default student account: student@insightai.com / 123456');

              // Seed activity
              db.run(`INSERT INTO activities (user_id, action, details) VALUES (?, ?, ?)`, [
                1, 'Account Registered', 'Seeded default account registration'
              ]);
              db.run(`INSERT INTO activities (user_id, action, details) VALUES (?, ?, ?)`, [
                1, 'User Login', 'Initial automatic seeding session login'
              ]);
            }
          }
        );
      }
    });
  });
}

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized. Please log in first.' });
  }
  next();
};

// Auth APIs

// Signup
app.post('/api/auth/signup', (req, res) => {
  const { email, password, name, college, branch } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required.' });
  }

  // Check email
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database query error.' });
    if (user) return res.status(400).json({ error: 'Email is already registered.' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run(
      `INSERT INTO users (email, password, name, college, branch, photo) VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, name, college || '', branch || '', null],
      function (insertErr) {
        if (insertErr) return res.status(500).json({ error: 'Registration failed.' });

        const newUserId = this.lastID;
        req.session.userId = newUserId;

        db.run(`INSERT INTO activities (user_id, action, details) VALUES (?, ?, ?)`, [
          newUserId, 'Account Registered', 'Created user profile and signed up successfully'
        ]);

        return res.status(201).json({
          user: { id: newUserId, email, name, college, branch, photo: null }
        });
      }
    );
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database query error.' });
    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password.' });

    req.session.userId = user.id;

    db.run(`INSERT INTO activities (user_id, action, details) VALUES (?, ?, ?)`, [
      user.id, 'User Login', 'Logged in to InsightAI dashboard'
    ]);

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        college: user.college,
        branch: user.branch,
        photo: user.photo
      }
    });
  });
});

// Check user
app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) {
    return res.json({ user: null });
  }

  db.get('SELECT id, email, name, college, branch, photo FROM users WHERE id = ?', [req.session.userId], (err, user) => {
    if (err || !user) {
      req.session.destroy();
      return res.json({ user: null });
    }
    return res.json({ user });
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  const userId = req.session.userId;
  if (userId) {
    db.run(`INSERT INTO activities (user_id, action, details) VALUES (?, ?, ?)`, [
      userId, 'User Logout', 'Logged out of session'
    ]);
  }

  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed.' });
    res.clearCookie('insightai_session');
    return res.json({ success: true });
  });
});

// Profile APIs

// Update profile
app.put('/api/profile', requireAuth, (req, res) => {
  const { name, college, branch, email, photo } = req.body;
  const userId = req.session.userId;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  db.run(
    `UPDATE users SET name = ?, college = ?, branch = ?, email = ?, photo = ? WHERE id = ?`,
    [name, college, branch, email, photo || null, userId],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Email is already taken by another account.' });
        }
        return res.status(500).json({ error: 'Profile update failed.' });
      }

      db.run(`INSERT INTO activities (user_id, action, details) VALUES (?, ?, ?)`, [
        userId, 'Profile Updated', 'Modified user profile information and avatar'
      ]);

      return res.json({
        user: { id: userId, email, name, college, branch, photo }
      });
    }
  );
});

// Dataset APIs

// Upload dataset
app.post('/api/datasets', requireAuth, (req, res) => {
  const { file_name, file_size, rows_count, cols_count, data_json } = req.body;
  const userId = req.session.userId;

  if (!file_name || !data_json) {
    return res.status(400).json({ error: 'File name and dataset contents are required.' });
  }

  db.serialize(() => {
    db.run(
      `INSERT INTO datasets (user_id, file_name, file_size, rows_count, cols_count, data_json) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, file_name, file_size || 0, rows_count || 0, cols_count || 0, data_json],
      function (insertErr) {
        if (insertErr) return res.status(500).json({ error: 'Failed to save dataset metadata.' });

        const newDatasetId = this.lastID;

        db.run(`INSERT INTO activities (user_id, action, details) VALUES (?, ?, ?)`, [
          userId, 'Dataset Uploaded', `Uploaded file: ${file_name} (${rows_count} rows)`
        ]);

        // Keep only 5 datasets
        db.all(
          'SELECT id FROM datasets WHERE user_id = ? ORDER BY uploaded_at DESC',
          [userId],
          (selectErr, rows) => {
            if (selectErr) return;
            if (rows.length > 5) {
              const keepIds = rows.slice(0, 5).map(r => r.id);
              const placeholders = rows.map(() => '?').join(',');
              db.run(
                `DELETE FROM datasets WHERE user_id = ? AND id NOT IN (${placeholders})`,
                [userId, ...keepIds],
                function (deleteErr) {
                  if (!deleteErr) {
                    console.log(`Pruned old datasets for user ${userId}. Retaining only the latest 5.`);
                  }
                }
              );
            }
          }
        );

        return res.status(201).json({ id: newDatasetId, file_name });
      }
    );
  });
});

// Get datasets
app.get('/api/datasets', requireAuth, (req, res) => {
  const userId = req.session.userId;
  db.all(
    'SELECT id, file_name, file_size, rows_count, cols_count, uploaded_at FROM datasets WHERE user_id = ? ORDER BY uploaded_at DESC LIMIT 5',
    [userId],
    (err, datasets) => {
      if (err) return res.status(500).json({ error: 'Failed to query datasets.' });
      return res.json({ datasets });
    }
  );
});

// Load dataset
app.get('/api/datasets/:id', requireAuth, (req, res) => {
  const datasetId = req.params.id;
  const userId = req.session.userId;

  db.get(
    'SELECT * FROM datasets WHERE id = ? AND user_id = ?',
    [datasetId, userId],
    (err, dataset) => {
      if (err) return res.status(500).json({ error: 'Database query error.' });
      if (!dataset) return res.status(404).json({ error: 'Dataset not found.' });

      return res.json({ dataset });
    }
  );
});

// Delete dataset
app.delete('/api/datasets/:id', requireAuth, (req, res) => {
  const datasetId = req.params.id;
  const userId = req.session.userId;

  db.get('SELECT file_name FROM datasets WHERE id = ? AND user_id = ?', [datasetId, userId], (selectErr, dataset) => {
    if (selectErr || !dataset) {
      return res.status(404).json({ error: 'Dataset not found.' });
    }

    db.run('DELETE FROM datasets WHERE id = ? AND user_id = ?', [datasetId, userId], (err) => {
      if (err) return res.status(500).json({ error: 'Delete operation failed.' });

      return res.json({ success: true });
    });
  });
});

// Dashboard APIs

// Dashboard summary
app.get('/api/dashboard/summary', requireAuth, (req, res) => {
  const userId = req.session.userId;

  db.all(
    'SELECT action, details, timestamp FROM activities WHERE user_id = ? ORDER BY timestamp DESC LIMIT 6',
    [userId],
    (err, logs) => {
      if (err) return res.status(500).json({ error: 'Failed to query activities.' });

      db.all(
        "SELECT timestamp FROM activities WHERE user_id = ? AND action = 'User Login' ORDER BY timestamp DESC LIMIT 2",
        [userId],
        (loginErr, logins) => {
          let lastLoginTime = null;
          if (!loginErr && logins && logins.length > 0) {
            lastLoginTime = logins.length > 1 ? logins[1].timestamp : logins[0].timestamp;
          }

          db.get(
            'SELECT file_name, uploaded_at FROM datasets WHERE user_id = ? ORDER BY uploaded_at DESC LIMIT 1',
            [userId],
            (dsErr, lastDataset) => {
              return res.json({
                recentActivities: logs,
                lastLogin: lastLoginTime,
                lastDatasetUsed: lastDataset ? lastDataset.file_name : 'Default Samples'
              });
            }
          );
        }
      );
    }
  );
});

// Profile stats
app.get('/api/profile/stats', requireAuth, (req, res) => {
  const userId = req.session.userId;

  db.get('SELECT id, email, name, college, branch, photo FROM users WHERE id = ?', [userId], (userErr, user) => {
    if (userErr || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.get('SELECT timestamp FROM activities WHERE user_id = ? AND action = ? ORDER BY timestamp ASC LIMIT 1', [userId, 'Account Registered'], (err1, regAct) => {
      const regTime = regAct ? regAct.timestamp : '2026-07-04T12:00:00.000Z';

      db.all("SELECT timestamp FROM activities WHERE user_id = ? AND action = 'User Login' ORDER BY timestamp DESC LIMIT 2", [userId], (err2, logins) => {
        const loginTime = logins && logins.length > 0 ? logins[0].timestamp : new Date().toISOString();

        db.get('SELECT COUNT(*) as cnt FROM datasets WHERE user_id = ?', [userId], (err3, dsCount) => {
          db.get("SELECT COUNT(*) as cnt FROM activities WHERE user_id = ? AND action = 'Report Exported'", [userId], (err4, repCount) => {
            res.json({
              accountCreated: regTime,
              lastLogin: loginTime,
              datasetsUploaded: dsCount ? dsCount.cnt : 0,
              reportsGenerated: repCount ? repCount.cnt : 0
            });
          });
        });
      });
    });
  });
});

// Log activity
app.post('/api/activities', requireAuth, (req, res) => {
  const { action, details } = req.body;
  const userId = req.session.userId;
  if (!action || !details) {
    return res.status(400).json({ error: 'Action and details are required' });
  }
  db.run('INSERT INTO activities (user_id, action, details) VALUES (?, ?, ?)', [userId, action, details], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to insert activity' });
    return res.json({ success: true });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express server successfully running on: http://localhost:${PORT}`);
});
