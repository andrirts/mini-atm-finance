
const sequelize = require("../config/database");
const Client = require("./client.model");
const Partner = require("./partner.model");
const Summary = require("./summary.model");

const syncModels = async () => {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await Client.sync({ alter: true });
    await Summary.sync({ alter: true });
    await Partner.sync({ alter: true });

    Client.hasMany(Summary, { foreignKey: 'client_id' });
    Summary.belongsTo(Client, { foreignKey: 'client_id' });

    console.log("Models created/updated successfully.");
}

module.exports = {
    syncModels
}