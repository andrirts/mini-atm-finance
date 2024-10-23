const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Summary = require("./summary.model");

class Partner extends Model {
}

Partner.init({
    id: {
        allowNull: false,
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        allowNull: false,
        type: DataTypes.STRING
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING
    }
}, {
    sequelize: sequelize,
    modelName: 'partner',
    timestamps: true,
})

module.exports = Partner