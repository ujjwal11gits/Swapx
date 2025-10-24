const express = require('express');
require('dotenv').config();
const connectDB = require('./config/connection');
const authRoutes = require('./routes/authentication');
const itemRoutes = require('./routes/item');
const cors = require('cors'); // Add this line

const app = express();

connectDB();


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
