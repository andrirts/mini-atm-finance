const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Summary = require("./summary.model");

class Client extends Model {
}

Client.init({
    id: {
        allowNull: false,
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING
    },
    type_trans: {
        allowNull: false,
        type: DataTypes.STRING
    },
    acq_fee_atmi: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    acq_fee_ads: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    acq_fee_client: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    switching_fee_alto: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    recon_fee_alto: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    beneficiary: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    recon_fee_alto: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    acq_fee_rts: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    acq_fee_ndp: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
}, {
    sequelize: sequelize,
    modelName: 'client',
    timestamps: true,
})

module.exports = Client