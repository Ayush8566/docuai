require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const docsRoutes = require('./routes/docs');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/docs', docsRoutes);

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log('Server listening on', PORT));
}).catch(err => console.error(err));
