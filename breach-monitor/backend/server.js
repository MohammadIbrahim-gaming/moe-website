import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import fetch from 'node-fetch';
import crypto from 'node:crypto';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./breach_monitor.db');

// Promisify database methods
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

// Initialize database schema
async function initDatabase() {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS monitored_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_checked DATETIME,
      breach_count INTEGER DEFAULT 0,
      risk_score INTEGER DEFAULT 0,
      UNIQUE(type, value)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS breach_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      monitored_item_id INTEGER,
      breach_name TEXT NOT NULL,
      breach_date TEXT,
      exposed_data TEXT,
      discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (monitored_item_id) REFERENCES monitored_items(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      monitored_item_id INTEGER,
      alert_type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      read BOOLEAN DEFAULT 0,
      FOREIGN KEY (monitored_item_id) REFERENCES monitored_items(id)
    )
  `);
}

// Note: Hash function removed as we're using the breachedaccount API directly
// The password API uses k-anonymity, but the breach API doesn't require it

// Check breach using Have I Been Pwned API
async function checkBreach(value, type) {
  try {
    if (type === 'email' || type === 'username') {
      // Use Have I Been Pwned API v3 for breach checking
      const headers = {
        'User-Agent': 'BreachMonitor/1.0'
      };
      
      // Add API key if available (improves rate limits)
      if (process.env.HIBP_API_KEY) {
        headers['hibp-api-key'] = process.env.HIBP_API_KEY;
      }

      const breachResponse = await fetch(
        `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(value)}`,
        { headers }
      );

      if (breachResponse.status === 200) {
        const breaches = await breachResponse.json();
        return { breached: true, breaches: breaches };
      } else if (breachResponse.status === 404) {
        return { breached: false, breaches: [] };
      } else if (breachResponse.status === 429) {
        // Rate limited
        return { breached: false, breaches: [], error: 'Rate limited. Please try again later or add an API key.' };
      } else {
        return { breached: false, breaches: [], error: `API returned status ${breachResponse.status}` };
      }
    } else if (type === 'phone') {
      // Phone number checking (simplified - HIBP doesn't have phone API)
      // In production, you'd use a specialized service
      return { breached: false, breaches: [], note: 'Phone number checking requires specialized service' };
    }

    return { breached: false, breaches: [] };
  } catch (error) {
    console.error('Error checking breach:', error);
    return { breached: false, breaches: [], error: error.message };
  }
}

// Calculate risk score based on breach data
function calculateRiskScore(breaches) {
  if (!breaches || breaches.length === 0) return 0;

  let score = 0;
  const severityWeights = {
    'Sensitive': 30,
    'Financial': 25,
    'Personal': 15,
    'Credentials': 20,
    'Other': 10
  };

  breaches.forEach(breach => {
    const dataClasses = breach.DataClasses || [];
    let breachScore = 10; // Base score per breach

    dataClasses.forEach(dataClass => {
      if (dataClass.includes('Passwords') || dataClass.includes('Credentials')) {
        breachScore += severityWeights['Credentials'];
      } else if (dataClass.includes('Credit') || dataClass.includes('Bank')) {
        breachScore += severityWeights['Financial'];
      } else if (dataClass.includes('Email') || dataClass.includes('Names')) {
        breachScore += severityWeights['Personal'];
      }
    });

    // Recent breaches are more concerning
    if (breach.BreachDate) {
      const breachDate = new Date(breach.BreachDate);
      const yearsAgo = (new Date() - breachDate) / (1000 * 60 * 60 * 24 * 365);
      if (yearsAgo < 1) breachScore *= 1.5;
      else if (yearsAgo < 3) breachScore *= 1.2;
    }

    score += breachScore;
  });

  return Math.min(100, Math.round(score));
}

// Generate security recommendations
function generateRecommendations(breaches, riskScore) {
  const recommendations = [];

  if (riskScore === 0) {
    recommendations.push({
      priority: 'low',
      title: 'No breaches found',
      description: 'Your information appears safe. Continue practicing good security habits.'
    });
    return recommendations;
  }

  if (riskScore >= 70) {
    recommendations.push({
      priority: 'critical',
      title: 'Immediate action required',
      description: 'Your accounts are at high risk. Change all passwords immediately.'
    });
  }

  const hasPasswordBreach = breaches.some(b => 
    (b.DataClasses || []).some(dc => dc.includes('Passwords') || dc.includes('Credentials'))
  );

  if (hasPasswordBreach) {
    recommendations.push({
      priority: 'high',
      title: 'Change compromised passwords',
      description: 'Passwords from these breaches may be exposed. Use unique, strong passwords for each account.'
    });
    recommendations.push({
      priority: 'high',
      title: 'Enable two-factor authentication',
      description: 'Add an extra layer of security to all your accounts, especially those involved in breaches.'
    });
  }

  const hasFinancialBreach = breaches.some(b =>
    (b.DataClasses || []).some(dc => dc.includes('Credit') || dc.includes('Bank'))
  );

  if (hasFinancialBreach) {
    recommendations.push({
      priority: 'high',
      title: 'Monitor financial accounts',
      description: 'Review bank and credit card statements regularly for unauthorized activity.'
    });
  }

  recommendations.push({
    priority: 'medium',
    title: 'Use a password manager',
    description: 'Generate and store unique passwords for each account to prevent credential reuse.'
  });

  recommendations.push({
    priority: 'medium',
    title: 'Enable breach monitoring',
    description: 'Set up ongoing monitoring to receive alerts when new breaches occur.'
  });

  return recommendations;
}

// API Routes

// Check if email/username/phone is breached
app.post('/api/check', async (req, res) => {
  try {
    const { type, value } = req.body;

    if (!type || !value) {
      return res.status(400).json({ error: 'Type and value are required' });
    }

    if (!['email', 'username', 'phone'].includes(type)) {
      return res.status(400).json({ error: 'Type must be email, username, or phone' });
    }

    const result = await checkBreach(value, type);
    const breaches = result.breaches || [];
    const riskScore = calculateRiskScore(breaches);
    const recommendations = generateRecommendations(breaches, riskScore);

    // Store or update monitored item
    const existing = await dbGet(
      'SELECT * FROM monitored_items WHERE type = ? AND value = ?',
      [type, value]
    );

    if (existing) {
      await dbRun(
        'UPDATE monitored_items SET last_checked = CURRENT_TIMESTAMP, breach_count = ?, risk_score = ? WHERE id = ?',
        [breaches.length, riskScore, existing.id]
      );

      // Check for new breaches
      const existingBreaches = await dbAll(
        'SELECT breach_name FROM breach_history WHERE monitored_item_id = ?',
        [existing.id]
      );
      const existingNames = new Set(existingBreaches.map(b => b.breach_name));

      for (const breach of breaches) {
        if (!existingNames.has(breach.Name)) {
          // New breach detected - create alert
          await dbRun(
            'INSERT INTO breach_history (monitored_item_id, breach_name, breach_date, exposed_data) VALUES (?, ?, ?, ?)',
            [existing.id, breach.Name, breach.BreachDate, (breach.DataClasses || []).join(', ')]
          );
          await dbRun(
            'INSERT INTO alerts (monitored_item_id, alert_type, message) VALUES (?, ?, ?)',
            [existing.id, 'new_breach', `New breach detected: ${breach.Name}`]
          );
        }
      }
    } else {
      const insertResult = await dbRun(
        'INSERT INTO monitored_items (type, value, last_checked, breach_count, risk_score) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?)',
        [type, value, breaches.length, riskScore]
      );

      const newItem = await dbGet(
        'SELECT * FROM monitored_items WHERE id = ?',
        [insertResult.lastID]
      );

      // Store breach history
      for (const breach of breaches) {
        await dbRun(
          'INSERT INTO breach_history (monitored_item_id, breach_name, breach_date, exposed_data) VALUES (?, ?, ?, ?)',
          [newItem.id, breach.Name, breach.BreachDate, (breach.DataClasses || []).join(', ')]
        );
      }
    }

    res.json({
      breached: result.breached,
      breaches: breaches,
      riskScore: riskScore,
      recommendations: recommendations
    });
  } catch (error) {
    console.error('Error in /api/check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get monitored items
app.get('/api/monitored', async (req, res) => {
  try {
    const items = await dbAll('SELECT * FROM monitored_items ORDER BY created_at DESC');
    res.json(items);
  } catch (error) {
    console.error('Error in /api/monitored:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get breach history for a monitored item
app.get('/api/breaches/:id', async (req, res) => {
  try {
    const breaches = await dbAll(
      'SELECT * FROM breach_history WHERE monitored_item_id = ? ORDER BY discovered_at DESC',
      [req.params.id]
    );
    res.json(breaches);
  } catch (error) {
    console.error('Error in /api/breaches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await dbAll(
      `SELECT a.*, m.type, m.value 
       FROM alerts a 
       JOIN monitored_items m ON a.monitored_item_id = m.id 
       ORDER BY a.created_at DESC 
       LIMIT 50`
    );
    res.json(alerts);
  } catch (error) {
    console.error('Error in /api/alerts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark alert as read
app.put('/api/alerts/:id/read', async (req, res) => {
  try {
    await dbRun('UPDATE alerts SET read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error in /api/alerts/:id/read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete monitored item
app.delete('/api/monitored/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM monitored_items WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error in /api/monitored/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Breach Monitor Backend running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
