const db = require('../config/database');

class Penjualan {
    static async getSalesByMarketing() {
        const [rows] = await db.query(`
      SELECT 
        m.name AS marketing_name,
        DATE_FORMAT(p.date, '%Y-%m') AS bulan,
        SUM(p.grand_total) AS omzet
      FROM Penjualan p
      JOIN Marketing m ON p.marketing_id = m.id
      GROUP BY m.id, DATE_FORMAT(p.date, '%Y-%m')
    `);
        return rows;
    }
}

module.exports = Penjualan;