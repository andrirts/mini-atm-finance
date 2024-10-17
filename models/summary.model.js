const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Client = require("./client.model");

class Summary extends Model {
}

Summary.init({
    id: {
        allowNull: false,
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    no_batch: {
        allowNull: false,
        type: DataTypes.BIGINT
    },
    date: {
        allowNull: false,
        type: DataTypes.DATE
    },
    client_id: {
        allowNull: false,
        type: DataTypes.BIGINT,
        references: {
            model: 'clients',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    count_transaction: {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    revenue_rts: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0,
    },
    dpp_revenue_rts: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    ppn_revenue_rts: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    pph_revenue_rts: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    total_settlement_revenue_rts: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    fee_rts: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    dpp_fee_rts: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    ppn_fee_rts: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    pph_fee_rts: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    total_settlement_fee_rts: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    fee_ndp: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    dpp_fee_ndp: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    ppn_fee_ndp: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    pph_fee_ndp: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    total_settlement_fee_ndp: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    fee_ads: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    dpp_fee_ads: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    ppn_fee_ads: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    pph_fee_ads: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    total_settlement_fee_ads: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    fee_atmi: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    dpp_fee_atmi: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    ppn_fee_atmi: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    pph_fee_atmi: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    total_settlement_fee_atmi: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    fee_client: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    dpp_fee_client: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    ppn_fee_client: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    pph_fee_client: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    total_fee_client: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    amount_req_cashwithdrawal_client: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
    total_settlement_fee_client: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
    },
}, {
    sequelize: sequelize,
    modelName: 'summary',
    timestamps: true,
})

module.exports = Summary