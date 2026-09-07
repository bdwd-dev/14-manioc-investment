const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

function loadDB() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
  catch { return { projects: [], investors: [], transactions: [], stages: [] }; }
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'manioc-investment', version: '1.0.0' });
});

// Stats
app.get('/api/stats', (req, res) => {
  const db = loadDB();
  const totalInvestments = db.transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  res.json({
    projects: db.projects.length,
    investors: db.investors.length,
    transactions: db.transactions.length,
    totalInvestments
  });
});

// Projects
app.get('/api/projects', (req, res) => {
  const db = loadDB();
  res.json(db.projects);
});

app.post('/api/projects', (req, res) => {
  const db = loadDB();
  const project = { id: Date.now(), ...req.body, created_at: new Date().toISOString() };
  db.projects.push(project);
  saveDB(db);
  res.json(project);
});

// Investors
app.get('/api/investors', (req, res) => {
  const db = loadDB();
  res.json(db.investors);
});

app.post('/api/investors', (req, res) => {
  const db = loadDB();
  const investor = { id: Date.now(), ...req.body, created_at: new Date().toISOString() };
  db.investors.push(investor);
  saveDB(db);
  res.json(investor);
});

// Transactions (investments)
app.post('/api/transactions', (req, res) => {
  const db = loadDB();
  const tx = {
    id: Date.now(),
    investor_id: req.body.investor_id,
    project_id: req.body.project_id,
    amount: req.body.amount,
    share_percentage: req.body.share_percentage,
    stage: req.body.stage,
    status: 'confirmed',
    created_at: new Date().toISOString()
  };
  db.transactions.push(tx);
  saveDB(db);
  res.json(tx);
});

// Stages (étapes du chantier)
app.get('/api/stages', (req, res) => {
  const db = loadDB();
  res.json(db.stages);
});

app.post('/api/stages/:id/pay', (req, res) => {
  const db = loadDB();
  const stage = db.stages.find(s => s.id == req.params.id);
  if (!stage) return res.status(404).json({ error: 'Étape non trouvée' });
  stage.paid = true;
  stage.paid_at = new Date().toISOString();
  saveDB(db);
  res.json(stage);
});

const PORT = process.env.PORT || 3014;
app.listen(PORT, () => {
  console.log(`╔═══════════════════════════════════════════════╗`);
  console.log(`║  🌱 MANIOC INVESTMENT                       ║`);
  console.log(`║  Port: ${PORT}                                  ║`);
  console.log(`║  API: http://localhost:${PORT}/api            ║`);
  console.log(`╚═══════════════════════════════════════════════╝`);
});
