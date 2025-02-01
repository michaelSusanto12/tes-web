const Penjualan = require('../models/penjualan');

const calculateCommission = (omzet) => {
    if (omzet >= 500000000) return { percentage: 10, nominal: omzet * 0.1 };
    if (omzet >= 200000000) return { percentage: 5, nominal: omzet * 0.05 };
    if (omzet >= 100000000) return { percentage: 2.5, nominal: omzet * 0.025 };
    return { percentage: 0, nominal: 0 };
};

exports.getCommissions = async (req, res) => {
    try {
        const salesData = await Penjualan.getSalesByMarketing();

        const commissions = salesData.map(item => {
            const { percentage, nominal } = calculateCommission(item.omzet);
            return {
                marketing: item.marketing_name,
                bulan: item.bulan,
                omzet: item.omzet,
                komisi_persen: percentage,
                komisi_nominal: nominal
            };
        });

        res.json({ success: true, data: commissions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};