// models/payment.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming your database connection is set in config/database.js

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    penjualan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Penjualan',  // Assuming the Penjualan model (sales) exists
            key: 'id',
        },
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    installment_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('PARTIAL', 'FULL', 'PENDING'),
        allowNull: false,
    },
}, {
    tableName: 'payments',
    timestamps: false,  // Set to true if you want to track created_at, updated_at
});

module.exports = Payment;
