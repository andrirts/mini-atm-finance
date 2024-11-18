const Client = require("../models/client.model");
const clientSeeds = require("../seed/seedClient");
const processExcelFileStream = require("../seed/seedUpdatedClient");

class SeedingController {
    static async seedClients(req, res, next) {
        const datas = await processExcelFileStream();
        await Client.bulkCreate(datas);
        return res.status(200).json({ message: 'Clients seeded successfully' })
    }
}

module.exports = SeedingController;