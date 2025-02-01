// models/marketing.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming your database connection is set in config/database.js

const Marketing = sequelize.define('Marketing', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'marketing',
    timestamps: false,  // Set to true if you want to track created_at, updated_at
});

module.exports = Marketing;
