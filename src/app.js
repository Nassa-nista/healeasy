const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const promBundle = require('express-prom-bundle');

const { db } = require('./db');

const authRoutes = require('./routes/auth');
const medRoutes = require('./routes/medications');
const healthRoutes = require('./routes/health');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// Prometheus metrics at /metrics
app.use(
  promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true
  })
);

// routes
app.use('/auth', authRoutes);
app.use('/medications', medRoutes);
app.use('/', healthRoutes);

// 404 + error handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

module.exports = app;
