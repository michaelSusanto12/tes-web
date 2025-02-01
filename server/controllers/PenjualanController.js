const db = require('../config/database');

exports.createPenjualan = async (req, res) => {
    try {
        const {
            transaction_number,
            marketing_id,
            date,
            cargo_fee,
            total_balance,
            grand_total
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO Penjualan 
      (transaction_number, marketing_id, date, cargo_fee, total_balance, grand_total)
      VALUES (?, ?, ?, ?, ?, ?)`,
            [transaction_number, marketing_id, date, cargo_fee, total_balance, grand_total]
        );

        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                ...req.body
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getMarketings = async (req, res) => {
    try {
        const [marketings] = await db.query('SELECT * FROM Marketing');
        res.json({ success: true, data: marketings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getPenjualan = async (req, res) => {
    try {
        const [penjualan] = await db.query('SELECT * FROM Penjualan');
        res.json({ success: true, data: penjualan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch sales data' });
    }
};