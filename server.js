
require('dotenv').config();
const express = require('express');
const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const movieRoutes = require('./routes/movieRoutes');

// Middleware global
app.use(express.json());

// Route utama untuk tes
app.get('/', (req, res) => {
    res.send('API Movie berjalan!');
});

// Mounting routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/movies', movieRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`SERVER BERJALAN DI PORT ${PORT}`);
});
