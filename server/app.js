const express = require('express');
const cors = require('cors');
const commissionRoutes = require('../server/routes/commisionRoutes');
const paymentRoutes = require('../server/routes/paymentRoutes');
const penjualanRoutes = require('../server/routes/penjualanRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', commissionRoutes);
app.use('/api', paymentRoutes);
app.use('/api', penjualanRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});