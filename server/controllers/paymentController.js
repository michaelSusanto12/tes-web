const db = require('../config/database');

exports.createPayment = async (req, res) => {
    try {
        const { penjualan_id, amount, payment_date } = req.body;

        // Validasi input
        if (!penjualan_id || !amount || !payment_date) {
            return res.status(400).json({
                success: false,
                message: 'Semua field harus diisi'
            });
        }

        // Dapatkan grand total
        const [sale] = await db.query(
            'SELECT grand_total FROM Penjualan WHERE id = ?',
            [penjualan_id]
        );

        if (!sale.length) {
            return res.status(404).json({
                success: false,
                message: 'Transaksi tidak ditemukan'
            });
        }

        // Hitung total sudah dibayar
        const [totalPaidResult] = await db.query(
            'SELECT COALESCE(SUM(amount), 0) AS total FROM Pembayaran WHERE penjualan_id = ?',
            [penjualan_id]
        );
        const totalPaid = Number(totalPaidResult[0].total);
        const remaining = sale[0].grand_total - totalPaid;

        // Validasi jumlah
        const paymentAmount = Number(amount);
        if (paymentAmount > remaining) {
            return res.status(400).json({
                success: false,
                message: `Jumlah melebihi sisa saldo (Sisa: Rp${remaining.toLocaleString()})`
            });
        }

        // Simpan pembayaran
        const [result] = await db.query(
            'INSERT INTO Pembayaran (penjualan_id, amount, payment_date, status) VALUES (?, ?, ?, ?)',
            [
                penjualan_id,
                paymentAmount, // Pastikan sebagai number
                payment_date,
                paymentAmount === remaining ? 'PAID' : 'PARTIAL'
            ]
        );

        // Dapatkan sisa terbaru
        const [newTotalPaidResult] = await db.query(
            'SELECT COALESCE(SUM(amount), 0) AS total FROM Pembayaran WHERE penjualan_id = ?',
            [penjualan_id]
        );
        const newRemaining = sale[0].grand_total - Number(newTotalPaidResult[0].total);

        res.json({
            success: true,
            data: {
                id: result.insertId,
                remaining_balance: newRemaining,
                status: paymentAmount === remaining ? 'PAID' : 'PARTIAL'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const { penjualan_id } = req.params;

        // Dapatkan total transaksi dari tabel Penjualan
        const [sale] = await db.query(
            'SELECT grand_total FROM Penjualan WHERE id = ?',
            [penjualan_id]
        );

        if (!sale.length) {
            return res.status(404).json({
                success: false,
                message: 'Transaksi tidak ditemukan'
            });
        }

        // Ambil semua riwayat pembayaran berdasarkan penjualan_id
        const [payments] = await db.query(
            `SELECT id, penjualan_id, payment_date, amount, status
             FROM Pembayaran 
             WHERE penjualan_id = ? 
             ORDER BY payment_date`,
            [penjualan_id]
        );

        // Hitung total pembayaran yang sudah diverifikasi (status "LUNAS")
        const totalVerified = payments
            .filter(payment => payment.status === "LUNAS")
            .reduce((sum, payment) => sum + Number(payment.amount), 0);

        // Hitung total pembayaran secara keseluruhan
        const totalPaid = payments.reduce(
            (sum, payment) => sum + Number(payment.amount),
            0
        );

        const remaining = sale[0].grand_total - totalVerified;

        res.json({
            success: true,
            data: {
                payments: payments.map(p => ({
                    ...p,
                    amount: Number(p.amount), // Konversi ke number
                    status: p.status === "PARTIAL" ? "Belum Diverifikasi" : "Sudah Diverifikasi"
                })),
                total_paid: totalPaid,
                total_verified: totalVerified,
                remaining_balance: remaining,
                grand_total: sale[0].grand_total
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


exports.updatePaymentStatus = async (req, res) => {
    try {
        const paymentId = req.params.id; // Mengambil id dari parameter URL
        const { status } = req.body; // Mengambil status dari body

        // Validasi status
        if (!["PARTIAL", "LUNAS"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status tidak valid"
            });
        }

        // Update status pembayaran di database
        const result = await db.query(
            `UPDATE Pembayaran SET status = ? WHERE id = ?`,
            [status, paymentId] // Gunakan paymentId, bukan id
        );

        // Cek jika tidak ada baris yang diperbarui (misalnya ID tidak ditemukan)
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Pembayaran tidak ditemukan"
            });
        }

        res.json({
            success: true,
            message: "Status pembayaran berhasil diperbarui"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


