const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import configurations and models
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const matchRoutes = require('./routes/matches');
const adminRoutes = require('./routes/admin');
const outcomeRoutes = require('./routes/outcomes');
const vipRoutes = require('./routes/vip');
const leagueRoutes = require('./routes/leagues');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/outcomes', outcomeRoutes);
app.use('/api/vip', vipRoutes);
app.use('/api/leagues', leagueRoutes);

// Legacy routes for backward compatibility
app.use('/api', authRoutes);
app.use('/api', matchRoutes);
app.use('/api', adminRoutes);
app.use('/api', outcomeRoutes);
app.use('/api', vipRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
