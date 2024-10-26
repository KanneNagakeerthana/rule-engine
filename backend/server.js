// backend/server.js
const express = require('express');
const connectDB = require('./config/db');
const ruleRoutes = require('./routes/ruleRoutes');

const app = express();

// Middleware
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/rules', ruleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
